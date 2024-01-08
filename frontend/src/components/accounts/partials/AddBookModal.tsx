import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface ModalProps {
	show: boolean;
	toggle: () => void;
}

function AddBookModal({ show, toggle }: ModalProps) {
	return (
		<Modal
			show={show}
			onHide={toggle}
			size='lg'
			aria-labelledby='contained-modal-title-vcenter'
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title>Add Reading Resolution Book</Modal.Title>
			</Modal.Header>
			<Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
			<Modal.Footer>
				<Button
					variant='secondary'
					onClick={toggle}
				>
					Close
				</Button>
				<Button
					variant='primary'
					onClick={toggle}
				>
					Add Book
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default AddBookModal;
