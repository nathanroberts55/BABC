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
        print(f"{datetime.now()}: Form Submission - {form}")

        if form.is_valid():
            form.save()
            messages.success(request=request, message="Successfully Submitted Book")
            form = BookForm()
    else:
        form = BookForm()

    context["form"] = form
    return render(request, "submissions.html", context=context)
