import React, { useState, useEffect, useContext } from 'react';
import { useQuery } from 'react-query';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faThumbsUp as fasThumbsUp,
	faBookmark as fasBookmark,
	faArrowLeft,
	faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import {
	faThumbsUp as farThumbsUp,
	faBookmark as farBookmark,
} from '@fortawesome/free-regular-svg-icons';
import AuthContext from '../../../contexts/authContext';
import getCookie from '../../../utils/csrftokens';
import { Link } from 'react-router-dom';

interface BookDetailsProps {
	book: {
		is_bookmarked: boolean;
		is_liked: boolean;
		num_likes: number;
		title: string;
		author: string;
		stream_link?: string;
		amazon_link?: string;
		isbn?: string;
		id: number;
	};
}

interface Context {
	description: string | null;
	image_url: string | null;
}

const fetchBookDetails = async (isbn: string) => {
	const response = await fetch(
		`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
	);
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}
	return response.json();
};

function BookDetails(props: BookDetailsProps) {
	const { book } = props;

	const { isAuthenticated } = useContext(AuthContext);

	const [liked, setLiked] = useState(book.is_liked);
	const [bookmarked, setBookmarked] = useState(book.is_bookmarked);
	const [context, setContext] = useState<Context>({
		description: null,
		image_url: null,
	});

	const { data, isLoading, isError } = useQuery(
		['bookDetails', book.isbn!],
		() => fetchBookDetails(book.isbn!)
	);

	useEffect(() => {
		if (data) {
			const items = data.items || [];
			if (items.length > 0) {
				const bookInfo = items[0];
				const volumeInfo = bookInfo.volumeInfo || {};
				const description = volumeInfo.description || null;
				const imageLinks = volumeInfo.imageLinks || {};
				const imageUrl = imageLinks.thumbnail || null;

				setContext({ description, image_url: imageUrl });
			} else {
				setContext({ description: null, image_url: null });
			}
		}
	}, [data]);

	const handleFavorite = async () => {
		let csrftoken: string | null = getCookie('csrftoken');

		if (csrftoken === null) {
			// Handle the error here. For example, you can throw an error:
			throw new Error('CSRF token not found');
		}

		const response = await fetch(`/api/books/favorite/${book.id}/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrftoken,
				// include your authentication headers, e.g. Bearer token
			},
		});
		if (response.status === 204) {
			setBookmarked(!bookmarked);
		}
	};

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
			setLiked(!liked);
		}
	};

	return (
		<Container
			fluid
			className='px-4 pb-5'
		>
			<Row className='px-4 my-5'>
				<Col
					lg={8}
					className='mx-auto d-flex align-items-center justify-content-between'
				>
					<Button
						href={'/books/recommendations/'}
						variant='primary'
					>
						<FontAwesomeIcon icon={faArrowLeft} /> Recommendations
					</Button>
					{isAuthenticated && (
						<Link to='/accounts'>
							<Button variant='primary'>
								<FontAwesomeIcon icon={faArrowRight} /> Profile
							</Button>
						</Link>
					)}
				</Col>
			</Row>
			<Row className='px-4 p-5 my-5 text-center'>
				<Col
					lg={8}
					className='mx-auto'
				>
					{context.image_url && (
						<div id='cover-image-div'>
							<Image
								src={context.image_url}
								alt='Cover Image Art'
								width='150px'
							/>
						</div>
					)}
					<p
						className='display-5 fw-bold text-body-emphasis'
						id='title'
					>
						{book.title}
					</p>
					<p
						className='lead'
						id='author'
					>
						{book.author}
					</p>
					<Row>
						<Col
							lg={6}
							className='mx-auto mb-3'
						>
							{book.stream_link && (
								<Button
									href={book.stream_link}
									target='_blank'
									variant='primary'
									size='sm'
									className='mx-2'
								>
									Twitch Stream
								</Button>
							)}
							{book.amazon_link && (
								<Button
									href={book.amazon_link}
									target='_blank'
									variant='outline-primary'
									size='sm'
									className='mx-2'
								>
									Buy on Amazon
								</Button>
							)}
						</Col>
					</Row>
					<Row>
						<Col
							lg={6}
							className='mx-auto'
						>
							{isAuthenticated && (
								<>
									<Button
										// href={favoriteUrl}
										variant='link'
										size='lg'
										className='px-4'
										onClick={handleFavorite}
									>
										<FontAwesomeIcon
											icon={bookmarked ? fasBookmark : farBookmark}
										/>
									</Button>
									<Button
										// href={likeUrl}
										variant='link'
										size='lg'
										className='px-4'
										onClick={handleLike}
									>
										<FontAwesomeIcon icon={liked ? fasThumbsUp : farThumbsUp} />
									</Button>
								</>
							)}
						</Col>
					</Row>
				</Col>
			</Row>
			<Row>
				<Col
					lg={8}
					className='text-center mx-auto'
				>
					<p id='book_description'>
						{context.description ||
							'No Summary/Description Available. Please feel free to checkout the Amazon Link for more details.'}
					</p>
				</Col>
			</Row>
		</Container>
	);
}

export default BookDetails;
