from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import logout
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import BasicAuthentication
from books.models import Book
from .auth import CsrfExemptSessionAuthentication
from .serializers import BookSerializer, CreateBookSerializer, UserSerializer


# Create your views here.
def main(request):
    return HttpResponse({"message": "Hello API"})


class ListBooksView(generics.ListAPIView):
    # Return all the approved books
    queryset = Book.objects.filter(approved=True).all()
    serializer_class = BookSerializer

    def get_serializer_context(self):
        return {"request": self.request}


class SingleBookView(generics.RetrieveAPIView):
    queryset = Book.objects.filter(approved=True)
    serializer_class = BookSerializer
    lookup_field = "id"

    def get_serializer_context(self):
        return {"request": self.request}


class CreateBookView(generics.CreateAPIView):
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)
    serializer_class = CreateBookSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, status=status.HTTP_201_CREATED, headers=headers
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save()


class ListBookmarks(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        books = Book.objects.filter(favorites=request.user).all()
        context = {"request": request}
        return Response(
            BookSerializer(books, many=True, context=context).data,
            status=status.HTTP_200_OK,
        )

    def get_serializer_context(self, request):
        return {"request": request}


class FavoriteBook(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        book = get_object_or_404(Book, id=id)

        if book.favorites.filter(id=request.user.id).exists():
            book.favorites.remove(request.user)
        else:
            book.favorites.add(request.user)

        return Response(status=status.HTTP_204_NO_CONTENT)


class LikeBook(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        book = get_object_or_404(Book, id=id)

        if book.likes.filter(id=request.user.id).exists():
            book.likes.remove(request.user)
        else:
            book.likes.add(request.user)

        return Response(status=status.HTTP_204_NO_CONTENT)


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)

        return Response(serializer.data, status=status.HTTP_200_OK)


def LogoutView(request):
    logout(request)
    return HttpResponseRedirect("/")
