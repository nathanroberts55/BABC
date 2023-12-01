import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

type Book = {
	id: number;
	is_bookmarked: boolean;
	is_liked: boolean;
	num_likes: number;
	source: string;
	title: string;
	author: string;
	submitter: string;
	stream_link?: string;
	amazon_link?: string;
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
				<Row
					key={book.id}
					className='align-items-center book-recommendation'
				>
					<Col
						lg={9}
						className='mx-auto'
					>
						<p className='lead display-6'>
							<a
								style={{ textDecoration: 'none', color: 'inherit' }}
								href={`/books/details/${book.id}`}
							>
								{book.title}
							</a>{' '}
							<small className='fs-5'> by {book.author}</small>
						</p>
						<p className='fw-lighter submitter'>
							{book.source === 'CHAT' && `Submitted by: ${book.submitter}`}
						</p>
						{book.source === 'ATRIOC' && book.stream_link && (
							<Button
								variant='primary'
								size='sm'
								href={book.stream_link}
								target='_blank'
								className='mx-1'
							>
								Twitch Stream
							</Button>
						)}
						{book.amazon_link && (
							<Button
								variant='outline-primary'
								size='sm'
								href={book.amazon_link}
								target='_blank'
								className='mx-1'
							>
								Buy on Amazon
							</Button>
						)}
						{index !== books.length - 1 && <hr />}
					</Col>
				</Row>
			))}
		</Container>
	);
}

export default Bookmarks;
