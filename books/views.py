from django.core.paginator import Paginator
from django.db.models import Count
from datetime import datetime
from django.contrib import messages
from django.http import HttpResponse
from django.shortcuts import render
from .models import Book

# from .forms import BookForm
# import requests


# Create your views here.
def recommendations(request):
    context = {}
    source = request.GET.get("source")
    sort_by = request.GET.get("sort-key")
    search_by = request.GET.get("search-key")
    search_value = request.GET.get("search-value")

    books = (
        Book.objects.filter(approved=True)
        .annotate(likes_count=Count("likes"))
        .order_by("date_created")
    )

    # Filtering from Search Bar
    # Source Search
    if source and source != "FROM":
        books = books.filter(source=source)
    # Sorting
    if sort_by:
        if sort_by == "TITLE":
            books = books.order_by("title")
        if sort_by == "LIKES":
            books = books.order_by("likes_count")
    # Searching
    if (search_by and search_value) and search_value != "":
        if search_by == "TITLE":
            books = books.filter(title__icontains=search_value)
        if search_by == "AUTHOR":
            books = books.filter(author__icontains=search_value)
        if search_by == "ISBN":
            books = books.filter(isbn__icontains=search_value)
        if search_by == "SUBMITTER":
            books = books.filter(isbn__icontains=search_value)

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

    return render(request, "books/recommendations.html", context=context)


def submissions(request):
    context = {}

    return render(request, "books/submissions.html")


def details(request, id):
    context = {}

    book = Book.objects.filter(id=id).annotate(likes_count=Count("likes")).first()
    context["book"] = book

    return render(request, "books/details.html", context=context)
