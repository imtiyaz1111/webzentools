import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Badge } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChevronRight, FaSearch, FaArrowRight, FaSyncAlt } from 'react-icons/fa';
import { Zap, Star, Filter } from 'lucide-react';

// Data & Hooks
import { categories, allTools } from '../../data/toolsData';
import useToolSearch from '../../hooks/useToolSearch';
import SEO from '../../components/SEO';

// Styles
import "./Tools.css";

/**
 * Tools Component
 * Catalog page displaying all available tools with filtering and search capabilities.
 */
const Tools = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    
    // Phase 3: Centralized Search Logic
    const { 
        searchQuery, 
        setSearchQuery, 
        handleSearchSubmit 
    } = useToolSearch(queryParams.get('q') || '');

    const navigate = useNavigate();
    const activeCategory = queryParams.get('category') || 'all';
    const [visibleCount, setVisibleCount] = useState(12);
    const [isLoading, setIsLoading] = useState(false);

    // Sync search query from URL
    useEffect(() => {
        const q = queryParams.get('q') || '';
        if (q !== searchQuery) {
            setSearchQuery(q);
        }
    }, [location.search, searchQuery, setSearchQuery]);

    // Handle Pagination
    const handleLoadMore = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            setVisibleCount(prev => prev + 12);
            setIsLoading(false);
        }, 600);
    }, []);

    // Filter Logic
    const filteredTools = useMemo(() => {
        return allTools.filter(tool => {
            const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCat = activeCategory === 'all' || tool.category === activeCategory;
            return matchesSearch && matchesCat;
        });
    }, [searchQuery, activeCategory]);

    const displayedTools = useMemo(() => filteredTools.slice(0, visibleCount), [filteredTools, visibleCount]);

    const clearFilters = useCallback(() => {
        navigate('/tools');
    }, [navigate]);

    const handleCategoryClick = (catId) => {
        const q = queryParams.get('q');
        const search = q ? `?category=${catId}&q=${q}` : `?category=${catId}`;
        navigate(`/tools${search}`);
    };

    return (
        <div className="tools-catalog-wrapper">
            <SEO
                title="Tools Catalog | WebzenTools"
                description="Browse our massive collection of premium developer, writing, and finance tools."
                keywords="online tools, json formatter, emi calculator, ai text generator, developer tools"
                url="https://webzentools.com/tools"
            />
            
            {/* HERO SECTION */}
            <section className="tools-hero text-center py-5 position-relative overflow-hidden bg-dark text-white">
                <div className="hero-glow"></div>
                <Container className="position-relative z-2 py-5">
                    <div className="wt-glass-breadcrumb d-inline-flex align-items-center mb-4">
                        <Link to="/" className="text-white-50 text-decoration-none">Home</Link>
                        <FaChevronRight size={10} className="mx-3 opacity-50" />
                        <span className="fw-bold">Tools</span>
                    </div>
                    <h1 className="display-4 fw-bold mb-3">All <span className="text-gradient">Premium Tools</span></h1>
                    <p className="lead text-white-50 mx-auto pb-4" style={{ maxWidth: '700px' }}>
                        Empower your workflow with our production-grade utility suite. 
                        Zero costs, maximum performance.
                    </p>
                    
                    {/* TOP SEARCH BAR */}
                    <div className="mx-auto" style={{ maxWidth: '600px' }}>
                        <Form onSubmit={handleSearchSubmit}>
                            <div className="glass-card p-2 rounded-pill d-flex align-items-center shadow-lg bg-white bg-opacity-10">
                                <div className="px-3 text-primary"><FaSearch /></div>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Search among 100+ tools..." 
                                    className="border-0 bg-transparent shadow-none text-white placeholder-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </Form>
                    </div>
                </Container>
            </section>

            {/* TOOLS EXPLORER */}
            <section className="py-5 bg-light">
                <Container>
                    <Row className="g-4">
                        {/* FILTER SIDEBAR (Desktop) */}
                        <Col lg={3}>
                            <div className="filter-sidebar sticky-top" style={{ top: '100px' }}>
                                <div className="d-flex align-items-center mb-4">
                                    <Filter size={20} className="text-primary me-2" />
                                    <h5 className="fw-bold mb-0 text-dark">Categories</h5>
                                </div>
                                <div className="category-list d-flex flex-column gap-1">
                                    <button 
                                        className={`category-filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                                        onClick={() => handleCategoryClick('all')}
                                    >
                                        All Tools <span className="ms-auto badge rounded-pill bg-primary">{allTools.length}</span>
                                    </button>
                                    {categories.map(cat => {
                                        const Icon = cat.icon;
                                        return (
                                            <button 
                                                key={cat.id}
                                                className={`category-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                                                onClick={() => handleCategoryClick(cat.id)}
                                            >
                                                <span className={cat.color + ' me-2'}><Icon size={18} /></span>
                                                {cat.name}
                                                <span className="ms-auto badge rounded-pill bg-light text-dark border">{cat.count}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </Col>

                        {/* TOOLS GRID */}
                        <Col lg={9}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h6 className="text-muted mb-0">Found <strong>{filteredTools.length}</strong> tools</h6>
                            </div>

                            <Row className="g-4">
                                {displayedTools.length > 0 ? (
                                    displayedTools.map((tool) => (
                                        <Col md={6} xl={4} key={tool.id}>
                                            <Link to={`/tools/${tool.slug}`} className="text-decoration-none h-100 d-block">
                                                <div className="tool-card-premium glass-card p-4 rounded-4 h-100 d-flex flex-column hover-glow transition-all bg-white">
                                                    <div className="d-flex justify-content-between mb-4">
                                                        <div className="tool-icon-sm p-2 bg-primary bg-opacity-10 rounded-3 text-primary">
                                                            <Zap size={20} />
                                                        </div>
                                                        {tool.isPremium && <Badge bg="warning" className="rounded-pill"><Star size={10} /> PRO</Badge>}
                                                    </div>
                                                    <h5 className="fw-bold text-dark mb-2">{tool.name}</h5>
                                                    <p className="text-muted small mb-4 flex-grow-1">{tool.desc}</p>
                                                    <div className="mt-auto pt-3 border-top border-secondary border-opacity-10 d-flex align-items-center justify-content-between">
                                                        <span className="small text-uppercase tracking-wider fw-bold text-muted" style={{ fontSize: '0.65rem' }}>{tool.category}</span>
                                                        <FaArrowRight className="text-primary tool-arrow-icon" />
                                                    </div>
                                                </div>
                                            </Link>
                                        </Col>
                                    ))
                                ) : (
                                    <Col xs={12}>
                                        <div className="text-center py-5 glass-card rounded-4 bg-white">
                                            <h3 className="fw-bold text-dark">No results found</h3>
                                            <p className="text-muted">Try adjusting your filters or search query.</p>
                                            <Button variant="primary" onClick={clearFilters}>Clear All Filters</Button>
                                        </div>
                                    </Col>
                                )}
                            </Row>

                            {/* LOAD MORE */}
                            {filteredTools.length > visibleCount && (
                                <div className="text-center mt-5">
                                    <button 
                                        className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-lg"
                                        onClick={handleLoadMore}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <><FaSyncAlt className="fa-spin me-2" /> Loading...</> : 'Load More Tools'}
                                    </button>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default Tools;