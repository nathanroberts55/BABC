import React, { useState, useEffect, useContext } from 'react';
import { useQuery, QueryObserverResult, UseQueryResult } from 'react-query';
import { useLocation } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import InputGroup from 'react-bootstrap/InputGroup';
import AuthContext from '../../../contexts/authContext';
import BookListItem from '../../common/BookListItem';

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

function Recommendations() {
	const [bookSource, setBookSource] = useState(
		localStorage.getItem('bookSource') || 'ATRIOC'
	);
	const [sortKey, setSortKey] = useState(
		localStorage.getItem('sortKey') || 'title'
	);
	const [searchKey, setSearchKey] = useState(
		localStorage.getItem('searchKey') || 'title'
	);
	const [searchValue, setSearchValue] = useState(
		localStorage.getItem('searchValue') || ''
	);
	const { isAuthenticated } = useContext(AuthContext);

	// Add a new state variable for the scroll position
	const [scrollPosition, setScrollPosition] = useState(
		parseInt(localStorage.getItem('scrollPosition') || '0')
	);

	// Save scroll position
	useEffect(() => {
		const handleScroll = () => {
			setScrollPosition(window.scrollY);
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []); // Empty dependency array so this effect only runs on mount and unmount

	// Scroll to saved position
	useEffect(() => {
		window.scrollTo(0, scrollPosition);
	}, []);

	useEffect(() => {
		// Save the scroll position in localStorage whenever it changes
		localStorage.setItem('scrollPosition', scrollPosition.toString());
	}, [scrollPosition]);

	useEffect(() => {
		localStorage.setItem('bookSource', bookSource);
		localStorage.setItem('sortKey', sortKey);
		localStorage.setItem('searchKey', searchKey);
		localStorage.setItem('searchValue', searchValue);
	}, [bookSource, sortKey, searchKey, searchValue]);

	const fetchBooks = async () => {
		const res = await fetch(`/api/books/`);
		if (!res.ok) {
			throw new Error('Network response was not ok');
		}
		return res.json();
	};

	const {
		data: books,
		error,
		isLoading,
	}: UseQueryResult<Book[], Error> = useQuery('books', fetchBooks, {
		staleTime: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
	});

	if (isLoading) {
		return (
			<Col
				xxl={8}
				className='container px-4 py-5 mb-5 d-flex justify-content-center align-items-center'
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

	if (error) return 'An error has occurred: ' + error.message;

	const handleBookSourceChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setBookSource(event.target.value);
	};
	const handleSortKeyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSortKey(event.target.value);
	};
	const handleSearchKeyChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setSearchKey(event.target.value);
	};
	const handleSearchValueChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setSearchValue(event.target.value);
	};

	return (
		<div className='container-xxl'>
			<Row className='justify-content-center mb-3'>
				<Col lg={3}>
					<InputGroup className='mb-3'>
						<InputGroup.Text id='basic-addon3'>Books From:</InputGroup.Text>
						<Form.Select
							id='recommendations-select'
							aria-label='Recommendations From Select'
							value={bookSource}
							onChange={handleBookSourceChange}
						>
							<option value='ATRIOC'>Atrioc</option>
							<option value='CHAT'>Chat</option>
						</Form.Select>
					</InputGroup>
				</Col>
				{isAuthenticated && (
					<Col lg={2}>
						<InputGroup className='mb-3'>
							<InputGroup.Text id='SortByLabel'>Sort By:</InputGroup.Text>
							<Form.Select
								id='recommendations-sort'
								aria-label='Recommendation Sort Select'
								value={sortKey}
								onChange={handleSortKeyChange}
							>
								<option value='title'>Title</option>
								<option value='likes'>Likes</option>
							</Form.Select>
						</InputGroup>
					</Col>
				)}
				<Col lg={6}>
					<InputGroup className='mb-3'>
						<Form.Select
							className='input-group-text'
							id='recommendationSearchKey'
							aria-label='Recommedation Search Key'
							value={searchKey}
							onChange={handleSearchKeyChange}
							style={{ flex: '0 0 35%' }}
						>
							<option value='title'>Title</option>
							<option value='author'>Author</option>
							{bookSource === 'CHAT' && (
								<option value='submitter'>Submitter</option>
							)}
						</Form.Select>
						<Form.Control
							type='text'
							id='recommendationSearch'
							placeholder='Enter Search Term'
							aria-label='Search For Recommendations with Text'
							onInput={handleSearchValueChange}
							style={{ flex: '1' }}
						/>
					</InputGroup>
				</Col>
			</Row>
			<div id='BookList'>
				{books &&
					books
						.filter((book: Book) => book.source === bookSource)
						.filter((book: Book) => {
							if (searchKey === 'title') {
								return book.title
									.toLowerCase()
									.includes(searchValue.toLowerCase());
							} else if (searchKey === 'author') {
								return book.author
									.toLowerCase()
									.includes(searchValue.toLowerCase());
							} else if (bookSource === 'CHAT' && searchKey === 'submitter') {
								return book.submitter
									.toLowerCase()
									.includes(searchValue.toLowerCase());
							} else {
								return 0;
							}
						})
						.sort((a: Book, b: Book) => {
							if (sortKey === 'title') {
								return a.title.localeCompare(b.title);
							} else if (sortKey === 'likes') {
								return b.num_likes - a.num_likes;
							} else {
								return 0;
							}
						})
						.map((book: Book, index: number) => <BookListItem book={book} />)}
			</div>
		</div>
	);
}

export default Recommendations;
