# pages/tests.py
from django.test import TestCase


class RobotsTxtTests(TestCase):
    def test_robotsdottxt(self):
        response = self.client.get("/robots.txt")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["content-type"], "text/plain")
