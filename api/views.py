from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import logout
from django.utils.timezone import now
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import BasicAuthentication
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from books.models import Book
from goals.models import ReadingGoal, ReadingGoalBook
from .auth import CsrfExemptSessionAuthentication
from .serializers import (
    BookSerializer,
    CreateBookSerializer,
    UserSerializer,
    ReadingGoalSerializer,
    ReadingGoalBookSerializer,
)


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening


# Create your views here.
def main(request):
    return HttpResponse({"message": "Hello API"})


# Book Views
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


# Goals Views
class ReadingGoalView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_year = now().year
        goal = ReadingGoal.objects.filter(user=request.user, year=current_year).first()
        if goal:
            serializer = ReadingGoalSerializer(goal)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"has_goal": False}, status=status.HTTP_200_OK)

    def patch(self, request):
        current_year = now().year
        goal = ReadingGoal.objects.filter(user=request.user, year=current_year).first()
        if goal:
            serializer = ReadingGoalSerializer(
                goal, data=request.data, partial=True
            )  # set partial=True to update a data partially
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(
                {"error": "No ReadingGoal found for this year"},
                status=status.HTTP_404_NOT_FOUND,
            )


class CreateReadingGoalView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

    def post(self, request):
        current_year = now().year
        goal, created = ReadingGoal.objects.get_or_create(
            user=request.user, year=current_year
        )
        serializer = ReadingGoalSerializer(goal)
        if created:
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.data, status=status.HTTP_200_OK)


class UserReadingGoalBooksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_year = now().year
        goal = ReadingGoal.objects.filter(user=request.user, year=current_year).first()
        if goal:
            serializer = ReadingGoalBookSerializer(goal.books_read.all(), many=True)
            return Response(serializer.data)
        else:
            return Response(
                {"error": "No ReadingGoal found for this year"},
                status=status.HTTP_404_NOT_FOUND,
            )


# Authentication Views
class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)

        return Response(serializer.data, status=status.HTTP_200_OK)


def LogoutView(request):
    logout(request)
    return HttpResponseRedirect("/")
