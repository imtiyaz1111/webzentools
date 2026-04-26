import React, { useState, useMemo } from 'react';
import { Row, Col, Form, Button, Tabs, Tab, Alert } from 'react-bootstrap';
import { FaLink, FaCopy, FaCheck, FaInfoCircle, FaFileCode, FaListUl, FaTrash } from 'react-icons/fa';
import './CanonicalGenerator.css';

const CanonicalGenerator = () => {
    const [url, setUrl] = useState('https://example.com/page');
    const [bulkUrls, setBulkUrls] = useState('');
    const [activeTab, setActiveTab] = useState('single');
    const [copied, setCopied] = useState(false);

    const generatedCode = useMemo(() => {
        if (activeTab === 'single') {
            const cleanUrl = url.trim() || 'https://example.com/page';
            return `<link rel="canonical" href="${cleanUrl}" />`;
        } else {
            const lines = bulkUrls.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            if (lines.length === 0) {
                return '<!-- Paste URLs above to generate tags -->';
            } else {
                return lines.map(l => `<link rel="canonical" href="${l}" />`).join('\n');
            }
        }
    }, [url, bulkUrls, activeTab]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const clearBulk = () => {
        setBulkUrls('');
    };

    const renderCodeWithSyntax = () => {
        if (!generatedCode) return null;
        
        return generatedCode.split('\n').map((line, i) => (
            <div key={i}>
                <span className="tag-syntax">&lt;link</span>
                <span className="attr-syntax"> rel</span>=<span className="val-syntax">"canonical"</span>
                <span className="attr-syntax"> href</span>=<span className="val-syntax">"{line.match(/href="([^"]*)"/)?.[1] || ''}"</span>
                <span className="tag-syntax"> /&gt;</span>
            </div>
        ));
    };

    return (
        <div className="canonical-generator">
            <Row className="gy-4">
                <Col lg={7}>
                    <div className="p-4 glass-card rounded-4">
                        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
                            <Tab eventKey="single" title={<span><FaLink className="me-2" /> Single URL</span>}>
                                <div className="mt-3">
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-bold">Enter Canonical URL</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="https://yourwebsite.com/main-page" 
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            className="rounded-3 p-3 shadow-sm"
                                        />
                                        <Form.Text className="text-muted small">The master URL that search engines should index.</Form.Text>
                                    </Form.Group>
                                </div>
                            </Tab>
                            <Tab eventKey="bulk" title={<span><FaListUl className="me-2" /> Bulk Generator</span>}>
                                <div className="mt-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Form.Label className="fw-bold mb-0">Paste URLs (One per line)</Form.Label>
                                        <Button variant="link" size="sm" className="text-danger p-0" onClick={clearBulk}>
                                            <FaTrash className="me-1" /> Clear
                                        </Button>
                                    </div>
                                    <Form.Control 
                                        as="textarea"
                                        rows={8}
                                        className="bulk-textarea mb-2"
                                        placeholder="https://example.com/page-1&#10;https://example.com/page-2"
                                        value={bulkUrls}
                                        onChange={(e) => setBulkUrls(e.target.value)}
                                    />
                                    <Form.Text className="text-muted small">Generate tags for multiple pages at once.</Form.Text>
                                </div>
                            </Tab>
                        </Tabs>

                        <div className="mt-4 p-3 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-20">
                            <h6 className="fw-bold text-primary mb-2 small d-flex align-items-center">
                                <FaInfoCircle className="me-2" /> What is a Canonical Tag?
                            </h6>
                            <p className="small text-muted mb-0">
                                A canonical tag (<code>rel="canonical"</code>) is an HTML element that helps webmasters prevent duplicate content issues in search engine optimization (SEO) by specifying the "canonical" or "preferred" version of a web page.
                            </p>
                        </div>
                    </div>
                </Col>

                <Col lg={5}>
                    <div className="animate-in h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0"><FaFileCode className="me-2 text-primary" /> Generated Tag</h5>
                        </div>
                        <div className="code-preview-container h-100">
                            <button className="btn-copy" onClick={handleCopy}>
                                {copied ? <><FaCheck className="me-1" /> Copied</> : <><FaCopy className="me-1" /> Copy</>}
                            </button>
                            <div className="code-preview">
                                {activeTab === 'single' ? renderCodeWithSyntax() : generatedCode}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <div className="mt-5 pt-4 border-top">
                <h3 className="h5 fw-bold mb-3">SEO Benefits of Canonical Tags</h3>
                <p className="text-muted small">
                    Using canonical tags correctly is essential for maintaining your site's SEO health, especially if you have multiple URLs pointing to the same content (e.g., tracking parameters, different sorting orders, or separate mobile/desktop URLs).
                </p>
                <Row className="gy-4 mt-2">
                    <Col md={4}>
                        <div className="p-3 bg-light rounded-4 h-100">
                            <h6 className="fw-bold mb-2">Prevent Duplication</h6>
                            <p className="text-muted small mb-0">Consolidate link signals for similar URLs and tell Google which page to value most.</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="p-3 bg-light rounded-4 h-100">
                            <h6 className="fw-bold mb-2">Better Crawling</h6>
                            <p className="text-muted small mb-0">Help search engines crawl your site more efficiently by focusing on your unique content.</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="p-3 bg-light rounded-4 h-100">
                            <h6 className="fw-bold mb-2">Link Equity</h6>
                            <p className="text-muted small mb-0">Direct all "ranking power" from various versions of a page to a single authoritative URL.</p>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default CanonicalGenerator;
