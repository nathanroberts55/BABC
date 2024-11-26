from django.shortcuts import render


def index(request):
    return render(request, "index.html")


def robots(request):
    return render(request, "robots.txt")
