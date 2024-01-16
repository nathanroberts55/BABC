import React, { useContext, useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { ReadingGoalBook } from '../ReadingGoal';

interface BookListProps {
	book: ReadingGoalBook;
}

function BookListItem(props: BookListProps) {
	const { book } = props;

	return (
		<Row
			className='align-items-center book-recommendation'
			key={book.id}
		>
			<Col
				lg={9}
				className='mx-auto'
			>
				<p className='lead display-6'>
					{/* <Link
						style={{ textDecoration: 'none', color: 'inherit' }}
						to={`/books/details/${book.id}`}
					> */}
					{book.title}
					{/* </Link> */}
					<small className='fs-5'> by {book.author}</small>
				</p>
				<hr />
			</Col>
		</Row>
	);
}

export default BookListItem;
