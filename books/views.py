from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404, render
from django.db.models import Count
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib import messages
from datetime import datetime
from .models import Book
from .forms import BookForm
from .utils.google_api import google_book_details, google_book_search
from .utils.openlib_api import openlib_book_search


# Create your views here.
def recommendations(request):
    context = {}
    source = request.GET.get("source")
    sort_by = request.GET.get("sort-key")
    search_by = request.GET.get("search-key")
    search_value = request.GET.get("search-value")

    currently_reading = Book.objects.filter(
        approved=True, currently_reading=True
    ).first()
    cr_description, cr_image_url = google_book_details(currently_reading)

    context["currently_reading"] = currently_reading
    context["cr_description"] = cr_description
    context["cr_image_url"] = cr_image_url

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


def submissions(request, *args, **kwargs):
    context = {}
    form = BookForm(request.POST or None)
    if request.method == "POST":
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
            print(f"Form not valid: {form.errors}")
    else:
        form = BookForm()

    context["form"] = form

    if "HX-Request" in request.headers:
        return render(
            request,
            "partials/_submission_form.html",
            context=context,
        )
    return render(request, "books/submissions.html", context=context)


def book_search(request):
    context = {}

    search_term_param = request.GET.get("search-value", "")
    search_key_param = request.GET.get("search-key", "")
    encoded_search_term = search_term_param.replace(" ", "+")

    if search_key_param == "title":
        search_key = "intitle"
    elif search_key_param == "author":
        search_key = "inauthor"
    elif search_key_param == "isbn":
        search_key = "isbn"

    books = google_book_search(encoded_search_term, search_key)

    # books = openlib_book_search(
    #     encoded_search_term=encoded_search_term, search_key=search_key_param
    # )

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
