const selectElement = document.getElementById('form-book-source');
const streamLinkInput = document.getElementById('form-book-streamlink');
const submitterInput = document.getElementById('form-book-submitter');

const checkSelectValue = (value) => {
	if (value === 'CHAT') {
		streamLinkInput.style.display = 'none';
		streamLinkInput.removeAttribute('required'); // remove required from streamLinkInput
		submitterInput.style.display = '';
		submitterInput.setAttribute('required', ''); // add required to submitterInput
	} else if (value === 'ATRIOC') {
		submitterInput.style.display = 'none';
		submitterInput.removeAttribute('required'); // remove required from submitterInput
		streamLinkInput.style.display = '';
		streamLinkInput.setAttribute('required', ''); // add required to streamLinkInput
	}
};

// Call the function immediately with the current select value
checkSelectValue(selectElement.value);

selectElement.addEventListener('change', (event) => {
	checkSelectValue(event.target.value);
});
