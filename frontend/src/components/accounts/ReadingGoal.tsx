import React, { useState, useEffect } from 'react';
import GoalDescription from './partials/GoalDescription';
import Container from 'react-bootstrap/Container';
import GoalDetails from './partials/GoalDetails';

export interface ReadingGoalBooks {
	id: number;
	date_created: string;
	date_modified: string;
	title: string;
	author: string;
	isbn: number;
}
interface GoalData {
	date_created: string;
	date_modified: string;
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

	// Add this useEffect hook
	useEffect(() => {
		if (goalData?.has_goal) {
			// If goalData has been updated and has_goal is true, re-fetch goal details
			fetch('/api/goals/details/')
				.then((response) => response.json())
				.then((data) => {
					setGoalData(data);
				})
				.catch((error) => {
					console.error('Error fetching goal details:', error);
				});
		}
	}, [goalData?.has_goal]); // This dependency array ensures the effect runs whenever goalData?.has_goal changes

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
				(goalData.has_goal !== false ? (
					'year' in goalData &&
					'goal' in goalData &&
					'books_read' in goalData &&
					'num_books_read' in goalData &&
					goalData.year !== undefined &&
					goalData.goal !== undefined &&
					goalData.books_read !== undefined &&
					goalData.num_books_read !== undefined && (
						<GoalDetails
							year={goalData.year}
							goal={goalData.goal}
							books_read={goalData.books_read}
							num_books_read={goalData.num_books_read}
						/>
					)
				) : (
					<GoalDescription onclick={handleSetReadingGoal} />
				))}
		</Container>
	);
}

export default ReadingGoals;
