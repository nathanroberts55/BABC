import React, { useEffect, useState, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Alert from 'react-bootstrap/Alert';
import Dropdown from 'react-bootstrap/Dropdown';
import { ReadingGoalBook } from '../ReadingGoal';

interface ModalProps {
	show: boolean;
	toggle: () => void;
	onSaveBook: (bookToSave: Partial<ReadingGoalBook>) => void;
}

type DropdownItem = {
	title: string;
	author: string;
	isbn: string;
	text: string;
};

function AddBookModal({ show, toggle, onSaveBook }: ModalProps) {
	const [searchKey, setSearchKey] = useState('title');
	const [searchValue, setSearchValue] = useState('');
	const [submitDisabled, setSubmitDisabled] = useState(true);
	const [dropdownItems, setDropdownItems] = useState<DropdownItem[]>([]);
	const [titleInput, setTitleInput] = useState('');
	const [authorInput, setAuthorInput] = useState('');
	const [isbnInput, setIsbnInput] = useState(0);
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

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		// Handle form submission here

		const bookToSubmit = {
			title: titleInput,
			author: authorInput,
			isbn: isbnInput,
		};

		if (bookToSubmit) {
			onSaveBook(bookToSubmit);
		}

		// fetch('/api/goals/add_book/', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// 	body: JSON.stringify(bookToSubmit),
		// })
		// 	.then((response) => {
		// 		if (response.status == 201) {
		// 			// The book was created successfully
		// 			setAlertMessage('Successfully Added Book, Keep It Up!');
		// 			setAlertVariant('success');
		// 			setShowAlert(true);
		// 		} else if (response.status === 400) {
		// 			// Handle any errors
		// 			response.json().then((data) => {
		// 				let errorMessage = 'Book Unable to be Added';
		// 				if (data.non_field_errors) {
		// 					errorMessage = 'Please Try Again';
		// 				} else {
		// 					// Concatenate all error messages from different fields
		// 					Object.keys(data).forEach((key) => {
		// 						errorMessage += `${key}: ${data[key].join(' ')}`;
		// 					});
		// 				}
		// 				setAlertMessage(errorMessage);
		// 				setAlertVariant('danger');
		// 				setShowAlert(true);
		// 			});
		// 		} else {
		// 			console.log('Response Not a 200 or 400');
		// 			// Handle any errors
		// 			response.json().then((data) => {
		// 				let errorMessage =
		// 					'An error occurred while submitting the book. Please try again.';
		// 				if (data.non_field_errors) {
		// 					errorMessage = 'Book Already Submitted, Please Try Another One';
		// 				} else {
		// 					// Concatenate all error messages from different fields
		// 					Object.keys(data).forEach((key) => {
		// 						errorMessage += `${key}: ${data[key].join(' ')}`;
		// 					});
		// 				}
		// 				setAlertMessage(errorMessage);
		// 				setAlertVariant('danger');
		// 				setShowAlert(true);
		// 			});
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		console.error('Error:', error);
		// 		// If the error is an instance of Error, you can print its name and message
		// 		if (error instanceof Error) {
		// 			console.error('Error name:', error.name);
		// 			console.error('Error message:', error.message);
		// 		}
		// 		// You can also print the error stack trace
		// 		console.error('Error stack:', error.stack);

		// 		// Display a simple error message
		// 		setAlertMessage(
		// 			'An error occurred while submitting the book. Please try again.'
		// 		);
		// 		setAlertVariant('danger');
		// 		setShowAlert(true);
		// 	});

		setSearchValue('');
		setSubmitDisabled(true);
		toggle();
	};

	function handleToggle() {
		setSearchValue('');
		setTitleInput('');
		setAuthorInput('');
		setIsbnInput(0);
		setSubmitDisabled(true);
		toggle();
	}

	return (
		<Modal
			show={show}
			onHide={handleToggle}
			size='lg'
			aria-labelledby='contained-modal-title-vcenter'
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title>Add Reading Resolution Book</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div>
					{showAlert && (
						<Alert
							variant={alertVariant}
							onClose={() => setShowAlert(false)}
							dismissible
						>
							<p>{alertMessage}</p>
						</Alert>
					)}
				</div>
				<div className='mb-3'>
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
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant='secondary'
					onClick={handleToggle}
				>
					Close
				</Button>
				<Button
					variant='primary'
					onClick={handleSubmit}
					disabled={submitDisabled}
				>
					Add Book
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default AddBookModal;
