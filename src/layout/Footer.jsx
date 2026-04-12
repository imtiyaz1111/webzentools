import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

// Importing ALL icons from Font Awesome (via react-icons) to avoid any missing icon errors
import { FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaArrowRight } from 'react-icons/fa';

// Reusing your logo path
import logo from "../assets/img/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="premium-footer">
      <Container>
        <div className="footer-top-section">
          <Row className="gy-4">

            {/* Column 1: Brand & Description */}
            <Col lg={4} md={6} className="pe-lg-5">
              <div className="footer-brand mb-4">
                {/* Fallback to text if logo image is missing/broken */}
                <img
                  src={logo}
                  alt="Brand Logo"
                  className="footer-logo mb-3"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <h4 className="fw-bold text-white fallback-text" style={{ display: 'none' }}>
                  Brand<span className="text-primary">.</span>
                </h4>
              </div>
              <p className="footer-description">
                Elevating your digital experience with premium tools and seamless interfaces.
                Built for creators, developers, and visionaries.
              </p>
              <div className="footer-socials mt-4">
                <a href="#twitter" className="social-icon" aria-label="Twitter"><FaTwitter size={20} /></a>
                <a href="#instagram" className="social-icon" aria-label="Instagram"><FaInstagram size={20} /></a>
                <a href="#linkedin" className="social-icon" aria-label="LinkedIn"><FaLinkedin size={20} /></a>
              </div>
            </Col>

            {/* Column 2: Quick Links */}
            <Col lg={2} md={6}>
              <h5 className="footer-heading">Explore</h5>
              <ul className="footer-links list-unstyled">
                <li><a href="#home">Home</a></li>
                <li><a href="#tools">All Tools</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </Col>

            {/* Column 3: Legal Pages */}
            <Col lg={2} md={6}>
              <h5 className="footer-heading">Legal</h5>
              <ul className="footer-links list-unstyled">
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#cookies">Cookie Policy</a></li>
                <li><a href="#licenses">Licenses</a></li>
                <li><a href="#guidelines">Brand Guidelines</a></li>
              </ul>
            </Col>

            {/* Column 4: Newsletter Widget */}
            <Col lg={4} md={6}>
              <h5 className="footer-heading">Stay in the loop</h5>
              <p className="footer-description mb-3">
                Get the latest updates, tool releases, and platform news delivered to your inbox.
              </p>
              <Form className="footer-newsletter d-flex align-items-center position-relative">
                <FaEnvelope className="newsletter-icon position-absolute ms-3" size={18} />
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input ps-5"
                  aria-label="Email address"
                />
                <Button variant="primary" className="newsletter-btn position-absolute">
                  <FaArrowRight size={18} />
                </Button>
              </Form>
            </Col>

          </Row>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="footer-bottom-bar d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="mb-0 text-white small">
            &copy; {currentYear} WebzenTools. All rights reserved.
          </p>
          <div className="footer-bottom-links mt-2 mt-md-0">
            <a href="#status" className="small text-white me-3">System Status</a>
            <a href="#security" className="small text-white">Security</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;