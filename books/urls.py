from django.urls import path
from . import views

urlpatterns = [
    path("recommendations/", views.recommendations, name="recommendations"),
    path("submissions/", views.submissions, name="submissions"),
    path("details/<int:id>/", views.details, name="book_details"),
]
