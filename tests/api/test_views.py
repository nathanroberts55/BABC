from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from rest_framework.test import force_authenticate
from books.models import Book
from api.views import (
    CreateBookView,
    FavoriteBook,
    ListBookmarks,
    ListBooksView,
    SingleBookView,
)


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
