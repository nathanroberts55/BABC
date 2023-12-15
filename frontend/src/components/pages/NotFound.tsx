import React from 'react';
import logo_purple from '../../../static/img/logo-purple.png';
import { Container, Row, Col } from 'react-bootstrap';

function NotFound() {
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
					<h1 className='display-2 mb-2'>Oops! Page Not Found</h1>
					<p className='fs-5 mb-3'>
						The page you're looking for doesn't exist. Let's get you back to the
						coffee.
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

export default NotFound;
