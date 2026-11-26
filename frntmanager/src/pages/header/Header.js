import { Nav, Container, Navbar, NavbarBrand } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import "./Header.css";
import { useAuth } from "../auth/AuthContext";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <Navbar expand="md" className="app-navbar">
      <Container>
        <NavbarBrand
          as={Link}
          to={isAuthenticated ? "/dashboard" : "/login"}
          className="app-navbar__brand"
        >
          <span className="app-navbar__brand-mark" aria-hidden="true">W</span>
          <span className="app-navbar__brand-copy">
            <strong>Workout</strong>
            <span>MANAGER</span>
          </span>
        </NavbarBrand>
        <Navbar.Toggle aria-controls="main-navigation" aria-label="Toggle navigation" />
        <Navbar.Collapse id="main-navigation">
          <Nav className="app-navbar__links ms-auto">
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/register" className="app-navbar__link">
                  Registo
                </Nav.Link>
                <Nav.Link as={Link} to="/login" className="app-navbar__link app-navbar__link--accent">
                  Entrar
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/dashboard" className="app-navbar__link">
                  Ecrã Inicial
                </Nav.Link>
                <Nav.Link as={Link} to="/login" onClick={logout} className="app-navbar__link app-navbar__link--accent">
                  Sair
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header;