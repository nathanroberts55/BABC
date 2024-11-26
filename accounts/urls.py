from django.urls import path
from . import views

urlpatterns = [
    path("profile", views.account_profile, name="profile"),
    path("logout/", views.account_logout, name="logout"),
]
