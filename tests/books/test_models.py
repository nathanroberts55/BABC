from django.test import TestCase
from books.models import Book


class BookTestModels(TestCase):
    def create_book(
        self,
        title="Sample Book Title",
        author="Book Author",
        isbn="123456789012",
        source=Book.Sources.CHAT,
        **kwargs,
    ):
        return Book.objects.create(
            title=title, author=author, isbn=isbn, source=source, **kwargs
        )

    def test_book_creation(self):
        test_book = self.create_book()
        self.assertTrue(isinstance(test_book, Book))
        self.assertEqual(
            test_book.__str__(),
            f"Approval Status: {test_book.approved} | {test_book.title} by {test_book.author}",
        )
