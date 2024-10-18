document.addEventListener('DOMContentLoaded', function () {
	const searchBar = document.querySelector('#search-value');
	const titleInput = document.querySelector('#form-book-title');
	const authorInput = document.querySelector('#form-book-author');
	const isbnInput = document.querySelector('#form-book-isbn');
	const submitButton = document.querySelector('#submit-button');

	htmx.onLoad(function (content) {
		const items = content.querySelectorAll('.menu-item');
		items.forEach((item) => {
			item.addEventListener('click', function (e) {
				searchBar.value = this.innerText;
				titleInput.value = this.getAttribute('data-title');
				authorInput.value = this.getAttribute('data-author');
				isbnInput.value = this.getAttribute('data-isbn');
				submitButton.classList.remove('btn-disabled');
			});
		});
	});
});
