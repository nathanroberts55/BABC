import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import BookDetails from '../books/recommendations/BookDetails';
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

function BookDetailsPage() {
	const { id } = useParams<{ id: string }>();

	const { isAuthenticated } = useContext(AuthContext);

	const [book, setBook] = useState<Book>();

	useEffect(() => {
		fetch(`/api/books/${id}`)
			.then((response) => response.json())
			.then((data) => setBook(data))
			.catch((error) => console.error('Error:', error));
	}, []);

	if (!book) {
		return <div>Book not found</div>;
	}

	return <BookDetails book={book} />;
}

export default BookDetailsPage;
