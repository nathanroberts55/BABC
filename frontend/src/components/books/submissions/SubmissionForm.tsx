import React, { useState, useEffect, useRef } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FormControl } from 'react-bootstrap';

type DropdownItem = {
	title: string;
	author: string;
	isbn: string;
	text: string;
};

const SubmissionForm: React.FC = () => {
	const [searchKey, setSearchKey] = useState('title');
	const [searchValue, setSearchValue] = useState('');
	const [bookSource, setBookSource] = useState('ATRIOC');
	const [submitDisabled, setSubmitDisabled] = useState(true);
	const [dropdownItems, setDropdownItems] = useState<DropdownItem[]>([]);
	const [submitterName, setSubmitterName] = useState('');
	const [streamLink, setStreamLink] = useState('');
	const [titleInput, setTitleInput] = useState('');
	const [authorInput, setAuthorInput] = useState('');
	const [isbnInput, setIsbnInput] = useState('');

	const debounceRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (searchValue) {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}

			debounceRef.current = setTimeout(() => {
				let encodedSearchTerm = searchValue.replace(/ /g, '+');

				fetch(
					`https://openlibrary.org/search.json?&${searchKey}=${encodedSearchTerm}`
				)
					.then((res) => res.json())
					.then((data) => {
						const books = data.docs;
						if (books.length === 0) {
							// No books were found, set a single dropdown item with a message
							setDropdownItems([
								{
									title: '',
									author: '',
									isbn: '',
									text: 'No Results for that Search Item',
								},
							]);
						} else {
							const uniqueBooks = books.filter(
								(book: { title: any }, index: any, self: any[]) =>
									index ===
									self.findIndex((b: { title: any }) => b.title === book.title)
							);

							setDropdownItems(
								uniqueBooks.map(
									(book: {
										title: any;
										author_name: any;
										isbn: any[];
										publish_year: any[];
									}) => ({
										title: book.title,
										author: book.author_name ? book.author_name[0] : 'N/A',
										isbn: book.isbn
											? book.isbn.find(
													(isbn: string | any[]) => isbn.length === 13
											  ) || book.isbn[0]
											: 'N/A',
										text: `${book.title} by ${book.author_name} | ${
											book.publish_year ? book.publish_year[0] : 'N/A'
										}`,
									})
								)
							);
						}
					})
					.catch((error) => {
						console.error('Error:', error);
					});
			}, 500); // 3 seconds debounce time
		}
	}, [searchValue, searchKey]);

	const handleDropdownItemClick = (item: any, event: any) => {
		event.preventDefault();
		setSearchValue(item.text);
		setTitleInput(item.title);
		setAuthorInput(item.author);
		setIsbnInput(item.isbn);
		setSubmitDisabled(false);
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		// Handle form submission here

		const bookToSubmit = {
			title: titleInput,
			author: authorInput,
			isbn: isbnInput,
			submitter: submitterName,
			stream_link: streamLink,
		};

		console.log(bookToSubmit);

		setSearchValue('');
		setTitleInput('');
		setAuthorInput('');
		setIsbnInput('');
		setStreamLink('');
		setSubmitterName('');
		setBookSource('ATRIOC');
		setSubmitDisabled(true);
	};

	return (
		<Container className='col-xxl-lg-8 px-2 py-3'>
			<Row className='justify-content-center g-5 py-3'>
				<Col
					lg={6}
					className='text-center'
				>
					<div className='mb-3'>
						<p className='h4'>Share with Us!</p>
						<InputGroup
							className='d-flex'
							id='bookSearchInputGroup'
						>
							<Form.Select
								className='input-group-text'
								aria-label='Search Select Option'
								style={{ flex: '0 0 27%' }}
								id='searchKey'
								value={searchKey}
								onChange={(e) => {
									setSearchKey((e.target as HTMLSelectElement).value);
								}}
							>
								<option value='title'>Title</option>
								<option value='author'>Author</option>
								<option value='isbn'>ISBN</option>
							</Form.Select>
							<Dropdown>
								<Dropdown.Toggle
									as={InputGroup.Text}
									id='dropdownMenuButton'
									style={{ flex: '1' }}
								>
									<FormControl
										className='form-control'
										type='text'
										placeholder='Enter Book Title'
										value={searchValue}
										onChange={(e) => {
											setSearchValue((e.target as HTMLInputElement).value);
										}}
									/>
								</Dropdown.Toggle>
								<Dropdown.Menu
									id='dropdownMenu'
									style={{
										maxHeight: '200px',
										overflowY: 'scroll',
									}}
								>
									{dropdownItems.map((item, index) => (
										<Dropdown.Item
											key={index}
											onClick={
												item.text !== 'No Results for that Search Item'
													? (e) => handleDropdownItemClick(item, e)
													: undefined
											}
										>
											{item.text}
										</Dropdown.Item>
									))}
								</Dropdown.Menu>
							</Dropdown>
						</InputGroup>
					</div>
					<Form onSubmit={handleSubmit}>
						{/* Add Form.Group components here */}
						<Form.Select
							value={bookSource}
							onChange={(e) => {
								setBookSource((e.target as HTMLSelectElement).value);
							}}
							aria-label='Recommendation Source Select'
							className='mb-3'
						>
							<option value='ATRIOC'>Atrioc</option>
							<option value='CHAT'>Chat</option>
						</Form.Select>
						{bookSource === 'CHAT' && (
							<Form.Control
								type='text'
								id='recommendationSubmitter'
								placeholder='Enter Twitch Username'
								aria-label='Recommendation Username'
								onInput={(e) => {
									setSubmitterName((e.target as HTMLInputElement).value);
								}}
								className='mb-3'
								required
							/>
						)}
						{bookSource === 'ATRIOC' && (
							<Form.Control
								type='url'
								id='recommendationLink'
								placeholder='Enter Clip Link'
								aria-label='Recommendation Username'
								onInput={(e) => {
									setStreamLink((e.target as HTMLInputElement).value);
								}}
								className='mb-3'
								required
							/>
						)}
						<Button
							type='submit'
							className='btn btn-primary'
							disabled={submitDisabled}
							onClick={handleSubmit}
						>
							Submit
						</Button>
					</Form>
				</Col>
			</Row>
		</Container>
	);
};

export default SubmissionForm;
