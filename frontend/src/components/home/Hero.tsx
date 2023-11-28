// import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import logo_purple from '../../../static/img/logo-purple.png';
import React from 'react';

const heroLogoSize = 175;

function Hero() {
	return (
		<div className='px-4 py-5 my-5 text-center'>
			<img
				src={logo_purple}
				alt='Purple Big A Book Club Logo'
				width={heroLogoSize}
				height={heroLogoSize}
			/>
			<h1 className='dispaly-5 fw-bold text-body-emphasis'>Big A Book Club</h1>
			<div className='col-lg-6 mx-auto'>
				<p className='lead mb-4'>
					A website designed to help chatters, vod frogs, discord degens, reddit
					roaches, and even EU f*cks find, share, and collect books recommended
					by their fellow sigmas, ACLU comrades, and more importantly the
					fizziest <strong>Dr. Carbonation</strong> himself.
				</p>
				<p className='h5 mb-3'>
					Get Started by Finding or Recommending Books Here:
				</p>
				<div className='d-grid gap-2 d-sm-flex justify-content-sm-center'>
					<Button
						size='lg'
						className='px-4 gap-3'
						href='/books/submissions/'
						variant='outline-primary'
					>
						Submissions
					</Button>
					<Button
						size='lg'
						className='px-4 gap-3'
						href='/books/recommendations/'
						variant='outline-primary'
					>
						Recommendations
					</Button>
				</div>
			</div>
		</div>
	);
}

export default Hero;
