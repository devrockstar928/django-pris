"""
Django settings for prism project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'ki%u@2-)$u$ug-6ysca08nba^7)j#0yj_60^k#ppgzxeduzg&x'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []

ROOT_PATH = os.path.dirname(__file__)

TEMPLATE_DIRS = (    
    os.path.join(ROOT_PATH, 'templates'),
)

COMPRESS_ENABLED = os.environ.get('COMPRESS_ENABLED', True)

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
#        'rest_framework.authentication.SessionAuthentication',
#        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ),
    'DEFAULT_FILTER_BACKENDS': ('rest_framework.filters.DjangoFilterBackend',),
    'DEFAULT_PERMISSION_CLASSES': (
       'rest_framework.permissions.AllowAny',
    ),
    'DEFAULT_PARSER_CLASSES': (
        'rest_framework.parsers.JSONParser',
    )
}

# Application definition


INSTALLED_APPS = (
    'grappelli',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'social.apps.django_app.default',
    'storages',
    'authentication',
    'compressor',
    'rest_framework',
    'rest_framework.authtoken',
    'posts',
    'ckeditor',
    'organizations',
    'boards',
    'djrill',
    'django_gravatar',
    'password_reset'
)

TEMPLATE_CONTEXT_PROCESSORS = (
   'django.contrib.auth.context_processors.auth',
   'django.core.context_processors.debug',
   'django.core.context_processors.i18n',
   'django.core.context_processors.media',
   'django.core.context_processors.static',
   'django.core.context_processors.tz',
   "django.core.context_processors.request",
   'django.contrib.messages.context_processors.messages',
   'social.apps.django_app.context_processors.backends',
   'social.apps.django_app.context_processors.login_redirect',
)

AUTHENTICATION_BACKENDS = (
   'social.backends.facebook.FacebookOAuth2',
   'social.backends.google.GoogleOAuth2',
   'social.backends.twitter.TwitterOAuth',
   'social.backends.slack.SlackOAuth2',
   'django.contrib.auth.backends.ModelBackend',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    #'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'prism.middlewares.BasicAuthenticationMiddleware',
)

SOCIAL_AUTH_PIPELINE = (
    'social.pipeline.social_auth.social_details',
    'social.pipeline.social_auth.social_uid',
    'social.pipeline.social_auth.auth_allowed',
    'social.pipeline.social_auth.social_user',
    'authentication.pipeline.real_username',
    'social.pipeline.user.get_username',
    'social.pipeline.social_auth.associate_by_email',
    'social.pipeline.user.create_user',
    'social.pipeline.social_auth.associate_user',
    'social.pipeline.social_auth.load_extra_data',
    'social.pipeline.user.user_details',
    'organizations.pipeline.user_organization'
)

SOCIAL_AUTH_USER_FIELDS = ['username', 'email', 'first_name', 'last_name']
SOCIAL_AUTH_LOGIN_REDIRECT_URL = '/login'

# Google Analytics Auth Production #
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = '1002461965243-ufoo0kjp2l473m61jpg60hocl2oeok6f.apps.googleusercontent.com'
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = '0SGibgWMM2n36tM1qgAMNt8B'
SOCIAL_AUTH_GOOGLE_OAUTH2_IGNORE_DEFAULT_SCOPE = True

SOCIAL_AUTH_SLACK_KEY = '3466559347.4504137086'
SOCIAL_AUTH_SLACK_SECRET = 'a2629d81613ec72d0b586f776d742b9f'

SOCIAL_AUTH_TWITTER_KEY = 'MSf9P85jtHiPtkJ7AOTyp8tiZ'
SOCIAL_AUTH_TWITTER_SECRET = 'om1G3ZOckiuqk15QB7yEjEqAXG8NGVY59P1wVtrrMcHtnSTp9'

###

SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
    #'https://www.googleapis.com/auth/analytics.readonly',
    #'https://www.googleapis.com/auth/analytics.manage.users'
]
SOCIAL_AUTH_GOOGLE_OAUTH2_AUTH_EXTRA_ARGUMENTS = {
 #   'access_type': 'offline',
 #   'approval_prompt': 'force'
}
# End Google Analytics Auth #

ROOT_URLCONF = 'prism.urls'

WSGI_APPLICATION = 'prism.wsgi.application'

LOGIN_REDIRECT_URL = '/'

LOGOUT_REDIRECT_URL = '/'

# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"
STATIC_ROOT = ''
STATIC_URL = '/static/'

# MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
# MEDIA_URL = '/media/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
    #PROJECT_ROOT + '/static/',
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
)
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

# Parse database configuration from $DATABASE_URL
import dj_database_url
DATABASES = {'default': dj_database_url.config(default='postgres://localhost')}

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Allow all host headers
ALLOWED_HOSTS = ['*']

AUTH_USER_MODEL = 'authentication.Account'

# Static asset configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# EMAIL_HOST_USER = os.environ['SENDGRID_USERNAME']
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
# EMAIL_HOST_PASSWORD = os.environ['SENDGRID_PASSWORD']

# HTTP Authentication for Alpha #
#BASIC_WWW_AUTHENTICATION_USERNAME = "alpha"
#BASIC_WWW_AUTHENTICATION_PASSWORD = "bravo"
#BASIC_WWW_AUTHENTICATION = True

SITE_ID = 1

AWS_STORAGE_BUCKET_NAME = "images.prism.io"
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto.S3BotoStorage'
DEFAULT_REGION = "us-west-1"
MEDIA_URL = "http://%s.s3.amazonaws.com/" % AWS_STORAGE_BUCKET_NAME
MEDIA_ROOT = ''
AWS_ACCESS_KEY_ID = "AKIAII7ITSESUU6MPKFA"
AWS_SECRET_ACCESS_KEY = "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"

CKEDITOR_UPLOAD_PATH = "uploads/"

CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'full',
        'height': 300,
        'width': 455,
        "removePlugins": "stylesheetparser",
    },
}

MANDRILL_API_KEY = "_FHwmvtVBLcpv7xnNvfYbw"
EMAIL_BACKEND = "djrill.mail.backends.djrill.DjrillBackend"
EMAIL_HOST_USER = "hello@prism.io"

DOMAIN = 'app.prism.io'
TEAM_EMAIL = 'team@prism.io'

try:
    from local_settings import *
except ImportError as e:
    pass
    



