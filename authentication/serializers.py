from django.contrib.auth import update_session_auth_hash

from rest_framework import serializers

from authentication.models import Account


class AuthorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Account
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'gravatar_url', 'has_gravatar', 'title', 'password',
                  'confirm_password', 'org_name')
        read_only_fields = ('created_at', 'updated_at',)

    def create(self, validated_data):
        return Account.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.title = validated_data.get('title', instance.title)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()

        password = validated_data.get('password', None)
        confirm_password = validated_data.get('confirm_password', None)

        if password and confirm_password and password == confirm_password:
            instance.set_password(password)
            instance.save()

        update_session_auth_hash(self.context.get('request'), instance)

        return instance


class SubscriberSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        fields = ('username', 'org_name', 'gravatar_url', 'has_gravatar')


class InvitedSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        fields = ('id', 'username')
