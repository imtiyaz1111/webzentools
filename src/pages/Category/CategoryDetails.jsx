import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { Home, ChevronRight, Search, Sliders, ArrowRight, ShieldCheck, Server, Code, LayoutGrid } from 'lucide-react';

import "./Category.css";
import SEO from '../../components/SEO';
import { categories, allTools } from '../../data/toolsData';
import { FaRegFileZipper } from 'react-icons/fa6';

const CategoryDetails = () => {
    const { id } = useParams();
    
    // --- 1. State Management ---
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    // --- 2. Dynamic Data Fetching ---
    const categoryInfo = useMemo(() => {
        const cat = categories.find(cat => cat.id === id);
        if (cat) return { ...cat, IconComponent: cat.icon };
        return { name: 'Tools', IconComponent: LayoutGrid, color: 'text-primary' };
    }, [id]);

    const toolsInCategory = useMemo(() => {
        return allTools.filter(tool => tool.category === id);
    }, [id]);

    const Icon = categoryInfo.IconComponent;

    const filters = useMemo(() => {
        const uniqueSubCats = ['All', ...new Set(toolsInCategory.map(t => t.subCategory || 'General'))];
        return uniqueSubCats.filter(f => f !== 'General' || toolsInCategory.some(t => !t.subCategory));
    }, [toolsInCategory]);

    // --- 3. Filtering Logic ---
    const filteredTools = useMemo(() => {
        return toolsInCategory.filter(tool => {
            const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = activeFilter === 'All' || tool.subCategory === activeFilter || (activeFilter === 'General' && !tool.subCategory);
            return matchesSearch && matchesFilter;
        });
    }, [searchQuery, activeFilter, toolsInCategory]);

    return (
        <div className="category-details-wrapper">
            <SEO
                title={`${categoryInfo.name} | WebzenTools`}
                description={`Explore our collection of ${categoryInfo.name}. High-performance, secure, and free online utilities.`}
                keywords={`${categoryInfo.name}, online tools, free web tools`}
                url={`https://webzentools.com/category/${id}`}
            />

            {/* PREMIUM HERO SECTION (MATCHES ABOUT PAGE) */}
            <section className="wt-category-details-hero position-relative d-flex align-items-center">
                
                {/* --- Premium Background Layers --- */}
                <div className="wt-grid-overlay"></div>
                <div className="wt-glow wt-glow-left"></div>
                <div className="wt-glow wt-glow-right"></div>

                <Container className="position-relative z-3 text-center">
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            
                            {/* --- Breadcrumb Pill --- */}
                            <div className="wt-fade-in-1 mb-4">
                                <div className="wt-breadcrumb-pill d-inline-flex align-items-center shadow-lg">
                                    <Home size={15} className="wt-cyan-accent me-2" />
                                    <Link to="/" className="wt-breadcrumb-link text-decoration-none fw-medium">
                                        Home
                                    </Link>
                                    <ChevronRight size={14} className="wt-breadcrumb-separator mx-2" />
                                    <Link to="/tools" className="wt-breadcrumb-link text-decoration-none fw-medium">
                                        Tools
                                    </Link>
                                    <ChevronRight size={14} className="wt-breadcrumb-separator mx-2" />
                                    <span className="wt-cyan-accent fw-bold d-flex align-items-center">
                                        <span className="wt-active-dot me-2"></span>
                                        {categoryInfo.name}
                                    </span>
                                </div>
                            </div>

                            {/* --- Floating Category Icon --- */}
                            <div className="wt-hero-icon-wrapper mb-4 d-flex justify-content-center wt-fade-in-2">
                                <div className={`wt-category-icon-large bg-white shadow-xl rounded-4 p-4 d-flex align-items-center justify-content-center hover-glow`}>
                                    <Icon size={48} />
                                </div>
                            </div>

                            {/* --- Main Headline --- */}
                            <h1 className="display-4 fw-black text-white mb-3 wt-fade-in-2">
                                {categoryInfo.name.split(' ')[0]} <span className="wt-text-gradient-cyan-blue">{categoryInfo.name.split(' ').slice(1).join(' ')}</span>
                            </h1>

                            {/* --- Description --- */}
                            <p className="lead text-white-50 mx-auto mb-0 wt-fade-in-3" style={{ maxWidth: '650px', lineHeight: '1.8' }}>
                                Professional grade {categoryInfo.name.toLowerCase()} suite. 
                                Secure, fast, and entirely browser-based utilities for better productivity.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="wt-inventory-section bg-light py-5">
                <Container>
                    <div className="wt-command-card p-4 mb-5 glass-card rounded-4 shadow-sm bg-white">
                        <Row className="align-items-center gy-3">
                            <Col lg={7}>
                                <div className="d-flex flex-wrap gap-2">
                                    <Sliders className="text-muted d-none d-md-block me-2 align-self-center" size={18} />
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
                            <Col lg={5}>
                                <div className="wt-neon-search-wrapper position-relative">
                                    <Search className="wt-neon-search-icon position-absolute" size={14} />
                                    <Form.Control
                                        type="text"
                                        placeholder={`Search in ${categoryInfo.name}...`}
                                        className="wt-neon-search-input ps-5 py-2 rounded-pill border-0 shadow-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <Row className="g-4">
                        {filteredTools.length > 0 ? (
                            filteredTools.map((tool) => (
                                <Col lg={4} md={6} key={tool.id}>
                                    <Link to={`/tools/${tool.slug}`} className="wt-tool-card text-decoration-none d-flex flex-column h-100 p-4 bg-white rounded-4 shadow-sm hover-glow transition-all border-0">
                                        <div className="d-flex justify-content-between align-items-start mb-4">
                                            <div className="wt-icon-box p-3 bg-primary bg-opacity-10 rounded-3 text-primary d-flex align-items-center justify-content-center">
                                                <FaRegFileZipper size={20} />
                                            </div>
                                            <span className="wt-card-tag small fw-bold text-uppercase text-muted opacity-75">
                                                {tool.isPremium ? '★ Premium' : 'Free'}
                                            </span>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h3 className="h5 fw-bold text-dark mb-2">{tool.name}</h3>
                                            <p className="text-muted small mb-0">{tool.desc}</p>
                                        </div>
                                        <div className="mt-4 pt-3 border-top border-secondary border-opacity-10 wt-launch-text fw-bold d-flex align-items-center text-primary small">
                                            Launch Tool <ArrowRight size={10} className="ms-2" />
                                        </div>
                                    </Link>
                                </Col>
                            ))
                        ) : (
                            <Col xs={12} className="text-center py-5">
                                <div className="glass-card p-5 rounded-4 bg-white mx-auto" style={{ maxWidth: '400px' }}>
                                    <Search size={40} className="text-muted opacity-25 mb-3" />
                                    <h4 className="fw-bold">No matches found</h4>
                                    <p className="text-muted">Try adjusting your filters or search terms.</p>
                                    <Button variant="primary" className="rounded-pill px-4" onClick={() => {setSearchQuery(''); setActiveFilter('All');}}>Reset Filters</Button>
                                </div>
                            </Col>
                        )}
                    </Row>
                </Container>
            </section>

            {/* Privacy Section */}
            <section className="wt-privacy-section py-5 bg-dark text-white position-relative overflow-hidden">
                <div className="wt-privacy-ambient-glow"></div>
                <Container className="position-relative z-2 py-5">
                    <div className="text-center mb-5">
                        <div className="wt-privacy-badge mb-3 d-inline-block px-3 py-1 rounded-pill bg-primary bg-opacity-20 text-primary small fw-bold">
                            <span className="wt-pulse-dot"></span> Zero-Stored Architecture
                        </div>
                        <h2 className="display-6 fw-bold">Your data stays <span className="wt-text-gradient-cyan">on your device.</span></h2>
                        <p className="text-white-50 mx-auto" style={{ maxWidth: '600px' }}>
                            We use client-side logic to process your information. 
                            Nothing is uploaded to our servers, ensuring 100% data privacy.
                        </p>
                    </div>

                    <Row className="g-4">
                        <Col md={4}>
                            <div className="wt-privacy-card p-4 rounded-4 h-100 bg-white bg-opacity-5 border border-white border-opacity-10 text-center">
                                <ShieldCheck size={40} className="text-success mb-3" />
                                <h3 className="h5 fw-bold">Secure Local Processing</h3>
                                <p className="text-white-50 small mb-0">Algorithms run locally in your browser memory.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="wt-privacy-card p-4 rounded-4 h-100 bg-white bg-opacity-5 border border-white border-opacity-10 text-center">
                                <Server size={40} className="text-primary mb-3" />
                                <h3 className="h5 fw-bold">Zero Data Persistence</h3>
                                <p className="text-white-50 small mb-0">We don't use databases to store your inputs or files.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="wt-privacy-card p-4 rounded-4 h-100 bg-white bg-opacity-5 border border-white border-opacity-10 text-center">
                                <Code size={40} className="text-info mb-3" />
                                <h3 className="h5 fw-bold">Transparent Logic</h3>
                                <p className="text-white-50 small mb-0">Open and verifiable browser-based utility suite.</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default CategoryDetails;
