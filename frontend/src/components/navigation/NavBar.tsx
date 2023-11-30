import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'react-bootstrap/Image';
import logo_purple from '../../../../static/img/logo-purple.png';
import React, { useContext } from 'react';
import AuthContext from '../../contexts/authContext';

function NavBar() {
	const { isAuthenticated, user } = useContext(AuthContext);
	return (
		<Navbar
			expand='lg'
			className='bg-body-tertiary'
		>
			<Container fluid>
				<Navbar.Brand
					as={Link}
					to={'/'}
				>
					<Image
						src={logo_purple}
						width='40'
						height='40'
						className='d-inline-block align-top'
						alt='Big A Book Club logo'
					/>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls='basic-navbar-nav' />
				<Navbar.Collapse id='basic-navbar-nav'>
					<Nav className='me-auto'>
						<Nav.Link
							as={Link}
							to={'/'}
						>
							Home
						</Nav.Link>
						<NavDropdown
							title='Books'
							id='basic-nav-dropdown'
						>
							<NavDropdown.Item
								as={Link}
								to={'/books/submissions'}
							>
								Submissions
							</NavDropdown.Item>
							<NavDropdown.Item
								as={Link}
								to={'/books/recommendations'}
							>
								Recommendations
							</NavDropdown.Item>
						</NavDropdown>
					</Nav>
					<Nav className='ml-auto'>
						{isAuthenticated ? (
							<NavDropdown
								title={user ? user.username : 'Loading...'}
								id='nav-dropdown'
							>
								<NavDropdown.Item
									as={Link}
									to={'/accounts'}
								>
									Profile
								</NavDropdown.Item>
								<NavDropdown.Item href='/api/logout/'>Logout</NavDropdown.Item>
							</NavDropdown>
						) : (
							<Nav.Link href='/login/discord/'>Login</Nav.Link>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default NavBar;
