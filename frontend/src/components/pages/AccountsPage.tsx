import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../accounts/Hero';
import Bookmarks from '../accounts/Bookmarks';
import AuthContext from '../../contexts/authContext';

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

function AccountsPage() {
	const navigate = useNavigate();
	const { isAuthenticated } = useContext(AuthContext);

	useEffect(() => {
		if (!isAuthenticated) {
			navigate('/403');
		}
	}, [isAuthenticated, navigate]);

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
