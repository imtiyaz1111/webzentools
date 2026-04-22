import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Row, Col, Form, Button, Tabs, Tab, Alert, ProgressBar } from 'react-bootstrap';
import { FaSearch, FaCheck, FaExclamationTriangle, FaTimes, FaGlobe, FaMobileAlt, FaImage, FaLink, FaInfoCircle, FaFileCode } from 'react-icons/fa';
import './SEOAnalyzer.css';

const SEOAnalyzer = () => {
    const [input, setInput] = useState('');
    const [analyzeMethod, setAnalyzeMethod] = useState('url');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const runAnalysis = async () => {
        if (!input.trim()) {
            setError('Please provide a URL or HTML content.');
            return;
        }

        setLoading(true);
        setError('');
        setResults(null);

        try {
            let htmlContent = '';
            if (analyzeMethod === 'url') {
                const url = input.startsWith('http') ? input : `https://${input}`;
                const response = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
                const data = response.data;
                if (!data.contents) throw new Error('Could not fetch website content.');
                htmlContent = data.contents;
            } else {

                htmlContent = input;
            }

            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            
            const analysis = performAudit(doc);
            setTimeout(() => {
                setResults(analysis);
                setLoading(false);
            }, 1000); // Simulate processing time
        } catch (err) {
            setError(err.message || 'Analysis failed. Please check the URL or HTML code.');
            setLoading(false);
        }
    };

    const performAudit = (doc) => {
        const checks = [];
        let score = 0;
        let totalWeight = 0;

        const addCheck = (category, title, status, message, weight = 10) => {
            checks.push({ category, title, status, message });
            totalWeight += weight;
            if (status === 'passed') score += weight;
            else if (status === 'warning') score += weight / 2;
        };

        // 1. Metadata Checks
        const title = doc.querySelector('title')?.innerText || '';
        if (!title) addCheck('Meta', 'Page Title', 'error', 'Missing page title tag.');
        else if (title.length < 30 || title.length > 60) addCheck('Meta', 'Page Title', 'warning', `Title length is ${title.length}. Ideal is 30-60 chars.`);
        else addCheck('Meta', 'Page Title', 'passed', 'Perfect title length.');

        const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        if (!description) addCheck('Meta', 'Meta Description', 'error', 'Missing meta description.');
        else if (description.length < 120 || description.length > 160) addCheck('Meta', 'Meta Description', 'warning', `Description is ${description.length} chars. Ideal is 120-160.`);
        else addCheck('Meta', 'Meta Description', 'passed', 'Meta description is well-optimized.');

        const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href');
        addCheck('Meta', 'Canonical Tag', canonical ? 'passed' : 'warning', canonical ? 'Canonical URL is set.' : 'Canonical tag missing.');

        // 2. Content Checks
        const h1 = doc.querySelectorAll('h1');
        if (h1.length === 0) addCheck('Content', 'H1 Heading', 'error', 'No H1 tag found.');
        else if (h1.length > 1) addCheck('Content', 'H1 Heading', 'warning', 'Multiple H1 tags found. Stick to one.');
        else addCheck('Content', 'H1 Heading', 'passed', 'Single H1 tag found.');

        const h2 = doc.querySelectorAll('h2').length;
        addCheck('Content', 'H2 Headings', h2 > 0 ? 'passed' : 'warning', `${h2} H2 tags found.`);

        const wordCount = doc.body.innerText.split(/\s+/).length;
        if (wordCount < 300) addCheck('Content', 'Word Count', 'warning', `Low content volume (${wordCount} words).`);
        else addCheck('Content', 'Word Count', 'passed', `Good content length (${wordCount} words).`);

        // 3. Images & Links
        const images = doc.querySelectorAll('img');
        const imagesWithoutAlt = Array.from(images).filter(img => !img.getAttribute('alt')).length;
        if (images.length === 0) addCheck('Media', 'Images', 'passed', 'No images on page.');
        else if (imagesWithoutAlt > 0) addCheck('Media', 'Image Alt Tags', 'error', `${imagesWithoutAlt} out of ${images.length} images missing alt tags.`);
        else addCheck('Media', 'Image Alt Tags', 'passed', 'All images have alt tags.');

        // 4. Technical
        const viewport = doc.querySelector('meta[name="viewport"]');
        addCheck('Technical', 'Mobile Viewport', viewport ? 'passed' : 'error', viewport ? 'Mobile responsive tag found.' : 'Mobile viewport tag missing.');

        const favicon = doc.querySelector('link[rel*="icon"]');
        addCheck('Technical', 'Favicon', favicon ? 'passed' : 'warning', favicon ? 'Favicon detected.' : 'No favicon found.');

        const finalScore = Math.round((score / totalWeight) * 100);

        return {
            score: finalScore,
            checks,
            stats: {
                title,
                description,
                h1Count: h1.length,
                h2Count: h2,
                imageCount: images.length,
                wordCount
            }
        };
    };

    const renderAuditItems = (category) => {
        if (!results) return null;
        return results.checks
            .filter(c => c.category === category)
            .map((check, idx) => (
                <div key={idx} className="check-item d-flex align-items-center">
                    <div className={`status-icon me-3 ${check.status}`}>
                        {check.status === 'passed' ? <FaCheck /> : check.status === 'warning' ? <FaExclamationTriangle /> : <FaTimes />}
                    </div>
                    <div>
                        <div className="fw-bold small">{check.title}</div>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>{check.message}</div>
                    </div>
                </div>
            ));
    };

    return (
        <div className="seo-analyzer">
            <div className="p-4 glass-card rounded-4 mb-5">
                <Tabs activeKey={analyzeMethod} onSelect={(k) => setAnalyzeMethod(k)} className="mb-4">
                    <Tab eventKey="url" title={<span><FaGlobe className="me-2" /> Analyze URL</span>}>
                        <div className="analysis-input-group d-flex">
                            <Form.Control 
                                type="text" 
                                className="analysis-input flex-grow-1"
                                placeholder="Enter website URL (e.g., google.com)"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && runAnalysis()}
                            />
                            <Button className="btn-analyze" onClick={runAnalysis} disabled={loading}>
                                {loading ? 'Analyzing...' : 'Analyze'}
                            </Button>
                        </div>
                        <Form.Text className="text-muted mt-2 d-block small">
                            <FaInfoCircle className="me-1" /> We use a CORS proxy to fetch external websites. Some sites may block this.
                        </Form.Text>
                    </Tab>
                    <Tab eventKey="html" title={<span><FaFileCode className="me-2" /> Analyze HTML</span>}>
                        <Form.Control 
                            as="textarea" 
                            rows={5}
                            className="rounded-3 p-3 mb-3"
                            placeholder="Paste your HTML source code here..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <Button className="btn-analyze w-100" onClick={runAnalysis} disabled={loading}>
                            {loading ? 'Processing HTML...' : 'Analyze Source Code'}
                        </Button>
                    </Tab>
                </Tabs>
                {error && <Alert variant="danger" className="mt-3 rounded-3">{error}</Alert>}
            </div>

            {results && (
                <div className="animate-slide-up">
                    <div className="score-hero d-flex align-items-center justify-content-between flex-wrap g-4">
                        <div className="score-content">
                            <h2 className="fw-bold mb-2">Overall SEO Score</h2>
                            <p className="opacity-75 mb-0">Your page is {results.score >= 80 ? 'performing great!' : results.score >= 50 ? 'performing okay but needs work.' : 'in need of major improvements.'}</p>
                        </div>
                        <div className="score-circle-wrapper">
                            <svg className="score-circle-svg" width="150" height="150">
                                <circle className="score-circle-bg" cx="75" cy="75" r="65" />
                                <circle 
                                    className="score-circle-progress" 
                                    cx="75" cy="75" r="65" 
                                    style={{ 
                                        strokeDasharray: '408', 
                                        strokeDashoffset: 408 - (408 * results.score) / 100 
                                    }} 
                                />
                            </svg>
                            <div className="score-number">{results.score}</div>
                        </div>
                    </div>

                    <Row className="gy-4">
                        <Col lg={4}>
                            <div className="p-4 glass-card rounded-4 h-100 audit-card">
                                <h5 className="fw-bold mb-4 d-flex align-items-center">
                                    <FaInfoCircle className="text-primary me-2" /> Meta Information
                                </h5>
                                {renderAuditItems('Meta')}
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="p-4 glass-card rounded-4 h-100 audit-card">
                                <h5 className="fw-bold mb-4 d-flex align-items-center">
                                    <FaFileCode className="text-indigo me-2" /> Content Audit
                                </h5>
                                {renderAuditItems('Content')}
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="p-4 glass-card rounded-4 h-100 audit-card">
                                <h5 className="fw-bold mb-4 d-flex align-items-center">
                                    <FaGlobe className="text-purple me-2" /> Technical & Media
                                </h5>
                                {renderAuditItems('Technical')}
                                {renderAuditItems('Media')}
                            </div>
                        </Col>
                    </Row>

                    <div className="mt-4 p-4 glass-card rounded-4">
                        <h5 className="fw-bold mb-4">Content Summary</h5>
                        <Row className="text-center gy-3">
                            <Col xs={6} md={3}>
                                <div className="p-3 bg-light rounded-3">
                                    <p className="text-muted small mb-1">H1 Headings</p>
                                    <h4 className="fw-bold mb-0">{results.stats.h1Count}</h4>
                                </div>
                            </Col>
                            <Col xs={6} md={3}>
                                <div className="p-3 bg-light rounded-3">
                                    <p className="text-muted small mb-1">H2 Headings</p>
                                    <h4 className="fw-bold mb-0">{results.stats.h2Count}</h4>
                                </div>
                            </Col>
                            <Col xs={6} md={3}>
                                <div className="p-3 bg-light rounded-3">
                                    <p className="text-muted small mb-1">Total Images</p>
                                    <h4 className="fw-bold mb-0">{results.stats.imageCount}</h4>
                                </div>
                            </Col>
                            <Col xs={6} md={3}>
                                <div className="p-3 bg-light rounded-3">
                                    <p className="text-muted small mb-1">Total Words</p>
                                    <h4 className="fw-bold mb-0">{results.stats.wordCount}</h4>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            )}

            <div className="mt-5 pt-4 border-top">
                <h3 className="h5 fw-bold mb-3">Why SEO Analysis Matters</h3>
                <p className="text-muted small">
                    Regular SEO audits are essential to maintain search engine visibility. Our tool checks the most critical on-page elements that influence how Google and other search engines crawl and rank your pages. 
                </p>
                <Row className="mt-4 g-4">
                    <Col md={6}>
                        <div className="d-flex align-items-start">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3 text-primary">
                                <FaMobileAlt />
                            </div>
                            <div>
                                <h6 className="fw-bold mb-1">Mobile Friendly</h6>
                                <p className="text-muted small mb-0">Google uses mobile-first indexing, making it vital that your site is fully responsive.</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="d-flex align-items-start">
                            <div className="bg-success bg-opacity-10 p-3 rounded-3 me-3 text-success">
                                <FaImage />
                            </div>
                            <div>
                                <h6 className="fw-bold mb-1">Image Optimization</h6>
                                <p className="text-muted small mb-0">Alt tags help search engines understand your visual content and improve accessibility.</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default SEOAnalyzer;
