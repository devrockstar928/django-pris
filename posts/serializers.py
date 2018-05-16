from rest_framework import serializers

from authentication.serializers import AuthorSerializer, SubscriberSerializer
from boards.serializers import BoardsSerializer
from posts.models import Post, Comment, PostLike


class PostSerializer(serializers.ModelSerializer):
    author = SubscriberSerializer(read_only=True, required=False)
    board = BoardsSerializer(read_only=True, required=False, many=True)

    class Meta:
        model = Post

        fields = ('id', 'author', 'board', 'subscriber', 'image', 'description', 'username',
                  'report_link', 'created_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(PostSerializer, self).get_validation_exclusions()

        return exclusions + ['author']


class PostLikeSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True, required=False)
    post = PostSerializer(read_only=True, required=False)

    class Meta:
        model = PostLike

        fields = ('id', 'post', 'author', 'created_at')
        read_only_fields = ('id', 'created_at')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(PostLikeSerializer, self).get_validation_exclusions()

        return exclusions + ['author', 'post']


class CommentSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True, required=False)
    post = PostSerializer(read_only=True, required=False)

    class Meta:
        model = Comment

        fields = ('id', 'post', 'author', 'comment', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(CommentSerializer, self).get_validation_exclusions()

        return exclusions + ['author', 'post']