import React, { useEffect } from 'react';
import Hero from '../books/recommendations/Hero';
import RecommendationInstructions from '../books/recommendations/Instructions';
import Container from 'react-bootstrap/Container';
import Recommendations from '../books/recommendations/Recommendations';
import CurrentlyReading from '../books/recommendations/CurrentlyReading';

function RecommendationsPage() {
	useEffect(() => {
		document.title = 'Big A Book Club | Recommendations';
	}, []);

	return (
		<Container fluid>
			<Hero />
			<RecommendationInstructions />
			<CurrentlyReading />
			<Recommendations />
		</Container>
	);
}

export default RecommendationsPage;
