from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from prism.views import IndexView
from posts.views import AccountPostsViewSet, AccountCommentsViewSet, PostsPostLikeViewSet,\
    PostViewSet, CommentViewSet, PostLikeViewSet, GetOnePostViewSet
from boards.views import BoardsViewSet, BoardsPostViewSet, AccountBoardsViewSet,\
    BoardsBoardViewSet, BoardsPublicBoardViewSet, IsPrivateViewSet, InviteBoardsViewSet, GetUserFromSaltViewSet, AddToBoardViewSet, AllBoardsViewSet, \
    MyBoardsViewSet, CompanyBoardsViewSet, PrivateBoardsViewSet, PublicBoardsViewSet
from organizations.views import OrganizationViewSet, AccountOrganizationViewSet
from prism import settings

from rest_framework_nested import routers
from rest_framework.authtoken import views

from authentication.views import AccountViewSet, AccountWithToken, LoginView, LogoutView

act_router = routers.SimpleRouter()
act_router.register(r'account', AccountWithToken)

router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'posts', PostViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'postlikes', PostLikeViewSet)
router.register(r'boards', BoardsViewSet)
router.register(r'inviteboard', InviteBoardsViewSet)
router.register(r'addtoboard', AddToBoardViewSet)
router.register(r'orgs', OrganizationViewSet)
router.register(r'public_boards', PublicBoardsViewSet)

accounts_router = routers.NestedSimpleRouter(
    router, r'accounts', lookup='account'
)
accounts_router.register(r'posts', AccountPostsViewSet)
accounts_router.register(r'comments', AccountCommentsViewSet)
accounts_router.register(r'orgs', AccountOrganizationViewSet)
accounts_router.register(r'boards', AccountBoardsViewSet)

posts_router = routers.NestedSimpleRouter(
    router, r'posts', lookup='post'
)
posts_router.register(r'postlikes', PostsPostLikeViewSet)
posts_router.register(r'post', GetOnePostViewSet)

boards_router = routers.NestedSimpleRouter(
    router, r'boards', lookup='board'
)
boards_router.register(r'posts', BoardsPostViewSet)
boards_router.register(r'board', BoardsBoardViewSet)
boards_router.register(r'public_board', BoardsPublicBoardViewSet)
boards_router.register(r'is_private', IsPrivateViewSet)
boards_router.register(r'invited_user', GetUserFromSaltViewSet)
boards_router.register(r'all_boards', AllBoardsViewSet)
boards_router.register(r'my_boards', MyBoardsViewSet)
boards_router.register(r'company_boards', CompanyBoardsViewSet)
boards_router.register(r'private_boards', PrivateBoardsViewSet)

urlpatterns = patterns('',
    # Examples:
    #url(r'^$', include('app.urls', namespace='app'), name='app'),
    # url(r'^blog/', include('blog.urls')),
    url('', include('social.apps.django_app.urls', namespace='social')),
    url('', include('password_reset.urls')),
    url('', include('django.contrib.auth.urls', namespace='auth')),
    url(r'^ckeditor/', include('ckeditor.urls')),
    url(r'^media/(.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
    url(r'^grappelli/', include('grappelli.urls')),  # grappelli URLS
    url(r'^admin/', include(admin.site.urls)),
    url(r'^auth/google/', include('google_oauth.urls')),
    url(r'^api-token-auth/', views.obtain_auth_token),
    # ... URLs for auth API
    url(r'^api/', include(act_router.urls)),
    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/ios/', include(router.urls)),
    url(r'^api/v1/', include(accounts_router.urls)),
    url(r'^api/v1/ios/', include(accounts_router.urls)),
    url(r'^api/v1/', include(posts_router.urls)),
    url(r'^api/v1/ios/', include(posts_router.urls)),
    url(r'^api/v1/', include(boards_router.urls)),
    url(r'^api/v1/ios/', include(boards_router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/v1/ios/auth/login/$', LoginView.as_view()),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^api/v1/ios/auth/logout/$', LogoutView.as_view()),

    url(r'^.*$', IndexView.as_view(), name='index'),
)