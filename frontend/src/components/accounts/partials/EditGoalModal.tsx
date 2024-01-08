import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { GoalData } from '../ReadingGoal';

interface ModalProps {
	show: boolean;
	toggle: () => void;
	onUpdateResolution: (dataToUpdate: Partial<GoalData>) => void;
	goal: number;
}

function EditGoalModal({ show, toggle, goal, onUpdateResolution }: ModalProps) {
	const [inputValue, setInputValue] = useState<string>(goal.toString());
	const [newGoal, setNewGoal] = useState(goal);

	useEffect(() => {
		setNewGoal(goal);
	}, [goal]);

	function handleToggle() {
		setNewGoal(goal);
		toggle();
	}

	function handleSubmitUpdateResolution() {
		const goalValue = Number(inputValue);
		if (!isNaN(goalValue)) {
			setNewGoal(goalValue);
			const toUpdate = {
				goal: goalValue,
			};
			onUpdateResolution(toUpdate);
		}
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
				<Modal.Title>Edit Reading Resolution Goal</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>Update the number of books that you aim to read this year:</p>
				<Form.Control
					type='number'
					placeholder='Enter Goal Here'
					id='goal'
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					className='w-50 mx-auto'
				/>
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant='secondary'
					onClick={handleToggle}
				>
					Cancel
				</Button>
				<Button
					variant='primary'
					onClick={handleSubmitUpdateResolution}
				>
					Update Goal
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default EditGoalModal;
