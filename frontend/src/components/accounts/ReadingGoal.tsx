import React, { useState, useEffect } from 'react';
import GoalDescription from './partials/GoalDescription';
import Container from 'react-bootstrap/Container';
import GoalDetails from './partials/GoalDetails';

export interface ReadingGoalBooks {
	title: string;
	author: string;
	isbn: number;
}
interface GoalData {
	year?: number;
	goal?: number;
	books_read?: ReadingGoalBooks[];
	num_books_read?: number;
	has_goal?: boolean;
}

function ReadingGoals() {
	const [goalData, setGoalData] = useState<GoalData | null>(null);

	async function handleSetReadingGoal() {
		try {
			const response = await fetch('/api/goals/create_goal/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const data = await response.json();
			setGoalData(data);
		} catch (error) {
			console.error('Error Creating Goal:', error);
		}
	}

	useEffect(() => {
		fetch('/api/goals/details/')
			.then((response) => response.json())
			.then((data) => {
				setGoalData(data);
			})
			.catch((error) => {
				console.error('Error fetching goal details:', error);
			});
	}, []);

	return (
		<Container
			className='px-4 p-5 my-5'
			style={{
				backgroundColor: 'rgba(111, 66, 193, 0.25)', // Replace with your site's primary color
				borderRadius: '35px',
				padding: '20px',
			}}
		>
			{goalData &&
				(goalData.has_goal ? (
					goalData?.year &&
					goalData?.goal &&
					goalData?.books_read &&
					goalData?.num_books_read && (
						<GoalDetails
							year={goalData.year}
							goal={goalData.goal}
							books_read={goalData.books_read}
							num_books_read={goalData.num_books_read}
						/>
					)
				) : (
					<GoalDescription handleClick={handleSetReadingGoal} />
				))}
		</Container>
	);
}

export default ReadingGoals;
