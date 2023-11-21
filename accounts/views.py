from django.contrib.auth import login, authenticate, logout
from django.shortcuts import get_object_or_404, render, redirect, HttpResponseRedirect
from django.contrib import messages
from .forms import UserRegisterForm, UserLoginForm
from django.contrib.auth.decorators import login_required
from books.models import Book


# Create your views here.
@login_required
def account_profile(request) -> None:
    # Only set back_url if it's not set yet, or if it's not a favorite_book or like_book URL
    if (
        "back_url" not in request.session
        or "/favorite/" not in request.session["back_url"]
        and "/like/" not in request.session["back_url"]
    ):
        request.session["back_url"] = request.META.get("HTTP_REFERER", "/")

    context = {}
    books = Book.objects.filter(favorites=request.user)
    context["books"] = books
    return render(request, "accounts/profile.html", context=context)


def account_register(request) -> None:
    context = {}
    if request.method == "POST":
        form = UserRegisterForm(request.POST)

        if form.is_valid():
            form.save()
            messages.success(
                request=request,
                message="Succesfully Registered, Welcome to the BookClub",
            )
            return redirect("login")
    else:
        form = UserRegisterForm()

    context["form"] = form
    return render(request, "accounts/register.html", context=context)


def account_login(request) -> None:
    context = {}

    if request.method == "POST":
        print("User Login")
        form = UserLoginForm(request.POST)

        if form.is_valid():
            print("Valid Form Submission")
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password1"]

            user = authenticate(request=request, username=username, password=password)

            if user:
                print("Authenticated User")
                login(request=request, user=user)
                messages.success(request, "Successful Login: Welcome Back!")
                print("Sending User to Home Page")
                return redirect("home")

        messages.error(request, f"Invalid username or password")
        context["form"] = form
        return render(request, "accounts/login.html", context)

    if request.user.is_authenticated:
        print("User is Already Authenticated, sending to Home...")
        messages.info(request, "Already Logged In, Welcome Back!")
        return redirect("home")

    form = UserLoginForm()

    context["form"] = form
    return render(request, "accounts/login.html", context=context)


def account_logout(request) -> None:
    context = {}

    logout(request=request)
    messages.success(request, "You have successfully logged out.")
    return redirect("login")


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
