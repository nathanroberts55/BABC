import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { GoalData } from '../ReadingGoal';

interface ModalProps {
	show: boolean;
	toggle: () => void;
	id: number;
	onDeleteGoal: (goalId: number) => void;
}

function DeleteGoalModal({ show, toggle, id, onDeleteGoal }: ModalProps) {
	function handleDeleteToggle() {
		onDeleteGoal(id);
		toggle();
	}

	return (
		<div
			className='modal show'
			style={{ display: 'block', position: 'initial' }}
		>
			<Modal
				show={show}
				onHide={toggle}
				size='lg'
				aria-labelledby='contained-modal-title-vcenter'
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Confirm Delete Resolution</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<p>
						Deleting Resolution will remove all read books and delete reading
						goal. Are you sure you want to delete your resolution?
					</p>
				</Modal.Body>

				<Modal.Footer>
					<Button
						variant='secondary'
						onClick={toggle}
					>
						Cancel
					</Button>
					<Button
						variant='primary'
						onClick={handleDeleteToggle}
					>
						Delete Resolution
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

export default DeleteGoalModal;
