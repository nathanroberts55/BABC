from django.urls import path
from . import views

urlpatterns = [
    path("profile", views.account_profile, name="account"),
    path("login/", views.account_login, name="login"),
    path("logout/", views.account_logout, name="logout"),
]
