import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';

import {
    FaCode, FaImage, FaShieldAlt, FaCalculator, FaFont,
    FaVideo, FaFileInvoice, FaChartBar, FaClock, FaTerminal,
    FaSearch, FaArrowRight, FaSyncAlt
} from 'react-icons/fa';

import { FaPaperPlane, FaEnvelope, FaCheckCircle } from 'react-icons/fa';


import "./Category.css";
import SEO from '../../components/SEO';

const Category = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCount, setVisibleCount] = useState(6); // Show 6 categories initially

    const mainCategories = [
        { id: 1, title: 'Developer Tools', icon: <FaCode />, count: 12, desc: 'JSON, Base64, and Code Formatters.', url: '/category/developers' },
        { id: 2, title: 'Image Suite', icon: <FaImage />, count: 8, desc: 'Compress, convert, and edit images.', url: '/category/creators' },
        { id: 3, title: 'Security & Privacy', icon: <FaShieldAlt />, count: 10, desc: 'Passwords, Hashing, and Encryption.', url: '/category/security' },
        { id: 4, title: 'Calculators', icon: <FaCalculator />, count: 15, desc: 'Unit, Math, and Finance converters.', url: '/category/calculators' },
        { id: 5, title: 'Text Utilities', icon: <FaFont />, count: 9, desc: 'Case conversion and text cleanup.', url: '/category/text-tools' },
        { id: 6, title: 'Video & Audio', icon: <FaVideo />, count: 5, desc: 'Trimmers and media converters.', url: '/category/video-audio' },
        { id: 7, title: 'PDF Tools', icon: <FaFileInvoice />, count: 7, desc: 'Merge, split, and compress PDFs.', url: '/category/pdf-tools' },
        { id: 8, title: 'Data Analytics', icon: <FaChartBar />, count: 6, desc: 'CSV, YAML, and JSON converters.', url: '/category/data-tools' },
        { id: 9, title: 'Date & Time', icon: <FaClock />, count: 6, desc: 'Timestamps and Cron expressions.', url: '/category/date-time' },
        { id: 10, title: 'System Admin', icon: <FaTerminal />, count: 4, desc: 'DNS, IP, and Network utilities.', url: '/category/system-admin' }
    ];

    // Search Logic
    const filteredCategories = mainCategories.filter(cat =>
        cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Slice the array based on visibleCount
    const displayedCategories = filteredCategories.slice(0, visibleCount);



    // Data for the related categories
    const categories = [
        {
            id: 1,
            name: 'Image Suite',
            desc: 'Compress, convert, and optimize images for the web.',
            icon: <FaImage size={24} />,
            url: '/category/image-suite'
        },
        {
            id: 2,
            name: 'Security & System',
            desc: 'Generate passwords, hashes, and check DNS records.',
            icon: <FaShieldAlt size={24} />,
            url: '/category/security'
        },
        {
            id: 3,
            name: 'Calculators',
            desc: 'Unit conversions, date math, and quick calculations.',
            icon: <FaCalculator size={24} />,
            url: '/category/calculators'
        }
    ];


    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            // Here you would normally send the email to your backend/API
            setIsSubscribed(true);
            setEmail('');

            // Reset success message after 3 seconds
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    return (
        <>
        <SEO
            title={`Our Services | `}
            description={`Explore  services by Webzenyx including modern, scalable, and high-performance solutions.`}
            keywords="web development services, mobile app development, UI UX design, ecommerce solutions"
            url={`https://www.webzenyx.com/contact`}
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
                        <Link to="/categories" className="wt-view-all-link d-none d-md-flex align-items-center">
                            View All Ecosystem <FaArrowRight size={12} className="ms-2 wt-arrow-hover" />
                        </Link>
                    </div>

                    {/* Category Cards */}
                    <Row className="g-4">
                        {categories.map((cat, index) => (
                            <Col lg={4} md={6} key={cat.id} className="wt-stagger-up" style={{ animationDelay: `${0.1 * index}s` }}>
                                <Link to={cat.url} className="wt-explore-card text-decoration-none d-flex align-items-center p-4 h-100">

                                    {/* Left Icon Box */}
                                    <div className="wt-explore-icon-box me-4">
                                        {cat.icon}
                                    </div>

                                    {/* Right Text */}
                                    <div>
                                        <h4 className="h6 fw-bold mb-1 text-dark">{cat.name}</h4>
                                        <p className="small text-muted mb-0" style={{ lineHeight: '1.5' }}>{cat.desc}</p>
                                    </div>

                                </Link>
                            </Col>
                        ))}
                    </Row>

                    {/* Mobile 'View All' Link (Only shows on small screens) */}
                    <div className="text-center mt-4 d-block d-md-none">
                        <Link to="/categories" className="wt-view-all-link d-inline-flex align-items-center">
                            View All Ecosystem <FaArrowRight size={12} className="ms-2 wt-arrow-hover" />
                        </Link>
                    </div>

                </Container>
            </section>
            {/* ===================NEWSLETTER SECTION ================= */}
            <section className="wt-newsletter-section py-5 position-relative">

                {/* Background Ambient Glows */}
                <div className="wt-news-glow wt-news-glow-left"></div>
                <div className="wt-news-glow wt-news-glow-right"></div>

                <Container className="position-relative z-3 py-4 py-lg-5">
                    <Row className="justify-content-center">
                        <Col lg={8} md={10}>

                            {/* The Premium Floating Card */}
                            <div className="wt-newsletter-card text-center p-4 p-md-5 wt-fade-in-up">

                                {/* Floating Icon Badge */}
                                <div className="wt-news-icon-badge mx-auto mb-4">
                                    <FaPaperPlane size={24} className="wt-paper-plane" />
                                </div>

                                <h2 className="display-6 fw-bold text-white mb-3">
                                    Never miss an <span className="wt-text-gradient-cyan-blue">update.</span>
                                </h2>

                                <p className="text-white mb-5 mx-auto" style={{ maxWidth: '500px', fontSize: '1.05rem', lineHeight: '1.6' }}>
                                    Join 10,000+ developers and creators. Get early access to new tools, premium features, and performance tips directly in your inbox.
                                </p>

                                {/* The Input Form */}
                                <Form onSubmit={handleSubmit} className="mx-auto position-relative" style={{ maxWidth: '480px' }}>

                                    <div className="wt-premium-input-group">
                                        <FaEnvelope className="wt-input-icon position-absolute" size={16} />

                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email address..."
                                            className="wt-news-input"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />

                                        <button type="submit" className={`wt-news-submit-btn ${isSubscribed ? 'success' : ''}`}>
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