from django.test import TestCase
from books.models import Book
from books.forms import BookForm
from django.urls import reverse


class TestBookViews(TestCase):
    def create_book(
        self,
        title="Sample Book Title",
        author="Book Author",
        isbn="123456789012",
        source=Book.Sources.CHAT,
    ):
        return Book.objects.create(title=title, author=author, isbn=isbn, source=source)

    def test_recommendation_view(self):
        test_book = self.create_book()
        url = reverse("recommendations")
        resp = self.client.get(url)

        self.assertEqual(resp.status_code, 200)
        self.assertNotIn(test_book.title, resp.content.decode())

    def test_submission_view(self):
        url = reverse("submissions")
        resp = self.client.get(url)

        self.assertEqual(resp.status_code, 200)
        self.assertIsInstance(resp.context["form"], BookForm)
