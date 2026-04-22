import React, { useState } from 'react';
import axios from 'axios';

import { Row, Col, Form, Button, Table, Alert, ProgressBar, Badge } from 'react-bootstrap';
import { FaLink, FaSearch, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExternalLinkAlt, FaSyncAlt } from 'react-icons/fa';
import './BacklinkChecker.css';

const BacklinkChecker = () => {
    const [targetUrl, setTargetUrl] = useState('');
    const [sourceUrls, setSourceUrls] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');

    const verifyBacklinks = async () => {
        if (!targetUrl.trim() || !sourceUrls.trim()) {
            setError('Please provide both the target URL and at least one source URL.');
            return;
        }

        const urls = sourceUrls.split('\n').map(u => u.trim()).filter(u => u.length > 0);
        if (urls.length === 0) {
            setError('Please provide valid source URLs.');
            return;
        }

        setLoading(true);
        setError('');
        setResults(null);
        setProgress(0);

        const normalizedTarget = targetUrl.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '').toLowerCase();
        
        const auditResults = [];
        let completed = 0;

        for (const url of urls) {
            try {
                const sourceUrl = url.startsWith('http') ? url : `https://${url}`;
                const response = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(sourceUrl)}`);
                const data = response.data;
                
                if (!data.contents) throw new Error('Source page unreachable');


                const parser = new DOMParser();
                const doc = parser.parseFromString(data.contents, 'text/html');
                const links = Array.from(doc.querySelectorAll('a'));
                
                const backlink = links.find(link => {
                    const href = link.getAttribute('href') || '';
                    return href.toLowerCase().includes(normalizedTarget);
                });

                if (backlink) {
                    const rel = backlink.getAttribute('rel') || '';
                    auditResults.push({
                        source: url,
                        status: 'found',
                        anchor: backlink.innerText.trim() || '[Image/Icon]',
                        type: rel.toLowerCase().includes('nofollow') ? 'Nofollow' : 'Follow',
                        rel: rel
                    });
                } else {
                    auditResults.push({
                        source: url,
                        status: 'missing',
                        anchor: '-',
                        type: '-',
                        rel: '-'
                    });
                }
            } catch (err) {
                auditResults.push({
                    source: url,
                    status: 'error',
                    anchor: '-',
                    type: '-',
                    rel: 'Connection Failed'
                });
            }
            
            completed++;
            setProgress(Math.round((completed / urls.length) * 100));
        }

        const stats = {
            total: auditResults.length,
            found: auditResults.filter(r => r.status === 'found').length,
            missing: auditResults.filter(r => r.status === 'missing' || r.status === 'error').length,
            follow: auditResults.filter(r => r.type === 'Follow').length,
            nofollow: auditResults.filter(r => r.type === 'Nofollow').length
        };

        setResults({ items: auditResults, stats });
        setLoading(false);
    };

    const handleReset = () => {
        setTargetUrl('');
        setSourceUrls('');
        setResults(null);
        setProgress(0);
    };

    return (
        <div className="backlink-checker">
            <div className="p-4 glass-card rounded-4 mb-4">
                <Row className="gy-4">
                    <Col lg={12}>
                        <Form.Group className="mb-4">
                            <Form.Label><FaLink className="me-2 text-primary" /> Target Website URL</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="e.g. https://yourwebsite.com" 
                                value={targetUrl}
                                onChange={(e) => setTargetUrl(e.target.value)}
                            />
                            <Form.Text className="text-muted small">The domain you want to check backlinks for.</Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label><FaSearch className="me-2 text-primary" /> Backlink Source URLs (One per line)</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={6} 
                                placeholder="Enter URLs to check for backlinks..."
                                value={sourceUrls}
                                onChange={(e) => setSourceUrls(e.target.value)}
                            />
                        </Form.Group>

                        <div className="d-flex gap-3">
                            <Button className="btn-verify px-5" onClick={verifyBacklinks} disabled={loading}>
                                {loading ? <><FaSyncAlt className="fa-spin me-2" /> Auditing...</> : 'Verify Backlinks'}
                            </Button>
                            <Button variant="outline-secondary" className="rounded-3" onClick={handleReset} disabled={loading}>
                                Reset
                            </Button>
                        </div>

                        {loading && (
                            <div className="mt-4">
                                <div className="d-flex justify-content-between mb-2 small fw-bold">
                                    <span>Progress</span>
                                    <span>{progress}%</span>
                                </div>
                                <ProgressBar now={progress} variant="primary" className="rounded-pill" style={{ height: '8px' }} />
                            </div>
                        )}

                        {error && <Alert variant="danger" className="mt-3 rounded-3 small">{error}</Alert>}
                    </Col>
                </Row>
            </div>

            {results && (
                <div className="animate-result">
                    <Row className="gy-4 mb-4">
                        <Col md={3}>
                            <div className="stat-pill glass-card h-100" style={{ borderTop: '4px solid #4f46e5' }}>
                                <h6 className="text-muted small mb-2">Total Verified</h6>
                                <h2 className="fw-bold mb-0">{results.stats.total}</h2>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="stat-pill glass-card h-100" style={{ borderTop: '4px solid #10b981' }}>
                                <h6 className="text-muted small mb-2">Found Links</h6>
                                <h2 className="fw-bold text-success mb-0">{results.stats.found}</h2>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="stat-pill glass-card h-100" style={{ borderTop: '4px solid #f59e0b' }}>
                                <h6 className="text-muted small mb-2">Follow / Nofollow</h6>
                                <h2 className="fw-bold mb-0">{results.stats.follow} / {results.stats.nofollow}</h2>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="stat-pill glass-card h-100" style={{ borderTop: '4px solid #ef4444' }}>
                                <h6 className="text-muted small mb-2">Missing Links</h6>
                                <h2 className="fw-bold text-danger mb-0">{results.stats.missing}</h2>
                            </div>
                        </Col>
                    </Row>

                    <div className="glass-card rounded-4 overflow-hidden">
                        <div className="p-4 border-bottom bg-light bg-opacity-50">
                            <h5 className="fw-bold mb-0">Detailed Audit Results</h5>
                        </div>
                        <Table responsive hover className="mb-0">
                            <thead>
                                <tr>
                                    <th>Source URL</th>
                                    <th>Status</th>
                                    <th>Anchor Text</th>
                                    <th>Link Type</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="text-truncate" style={{ maxWidth: '300px' }}>
                                            <span className="small text-muted">{item.source}</span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${item.status}`}>
                                                {item.status === 'found' ? <FaCheckCircle className="me-1" /> : <FaTimesCircle className="me-1" />}
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="anchor-text">{item.anchor}</span>
                                        </td>
                                        <td>
                                            {item.status === 'found' ? (
                                                <Badge bg={item.type === 'Follow' ? 'success' : 'warning'} className="rounded-pill">
                                                    {item.type}
                                                </Badge>
                                            ) : '-'}
                                        </td>
                                        <td className="text-end">
                                            <a href={item.source} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary rounded-circle p-1">
                                                <FaExternalLinkAlt size={12} />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            )}

            <div className="mt-5 pt-4 border-top">
                <h3 className="h5 fw-bold mb-3">About Backlink Auditing</h3>
                <p className="text-muted small">
                    A backlink audit is a process of analyzing all the links that point to your website. It's a crucial part of SEO that helps you identify high-quality links and harmful ones that could lead to search engine penalties.
                </p>
                <Row className="gy-4 mt-1">
                    <Col md={6}>
                        <div className="d-flex align-items-start p-3 bg-light rounded-4 h-100">
                            <FaInfoCircle className="text-primary me-3 mt-1" />
                            <div>
                                <h6 className="fw-bold mb-1">Dofollow vs Nofollow</h6>
                                <p className="text-muted small mb-0">Dofollow links pass "link juice" and help your ranking. Nofollow links tell search engines to ignore the link for SEO purposes, but they still drive traffic.</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="d-flex align-items-start p-3 bg-light rounded-4 h-100">
                            <FaCheckCircle className="text-success me-3 mt-1" />
                            <div>
                                <h6 className="fw-bold mb-1">Anchor Text Importance</h6>
                                <p className="text-muted small mb-0">The visible, clickable text in a hyperlink. Search engines use this to understand what the target page is about.</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default BacklinkChecker;
