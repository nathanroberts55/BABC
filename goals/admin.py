from django.contrib import admin
from .models import ReadingGoalBook, ReadingGoal

# Register your models here.
admin.site.register(ReadingGoal)
admin.site.register(ReadingGoalBook)
