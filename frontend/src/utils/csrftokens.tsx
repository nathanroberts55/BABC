export default function getCookie(name: string): string | null {
	let cookieValue: string | null = null;
	if (document.cookie && document.cookie !== '') {
		const cookies: Array<string> = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie: string = cookies[i].trim();
			if (cookie.substring(0, name.length + 1) === name + '=') {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}
