import Container from 'react-bootstrap/Container';
import Hero from '../home/Hero';
import About from '../home/About';
import React, { useEffect } from 'react';

function HomePage() {
	useEffect(() => {
		document.title = 'Big A Book Club';
	}, []);

	return (
		<Container fluid>
			<Hero />
			<About />
		</Container>
	);
}

export default HomePage;
