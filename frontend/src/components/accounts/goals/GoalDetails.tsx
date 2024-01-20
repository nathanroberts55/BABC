import React, { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import { GoalData, ReadingGoalBook } from '../ReadingGoal';
import ReadingProgress from './ProgressBar';
import RGBookListItem from './RGBookListItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal } from 'react-bootstrap';
import AddBookModal from './AddBookModal';
import useModal from '../../../hooks/useModal';
import EditGoalModal from './EditGoalModal';

interface GoalDataProps {
	year: number;
	goal: number;
	books_read: ReadingGoalBook[];
	num_books_read: number;
	onUpdateResolution: (dataToUpdate: Partial<GoalData>) => void;
	onSaveBook: (bookToSave: Partial<ReadingGoalBook>) => void;
	onDeleteBook: (bookId: number) => void;
}
function GoalDetails({
	year,
	goal,
	books_read,
	num_books_read,
	onUpdateResolution,
	onSaveBook,
	onDeleteBook,
}: GoalDataProps) {
	const [open, setOpen] = useState(false);
	const addBookModal = useModal();
	const editModal = useModal();

	return (
		<div>
			<p className='display-6 fw-bold text-body-emphasis lh-1 mb-3'>
				Reading Resolution Progress
			</p>
			<ReadingProgress
				current={num_books_read}
				goal={goal}
			/>
			<div className='d-flex justify-content-end mb-3'>
				<Button
					className='mb-3 mx-1'
					variant='primary'
					onClick={editModal.toggle}
				>
					Edit Goal
				</Button>
				<Button
					className='mb-3 mx-1'
					variant='outline-danger'
				>
					{' '}
					Delete Goal
				</Button>
			</div>
			<div className='d-flex'>
				<p className='h4'>
					{open ? (
						<FontAwesomeIcon
							icon={faChevronDown}
							onClick={() => setOpen(!open)}
						/>
					) : (
						<FontAwesomeIcon
							icon={faChevronUp}
							onClick={() => setOpen(!open)}
						/>
					)}{' '}
					{year} Books Read
				</p>
				<Button
					variant='primary'
					size='sm'
					className='mx-3 mb-3'
					onClick={addBookModal.toggle}
				>
					Add Book
				</Button>
			</div>
			<AddBookModal
				{...addBookModal}
				onSaveBook={onSaveBook}
			/>
			<EditGoalModal
				{...editModal}
				onUpdateResolution={onUpdateResolution}
				goal={goal}
			/>
			<Collapse in={open}>
				<div className='scrollable-content'>
					{books_read.map((book, index) => (
						<RGBookListItem
							book={book}
							onDeleteBook={onDeleteBook}
						/>
					))}
				</div>
			</Collapse>
		</div>
	);
}

export default GoalDetails;
