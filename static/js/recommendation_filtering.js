const selectElement = document.getElementById('recommendations-select');
const recommendationSearchBar = document.getElementById('recommendationSearch');
const sortElement = document.getElementById('recommendations-sort');

const checkSelectValue = (value) => {
	const books = document.querySelectorAll('div.book-recommendation');
	const submitterOption = document.querySelector(
		'#recommendationSearchKey option[value="submitter"]'
	);

	if (value === 'CHAT') {
		submitterOption.style.display = '';
		books.forEach((book) => {
			if (book.getAttribute('data-source') !== value) {
				book.style.display = 'none';
			} else {
				book.style.display = '';
			}
		});
	} else if (value === 'ATRIOC') {
		submitterOption.style.display = 'none';
		books.forEach((book) => {
			if (book.getAttribute('data-source') !== value) {
				book.style.display = 'none';
			} else {
				book.style.display = '';
			}
		});
	}
};

const sortBooks = (books) => {
	if (!sortElement) return books; // If sortElement is null, stop the function
	const sortOption = sortElement.value;
	if (sortOption === 'title') {
		books.sort(function (a, b) {
			var titleA = a.getAttribute('data-title').toLowerCase();
			var titleB = b.getAttribute('data-title').toLowerCase();
			if (titleA < titleB) return -1;
			if (titleA > titleB) return 1;
			return 0;
		});
	} else if (sortOption === 'likes') {
		books.sort(function (a, b) {
			var likesA = parseInt(a.getAttribute('data-likes'));
			var likesB = parseInt(b.getAttribute('data-likes'));
			return likesB - likesA;
		});
	}
	return books;
};

const filterRecommendations = (inputValue) => {
	const value = inputValue.toLowerCase();
	const searchKeyValue = document.getElementById(
		'recommendationSearchKey'
	).value;
	const sourceValue = selectElement.value;
	const books = Array.from(
		document.querySelectorAll('div.book-recommendation')
	);
	let visibleBooks = [];
	var container = document.querySelector('#book_list');
	books.forEach((book) => {
		if (book.getAttribute('data-source') !== sourceValue) {
			book.style.display = 'none';
		} else if (
			value !== '' &&
			((searchKeyValue === 'title' &&
				!book.getAttribute('data-title').toLowerCase().includes(value)) ||
				(searchKeyValue === 'author' &&
					!book.getAttribute('data-author').toLowerCase().includes(value)) ||
				(searchKeyValue === 'submitter' &&
					!book.getAttribute('data-submitter').toLowerCase().includes(value)))
		) {
			book.style.display = 'none';
		} else {
			book.style.display = '';
			visibleBooks.push(book);
		}
	});

	visibleBooks = sortBooks(visibleBooks);

	visibleBooks.forEach((book) => {
		container.appendChild(book);
	});
};

// Call the function immediately with the current select value
checkSelectValue(selectElement.value);

selectElement.addEventListener('change', (event) => {
	checkSelectValue(event.target.value);
	filterRecommendations(recommendationSearchBar.value);
});

recommendationSearchBar.addEventListener('input', (event) => {
	filterRecommendations(event.target.value);
});

if (sortElement) {
	sortElement.addEventListener('change', () => {
		filterRecommendations(recommendationSearchBar.value);
	});
}
