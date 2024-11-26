from django.contrib.messages import constants as messages
from dotenv import load_dotenv
from pathlib import Path
import os
import logging
from .base import *

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": os.getenv("DJANGO_LOG_LEVEL", "DEBUG"),
        },
    },
}


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ["SECRET_KEY"]

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

RECAPTCHA_PUBLIC_KEY = os.environ["RECAPTCHA_PUBLIC_KEY"]
RECAPTCHA_PRIVATE_KEY = os.environ["RECAPTCHA_PRIVATE_KEY"]

# Configure the domain name using the environment variable
# that Azure automatically creates for us. Included custom domains
ALLOWED_HOSTS = (
    [
        os.environ["SITE_HOSTNAME"],
        os.environ["CUSTOM_DOMAIN_CNAME"],
        os.environ["CUSTOM_DOMAIN_ANAME"],
        ".azurewebsites.net",
    ]
    if "WEBSITE_HOSTNAME" in os.environ
    else []
)

CSRF_TRUSTED_ORIGINS = (
    [
        "https://" + os.environ["SITE_HOSTNAME"],
        "https://" + os.environ["CUSTOM_DOMAIN_CNAME"],
        "https://" + os.environ["CUSTOM_DOMAIN_ANAME"],
    ]
    if "SITE_HOSTNAME" in os.environ
    else []
)


# Social Auth for PostgreSQL
SOCIAL_AUTH_JSONFIELD_ENABLED = True

# Configure Postgres database based on connection string of the libpq Keyword/Value form
# https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING
conn_str = os.environ["AZURE_POSTGRESQL_CONNECTIONSTRING"]
conn_str_params = {
    pair.split("=")[0]: pair.split("=")[1] for pair in conn_str.split(" ")
}

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "OPTIONS": {"sslmode": conn_str_params["sslmode"]},
        "NAME": conn_str_params["dbname"],
        "HOST": conn_str_params["host"],
        "USER": conn_str_params["user"],
        "PASSWORD": conn_str_params["password"],
        "PORT": conn_str_params["port"],
    },
}

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "/static/"
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]

STATICFILES_FINDERS = [
    "compressor.finders.CompressorFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
    "django.contrib.staticfiles.finders.FileSystemFinder",
]

STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

STATICFILES_STORAGE = "BigABookClub.storage.WhiteNoiseStaticFilesStorage"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# SCSS/SASS Configuration Settings

# COMPRESS_PRECOMPILERS = (("text/css", "django_libsass.SassCompiler"),)
# COMPRESS_ROOT = STATIC_ROOT
# COMPRESS_OFFLINE = True
# LIBSASS_OUTPUT_STYLE = "compressed"
