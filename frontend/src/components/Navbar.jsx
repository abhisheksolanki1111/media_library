import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AppNavbar = () => {
    const { user, isAuthenticated, logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/">Media Library</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <>
                                <Nav.Link as={Link} to="/">Gallery</Nav.Link>
                                {user?.role === 'uploader' || user?.role === 'admin' ? (
                                    <Nav.Link as={Link} to="/upload">Upload</Nav.Link>
                                ) : null}
                                {user?.role === 'admin' ? (
                                    <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
                                ) : null}
                            </>
                        </Nav>
                        <Nav>
                            {isAuthenticated() ? (
                                <>
                                    <Navbar.Text className="me-2">
                                        Welcome, {user?.name} ({user?.role})
                                    </Navbar.Text>
                                    <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default AppNavbar;