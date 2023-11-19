from django.utils.translation import gettext_lazy as _
from captcha.fields import ReCaptchaField
from captcha.widgets import ReCaptchaV2Checkbox
from django import forms
from .models import Book


class BookForm(forms.ModelForm):
    captcha = ReCaptchaField(widget=ReCaptchaV2Checkbox)

    def clean_title(self):
        if self.cleaned_data["title"] == "":
            raise forms.ValidationError(
                _("Title is Required. Please ensure Book was selected from dropdown")
            )

        return self.cleaned_data["title"]

    def clean_author(self):
        if self.cleaned_data["author"] == "":
            raise forms.ValidationError(
                _("Author is Required. Please ensure Book was selected from dropdown")
            )
        return self.cleaned_data["author"]

    def clean_isbn(self):
        if self.cleaned_data["isbn"] == "":
            raise forms.ValidationError(
                _("ISBN is Required. Please ensure Book was selected from dropdown")
            )
        return self.cleaned_data["isbn"]

    def clean_source(self):
        source = self.cleaned_data["source"]

        if not (source == Book.Sources.CHAT or source == Book.Sources.ATRIOC):
            raise forms.ValidationError(_("Recommendation MUST be from CHAT or ATRIOC"))

        return source

    def clean_submitter(self):
        return self.cleaned_data["submitter"]

    def clean_stream_link(self):
        cleaned_data = self.cleaned_data

        stream_link = cleaned_data["stream_link"]
        if stream_link != "" and not any(
            url in stream_link
            for url in [
                "https://clips.twitch.tv/",
                "https://www.twitch.tv/atrioc/clip/",
            ]
        ):
            raise forms.ValidationError(
                _(
                    "Invalid stream link. The link must contain 'https://www.twitch.tv/atrioc/clip/' or 'https://clips.twitch.tv/'"
                )
            )

        return stream_link

    def clean_atrioc_streamlink(self):
        cleaned_data = self.cleaned_data

        if (
            "source" in cleaned_data
            and cleaned_data["source"] == Book.Sources.ATRIOC
            and "stream_link" in cleaned_data
            and cleaned_data["stream_link"] == ""
        ):
            raise forms.ValidationError(
                _("Stream Link MUST be submitted if Atrioc Recommendation")
            )

        return cleaned_data.get("stream_link")  # use get() to avoid KeyError

    def clean_chat_username(self):
        cleaned_data = self.cleaned_data

        if (
            "source" in cleaned_data
            and cleaned_data["source"] == Book.Sources.CHAT
            and "submitter" in cleaned_data
            and cleaned_data["submitter"] == ""
        ):
            raise forms.ValidationError(
                _("Username MUST be submitted if Chatter Recommendation")
            )

        return cleaned_data.get("submitter")  # use get() to avoid KeyError

    def clean(self):
        # call the parent class's clean method
        cleaned_data = super().clean()

        # Call your custom validation methods
        self.clean_atrioc_streamlink()
        self.clean_chat_username()

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
        error_messages = {
            "title": {
                "required": _(
                    "Title is Required. Please ensure Book was selected from dropdown"
                ),
            },
            "author": {
                "required": _(
                    "Author is Required. Please ensure Book was selected from dropdown"
                ),
            },
            "isbn": {
                "required": _(
                    "ISBN is Required. Please ensure Book was selected from dropdown"
                ),
            },
        }
        widgets = {
            "title": forms.HiddenInput(
                attrs={
                    "class": "form-control form-select invisible",
                    "id": "form-book-title",
                    "required": True,
                },
            ),
            "author": forms.HiddenInput(
                attrs={
                    "class": "form-control form-select invisible",
                    "id": "form-book-author",
                    "required": True,
                },
            ),
            "isbn": forms.HiddenInput(
                attrs={
                    "class": "form-control form-select invisible",
                    "id": "form-book-isbn",
                    "required": True,
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
            "captcha": ReCaptchaField(widget=ReCaptchaV2Checkbox),
        }
