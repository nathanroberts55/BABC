from django.test import TestCase
from django.urls import reverse


class TestHomeViews(TestCase):
    def test_home_view(self):
        url = reverse("home")
        resp = self.client.get(url)

        self.assertEqual(resp.status_code, 200)


class ErrorPageTests(TestCase):
    def test_custom_404_page(self):
        response = self.client.get("/non_existent_url")  # an URL that doesn't exist
        self.assertEqual(response.status_code, 404)
        self.assertTemplateUsed(response, "404.html")
