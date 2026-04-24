import React from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Star, Zap, ArrowUpRight } from 'lucide-react';

/**
 * TrendingTools component for the landing page.
 * Displays a list of popular and recently added tools.
 */
const TrendingTools = ({ tools }) => {
    return (
        <section className="trending-section py-5 bg-light bg-opacity-30">
            <Container className="py-5">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
                    <div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="trending-pulse"></span>
                            <span className="text-primary fw-bold small text-uppercase tracking-widest">Live Updates</span>
                        </div>
                        <h2 className="display-5 fw-bold mb-0">Trending <span className="text-gradient">Utilities</span></h2>
                    </div>
                    <Link to="/tools" className="btn-modern-secondary text-decoration-none">
                        Explore Full Library <ArrowUpRight size={18} className="ms-1" />
                    </Link>
                </div>

                <Row className="g-4">
                    {tools.map((tool) => (
                        <Col lg={4} md={6} key={tool.id}>
                            <Link to={`/tools/${tool.slug}`} className="tool-modern-link text-decoration-none">
                                <div className="tool-modern-card p-4 rounded-5 h-100 position-relative transition-all overflow-hidden border border-white border-opacity-50">
                                    <div className="tool-card-overlay"></div>
                                    
                                    <div className="d-flex justify-content-between align-items-start mb-4 position-relative z-2">
                                        <div className="tool-icon-frame bg-white shadow-sm rounded-4 d-flex align-items-center justify-content-center">
                                            <Zap size={24} className="text-primary" />
                                        </div>
                                        {tool.isPremium && (
                                            <Badge className="premium-pill border-0 px-3 py-2">
                                                <Star size={12} className="me-1 fill-white" /> Featured
                                            </Badge>
                                        )}
                                    </div>
                                    
                                    <div className="position-relative z-2">
                                        <h4 className="fw-bold text-dark mb-2">{tool.name}</h4>
                                        <p className="text-muted small mb-4 lh-lg" style={{ minHeight: '48px' }}>
                                            {tool.desc}
                                        </p>
                                        
                                        <div className="d-flex align-items-center justify-content-between pt-3 border-top border-light">
                                            <span className="cat-tag">{tool.category}</span>
                                            <div className="launch-text fw-bold small d-flex align-items-center gap-1">
                                                Launch Tool <ArrowUpRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
};

export default TrendingTools;

