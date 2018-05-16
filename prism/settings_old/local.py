# settings/local.py
from prism.settings.base import *
DEBUG = True
TEMPLATE_DEBUG = DEBUG

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
         'NAME': 'prism',
         'USER': 'abreckler',
         'PASSWORD': 'theriver24',
         'HOST': '127.0.0.1',
         'PORT': '5432',
    }
}
