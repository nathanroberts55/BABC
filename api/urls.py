from django.urls import path
from . import views

urlpatterns = [
    # Main Endpoint
    path("", views.main, name="main"),
    # Book Endpoints
    path("books/", views.ListBooksView.as_view(), name="all_books"),
    path("books/<int:id>", views.SingleBookView.as_view(), name="single_book"),
    path("books/create", views.CreateBookView.as_view(), name="create_book"),
    path("books/bookmarks", views.ListBookmarks.as_view(), name="bookmarks"),
    path("books/favorite/<int:id>/", views.FavoriteBook.as_view(), name="favorite"),
    path("books/like/<int:id>/", views.LikeBook.as_view(), name="like"),
    # Reading Goal Endpoints
    path("goals/has_goal/", views.ReadingGoalView.as_view(), name="has_accepted"),
    path("goals/details/", views.ReadingGoalView.as_view(), name="goal_details"),
    path(
        "goals/update_goal/", views.UpdateReadingGoalView.as_view(), name="update_goal"
    ),
    path(
        "goals/create_goal/", views.CreateReadingGoalView.as_view(), name="create_goal"
    ),
    path("goals/books/", views.UserReadingGoalBooksView.as_view(), name="goal_books"),
    path("goals/add_book/", views.AddReadingGoalBookView.as_view(), name="add_book"),
    # Authentication Endpoints
    path("logout/", views.LogoutView, name="logout"),
    path("user/", views.UserView.as_view(), name="user"),
]
