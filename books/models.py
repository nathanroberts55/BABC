from django.db import models
from django.utils.translation import gettext_lazy as _


# Create your models here.
class Book(models.Model):
    class Sources(models.TextChoices):
        CHAT = "CHAT", _("Chatter")
        ATRIOC = "ATRIOC", _("Atrioc")

    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=250)
    author = models.CharField(max_length=50)
    isbn = models.CharField(max_length=50)
    source = models.CharField(
        max_length=6,
        choices=Sources.choices,
        default=Sources.CHAT,
        help_text=_("Select Chatter or Atrioc Recommendation"),
    )
    submitter = models.CharField(max_length=50, blank=True)
    stream_link = models.URLField(max_length=500, blank=True)
    amazon_link = models.URLField(max_length=500, blank=True)
    approved = models.BooleanField(default=False)

    class Meta:
        unique_together = ("title", "author")
        ordering = [
            "approved",
            "title",
            "author",
            "date_created",
        ]

    @property
    def cover_image_thumbnail(self):
        return f"https://covers.openlibrary.org/b/isbn/{self.isbn}-s.jpg"

    @property
    def cover_image_display(self):
        return f"https://covers.openlibrary.org/b/isbn/{self.isbn}-m.jpg"

    def __str__(self) -> str:
        return f"Approval Status: {self.approved} | {self.title} by {self.author}"
