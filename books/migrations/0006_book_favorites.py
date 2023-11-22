# Generated by Django 4.2.6 on 2023-11-17 21:14

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('books', '0005_alter_book_amazon_link_alter_book_stream_link'),
    ]

    operations = [
        migrations.AddField(
            model_name='book',
            name='favorites',
            field=models.ManyToManyField(blank=True, default=None, related_name='favorite', to=settings.AUTH_USER_MODEL),
        ),
    ]