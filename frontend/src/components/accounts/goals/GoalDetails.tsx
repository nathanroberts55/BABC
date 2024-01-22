import React, { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import { GoalData, ReadingGoalBook } from '../ReadingGoal';
import ReadingProgress from './ProgressBar';
import RGBookListItem from './RGBookListItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faChevronDown,
	faChevronUp,
	faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { Button, Modal } from 'react-bootstrap';
import AddBookModal from './AddBookModal';
import useModal from '../../../hooks/useModal';
import EditGoalModal from './EditGoalModal';
import DeleteGoalModal from './DeleteGoalModal';

interface GoalDataProps {
	id: number;
	year: number;
	goal: number;
	books_read: ReadingGoalBook[];
	num_books_read: number;
	onUpdateResolution: (dataToUpdate: Partial<GoalData>) => void;
	onSaveBook: (bookToSave: Partial<ReadingGoalBook>) => void;
	onDeleteBook: (bookId: number) => void;
	onDeleteGoal: (goalId: number) => void;
}
function GoalDetails({
	id,
	year,
	goal,
	books_read,
	num_books_read,
	onUpdateResolution,
	onSaveBook,
	onDeleteBook,
	onDeleteGoal,
}: GoalDataProps) {
	const [open, setOpen] = useState(false);
	const addBookModal = useModal();
	const editModal = useModal();
	const deleteModal = useModal();

	return (
		<div>
			<p className='display-6 fw-bold text-body-emphasis lh-1 mb-3'>
				Reading Resolution Progress
			</p>
			<p>
				Reach out to AZ in the{' '}
				<a
					href='https://discord.com/channels/1159391121999413310/1173808374266212412'
					target='_blank'
				>
					discord
				</a>{' '}
				to receive/update your certificate!
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
					onClick={deleteModal.toggle}
				>
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
					Add <FontAwesomeIcon icon={faPlus} />
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
			<DeleteGoalModal
				{...deleteModal}
				onDeleteGoal={onDeleteGoal}
				id={id}
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
