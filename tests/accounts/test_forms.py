from django.test import TestCase
from accounts.forms import UserRegisterForm, UserLoginForm


class UserRegisterFormTest(TestCase):
    def test_form(self):
        form_data = {
            "username": "testuser",
            "password1": "testpassword123",
            "password2": "testpassword123",
        }
        form = UserRegisterForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_form_invalid(self):
        form_data = {
            "username": "testuser",
            "password1": "testpassword123",
            "password2": "wrongpassword123",
        }
        form = UserRegisterForm(data=form_data)
        self.assertFalse(form.is_valid())


class UserLoginFormTest(TestCase):
    def test_form(self):
        form_data = {"username": "testuser", "password1": "testpassword123"}
        form = UserLoginForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_form_invalid(self):
        form_data = {"username": "", "password1": "testpassword123"}
        form = UserLoginForm(data=form_data)
        self.assertFalse(form.is_valid())
