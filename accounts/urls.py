from django.urls import path
from . import views

urlpatterns = [
    path("", views.account_profile, name="account"),
    path("register/", views.account_register, name="register"),
    path("login/", views.account_login, name="login"),
    path("logout/", views.account_logout, name="logout"),
]
