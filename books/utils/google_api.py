import requests
import logging


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
