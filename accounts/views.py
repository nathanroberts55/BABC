from django.db.models import Count, F, Case, When, IntegerField, Value
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.core.paginator import Paginator
from django.contrib.auth import logout
from django.utils.timezone import now
from goals.models import ReadingGoal
from books.models import Book


def account_logout(request) -> None:
    logout(request=request)
    return redirect("/")


# Create your views here.
@login_required
def account_profile(request) -> None:
    current_year = now().year
    context = {}

    goal = (
        ReadingGoal.objects.filter(user=request.user, year=current_year)
        .annotate(
            books_read_count=Count("books_read"),
            progress=Case(
                When(goal=0, then=Value(0)),
                default=F("books_read_count") * 100 / F("goal"),
                output_field=IntegerField(),
            ),
        )
        .first()
    )
    context["goal"] = goal

    books = (
        Book.objects.filter(approved=True, favorites=request.user)
        .annotate(likes_count=Count("likes"))
        .order_by("date_created")
    )
    paginator = Paginator(books, 25)

    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    context["books"] = books
    context["page_obj"] = page_obj

    if "HX-Request" in request.headers:
        return render(
            request,
            "partials/_recommendation_list.html",
            context=context,
        )

    return render(request, "accounts/profile.html", context=context)
