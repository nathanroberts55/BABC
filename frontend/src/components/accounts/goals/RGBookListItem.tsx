import React, { useContext, useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { ReadingGoalBook } from '../ReadingGoal';

interface BookListProps {
	book: ReadingGoalBook;
}

function BookListItem(props: BookListProps) {
	const { book } = props;

	return (
		<Container fluid>
			<Row
				className='align-items-center book-recommendation'
				key={book.id}
			>
				<Col
					lg={12}
					className='mx-auto'
				>
					<p className='display-6'>
						{book.title}
						<small className='fs-5'> by {book.author}</small>
					</p>
					<hr />
				</Col>
			</Row>
		</Container>
	);
}

export default BookListItem;
