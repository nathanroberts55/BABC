from django.test import TestCase, Client
from books.models import Book
from books.forms import BookForm
from django.urls import reverse
from unittest.mock import patch

# from .test_forms import TestingBookForm
from django import forms


# Create a subclass of BookForm that overrides clean_captcha
class TestingBookForm(BookForm):
    captcha = forms.CharField(required=False)

    def clean_captcha(self):
        return True


class RecommendationsViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.recommendations_url = reverse("recommendations")

        # Create a test book
        self.book = Book.objects.create(
            title="Test Title",
            author="Test Author",
            isbn="1234567890",
            source="Test Source",
            submitter="Test Submitter",
            stream_link="Test Stream Link",
            approved=True,
        )

    def test_recommendations_GET(self):
        response = self.client.get(self.recommendations_url)

        self.assertEquals(response.status_code, 200)
        self.assertTemplateUsed(response, "recommendations.html")
        self.assertEquals(len(response.context["books"]), 1)


class SubmissionsViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.submissions_url = reverse("submissions")

        self.form_data = {
            "title": "Sample Book Title",
            "author": "Book Author",
            "isbn": "123456789012",
            "source": Book.Sources.CHAT,
            "submitter": "username123",
            "stream_link": "https://www.twitch.tv/atrioc/clip/sample",
        }

    def test_submissions_GET(self):
        response = self.client.get(self.submissions_url)

        self.assertEquals(response.status_code, 200)
        self.assertTemplateUsed(response, "submissions.html")
        self.failUnless(isinstance(response.context["form"], BookForm))

    def test_submissions_POST(self):
        response = self.client.post(self.submissions_url, data=self.form_data)

        self.assertEquals(response.status_code, 200)
