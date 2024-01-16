from django.contrib import admin
from .models import ReadingGoalBook, ReadingGoal


# Register your models here.
@admin.register(ReadingGoalBook)
class ReadingGoalBookAdmin(admin.ModelAdmin):
    list_display = ["date_created", "title", "author", "isbn"]
    ordering = [
        "date_created",
        "title",
        "author",
    ]
    search_fields = [
        "date_created",
        "title",
        "author",
    ]


@admin.register(ReadingGoal)
class ReadingGoalBookAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "goal",
        "year",
        "date_created",
    ]
    ordering = ["-date_created", "user", "-year"]
    search_fields = ["date_created", "user", "year"]
