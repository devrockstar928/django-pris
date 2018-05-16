from django.db import models
from authentication.models import Account


class Board(models.Model):
    author = models.ForeignKey(Account, null=True, blank=True)

    title = models.TextField(null=False, blank=False)
    description = models.TextField(null=True, blank=True, default='')

    invited_users = models.ManyToManyField(Account, related_name='invited_users', blank=True, null=True)
    subscriber = models.ManyToManyField(Account, related_name='subscriber', blank=True, null=True)
    is_private = models.BooleanField(blank=True, default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.title


class InvitedUser(models.Model):
    email = models.EmailField(null=False, blank=False)
    salt = models.CharField(max_length=10, null=False, blank=False, unique=True)
    board = models.ForeignKey(Board, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.salt

