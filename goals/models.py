from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _


# Create your models here.
class ReadingGoalBook(models.Model):
    title = models.CharField(max_length=250)
    author = models.CharField(max_length=50)
    isbn = models.CharField(max_length=50, blank=True)

    class Meta:
        unique_together = ("title", "author")


class ReadingGoal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    year = models.PositiveIntegerField(default=now().year)
    goal = models.PositiveIntegerField(default=0)
    books_read = models.ManyToManyField(ReadingGoalBook, blank=True)
    # certificate = models.ImageField(upload_to="certificates/", blank=True, null=True)

    class Meta:
        unique_together = ("user", "year")

    def add_book(self, book):
        self.books_read.add(book)
        self.save()

    def is_goal_reached(self):
        return self.books_read.count() >= self.goal
