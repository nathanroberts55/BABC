from django.utils.translation import gettext_lazy as _
from django.test import TestCase
from books.models import Book
from books.forms import BookForm
from django import forms


# Create a subclass of BookForm that overrides clean_captcha
class TestingBookForm(BookForm):
    captcha = forms.CharField(required=False)

    def clean_captcha(self):
        return True


class TestBooksForm(TestCase):
    def setUp(self):
        self.book_data = {
            "title": "Sample Book Title",
            "author": "Book Author",
            "isbn": "123456789012",
            "source": Book.Sources.CHAT,
            "submitter": "username123",
            "stream_link": "https://www.twitch.tv/atrioc/clip/sample",
        }

    def create_book(
        self,
        title="Sample Book Title",
        author="Book Author",
        isbn="123456789012",
        source=Book.Sources.CHAT,
        **kwargs
    ):
        return Book.objects.create(
            title=title, author=author, isbn=isbn, source=source, **kwargs
        )

    def test_valid_form(self):
        form = TestingBookForm(self.book_data)
        self.assertTrue(form.is_valid())

    def test_unique_book_validation(self):
        # Create the first book
        form1 = TestingBookForm(data=self.book_data)
        self.assertTrue(form1.is_valid())
        form1.save()

        # Attempt to create a second book with the same title and author
        form2 = TestingBookForm(data=self.book_data)
        self.assertFalse(form2.is_valid())

        # Check if the form errors contain the expected validation error
        self.assertEqual(
            form2.errors["__all__"],
            [
                _("Duplicate Record: This book has already been submitted"),
                _("Book with this Title and Author already exists."),
            ],
        )

    def test_source_validation(self):
        data = self.book_data.copy()
        data.update({"source": "Invalid Source"})
        form = TestingBookForm(data=data)
        self.assertFalse(form.is_valid())
        self.assertEqual(
            form.errors["source"],
            [
                _(
                    "Select a valid choice. Invalid Source is not one of the available choices."
                )
            ],
        )

    def test_atrioc_streamlink_validation(self):
        # Test with Atrioc source and empty stream link
        data = self.book_data.copy()
        data.update({"source": Book.Sources.ATRIOC, "stream_link": ""})
        form = TestingBookForm(data=data)
        self.assertFalse(form.is_valid())
        self.assertEqual(
            form.errors["__all__"],
            [_("Stream Link MUST be submitted if Atrioc Recommendation")],
        )

        # Test with Atrioc source and non-empty stream link
        data.update({"stream_link": "https://www.twitch.tv/atrioc/clip/sample"})
        form = TestingBookForm(data=data)
        self.assertTrue(form.is_valid())

    def test_chat_username_validation(self):
        # Test with Chat source and empty submitter
        data = self.book_data.copy()
        data.update({"source": Book.Sources.CHAT, "submitter": ""})
        form = TestingBookForm(data=data)
        self.assertFalse(form.is_valid())
        self.assertEqual(
            form.errors["__all__"],
            [_("Username MUST be submitted if Chatter Recommendation")],
        )

        # Test with Chat source and non-empty submitter
        data.update({"submitter": "username123"})
        form = TestingBookForm(data=data)
        self.assertTrue(form.is_valid())
