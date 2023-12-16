import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import SubmissionsPage from './components/pages/SubmissionsPage';
import RecommendationsPage from './components/pages/RecommendationsPage';
import Footer from './components/footer/Footer';
import BookDetailsPage from './components/pages/BooksDetailsPage';
import AccountsPage from './components/pages/AccountsPage';
import NotFound from './components/pages/NotFound';
import Forbidden from './components/pages/Forbidden';
import NavBar from './components/navigation/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../static/scss/App.scss';

function App() {
	return (
		<div className='App'>
			<NavBar />
			<Routes>
				<Route
					path='*'
					element={<NotFound />}
				/>
				<Route
					path='/'
					element={<HomePage />}
				/>
				<Route
					path='/books/submissions'
					element={<SubmissionsPage />}
				/>
				<Route
					path='/books/recommendations'
					element={<RecommendationsPage />}
				/>
				<Route
					path='/books/details/:id'
					element={<BookDetailsPage />}
				/>
				<Route
					path='/accounts'
					element={<AccountsPage />}
				/>
				<Route
					path='/Forbidden'
					element={<Forbidden />}
				/>
			</Routes>
			<Footer />
		</div>
	);
}

export default App;
