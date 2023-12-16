from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("books/recommendations/", views.index, name="recommendations"),
    path("books/submissions/", views.index, name="submissions"),
    path("books/details/<int:id>/", views.index, name="book_details"),
    path("accounts/", views.index, name="account"),
]
