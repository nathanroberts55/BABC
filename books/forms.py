from django.utils.translation import gettext_lazy as _
from django import forms
from .models import Book


class BookForm(forms.ModelForm):
    def clean_title(self):
        return self.cleaned_data["title"]

    def clean_author(self):
        return self.cleaned_data["author"]

    def clean_isbn(self):
        return self.cleaned_data["isbn"]

    def clean_source(self):
        source = self.cleaned_data["source"]

        if not (source == Book.Sources.ATRIOC or source == Book.Sources.CHAT):
            raise forms.ValidationError(
                _(
                    f"Invalid Option: Recommendation must be Chatter or Atrioc. You submitted {source}"
                )
            )
        return source

    def clean_submitter(self):
        return self.cleaned_data["submitter"]

    def clean_stream_link(self):
        stream_link = self.cleaned_data["stream_link"]
        if (
            stream_link != ""
            and "https://www.twitch.tv/atrioc/clip/" not in stream_link
        ):
            raise forms.ValidationError(
                _(
                    "Invalid stream link. The link must contain 'https://www.twitch.tv/atrioc/clip/'"
                )
            )
        return stream_link

    def clean_unique_book(self):
        cleaned_data = self.cleaned_data
        found_book = Book.objects.filter(
            title=cleaned_data["title"], author=cleaned_data["author"]
        )

        if found_book:
            raise forms.ValidationError(
                _("Duplicate Record: This book has already been submitted")
            )

        return cleaned_data

    def clean_atrioc_streamlink(self):
        cleaned_data = self.cleaned_data

        if not (
            cleaned_data["source"] == Book.Sources.ATRIOC
            and cleaned_data["stream_link"] == ""
        ):
            raise forms.ValidationError(
                _("Stream Link MUST be submitted if Atrioc Recommendation")
            )

        return cleaned_data

    def clean_chat_username(self):
        cleaned_data = self.cleaned_data

        if not (
            cleaned_data["source"] == Book.Sources.CHAT
            and cleaned_data["submitter"] == ""
        ):
            raise forms.ValidationError(
                _("Username MUST be submitted if Chatter Recommendation")
            )

        return cleaned_data

    class Meta:
        model = Book
        fields = [
            "title",
            "author",
            "isbn",
            "source",
            "submitter",
            "stream_link",
        ]
        labels = {
            "title": "",
            "author": "",
            "isbn": "",
            "source": "",
            "submitter": "",
            "stream_link": "",
        }
        widgets = {
            "title": forms.HiddenInput(
                attrs={
                    "class": "form-control form-select invisible",
                    "id": "form-book-title",
                },
            ),
            "author": forms.HiddenInput(
                attrs={
                    "class": "form-control form-select invisible",
                    "id": "form-book-author",
                },
            ),
            "isbn": forms.HiddenInput(
                attrs={
                    "class": "form-control form-select invisible",
                    "id": "form-book-isbn",
                },
            ),
            "source": forms.Select(
                attrs={
                    "class": "form-control form-select",
                    "placeholder": _("Source"),
                    "id": "form-book-source",
                },
                choices=Book.Sources.choices,
            ),
            "submitter": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": _("Twitch Username"),
                    "id": "form-book-submitter",
                },
            ),
            "stream_link": forms.URLInput(
                attrs={
                    "class": "form-control",
                    "placeholder": _("Twitch Stream Link"),
                    "id": "form-book-streamlink",
                },
            ),
        }
