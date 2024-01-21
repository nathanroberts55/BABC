from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory
from books.models import Book
from api.serializers import (
    BookSerializer,
    ReadingGoalBookSerializer,
    ReadingGoalSerializer,
)
from goals.models import ReadingGoal, ReadingGoalBook


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


class ReadingGoalBookSerializerTestCase(TestCase):
    def setUp(self):
        self.book = ReadingGoalBook.objects.create(
            title="Test Book", author="Test Author", isbn="1234567890"
        )

    def test_reading_goal_book_serializer(self):
        serializer = ReadingGoalBookSerializer(instance=self.book)
        data = serializer.data

        self.assertEqual(data["id"], self.book.id)
        self.assertEqual(data["title"], self.book.title)
        self.assertEqual(data["author"], self.book.author)
        self.assertEqual(data["isbn"], self.book.isbn)


class ReadingGoalSerializerTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = get_user_model().objects.create_user(
            username="test", password="test"
        )
        self.book1 = ReadingGoalBook.objects.create(
            title="Test Book 1", author="Test Author 1", isbn="1234567891"
        )
        self.book2 = ReadingGoalBook.objects.create(
            title="Test Book 2", author="Test Author 2", isbn="1234567892"
        )
        self.goal = ReadingGoal.objects.create(user=self.user, year=2024, goal=2)
        self.goal.books_read.add(self.book1, self.book2)

    def test_reading_goal_serializer(self):
        request = self.factory.get("/")
        request.user = self.user

        serializer_context = {
            "request": request,
        }

        serializer = ReadingGoalSerializer(
            instance=self.goal, context=serializer_context
        )
        data = serializer.data

        self.assertEqual(data["id"], self.goal.id)
        self.assertEqual(data["year"], self.goal.year)
        self.assertEqual(data["goal"], self.goal.goal)
        self.assertEqual(data["num_books_read"], self.goal.books_read.count())
        self.assertEqual(len(data["books_read"]), self.goal.books_read.count())
        for book_data in data["books_read"]:
            self.assertIn(book_data["id"], [self.book1.id, self.book2.id])
