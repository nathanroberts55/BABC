import React, { useEffect } from 'react';
import Hero from '../accounts/Hero';
import Bookmarks from '../accounts/Bookmarks';
import testBooks from '../../../static/data/testBooks.json';

function AccountsPage() {
	useEffect(() => {
		document.title = 'Big A Book Club | Account Details';
	}, []);

	return (
		<>
			<Hero />
			<Bookmarks books={testBooks} />
		</>
	);
}

export default AccountsPage;
