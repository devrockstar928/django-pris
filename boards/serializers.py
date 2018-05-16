from rest_framework import serializers

from authentication.serializers import AuthorSerializer, SubscriberSerializer, InvitedSerializer
from boards.models import Board, InvitedUser


class BoardsSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True, required=False)
    invited_users = InvitedSerializer(read_only=True, required=False, many=True)
    subscriber = SubscriberSerializer(read_only=True, required=False, many=True)

    class Meta:
        model = Board

        fields = ('id', 'author', 'title', 'description', 'invited_users', 'subscriber', 'is_private')
        read_only_fields = ('id', 'created_at', 'updated_at')


class InvitedUserSerializer(serializers.ModelSerializer):
    board = BoardsSerializer(read_only=True, required=False)

    class Meta:
        model = InvitedUser

        fields = ('id', 'board', 'salt', 'email')
        read_only_fields = ('id', 'created_at', 'updated_at')


def create(self, validated_data):
    return Board.objects.create(**validated_data)


def update(self, instance, validated_data):
    instance.title = validated_data.get('title', instance.title)

    instance.save()

    return instance