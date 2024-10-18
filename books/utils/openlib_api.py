import requests
import logging


def openlib_book_details(encoded_search_term, search_key):
    try:
        url = f"https://openlibrary.org/search.json?&{search_key}={encoded_search_term}"
        logging.info(f"Requesting to OpenLibraryAPI Url: {url}")
        response = requests.get(url=url)
        data = response.json()
        logging.info(f"Retrieved Data from: {url}")
    except Exception as e:
        logging.error(f"Failed to get Request from {url}: {e}")
        return

    books = data["docs"]
    unique_books = {book["title"]: book for book in books}.values()

    return unique_books
