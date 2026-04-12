import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Container, Form, Row, Col } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

// Icons
import {
  FaSearch, FaFont, FaCalculator, FaCode, FaCalendarAlt,
  FaImage, FaRuler, FaShieldAlt
} from 'react-icons/fa';

import logo from "../assets/img/logo.png";

const PremiumNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper function to check if a link is active
  const checkActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  // --- NEW: Premium Smooth Scroll to Top Function ---
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Creates a silky smooth glide to the top
    });
  };

  return (
    <div className={`wt-navbar-wrapper ${isScrolled ? 'wt-scrolled' : ''}`}>
      <Navbar expand="lg" className="wt-floating-navbar">
        <Container fluid className="px-3 px-lg-4">

          {/* Brand / Logo - Added onClick */}
          <Navbar.Brand as={Link} to="/" onClick={scrollToTop} className="d-flex align-items-center gap-2">
            <img src={logo} alt="WebzenTools Logo" className="wt-nav-logo" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="premium-nav" className="wt-nav-toggle" />

          <Navbar.Collapse id="premium-nav">
            <Nav className="mx-auto align-items-center gap-1 gap-lg-3">

              {/* Added onClick to trigger scrollToTop */}
              <Nav.Link as={Link} to="/" onClick={scrollToTop} className={`wt-nav-link ${checkActive('/')}`}>
                Home
              </Nav.Link>

              {/* --- Standard Dropdown --- */}
              <NavDropdown title="Categories" id="categories-dropdown" className="wt-glass-dropdown">

                <Link to="/category/category-details" className="dropdown-item">
                  <FaFont size={14} className="me-2 wt-cyan-accent" /> Text Tools
                </Link>

                <Link to="/category/calculators" className="dropdown-item">
                  <FaCalculator size={14} className="me-2 wt-cyan-accent" /> Calculators
                </Link>

                <Link to="/category/developers" className="dropdown-item">
                  <FaCode size={14} className="me-2 wt-cyan-accent" /> Developer Tools
                </Link>

                <Link to="/category/date-time" className="dropdown-item">
                  <FaCalendarAlt size={14} className="me-2 wt-cyan-accent" /> Date & Time
                </Link>

                <NavDropdown.Divider />

                <Link to="/category" className="dropdown-item">
                  <FaShieldAlt size={14} className="me-2 wt-cyan-accent" /> View All Categories
                </Link>

              </NavDropdown>

              {/* --- Premium Mega Menu --- */}
              <NavDropdown title="Tools" id="tools-mega-menu" className="wt-glass-dropdown wt-mega-menu">
                <div className="wt-mega-menu-inner p-4">
                  <Row className="w-100 m-0">
                    {/* LEFT SIDE: Text Lists */}
                    <Col lg={5} className="d-flex flex-wrap justify-content-between pe-lg-4 mb-4 mb-lg-0">
                      <div className="mb-4 mb-lg-0">
                        <h6 className="wt-mega-title">Developers</h6>
                        <ul className="wt-mega-list list-unstyled">
                          <li><a href="#json">JSON Formatter</a></li>
                          <li><a href="#base64">Base64 Encoder</a></li>
                          <li><a href="#regex">Regex Tester</a></li>
                          <li><a href="#hash">Hash Generator</a></li>
                        </ul>
                      </div>
                      <div className="mb-4 mb-lg-0">
                        <h6 className="wt-mega-title highlight">Creators</h6>
                        <ul className="wt-mega-list list-unstyled">
                          <li><a href="#color">Color Picker</a></li>
                          <li><a href="#svg">SVG Optimizer</a></li>
                          <li><a href="#font">Font Pairing</a></li>
                          <li><a href="#css">CSS Generators</a></li>
                        </ul>
                      </div>
                      <div>
                        <h6 className="wt-mega-title">System</h6>
                        <ul className="wt-mega-list list-unstyled">
                          <li><a href="#cron">Cron Parser</a></li>
                          <li><a href="#jwt">JWT Decoder</a></li>
                          <li><a href="#dns">DNS Lookup</a></li>
                        </ul>
                      </div>
                    </Col>

                    {/* Vertical Divider line */}
                    <div className="d-none d-lg-block wt-mega-divider"></div>

                    {/* RIGHT SIDE: Image Grid */}
                    <Col lg={6} className="ps-lg-4">
                      <div className="d-flex justify-content-between align-items-end mb-3">
                        <h6 className="wt-mega-title m-0">Featured Tools</h6>
                        <Link to="/all_tools" className="wt-view-all-link">Explore all tools &rarr;</Link>
                      </div>
                      <div className="d-flex flex-wrap flex-md-nowrap gap-3 mt-3">
                        <a href="#dev" className="wt-mega-img-card text-decoration-none flex-fill">
                          <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&q=80" alt="Code" className="img-fluid rounded-3 mb-2" />
                          <span className="d-block small fw-bold text-white text-center">Code Utilities</span>
                        </a>
                        <a href="#img" className="wt-mega-img-card text-decoration-none flex-fill">
                          <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&q=80" alt="Design" className="img-fluid rounded-3 mb-2" />
                          <span className="d-block small fw-bold text-white text-center">Image Suite</span>
                        </a>
                        <a href="#seo" className="wt-mega-img-card text-decoration-none flex-fill">
                          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&q=80" alt="Data" className="img-fluid rounded-3 mb-2" />
                          <span className="d-block small fw-bold text-white text-center">Data Analytics</span>
                        </a>
                      </div>
                    </Col>
                  </Row>
                </div>
              </NavDropdown>

              {/* Added onClick to trigger scrollToTop */}
              <Nav.Link as={Link} to="/about" onClick={scrollToTop} className={`wt-nav-link ${checkActive('/about')}`}>
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" onClick={scrollToTop} className={`wt-nav-link ${checkActive('/contact')}`}>
                Contact
              </Nav.Link>

            </Nav>

            {/* --- Search Bar --- */}
            <Form className="d-flex align-items-center position-relative mt-3 mt-lg-0 ms-lg-3">
              <FaSearch className="wt-search-icon position-absolute ms-3" size={14} />
              <Form.Control
                type="search"
                placeholder="Search tools..."
                className="wt-premium-search ps-5"
                aria-label="Search"
              />
            </Form>

          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default PremiumNavbar;