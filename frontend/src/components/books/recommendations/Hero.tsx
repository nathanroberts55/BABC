import React from 'react';
import Col from 'react-bootstrap/Col';

function Hero() {
	return (
		<div
			className='px-4 py-5 my-5 text-center'
			id='header'
		>
			<h1 className='display-3 fw-bold text-body-emphasis mb-3'>
				Recommendation
			</h1>
			<Col
				lg={6}
				className='mx-auto'
			>
				<p className='lead mb-2 fs-4'>
					Get Smarter ANYDAY by reading some of the great books suggested by
					Chatters and the Glizlord himself below.
				</p>
			</Col>
		</div>
	);
}

export default Hero;
