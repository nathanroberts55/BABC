import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function GoalDescription() {
	// const [accepted, setAccepted] = useState(false);

	// function GoalInfo() {
	// 	return (
	// 		<div>
	// 			<p className='lead mb-3'>
	// 				Get Smarter Everyday by joining the the Book Club Reading Resolution!
	// 				The Book Club Reading Resolution is a self-paced reading program
	// 				designed to make reading fun, interactive, supportive. Set a goal for
	// 				the year and track each book you read, whether its with the book club
	// 				or on your own! Each book you read will earn yourself a 'Little A'
	// 				sticker to go on a printable PDF Certificate and track your progress
	// 				in your profile in the Big A Book Club website. Reach your reading
	// 				goal by the end of the year and earn a special prize!
	// 			</p>
	// 			<div className='d-flex justify-content-end'>
	// 				<Button
	// 					size='lg'
	// 					variant='primary'
	// 					onClick={() => setAccepted(!accepted)}
	// 				>
	// 					Set Reading Goal
	// 				</Button>
	// 			</div>
	// 		</div>
	// 	);
	// }

	// function SetGoal() {
	// 	return (
	// 		<div>
	// 			<Row>
	// 				<Col lg={8}>
	// 					<p className='h5 fw-bold mb-3'>Set Your Reading Goals</p>
	// 					<p className='lead mb-3'>
	// 						Congratulations on joining the Book Club Reading Resolution! Set a
	// 						reading goal for yourself, remember it’s flexible and can be
	// 						adjusted anytime. Once you’ve set your goal, hit the ‘Start’
	// 						button to begin your journey. Enjoy reading!
	// 					</p>
	// 				</Col>
	// 				<Col className='d-flex justify-content-center'>
	// 					<Form>
	// 						<Form.Control
	// 							type='number'
	// 							placeholder='0'
	// 							className='mb-3 w-50'
	// 						/>
	// 						<Button
	// 							size='lg'
	// 							type='submit'
	// 							className='mb-3 w-50'
	// 						>
	// 							Start
	// 						</Button>
	// 					</Form>
	// 				</Col>
	// 			</Row>
	// 		</div>
	// 	);
	// }

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
					>
						Set Reading Goal
					</Button>
				</div>
			</div>
		</>
	);
}

export default GoalDescription;
