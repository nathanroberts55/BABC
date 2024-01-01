import React, { useState, useEffect, useRef } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import { FormControl } from 'react-bootstrap';

type DropdownItem = {
	title: string;
	author: string;
	isbn: string;
	text: string;
};

function SubmissionForm() {
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

	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [alertVariant, setAlertVariant] = useState('success');

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
									}) => {
										let words = book.title.split(' ');
										let truncatedTitle = words.slice(0, 3).join(' ');

										if (words.length > 3) {
											truncatedTitle += '...';
										}

										let author = book.author_name ? book.author_name[0] : 'N/A';
										if (author.length > 20) {
											author = author.substring(0, 20) + '...';
										}

										return {
											title: book.title,
											author: author,
											isbn: book.isbn
												? book.isbn.find(
														(isbn: string | any[]) => isbn.length === 13
												  ) || book.isbn[0]
												: 'N/A',
											text: `${truncatedTitle} by ${author}`,
										};
									}
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

	const validateForm = () => {
		if (bookSource === 'CHAT' && submitterName.trim() === '') {
			setAlertMessage(
				'Submitter field must not be null or empty when source is CHAT.'
			);
			setAlertVariant('danger');
			setShowAlert(true);
			return false;
		} else if (bookSource === 'ATRIOC' && streamLink.trim() === '') {
			setAlertMessage(
				'Stream link must not be null or empty when source is ATRIOC.'
			);
			setAlertVariant('danger');
			setShowAlert(true);
			return false;
		}

		return true;
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		// Handle form submission here

		if (!validateForm()) {
			return;
		}

		const bookToSubmit = {
			title: titleInput,
			author: authorInput,
			isbn: isbnInput,
			source: bookSource,
			submitter: submitterName,
			stream_link: streamLink,
		};

		// Now TypeScript knows that csrftoken is not null here
		fetch('/api/books/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(bookToSubmit),
		})
			.then((response) => {
				if (response.ok) {
					// The book was created successfully
					setAlertMessage('Successfully Submitted Book, Thanks!');
					setAlertVariant('success');
					setShowAlert(true);
				} else if (response.status === 400) {
					// Handle any errors
					response.json().then((data) => {
						let errorMessage = 'Book Unable to be Submitted';
						if (data.non_field_errors) {
							errorMessage = 'Book Already Submitted, Please Try Another One';
						} else {
							// Concatenate all error messages from different fields
							Object.keys(data).forEach((key) => {
								errorMessage += `${key}: ${data[key].join(' ')}`;
							});
						}
						setAlertMessage(errorMessage);
						setAlertVariant('danger');
						setShowAlert(true);
					});
				} else {
					console.log('Response Not a 200 or 400');
					// Handle any errors
					response.json().then((data) => {
						let errorMessage =
							'An error occurred while submitting the book. Please try again.';
						if (data.non_field_errors) {
							errorMessage = 'Book Already Submitted, Please Try Another One';
						} else {
							// Concatenate all error messages from different fields
							Object.keys(data).forEach((key) => {
								errorMessage += `${key}: ${data[key].join(' ')}`;
							});
						}
						setAlertMessage(errorMessage);
						setAlertVariant('danger');
						setShowAlert(true);
					});
				}
			})
			.catch((error) => {
				console.error('Error:', error);
				// If the error is an instance of Error, you can print its name and message
				if (error instanceof Error) {
					console.error('Error name:', error.name);
					console.error('Error message:', error.message);
				}
				// You can also print the error stack trace
				console.error('Error stack:', error.stack);

				// Display a simple error message
				setAlertMessage(
					'An error occurred while submitting the book. Please try again.'
				);
				setAlertVariant('danger');
				setShowAlert(true);
			});

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
						{showAlert && (
							<Alert
								variant={alertVariant}
								onClose={() => setShowAlert(false)}
								dismissible
							>
								<p>{alertMessage}</p>
							</Alert>
						)}
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
								value={streamLink}
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
							style={{ cursor: 'pointer' }}
						>
							Submit
						</Button>
					</Form>
				</Col>
			</Row>
		</Container>
	);
}

export default SubmissionForm;
