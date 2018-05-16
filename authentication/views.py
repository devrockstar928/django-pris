import json

from django.contrib.auth import authenticate, login, logout

from rest_framework import permissions, status, views, viewsets
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from social.apps.django_app.default.models import Code
from social.backends.slack import SlackOAuth2
from social.backends.google import GoogleOAuth2
from social.backends.twitter import TwitterOAuth

from authentication.permissions import IsAccountOwner
from authentication.models import Account
from authentication.serializers import AuthorSerializer
from organizations.models import Organization
from authentication.utils import token_required, json_response

SOCIAL_BACKENDS = {
    SlackOAuth2.name: SlackOAuth2,
    GoogleOAuth2.name: GoogleOAuth2,
    TwitterOAuth.name: TwitterOAuth
}


class AccountViewSet(viewsets.ModelViewSet):
    lookup_field = 'username'
    queryset = Account.objects.all()
    serializer_class = AuthorSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.IsAuthenticated(), IsAccountOwner(), )

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwner(),)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            account = Account.objects.create_user(**serializer.validated_data)
            try:
                org, created = Organization.objects.get_or_create(title=request.data['company'])
                org.users.add(account)
            except KeyError, e:
                pass
            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)


class AccountWithToken(viewsets.ViewSet):
    queryset = Account.objects.all()
    serializer_class = AuthorSerializer

    @token_required
    def list(self, request, username=None):
        auth_header = request.META.get('HTTP_AUTHORIZATION', None)
        if auth_header is not None:
            tokens = auth_header.split(' ')
            if len(tokens) == 2 and tokens[0] == 'Token':
                token = tokens[1]
                try:
                    account = Token.objects.get(key=token)
                except Token.DoesNotExist:
                    return json_response({
                        'error': 'Token not found'
                    }, status=401)
        queryset = self.queryset.get(pk=account.user.id)
        serializer = self.serializer_class(queryset)
        data = serializer.data
        data.update({'token': token})
        return Response(data)


class LoginView(views.APIView):
    def account_from_social_code(self, code):
        code = Code.get_code(code)
        return Account.objects.get(email=code.email)

    def post(self, request, format=None):
        data = json.loads(request.body)

        email = data.get('email', None)
        password = data.get('password', None)
        code = data.get('code', None)
        backend_name = data.get('backend', None)

        if code and backend_name and backend_name in SOCIAL_BACKENDS:
            # finish login process after social-auth authentication, ensure
            # that the account instance has the neede "backend" attribute set
            # to the authentication backend
            account = self.account_from_social_code(code)
            backend_class = SOCIAL_BACKENDS.get(backend_name)
            account.backend = '{0}.{1}'.format(backend_class.__module__, backend_class.__name__)
        else:
            account = authenticate(email=email, password=password)

        if account is not None:
            if account.is_active:
                login(request, account)
                serialized = AuthorSerializer(account)
                result = serialized.data.copy()

                token = Token.objects.get_or_create(user=account)
                result['token'] = token[0].key
                return Response(result)
            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'This account has been disabled.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    @token_required
    def post(self, request, format=None):
        logout(request)
        response = Response({}, status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie('social_code')
        response.delete_cookie('social_backend')
        return response
