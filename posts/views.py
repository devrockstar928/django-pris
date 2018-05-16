import re
import base64
import threading
from time import time

from django.core.files.storage import default_storage
from django.http import Http404
from django.db.models import Q

from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from django.core.mail import send_mail

from posts.models import Post, Comment, Account, PostLike, PostTag, Tag
from boards.models import Board
from organizations.models import Organization
from posts.serializers import PostSerializer, CommentSerializer, PostLikeSerializer
from authentication.utils import token_required
from prism import settings
from posts.permissions import IsAuthorOfPost, IsAuthorOfComment


def save_to_image(match_obj):
    if re.search(r"data:[\w/\-\.]+;\w+,.*", match_obj) != None:
        filename = "Post%s.png" % str(time()).replace('.', '_')

        try:
            media_file = default_storage.open(filename, 'w')
            media_file.write(base64.b64decode(match_obj[match_obj.index(",")+1:]))
            media_file.close()
            return '<img src="' + settings.MEDIA_URL + filename + '" />'
        except Exception as e:
            print e
            return '<img alt="' + 'Image Upload Issue appears. Please try again.' + '" />'
    else:
        return match_obj.group(0)


def create_post(queryset, board, email):
    for user in queryset:
        if user.email != email:
            recipient_list = []
            recipient_list.append(user.email)
            send_mail('A new post has been added to the board "' + board.title + '".',
                      'http://' + settings.DOMAIN + '/board/' + str(board.id),
                      settings.EMAIL_HOST_USER,
                      recipient_list,
                      fail_silently=False)


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = (IsAuthorOfPost,)

    @token_required
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.IsAuthenticated(), )

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAuthorOfPost(),)

    def list(self, request, *args, **kwargs):
        instance = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(instance)
        if page is not None:
            serializer = self.get_pagination_serializer(page)
        else:
            serializer = self.get_serializer(instance, many=True)
        return Response(serializer.data)
    
    #@csrf_exempt
    @token_required
    def perform_create(self, serializer):
        subscribers = re.findall(r"@[a-zA-Z0-9&._-]*", self.request.DATA['username'])

        image = ''
        for item in self.request.DATA['image']:
            image = image + save_to_image(item)
        description = self.request.DATA['description']
        username = self.request.DATA['username']
        report_link = self.request.DATA['report_link']
        board_id = self.request.DATA['board_id']

        instance = serializer.save(author=self.request.user, image=image, description=description,
                                   username=username, report_link=report_link)
        for subscriber in subscribers:
            try:
                if self.request.user.username != subscriber[1:]:
                    account = Account.objects.get(username=subscriber[1:])
                    instance.subscriber.add(account)
            except Account.DoesNotExist:
                pass

        instance.save()

        hash_tags = re.findall(r"#[a-zA-Z0-9&._-]*", self.request.DATA['description'])
        for hash_tag in hash_tags:
            tag = Tag.objects.get_or_create(name=hash_tag)
            PostTag.objects.create(tag=tag[0], post=instance)

        try:
            board = Board.objects.get(pk=board_id)
            instance.board.add(board)
            queryset = board.subscriber.all()
            t = threading.Thread(target=create_post, args=(queryset.distinct(), board, self.request.user.email, ))
            t.start()

        except Board.DoesNotExist:
            pass

        recipient_list = []
        recipient_list.append(settings.TEAM_EMAIL)
        send_mail('A new post has been created.',
                  'http://' + settings.DOMAIN + '/post/' + str(instance.id) + '',
                  settings.EMAIL_HOST_USER,
                  recipient_list,
                  fail_silently=False)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AccountPostsViewSet(viewsets.ViewSet):
    #queryset = Post.objects.select_related('author')\
    #    .annotate(max_created_at=Max('comment__created_at')).order_by('-max_created_at')
    queryset = Post.objects.order_by('-created_at')
    board_queryset = Board.objects.order_by('-created_at')
    serializer_class = PostSerializer

    @token_required
    def list(self, request, account_username=None):
        invited_boards = self.board_queryset.filter(invited_users__username=account_username)
        try:
            org = Organization.objects.get(users__username=account_username)
            boards = org.boards.all()
            all_boards = boards | invited_boards
        except Organization.DoesNotExist:
            all_boards = invited_boards
            pass
        queryset = self.queryset.filter(Q(author__username=account_username) | Q(board__in=all_boards.distinct()))

        serializer = self.serializer_class(queryset.distinct(), many=True)

        return Response(serializer.data)


class PostLikeViewSet(viewsets.ModelViewSet):
    queryset = PostLike.objects.order_by('created_at')
    serializer_class = PostLikeSerializer
    filter_fields = ('post',)

    @token_required
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.IsAuthenticated(), IsAuthorOfPost(), )

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAuthorOfPost(),)

    def get_queryset(self):
        queryset = super(PostLikeViewSet, self).get_queryset()
        queryset = queryset.filter(author=self.request.user)
        return queryset

    @token_required
    def perform_create(self, serializer):
        try:
            post = Post.objects.get(pk=self.request.DATA['id'])
        except:
            raise Http404

        serializer.save(author=self.request.user, post=post)
        recipient_list = []
        recipient_list.append(post.author.email)
        post_id = str(self.request.DATA['id'])
        print post_id
        send_mail('A new favorite on your post',
                  'The prism user ' + self.request.user.username
                  + ' favorited your post "' + post.description
                  + '". See more: http://' + settings.DOMAIN + '/post/' + post_id,
                  settings.EMAIL_HOST_USER, recipient_list, fail_silently=False)


class PostsPostLikeViewSet(viewsets.ViewSet):
    queryset = PostLike.objects.select_related('author').order_by('-created_at')
    serializer_class = PostLikeSerializer

    @token_required
    def list(self, request, post_pk=None):
        queryset = self.queryset.filter(post__id=post_pk)
        serializer = self.serializer_class(queryset.distinct(), many=True)

        return Response(serializer.data)


class GetOnePostViewSet(viewsets.ViewSet):
    queryset = Post.objects.select_related('author').order_by('-created_at')
    serializer_class = PostSerializer

    @token_required
    def list(self, request, post_pk=None):
        queryset = self.queryset.filter(id=post_pk)
        serializer = self.serializer_class(queryset.distinct(), many=True)

        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.order_by('created_at')
    serializer_class = CommentSerializer
    filter_fields = ('post',)
    permission_classes = (IsAuthorOfComment,)

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.IsAuthenticated(), )

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAuthorOfComment(),)

    def list(self, request, *args, **kwargs):
        instance = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(instance)
        if page is not None:
            serializer = self.get_pagination_serializer(page)
        else:
            serializer = self.get_serializer(instance, many=True)
        return Response(serializer.data)

    @token_required
    def perform_create(self, serializer):
        subscribers = re.findall(r"@[a-zA-Z0-9&._-]*", self.request.DATA['comment'])
        subscriber_list = []
        #comment = re.sub(r"<img.+?src=[\"'](.+?)[\"'].*?>",
        #                                      save_to_image, self.request.DATA['comment'])
        comment = self.request.DATA['comment']
        try:
            post = Post.objects.get(pk=self.request.DATA['post'])
            for subscriber in subscribers:
                try:
                    account = Account.objects.get(username=subscriber[1:])
                    subscriber_list.append(account.email)
                    post.subscriber.add(account)
                except Account.DoesNotExist:
                    pass
            if subscribers:
                post.save()
        except:
            raise Http404

        serializer.save(author=self.request.user, post=post, comment=comment)
        if subscriber_list:
            post_id = str(self.request.DATA['post'])
            send_mail('You were mentioned in the post "' + post.description + '".',
                      'See more: http://' + settings.DOMAIN + '/post/' + post_id,
                      settings.EMAIL_HOST_USER, subscriber_list, fail_silently=False)
        if post.author != self.request.user:
            recipient_list = []
            recipient_list.append(post.author.email)
            post_id = str(self.request.DATA['post'])
            send_mail('A new comment on your post',
                      'The prism user ' + self.request.user.username
                      + ' added the following comment to the post, '
                      + ': "' + comment + '". See more: http://' + settings.DOMAIN + '/post/' + post_id ,
                      settings.EMAIL_HOST_USER, recipient_list, fail_silently=False)


class AccountCommentsViewSet(viewsets.ViewSet):
    queryset = Comment.objects.select_related('author').order_by('-created_at')
    serializer_class = CommentSerializer

    @token_required
    def list(self, request, account_username=None):
        queryset = self.queryset.filter(author__username=account_username)
        serializer = self.serializer_class(queryset.distinct(), many=True)

        return Response(serializer.data)