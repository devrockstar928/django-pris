from django.utils.text import slugify

from authentication.models import Account


def real_username(backend, details, user=None, *args, **kwargs):
    if user is None and Account.objects.filter(username=details['username']).exists():
        first_name, last_name = details['first_name'], details['last_name']
        out = {'username': '{0}.{1}'.format(slugify(first_name), slugify(last_name)).lower()}
        details['username'] = out['username']
        return out
