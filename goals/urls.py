from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.create_goal, name="create_goal"),
    path("update/", views.update_goal, name="update_goal"),
    path("delete/", views.delete_goal, name="delete_goal"),
    path("add-book/", views.add_book, name="add_book"),
    path("delete-book/<int:id>", views.delete_book, name="delete_book"),
    path("book-search/", views.goal_book_search, name="goal_book_search"),
]
