import React from 'react';
import coffee_cows_reading_recommendations from '../../../../static/img/coffee-cows-reading-recommendations.jpg';
import frogs_reading_recommendations from '../../../../static/img/frogs-reading-recommendations.jpg';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
function RecommendationInstructions() {
	return (
		<Col
			xxl={8}
			className='container text-center px-4 py-2'
		>
			<Row className='flex-lg-row-reverse align-items-center g-5 py-2'>
				<Col
					md={10}
					sm={8}
					lg={6}
				>
					<img
						src={coffee_cows_reading_recommendations}
						className='d-block mx-lg-auto img-fluid rounded-circle'
						alt='Bootstrap Themes'
						width='500'
						height='500'
						loading='lazy'
					/>
				</Col>
				<Col lg={6}>
					<p className='lead fs-4'>
						Use the drop down at the top to filter between books recommended by
						Atrioc and books recommended by chat. Books recommended by Atrioc
						will have a link to the stream clip where he talks about the book.
					</p>
				</Col>
			</Row>
			<Row className='flex-lg-row-reverse align-items-center g-5 py-2'>
				<Col lg={6}>
					<p className='lead fs-4'>
						I <strong>HIGHLY RECOMMEND</strong> that if you are interested in
						purchasing any of the books listed that you, as the Glarketer once
						said "Think GLOCAL, shop LOCAL", find a bookstore in your area to
						support. However, there will be affliate links to Amazon where you
						can purchase the book. The proceeds generated go towards the upkeep
						and maintenence of this site, and additional earnings will be spent
						supporting charitable causes (and building the{' '}
						<a
							href='https://atrioc.org'
							target='_blank'
						>
							ACLU
						</a>{' '}
						strike fund).
					</p>
				</Col>
				<Col
					md={10}
					sm={8}
					lg={6}
				>
					<img
						src={frogs_reading_recommendations}
						className='d-block mx-lg-auto img-fluid rounded-circle'
						alt='Bootstrap Themes'
						width='500'
						height='500'
						loading='lazy'
					/>
				</Col>
			</Row>
		</Col>
	);
}

export default RecommendationInstructions;
