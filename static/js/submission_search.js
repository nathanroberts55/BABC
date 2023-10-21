const searchBar = document.querySelector('#dropdownMenuButton');
const dropdownMenu = document.querySelector('#dropdownMenu');
const titleInput = document.querySelector('#form-book-title');
const authorInput = document.querySelector('#form-book-author');
const isbnInput = document.querySelector('#form-book-isbn');

searchBar.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
		// Clear the dropdown, to avoid adding the same titles multiple times.
		while (dropdownMenu.firstChild) {
			dropdownMenu.removeChild(dropdownMenu.firstChild);
		}

		let searchTerm = e.target.value;
		encodedSearchTerm = searchTerm.replace(/ /g, '+');

		fetch(`https://openlibrary.org/search.json?&title=${encodedSearchTerm}`)
			.then((res) => res.json())
			.then((data) => {
				const books = data.docs;
				// Most books have many titles (captilizations, etc.), filtering out books by unique titles
				const uniqueBooks = books.filter(
					(book, index, self) =>
						index === self.findIndex((b) => b.title === book.title)
				);

				uniqueBooks.forEach((book) => {
					// Create the New List Item
					const newOption = document.createElement('li');
					newOption.classList.add('dropdown-item');

					// Set the texxt content to info about the book: {title} by {author} | {published date}
					newOption.textContent = `${book.title} by ${book.author_name} | ${book.publish_year[0]}`;

					// Add data attributes that will be used later to save to database
					newOption.setAttribute('data-title', book.title);
					newOption.setAttribute('data-author', book.author_name);
					newOption.setAttribute('data-isbn', book.isbn[0]);

					// Add event listener to each new option
					newOption.addEventListener('click', (e) => {
						// Update the search bar with the selected option text
						searchBar.value = e.target.textContent;

						// Update hidden form values with the data attributes that will be used to save to the database
						titleInput.value = e.target.getAttribute('data-title');
						authorInput.value = e.target.getAttribute('data-author');
						isbnInput.value = e.target.getAttribute('data-isbn');

						/*
				    Eventually want to be able to show a preview of the book cover for book selected.
					However, the current API's that I have been using are very inconsistent with 
					returning usable image sources.
					*/

						// TODO: Update image source and remove hidden property
						// const coverImage = document.querySelector('#cover-image img');
						// coverImage.src = `https://covers.openlibrary.org/b/isbn/${e.target.getAttribute(
						// 	'data-isbn'
						// )}-m.jpg`;
						// coverImage.hidden = '';

						// TODO: Update book title and author
						// document.querySelector('#selected-book-title').textContent =
						// 	e.target.getAttribute('data-title');
						// document.querySelector('#selected-book-author').textContent =
						// 	e.target.getAttribute('data-author');
					});
					dropdownMenu.appendChild(newOption);
				});
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}
});
