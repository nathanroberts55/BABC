import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Hero from '../home/Hero';
import About from '../home/About';
import ReactionClip from '../home/Reaction';

function HomePage() {
	useEffect(() => {
		document.title = 'Big A Book Club';
	}, []);

	return (
		<Container fluid>
			<Hero />
			<ReactionClip />
			<About />
		</Container>
	);
}

export default HomePage;
