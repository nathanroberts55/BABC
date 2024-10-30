import os
import requests
import logging
from dotenv import load_dotenv

load_dotenv()


def google_book_details(book):
    try:
        url = f"https://www.googleapis.com/books/v1/volumes?q=isbn:{book.isbn}"
        try:
            logging.info(f"Making Request for Book Details for {book.title} at: {url}")
            response = requests.get(url=url)
            data = response.json()
        except Exception as e:
            logging.error(f"Unable to get Book data from request: {e}")
            return None, None
        try:
            logging.info("Getting Books")
            items = data.get("items", [])
        except Exception as e:
            logging.error(f"Unable to get `item` from reponse data because error: {e}")
            return None, None

        if items:
            book_info = items[0]  # Get the first book from the list
            try:
                logging.info("Get the volumeInfo dictionary")
                volume_info = book_info.get("volumeInfo", {})
            except Exception as e:
                logging.error(f"Error getting the volumeInfo dictionary: {e}")

            try:
                logging.info(f"Attempting to retrieve {book.title} Description")
                description = volume_info.get("description", None)
                logging.info(f"Retrieved {book.title} Description")

                logging.info(f"Attempting to retrieve {book.title} Cover Image")
                imageLinks = volume_info.get("imageLinks", {})
                image_url = imageLinks.get("thumbnail", None)
                logging.info(f"Retrieved {book.title} Cover Image")

                return description, image_url
            except:
                logging.info(f"Unable to get Image or Description: {e}")
                return None, None
        else:
            logging.info(
                f"No Book Data Returned: Status Code - {response.status_code} | Message: {response.json().get('error', None).get('message')}"
            )
            return None, None

    except Exception as e:
        logging.error(f"Exception getting book details: {e}")
        return None, None


def google_book_search(encoded_search_term, search_key):
    api_key = os.getenv("GOOGLE_API_KEY")
    try:
        url = f"https://www.googleapis.com/books/v1/volumes?fields=items(volumeInfo(title,authors,industryIdentifiers,publishedDate))&q={search_key}:{encoded_search_term}&key={api_key}"
        try:
            logging.info(
                f"Making request for term = {encoded_search_term} in {search_key} at: {url}"
            )
            response = requests.get(url=url)
            data = response.json()
        except Exception as e:
            logging.error(f"Unable to get Book data from request: {e}")
            return None, None
        try:
            logging.info("Getting Books")
            items = data.get("items", [])
            if len(items) == 0:
                logging.warning("No books returned from request")
        except Exception as e:
            logging.error(f"Unable to get `item` from reponse data because error: {e}")
            return None, None

        books = []
        for item in items:
            volume_info = item.get("volumeInfo", {})
            title = volume_info.get("title", "No Title")
            publish_year = volume_info.get("publishedDate", [])
            authors = volume_info.get("authors", [])
            industry_identifiers = volume_info.get("industryIdentifiers", [])
            isbn13 = next(
                (
                    identifier["identifier"]
                    for identifier in industry_identifiers
                    if identifier["type"] == "ISBN_13"
                ),
                "N/A",
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

    except Exception as e:
        logging.error(f"Exception getting book details: {e}")
        return None, None
