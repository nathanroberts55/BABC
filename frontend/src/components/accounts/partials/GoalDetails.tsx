import React from 'react';
import { ReadingGoalBooks } from '../ReadingGoal';
import ReadingProgress from './ProgressBar';
import BookListItem from '../../common/BookListItem';
import RGBookListItem from '../../common/RGBookListItem';

interface GoalDataProps {
	year: number;
	goal: number;
	books_read: ReadingGoalBooks[];
	num_books_read: number;
}
function GoalDetails({
	year,
	goal,
	books_read,
	num_books_read,
}: GoalDataProps) {
	return (
		<div>
			<p className='display-6 fw-bold text-body-emphasis lh-1 mb-3'>
				Reading Resolution Progress
			</p>
			<ReadingProgress
				current={num_books_read}
				goal={goal}
			/>
			{books_read.map((book, index) => (
				<RGBookListItem book={book} />
			))}
		</div>
	);
}

export default GoalDetails;
