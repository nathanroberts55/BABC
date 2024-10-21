from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404, render
from django.db.models import Count
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib import messages
from datetime import datetime
from .models import Book
from .forms import BookForm
from .utils.google_api import google_book_details
from .utils.openlib_api import openlib_book_details


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
            books = books.order_by("-likes_count", "title")
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
    if request.method == "POST":
        form = BookForm(request.POST)
        if form.is_valid():
            print("Successful Form Submission Content:")
            print(f'title: {form.cleaned_data["title"]}'),
            print(f'author: {form.cleaned_data["author"]}'),
            print(f'isbn: {form.cleaned_data["isbn"]}'),
            print(f'source: {form.cleaned_data["source"]}'),
            print(
                f'submitter: {form.cleaned_data["submitter"] if form.cleaned_data["submitter"] else None}'
            ),
            print(
                f'stream_link: {form.cleaned_data["stream_link"] if form.cleaned_data["stream_link"] else None}'
            ),
            form.save()
            messages.success(request=request, message="Successfully Submitted Book")
            form = BookForm()
    else:
        form = BookForm()

    context["form"] = form
    return render(request, "books/submissions.html", context=context)


def book_search(request):
    context = {}

    search_term = request.GET.get("search-value", "")
    search_key = request.GET.get("search-key", "")
    encoded_search_term = search_term.replace(" ", "+")

    books = openlib_book_details(encoded_search_term, search_key)

    if books:
        context["books"] = books
    else:
        messages.error(
            request=request,
            message="Something went wrong with the search API, please try again later.",
        )

    return render(request, "partials/_book_dropdown_list.html", context=context)


def details(request, id):
    context = {}

    book = Book.objects.filter(id=id).annotate(likes_count=Count("likes")).first()

    description, image_url = google_book_details(book)

    context["book"] = book
    context["description"] = description
    context["image_url"] = image_url

    return render(request, "books/details.html", context=context)


@login_required
def favorite_book(request, id) -> None:
    context = {}

    book = get_object_or_404(Book, id=id)

    if book.favorites.filter(id=request.user.id).exists():
        book.favorites.remove(request.user)
    else:
        book.favorites.add(request.user)

    book = Book.objects.filter(id=id).annotate(likes_count=Count("likes")).first()

    context["book"] = book

    return render(request, "partials/_book_buttons.html", context=context)


@login_required
def like_book(request, id) -> None:
    context = {}

    book = get_object_or_404(Book, id=id)

    # Associate the User to the Book
    if book.likes.filter(id=request.user.id).exists():
        book.likes.remove(request.user)
    else:
        book.likes.add(request.user)

    book = Book.objects.filter(id=id).annotate(likes_count=Count("likes")).first()

    context["book"] = book

    return render(request, "partials/_book_buttons.html", context=context)
