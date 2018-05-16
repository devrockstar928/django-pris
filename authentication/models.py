from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils.translation import ugettext_lazy as _

from django.conf import settings
from django.contrib.auth.models import BaseUserManager
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django_gravatar.helpers import get_gravatar_url, has_gravatar


class AccountManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError('Users must have a valid email address.')

        if not kwargs.get('username'):
            raise ValueError('Users must have a valid username.')

        if not kwargs.get('first_name'):
            raise ValueError('Users must have a valid first name.')

        if not kwargs.get('last_name'):
            raise ValueError('Users must have a valid last name.')

        first_name = kwargs.get('first_name')
        last_name = kwargs.get('last_name')
        if has_gravatar(email):
            gravatar_url = get_gravatar_url(email, size=25)
            has_gravatar_1 = True
        else:
            gravatar_url = first_name[:1].upper() + last_name[:1].upper()
            has_gravatar_1 = False

        account = self.model(
            email=self.normalize_email(email), username=kwargs.get('username'), first_name=kwargs.get('first_name'),
            last_name=kwargs.get('last_name'), gravatar_url=gravatar_url, has_gravatar=has_gravatar_1
        )

        account.set_password(password)
        account.save()

        return account

    def create_superuser(self, email, password, **kwargs):
        account = self.create_user(email, password, **kwargs)

        account.is_admin = True
        account.is_active = True
        account.is_staff = True
        account.is_superuser = True
        account.save()

        return account


class Account(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=40, unique=True)

    first_name = models.CharField(max_length=40, blank=True)
    last_name = models.CharField(max_length=40, blank=True)
    title = models.CharField(max_length=140, blank=True)

    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(_('staff status'), default=False,
        help_text=_('Designates whether the user can log into this admin '
                    'site.'))

    is_active = models.BooleanField(_('active'), default=True,
        help_text=_('Designates whether this user should be treated as '
                    'active. Unselect this instead of deleting accounts.'))
    gravatar_url = models.TextField(blank=True, default='')
    has_gravatar = models.BooleanField(blank=True, default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __unicode__(self):
        return self.email

    def get_full_name(self):
        return ' '.join([self.first_name, self.last_name])

    def get_short_name(self):
        return self.first_name

    @property
    def org_name(self):
        try:
            return self.organization.select_related()[0].title
        except:
            return ''


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)