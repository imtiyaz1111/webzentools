import React from 'react';
import { Container, Row, Col, Button, Badge, Form } from 'react-bootstrap';
import { Search, ArrowRight, ShieldCheck, Zap, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBg from "../../../assets/hero_bg_premium.png";

/**
 * Hero component for the landing page.
 * Includes a premium search bar and value propositions.
 */
const Hero = ({ searchQuery, setSearchQuery, handleSearchSubmit, filteredTools }) => {
    return (
        <section className="premium-hero-section py-5 overflow-hidden position-relative">
            {/* Background Shapes & Glows */}
            <div className="hero-bg-container">
                <img src={heroBg} alt="Premium background" className="hero-bg-img" />
                <div className="hero-shape-overlay"></div>
            </div>

            <div className="hero-glow glow-left"></div>
            <div className="hero-glow glow-right"></div>

            <Container className="position-relative z-2 py-5">
                <Row className="align-items-center">
                    <Col lg={7} xl={6} className="text-lg-start text-center mb-5 mb-lg-0">
                        <Badge className="hero-premium-badge mb-4 border d-inline-flex align-items-center gap-2">
                            <span className="badge-dot"></span>
                            <span className="badge-text text-white">Trusted by 50k+ Developers</span>
                            <ArrowRight size={14} className="ms-1" />
                        </Badge>

                        <h1 className="hero-headline display-3 fw-bold mb-4">
                            One Platform. <br />
                            <span className="text-gradient">Every Utility You Need.</span>
                        </h1>

                        <p className="hero-subheadline mb-5 text-muted lead">
                            Access 100+ premium tools for developers, designers, and creators.
                            High-performance, SEO-optimized, and <span className="fw-bold text-dark">free forever.</span>
                        </p>

                        {/* SEARCH BAR HERO */}
                        <div className="search-hero-container position-relative mb-5">
                            <Form onSubmit={handleSearchSubmit}>
                                <div className="premium-search-box glass-card p-2 rounded-pill d-flex align-items-center shadow-xl hover-glow">
                                    <div className="px-3 text-primary">
                                        <Search size={22} strokeWidth={2.5} />
                                    </div>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search tools (e.g. JSON, Image, EMI)..."
                                        className="border-0 bg-transparent py-2 shadow-none fs-5"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <Button type="submit" className="rounded-pill px-4 py-2 border-0 fw-bold hero-btn-primary ms-2 d-none d-sm-block">
                                        Find Tools
                                    </Button>
                                </div>

                                {/* Search Dropdown Results */}
                                {searchQuery && filteredTools.length > 0 && (
                                    <div className="search-dropdown glass-card position-absolute w-100 mt-3 p-2 rounded-4 text-start z-3 shadow-2xl">
                                        <div className="px-3 py-2 text-muted small fw-bold text-uppercase tracking-wider">Top Results</div>
                                        {filteredTools.map(tool => (
                                            <Link key={tool.id} to={`/tools/${tool.slug}`} className="dropdown-tool-item d-flex align-items-center p-3 rounded-3 text-decoration-none transition-all">
                                                <div className="tool-mini-icon me-3 bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                                                    <Zap size={18} />
                                                </div>
                                                <div>
                                                    <h6 className="mb-0 text-dark fw-bold">{tool.name}</h6>
                                                    <small className="text-muted">{tool.category}</small>
                                                </div>
                                                <ArrowRight size={16} className="ms-auto text-muted arrow-icon" />
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </Form>
                        </div>

                        <div className="d-flex flex-wrap justify-content-lg-start justify-content-center gap-4 text-muted small fw-medium">
                            <div className="d-flex align-items-center gap-2 indicator-item">
                                <ShieldCheck size={18} className="text-success" /> No Sign-up
                            </div>
                            <div className="d-flex align-items-center gap-2 indicator-item middle-indicator">
                                <Zap size={18} className="text-warning" /> 100% Browser Based
                            </div>
                            <div className="d-flex align-items-center gap-2 indicator-item">
                                <Rocket size={18} className="text-primary" /> Lightning Fast
                            </div>
                        </div>
                    </Col>

                    <Col lg={5} xl={6} className="d-none d-lg-block">
                        <div className="hero-visual-wrapper position-relative">
                            <div className="hero-main-visual glass-card p-2 rounded-5 overflow-hidden shadow-2xl rotate-3">
                                <div className="visual-inner rounded-4 overflow-hidden position-relative">
                                    <img src={heroBg} alt="Tool Interface" className="img-fluid hero-visual-img" />
                                    <div className="visual-overlay"></div>
                                </div>
                            </div>

                            {/* Floating Cards */}
                            <div className="floating-element float-1 glass-card p-3 rounded-4 shadow-xl">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-success bg-opacity-10 p-2 rounded-3 text-success">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <div className="fw-bold text-dark small">Data Secured</div>
                                        <div className="text-muted tiny">End-to-end Local</div>
                                    </div>
                                </div>
                            </div>

                            <div className="floating-element float-2 glass-card p-3 rounded-4 shadow-xl">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <div className="fw-bold text-dark small">100+ Tools</div>
                                        <div className="text-muted tiny">Ready to launch</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Hero;
