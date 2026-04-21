import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Search, Zap, ShieldCheck } from 'lucide-react';

/**
 * Features / How it Works component for the landing page.
 * Explains the three-step process of using the platform.
 */
const Features = () => {
    return (
        <section className="how-it-works-section py-5 position-relative">
            <Container>
                <div className="text-center mb-5">
                    <h2 className="display-6 fw-bold mb-3">How <span className="text-gradient">WebzenTools</span> Works</h2>
                    <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                        Your privacy and speed are our top priority. Here is how we deliver state-of-the-art tools right in your browser.
                    </p>
                </div>

                <div className="steps-container position-relative">
                    {/* Desktop Connector Line */}
                    <div className="steps-connector d-none d-lg-block"></div>

                    <Row className="g-4 position-relative z-2">
                        <Col lg={4}>
                            <div className="step-card glass-card p-5 rounded-5 text-center h-100 hover-glow">
                                <div className="step-number">01</div>
                                <div className="step-icon-bg mb-4 border border-primary border-opacity-20 bg-primary bg-opacity-10 rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>
                                    <Search size={32} className="text-primary" />
                                </div>
                                <h4 className="fw-bold text-dark mb-3">Search</h4>
                                <p className="text-muted mb-0">
                                    Find the exact utility you need from our library of 100+ professional tools.
                                </p>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="step-card glass-card p-5 rounded-5 text-center h-100 hover-glow">
                                <div className="step-number">02</div>
                                <div className="step-icon-bg mb-4 border border-warning border-opacity-20 bg-warning bg-opacity-10 rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                                    <Zap size={32} className="text-warning" />
                                </div>
                                <h4 className="fw-bold text-dark mb-3">Process</h4>
                                <p className="text-muted mb-0">
                                    All tools run locally in your browser using high-performance logic. Lightning fast.
                                </p>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="step-card glass-card p-5 rounded-5 text-center h-100 hover-glow">
                                <div className="step-number">03</div>
                                <div className="step-icon-bg mb-4 border border-success border-opacity-20 bg-success bg-opacity-10 rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                                    <ShieldCheck size={32} className="text-success" />
                                </div>
                                <h4 className="fw-bold text-dark mb-3">Zero Uploads</h4>
                                <p className="text-muted mb-0">
                                    No server round-trips. Your sensitive data never leaves your computer for maximum security.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </section>
    );
};

export default Features;
