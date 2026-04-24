import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * CategoriesGrid component for the landing page.
 * Displays a grid of available tool categories.
 */
const CategoriesGrid = ({ categories }) => {
    return (
        <section className="categories-grid-section py-5">
            <Container>
                <div className="text-center mb-5">
                    <div className="d-inline-block px-3 py-1 rounded-pill bg-primary bg-opacity-10 text-primary fw-bold small mb-3">
                        TOOLBOX EXPLORER
                    </div>
                    <h2 className="display-5 fw-bold mb-3">Browse by <span className="text-gradient">Category</span></h2>
                    <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                        Discover our comprehensive suite of high-performance utilities, 
                        expertly curated for every digital need.
                    </p>
                </div>

                <Row className="g-4">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <Col lg={3} md={4} sm={6} key={cat.id}>
                                <Link to={`/category/${cat.id}`} className="category-modern-card text-decoration-none h-100 d-block">
                                    <div className="modern-glass-card p-4 rounded-5 text-center h-100 transition-all">
                                        <div className={`cat-icon-wrapper mb-4 mx-auto ${cat.color.replace('text-', 'bg-')} bg-opacity-10 rounded-4 d-flex align-items-center justify-content-center shadow-sm`}>
                                            <div className={cat.color}><Icon size={28} strokeWidth={2} /></div>
                                        </div>
                                        <h4 className="fw-bold text-dark mb-2">{cat.name}</h4>
                                        <div className="d-flex align-items-center justify-content-center gap-2">
                                            <span className="text-muted small">{cat.count} Professional Tools</span>
                                            <ChevronRight size={14} className="text-primary mt-1 opacity-0 arrow-reveal" />
                                        </div>
                                        
                                        {/* Hidden Glow on Hover */}
                                        <div className="card-hover-glow"></div>
                                    </div>
                                </Link>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </section>
    );
};

export default CategoriesGrid;

