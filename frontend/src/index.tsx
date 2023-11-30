import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
// import './index.css';
import App from './App';
import AuthProvider from './providers/authProvider';

ReactDOM.render(
	<React.StrictMode>
		<AuthProvider>
			<Router>
				<App />
			</Router>
		</AuthProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
