import React, { useState, useEffect } from 'react';
import Hero from '../accounts/Hero';
import Bookmarks from '../accounts/Bookmarks';
import testBooks from '../../../static/data/testBooks.json';

function AccountsPage() {
	type Book = {
		id: number;
		date_created: string;
		date_modified: string;
		title: string;
		author: string;
		isbn: string;
		source: string;
		submitter: string;
		stream_link?: string;
		amazon_link: string;
		approved: boolean;
		favorites: number[];
		likes: number[];
	};

	const [bookmarks, setBookmarks] = useState<Book[]>([]);

	useEffect(() => {
		fetch('/api/books/bookmarks')
			.then((response) => response.json())
			.then((data) => setBookmarks(data));
	}, []);

	return (
		<>
			<Hero />
			<Bookmarks books={bookmarks} />
		</>
	);
}

export default AccountsPage;
