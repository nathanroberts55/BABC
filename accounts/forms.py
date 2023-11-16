from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User
from captcha.fields import ReCaptchaField
from captcha.widgets import ReCaptchaV2Checkbox
from django import forms

# from .models import BookClubMember


class UserRegisterForm(UserCreationForm):
    def __init__(self, *args, **kwargs):
        super(UserRegisterForm, self).__init__(*args, **kwargs)
        # Username Field Settings
        self.fields["username"].widget.attrs.update(
            {
                "class": "form-control mb-3",
                "type": "text",
                "placeholder": "Enter Username",
                "id": "register-users-username",
            }
        )
        # Password 1 Field Settings
        self.fields["password1"].widget.attrs.update(
            {
                "class": "form-control mb-3",
                "type": "text",
                "placeholder": "Enter Password",
                "id": "register-users-password1",
            }
        )
        self.fields["password1"].help_text = [
            _("Your password can’t be too similar to your other personal information."),
            _("Your password must contain at least 8 characters."),
            _("Your password can’t be a commonly used password."),
            _("Your password can’t be entirely numeric."),
        ]
        # Password 2 Field Settings
        self.fields["password2"].widget.attrs.update(
            {
                "class": "form-control mb-3",
                "type": "text",
                "placeholder": "Confirm Password",
                "id": "register-users-password2",
            }
        )

    class Meta:
        model = User
        fields = ["username", "password1", "password2"]

        labels = {
            "username": "",
            "password1": "",
            "password2": "",
        }


class UserLoginForm(forms.Form):
    username = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "class": "form-control mb-3",
                "type": "text",
                "placeholder": "Enter Username",
                "id": "register-users-username",
            }
        )
    )
    password1 = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control mb-3",
                "type": "password",
                "placeholder": "Enter Password",
                "id": "register-users-username",
            }
        )
    )

    class Meta:
        model = User
        fields = [
            "username",
            "password1",
        ]

        labels = {
            "username": "",
            "password1": "",
        }
