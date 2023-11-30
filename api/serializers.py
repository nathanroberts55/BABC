from django.contrib.auth.models import User
from rest_framework import serializers
from books.models import Book


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = "__all__"


class CreateBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ("title", "author", "isbn", "source", "submitter", "stream_link")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ["password", "first_name", "last_name", "email"]
