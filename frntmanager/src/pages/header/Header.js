import { Nav, Container, Navbar, NavbarBrand } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import "./Header.css";
import { useAuth } from "../auth/AuthContext";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <Navbar bg='primary' variant='dark'>
      <Container>
        <NavbarBrand to="/"><strong> Sports Manager page </strong></NavbarBrand>
        <Nav> {!isAuthenticated ? (
          <>
            <Nav.Link as={Link} to="/register" className="nav-link">Register Page</Nav.Link>
            <Nav.Link as={Link} to="/login" className="nav-link">Login Page</Nav.Link>
          </>
        ):(
          <>
            <Nav.Link as={Link} to="/dashboard"> Dashboard </Nav.Link>
            <Nav.Link as={Link} to="/login" onClick={logout}> Logout </Nav.Link>
          </>
        )}
        </Nav>
      </Container>
    </Navbar>
  )
}

export default Header;