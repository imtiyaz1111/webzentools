import React, { useState, useEffect, useMemo } from 'react';
import { Navbar, Nav, NavDropdown, Container, Form, Row, Col } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { LayoutGrid, Zap } from 'lucide-react';

// Assets & Data
import logo from "../assets/img/logo.png";
import { categories, allTools } from '../data/toolsData';
import useToolSearch from '../hooks/useToolSearch';

/**
 * PremiumNavbar Component
 * A floating, glassmorphism-styled navigation bar with 
 * integrated search and mega-menu for tools.
 */
const PremiumNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Phase 3: Centralized Search Logic
  const { 
    searchQuery, 
    setSearchQuery, 
    handleSearchSubmit 
  } = useToolSearch();

  // ===== SCROLL HANDLER =====
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to determine active route
  const checkActive = (path) => {
    if (path === '/') return location.pathname === '/' ? "active" : "";
    return location.pathname.startsWith(path) ? "active" : "";
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Memoize featured tools for mega menu performance
  const featuredTools = useMemo(() => {
    return allTools.filter(t => t.isPremium).slice(0, 4);
  }, []);

  return (
    <div className={`wt-navbar-wrapper ${isScrolled ? 'wt-scrolled' : ''}`}>
      <Navbar expand="lg" className="wt-floating-navbar shadow-lg">
        <Container fluid className="px-3 px-lg-4">
          {/* LOGO */}
          <Navbar.Brand as={Link} to="/" onClick={scrollToTop} className="d-flex align-items-center gap-2">
            <img src={logo} alt="WebzenTools Logo" className="wt-nav-logo" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="premium-nav" className="wt-nav-toggle rounded-circle" />

          <Navbar.Collapse id="premium-nav">
            <Nav className="mx-auto align-items-center gap-1 gap-lg-2">
              <Nav.Link as={Link} to="/" onClick={scrollToTop} className={`wt-nav-link ${checkActive('/')}`}>
                Home
              </Nav.Link>

              {/* DYNAMIC CATEGORIES DROPDOWN */}
              <NavDropdown 
                title="Categories" 
                id="categories-dropdown" 
                className={`wt-glass-dropdown ${checkActive('/category') || checkActive('/tools?category') ? 'active' : ''}`}
              >
                <div className="dropdown-grid p-2" style={{ minWidth: '220px' }}>
                  {categories.slice(0, 8).map(cat => {
                    const Icon = cat.icon;
                    return (
                      <Link key={cat.id} to={`/category/${cat.id}`} className="dropdown-item">
                        <div className={`${cat.color} bg-opacity-10 p-2 rounded-3 me-2 d-flex align-items-center justify-content-center`} style={{ width: '32px', height: '32px' }}>
                          <Icon size={16} />
                        </div>
                        <span className="fw-medium">{cat.name}</span>
                      </Link>
                    );
                  })}
                  <div className="dropdown-divider"></div>
                  <Link to="/tools" className="dropdown-item fw-bold text-primary">
                    <LayoutGrid size={16} className="me-2" /> View All 100+ Tools
                  </Link>
                </div>
              </NavDropdown>

              {/* DYNAMIC MEGA MENU */}
              <NavDropdown 
                title="Trending Tools" 
                id="tools-mega-menu" 
                className={`wt-glass-dropdown wt-mega-menu ${checkActive('/tools/') ? 'active' : ''}`}
              >
                <div className="wt-mega-menu-inner p-4 shadow-2xl">
                  <Row className="w-100 m-0">
                    <Col lg={7} className="pe-lg-4 mb-4 mb-lg-0 border-end border-light border-opacity-10">
                      <Row>
                        <Col md={6}>
                          <h6 className="wt-mega-title text-gradient small text-uppercase">Developer Tools</h6>
                          <ul className="wt-mega-list list-unstyled mt-3">
                            {allTools.filter(t => t.category === 'developer').slice(0, 4).map(t => (
                              <li key={t.id} className="mb-2">
                                <Link to={`/tools/${t.slug}`} className="d-flex align-items-center gap-2 silver-hover">
                                  <Zap size={14} className="text-warning" /> {t.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </Col>
                        <Col md={6}>
                          <h6 className="wt-mega-title highlight small text-uppercase">AI & Content</h6>
                          <ul className="wt-mega-list list-unstyled mt-3">
                            {allTools.filter(t => t.category === 'ai' || t.category === 'text').slice(0, 4).map(t => (
                              <li key={t.id} className="mb-2">
                                <Link to={`/tools/${t.slug}`} className="d-flex align-items-center gap-2 silver-hover">
                                  <Zap size={14} className="text-primary" /> {t.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </Col>
                      </Row>
                    </Col>

                    <Col lg={5} className="ps-lg-4">
                      <div className="d-flex justify-content-between align-items-end mb-3">
                        <h6 className="wt-mega-title m-0 small text-uppercase">Must Try Tools</h6>
                      </div>
                      <div className="d-flex flex-column gap-2">
                        {featuredTools.map(tool => (
                          <Link key={tool.id} to={`/tools/${tool.slug}`} className="wt-mega-tool-item glass-card p-3 rounded-4 text-decoration-none d-flex align-items-center gap-3 transition-all hover-glow">
                             <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary shadow-sm">
                               <Zap size={14} />
                             </div>
                             <div>
                                <div className="small fw-bold text-dark">{tool.name}</div>
                                <div className="text-muted tiny">{tool.category}</div>
                             </div>
                          </Link>
                        ))}
                      </div>
                    </Col>
                  </Row>
                </div>
              </NavDropdown>

              <Nav.Link as={Link} to="/about" onClick={scrollToTop} className={`wt-nav-link ${checkActive('/about')}`}>
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" onClick={scrollToTop} className={`wt-nav-link ${checkActive('/contact')}`}>
                Contact
              </Nav.Link>
            </Nav>

            {/* FUNCTIONAL SEARCH BAR */}
            <Form className="d-flex align-items-center position-relative mt-3 mt-lg-0 ms-lg-3" onSubmit={handleSearchSubmit}>
              <div className="position-absolute start-0 ms-3 z-3 text-muted wt-search-icon-box">
                <FaSearch size={14} className="wt-search-icon" />
              </div>
              <Form.Control
                type="search"
                placeholder="Search tools..."
                className="wt-premium-search ps-5 rounded-pill shadow-sm"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default PremiumNavbar;
