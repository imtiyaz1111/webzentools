import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Zap, ShieldCheck, Grid, Star } from 'lucide-react';

/**
 * BentoStats component for the landing page.
 * Displays key features and statistics in a modern bento grid layout.
 */
const BentoStats = () => {
    return (
        <section className="why-choose-us py-5 bg-dark position-relative overflow-hidden">
            <div className="cta-glow cta-glow-blue opacity-25"></div>
            <Container className="position-relative z-2 py-5">
                <Row className="mb-5 text-center">
                    <Col lg={12}>
                        <h2 className="display-5 fw-bold text-white mb-3">Engineered for <span className="text-gradient">Professionals</span></h2>
                        <p className="text-white-50 mx-auto" style={{ maxWidth: '600px' }}>
                            We combine state-of-the-art performance with high-end design to give you tools that aren't just useful, but a joy to use.
                        </p>
                    </Col>
                </Row>

                <Row className="g-4">
                    <Col lg={8}>
                        <div className="bento-card bento-card-lightning p-5 rounded-4 h-100 d-flex flex-column justify-content-center overflow-hidden position-relative">
                            <div className="bento-glow"></div>
                            <Zap className="text-primary mb-4 position-relative z-2" size={48} />
                            <h3 className="text-white display-6 fw-bold mb-3 position-relative z-2">Lightning Fast Processing</h3>
                            <p className="text-white-50 fs-5 mb-0 position-relative z-2">
                                Our tools run entirely in your browser using the latest WebAssembly and client-side optimization.
                                No server round-trips mean zero lag and maximum privacy for your data.
                            </p>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="bento-card bento-card-privacy p-5 rounded-4 h-100 d-flex flex-column justify-content-center overflow-hidden position-relative">
                            <div className="bento-glow"></div>
                            <ShieldCheck className="text-success mb-4 position-relative z-2" size={48} />
                            <h3 className="text-white fw-bold mb-3 position-relative z-2">Privacy First</h3>
                            <p className="text-white-50 position-relative z-2">
                                Your files and data never leave your computer. We don't store your input or your results – period.
                            </p>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="bento-card bento-card-tools p-5 rounded-4 h-100 d-flex flex-column justify-content-center overflow-hidden position-relative">
                            <div className="bento-glow"></div>
                            <Grid className="text-info mb-4 position-relative z-2" size={48} />
                            <h3 className="text-white fw-bold mb-3 position-relative z-2">100+ Tools</h3>
                            <p className="text-white-50 position-relative z-2">
                                A massive collection spanning 10 categories, from developer utilities to AI-powered writing assistants.
                            </p>
                        </div>
                    </Col>
                    <Col lg={8}>
                        <div className="bento-card bento-card-premium p-5 rounded-4 h-100 d-flex flex-column justify-content-center overflow-hidden position-relative">
                            <div className="bento-glow"></div>
                            <Star className="text-warning mb-4 position-relative z-2" size={48} />
                            <h3 className="text-white display-6 fw-bold mb-3 position-relative z-2">Premium User Experience</h3>
                            <p className="text-white-50 fs-5 mb-0 position-relative z-2">
                                Clean, ad-light interface with keyboard shortcuts, dark mode support, and seamless mobile responsiveness.
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default BentoStats;
