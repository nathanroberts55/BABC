import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Hero: React.FC = () => {
	return (
		<div
			className='px-4 py-5 my-5 text-center'
			id='header'
		>
			<h1 className='display-3 fw-bold text-body-emphasis mb-3'>Submissions</h1>
			<p className='h3'>Have any Book Recommendations?</p>
			<Row>
				<Col
					lg={6}
					className='mx-auto'
				>
					<p className='lead mb-2 fs-4'>
						Use the form below to submit books that you have seen from stream or
						have read yourself and want to share with the community.
					</p>
				</Col>
			</Row>
		</div>
	);
};

export default Hero;
