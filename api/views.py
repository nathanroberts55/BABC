from django.http import HttpResponse
from rest_framework import generics
from django.shortcuts import render
from books.models import Book
from .serializers import BookSerializer


# Create your views here.
def main(request):
    return HttpResponse({"message": "Hello API"})


class BookView(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
