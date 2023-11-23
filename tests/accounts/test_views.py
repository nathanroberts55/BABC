from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from books.models import Book


class TestViews(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username="testuser", password="12345")
        self.book = Book.objects.create(title="Test Book", author="Test Author")

    def test_account_profile_GET(self):
        self.client.login(username="testuser", password="12345")
        response = self.client.get(reverse("account"))

        self.assertEquals(response.status_code, 200)
        self.assertTemplateUsed(response, "accounts/profile.html")

    def test_account_login_GET_authenticated_user(self):
        self.client.login(username="testuser", password="12345")
        response = self.client.get(reverse("login"))

        self.assertEquals(response.status_code, 302)  # Expecting a redirect

    def test_account_logout_GET(self):
        self.client.login(username="testuser", password="12345")
        response = self.client.get(reverse("logout"))

        self.assertEquals(response.status_code, 302)

    def test_favorite_book_GET(self):
        self.client.login(username="testuser", password="12345")
        response = self.client.get(
            reverse("favorite", args=[self.book.id]),
            **{"HTTP_REFERER": "http://localhost/"}
        )
        self.assertEquals(response.status_code, 302)

    def test_like_book_GET(self):
        self.client.login(username="testuser", password="12345")
        response = self.client.get(
            reverse("like", args=[self.book.id]),
            **{"HTTP_REFERER": "http://localhost/"}
        )
        self.assertEquals(response.status_code, 302)
