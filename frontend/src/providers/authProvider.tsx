// authProvider.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import AuthContext, { AuthContextType } from '../contexts/authContext';

type AuthProviderProps = {
	children: ReactNode;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);

	const login = async () => {
		// Redirect the user to the Discord authentication page
		window.location.href = `/login/discord/`;
	};

	const logout = async () => {
		// Make a POST request to the logout endpoint
		const response = await fetch(`/api/logout/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// Include your authentication headers, e.g., Bearer token
			},
		});

		if (response.ok) {
			// If the response is OK, the user was logged out successfully
			setIsAuthenticated(false);
			setUser(null);
		} else {
			// Handle any errors
		}
	};

	useEffect(() => {
		// Fetch the user data when the component mounts
		const fetchUser = async () => {
			const response = await fetch(`/api/user/`);
			const data = await response.json();

			if (response.ok) {
				setIsAuthenticated(true);
				setUser(data);
			} else {
				setIsAuthenticated(false);
				setUser(null);
			}
		};

		fetchUser();
	}, []);

	const authContextValue: AuthContextType = {
		isAuthenticated,
		login,
		logout,
		user,
	};

	return (
		<AuthContext.Provider value={authContextValue}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
