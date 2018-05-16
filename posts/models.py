from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.conf import settings
from django.core.mail import send_mail

from authentication.models import Account
from boards.models import Board


class Post(models.Model):
    author = models.ForeignKey(Account)
    subscriber = models.ManyToManyField(Account, related_name='post_subscribers', blank=True, null=True)
    board = models.ManyToManyField(Board, related_name='post_board', blank=True, null=True)

    title = models.TextField(null=True, blank=True)
    image = models.TextField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    username = models.TextField(null=True, blank=True)
    report_link = models.TextField(null=True, blank=True)
    post_type = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.title or u''


class Comment(models.Model):
    author = models.ForeignKey(Account)
    post = models.ForeignKey(Post)

    comment = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.comment


class PostLike(models.Model):
    author = models.ForeignKey(Account)
    post = models.ForeignKey(Post)

    created_at = models.DateTimeField(auto_now_add=True)


class Tag(models.Model):
    name = models.TextField(null=True, blank=True, max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.name


class PostTag(models.Model):
    post = models.ForeignKey(Post)
    tag = models.ForeignKey(Tag)

    created_at = models.DateTimeField(auto_now_add=True)