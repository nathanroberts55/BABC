import React, { useContext, useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { ReadingGoalBook } from '../ReadingGoal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

interface BookListProps {
	book: ReadingGoalBook;
	onDeleteBook: (bookId: number) => void;
}

function BookListItem({ book, onDeleteBook }: BookListProps) {
	return (
		<Container fluid>
			<Row
				className='align-items-center book-recommendation'
				key={book.id}
			>
				<Col
					lg={11}
					className='mx-auto'
				>
					<p className='display-6'>
						{book.title}
						<small className='fs-5'> by {book.author}</small>
					</p>
				</Col>
				<Col
					lg={1}
					className='mx-auto'
				>
					<Button
						variant='link'
						size='lg'
						className='px-2 mx-1'
						onClick={() => onDeleteBook(book.id)}
					>
						<FontAwesomeIcon icon={faTrashCan} />
					</Button>
				</Col>
				<hr />
			</Row>
		</Container>
	);
}

export default BookListItem;
