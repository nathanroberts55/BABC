import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import BookListItem from '../common/BookListItem';

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

type BookmarksProps = {
	books: Book[];
};

function Bookmarks({ books }: BookmarksProps) {
	return (
		<Container className='px-4 pb-5'>
			<Col
				lg={8}
				className='mx-auto text-center'
			>
				<Col
					lg={6}
					className='mx-auto'
				>
					<p className='display-6 mb-4'>Your Bookmarks</p>
				</Col>
			</Col>
			{books.map((book, index) => (
				<BookListItem book={book} />
			))}
		</Container>
	);
}

export default Bookmarks;
