import people_at_library_home from '../../../static/img/people-at-library-home.jpg';
import people_sharing_home from '../../../static/img/people-sharing-home.jpg';
import people_reading_home from '../../../static/img/people-reading-home.jpg';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React from 'react';

const imageSize = 700;

function About() {
	return (
		<>
			<Col
				xxl={8}
				className='container px-4 py-5'
			>
				<Row className='flex-lg-row-reverse align-items-center g-5 py-5'>
					<Col
						md={10}
						lg={6}
						sm={8}
					>
						<img
							src={people_at_library_home}
							className='d-block mx-lg-auto img-fluid rounded-circle'
							alt='Bootstrap Themes'
							width={imageSize}
							height={imageSize}
							loading='lazy'
						/>
					</Col>
					<Col lg={6}>
						<h1 className='display-5 fw-bold text-body-emphasis lh-1 mb-3'>
							What the Book Club Is
						</h1>
						<p className='lead'>
							A place for those in the Atrioc community who seek to one day be
							as wise as the thousand year old Glarketer by reading the same
							books on the coveted shelf obstructed by the Wigglers MASSIVE
							shiny forehead. Additionally, chat with it's infinite wisdom, also
							contributes many amazing reads, and this site seeks to be the
							consolidation of that information.
						</p>
					</Col>
				</Row>
			</Col>

			<Col
				xxl={8}
				className='container px-4 py-5'
			>
				<Row className='row flex-lg-row-reverse align-items-center g-5 py-5'>
					<Col lg={6}>
						<h1 className='display-5 fw-bold text-body-emphasis lh-1 mb-3'>
							Why the Book Club
						</h1>
						<p className='lead'>
							Atrioc hoards his knowledge (much like his coffee) from chat.
							Despite no fault of chat's own, when innocently asked "any book
							recommendations?" in attempt to learn from his ways, chat is
							berated. Well no more, chat should not have knowledge gatekept and
							this site shall unleash that access.
						</p>
					</Col>
					<Col
						md={10}
						lg={6}
						sm={8}
					>
						<img
							src={people_sharing_home}
							className='d-block mx-lg-auto img-fluid rounded-circle'
							alt='Bootstrap Themes'
							width={imageSize}
							height={imageSize}
							loading='lazy'
						/>
					</Col>
				</Row>
			</Col>

			<Col
				xxl={8}
				className='container px-4 py-5'
			>
				<Row className='row flex-lg-row-reverse align-items-center g-5 py-5'>
					<Col
						md={10}
						lg={6}
						sm={8}
					>
						<img
							src={people_reading_home}
							className='d-block mx-lg-auto img-fluid rounded-circle'
							alt='People Reading'
							width={imageSize}
							height={imageSize}
							loading='lazy'
						/>
					</Col>
					<Col lg={6}>
						<h1 className='display-5 fw-bold text-body-emphasis lh-1 mb-3'>
							How Book Club Works
						</h1>
						<p className='lead'>
							When Dr. Carbonation mentions a book that he is reading, anyone
							can come and submit that book and a clip from stream of Glizzy
							Fingers talking about it to be kept in the records. Additionally,
							any books that chat would like to share can be submitted for the
							record. Once submitted, books are added to an approval queue
							before being added to the recommendations page where they are
							dividied by Atrioc & chat recommendations and shared with the
							community.
						</p>
					</Col>
				</Row>
			</Col>
		</>
	);
}

export default About;
