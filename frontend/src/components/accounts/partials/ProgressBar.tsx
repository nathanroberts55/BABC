import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

interface ReadingProgressProps {
	current: number;
	goal: number;
}

function ReadingProgress({ current, goal }: ReadingProgressProps) {
	const progress = goal === 0 ? 0 : (current / goal) * 100;

	return (
		<div>
			<p className='lead'>Reading Complete</p>
			<ProgressBar
				className='mb-3'
				animated
				now={progress}
				label={`${progress}%`}
				min={0}
				max={goal}
			/>
		</div>
	);
}

export default ReadingProgress;
