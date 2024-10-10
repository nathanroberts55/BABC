from django.contrib.auth import login, authenticate, logout
from django.shortcuts import get_object_or_404, render, redirect, HttpResponseRedirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from books.models import Book


def account_login(request) -> None:
    context = {}

    if request.user.is_authenticated:
        print("User is Already Authenticated, sending to Home...")
        messages.info(request, "Already Logged In, Welcome Back!")
        return redirect("home")

    return render(request, "accounts/login.html", context=context)


def account_logout(request) -> None:
    context = {}

    logout(request=request)
    messages.success(request, "You have successfully logged out.")
    return redirect("home")


# Create your views here.
@login_required
def account_profile(request) -> None:
    context = {}
    books = Book.objects.filter(favorites=request.user)
    context["books"] = books
    return render(request, "accounts/profile.html", context=context)
