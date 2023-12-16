import React from 'react';
import logo_purple from '../../../static/img/logo-purple.png';
import { Container, Row, Col } from 'react-bootstrap';

function Forbidden() {
	return (
		<Container className='px-4 py-5 my-5'>
			<Row className='align-items-center py-5 my-5'>
				<Col lg={8}>
					<img
						src={logo_purple}
						alt=''
						width='125'
						height='125'
					/>
					<h1 className='display-2 mb-2'>No No No... That's How They Get Ya</h1>
					<p className='fs-5 mb-3'>
						Only BookClub Sigmas are allowed here. Maybe find a book about the
						grindset mindset from Dr.Carbonation.
					</p>
					<a
						className='text-decoration-none'
						href='/'
					>
						Back to the Book Club
					</a>
				</Col>
			</Row>
		</Container>
	);
}

export default Forbidden;
