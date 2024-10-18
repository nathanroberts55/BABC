from django.contrib.auth import login, authenticate, logout
from django.shortcuts import get_object_or_404, render, redirect, HttpResponseRedirect
from django.core.paginator import Paginator
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from books.models import Book


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

    paginator = Paginator(books, 25)

    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    context["page_obj"] = page_obj

    if "HX-Request" in request.headers:
        return render(
            request,
            "partials/_recommendation_list.html",
            context=context,
        )

    context["books"] = books
    return render(request, "accounts/profile.html", context=context)
