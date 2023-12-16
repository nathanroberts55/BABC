from django.test import TestCase, RequestFactory
from django.urls import reverse
from frontend.views import custom_404, custom_403


class CustomErrorViewsTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_custom_404_view(self):
        request = self.factory.get("/nonexistent-url/")
        response = custom_404(request, exception=None)
        self.assertEqual(response.status_code, 404)

    def test_custom_403_view(self):
        request = self.factory.get("/accounts/")
        response = custom_403(request, exception=None)
        self.assertEqual(response.status_code, 403)
