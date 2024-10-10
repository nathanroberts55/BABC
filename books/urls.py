from django.urls import path
from . import views

urlpatterns = [
    path("recommendations/", views.recommendations, name="recommendations"),
    path("submissions/", views.submissions, name="submissions"),
    path("details/<int:id>/", views.details, name="book_details"),
    path("favorite/<int:id>/", views.favorite_book, name="favorite"),
    path("like/<int:id>/", views.like_book, name="like"),
]
