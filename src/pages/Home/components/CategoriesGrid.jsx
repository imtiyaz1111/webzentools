import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * CategoriesGrid component for the landing page.
 * Displays a grid of available tool categories.
 */
const CategoriesGrid = ({ categories }) => {
    return (
        <section className="categories-grid-section py-5">
            <Container>
                <div className="text-center mb-5">
                    <h2 className="display-6 fw-bold mb-3">Browse by <span className="text-gradient">Category</span></h2>
                    <p className="text-muted">Explore our massive library of tools organized by their primary function.</p>
                </div>

                <Row className="g-4">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <Col lg={3} md={4} sm={6} key={cat.id}>
                                <Link to={`/tools?category=${cat.id}`} className="category-premium-card text-decoration-none h-100 d-block">
                                    <div className="glass-card p-4 rounded-4 text-center hover-glow h-100 transition-all">
                                        <div className={`category-icon-bg mb-3 mx-auto ${cat.color.replace('text-', 'bg-')} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center`} style={{ width: '60px', height: '60px' }}>
                                            <div className={cat.color}><Icon size={24} /></div>
                                        </div>
                                        <h5 className="fw-bold text-dark mb-1">{cat.name}</h5>
                                        <p className="text-muted small mb-0">{cat.count} Tools</p>
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
