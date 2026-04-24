import React from 'react';
import { Container, Row, Col, Button, Badge, Form } from 'react-bootstrap';
import { Search, ArrowRight, ShieldCheck, Zap, Rocket, Cpu, Globe, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import hero3d from "../../../assets/img/hero-3d.png";

/**
 * Hero component for the landing page.
 * Includes a premium search bar and value propositions.
 */
const Hero = ({ searchQuery, setSearchQuery, handleSearchSubmit, filteredTools }) => {
    return (
        <section className="premium-hero-section overflow-hidden position-relative">
            {/* Background Mesh Gradient */}
            <div className="hero-mesh-bg"></div>
            
            <div className="hero-glow glow-left"></div>
            <div className="hero-glow glow-right"></div>

            <Container className="position-relative z-2 pt-5 pb-4">
                <Row className="align-items-center">
                    <Col lg={7} xl={6} className="text-lg-start text-center mb-5 mb-lg-0">
                        <Badge className="hero-premium-badge mb-4 border d-inline-flex align-items-center gap-2 px-3 py-2">
                            <span className="badge-dot"></span>
                            <span className="badge-text text-white">New: AI Powered SEO Suite</span>
                            <ArrowRight size={14} className="ms-1" />
                        </Badge>

                        <h1 className="hero-headline display-2 fw-bold mb-4">
                            Powerful Tools. <br />
                            <span className="text-gradient">Zero Friction.</span>
                        </h1>

                        <p className="hero-subheadline mb-5 text-muted lead mx-lg-0 mx-auto">
                            The ultimate ecosystem of 100+ browser-based utilities. 
                            Built for developers who value <span className="fw-bold text-primary">speed, privacy, and precision.</span>
                        </p>

                        {/* SEARCH BAR HERO */}
                        <div className="search-hero-container position-relative mb-5 mx-lg-0 mx-auto" style={{ maxWidth: '600px' }}>
                            <Form onSubmit={handleSearchSubmit}>
                                <div className="premium-search-box glass-card p-2 rounded-pill d-flex align-items-center shadow-2xl">
                                    <div className="px-3 text-primary">
                                        <Search size={22} strokeWidth={2.5} />
                                    </div>
                                    <Form.Control
                                        type="text"
                                        placeholder="Type tool name (e.g. JSON, Image)..."
                                        className="border-0 bg-transparent py-2 shadow-none fs-5"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <Button type="submit" className="rounded-pill px-4 py-2 border-0 fw-bold hero-btn-primary ms-2 d-none d-sm-block">
                                        Find Tool
                                    </Button>
                                </div>

                                {/* Search Dropdown Results */}
                                {searchQuery && filteredTools.length > 0 && (
                                    <div className="search-dropdown glass-card position-absolute w-100 mt-3 p-2 rounded-4 text-start z-3 shadow-2xl">
                                        <div className="px-3 py-2 text-muted small fw-bold text-uppercase tracking-wider">Top Matches</div>
                                        {filteredTools.slice(0, 5).map(tool => (
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
                                <ShieldCheck size={18} className="text-success" /> Cloud Privacy
                            </div>
                            <div className="d-flex align-items-center gap-2 indicator-item">
                                <Zap size={18} className="text-warning" /> No Registration
                            </div>
                            <div className="d-flex align-items-center gap-2 indicator-item">
                                <Rocket size={18} className="text-primary" /> Instant Export
                            </div>
                        </div>
                    </Col>

                    <Col lg={5} xl={6} className="d-none d-lg-block">
                        <div className="hero-visual-wrapper position-relative">
                            <div className="hero-3d-container">
                                <img src={hero3d} alt="WebzenTools 3D Visual" className="img-fluid hero-3d-img" />
                                
                                {/* Floating Badges */}
                                <div className="floating-badge badge-1 glass-card shadow-xl">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="badge-icon bg-warning text-white"><Cpu size={14} /></div>
                                        <span>AI Enhanced</span>
                                    </div>
                                </div>
                                <div className="floating-badge badge-2 glass-card shadow-xl">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="badge-icon bg-primary text-white"><Globe size={14} /></div>
                                        <span>100% Client-side</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Trust Bar Section */}
            <div className="hero-trust-bar py-5 border-top border-bottom border-light border-opacity-10">
                <Container>
                    <div className="d-flex flex-wrap justify-content-center align-items-center gap-lg-5 gap-4 opacity-50">
                        <div className="trust-item d-flex align-items-center gap-2">
                            <Server size={20} /> <span className="fw-bold h5 mb-0">Edge Computing</span>
                        </div>
                        <div className="trust-item d-flex align-items-center gap-2">
                            <ShieldCheck size={20} /> <span className="fw-bold h5 mb-0">AES-256</span>
                        </div>
                        <div className="trust-item d-flex align-items-center gap-2">
                            <Cpu size={20} /> <span className="fw-bold h5 mb-0">V8 Optimized</span>
                        </div>
                        <div className="trust-item d-flex align-items-center gap-2">
                            <Globe size={20} /> <span className="fw-bold h5 mb-0">Open Source</span>
                        </div>
                    </div>
                </Container>
            </div>
        </section>
    );
};

export default Hero;

