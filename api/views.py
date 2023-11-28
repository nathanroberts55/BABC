from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from books.models import Book
from .serializers import BookSerializer, CreateBookSerializer


# Create your views here.
def main(request):
    return HttpResponse({"message": "Hello API"})


class BookView(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class CreateBookView(APIView):
    serializer_class = CreateBookSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            title = serializer.data.get("title")
            author = serializer.data.get("author")
            isbn = serializer.data.get("isbn")
            source = serializer.data.get("source")
            submitter = serializer.data.get("submitter")
            stream_link = serializer.data.get("stream_link")

            book = Book(
                title=title,
                author=author,
                isbn=isbn,
                source=source,
                submitter=submitter,
                stream_link=stream_link,
            )

            book.save()

            return Response(BookSerializer(book).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
