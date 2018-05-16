from django.core.management.base import BaseCommand
from authentication.models import Account

from django_gravatar.helpers import get_gravatar_url, has_gravatar


class Command(BaseCommand):
    help = 'Closes'

    def handle(self, *args, **options):
        for user in Account.objects.all():
            if has_gravatar(user.email):
                user.gravatar_url = get_gravatar_url(user.email, size=25)
                user.has_gravatar = True
            else:
                user.gravatar_url = user.first_name[:1].upper() + user.last_name[:1].upper()
                user.has_gravatar = False
            user.save()