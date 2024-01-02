import React, { useContext, useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { ReadingGoalBooks } from '../accounts/ReadingGoal';
// import Button from 'react-bootstrap/Button';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faThumbsUp as fasThumbsUp } from '@fortawesome/free-solid-svg-icons';
// import { faThumbsUp as farThumbsUp } from '@fortawesome/free-regular-svg-icons';
// import AuthContext from '../../contexts/authContext';
// import getCookie from '../../utils/csrftokens';
// import { Link } from 'react-router-dom';

interface BookListProps {
	book: ReadingGoalBooks;
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
