import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';
import {
    FaSearch, FaCode, FaDatabase, FaImage, FaSyncAlt,
    FaLock, FaKey, FaFont, FaArrowRight
} from 'react-icons/fa';
import { FaPaperPlane } from 'react-icons/fa';

import "./Tools.css";
import SEO from '../../components/SEO';

const Tools = () => {

    // --- 1. State Management ---
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    // Pagination States
    const [visibleCount, setVisibleCount] = useState(6); // Show 6 tools initially
    const [isLoading, setIsLoading] = useState(false);

    // --- 2. Master Tool Data (Expanded for testing) ---
    const categories = ['All', 'Developer', 'Creator', 'Security', 'Text'];
    const allTools = [
        { id: 1, title: 'JSON Formatter', desc: 'Beautify, minify and validate JSON data structures.', icon: <FaCode size={20} />, category: 'Developer', url: '/tools/json' },
        { id: 2, title: 'SQL Beautifier', desc: 'Format messy SQL queries for better readability.', icon: <FaDatabase size={20} />, category: 'Developer', url: '/tools/sql' },
        { id: 3, title: 'Image Compressor', desc: 'Reduce image file sizes without quality loss.', icon: <FaImage size={20} />, category: 'Creator', url: '/tools/image-compressor' },
        { id: 4, title: 'Password Generator', desc: 'Generate highly secure, randomized passwords.', icon: <FaLock size={20} />, category: 'Security', url: '/tools/password' },
        { id: 5, title: 'JWT Decoder', desc: 'Inspect header and payload data for JWTs.', icon: <FaKey size={20} />, category: 'Security', url: '/tools/jwt' },
        { id: 6, title: 'Word Counter', desc: 'Count words, characters, and reading time instantly.', icon: <FaFont size={20} />, category: 'Text', url: '/tools/word-counter' },
        { id: 7, title: 'Base64 Encoder', desc: 'Quickly encode or decode Base64 strings.', icon: <FaCode size={20} />, category: 'Developer', url: '/tools/base64' },
        { id: 8, title: 'Hash Generator', desc: 'Generate MD5, SHA-1, and SHA-256 hashes.', icon: <FaLock size={20} />, category: 'Security', url: '/tools/hash' },
        { id: 9, title: 'Case Converter', desc: 'Convert text to UPPER, lower, camelCase, etc.', icon: <FaFont size={20} />, category: 'Text', url: '/tools/case' },
    ];

    // --- 3. Filter & Pagination Logic ---

    // Reset visible count if user searches or changes category
    useEffect(() => {
        setVisibleCount(6);
    }, [searchQuery, activeCategory]);

    const filteredTools = allTools.filter(tool => {
        const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = activeCategory === 'All' || tool.category === activeCategory;
        return matchesSearch && matchesCat;
    });

    // Slice the array to only show the visible count
    const displayedTools = filteredTools.slice(0, visibleCount);

    // Fake network delay for premium feel
    const handleLoadMore = () => {
        setIsLoading(true);
        setTimeout(() => {
            setVisibleCount(prevCount => prevCount + 6); // Load 6 more
            setIsLoading(false);
        });
    };


    return (
        <>
        <SEO
            title={`Our Services | `}
            description={`Explore  services by Webzenyx including modern, scalable, and high-performance solutions.`}
            keywords="web development services, mobile app development, UI UX design, ecommerce solutions"
            url={`https://www.webzenyx.com/contact`}
        />
            <section className="wt-page-hero position-relative text-center">

                {/* Background Grid Pattern */}
                <div className="wt-hero-grid"></div>

                <Container className="position-relative z-3 pt-5 pb-5">

                    {/* The Glassmorphism Breadcrumb Pill */}
                    <div className="wt-glass-breadcrumb d-inline-flex align-items-center mb-4">
                        <Link to="/" className="wt-crumb-link d-flex align-items-center">
                            <FaHome className="me-2 mb-1" size={14} /> Home
                        </Link>

                        <FaChevronRight size={10} className="wt-crumb-separator mx-3" />

                        <span className="wt-crumb-current fw-bold d-flex align-items-center">
                            <span className="wt-active-dot me-2"></span>
                            Tools
                        </span>
                    </div>

                    {/* Hero Typography */}
                    <h1 className="display-4 fw-bold text-white mb-4">
                        All Usefull <span className="wt-text-blue">Tools</span>
                    </h1>

                    <p className="lead text-white-50 mx-auto" style={{ maxWidth: '750px', fontSize: '1.15rem', lineHeight: '1.8' }}>
                        Explore our complete collection of high-performance formatters, encoders, and utilities designed to streamline your engineering workflow.
                    </p>

                </Container>
            </section>

            {/* =======================ALL TOOLS SECTION ====================== */}

            <section className="wt-inventory-section py-5 bg-light">
                <Container>

                    {/* COMMAND CENTER (Filters & Search) */}
                    <div className="wt-command-card p-3 p-md-4 mb-5">
                        <Row className="align-items-center gy-4">
                            <Col lg={7} md={12}>
                                <div className="d-flex flex-wrap gap-2">
                                    {categories.map((cat) => (
                                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`wt-premium-pill ${activeCategory === cat ? 'active' : ''}`}>
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </Col>
                            <Col lg={5} md={12}>
                                <div className="wt-neon-search-wrapper position-relative">
                                    <FaSearch className="wt-neon-search-icon position-absolute" size={15} />
                                    <Form.Control type="text" placeholder="Search all tools..." className="wt-neon-search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} spellCheck="false" />
                                    <div className="wt-neon-search-shortcut d-none d-lg-flex position-absolute align-items-center justify-content-center">⌘K</div>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {/* TOOL CARDS GRID */}
                    <Row className="g-4 mb-5">
                        {displayedTools.length > 0 ? (
                            displayedTools.map((tool, index) => (
                                <Col lg={4} md={6} key={tool.id} style={{ animationDelay: `${(index % 6) * 0.05}s` }} className="wt-stagger-card">
                                    <Link to={tool.url} className="wt-tool-card text-decoration-none d-flex flex-column h-100 p-4 bg-white position-relative overflow-hidden">
                                        <div className="d-flex justify-content-between align-items-start mb-4 position-relative z-2">
                                            <div className="wt-icon-box d-flex align-items-center justify-content-center">{tool.icon}</div>
                                            <span className="wt-card-tag">{tool.category}</span>
                                        </div>
                                        <div className="position-relative z-2 flex-grow-1">
                                            <h3 className="h5 fw-bold text-dark mb-2">{tool.title}</h3>
                                            <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>{tool.desc}</p>
                                        </div>
                                        <div className="mt-3 wt-launch-text fw-bold d-flex align-items-center position-relative z-2">
                                            Launch Tool <FaArrowRight size={12} className="ms-2 wt-arrow" />
                                        </div>
                                    </Link>
                                </Col>
                            ))
                        ) : (
                            <Col xs={12} className="text-center py-5">
                                <FaSearch size={40} className="text-muted opacity-30 mb-3" />
                                <h4 className="text-dark fw-bold">No tools found</h4>
                                <p className="text-muted mb-4">We couldn't find any tool matching "{searchQuery}".</p>
                            </Col>
                        )}
                    </Row>

                    {/* =========================================
            LOAD MORE BUTTON SECTION
            ========================================= */}
                    {filteredTools.length > visibleCount && (
                        <div className="text-center mt-2">
                            <button
                                className="wt-load-more-btn"
                                onClick={handleLoadMore}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <FaSyncAlt className="wt-spin-icon me-2" /> Loading...
                                    </>
                                ) : (
                                    "Load More Tools"
                                )}
                            </button>
                        </div>
                    )}

                </Container>
            </section>

            {/* =======================CALL TO ACTION ========================= */}
            <section className="ui-subscribe-section py-5">
                <Container className="py-4">
                    <div className="ui-subscribe-card p-4 p-md-5 position-relative overflow-hidden">

                        {/* Abstract Background Shapes */}
                        <div className="ui-bg-blob-1"></div>
                        <div className="ui-bg-blob-2"></div>

                        <Row className="align-items-center position-relative z-3">

                            {/* Text Content */}
                            <Col lg={6} className="text-center text-lg-start mb-4 mb-lg-0">
                                <h2 className="h3 fw-bold text-dark mb-2">
                                    Get new tools delivered weekly.
                                </h2>
                                <p className="text-muted mb-0" style={{ fontSize: '1.05rem' }}>
                                    Join 5,000+ developers and creators. No spam, just high-performance utilities and platform updates.
                                </p>
                            </Col>

                            {/* Input Form */}
                            <Col lg={6}>
                                <Form className="ui-subscribe-form ms-lg-auto" onSubmit={(e) => e.preventDefault()}>
                                    <div className="position-relative d-flex align-items-center">
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email address..."
                                            className="ui-subscribe-input pe-5"
                                            required
                                        />
                                        <Button type="submit" className="ui-subscribe-btn d-flex align-items-center justify-content-center">
                                            <FaPaperPlane size={14} />
                                        </Button>
                                    </div>
                                    <div className="text-center text-lg-start mt-2">
                                        <small className="text-muted opacity-75">
                                            By subscribing, you agree to our Privacy Policy.
                                        </small>
                                    </div>
                                </Form>
                            </Col>

                        </Row>
                    </div>
                </Container>
            </section>
        </>
    );
};

export default Tools;