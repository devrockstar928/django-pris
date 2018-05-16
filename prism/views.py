from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.db.models import Q

from social.apps.django_app.default.models import Code

from boards.models import Board
from organizations.models import Organization
from posts.models import Post


class IndexView(TemplateView):
    template_name = 'index.html'

    def get_template_names(self):
        if self.request.user.is_authenticated():
            return 'index.html'
        else:
            if self.request.get_full_path() == '/':
                return 'home.html'
            if self.request.get_full_path() == '/about':
                return 'home.html'
            if self.request.get_full_path() == '/api':
                return 'home.html'
            else:
                return 'index.html'

    def get_context_data(self, **kwargs):
        # Get the number of boards per user
        queryset = Board.objects.order_by('-created_at')
        queryset = queryset.filter(invited_users__username=self.request.user.username)
        try:
            org = Organization.objects.get(users__username=self.request.user.username)
            queryset1 = org.boards.all()
            queryset = queryset1 | queryset
        except Organization.DoesNotExist:
            queryset = queryset
        board_count = queryset.count()

        # Get the number of posts per user
        queryset = Post.objects.order_by('-created_at')
        board_queryset = Board.objects.order_by('-created_at')

        invited_boards = board_queryset.filter(invited_users__username=self.request.user.username)
        try:
            org = Organization.objects.get(users__username=self.request.user.username)
            boards = org.boards.all()
            all_boards = boards | invited_boards
        except Organization.DoesNotExist:
            all_boards = invited_boards
            pass
        queryset = queryset.filter(Q(author__username=self.request.user.username) | Q(board__in=all_boards.distinct()))
        post_count = queryset.count()

        # Get the organization name of the user
        org_name = ''
        try:
            org = Organization.objects.get(users__username=self.request.user.username)
            org_name = org.title
        except Organization.DoesNotExist:
            pass

        context = super(IndexView, self).get_context_data(**kwargs)

        context.update({'board_count': board_count, 'post_count': post_count, 'org_name': org_name})
        return context

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        response = super(IndexView, self).dispatch(*args, **kwargs)
        self.set_social_cookie(response)
        return response

    def set_social_cookie(self, response):
        backend_name = self.request.session.pop('social_auth_last_login_backend', None)
        if backend_name:
            code = Code.make_code(self.request.user.email)
            response.set_cookie('social_code', code.code)
            response.set_cookie('social_backend', backend_name)
