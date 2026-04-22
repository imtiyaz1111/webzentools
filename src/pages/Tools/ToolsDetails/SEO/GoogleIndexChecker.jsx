import React, { useState } from 'react';
import axios from 'axios';

import { Row, Col, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import { FaGoogle, FaSearch, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaExternalLinkAlt, FaInfoCircle, FaSyncAlt } from 'react-icons/fa';
import './GoogleIndexChecker.css';

const GoogleIndexChecker = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const runDiagnostics = async () => {
        if (!url.trim()) {
            setError('Please provide a valid URL.');
            return;
        }

        setLoading(true);
        setError('');
        setResults(null);

        try {
            const targetUrl = url.startsWith('http') ? url : `https://${url}`;
            const response = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
            const data = response.data;
            
            if (!data.contents) throw new Error('Could not reach the website for diagnostic check.');


            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, 'text/html');
            
            // Perform Checks
            const checks = [];
            
            // 1. Meta Robots
            const robots = doc.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
            const isNoIndex = robots.toLowerCase().includes('noindex');
            checks.push({
                title: 'Meta Robots Tag',
                status: isNoIndex ? 'error' : 'success',
                message: isNoIndex ? 'Found "noindex" tag. This tells Google NOT to index this page.' : 'No "noindex" tag found. Page is crawlable.'
            });

            // 2. Canonical Tag
            const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
            checks.push({
                title: 'Canonical Tag',
                status: canonical ? 'success' : 'warning',
                message: canonical ? `Canonical points to: ${canonical}` : 'No canonical tag found. Google might pick its own version.'
            });

            // 3. Page Title
            const title = doc.querySelector('title')?.innerText || '';
            checks.push({
                title: 'Page Title',
                status: title ? 'success' : 'error',
                message: title ? 'Page has a title defined.' : 'Missing title tag. Google might not index properly.'
            });

            // 4. Meta Description
            const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
            checks.push({
                title: 'Meta Description',
                status: description ? 'success' : 'warning',
                message: description ? 'Description is defined.' : 'No description found. Google will auto-generate one.'
            });

            // Extract Data for Preview
            const previewData = {
                title: title || 'Page Title Missing',
                description: description || 'Please provide a meta description for your page to see how it appears in search results...',
                url: targetUrl
            };

            setResults({ checks, preview: previewData, targetUrl });
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Diagnostic failed. Please check the URL.');
            setLoading(false);
        }
    };

    const handleSearchCheck = (engine) => {
        if (!url) return;
        const cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
        let searchUrl = '';
        
        switch(engine) {
            case 'google': searchUrl = `https://www.google.com/search?q=site:${encodeURIComponent(cleanUrl)}`; break;
            case 'bing': searchUrl = `https://www.bing.com/search?q=site:${encodeURIComponent(cleanUrl)}`; break;
            case 'duck': searchUrl = `https://duckduckgo.com/?q=site:${encodeURIComponent(cleanUrl)}`; break;
            default: break;
        }
        window.open(searchUrl, '_blank');
    };

    return (
        <div className="google-index-checker">
            <div className="p-4 glass-card rounded-4 mb-4">
                <Row className="align-items-end gy-3">
                    <Col md={8}>
                        <Form.Group>
                            <Form.Label className="fw-bold"><FaSearch className="me-2 text-primary" /> Enter URL to Check Index Status</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="e.g. google.com/about" 
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && runDiagnostics()}
                                className="rounded-3"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Button className="w-100 btn-search btn-google" onClick={runDiagnostics} disabled={loading}>
                            {loading ? <><FaSyncAlt className="fa-spin me-2" /> Checking...</> : <><FaGoogle className="me-2" /> Run Diagnostics</>}
                        </Button>
                    </Col>
                </Row>
                {error && <Alert variant="danger" className="mt-3 rounded-3 small">{error}</Alert>}
            </div>

            {results && (
                <div className="animate-in">
                    <Row className="gy-4">
                        <Col lg={7}>
                            <h5 className="fw-bold mb-3"><FaInfoCircle className="me-2 text-primary" /> Indexing Diagnostics</h5>
                            <div className="diagnostic-list">
                                {results.checks.map((check, idx) => (
                                    <div key={idx} className="diagnostic-item">
                                        <div className={`status-icon ${check.status}`}>
                                            {check.status === 'success' ? <FaCheckCircle /> : check.status === 'error' ? <FaTimesCircle /> : <FaExclamationTriangle />}
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="fw-bold small">{check.title}</div>
                                            <div className="text-muted small">{check.message}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="action-section mt-4">
                                <h6 className="fw-bold mb-3">Manual Verification Links</h6>
                                <p className="small text-muted mb-3">Click below to verify the real-time indexing status directly on search engines:</p>
                                <Row className="g-2">
                                    <Col sm={4}>
                                        <Button className="w-100 btn-search btn-google" onClick={() => handleSearchCheck('google')}>
                                            <FaGoogle className="me-2" /> Google
                                        </Button>
                                    </Col>
                                    <Col sm={4}>
                                        <Button className="w-100 btn-search btn-bing" onClick={() => handleSearchCheck('bing')}>
                                            Bing
                                        </Button>
                                    </Col>
                                    <Col sm={4}>
                                        <Button className="w-100 btn-search btn-duck" onClick={() => handleSearchCheck('duck')}>
                                            DuckDuckGo
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        </Col>

                        <Col lg={5}>
                            <h5 className="fw-bold mb-3">Search Result Preview</h5>
                            <div className="serp-preview">
                                <div className="serp-url">{results.preview.url}</div>
                                <div className="serp-title">{results.preview.title}</div>
                                <div className="serp-description">{results.preview.description}</div>
                            </div>
                            
                            <Alert variant="info" className="mt-4 border-0 shadow-sm rounded-4">
                                <div className="d-flex align-items-start">
                                    <FaInfoCircle className="mt-1 me-3 flex-shrink-0" />
                                    <div className="small">
                                        <strong>Tip:</strong> If your page is new, it can take up to 4 weeks for Google to index it. Use Google Search Console to request a manual crawl.
                                    </div>
                                </div>
                            </Alert>
                        </Col>
                    </Row>
                </div>
            )}

            <div className="mt-5 pt-4 border-top">
                <h3 className="h5 fw-bold mb-3">Understanding Google Indexing</h3>
                <p className="text-muted small">
                    Indexing is the process by which search engines like Google discover your content and add it to their massive database (index). If a page isn't indexed, it won't appear in search results, no matter how good the content is.
                </p>
                <Row className="gy-4 mt-2">
                    <Col md={6}>
                        <div className="p-3 bg-light rounded-4 h-100 d-flex">
                            <FaExclamationTriangle className="text-warning me-3 mt-1 flex-shrink-0" />
                            <div>
                                <h6 className="fw-bold mb-1">Crawlability vs Indexability</h6>
                                <p className="text-muted small mb-0">Crawlability is about whether search bots can access your page. Indexability is about whether Google chooses to show it in search results.</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="p-3 bg-light rounded-4 h-100 d-flex">
                            <FaCheckCircle className="text-success me-3 mt-1 flex-shrink-0" />
                            <div>
                                <h6 className="fw-bold mb-1">Common Blockers</h6>
                                <p className="text-muted small mb-0">The most common reasons for not being indexed are <code>noindex</code> tags, <code>robots.txt</code> blocks, or poor quality content.</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default GoogleIndexChecker;
