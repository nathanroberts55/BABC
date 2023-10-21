const selectElement = document.getElementById('recommendations-select');

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

// Call the function immediately with the current select value
checkSelectValue(selectElement.value);

selectElement.addEventListener('change', (event) => {
	checkSelectValue(event.target.value);
});
