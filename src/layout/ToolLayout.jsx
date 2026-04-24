import React from 'react';
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaShareAlt, FaCopy, FaStar } from 'react-icons/fa';
import AdSection from '../components/AdSection';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const ToolLayout = ({ tool, children }) => {
    const shareUrl = window.location.href;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
    };

    if (!tool) return null;

    return (
        <div className="tool-page-wrapper py-5">
            <SEO 
                title={tool.metaTitle || `${tool.name} | WebzenTools`}
                description={tool.metaDescription || tool.desc}
                keywords={tool.metaKeywords}
                url={shareUrl}
            />

            <Container mt={5}>
                {/* Breadcrumbs */}
                <Breadcrumb className="custom-breadcrumb mb-4">
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
                        <FaHome className="me-1" /> Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/tools" }}>
                        Tools
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active className="text-capitalize">{tool.category.replace('-', ' ')}</Breadcrumb.Item>
                    <Breadcrumb.Item active>{tool.name}</Breadcrumb.Item>
                </Breadcrumb>

                {/* Top Ad */}
                <AdSection slot="top-banner" />

                <Row className="gy-4">
                    <Col lg={8}>
                        {/* Tool Header */}
                        <div className="tool-header mb-4 p-4 glass-card rounded-4">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h1 className="h2 fw-bold mb-0 text-gradient">{tool.name}</h1>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-glass btn-sm" onClick={handleCopyLink} title="Copy Link">
                                        <FaLink />
                                    </button>
                                    <button className="btn btn-glass btn-sm" title="Add to Favorites">
                                        <FaStar />
                                    </button>
                                </div>
                            </div>
                            <p className="text-muted mb-0">{tool.desc}</p>
                        </div>

                        {/* Tool UI */}
                        <div className="tool-content-area glass-card p-4 rounded-4 shadow-sm mb-4">
                            {children}
                        </div>

                        {/* Middle Ad */}
                        <AdSection slot="inline" />

                        {/* Related Info / SEO Content Placeholder */}
                        <div className="tool-info-section glass-card p-4 rounded-4 mb-4">
                            <h3 className="h5 fw-bold mb-3">How to use {tool.name}?</h3>
                            <p className="text-muted">
                                Simply follow the instructions above to use the {tool.name}. Our tools are designed to be intuitive and 100% browser-based, meaning your data never leaves your computer.
                            </p>
                        </div>
                    </Col>

                    <Col lg={4}>
                        {/* Sidebar Ad */}
                        <AdSection slot="sidebar" style={{ minHeight: '600px' }} />
                        
                        {/* Tool Sidebar Info */}
                        <div className="sidebar-card glass-card p-4 rounded-4 mb-4 sticky-top" style={{ top: '100px' }}>
                            <h4 className="h6 fw-bold mb-3 text-uppercase tracking-wider">Quick Actions</h4>
                            <div className="d-grid gap-2">
                                <button className="btn btn-primary rounded-pill d-flex align-items-center justify-content-center gap-2" onClick={handleCopyLink}>
                                    <FaShareAlt /> Share Tool
                                </button>
                                <button className="btn btn-outline-dark rounded-pill" onClick={() => window.print()}>
                                    Print Results
                                </button>
                            </div>
                            
                            <hr className="my-4 opacity-10" />
                            
                            <h4 className="h6 fw-bold mb-3 text-uppercase tracking-wider">Benefits</h4>
                            <ul className="list-unstyled small text-muted mb-0">
                                <li className="mb-2">✅ 100% Free to use</li>
                                <li className="mb-2">✅ No Sign-up required</li>
                                <li className="mb-2">✅ Privacy Focused (Local processing)</li>
                                <li className="mb-0">✅ Instant results</li>
                            </ul>
                        </div>
                    </Col>
                </Row>

                {/* Bottom Ad */}
                <AdSection slot="bottom-sticky" />
            </Container>
        </div>
    );
};

// Simple icon for FaLink since it wasn't imported from react-icons/fa
const FaLink = () => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.51.648 17.722 3.826 35.635 9.827 52.698 1.412 4.03.746 8.525-1.962 11.233l-5.646 5.646c-33.858 33.858-33.858 88.774 0 122.632 33.858 33.858 88.774 33.858 122.632 0l67.2-67.2c33.858-33.858 33.858-88.774 0-122.632l-10-10c-3.79-3.79-4.25-9.61-1.3-14 13.91-20.73 23.36-44.41 27.22-69.45a15.42 15.42 0 0 1 12.06-12.87c25.46-4.59 50.69-2.22 73.16 6.96a15.42 15.42 0 0 1 7.13 8.35zm118.28 118.28c-22.48-9.18-47.7-11.55-73.16-6.96a15.42 15.42 0 0 1-12.06-12.87c-3.86-25.03-13.31-48.72-27.22-69.45-2.95-4.39-2.49-10.21 1.3-14l10-10c33.858-33.858 88.774-33.858 122.632 0 33.858 33.858 33.858 88.774 0 122.632l-5.646 5.646c-2.708 2.708-7.204 3.374-11.233 1.962-17.063-6.001-34.976-9.179-52.698-9.827-13.81-.508-20.35 16.454-10.51 27.294l37.106 37.106c59.27 59.26 59.27 155.7 0 214.96-59.261 59.262-155.69 59.27-214.96 0l-67.2-67.2c-58.567-58.892-59.387-154.781-.36-214.59a15.42 15.42 0 0 1 8.35-7.13c22.48-9.18 47.7-11.55 73.16-6.96a15.42 15.42 0 0 1 12.06 12.87c3.86 25.03 13.31 48.72 27.22 69.45 2.95 4.39 2.49 10.21-1.3 14l-10 10c-33.858 33.858-88.774 33.858-122.632 0-33.858-33.858-33.858-88.774 0-122.632l67.2-67.2c59.27-59.27 155.699-59.262 214.96 0 59.27 59.26 59.27 155.7 0 214.96l-37.106 37.106c-9.84 9.84-26.786 3.3-27.294-10.51-.648-17.722-3.826-35.635-9.827-52.698-1.412-4.03-.746-8.525 1.962-11.233l5.646-5.646c33.858-33.858 33.858-88.774 0-122.632-33.858-33.858-88.774-33.858-122.632 0l-67.2 67.2c-33.858 33.858-33.858 88.774 0 122.632l10 10c3.79 3.79 4.25 9.61 1.3 14-13.91 20.73-23.36 44.41-27.22 69.45a15.42 15.42 0 0 1-12.06 12.87c-25.46 4.59-50.69 2.22-73.16-6.96a15.42 15.42 0 0 1-7.13-8.35z"></path>
    </svg>
);

export default ToolLayout;
