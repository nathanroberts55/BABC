"""
URL configuration for BigABookClub project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import TemplateView
from django.conf.urls import handler404, handler403, handler500
import home
import books
import accounts
import frontend

handler404 = "frontend.views.custom_404"
handler403 = "frontend.views.custom_403"
handler500 = "frontend.views.custom_500"

urlpatterns = [
    path("admin/", admin.site.urls),
    # path("", include("home.urls")),
    # path("books/", include("books.urls")),
    # path("accounts/", include("accounts.urls")),
    path("", include("social_django.urls", namespace="social")),
    path("", include("frontend.urls")),
    path("api/", include("api.urls")),
    path(
        "robots.txt",
        TemplateView.as_view(template_name="robots.txt", content_type="text/plain"),
    ),
]
