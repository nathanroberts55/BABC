from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory
from books.models import Book
from api.serializers import BookSerializer


class BookSerializerTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = get_user_model().objects.create_user(
            username="test", password="test"
        )
        self.book = Book.objects.create(
            title="Test Book", author="Test Author", submitter=self.user
        )

    def test_book_serializer(self):
        request = self.factory.get("/")
        request.user = self.user

        serializer_context = {
            "request": request,
        }

        serializer = BookSerializer(instance=self.book, context=serializer_context)
        data = serializer.data

        self.assertEqual(data["id"], self.book.id)
        self.assertEqual(data["title"], self.book.title)
        self.assertEqual(data["author"], self.book.author)
        self.assertEqual(data["submitter"], self.user.username)
