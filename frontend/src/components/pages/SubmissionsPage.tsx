import React, { useEffect } from 'react';
import Hero from '../books/submissions/Hero';
import Instructions from '../books/submissions/Instructions';
import Container from 'react-bootstrap/Container';
import SubmissionForm from '../books/submissions/SubmissionForm';

function SubmissionsPage() {
	useEffect(() => {
		document.title = 'Big A Book Club | Submissions';
	}, []);
	return (
		<Container fluid>
			<Hero />
			<Instructions />
			<SubmissionForm />
		</Container>
	);
}

export default SubmissionsPage;
