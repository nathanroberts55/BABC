from datetime import datetime
from django.contrib import messages
from django.http import HttpResponse
from django.shortcuts import render
from .models import Book
from .forms import BookForm


# Create your views here.
def books(request):
    return render(request, "books.html")


def recommendations(request):
    context = {}

    books = Book.objects.filter(approved=True)

    context["books"] = books

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
