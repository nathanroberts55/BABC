import logging
from django.contrib.auth.decorators import login_required
from django.db.models import Count, F, IntegerField, Value
from django.db.models.functions import Coalesce
from django.contrib import messages
from django.shortcuts import render
from django.utils.timezone import now
from books.utils.google_api import google_book_search
from goals.models import ReadingGoal, ReadingGoalBook


@login_required
def create_goal(request, *args, **kwargs):
    context = {}

    goal = (
        ReadingGoal.objects.filter(user=request.user, year=now().year)
        .annotate(
            books_read_count=Count("books_read"),
            progress=Coalesce(
                F("books_read_count") * 100 / F("goal"),
                Value(0),
                output_field=IntegerField(),
            ),
        )
        .first()
    )

    if goal:
        context["goal"] = goal
        return render(
            request,
            "partials/_reading_goal.html",
            context=context,
        )

    new_goal = ReadingGoal(user=request.user, goal=0)
    new_goal.save()

    new_goal = (
        ReadingGoal.objects.filter(user=request.user, year=now().year)
        .annotate(
            books_read_count=Count("books_read"),
            progress=Coalesce(
                F("books_read_count") * 100 / F("goal"),
                Value(0),
                output_field=IntegerField(),
            ),
        )
        .first()
    )

    context["goal"] = new_goal

    return render(
        request,
        "partials/_reading_goal.html",
        context=context,
    )


@login_required
def delete_goal(request, *args, **kwargs):
    context = {}

    goal = ReadingGoal.objects.filter(user=request.user, year=now().year).first()

    # Get the books associated with the goal
    books = goal.books_read.all()

    # Create a list of books that are only associated with this goal
    books_to_delete = [book for book in books if book.readinggoal_set.count() == 1]

    # Remove the associations between the goal and the books
    goal.books_read.clear()

    # Delete the goal
    goal.delete()

    # Delete the books that are only associated with this goal
    for book in books_to_delete:
        book.delete()

    return render(
        request,
        "partials/_reading_goal.html",
        context=context,
    )


@login_required
def update_goal(request, *args, **kwargs):
    context = {}

    goal = (
        ReadingGoal.objects.filter(user=request.user, year=now().year)
        .annotate(
            books_read_count=Count("books_read"),
            progress=Coalesce(
                F("books_read_count") * 100 / F("goal"),
                Value(0),
                output_field=IntegerField(),
            ),
        )
        .first()
    )

    if request.method == "POST":
        updated_goal = request.POST.get("goal", "")
        if updated_goal:
            goal.goal = updated_goal
            goal.save()

            goal = (
                ReadingGoal.objects.filter(user=request.user, year=now().year)
                .annotate(
                    books_read_count=Count("books_read"),
                    progress=Coalesce(
                        F("books_read_count") * 100 / F("goal"),
                        Value(0),
                        output_field=IntegerField(),
                    ),
                )
                .first()
            )

            context["goal"] = goal
    else:
        context["goal"] = goal

    return render(
        request,
        "partials/_reading_goal.html",
        context=context,
    )


@login_required
def add_book(request, *args, **kawrgs):
    context = {}
    goal = (
        ReadingGoal.objects.filter(user=request.user, year=now().year)
        .annotate(
            books_read_count=Count("books_read"),
            progress=Coalesce(
                F("books_read_count") * 100 / F("goal"),
                Value(0),
                output_field=IntegerField(),
            ),
        )
        .first()
    )

    if request.method == "POST":
        title = request.POST.get("title", "")
        author = request.POST.get("author", "")
        isbn = request.POST.get("isbn", "")
        book, created = ReadingGoalBook.objects.get_or_create(
            title=title, author=author, isbn=isbn
        )

        if goal and book:
            goal.add_book(book=book)

        goal = (
            ReadingGoal.objects.filter(user=request.user, year=now().year)
            .annotate(
                books_read_count=Count("books_read"),
                progress=Coalesce(
                    F("books_read_count") * 100 / F("goal"),
                    Value(0),
                    output_field=IntegerField(),
                ),
            )
            .first()
        )
        context["goal"] = goal
    else:
        context["goal"] = goal

    return render(
        request,
        "partials/_reading_goal.html",
        context=context,
    )


@login_required
def delete_book(request, id, *args, **kwargs):
    context = {}

    if request.method == "POST":
        book = ReadingGoalBook.objects.get(id=id)
        goal = ReadingGoal.objects.filter(user=request.user, year=now().year).first()
        if goal:
            if book in goal.books_read.all():
                goal.books_read.remove(book)  # remove the association
                goal.save()
                if (
                    not book.readinggoal_set.exists()
                ):  # if no other user has read this book
                    book.delete()  # delete the book

    goal = (
        ReadingGoal.objects.filter(user=request.user, year=now().year)
        .annotate(
            books_read_count=Count("books_read"),
            progress=Coalesce(
                F("books_read_count") * 100 / F("goal"),
                Value(0),
                output_field=IntegerField(),
            ),
        )
        .first()
    )

    context["goal"] = goal

    return render(
        request,
        "partials/_reading_goal.html",
        context=context,
    )


def goal_book_search(request):
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

    if books:
        context["book_results"] = books
    else:
        messages.error(
            request=request,
            message="Something went wrong with the search API, please try again later.",
        )

    return render(request, "partials/_book_results.html", context=context)
