import React from 'react';
import Container from 'react-bootstrap/Container';
import logo_black from '../../../static/img/logo-black.png';

function Footer() {
	return (
		<Container fluid>
			<div
				id='footer'
				className='d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top'
			>
				<p className='col-md-4 mb-0 text-body-secondary'>
					&copy; 2023, Big A Book Club
				</p>
				<a
					href='/'
					className='col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none'
				>
					<img
						src={logo_black}
						alt='Black Big A Bookclub Logo'
						height={40}
						width={40}
					/>
				</a>
			</div>
		</Container>
	);
}

export default Footer;
