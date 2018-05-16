from prism.settings.base import *
INSTALLED_APPS += ("gunicorn",)

# Parse database configuration from $DATABASE_URL
import dj_database_url
DATABASES = {'default': dj_database_url.config(default='postgres://localhost')}