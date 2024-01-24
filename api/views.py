from django.shortcuts import render, get_object_or_404
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.contrib.auth import logout
from django.utils.timezone import now
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import BasicAuthentication
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


class CurrentlyReadingBook(generics.RetrieveAPIView):
    queryset = Book.objects.filter(approved=True, currently_reading=True)
    serializer_class = BookSerializer

    def get_object(self):
        # return the first book in the queryset, or raise a 404 error if empty
        return self.get_queryset().first()


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


class UpdateReadingGoalView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

    def patch(self, request):
        current_year = now().year
        goal = ReadingGoal.objects.filter(user=request.user, year=current_year).first()
        if goal:
            serializer = ReadingGoalSerializer(
                goal, data=request.data, partial=True
            )  # set partial=True to update a data partially
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
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


class DeleteReadingGoalView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

    def get_object(self, pk):
        try:
            return ReadingGoal.objects.get(pk=pk)
        except ReadingGoal.DoesNotExist:
            raise Http404

    def delete(self, request, pk, format=None):
        goal = self.get_object(pk)
        if goal.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

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

        return Response({"has_goal": False}, status=status.HTTP_200_OK)


class UserReadingGoalBooksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_year = now().year
        goal = ReadingGoal.objects.filter(user=request.user, year=current_year).first()
        if goal:
            serializer = ReadingGoalBookSerializer(goal.books_read.all(), many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "No ReadingGoal found for this year"},
                status=status.HTTP_404_NOT_FOUND,
            )


class AddReadingGoalBookView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

    def post(self, request):
        title = request.data.get("title")
        author = request.data.get("author")
        book, created = ReadingGoalBook.objects.get_or_create(
            title=title, author=author
        )
        if created:
            serializer = ReadingGoalBookSerializer(book, data=request.data)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        goal = ReadingGoal.objects.filter(user=request.user, year=now().year).first()
        if goal:
            goal.add_book(book)
            return Response(
                ReadingGoalBookSerializer(book).data, status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                {"error": "No ReadingGoal found for this year"},
                status=status.HTTP_404_NOT_FOUND,
            )


class DeleteReadingGoalBookView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

    def get_object(self, pk):
        try:
            return ReadingGoalBook.objects.get(pk=pk)
        except ReadingGoalBook.DoesNotExist:
            raise Http404

    def delete(self, request, pk, format=None):
        book = self.get_object(pk)
        goal = ReadingGoal.objects.filter(user=request.user, year=now().year).first()
        if goal:
            if book in goal.books_read.all():
                goal.books_read.remove(book)  # remove the association
                goal.save()
                if (
                    not book.readinggoal_set.exists()
                ):  # if no other user has read this book
                    book.delete()  # delete the book
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(
                    {"error": "The book is not in the user's reading goal"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
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
