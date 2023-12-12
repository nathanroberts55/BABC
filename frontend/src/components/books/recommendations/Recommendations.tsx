import React, { useState, useEffect, useContext } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
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
	const [bookSource, setBookSource] = useState('ATRIOC');
	const [sortKey, setSortKey] = useState('title');
	const [searchKey, setSearchKey] = useState('title');
	const [searchValue, setSearchValue] = useState('');
	const [books, setBooks] = useState<Book[]>([]);

	const { isAuthenticated } = useContext(AuthContext);

	useEffect(() => {
		fetch(`/api/books/`)
			.then((response) => response.json())
			.then((data) => setBooks(data))
			.catch((error) => console.error('Error:', error));
	}, []);

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
				{books
					.filter((book) => book.source === bookSource)
					.filter((book) => {
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
					.sort((a, b) => {
						if (sortKey === 'title') {
							return a.title.localeCompare(b.title);
						} else if (sortKey === 'likes') {
							return b.num_likes - a.num_likes;
						} else {
							return 0;
						}
					})
					.map((book, index) => (
						<BookListItem book={book} />
					))}
			</div>
		</div>
	);
}

export default Recommendations;
