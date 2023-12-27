import React from 'react';
import { ReadingGoalBooks } from '../ReadingGoal';
import ReadingProgress from './ProgressBar';

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
				Get Smarter: Reading Goal Progress
			</p>
			{/* <ReadingProgress
				current={num_books_read}
				goal={goal}
			/> */}
		</div>
	);
}

export default GoalDetails;
