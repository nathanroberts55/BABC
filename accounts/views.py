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
    return redirect("/")


# Create your views here.
@login_required
def account_profile(request) -> None:
    context = {}
    books = Book.objects.filter(favorites=request.user)
    context["books"] = books
    return render(request, "accounts/profile.html", context=context)


@login_required
def favorite_book(request, id) -> None:
    book = get_object_or_404(Book, id=id)

    if book.favorites.filter(id=request.user.id).exists():
        book.favorites.remove(request.user)
    else:
        book.favorites.add(request.user)

    return HttpResponseRedirect(request.META["HTTP_REFERER"])


@login_required
def like_book(request, id) -> None:
    book = get_object_or_404(Book, id=id)

    if book.likes.filter(id=request.user.id).exists():
        book.likes.remove(request.user)
    else:
        book.likes.add(request.user)

    return HttpResponseRedirect(request.META["HTTP_REFERER"])
