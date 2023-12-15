from django.shortcuts import render


# Create your views here.
def index(request, *args, **kwargs):
    return render(request, "frontend/index.html")


def custom_404(request, exception):
    return render(request, "frontend/index.html", status=404)


def custom_403(request, exception):
    return render(request, "frontend/index.html", status=403)


def custom_500(request, exception=None):
    return render(request, "frontend/index.html", status=500)
