from django.urls import path
from . import views

urlpatterns = [
    path("", views.main, name="main"),
    path("books/", views.BookView.as_view(), name="books"),
    path("books/create", views.CreateBookView.as_view(), name="create_book"),
]
