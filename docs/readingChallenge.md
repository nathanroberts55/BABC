# Reading Challenge Brainstorming

## ChatGPT Prompt

I have the following feature request for the big a book club website that I have been working on:

Reading Challenge
Feature Requested by AZ

The Request/Concept:
Alright so, for the New Year, in the book club I am planning to do a large scale literacy program where anyone- regardless of their participation in the book club discussions or not, can join in. The idea is that we want everyone to simply do one thing: Read more. With this in mind I'm planning to have people who wish to participate set a goal for the number of books they want to read for the 2024 year. Each person who participates is going to get a digital certificate that I am designing that will say something along the lines of "I got smarter everyday with the Big A Book Club!" and each time they finish a book I'm gonna add a gold star to their certificate. Nate has agreed to add functionality to the website that would allow users to track their books read but that won't be working at the launch of the literacy program but will be hopefully before Feb. I am also commissioning a bookmark to be made that I will be sending the image file to anyone who reaches their book goal by the end of the year which they can either print and cut out themselves, or get professionally printed. If financially feasible, I might consider printing and mailing them out personally as well but that is only a maybe. Overall I just have a deep commitment to the joys of reading, curiosity, and learning and I really hope to make this a big thing in the server even if people only decide that they have the bandwidth to read 1 or 2 books next year. With the book club doing a monthly book selection, I'm hoping that at least gets people to consider hitting 12 books for 2024!

Nate is there a way that you could make a reading goal that people can set for themselves on their profile on the website? If that would be too much work (I know there's a lot on your plate) don't worry about it, I can figure out a less pretty way to do it on Google sheets/forms or just do honor system.

User Stories
- As a User, I want to be able to read details about what the "Get Smarter: Reading Challenge" is and how to join
- As a User, I want to be able to enroll in the "Get Smarter: Reading Challenge"
- As a User, I want to be able to set a reading goal for the year for the "Get Smarter: Reading Challenge"
- As a User, I want to be able to add books that I have completed towards my goal as part of the "Get Smarter: Reading Challenge"
- As a User, I want to be able to access/download my certificate when I complete my "Get Smarter: Reading Challenge" reading goal I created for myself.
- As a Program Manager, I want to be able to upload the certificate design/template.

The application is made within a django project and had a django rest framework API and a react frontend. I want to start with the backend, currently I have a model called Books that looks like this:

    class Book(models.Model):
        class Sources(models.TextChoices):
            CHAT = "CHAT", _("Chatter")
            ATRIOC = "ATRIOC", _("Atrioc")

        date_created = models.DateTimeField(auto_now_add=True)
        date_modified = models.DateTimeField(auto_now=True)
        title = models.CharField(max_length=250)
        author = models.CharField(max_length=50)
        isbn = models.CharField(max_length=50)
        source = models.CharField(
            max_length=6,
            choices=Sources.choices,
            default=Sources.CHAT,
            help_text=_("Select Chatter or Atrioc Recommendation"),
        )
        submitter = models.CharField(max_length=50, blank=True)
        stream_link = models.URLField(max_length=500, blank=True)
        amazon_link = models.URLField(max_length=500, blank=True)
        approved = models.BooleanField(default=False)
        favorites = models.ManyToManyField(
            User, related_name="favorite", default=None, blank=True
        )
        likes = models.ManyToManyField(User, related_name="like", default=None, blank=True)

## Models
- Challenges are annual, meaning that they start and begin in a calendar year. So I would like it so that only one challenge per user per year can exist.
- Books on the site are mostly stored and used as recommendations. So users may read books for their challenge that they may not want to post as recommendations. Books for the challenge and books for recommendations should be able to be differentiated.

```python
class ChallengeBook(models.Model):
    title = models.CharField(max_length=250)
    author = models.CharField(max_length=50)
    isbn = models.CharField(max_length=50, blank=True)

class ReadingChallenge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    year = models.PositiveIntegerField(default=datetime.now().year)
    goal = models.PositiveIntegerField(default=0)
    books_read = models.ManyToManyField(ChallengeBook, blank=True)
    certificate = models.ImageField(upload_to='certificates/', blank=True, null=True)

    class Meta:
        unique_together = ('user', 'year')

    def add_book(self, book):
        self.books_read.add(book)
        self.save()

    def is_goal_reached(self):
        return self.books_read.count() >= self.goal
```
In this updated model:
- `user` is a foreign key to the User model, which links each challenge to a specific user.
- `goal` is the number of books the user wants to read in the year.
- `books_read` is a many-to-many relationship with the Book model, allowing users to add books they’ve read.
- `certificate` is an image field where you can upload the certificate for the user.
- The `add_book` method allows you to add a book to the `books_read` field, and `is_goal_reached` checks if the user has reached their reading goal.
- `ChallengeBook` is a new model to store books read for the challenge. This allows you to differentiate between books for the challenge and books for recommendations.
- `year` is added to the ReadingChallenge model to indicate the year of the challenge.
- The `Meta` class inside `ReadingChallenge` ensures that only one challenge per user per year can exist by making the combination of `user` and `year` unique.


- Earlier I mentioned that not all users are going to do a challenge so we shouldn't create one for everyone by default. However, I want to have a frontend component that lets a user opt in. When that happens, on the backend can you give me an example of creating a new Reading Challenge for them?

```python 
from django.utils.timezone import now

def create_reading_challenge(user):
    current_year = now().year
    challenge, created = ReadingChallenge.objects.get_or_create(user=user, year=current_year)
    if created:
        print(f"Created new ReadingChallenge for {user.username} for {current_year}")
    else:
        print(f"ReadingChallenge already exists for {user.username} for {current_year}")
    return challenge
```
In this function:

- `get_or_create` is a Django method that tries to get an object from the database based on the provided parameters (user and year in this case). If the object doesn’t exist, it creates a new one. It returns a tuple of (object, created), where object is the retrieved or created object, and created is a boolean that is True if a new object was created and False if the object already existed.
- If a new `ReadingChallenge` was created, a message is printed to the console. If a `ReadingChallenge` already existed for the user for the current year, a different message is printed.
On the frontend, you can make an API call to a corresponding endpoint that uses this function when a user opts in to the reading challenge.

## Views
- That's exactly what I was thinking, if on the frontend I wanted to check whether a user has "accepted" the challenge or not how would I do that? I assume that I would need to make a query to the ReadingChallenge table to see if they have one associated with their account or not?
```python 
from django.utils.timezone import now

def has_accepted_challenge(user):
    current_year = now().year
    return ReadingChallenge.objects.filter(user=user, year=current_year).exists()

```
- Going back to the backend, you suggested a ChallengeBook model to help deilinate the challenge books from the other books on the site. It is possible that users can read the same challenge book. But I don't want to create a new challenge book if a book with the same title and author already exists, in that case the user should just be associated with the already created book. And in the case the book is new (not in the database) THEN a new challenge book should be created. What would the implementation for something like that look like?
```python 
def add_challenge_book(user, title, author):
    # Try to get the book from the database
    book, created = ChallengeBook.objects.get_or_create(
        title=title,
        author=author,
    )

    # Get the user's reading challenge for the current year
    challenge = ReadingChallenge.objects.get(user=user, year=datetime.now().year)

    # Add the book to the user's challenge
    challenge.books_read.add(book)
    challenge.save()

```
In this function:
- `get_or_create` is a Django method that tries to get an object from the database based on the provided parameters (`title` and `author` in this case). If the object doesn’t exist, it creates a new one. It returns a tuple of `(object, created)`, where object is the retrieved or created object, and created is a boolean that is True if a new object was created and False if the object already existed.
- `challenge` is the user’s `ReadingChallenge` for the current year.
- The `add` method is used to add the book to the user’s challenge.
This way, you avoid creating duplicate `ChallengeBook` instances when multiple users read the same book.

## Frontend

### Progress Bar Component
[React Bootstrap Progress Bar | Documentation](https://react-bootstrap.github.io/docs/components/progress/)
```javascript
import React from 'react';
import { ProgressBar } from 'react-bootstrap';

interface ReadingProgressProps {
  current: number;
  goal: number;
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({ current, goal }) => {
  const progress = (current / goal) * 100;

  return (
    <div>
      <h3>Your Reading Progress</h3>
      <ProgressBar now={progress} label={`${current}/${goal}`} />
    </div>
  );
};

export default ReadingProgress;

```