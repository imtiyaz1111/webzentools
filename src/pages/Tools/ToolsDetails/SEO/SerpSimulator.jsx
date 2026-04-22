import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Row, Col, Form, Button, Alert, Badge } from 'react-bootstrap';
import { FaDesktop, FaMobileAlt, FaSearch, FaInfoCircle, FaSyncAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import './SerpSimulator.css';

const SerpSimulator = () => {
    const [viewMode, setViewMode] = useState('desktop');
    const [title, setTitle] = useState('Example Page Title - Best SEO Tools for Webmasters');
    const [description, setDescription] = useState('This is an example of a meta description. It should be around 150-160 characters to avoid being truncated in search results. Make it catchy!');
    const [url, setUrl] = useState('https://example.com/blog/seo-best-practices');
    const [fetchUrl, setFetchUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // SEO Limits
    const TITLE_LIMIT = 60;
    const DESC_LIMIT = 160;

    const getStatus = (current, limit) => {
        if (current === 0) return 'neutral';
        if (current <= limit) return 'good';
        if (current <= limit + 20) return 'warning';
        return 'error';
    };

    const handleFetch = async () => {
        if (!fetchUrl) return;
        setLoading(true);
        setError('');
        try {
            const target = fetchUrl.startsWith('http') ? fetchUrl : `https://${fetchUrl}`;
            const response = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(target)}`);
            const data = response.data;
            
            if (!data.contents) throw new Error('Could not fetch page data.');


            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, 'text/html');
            
            setTitle(doc.querySelector('title')?.innerText || '');
            setDescription(doc.querySelector('meta[name="description"]')?.getAttribute('content') || '');
            setUrl(target);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch metadata. Please check the URL.');
            setLoading(false);
        }
    };

    const renderProgressBar = (current, limit) => {
        const status = getStatus(current, limit);
        const percent = Math.min((current / limit) * 100, 100);
        return (
            <div className="mb-3">
                <div className="indicator-text mb-1">
                    <span className="text-muted small">{current} / {limit} characters</span>
                    {status === 'good' && <span className="text-success"><FaCheckCircle className="me-1" /> Optimized</span>}
                    {status === 'warning' && <span className="text-warning"><FaExclamationTriangle className="me-1" /> Too Long</span>}
                    {status === 'error' && <span className="text-danger"><FaExclamationTriangle className="me-1" /> Truncated</span>}
                </div>
                <div className="length-bar-wrapper">
                    <div className={`length-bar ${status}`} style={{ width: `${percent}%` }}></div>
                </div>
            </div>
        );
    };

    const formatTitle = (t) => {
        if (t.length > TITLE_LIMIT + 10) return t.substring(0, TITLE_LIMIT + 7) + '...';
        return t;
    };

    const formatSnippet = (s) => {
        if (s.length > DESC_LIMIT + 10) return s.substring(0, DESC_LIMIT + 7) + '...';
        return s;
    };

    return (
        <div className="serp-simulator">
            <Row className="gy-4">
                <Col lg={6}>
                    <div className="p-4 glass-card rounded-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">Editor</h5>
                            <div className="d-flex gap-2">
                                <Form.Control 
                                    size="sm" 
                                    placeholder="Fetch from URL..." 
                                    value={fetchUrl}
                                    onChange={(e) => setFetchUrl(e.target.value)}
                                    style={{ width: '180px' }}
                                />
                                <Button size="sm" variant="primary" onClick={handleFetch} disabled={loading}>
                                    {loading ? <FaSyncAlt className="fa-spin" /> : 'Fetch'}
                                </Button>
                            </div>
                        </div>

                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold">Page Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter page title..."
                                className="rounded-3"
                            />
                            {renderProgressBar(title.length, TITLE_LIMIT)}
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold">Meta Description</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter meta description..."
                                className="rounded-3"
                            />
                            {renderProgressBar(description.length, DESC_LIMIT)}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Page URL</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com/your-page"
                                className="rounded-3"
                            />
                        </Form.Group>

                        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
                    </div>
                </Col>

                <Col lg={6}>
                    <div className="p-4 glass-card rounded-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">Google Preview</h5>
                            <div className="view-toggle">
                                <button 
                                    className={`view-btn ${viewMode === 'desktop' ? 'active' : ''}`}
                                    onClick={() => setViewMode('desktop')}
                                >
                                    <FaDesktop className="me-2" /> Desktop
                                </button>
                                <button 
                                    className={`view-btn ${viewMode === 'mobile' ? 'active' : ''}`}
                                    onClick={() => setViewMode('mobile')}
                                >
                                    <FaMobileAlt className="me-2" /> Mobile
                                </button>
                            </div>
                        </div>

                        <div className="preview-container">
                            {viewMode === 'desktop' ? (
                                <div className="mockup-desktop animate-in">
                                    <div className="desktop-url">{url}</div>
                                    <div className="desktop-title">{formatTitle(title)}</div>
                                    <div className="desktop-snippet">{formatSnippet(description)}</div>
                                </div>
                            ) : (
                                <div className="mockup-mobile animate-in">
                                    <div className="mobile-header">
                                        <div className="mobile-favicon"></div>
                                        <div className="mobile-url">{new URL(url || 'https://example.com').hostname}</div>
                                    </div>
                                    <div className="mobile-title">{formatTitle(title)}</div>
                                    <div className="mobile-snippet">{formatSnippet(description)}</div>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 p-3 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-20">
                            <h6 className="fw-bold text-primary mb-2 small d-flex align-items-center">
                                <FaInfoCircle className="me-2" /> SEO Best Practices
                            </h6>
                            <ul className="small text-muted mb-0 ps-3">
                                <li>Keep titles under 60 characters to avoid truncation.</li>
                                <li>Meta descriptions should be between 120-160 characters.</li>
                                <li>Ensure each page has a unique title and description.</li>
                                <li>Include your primary keyword naturally in both tags.</li>
                            </ul>
                        </div>
                    </div>
                </Col>
            </Row>

            <div className="mt-5 pt-4 border-top">
                <h3 className="h5 fw-bold mb-3">About SERP Simulators</h3>
                <p className="text-muted small">
                    A SERP (Search Engine Results Page) Simulator allows you to preview how your website will appear in Google search results. This is crucial for optimizing your click-through rate (CTR). By crafting compelling titles and descriptions that fit within Google's display limits, you can attract more visitors to your site.
                </p>
                <Row className="gy-4 mt-2">
                    <Col md={6}>
                        <div className="d-flex align-items-start p-3 bg-light rounded-4 h-100">
                            <FaDesktop className="text-primary me-3 mt-1" />
                            <div>
                                <h6 className="fw-bold mb-1">Desktop Visibility</h6>
                                <p className="text-muted small mb-0">Desktop results have more horizontal space but stricter character limits in terms of pixel width.</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="d-flex align-items-start p-3 bg-light rounded-4 h-100">
                            <FaMobileAlt className="text-success me-3 mt-1" />
                            <div>
                                <h6 className="fw-bold mb-1">Mobile Optimization</h6>
                                <p className="text-muted small mb-0">Most users search on mobile. Our mobile preview helps you ensure your snippets look great on smaller screens.</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default SerpSimulator;
