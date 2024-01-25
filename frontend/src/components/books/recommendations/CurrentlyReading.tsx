import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';

async function fetchCurrentlyReadingBookDetails() {
	// Fetch the currently read book from your API
	const currentBookResponse = await fetch('/api/books/currently_reading');
	if (!currentBookResponse.ok) {
		throw new Error('Network response was not ok');
	}
	const book = await currentBookResponse.json();

	// Use the ISBN from the first response to fetch the book details from the Google API
	const bookDetailsResponse = await fetch(
		`https://www.googleapis.com/books/v1/volumes?q=isbn:${book.isbn}`
	);
	if (!bookDetailsResponse.ok) {
		throw new Error('Network response was not ok');
	}
	const bookDetails = await bookDetailsResponse.json();
	const items = bookDetails.items || [];
	if (items.length > 0) {
		const bookInfo = items[0];
		const volumeInfo = bookInfo.volumeInfo || {};
		const description = volumeInfo.description || null;
		const imageLinks = volumeInfo.imageLinks || {};
		const imageUrl = imageLinks.thumbnail || null;
		return { ...book, ...bookDetails, description, image_url: imageUrl };
	} else {
		return { ...book, ...bookDetails, description: null, image_url: null };
	}
}

function CurrentlyReading() {
	const { data, isLoading, isError } = useQuery(
		'currentlyReadingBookDetails',
		fetchCurrentlyReadingBookDetails,
		{
			staleTime: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
		}
	);

	if (isLoading) {
		return (
			<Col
				xxl={8}
				className='container px-4 py-5 mb-5 d-flex justify-content-center align-items-center'
				style={{
					backgroundColor: 'rgba(111, 66, 193, 0.4)', // Replace with your site's primary color
					borderRadius: '35px',
					padding: '20px',
				}}
			>
				<Spinner
					animation='border'
					role='status'
				>
					<span className='visually-hidden'>Loading...</span>
				</Spinner>
				<p className='mx-3'>Loading Currently Reading...</p>
			</Col>
		);
	}

	return (
		<>
			<Col
				xxl={8}
				className='container px-4 py-5 mb-5'
				style={{
					backgroundColor: 'rgba(111, 66, 193, 0.25)', // Replace with your site's primary color
					borderRadius: '35px',
					padding: '20px',
				}}
			>
				{/* Currently Reading Heading */}
				<p className='display-5 fw-bold text-body-emphasis lh-1 mb-3'>
					Currently Reading in Book Club
				</p>
				<Row>
					<Col lg={data.image_url ? 10 : 12}>
						{/* Book Title and Author */}
						<p className='lead fs-2'>
							{data.title} by {data.author}
						</p>
						{/* Book Description */}
						{data.description && <p>{data.description}</p>}
					</Col>
					{/* Book Cover Image */}
					{data.image_url && (
						<Col
							lg={2}
							className='d-flex justify-content-center align-items-center'
						>
							<div id='cover-image-div'>
								<Image
									src={data.image_url}
									alt='Cover Image Art'
									width='150px'
								/>
							</div>
						</Col>
					)}
				</Row>
				<Button
					variant='primary'
					href='https://discord.com/channels/1159391121999413310/1173808374266212412'
					target='_blank'
					size='lg'
					className='mx-auto d-block w-50 mt-3'
				>
					Join Us!
				</Button>
			</Col>
		</>
	);
}

export default CurrentlyReading;
