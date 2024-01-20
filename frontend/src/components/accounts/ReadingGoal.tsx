import React, { useState, useEffect } from 'react';
import GoalDescription from './goals/GoalDescription';
import Container from 'react-bootstrap/Container';
import GoalDetails from './goals/GoalDetails';

export interface ReadingGoalBook {
	id: number;
	date_created: string;
	date_modified: string;
	title: string;
	author: string;
	isbn: number;
}
export interface GoalData {
	date_created: string;
	date_modified: string;
	year?: number;
	goal?: number;
	books_read?: ReadingGoalBook[];
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

	useEffect(() => {
		if (goalData?.has_goal || goalData?.num_books_read || goalData?.goal) {
			// If goalData has been updated and has_goal is true, or num_books_read or goal changes, re-fetch goal details
			fetch('/api/goals/details/')
				.then((response) => response.json())
				.then((data) => {
					setGoalData(data);
				})
				.catch((error) => {
					console.error('Error fetching goal details:', error);
				});
		}
	}, [goalData?.has_goal, goalData?.num_books_read, goalData?.goal]); // This dependency array ensures the effect runs whenever goalData?.has_goal, goalData?.num_books_read, or goalData?.goal changes

	async function updateResolution(dataToUpdate: Partial<GoalData>) {
		fetch('/api/goals/update_goal/', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(dataToUpdate),
		})
			.then(async (response) => {
				if (response.ok) {
					// Check if response status is 200-299
					const updatedGoalData = await response.json();
					setGoalData(updatedGoalData);
				}
			})
			.catch((error) => {
				console.log('Error Updating Goal:', error);
			});
	}

	async function saveBook(bookToSave: Partial<ReadingGoalBook>) {
		fetch('api/goals/add_book/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(bookToSave),
		})
			.then(async (response) => {
				if (response.status === 201) {
					const newBook = await response.json();
					setGoalData((prevGoalData) => {
						if (prevGoalData) {
							return {
								...prevGoalData,
								books_read: [...(prevGoalData.books_read || []), newBook],
								num_books_read: prevGoalData.num_books_read
									? prevGoalData.num_books_read + 1
									: 1,
							};
						} else {
							return prevGoalData;
						}
					});
				}
			})
			.catch((error) => {
				console.log('Error Updating Resolution:', error);
			});
	}

	async function deleteBook(bookId: number) {
		fetch(`api/goals/delete_book/${bookId}/`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(async (response) => {
				if (response.status === 204) {
					setGoalData((prevGoalData) => {
						if (prevGoalData?.books_read) {
							const updatedBooks = prevGoalData.books_read.filter(
								(book) => book.id !== bookId
							);
							return {
								...prevGoalData,
								books_read: updatedBooks,
								num_books_read: prevGoalData.num_books_read
									? prevGoalData.num_books_read - 1
									: 0,
							};
						} else {
							return prevGoalData;
						}
					});
				}
			})
			.catch((error) => {
				console.log('Error Deleting Book:', error);
			});
	}

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
							onUpdateResolution={updateResolution}
							onSaveBook={saveBook}
							onDeleteBook={deleteBook}
						/>
					)
				) : (
					<GoalDescription onclick={handleSetReadingGoal} />
				))}
		</Container>
	);
}

export default ReadingGoals;
