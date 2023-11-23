window.onbeforeunload = function () {
	sessionStorage.setItem('scrollPosition', window.scrollY);
};

window.onload = function () {
	if (sessionStorage.getItem('scrollPosition') !== null) {
		window.scroll(0, sessionStorage.getItem('scrollPosition'));
	}
};
