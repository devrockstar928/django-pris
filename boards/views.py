import re
import random
import string
import threading

from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from django.conf import settings
from django.core.mail import send_mail

from boards.models import Board, InvitedUser
from posts.models import Post
from authentication.models import Account
from authentication.serializers import AuthorSerializer
from organizations.models import Organization
from boards.serializers import BoardsSerializer, InvitedUserSerializer
from posts.serializers import PostSerializer
from authentication.utils import token_required
from authentication.permissions import IsAccountOwner


def create_board(board, title, emails, ):
    recipient_list = []
    non_existing_user_list = []
    for email in emails:
        try:
            account = Account.objects.get(email=email)
            board.subscriber.add(account)
            recipient_list.append(email)
        except Account.DoesNotExist:
            non_existing_user_list.append(email)

            salt = ''.join(random.choice(string.digits) for i in range(10))
            invited_user = InvitedUser(email=email, salt=salt, board=board)
            invited_user.save()
            send_mail('You have been added to the board "' + title + '" from prism. ',
                      'Register here to see it: http://' + settings.DOMAIN + '/register/' + salt,
                      settings.EMAIL_HOST_USER,
                      non_existing_user_list,
                      fail_silently=False)
            non_existing_user_list = []
            # instead of causing an exception, this should send out the invite to the registration form that redirects to the board
            # e.g: http://app.prism.io/register/554142142?next=/board/board-id
            pass
    if recipient_list:
        send_mail('You have been subscribed to the board "' + title + '"',
                 'Log in here to see it: http://' + settings.DOMAIN + '/login',
                  settings.EMAIL_HOST_USER,
                  recipient_list,
                  fail_silently=False)


class InviteBoardsViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.order_by('-created_at')
    serializer_class = BoardsSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.IsAuthenticated(), IsAccountOwner(), )

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwner(),)

    @token_required
    def create(self, serializer):
        board_user = self.request.DATA['board_user']
        board_name = self.request.DATA['board_name']
        invite_desc = self.request.DATA['description'] + '\n'
        invited_mails = re.findall(r"[\w.-]+@[\w.-]+", self.request.DATA['invited_user'])
        recipient_list = []
        non_existing_user_list = []
        try:
            board_owner = Account.objects.get(username=board_user)
            boards = Board.objects.filter(author=board_owner)
            for each in boards:
                if "-".join(each.title.lower().split()) == board_name:
                    for invited_mail in invited_mails:
                        try:
                            invited_user = Account.objects.get(email=invited_mail)
                            recipient_list.append(invited_mail)
                            each.invited_users.add(invited_user)
                            send_mail('You have been invited to the board (' + board_name + ') by ' + board_user,
                                      '"' + invite_desc + '"' 'Click here to see it: http://' +
                                      settings.DOMAIN + '/board/' + str(each.id),
                                      settings.EMAIL_HOST_USER,
                                      recipient_list,
                                      fail_silently=False)
                            recipient_list = []
                        except Account.DoesNotExist:
                            non_existing_user_list.append(invited_mail)

                            salt = ''.join(random.choice(string.digits) for i in range(10))
                            user = InvitedUser(email=invited_mail, salt=salt, board=each)
                            user.save()
                            send_mail('You have been invited to the board (' + board_name + ') by ' + board_user,
                                      '"' + invite_desc + '"' + 'Register here to see it: http://' +
                                      settings.DOMAIN + '/register/' + salt,
                                      settings.EMAIL_HOST_USER,
                                      non_existing_user_list,
                                      fail_silently=False)
                            non_existing_user_list = []
            return Response({'status': 'Successfully invited'}, status=status.HTTP_201_CREATED)
        except Account.DoesNotExist:
            return Response({
                'status': 'Bad request',
                'message': 'You can not invite to your own board.'
            }, status=status.HTTP_400_BAD_REQUEST)


class BoardsViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.order_by('-created_at')
    serializer_class = BoardsSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.IsAuthenticated(), IsAccountOwner(), )

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwner(),)

    @token_required
    def create(self, serializer):
        title = self.request.DATA['title']
        description = self.request.DATA['description']
        if self.request.DATA['board_type'] == 'Private':
            board_type = True
        else:
            board_type = False
        boards = Board.objects.filter(title=title).filter(author=self.request.user)
        if not boards:
            serializer = self.serializer_class(data=self.request.DATA)
            if serializer.is_valid():
                board = serializer.save(author=self.request.user, title=title, description=description,
                                        is_private=board_type)
                board.invited_users.add(self.request.user)
                board.subscriber.add(self.request.user)
                if 'subscriber' in self.request.DATA and self.request.DATA['subscriber']:
                    emails = re.findall(r"[\w\.-\.+]+@[\w\.-]+", self.request.DATA['subscriber'])
                    t = threading.Thread(target=create_board, args=(board, title, emails, ))
                    t.start()
                try:
                    org = Organization.objects.get(users__username=self.request.user.username)
                    org.boards.add(board)
                except Organization.DoesNotExist:
                    pass

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({
                'status': 'Bad request',
                'message': 'Board could not be created with received data.'
            }, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                'status': 'Bad request',
                'message': 'Board already exists.'
            }, status=status.HTTP_400_BAD_REQUEST)


class AddToBoardViewSet(viewsets.ViewSet):
    queryset = Board.objects.order_by('-created_at')
    serializer_class = AuthorSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.IsAuthenticated(), IsAccountOwner(), )

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwner(),)

    @token_required
    def create(self, serializer):
        board_id = self.request.DATA['board_id']
        invited_email = self.request.DATA['invited_email']
        is_follow = self.request.DATA['is_follow']
        try:
            account = Account.objects.get(email=invited_email)
            board = Board.objects.get(pk=board_id)
            if is_follow == 1:
                board.subscriber.add(account)
                serializer = self.serializer_class([account], many=True)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                board.subscriber.remove(account)
                serializer = self.serializer_class([account], many=True)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Account.DoesNotExist:
            return Response({
                'status': 'Bad request',
                'message': 'Board could not be created with received data.'
            }, status=status.HTTP_400_BAD_REQUEST)


class BoardsPostViewSet(viewsets.ViewSet):
    queryset = Post.objects.select_related('author').order_by('-created_at')
    serializer_class = PostSerializer

    def list(self, request, board_pk=None):
        queryset = self.queryset.filter(board__id=board_pk)
        serializer = self.serializer_class(queryset.distinct(), many=True)
        data = serializer.data
        return Response(data)


class BoardsBoardViewSet(viewsets.ViewSet):
    queryset = Board.objects.order_by('-created_at')
    serializer_class = BoardsSerializer

    @token_required
    def list(self, request, board_pk=None):
        queryset = self.queryset.filter(id=board_pk)
        serializer = self.serializer_class(queryset.distinct(), many=True)
        return Response(serializer.data)


class BoardsPublicBoardViewSet(viewsets.ViewSet):
    queryset = Board.objects.order_by('-created_at')
    serializer_class = BoardsSerializer

    def list(self, request, board_pk=None):
        queryset = self.queryset.filter(id=board_pk)
        serializer = self.serializer_class(queryset.distinct(), many=True)
        if serializer.data[0]['is_private'] == False:
            return Response(serializer.data)
        else:
            return Response({
                'status': 'Bad request',
            }, status=status.HTTP_400_BAD_REQUEST)


class IsPrivateViewSet(viewsets.ViewSet):
    queryset = Board.objects.order_by('-created_at')
    serializer_class = BoardsSerializer

    def list(self, request, board_pk=None):
        queryset = self.queryset.get(id=board_pk)
        serializer = self.serializer_class(queryset)
        return Response({'is_private': serializer.data['is_private']})


class AccountBoardsViewSet(viewsets.ViewSet):
    queryset = Board.objects.order_by('-created_at')
    serializer_class = BoardsSerializer

    @token_required
    def list(self, request, account_username=None):
        queryset = self.queryset.filter(invited_users__username=account_username)
        try:
            org = Organization.objects.get(users__username=account_username)
            queryset1 = org.boards.all()
            queryset = queryset1 | queryset
        except Organization.DoesNotExist:
            queryset = queryset
        serializer = self.serializer_class(queryset.distinct(), many=True)

        return Response(serializer.data)


class GetUserFromSaltViewSet(viewsets.ViewSet):
    queryset = InvitedUser.objects.order_by('-created_at')
    serializer_class = InvitedUserSerializer

    def list(self, request, board_pk=None):
        queryset = self.queryset.filter(salt=board_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class AllBoardsViewSet(viewsets.ViewSet):
    queryset = Board.objects.order_by('-created_at')
    serializer_class = BoardsSerializer

    @token_required
    def list(self, request, board_pk=None):
        queryset = self.queryset.filter(invited_users__username=board_pk)
        try:
            org = Organization.objects.get(users__username=board_pk)
            queryset = queryset
        except Organization.DoesNotExist:
            queryset = queryset
        serializer = self.serializer_class(queryset.distinct(), many=True)
        data = serializer.data
        return Response(data)


class MyBoardsViewSet(viewsets.ViewSet):
    queryset = Board.objects.order_by('-created_at')
    serializer_class = BoardsSerializer

    @token_required
    def list(self, request, board_pk=None):
        queryset = self.queryset.filter(author__username=board_pk)
        serializer = self.serializer_class(queryset.distinct(), many=True)

        return Response(serializer.data)


class CompanyBoardsViewSet(viewsets.ViewSet):
    queryset = Board.objects.order_by('-created_at')
    serializer_class = BoardsSerializer

    @token_required
    def list(self, request, board_pk=None):
        try:
            org = Organization.objects.get(users__username=board_pk)
            queryset = org.boards.all()
        except Organization.DoesNotExist:
            queryset = []
        serializer = self.serializer_class(queryset.distinct(), many=True)

        return Response(serializer.data)


class PrivateBoardsViewSet(viewsets.ViewSet):
    queryset = Board.objects.order_by('-created_at')
    serializer_class = BoardsSerializer

    @token_required
    def list(self, request, board_pk=None):
        queryset = self.queryset.filter(invited_users__username=board_pk, is_private=True)
        serializer = self.serializer_class(queryset.distinct(), many=True)

        return Response(serializer.data)


class PublicBoardsViewSet(viewsets.ViewSet):
    queryset = Board.objects.order_by('-created_at')
    serializer_class = BoardsSerializer

    def list(self, request):
        queryset = self.queryset.filter(is_private=False)
        serializer = self.serializer_class(queryset.distinct(), many=True)

        return Response(serializer.data)