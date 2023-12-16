import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';
import AuthProvider from './providers/authProvider';

// Create a client
const queryClient = new QueryClient();

ReactDOM.render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<Router>
					<App />
				</Router>
			</AuthProvider>
		</QueryClientProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
