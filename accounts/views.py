from django.contrib.auth import login, authenticate, logout
from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import UserRegisterForm, UserLoginForm


# Create your views here.
def account_profile(request) -> None:
    context = {}

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
    return render(request, "accounts/logout.html", context=context)
