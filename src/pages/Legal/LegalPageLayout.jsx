import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Home, ChevronRight } from 'lucide-react';
import SEO from '../../components/SEO';
import "../About/About.css"; // Reuse About styles for consistency

const LegalPageLayout = ({ title, description, keywords, breadcrumb, children }) => {
    const pageUrl = window.location.href;

    return (
        <>
            <SEO
                title={`${title} | WebzenTools`}
                description={description}
                keywords={keywords}
                url={pageUrl}
            />
            
            <section className="wt-about-hero position-relative d-flex align-items-center">
                <div className="wt-grid-overlay"></div>
                <div className="wt-glow wt-glow-left"></div>
                <div className="wt-glow wt-glow-right"></div>

                <Container className="position-relative z-3 text-center wt-content-wrapper">
                    <div className="wt-fade-in-1 mb-4">
                        <div className="wt-breadcrumb-pill d-inline-flex align-items-center shadow-lg">
                            <Home size={15} className="wt-cyan-accent me-2" />
                            <a href="/" className="wt-breadcrumb-link text-decoration-none fw-medium">
                                Home
                            </a>
                            <ChevronRight size={14} className="wt-breadcrumb-separator mx-2" />
                            <span className="wt-cyan-accent fw-bold d-flex align-items-center">
                                <span className="wt-active-dot me-2"></span>
                                {breadcrumb}
                            </span>
                        </div>
                    </div>

                    <h1 className="display-2 fw-bolder text-white mb-4 wt-tracking-tight wt-fade-in-2">
                        {title}
                    </h1>
                </Container>
            </section>

            <section className="wt-about-content-section py-5 position-relative bg-white">
                <Container className="py-5 z-3 position-relative">
                    <Row className="justify-content-center">
                        <Col lg={10} className="wt-fade-in-3">
                            <div className="legal-content text-dark" style={{ lineHeight: '1.8' }}>
                                {children}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default LegalPageLayout;
