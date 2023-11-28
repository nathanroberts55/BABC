import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SubmissionsPage from './pages/SubmissionsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import Footer from './footer/Footer';
import BookDetailsPage from './books/recommendations/BooksDetailsPage';
import AccountsPage from './pages/AccountsPage';
import NavBar from './navigation/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../static/scss/App.scss';

function App() {
	return (
		<div className='App'>
			<NavBar />
			<Routes>
				<Route
					path='/react'
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
				{/*<Route
					path='/login/discord'
					element={<Login />}
				/> */}
			</Routes>
			<Footer />
		</div>
	);
}

export default App;
