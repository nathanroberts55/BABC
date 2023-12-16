from django.urls import path
from . import views

urlpatterns = [
    # Main Endpoint
    path("", views.main, name="main"),
    # Book Endpoints
    path("books/", views.ListBooksView.as_view(), name="all_books"),
    path("books/<int:id>", views.SingleBookView.as_view(), name="single_book"),
    path("books/create", views.CreateBookView.as_view(), name="create_book"),
    path("books/bookmarks", views.ListBookmarks.as_view(), name="create_book"),
    path("books/favorite/<int:id>/", views.FavoriteBook.as_view(), name="favorite"),
    path("books/like/<int:id>/", views.LikeBook.as_view(), name="like"),
    # Authentication Endpoints
    path("logout/", views.LogoutView, name="logout"),
    path("user/", views.UserView.as_view(), name="user"),
]
