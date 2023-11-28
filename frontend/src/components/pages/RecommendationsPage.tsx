import React, { useEffect } from 'react';
import Hero from '../books/recommendations/Hero';
import RecommendationInstructions from '../books/recommendations/Instructions';
import Container from 'react-bootstrap/Container';
import Recommendations from '../books/recommendations/Recommendations';

function RecommendationsPage() {
	useEffect(() => {
		document.title = 'Big A Book Club | Recommendations';
	}, []);

	return (
		<Container fluid>
			<Hero />
			<RecommendationInstructions />
			<Recommendations />
		</Container>
	);
}

export default RecommendationsPage;
