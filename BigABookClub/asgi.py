"""
ASGI config for BigABookClub project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

settings_module = (
    "BigABookClub.settings.production"
    if os.getenv("DJANGO_ENV") == "production"
    else "BigABookClub.settings.local"
)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)

application = get_asgi_application()
