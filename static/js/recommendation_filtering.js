const selectElement = document.getElementById('recommendations-select');
const recommendationSearchBar = document.getElementById('recommendationSearch');

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

const filterRecommendations = (inputValue) => {
	const value = inputValue.toLowerCase();
	const searchKeyValue = document.getElementById(
		'recommendationSearchKey'
	).value;
	const sourceValue = selectElement.value;
	const books = document.querySelectorAll('div.book-recommendation');
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
