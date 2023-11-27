from django.urls import path
from . import views

urlpatterns = [
    path("", views.main, name="main"),
    path("books/", views.BookView.as_view(), name="books"),
]
