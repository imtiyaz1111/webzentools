import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Zap, ShieldCheck, Grid, Star, Sparkles } from 'lucide-react';

/**
 * BentoStats component for the landing page.
 * Displays key features and statistics in a modern bento grid layout.
 */
const BentoStats = () => {
    return (
        <section className="why-choose-us py-5 bg-dark position-relative overflow-hidden">
            {/* Animated Background Gradients */}
            <div className="cta-glow cta-glow-blue opacity-25"></div>
            <div className="cta-glow cta-glow-purple opacity-25" style={{ top: '50%', right: '0', background: 'var(--secondary)' }}></div>

            <Container className="position-relative z-2 py-5">
                <Row className="mb-5 text-center">
                    <Col lg={12}>
                        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white bg-opacity-10 text-white fw-bold small mb-3">
                            <Sparkles size={14} className="text-warning" /> BUILT FOR PERFORMANCE
                        </div>
                        <h2 className="display-4 fw-bold text-white mb-3">Engineered for <span className="text-gradient">Professionals</span></h2>
                        <p className="text-white-50 mx-auto fs-5" style={{ maxWidth: '700px' }}>
                            We've optimized every line of code to ensure WebzenTools remains 
                            the fastest utility platform on the planet.
                        </p>
                    </Col>
                </Row>

                <Row className="g-4">
                    <Col lg={8}>
                        <div className="bento-card bento-card-lightning p-lg-5 p-4 rounded-5 h-100 d-flex flex-column justify-content-center overflow-hidden position-relative">
                            <div className="bento-glow"></div>
                            <div className="bento-icon-box mb-4 bg-primary bg-opacity-20 rounded-4 d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                                <Zap className="text-white" size={28} />
                            </div>
                            <h3 className="text-white display-6 fw-bold mb-3 position-relative z-2">Sub-Millisecond Processing</h3>
                            <p className="text-white-50 fs-5 mb-0 position-relative z-2 lh-lg">
                                Leveraging WebAssembly and modern V8 optimizations, our tools execute 
                                complex operations instantly, right in your browser memory.
                            </p>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="bento-card bento-card-privacy p-lg-5 p-4 rounded-5 h-100 d-flex flex-column justify-content-center overflow-hidden position-relative">
                            <div className="bento-glow"></div>
                            <div className="bento-icon-box mb-4 bg-success bg-opacity-20 rounded-4 d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                                <ShieldCheck className="text-white" size={28} />
                            </div>
                            <h3 className="text-white fw-bold mb-3 position-relative z-2 h2">Privacy First</h3>
                            <p className="text-white-50 position-relative z-2 lh-lg">
                                Local-only processing means zero data transmission. Your sensitive 
                                input never touches a server, ensuring 100% data sovereignty.
                            </p>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="bento-card bento-card-tools p-lg-5 p-4 rounded-5 h-100 d-flex flex-column justify-content-center overflow-hidden position-relative">
                            <div className="bento-glow"></div>
                            <div className="bento-icon-box mb-4 bg-info bg-opacity-20 rounded-4 d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                                <Grid className="text-white" size={28} />
                            </div>
                            <h3 className="text-white fw-bold mb-3 position-relative z-2 h2">Universal Toolbox</h3>
                            <p className="text-white-50 position-relative z-2 lh-lg">
                                A massive collection spanning 10 distinct categories, meticulously 
                                crafted to solve every developer bottleneck.
                            </p>
                        </div>
                    </Col>
                    <Col lg={8}>
                        <div className="bento-card bento-card-premium p-lg-5 p-4 rounded-5 h-100 d-flex flex-column justify-content-center overflow-hidden position-relative">
                            <div className="bento-glow"></div>
                            <div className="bento-icon-box mb-4 bg-warning bg-opacity-20 rounded-4 d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                                <Star className="text-white" size={28} />
                            </div>
                            <h3 className="text-white display-6 fw-bold mb-3 position-relative z-2">Premium UI Architecture</h3>
                            <p className="text-white-50 fs-5 mb-0 position-relative z-2 lh-lg">
                                Clean, focus-driven interface with adaptive dark mode, high-contrast 
                                accessibility, and seamless multi-device responsiveness.
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default BentoStats;

