import React from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Star, Zap, ArrowRight } from 'lucide-react';

/**
 * TrendingTools component for the landing page.
 * Displays a list of popular and recently added tools.
 */
const TrendingTools = ({ tools }) => {
    return (
        <section className="trending-section py-5 bg-light bg-opacity-50">
            <Container>
                <div className="d-flex justify-content-between align-items-end mb-5">
                    <div>
                        <Badge bg="primary" className="mb-2">Recently Added</Badge>
                        <h2 className="display-6 fw-bold mb-0">Trending <span className="text-gradient">Tools</span></h2>
                    </div>
                    <Link to="/tools" className="btn btn-outline-primary rounded-pill px-4 btn-sm fw-bold">View All Tools</Link>
                </div>

                <Row className="g-4">
                    {tools.map((tool) => (
                        <Col lg={4} md={6} key={tool.id}>
                            <Link to={`/tools/${tool.slug}`} className="tool-premium-card-link text-decoration-none">
                                <div className="glass-card p-4 rounded-4 h-100 position-relative hover-glow overflow-hidden">
                                    <div className="tool-badge-top position-absolute top-0 end-0 p-3">
                                        {tool.isPremium ? (
                                            <Badge bg="warning" className="rounded-pill">
                                                <Star size={12} className="me-1" /> PREMIUM
                                            </Badge>
                                        ) : (
                                            <Badge bg="info" className="bg-opacity-10 text-info rounded-pill">FREE</Badge>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <div className="p-3 bg-white shadow-sm rounded-4 d-inline-block text-primary">
                                            <Zap size={24} />
                                        </div>
                                    </div>
                                    <h4 className="fw-bold text-dark mb-2">{tool.name}</h4>
                                    <p className="text-muted small mb-4 lh-base" style={{ height: '40px', overflow: 'hidden' }}>
                                        {tool.desc}
                                    </p>
                                    <div className="d-flex align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-10">
                                        <span className="small fw-bold text-uppercase tracking-wider text-muted">{tool.category}</span>
                                        <div className="text-primary fw-bold small d-flex align-items-center gap-1">
                                            Launch <ArrowRight size={14} />
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
