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
				animated
				now={progress}
				label={`${progress}%`}
			/>
		</div>
	);
}

export default ReadingProgress;
