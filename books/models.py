from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver


# Create your models here.
class Book(models.Model):
    class Sources(models.TextChoices):
        CHAT = "CHAT", _("Chatter")
        ATRIOC = "ATRIOC", _("Atrioc")
        LEMONADE_STAND = "LEMONADESTAND", _("Lemonade Stand")

    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=250)
    author = models.CharField(max_length=50)
    isbn = models.CharField(max_length=50)
    source = models.CharField(
        max_length=13,  # Changed from 6 to 13 to accommodate "LEMONADESTAND"
        choices=Sources.choices,
        default=Sources.CHAT,
        help_text=_("Select Chatter, Atrioc, or Lemonade Stand Recommendation"),
    )
    submitter = models.CharField(max_length=50, blank=True)
    stream_link = models.URLField(max_length=500, blank=True)
    amazon_link = models.URLField(max_length=500, blank=True)
    approved = models.BooleanField(default=False)
    favorites = models.ManyToManyField(
        User, related_name="favorite", default=None, blank=True
    )
    likes = models.ManyToManyField(User, related_name="like", default=None, blank=True)
    currently_reading = models.BooleanField(default=False)

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


@receiver(post_save, sender=Book)
def update_currently_reading(sender, instance, **kwargs):
    # if the instance has currently_reading set to True
    if instance.currently_reading:
        # get the model class
        model_class = instance.__class__
        # filter the queryset by the field value and exclude the instance
        qs = model_class.objects.filter(currently_reading=True).exclude(pk=instance.pk)
        # update the field value to False for the queryset
        qs.update(currently_reading=False)
