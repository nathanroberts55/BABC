from datetime import datetime
from django.contrib import messages
from django.http import HttpResponse
from django.shortcuts import render
from .models import Book
from .forms import BookForm
import requests

# Amazon PA API Docs: https://python-amazon-paapi.readthedocs.io/en/latest/amazon_paapi.html
#                     https://webservices.amazon.com/paapi5/documentation/item-info.html#contentinfo
# Amazon PA API Repo: https://github.com/sergioteula/python-amazon-paapi

# from amazon_paapi import AmazonApi
# from BigABookClub.settings import (
#     AMAZON_API_ACCESS_KEY,
#     AMAZON_API_SECRET_KEY,
#     AMAZON_API_PARTNER_TAG,
#     AMAZON_API_COUNTRY,
# )

# Amazon API
# amazon = AmazonApi(
#     AMAZON_API_ACCESS_KEY,
#     AMAZON_API_SECRET_KEY,
#     AMAZON_API_PARTNER_TAG,
#     AMAZON_API_COUNTRY,
#     throttling=2,
# )


# Create your views here.
def books(request):
    return render(request, "books.html")


def book_details(request, id):
    context = {}

    book = Book.objects.filter(id=id).first()
    context["book"] = book

    try:
        url = f"https://www.googleapis.com/books/v1/volumes?q=isbn:{book.isbn}"
        print(f"Making Request for Book Details for {book.title} at: {url}")
        response = requests.get(url=url)
        data = response.json()

        print("Getting Books")
        items = data.get("items", [])

        if items:
            book_info = items[0]  # Get the first book from the list
            volume_info = book_info.get(
                "volumeInfo", {}
            )  # Get the volumeInfo dictionary

            print(f"Attempting to retrieve {book.title} Description")
            description = volume_info.get("description", None)
            # print(description)
            print(f"Attempting to retrieve {book.title} Cover Image")
            imageLinks = volume_info.get("imageLinks", {})
            image_url = imageLinks.get("thumbnail", None)

            context["description"] = description
            context["image_url"] = image_url
        else:
            context["description"] = None
            context["image_url"] = None

    except Exception as e:
        print(f"Exception getting book details: {e}")

    # try:
    #     book_results = amazon.search_items(
    #         item_count=1,
    #         keywords=book.title,
    #         title=book.title,
    #         author=book.author[0],
    #         search_index="Books",
    #     )
    #     book_asin = amazon.get_items(book_results.items[0].asin)[0]
    #     book = amazon.get_items(book_asin)[0]
    #     description =  book.item_info.content_info
    #     book_image = book.images.primary.medium.url
    #     item = amazon.get_items("B01N5IB20Q")[0]
    #     print(item)
    # except Exception as e:
    #     print(f"Error Requesting from the Amazon API with error: {e}")
    #     print(f"TraceBack: {e.__traceback__}")

    return render(request, "book_details.html", context=context)


def recommendations(request):
    context = {}

    book = Book.objects.filter(approved=True)

    context["books"] = book

    return render(request, "recommendations.html", context=context)


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
    return render(request, "submissions.html", context=context)
