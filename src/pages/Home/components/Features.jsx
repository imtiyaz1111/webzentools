import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Search, Zap, ShieldCheck, Cpu, MousePointer2, Layout } from 'lucide-react';

/**
 * Features / How it Works component for the landing page.
 * Explains the three-step process of using the platform.
 */
const Features = () => {
    return (
        <section className="how-it-works-section py-5 position-relative">
            <Container className="py-5">
                <div className="text-center mb-5">
                    <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary bg-opacity-10 text-primary fw-bold small mb-3">
                        <Cpu size={14} /> SYSTEM ARCHITECTURE
                    </div>
                    <h2 className="display-5 fw-bold mb-3">How <span className="text-gradient">WebzenTools</span> Works</h2>
                    <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                        Experience the power of edge-computing. Our tools are engineered to run 
                        entirely within your browser for unmatched speed and privacy.
                    </p>
                </div>

                <div className="steps-container position-relative px-lg-5">
                    {/* Desktop Connected Path */}
                    <svg className="steps-path-svg d-none d-lg-block" width="100%" height="100" viewBox="0 0 1000 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M150 50 H850" stroke="url(#grad-line)" strokeWidth="2" strokeDasharray="10 10" />
                        <defs>
                            <linearGradient id="grad-line" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                                <stop offset="50%" stopColor="var(--primary)" />
                                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.2" />
                            </linearGradient>
                        </defs>
                    </svg>

                    <Row className="g-5 position-relative z-2">
                        <Col lg={4}>
                            <div className="step-modern-card p-4 rounded-5 text-center h-100">
                                <div className="step-index-badge mb-4 mx-auto">01</div>
                                <div className="step-icon-glow mb-4 mx-auto d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-4">
                                    <Search size={32} className="text-primary" />
                                </div>
                                <h4 className="fw-bold text-dark mb-3">Instant Discovery</h4>
                                <p className="text-muted mb-0 lh-lg">
                                    Our lightning-fast search engine helps you find the right utility among 100+ professional tools in milliseconds.
                                </p>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="step-modern-card p-4 rounded-5 text-center h-100">
                                <div className="step-index-badge mb-4 mx-auto">02</div>
                                <div className="step-icon-glow mb-4 mx-auto d-flex align-items-center justify-content-center bg-secondary bg-opacity-10 rounded-4">
                                    <Zap size={32} className="text-secondary" />
                                </div>
                                <h4 className="fw-bold text-dark mb-3">V8-Optimized Logic</h4>
                                <p className="text-muted mb-0 lh-lg">
                                    Tools execute locally using your device's hardware, ensuring zero latency and a butter-smooth experience.
                                </p>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="step-modern-card p-4 rounded-5 text-center h-100">
                                <div className="step-index-badge mb-4 mx-auto">03</div>
                                <div className="step-icon-glow mb-4 mx-auto d-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-4">
                                    <ShieldCheck size={32} className="text-success" />
                                </div>
                                <h4 className="fw-bold text-dark mb-3">Privacy Isolation</h4>
                                <p className="text-muted mb-0 lh-lg">
                                    Zero server-side interaction means your sensitive data never leaves your environment. True privacy by design.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Micro-Features */}
                <div className="mt-5 pt-4 d-flex flex-wrap justify-content-center gap-lg-5 gap-3 opacity-75">
                    <div className="d-flex align-items-center gap-2 small fw-bold">
                        <MousePointer2 size={14} className="text-primary" /> Multi-tab Support
                    </div>
                    <div className="d-flex align-items-center gap-2 small fw-bold">
                        <Layout size={14} className="text-secondary" /> Progressive Web App
                    </div>
                    <div className="d-flex align-items-center gap-2 small fw-bold">
                        <Zap size={14} className="text-warning" /> Offline Capable
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default Features;

