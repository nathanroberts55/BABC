import React, { useState } from 'react';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';

interface GoalDescriptionProps {
	onclick: () => void;
}

function GoalDescription({ onclick }: GoalDescriptionProps) {
	return (
		<>
			<p className='display-6 fw-bold text-body-emphasis lh-1 mb-3'>
				Book Club Reading Resolution!
			</p>
			<div>
				<p className='lead mb-3'>
					Get Smarter Everyday by joining the the Book Club Reading Resolution!
					The Book Club Reading Resolution is a self-paced reading program
					designed to make reading fun, interactive, supportive. Set a goal for
					the year and track each book you read, whether its with the book club
					or on your own! Each book you read will earn yourself a 'Little A'
					sticker to go on a printable PDF Certificate and track your progress
					in your profile in the Big A Book Club website. Reach your reading
					goal by the end of the year and earn a special prize!
				</p>
				<div className='d-flex justify-content-end'>
					<Button
						size='lg'
						variant='primary'
						onClick={onclick}
					>
						Set Reading Goal
					</Button>
				</div>
			</div>
		</>
	);
}

export default GoalDescription;
