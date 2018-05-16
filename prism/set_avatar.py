import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')

import django
django.setup()

from django_gravatar.helpers import get_gravatar_url, has_gravatar

from authentication.models import Account


def main():

    for user in Account.objects.all():
        print(user.email)
        print(user.first_name[0].upper())
        # if has_gravatar(user.email):
        #     user.gravatar_url = get_gravatar_url(user.email, size=25)
        #     user.has_gravatar = True
        # else:
        #     user.gravatar_url = user.first_name[0].upper() + user.last_name[0].upper()
        #     user.has_gravatar = False

# Start execution here!
if __name__ == '__main__':
    print "Setting Avatar Image..."
    main()
