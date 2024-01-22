from django.contrib import admin
from .models import Book


# Register your models here.
@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = (
        "approved",
        "date_created",
        "title",
        "author",
        "isbn",
        "source",
        "submitter",
    )
    ordering = [
        "approved",
        "-date_created",
    ]
    search_fields = ["title", "author", "date_created"]
