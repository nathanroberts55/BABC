from django.http import Http404
from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from rest_framework.test import force_authenticate
from unittest.mock import Mock
from books.models import Book
from django.utils.timezone import now
from rest_framework.test import APIClient
from rest_framework import status
from api.views import (
    AddReadingGoalBookView,
    CreateBookView,
    CreateReadingGoalView,
    CurrentlyReadingBook,
    DeleteReadingGoalBookView,
    DeleteReadingGoalView,
    FavoriteBook,
    ListBookmarks,
    ListBooksView,
    SingleBookView,
    ReadingGoalView,
    UpdateReadingGoalView,
    UserReadingGoalBooksView,
)
from goals.models import ReadingGoal, ReadingGoalBook
import json


class ListBooksViewTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = get_user_model().objects.create_user(
            username="test", password="test"
        )
        self.book = Book.objects.create(
            title="Test Book",
            author="Test Author",
            submitter=self.user,
            approved=True,
            isbn="1234567890",
            source="Test Source",
            stream_link="http://teststreamlink.com",
            amazon_link="http://testamazonlink.com",
        )
        self.book.favorites.add(self.user)
        self.book.likes.add(self.user)

    def test_list_books_view(self):
        request = self.factory.get("/api/books/")
        force_authenticate(request, user=self.user)
        view = ListBooksView.as_view()
        response = view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.book.id)
        self.assertEqual(response.data[0]["title"], self.book.title)
        self.assertEqual(response.data[0]["author"], self.book.author)
        self.assertEqual(response.data[0]["isbn"], self.book.isbn)
        self.assertEqual(response.data[0]["source"], self.book.source)
        self.assertEqual(response.data[0]["submitter"], self.book.submitter.username)
        self.assertEqual(response.data[0]["stream_link"], self.book.stream_link)
        self.assertEqual(response.data[0]["amazon_link"], self.book.amazon_link)
        self.assertEqual(response.data[0]["approved"], self.book.approved)
        self.assertEqual(
            response.data[0]["is_bookmarked"],
            self.book.favorites.filter(id=self.user.id).exists(),
        )
        self.assertEqual(
            response.data[0]["is_liked"],
            self.book.likes.filter(id=self.user.id).exists(),
        )
        self.assertEqual(response.data[0]["num_likes"], self.book.likes.count())


class SingleBookViewTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = get_user_model().objects.create_user(
            username="test", password="test"
        )
        self.book = Book.objects.create(
            title="Test Book",
            author="Test Author",
            submitter=self.user,
            approved=True,
            isbn="1234567890",
            source="Test Source",
            stream_link="http://teststreamlink.com",
            amazon_link="http://testamazonlink.com",
        )
        self.book.favorites.add(self.user)
        self.book.likes.add(self.user)

    def test_single_book_view(self):
        request = self.factory.get(f"/api/books/{self.book.id}/")
        force_authenticate(request, user=self.user)
        view = SingleBookView.as_view()
        response = view(request, id=self.book.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], self.book.id)
        self.assertEqual(response.data["title"], self.book.title)
        self.assertEqual(response.data["author"], self.book.author)
        self.assertEqual(response.data["isbn"], self.book.isbn)
        self.assertEqual(response.data["source"], self.book.source)
        self.assertEqual(response.data["submitter"], self.book.submitter.username)
        self.assertEqual(response.data["stream_link"], self.book.stream_link)
        self.assertEqual(response.data["amazon_link"], self.book.amazon_link)
        self.assertEqual(response.data["approved"], self.book.approved)
        self.assertEqual(
            response.data["is_bookmarked"],
            self.book.favorites.filter(id=self.user.id).exists(),
        )
        self.assertEqual(
            response.data["is_liked"], self.book.likes.filter(id=self.user.id).exists()
        )
        self.assertEqual(response.data["num_likes"], self.book.likes.count())
        # Add more assertions here for the other fields


class CreateBookViewTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = get_user_model().objects.create_user(
            username="test", password="test"
        )
        self.book_data = {
            "title": "Test Book",
            "author": "Test Author",
            "isbn": "1234567890",
            "source": "CHAT",
            "submitter": f"{self.user.username}",
            "stream_link": "http://teststreamlink.com",
        }

    def test_create_book_view(self):
        request = self.factory.post("/api/books/create/", self.book_data)
        force_authenticate(request, user=self.user)
        view = CreateBookView.as_view()
        response = view(request)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["title"], self.book_data["title"])
        self.assertEqual(response.data["author"], self.book_data["author"])
        self.assertEqual(response.data["isbn"], self.book_data["isbn"])
        self.assertEqual(response.data["source"], self.book_data["source"])
        self.assertEqual(response.data["submitter"], self.book_data["submitter"])
        self.assertEqual(response.data["stream_link"], self.book_data["stream_link"])
        # Add more assertions here for the other fields


class ListBookmarksTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = get_user_model().objects.create_user(
            username="test", password="test"
        )
        self.book = Book.objects.create(
            title="Test Book",
            author="Test Author",
            submitter=self.user,
            approved=True,
            isbn="1234567890",
            source="Test Source",
            stream_link="http://teststreamlink.com",
            amazon_link="http://testamazonlink.com",
        )
        self.book.favorites.add(self.user)
        self.book.likes.add(self.user)

    def test_list_bookmarks(self):
        request = self.factory.get("/api/bookmarks/")
        force_authenticate(request, user=self.user)
        view = ListBookmarks.as_view()
        response = view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.book.id)
        self.assertEqual(response.data[0]["title"], self.book.title)
        self.assertEqual(response.data[0]["author"], self.book.author)
        self.assertEqual(response.data[0]["isbn"], self.book.isbn)
        self.assertEqual(response.data[0]["source"], self.book.source)
        self.assertEqual(response.data[0]["submitter"], self.book.submitter.username)
        self.assertEqual(response.data[0]["stream_link"], self.book.stream_link)
        self.assertEqual(response.data[0]["amazon_link"], self.book.amazon_link)
        self.assertEqual(response.data[0]["approved"], self.book.approved)
        self.assertEqual(
            response.data[0]["is_bookmarked"],
            self.book.favorites.filter(id=self.user.id).exists(),
        )
        self.assertEqual(
            response.data[0]["is_liked"],
            self.book.likes.filter(id=self.user.id).exists(),
        )
        self.assertEqual(response.data[0]["num_likes"], self.book.likes.count())
        # Add more assertions here for the other fields


class FavoriteBookTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = get_user_model().objects.create_user(
            username="test", password="test"
        )
        self.book = Book.objects.create(
            title="Test Book",
            author="Test Author",
            submitter=self.user,
            approved=True,
            isbn="1234567890",
            source="Test Source",
            stream_link="http://teststreamlink.com",
            amazon_link="http://testamazonlink.com",
        )

    def test_favorite_book(self):
        request = self.factory.post(f"/api/books/{self.book.id}/favorite/")
        force_authenticate(request, user=self.user)
        view = FavoriteBook.as_view()
        response = view(request, id=self.book.id)
        self.assertEqual(response.status_code, 204)
        self.assertTrue(self.book.favorites.filter(id=self.user.id).exists())


class CurrentlyReadingBookTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_currently_reading_book(self):
        book = Book.objects.create(
            title="Test Book",
            author="Test Author",
            submitter="Test User",
            approved=True,
            currently_reading=True,
            isbn="1234567890",
            source="Test Source",
            stream_link="http://teststreamlink.com",
            amazon_link="http://testamazonlink.com",
        )

        request = self.factory.get("/api/books/currently_reading/")
        view = CurrentlyReadingBook.as_view()
        response = view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["title"], "Test Book")

        book.currently_reading = False
        book.save()

        request = self.factory.get("/api/books/currently_reading/")
        view = CurrentlyReadingBook.as_view()
        response = view(request)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(
            response.data["detail"],
            "The Book Club does not currently have a Book they are reading as a group",
        )


# Reading Goals
class ReadingGoalViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = get_user_model().objects.create_user(
            username="testuser", password="testpass"
        )
        self.view = ReadingGoalView.as_view()
        self.client = APIClient()
        ReadingGoal.objects.create(user=self.user, year=now().year)  # Add this line

    def test_get_reading_goal(self):
        self.client.login(username="testuser", password="testpass")
        request = self.factory.get("/api/goals/details/")
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("num_books_read", response.data)
        self.assertIn("books_read", response.data)

    def test_no_reading_goal(self):
        self.client.login(username="testuser", password="testpass")
        ReadingGoal.objects.filter(
            user=self.user, year=now().year
        ).delete()  # Add this line
        request = self.factory.get("/api/goals/has_goal/")
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"has_goal": False})


class UpdateReadingGoalViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = get_user_model().objects.create_user(
            username="testuser", password="testpass"
        )
        self.view = UpdateReadingGoalView.as_view()
        self.client = APIClient()
        ReadingGoal.objects.create(
            user=self.user, year=now().year, goal=10
        )  # Add a goal

    def test_patch_reading_goal(self):
        self.client.login(username="testuser", password="testpass")
        data = {"goal": 20}  # Update the goal
        request = self.factory.patch(
            "/api/goals/update_goal/",
            data=json.dumps(data),
            content_type="application/json",
        )  # Specify content type and convert data to JSON
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        self.assertEqual(
            response.data["goal"], data["goal"]
        )  # Check if the goal is updated


class CreateReadingGoalViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = get_user_model().objects.create_user(
            username="testuser", password="testpass"
        )
        self.view = CreateReadingGoalView.as_view()
        self.client = APIClient()

    def test_post_reading_goal(self):
        self.client.login(username="testuser", password="testpass")
        request = self.factory.post(
            "/api/goals/create_goal/",
            content_type="application/json",
        )
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["goal"], 0)  # Check if the goal is created


class DeleteReadingGoalViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = get_user_model().objects.create_user(
            username="testuser", password="testpass"
        )
        self.view = DeleteReadingGoalView.as_view()
        self.client = APIClient()
        self.goal = ReadingGoal.objects.create(
            user=self.user, year=now().year, goal=10
        )  # Add a goal

    def test_delete_reading_goal(self):
        self.client.login(username="testuser", password="testpass")
        request = self.factory.delete(f"/api/goals/delete_goal/{self.goal.pk}/")
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.goal.pk)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {"has_goal": False}
        )  # Check if the goal is deleted


class UserReadingGoalBooksViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = get_user_model().objects.create_user(
            username="testuser", password="testpass"
        )
        self.view = UserReadingGoalBooksView.as_view()
        self.client = APIClient()
        self.goal = ReadingGoal.objects.create(
            user=self.user, year=now().year, goal=10
        )  # Add a goal

    def test_get_reading_goal_books(self):
        self.client.login(username="testuser", password="testpass")
        request = self.factory.get("/api/goals/books/")
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, []
        )  # Expect an empty list as no books are added yet


class AddReadingGoalBookViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = get_user_model().objects.create_user(
            username="testuser", password="testpass"
        )
        self.view = AddReadingGoalBookView.as_view()
        self.client = APIClient()
        self.goal = ReadingGoal.objects.create(
            user=self.user, year=now().year, goal=10
        )  # Add a goal

    def test_post_reading_goal_book(self):
        self.client.login(username="testuser", password="testpass")
        data = {
            "title": "Test Book",
            "author": "Test Author",
            "isbn": "9783161484100",
        }  # Set a book with an ISBN
        request = self.factory.post(
            "/api/goals/add_book/",
            data=json.dumps(data),
            content_type="application/json",
        )
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            response.data["title"], data["title"]
        )  # Check if the book is added
        self.assertEqual(response.data["author"], data["author"])
        self.assertEqual(
            response.data["isbn"], data["isbn"]
        )  # Check if the ISBN is correct


class DeleteReadingGoalBookViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = get_user_model().objects.create_user(
            username="testuser", password="testpass"
        )
        self.view = DeleteReadingGoalBookView.as_view()
        self.client = APIClient()
        self.goal = ReadingGoal.objects.create(
            user=self.user, year=now().year, goal=10
        )  # Add a goal
        self.book = ReadingGoalBook.objects.create(
            title="Test Book", author="Test Author", isbn="978-3-16-148410-0"
        )  # Add a book
        self.goal.books_read.add(self.book)  # Add the book to the goal

    def test_delete_reading_goal_book(self):
        self.client.login(username="testuser", password="testpass")
        request = self.factory.delete(f"/api/goals/delete_book/{self.book.pk}/")
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.book.pk)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
