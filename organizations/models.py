from django.db import models

from boards.models import Board
from authentication.models import Account


class Organization(models.Model):
    title = models.TextField(null=False, blank=False)
    users = models.ManyToManyField(Account, related_name='organization', blank=True, null=True)
    boards = models.ManyToManyField(Board, related_name='organization_boards', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.title

    @classmethod
    def create(cls, creator, title):
        org = cls(creator=creator, title=title)
        return org