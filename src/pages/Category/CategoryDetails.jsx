import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaChevronRight, FaTerminal } from 'react-icons/fa';
import {
    FaSearch, FaSlidersH, FaCode, FaLock, FaKey,
    FaDatabase, FaExchangeAlt, FaClock, FaCompressArrowsAlt,
    FaSearchPlus, FaFileCode, FaArrowRight, FaImage
} from 'react-icons/fa';
import { FaShieldAlt, FaServer, FaCodeBranch } from 'react-icons/fa';

import "./Category.css";
import SEO from '../../components/SEO';

const CategoryDetails = () => {

    // --- 1. State Management ---
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    // --- 2. Data: The 12 Developer Tools ---
    const filters = ['All', 'Formatters', 'Encoders', 'Security', 'Utilities'];

    const developerTools = [
        { id: 1, title: 'JSON Formatter', desc: 'Beautify, minify and validate JSON data structures.', icon: <FaCode size={20} />, category: 'Formatters', url: '/tools/json' },
        { id: 2, title: 'Base64 Converter', desc: 'Securely encode and decode strings to Base64 format.', icon: <FaLock size={20} />, category: 'Encoders', url: '/tools/base64' },
        { id: 3, title: 'JWT Decoder', desc: 'Inspect header and payload data for JSON Web Tokens.', icon: <FaKey size={20} />, category: 'Security', url: '/tools/jwt' },
        { id: 4, title: 'SQL Beautifier', desc: 'Format messy SQL queries for better readability.', icon: <FaDatabase size={20} />, category: 'Formatters', url: '/tools/sql' },
        { id: 5, title: 'YAML <=> JSON', desc: 'Convert data between YAML and JSON formats instantly.', icon: <FaExchangeAlt size={20} />, category: 'Formatters', url: '/tools/yaml' },
        { id: 6, title: 'Cron Expression', desc: 'Translate complex Cron jobs into human-readable text.', icon: <FaClock size={20} />, category: 'Utilities', url: '/tools/cron' },
        { id: 7, title: 'HTML Minifier', desc: 'Compress HTML, CSS, and JS files for performance.', icon: <FaCompressArrowsAlt size={20} />, category: 'Utilities', url: '/tools/minify' },
        { id: 8, title: 'Regex Tester', desc: 'Build and test regular expressions with live highlighting.', icon: <FaSearchPlus size={20} />, category: 'Utilities', url: '/tools/regex' },
        { id: 9, title: 'XML Formatter', desc: 'Clean up and structure messy XML data automatically.', icon: <FaFileCode size={20} />, category: 'Formatters', url: '/tools/xml' },
        { id: 10, title: 'Hash Generator', desc: 'Generate MD5, SHA-1, and SHA-256 cryptographic hashes.', icon: <FaTerminal size={20} />, category: 'Security', url: '/tools/hash' },
        { id: 11, title: 'URL Encoder', desc: 'Safely encode or decode URL strings and parameters.', icon: <FaExchangeAlt size={20} />, category: 'Encoders', url: '/tools/url' },
        { id: 12, title: 'Image to Base64', desc: 'Convert image files directly into Base64 data URIs.', icon: <FaImage size={20} />, category: 'Encoders', url: '/tools/image-base64' },
    ];

    // --- 3. Filtering Logic ---
    const filteredTools = developerTools.filter(tool => {
        // Check if search matches title OR description
        const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
        // Check if category matches active filter (or if 'All' is selected)
        const matchesFilter = activeFilter === 'All' || tool.category === activeFilter;

        return matchesSearch && matchesFilter;
    });

    return (
        <>
         <SEO
            title={`Our Services | `}
            description={`Explore  services by Webzenyx including modern, scalable, and high-performance solutions.`}
            keywords="web development services, mobile app development, UI UX design, ecommerce solutions"
            url={`https://www.webzenyx.com/contact`}
        />
            <section className="wt-hero-section position-relative">

                {/* Background Enhancements */}
                <div className="wt-hero-grid-pattern"></div>
                <div className="wt-hero-glow-blob"></div>

                <Container className="position-relative z-3 pt-5 pb-5">
                    <Row className="justify-content-center text-center">
                        <Col lg={8} className="d-flex flex-column align-items-center">

                            {/* --- The Premium Glass Breadcrumb --- */}
                            <div className="wt-breadcrumb-pill mb-4 wt-animate-fade-down">
                                <Link to="/" className="wt-crumb-link d-flex align-items-center">
                                    <FaHome className="me-2 mb-1" size={14} /> Home
                                </Link>

                                <FaChevronRight size={10} className="wt-crumb-separator mx-3" />

                                <Link to="/categories" className="wt-crumb-link">
                                    Categories
                                </Link>

                                <FaChevronRight size={10} className="wt-crumb-separator mx-3" />

                                <span className="wt-crumb-current fw-bold d-flex align-items-center">
                                    <FaTerminal className="me-2 text-primary" size={12} /> Developer Tools
                                </span>
                            </div>

                            {/* --- Title & Description --- */}
                            <div className="wt-animate-fade-up">
                                <h1 className="display-4 fw-black text-dark mb-3" style={{ letterSpacing: '-1.5px' }}>
                                    Developer <span className="wt-text-gradient-cyan-blue">Suite</span>
                                </h1>

                                <p className="lead text-muted mb-0 mx-auto" style={{ maxWidth: '600px', fontSize: '1.1rem', lineHeight: '1.7' }}>
                                    A premium collection of 12 essential formatters, encoders, and validators designed to streamline your engineering workflow.
                                </p>
                            </div>

                        </Col>
                    </Row>
                </Container>
            </section>

            {/* ====================filter section =================== */}

            <section className="wt-inventory-section bg-light py-5">
                <Container>

                    {/* =========================================
            THE COMMAND CENTER (Overlaps top boundary)
            ========================================= */}
                    <div className="wt-command-card p-3 p-md-4 mb-5">
                        <Row className="align-items-center gy-3">

                            {/* Filters */}
                            <Col lg={7} md={12} className="d-flex align-items-center">
                                <div className="d-none d-md-flex align-items-center me-3 text-muted">
                                    <FaSlidersH size={16} />
                                </div>
                                <div className="d-flex flex-wrap gap-2 w-100">
                                    {filters.map((filter) => (
                                        <button
                                            key={filter}
                                            onClick={() => setActiveFilter(filter)}
                                            className={`wt-premium-pill ${activeFilter === filter ? 'active' : ''}`}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                            </Col>

                            {/* Search */}
                            <Col lg={5} md={12}>
                                <div className="wt-neon-search-wrapper position-relative">
                                    <FaSearch className="wt-neon-search-icon position-absolute" size={16} />
                                    <Form.Control
                                        type="text"
                                        placeholder="Search tools..."
                                        className="wt-neon-search-input"
                                        spellCheck="false"
                                    />
                                    <div className="wt-neon-search-shortcut d-none d-lg-flex position-absolute align-items-center justify-content-center">
                                        ⌘K
                                    </div>
                                </div>
                            </Col>

                        </Row>
                    </div>

                    {/* =========================================
            THE TOOL GRID
            ========================================= */}
                    <Row className="g-4 pb-5">
                        {filteredTools.length > 0 ? (
                            filteredTools.map((tool, index) => (
                                <Col lg={4} md={6} key={tool.id} style={{ animationDelay: `${index * 0.05}s` }} className="wt-stagger-card">
                                    <Link to={tool.url} className="wt-tool-card text-decoration-none d-flex flex-column h-100 p-4 bg-white position-relative overflow-hidden">

                                        {/* Top: Icon and Tag */}
                                        <div className="d-flex justify-content-between align-items-start mb-4 position-relative z-2">
                                            <div className="wt-icon-box d-flex align-items-center justify-content-center">
                                                {tool.icon}
                                            </div>
                                            <span className="wt-card-tag">
                                                {tool.category}
                                            </span>
                                        </div>

                                        {/* Body: Title and Desc */}
                                        <div className="position-relative z-2 flex-grow-1">
                                            <h3 className="h5 fw-bold text-dark mb-2">{tool.title}</h3>
                                            <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>{tool.desc}</p>
                                        </div>

                                        {/* Footer: Action Button */}
                                        <div className="mt-3 wt-launch-text fw-bold d-flex align-items-center position-relative z-2">
                                            Launch Tool <FaArrowRight size={12} className="ms-2 wt-arrow" />
                                        </div>

                                        {/* Hover Glow Effect */}
                                        <div className="wt-card-glow"></div>
                                    </Link>
                                </Col>
                            ))
                        ) : (
                            /* Empty State for Search */
                            <Col xs={12} className="text-center py-5">
                                <div className="py-5">
                                    <FaSearch size={40} className="text-muted opacity-50 mb-3" />
                                    <h4 className="text-dark fw-bold">No tools found</h4>
                                    <p className="text-muted mb-4">We couldn't find anything matching "{searchQuery}" in {activeFilter}.</p>
                                    <button
                                        className="wt-premium-pill active mx-auto"
                                        onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </Col>
                        )}
                    </Row>

                </Container>
            </section>

            {/* ====================PRIVACY SECTION =================== */}
            <section className="wt-privacy-section">
                {/* Ambient background glow for a premium feel */}
                <div className="wt-privacy-ambient-glow"></div>

                <div className="wt-privacy-container">

                    {/* Header Area */}
                    <div className="wt-privacy-header text-center">
                        <div className="wt-privacy-badge">
                            <span className="wt-pulse-dot"></span>
                            Zero-Trust Architecture
                        </div>
                        <h2 className="wt-privacy-title">
                            Your data stays <span className="wt-text-gradient-cyan">yours.</span>
                        </h2>
                        <p className="wt-privacy-subtitle">
                            We built this suite for developers who care about security.
                            Your code, keys, and tokens never leave your machine.
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="wt-privacy-grid">

                        {/* Card 1: Client-Side */}
                        <div className="wt-privacy-card">
                            <div className="wt-privacy-icon-box">
                                <FaShieldAlt size={24} />
                            </div>
                            <h3 className="wt-privacy-card-title">100% Client-Side</h3>
                            <p className="wt-privacy-card-text">
                                All formatting, encoding, and validation happens locally within your browser's memory.
                            </p>
                        </div>

                        {/* Card 2: No Server Storage */}
                        <div className="wt-privacy-card">
                            <div className="wt-privacy-icon-box">
                                <FaServer size={24} />
                                {/* Decorative slash to indicate "No Server" */}
                                <div className="wt-icon-slash"></div>
                            </div>
                            <h3 className="wt-privacy-card-title">No Server Storage</h3>
                            <p className="wt-privacy-card-text">
                                We do not use databases to store your inputs. Zero logs, zero tracking, zero risk.
                            </p>
                        </div>

                        {/* Card 3: Open Source */}
                        <div className="wt-privacy-card">
                            <div className="wt-privacy-icon-box">
                                <FaCodeBranch size={24} />
                            </div>
                            <h3 className="wt-privacy-card-title">Open Source</h3>
                            <p className="wt-privacy-card-text">
                                Don't just take our word for it. Our processing logic is open for community auditing.
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
};

export default CategoryDetails;