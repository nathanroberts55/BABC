from django.contrib.auth.models import User
from rest_framework import serializers
from books.models import Book


class BookSerializer(serializers.ModelSerializer):
    is_bookmarked = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    num_likes = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            "id",
            "is_bookmarked",
            "is_liked",
            "num_likes",
            "date_created",
            "date_modified",
            "title",
            "author",
            "isbn",
            "source",
            "submitter",
            "stream_link",
            "amazon_link",
            "approved",
        ]

    def get_is_bookmarked(self, obj):
        user = self.context["request"].user
        if user.is_authenticated:
            return obj.favorites.filter(id=user.id).exists()
        return False

    def get_is_liked(self, obj):
        user = self.context["request"].user
        if user.is_authenticated:
            return obj.likes.filter(id=user.id).exists()
        return False

    def get_num_likes(self, obj):
        return obj.likes.count()


class CreateBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ("title", "author", "isbn", "source", "submitter", "stream_link")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ["password", "first_name", "last_name", "email"]
