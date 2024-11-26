import requests
import logging


def openlib_book_search(encoded_search_term, search_key):
    try:
        url = f"https://openlibrary.org/search.json?fields=title,author_name,first_publish_year,isbn&{search_key}={encoded_search_term}"
        logging.info(f"Requesting to OpenLibraryAPI Url: {url}")
        response = requests.get(url=url)
        data = response.json()
        logging.info(f"Retrieved Data from: {url}")
    except Exception as e:
        logging.error(f"Failed to get Request from {url}: {e}")
        return

    books = []
    items = data["docs"]

    for item in items:
        title = item.get("title", "")
        publish_year = item.get("first_publish_year", [])
        authors = item.get("author_name", [])
        isbns = item.get("isbn", [])
        # Find a 13-digit ISBN if available
        isbn13 = next(
            (isbn for isbn in isbns if len(isbn) == 13), isbns[0] if isbns else ""
        )

        books.append(
            {
                "title": title,
                "authors": authors,
                "isbn": isbn13,
                "publish_year": publish_year,
            }
        )

    return books
