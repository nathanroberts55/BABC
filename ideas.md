# Big A Book Club Website

## 1. Pages

- Home
  - Header Element
    - Button/Link to the Books Page
  - Explains the Website
    - What it is
    - Why
    - How it works?
- Books
  - Atrioc Reccomended (Confirmed Only)
    - Confirmed Reccomendations:
      - Clip from Chat with Reccomendation
  - Chat Reccomendations
    - User Submissions
- Submissions
  - Form to Submit Reccomendations

## 2. Books
### 2.1 Big A's Books
- Image of the Book Cover
- Title
- Author
- Amazon Affiliate Link to Book
- Twitch Link to Clip of Him Talking

### 2.2 Chat Books
- Image of the Book Cover
- Title
- Author
- Amazon Affiliate Link to Book
- Chatter's Handle

## 3. Nav Structure
- Home
- Books
  - Atrioc's Books
  - Chat's Books
- Submissions
  - Atrioc Submissions
  - Chat Submissions

## 4. Book Model Structure
- Title: str
- Author: str
- Submitter: str
- Source: Option/Choice (Chatter/Atrioc)
- Stream Link: URL/str
- Amazon Link: URL/str
- Approved: bool

## 5. Image Prompt
"Can you generate images similar in both the look and style of the reference image provided. Keeping the animated/cartoon drawing style. However, changing the main color to purple on a white background, without the references to calendars or writing. I would like the new content of the image to be..."