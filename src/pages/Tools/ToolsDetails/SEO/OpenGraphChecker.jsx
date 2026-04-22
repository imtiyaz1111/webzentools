import React, { useState } from 'react';
import axios from 'axios';
import { Row, Col, Form, Button, Table, Alert, Badge, Tabs, Tab } from 'react-bootstrap';
import { FaShareAlt, FaFacebook, FaTwitter, FaLink, FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaSyncAlt, FaEye } from 'react-icons/fa';
import './OpenGraphChecker.css';

const OpenGraphChecker = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const fetchTags = async () => {
        if (!url.trim()) {
            setError('Please provide a valid URL.');
            return;
        }

        setLoading(true);
        setError('');
        setResults(null);

        try {
            const target = url.startsWith('http') ? url : `https://${url}`;
            const response = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(target)}`);
            const data = response.data;
            
            if (!data.contents) throw new Error('Could not fetch website content.');

            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, 'text/html');
            const metas = Array.from(doc.querySelectorAll('meta'));
            
            const tags = {
                og: {},
                twitter: {},
                basic: {}
            };

            metas.forEach(meta => {
                const property = meta.getAttribute('property') || meta.getAttribute('name');
                const content = meta.getAttribute('content');
                if (!property || !content) return;

                if (property.startsWith('og:')) {
                    tags.og[property] = content;
                } else if (property.startsWith('twitter:')) {
                    tags.twitter[property] = content;
                } else if (['description', 'author', 'keywords'].includes(property)) {
                    tags.basic[property] = content;
                }
            });

            tags.basic.title = doc.querySelector('title')?.innerText || '';

            // Consolidated Preview Data
            const preview = {
                title: tags.og['og:title'] || tags.twitter['twitter:title'] || tags.basic.title || 'No Title Found',
                description: tags.og['og:description'] || tags.twitter['twitter:description'] || tags.basic.description || 'No description found. Social media will usually pick a snippet from your content.',
                image: tags.og['og:image'] || tags.twitter['twitter:image'] || '',
                url: tags.og['og:url'] || target,
                site_name: tags.og['og:site_name'] || new URL(target).hostname
            };

            setResults({ tags, preview, target });
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch Open Graph data. Please check the URL and try again.');
            setLoading(false);
        }
    };

    const renderTagRow = (key, value) => (
        <tr key={key}>
            <td><span className="tag-key">{key}</span></td>
            <td><span className="tag-value">{value}</span></td>
            <td className="text-end">
                <Badge bg="success" className="status-pill">Found</Badge>
            </td>
        </tr>
    );

    return (
        <div className="og-checker">
            <div className="p-4 glass-card rounded-4 mb-4">
                <Row className="align-items-end gy-3">
                    <Col md={9}>
                        <Form.Group>
                            <Form.Label className="fw-bold"><FaLink className="me-2 text-primary" /> Enter URL to Check Social Preview</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="e.g. https://github.com/google" 
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && fetchTags()}
                                className="rounded-3"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Button className="w-100 btn-fetch" onClick={fetchTags} disabled={loading}>
                            {loading ? <><FaSyncAlt className="fa-spin me-2" /> Checking...</> : <><FaShareAlt className="me-2" /> Check Tags</>}
                        </Button>
                    </Col>
                </Row>
                {error && <Alert variant="danger" className="mt-3 rounded-3 small">{error}</Alert>}
            </div>

            {results && (
                <div className="animate-in">
                    <Row className="gy-4">
                        <Col lg={6}>
                            <h5 className="fw-bold mb-4 d-flex align-items-center">
                                <FaEye className="me-2 text-primary" /> Social Media Previews
                            </h5>
                            <div className="preview-section h-100">
                                <Tabs defaultActiveKey="facebook" className="mb-4 custom-tabs">
                                    <Tab eventKey="facebook" title={<span><FaFacebook className="me-2" /> Facebook</span>}>
                                        <div className="mockup-facebook mx-auto mt-2">
                                            {results.preview.image && <img src={results.preview.image} alt="OG Preview" className="fb-image" />}
                                            <div className="fb-content">
                                                <div className="fb-domain">{new URL(results.target).hostname}</div>
                                                <div className="fb-title">{results.preview.title}</div>
                                                <div className="fb-desc">{results.preview.description}</div>
                                            </div>
                                        </div>
                                    </Tab>
                                    <Tab eventKey="twitter" title={<span><FaTwitter className="me-2" /> Twitter</span>}>
                                        <div className="mockup-twitter mx-auto mt-2">
                                            {results.preview.image && <img src={results.preview.image} alt="Twitter Preview" className="tw-image" />}
                                            <div className="tw-content">
                                                <div className="tw-domain">{new URL(results.target).hostname}</div>
                                                <div className="tw-title">{results.preview.title}</div>
                                                <div className="tw-desc">{results.preview.description}</div>
                                            </div>
                                        </div>
                                    </Tab>
                                </Tabs>
                                <div className="mt-4 p-3 rounded-4 bg-white border small text-muted">
                                    <FaInfoCircle className="me-2 text-primary" /> 
                                    These previews are simulated based on the Open Graph and Twitter tags found on the page. Real appearance may vary slightly.
                                </div>
                            </div>
                        </Col>

                        <Col lg={6}>
                            <h5 className="fw-bold mb-4 d-flex align-items-center">
                                <FaInfoCircle className="me-2 text-primary" /> Metadata Audit
                            </h5>
                            <div className="p-4 glass-card rounded-4">
                                <div className="mb-4 d-flex gap-2">
                                    <Badge bg={results.tags.og['og:title'] ? 'success' : 'danger'} className="rounded-pill p-2 px-3">
                                        OG Tags: {Object.keys(results.tags.og).length}
                                    </Badge>
                                    <Badge bg={results.tags.twitter['twitter:card'] ? 'primary' : 'warning'} className="rounded-pill p-2 px-3">
                                        Twitter Tags: {Object.keys(results.tags.twitter).length}
                                    </Badge>
                                </div>

                                <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                    <Table hover size="sm" className="tag-table">
                                        <thead>
                                            <tr>
                                                <th>Property</th>
                                                <th>Content</th>
                                                <th className="text-end">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(results.tags.og).map(([k, v]) => renderTagRow(k, v))}
                                            {Object.entries(results.tags.twitter).map(([k, v]) => renderTagRow(k, v))}
                                        </tbody>
                                    </Table>
                                </div>

                                {(!results.tags.og['og:image'] && !results.tags.twitter['twitter:image']) && (
                                    <Alert variant="warning" className="mt-3 border-0 rounded-4 small">
                                        <FaExclamationTriangle className="me-2" />
                                        <strong>Missing Share Image:</strong> We couldn't find a share image tag. Social platforms will pick a random image from your page.
                                    </Alert>
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
            )}

            <div className="mt-5 pt-4 border-top">
                <h3 className="h5 fw-bold mb-3">Why Open Graph Tags Matter?</h3>
                <p className="text-muted small">
                    Open Graph (OG) tags are snippets of code that control how URLs are displayed when shared on social media. They are part of Facebook's Open Graph protocol and are used by other social media platforms, including LinkedIn and Twitter (if Twitter cards are absent).
                </p>
                <Row className="gy-4 mt-2">
                    <Col md={4}>
                        <div className="p-3 bg-light rounded-4 h-100">
                            <h6 className="fw-bold mb-2">Increased CTR</h6>
                            <p className="text-muted small mb-0">Rich previews with compelling images and titles attract more clicks than plain text links.</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="p-3 bg-light rounded-4 h-100">
                            <h6 className="fw-bold mb-2">Brand Consistency</h6>
                            <p className="text-muted small mb-0">Control your brand's appearance across all social platforms by specifying exact images and titles.</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="p-3 bg-light rounded-4 h-100">
                            <h6 className="fw-bold mb-2">Social SEO</h6>
                            <p className="text-muted small mb-0">While not a direct ranking factor, high engagement on social media can indirectly boost your SEO performance.</p>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default OpenGraphChecker;
