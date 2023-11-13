const selectElement = document.getElementById('recommendations-select');
const recommendationSearchBar = document.getElementById('recommendationSearch');

const checkSelectValue = (value) => {
	const books = document.querySelectorAll('div.book-recommendation');
	if (value === 'CHAT') {
		books.forEach((book) => {
			if (book.getAttribute('data-source') !== value) {
				book.style.display = 'none';
			} else {
				book.style.display = '';
			}
		});
	} else if (value === 'ATRIOC') {
		books.forEach((book) => {
			if (book.getAttribute('data-source') !== value) {
				book.style.display = 'none';
			} else {
				book.style.display = '';
			}
		});
	}
};

const filterRecommendations = (value) => {
	const searchKeyValue = document.getElementById(
		'recommendationSearchKey'
	).value;
	const sourceValue = selectElement.value;
	const books = document.querySelectorAll('div.book-recommendation');
	books.forEach((book) => {
		if (book.getAttribute('data-source') !== sourceValue) {
			book.style.display = 'none';
		} else if (
			searchKeyValue === 'title' &&
			!book.getAttribute('data-title').includes(value)
		) {
			book.style.display = 'none';
		} else if (
			searchKeyValue === 'author' &&
			!book.getAttribute('data-author').includes(value)
		) {
			book.style.display = 'none';
		} else if (
			searchKeyValue === 'submitter' &&
			!book.getAttribute('data-submitter').includes(value)
		) {
			book.style.display = 'none';
		} else {
			book.style.display = '';
		}
	});
};

// Call the function immediately with the current select value
checkSelectValue(selectElement.value);

selectElement.addEventListener('change', (event) => {
	checkSelectValue(event.target.value);
});

recommendationSearchBar.addEventListener('input', (event) => {
	filterRecommendations(event.target.value);
});
