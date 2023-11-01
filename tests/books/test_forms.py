from django.test import TestCase
from books.models import Book
from books.forms import BookForm
from django import forms


class TestBooksForm(TestCase):
    def create_book(
        self,
        title="Sample Book Title",
        author="Book Author",
        isbn="123456789012",
        source=Book.Sources.CHAT,
    ):
        return Book.objects.create(title=title, author=author, isbn=isbn, source=source)

    def test_valid_form(self):
        # Create a subclass of BookForm that overrides clean_captcha
        class TestBookForm(BookForm):
            captcha = forms.CharField(required=False)

            def clean_captcha(self):
                return True

        test_book = self.create_book()
        data = {
            "title": "New Title",
            "author": "New Author",
            "isbn": "0000000000000",
            "source": test_book.source,
        }
        form = TestBookForm(data=data)

        if not form.is_valid():
            print(form.errors)

        self.assertTrue(form.is_valid())

    def test_invalid_form(self):
        # Create a subclass of BookForm that overrides clean_captcha
        class TestBookForm(BookForm):
            captcha = forms.CharField(required=False)

            def clean_captcha(self):
                return True

        test_book = self.create_book()
        data = {
            "title": test_book.title,
            "author": test_book.author,
            "isbn": None,
            "source": test_book.source,
        }
        form = BookForm(data=data)
        self.assertFalse(form.is_valid())
