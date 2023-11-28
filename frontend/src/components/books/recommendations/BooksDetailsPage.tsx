import { useParams } from 'react-router-dom';
import BookDetails from './BookDetails';
import React from 'react';
import testBookData from '../../../../static/data/testBooks.json';

function BookDetailsPage() {
	const { id } = useParams<{ id: string }>();

	const book = testBookData.find((book) => book.id === Number(id));

	if (!book) {
		return <div>Book not found</div>;
	}

	return (
		<BookDetails
			recommendationsUrl={'/books/recommendations'}
			accountUrl={'/accounts/'}
			isAuthenticated={true}
			book={book}
			favoriteUrl={''}
			likeUrl={''}
		/>
	);
}

export default BookDetailsPage;
