import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaChevronRight, FaSearch, FaArrowRight, FaSyncAlt, FaPaperPlane, FaEnvelope, FaCheckCircle } from 'react-icons/fa';

import "./Category.css";
import SEO from '../../components/SEO';
import { categories as toolsCategories } from '../../data/toolsData';

const Category = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCount, setVisibleCount] = useState(6);

    const mainCategories = useMemo(() => {
        return toolsCategories.map(cat => ({
            id: cat.id,
            title: cat.name,
            icon: React.createElement(cat.icon, { size: 24 }),
            count: cat.count,
            desc: `Professional suite of ${cat.name.toLowerCase()} for all your needs.`,
            url: `/category/${cat.id}`
        }));
    }, []);

    // Search Logic
    const filteredCategories = mainCategories.filter(cat =>
        cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Slice the array based on visibleCount
    const displayedCategories = filteredCategories.slice(0, visibleCount);

    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail('');
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    return (
        <>
        <SEO
            title="All Tool Categories | WebzenTools"
            description="Browse through our comprehensive list of tool categories including Developer, AI, Image, SEO, and Finance tools."
            keywords="tool categories, developer tools, ai tools, seo tools, finance tools"
            url="https://www.webzentools.com/category"
        />
            <section className="wt-all-categories-hero position-relative d-flex align-items-center">

                {/* --- Premium Background Layers --- */}
                <div className="wt-grid-overlay"></div>
                <div className="wt-glow wt-glow-left"></div>
                <div className="wt-glow wt-glow-right"></div>

                <Container className="position-relative z-3 text-center wt-content-wrapper py-5">

                    {/* --- The Premium Cyan Breadcrumb Pill --- */}
                    <div className="wt-fade-in-1 mb-4">
                        <nav aria-label="breadcrumb">
                            <div className="wt-breadcrumb-pill d-inline-flex align-items-center shadow-lg">

                                <FaHome size={15} className="wt-cyan-accent me-2" />

                                <Link to="/" className="wt-breadcrumb-link text-decoration-none fw-medium">
                                    Home
                                </Link>

                                <FaChevronRight size={12} className="wt-breadcrumb-separator mx-2" />

                                {/* Active Category (Directly after Home) */}
                                <span className="wt-cyan-accent fw-bold d-flex align-items-center" aria-current="page">
                                    {/* The Signature Pulsing Dot */}
                                    <span className="wt-active-dot me-2"></span>
                                    All Categories
                                </span>

                            </div>
                        </nav>
                    </div>

                    {/* --- Main Headline --- */}
                    <h1 className="display-3 fw-bolder text-white mb-4 wt-tracking-tight wt-fade-in-2">
                        Usefull <span className="wt-text-gradient-cyan-blue">Categories</span>
                    </h1>

                    {/* --- Short Description Line --- */}
                    <p className="lead text-white mx-auto wt-fade-in-3" style={{ maxWidth: '650px', lineHeight: '1.8' }}>
                        Explore our complete ecosystem of free, high-performance utilities designed to automate workflows for developers, creators, and teams.
                    </p>

                </Container>
            </section>

            {/* ====================All CATEGORY SECTION ================== */}
            <section className="wt-category-grid-section py-5 position-relative">
                <div className="wt-grid-bg-pattern"></div>

                <Container className="position-relative z-3">

                    {/* --- Header & Search Bar --- */}
                    <div className="wt-command-center p-3 p-md-4 mb-5 wt-fade-in-up">
                        <Row className="align-items-center justify-content-between">
                            <Col lg={6}>
                                <h2 className="fw-bold text-dark mb-1">Explore <span className="wt-text-gradient-cyan-blue">Ecosystem</span></h2>
                                <p className="text-muted mb-0">Discover our 10 specialized tool suites.</p>
                            </Col>
                            <Col lg={4} className="mt-3 mt-lg-0">
                                <div className="position-relative">
                                    <FaSearch className="wt-grid-search-icon position-absolute" size={14} />
                                    <Form.Control
                                        type="text"
                                        placeholder="Find a category..."
                                        className="wt-grid-search-input"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setVisibleCount(6); // Reset count when searching
                                        }}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {/* --- The Category Card Grid --- */}
                    <Row className="g-4">
                        {displayedCategories.map((cat, index) => (
                            <Col lg={4} md={6} key={cat.id} className="wt-stagger-card" style={{ animationDelay: `${0.05 * (index % 6)}s` }}>

                                <Link to={cat.url} className="wt-tool-card d-block text-decoration-none h-100 p-4 position-relative overflow-hidden">

                                    <div className="wt-card-glow-line"></div>

                                    <div className="d-flex justify-content-between align-items-start mb-4">
                                        <div className="wt-tool-icon-box d-inline-flex align-items-center justify-content-center">
                                            {cat.icon}
                                        </div>
                                        <span className="badge rounded-pill bg-light text-primary border px-3 py-2 fw-bold" style={{ fontSize: '0.7rem' }}>
                                            {cat.count} TOOLS
                                        </span>
                                    </div>

                                    <h3 className="h5 fw-bold mb-2 text-dark">{cat.title}</h3>
                                    <p className="text-muted mb-4" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                                        {cat.desc}
                                    </p>

                                    <div className="mt-auto d-flex align-items-center">
                                        <div className="wt-launch-btn">
                                            Explore Suite <FaArrowRight size={12} className="ms-2 wt-launch-arrow" />
                                        </div>
                                    </div>

                                </Link>
                            </Col>
                        ))}
                    </Row>

                    {/* --- LOAD MORE BUTTON --- */}
                    {filteredCategories.length > visibleCount && (
                        <div className="text-center mt-5 wt-fade-in-up">
                            <button
                                className="wt-load-more-btn"
                                onClick={() => setVisibleCount(filteredCategories.length)}
                            >
                                <FaSyncAlt className="me-2 wt-spin-on-hover" />
                                Load All {filteredCategories.length} Categories
                            </button>
                        </div>
                    )}

                </Container>
            </section>

            {/* =====================Explore Other Categories =============== */}
            <section className="wt-explore-section py-5">
                <Container>

                    {/* Section Header */}
                    <div className="d-flex justify-content-between align-items-end mb-4 wt-fade-in">
                        <div>
                            <h2 className="fw-bold text-dark mb-1">
                                Explore More <span className="wt-text-gradient">Categories</span>
                            </h2>
                            <p className="text-muted mb-0">Discover more free utilities to supercharge your workflow.</p>
                        </div>

                        {/* Desktop 'View All' Link */}
                        <Link to="/category" className="wt-view-all-link d-none d-md-flex align-items-center">
                            View All Ecosystem <FaArrowRight size={12} className="ms-2 wt-arrow-hover" />
                        </Link>
                    </div>

                    {/* Category Cards */}
                    <Row className="g-4">
                        {toolsCategories.slice(0, 3).map((cat, index) => {
                            const Icon = cat.icon;
                            return (
                                <Col lg={4} md={6} key={cat.id} className="wt-stagger-up" style={{ animationDelay: `${0.1 * index}s` }}>
                                    <Link to={`/category/${cat.id}`} className="wt-explore-card text-decoration-none d-flex align-items-center p-4 h-100">
                                        <div className="wt-explore-icon-box me-4">
                                            <Icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className="h6 fw-bold mb-1 text-dark">{cat.name}</h4>
                                            <p className="small text-muted mb-0" style={{ lineHeight: '1.5' }}>Professional {cat.name} suite.</p>
                                        </div>
                                    </Link>
                                </Col>
                            );
                        })}
                    </Row>

                    {/* Mobile 'View All' Link (Only shows on small screens) */}
                    <div className="text-center mt-4 d-block d-md-none">
                        <Link to="/category" className="wt-view-all-link d-inline-flex align-items-center">
                            View All Ecosystem <FaArrowRight size={12} className="ms-2 wt-arrow-hover" />
                        </Link>
                    </div>

                </Container>
            </section>
            {/* ===================NEWSLETTER SECTION ================= */}
            <section className="wt-cat-newsletter-section py-5 position-relative">

                {/* Background Ambient Glows */}
                <div className="wt-cat-news-glow wt-cat-news-glow-left"></div>
                <div className="wt-cat-news-glow wt-cat-news-glow-right"></div>

                <Container className="position-relative z-3 py-4 py-lg-5">
                    <Row className="justify-content-center">
                        <Col lg={8} md={10}>

                            {/* The Premium Floating Card */}
                            <div className="wt-cat-newsletter-card text-center p-4 p-md-5 wt-cat-fade-in-up">

                                {/* Floating Icon Badge */}
                                <div className="wt-cat-news-icon-badge mx-auto mb-4">
                                    <FaPaperPlane size={24} className="wt-cat-paper-plane" />
                                </div>

                                <h2 className="display-6 fw-bold text-white mb-3">
                                    Never miss an <span className="wt-cat-text-gradient-cyan-blue">update.</span>
                                </h2>

                                <p className="text-white mb-5 mx-auto" style={{ maxWidth: '500px', fontSize: '1.05rem', lineHeight: '1.6' }}>
                                    Join 10,000+ developers and creators. Get early access to new tools, premium features, and performance tips directly in your inbox.
                                </p>

                                {/* The Input Form */}
                                <Form onSubmit={handleSubmit} className="mx-auto position-relative" style={{ maxWidth: '480px' }}>

                                    <div className="wt-cat-premium-input-group">
                                        <FaEnvelope className="wt-cat-input-icon position-absolute" size={16} />

                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email address..."
                                            className="wt-cat-news-input"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />

                                        <button type="submit" className={`wt-cat-news-submit-btn ${isSubscribed ? 'success' : ''}`}>
                                            {isSubscribed ? (
                                                <><FaCheckCircle className="me-2" /> Subscribed</>
                                            ) : (
                                                'Subscribe'
                                            )}
                                        </button>
                                    </div>

                                    <div className="mt-3 text-muted small d-flex align-items-center justify-content-center gap-2">
                                        <FaCheckCircle className="text-success opacity-75" size={12} />
                                        <span className='text-white'>No spam, ever. Unsubscribe at any time.</span>
                                    </div>

                                </Form>

                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default Category;