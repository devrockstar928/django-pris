from rest_framework import serializers

from organizations.models import Organization
from authentication.serializers import AuthorSerializer
from boards.serializers import BoardsSerializer


class OrganizationSerializer(serializers.ModelSerializer):
    users = AuthorSerializer(read_only=True, required=False, many=True)
    boards = BoardsSerializer(read_only=True, required=False, many=True)

    class Meta:
        model = Organization

        fields = ('id', 'title', 'users', 'boards', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
