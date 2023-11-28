import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import book_collection_submissions from '../../../../static/img/book-collection-submissions.jpg';
import book_return_submissions from '../../../../static/img/book-return-submissions.jpg';

const Instructions: React.FC = () => {
	return (
		<>
			<Container className='col-xxl-8 px-4 py-2'>
				<Row className='flex-lg-row-reverse align-items-center g-5 py-2'>
					<Col
						xs={10}
						sm={8}
						lg={6}
					>
						<img
							src={book_collection_submissions}
							width={300}
							height={300}
							alt='Bootstrap Themes'
							loading='lazy'
							className='d-block mx-lg-auto img-fluid roundedCircle'
						/>
					</Col>
					<Col lg={6}>
						<p className='lead fs-3'>
							Select then type in Book Title, Author, or ISBN then press "Enter"
							to get dropdown of matching books. If no results, click in the
							search box to reveal drop down or please try again.
						</p>
					</Col>
				</Row>
			</Container>
			<Container className='col-xxl-8 px-4 py-2'>
				<Row className='flex-lg-row-reverse align-items-center g-5 py-2'>
					<Col lg={6}>
						<p className='lead fs-3'>
							Then select whether the book is a recommendation from{' '}
							<strong>Chat</strong> or <strong>Atrioc</strong>. If from{' '}
							<strong>Chat include your username</strong>, and if from{' '}
							<strong>Atrioc include a clip from stream</strong> of him talking
							about the book.
						</p>
					</Col>
					<Col
						xs={10}
						sm={8}
						lg={6}
					>
						<img
							src={book_return_submissions}
							width={300}
							height={300}
							alt='Bootstrap Themes'
							loading='lazy'
							className='d-block mx-lg-auto img-fluid roundedCircle'
						/>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default Instructions;
