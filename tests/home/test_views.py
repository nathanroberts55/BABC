from django.test import TestCase
from django.urls import reverse


class TestHomeViews(TestCase):
    def test_home_view(self):
        url = reverse("home")
        resp = self.client.get(url)

        self.assertEqual(resp.status_code, 200)
