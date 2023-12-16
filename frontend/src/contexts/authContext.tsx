// authContext.tsx
import React from 'react';

export type User = {
	id: number;
	username: string;
	// include any other fields you need
};

export type AuthContextType = {
	isAuthenticated: boolean;
	login: () => Promise<void>;
	logout: () => void;
	user: User | null;
};

const AuthContext = React.createContext<AuthContextType>({
	isAuthenticated: false,
	login: async () => {},
	logout: () => {},
	user: null,
});

export default AuthContext;
