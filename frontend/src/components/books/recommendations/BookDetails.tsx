import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faThumbsUp,
	faBookmark,
	faArrowLeft,
	faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

interface BookDetailsProps {
	recommendationsUrl: string;
	accountUrl: string;
	isAuthenticated: boolean;
	book: {
		title: string;
		author: string;
		stream_link?: string;
		amazon_link?: string;
		isbn?: string;
		id: number;
	};
	favoriteUrl: string;
	likeUrl: string;
}

interface Context {
	description: string | null;
	image_url: string | null;
}

function BookDetails(props: BookDetailsProps) {
	const {
		recommendationsUrl,
		accountUrl,
		isAuthenticated,
		book,
		favoriteUrl,
		likeUrl,
	} = props;

	const [context, setContext] = useState<Context>({
		description: null,
		image_url: null,
	});

	useEffect(() => {
		const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${book.isbn}`;
		console.log(`Making Request for Book Details for ${book.title} at: ${url}`);

		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				console.log('Getting Books');
				const items = data.items || [];

				if (items.length > 0) {
					const bookInfo = items[0];
					const volumeInfo = bookInfo.volumeInfo || {};

					console.log(`Attempting to retrieve ${book.title} Description`);
					const description = volumeInfo.description || null;

					console.log(`Attempting to retrieve ${book.title} Cover Image`);
					const imageLinks = volumeInfo.imageLinks || {};
					const imageUrl = imageLinks.thumbnail || null;

					setContext({ description, image_url: imageUrl });
				} else {
					setContext({ description: null, image_url: null });
				}
			})
			.catch((error) => {
				console.error(`Exception getting book details: ${error}`);
			});
	}, []);

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
						href={recommendationsUrl}
						variant='primary'
					>
						<FontAwesomeIcon icon={faArrowLeft} /> Recommendations
					</Button>
					{isAuthenticated && (
						<Button
							href={accountUrl}
							variant='primary'
						>
							<FontAwesomeIcon icon={faArrowRight} /> Profile
						</Button>
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
										href={favoriteUrl}
										variant='link'
										size='lg'
										className='px-4'
									>
										<FontAwesomeIcon icon={faBookmark} />
									</Button>
									<Button
										href={likeUrl}
										variant='link'
										size='lg'
										className='px-4'
									>
										<FontAwesomeIcon icon={faThumbsUp} />
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
