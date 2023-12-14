import React, { useState, useEffect } from 'react';
import Hero from '../accounts/Hero';
import Bookmarks from '../accounts/Bookmarks';
import testBooks from '../../../static/data/testBooks.json';

function AccountsPage() {
	type Book = {
		id: number;
		is_bookmarked: boolean;
		is_liked: boolean;
		num_likes: number;
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
	};

	const [bookmarks, setBookmarks] = useState<Book[]>([]);

	useEffect(() => {
		document.title = 'Big A Book Club | Profile';
	}, []);

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
