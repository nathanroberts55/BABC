function handleSourceChange() {
	const source = document.getElementById('form-book-source').value;
	const submitterInput = document.getElementById('form-book-submitter');
	const streamlinkInput = document.getElementById('form-book-streamlink');

	if (source === 'CHAT') {
		streamlinkInput.classList.add('hidden');
		streamlinkInput.required = false;
		submitterInput.classList.remove('hidden');
		submitterInput.required = true;
	} else if (source === 'ATRIOC' || source === 'LEMONADESTAND') {
		submitterInput.classList.add('hidden');
		submitterInput.required = false;
		streamlinkInput.classList.remove('hidden');
		streamlinkInput.required = true;
	}
}

document.addEventListener('DOMContentLoaded', function () {
	handleSourceChange();
});

document.body.addEventListener('htmx:load', () => {
	handleSourceChange();
});

document.body.addEventListener('htmx:afterRequest', (event) => {
	console.log('HTMX after request:', event.detail);
	if (event.detail.successful && event.detail.requestConfig.verb === 'post') {
		document.getElementById('search-value').value = '';
	}
});
