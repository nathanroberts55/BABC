import React, { useContext, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as fasThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as farThumbsUp } from '@fortawesome/free-regular-svg-icons';
import AuthContext from '../../contexts/authContext';
import getCookie from '../../utils/csrftokens';

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

interface BookListProps {
	book: Book;
}

function BookListItem(props: BookListProps) {
	const { book } = props;
	const { isAuthenticated } = useContext(AuthContext);
	const [liked, setLiked] = useState(book.is_liked);
	const [numLikes, setNumLikes] = useState(book.num_likes);

	const handleLike = async () => {
		let csrftoken: string | null = getCookie('csrftoken');

		if (csrftoken === null) {
			// Handle the error here. For example, you can throw an error:
			throw new Error('CSRF token not found');
		}

		const response = await fetch(`/api/books/like/${book.id}/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrftoken,
				// include your authentication headers, e.g. Bearer token
			},
		});
		if (response.status === 204) {
			if (!liked) {
				setNumLikes(numLikes + 1);
			} else {
				setNumLikes(numLikes - 1);
			}
			setLiked(!liked);
		}
	};

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
					<a
						style={{ textDecoration: 'none', color: 'inherit' }}
						href={`/books/details/${book.id}`}
					>
						{book.title}
					</a>
					<small className='fs-5'> by {book.author}</small>
				</p>
				<p className='fw-lighter submitter'>
					{book.source === 'CHAT' && `Submitted by: ${book.submitter}`}
				</p>
				<div className='d-flex align-items-center'>
					{book.stream_link && (
						<a
							href={book.stream_link}
							target='_blank'
							rel='noopener noreferrer'
						>
							<Button
								variant='primary'
								size='sm'
								className='mx-1'
							>
								Twitch Stream
							</Button>
						</a>
					)}
					{book.amazon_link !== '' && (
						<a
							href={book.amazon_link}
							target='_blank'
							rel='noopener noreferrer'
						>
							<Button
								variant='outline-primary'
								size='sm'
								className='mx-1'
							>
								Buy on Amazon
							</Button>
						</a>
					)}
					{/* You can replace `user.isAuthenticated` with the actual authentication status */}
					{isAuthenticated && (
						<>
							<Button
								variant='link'
								className='btn-md px-2 mx-1'
								onClick={handleLike}
							>
								<FontAwesomeIcon icon={liked ? fasThumbsUp : farThumbsUp} />
							</Button>
							{numLikes}
						</>
					)}
				</div>
				<hr />
			</Col>
		</Row>
	);
}

export default BookListItem;
