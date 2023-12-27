import React from 'react';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

interface GoalDescriptionProps {
	handleClick: () => void;
}

function GoalDescription({ handleClick }: GoalDescriptionProps) {
	return (
		<div>
			<p className='display-6 fw-bold text-body-emphasis lh-1 mb-3'>
				Get Smarter: Reading Goal!
			</p>
			<p className='lead mb-3'>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Odio ut enim blandit
				volutpat maecenas volutpat. Leo in vitae turpis massa sed elementum
				tempus. Pharetra convallis posuere morbi leo urna molestie at elementum
				eu. Nisl purus in mollis nunc sed id. Dapibus ultrices in iaculis nunc
				sed. Lobortis mattis aliquam faucibus purus in massa tempor. Et magnis
				dis parturient montes nascetur ridiculus mus. Volutpat sed cras ornare
				arcu dui. Luctus venenatis lectus magna fringilla. Ultrices in iaculis
				nunc sed augue lacus. Viverra mauris in aliquam sem fringilla ut.
				Dapibus ultrices in iaculis nunc sed augue lacus.
			</p>
			<div className='d-flex justify-content-end'>
				<Button
					size='lg'
					variant='primary'
					onClick={handleClick}
				>
					Set Reading Goal
				</Button>
			</div>
		</div>
	);
}

export default GoalDescription;
