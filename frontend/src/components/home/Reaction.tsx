import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function ReactionClip() {
	return (
		<>
			<Col
				xxl={8}
				className='container px-4 py-5'
				style={{
					backgroundColor: 'rgba(111, 66, 193, 0.4)', // Replace with your site's primary color
					borderRadius: '35px',
					padding: '20px',
				}}
			>
				<Row className='flex-lg-row-reverse align-items-center g-5 py-5'>
					<Col lg={6}>
						<h1 className='display-5 fw-bold text-body-emphasis rh-1 mb-3 text-center'>
							Reaction with Raving Reviews!
						</h1>
						<p className='lead'>
							In a live on stream first reaction, Atrioc praises the website and
							the work being done by the community for cataloging his reads even
							giving a thumbs up to a book suggested by chatters!
						</p>
					</Col>
					<Col
						md={10}
						lg={6}
						sm={8}
					>
						<div className='ratio ratio-16x9'>
							<iframe
								src='https://www.youtube.com/embed/yy2ACeR_vRI?si=G_mq2oWnI-m35WD2&amp;clip=UgkxXUSV6EegzgRj-8g4tsVACr2VBT30ZiaU&amp;clipt=EMCNHBiTqh8'
								title='Big A BookClub Reaction'
							></iframe>
						</div>
					</Col>
				</Row>
			</Col>
		</>
	);
}

export default ReactionClip;
