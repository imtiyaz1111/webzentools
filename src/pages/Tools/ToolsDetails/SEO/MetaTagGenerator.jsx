import React, { useState, useMemo } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FaCode, FaGlobe, FaFacebook, FaTwitter, FaCopy, FaCheck, FaInfoCircle } from 'react-icons/fa';
import './MetaTagGenerator.css';

const MetaTagGenerator = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        keywords: '',
        author: '',
        robotsIndex: 'index',
        robotsFollow: 'follow',
        contentType: 'text/html; charset=utf-8',
        language: 'English',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        ogUrl: '',
        twitterCard: 'summary_large_image',
        twitterCreator: ''
    });

    const [copied, setCopied] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generatedCode = useMemo(() => {
        let code = `<!-- Primary Meta Tags -->\n`;
        if (formData.title) code += `<title>${formData.title}</title>\n`;
        code += `<meta name="title" content="${formData.title || ''}">\n`;
        code += `<meta name="description" content="${formData.description || ''}">\n`;
        if (formData.keywords) code += `<meta name="keywords" content="${formData.keywords}">\n`;
        if (formData.author) code += `<meta name="author" content="${formData.author}">\n`;
        code += `<meta name="robots" content="${formData.robotsIndex}, ${formData.robotsFollow}">\n`;
        code += `<meta http-equiv="Content-Type" content="${formData.contentType}">\n`;
        code += `<meta name="language" content="${formData.language}">\n\n`;

        code += `<!-- Open Graph / Facebook -->\n`;
        code += `<meta property="og:type" content="website">\n`;
        code += `<meta property="og:url" content="${formData.ogUrl || ''}">\n`;
        code += `<meta property="og:title" content="${formData.ogTitle || formData.title || ''}">\n`;
        code += `<meta property="og:description" content="${formData.ogDescription || formData.description || ''}">\n`;
        code += `<meta property="og:image" content="${formData.ogImage || ''}">\n\n`;

        code += `<!-- Twitter -->\n`;
        code += `<meta property="twitter:card" content="${formData.twitterCard}">\n`;
        code += `<meta property="twitter:url" content="${formData.ogUrl || ''}">\n`;
        code += `<meta property="twitter:title" content="${formData.ogTitle || formData.title || ''}">\n`;
        code += `<meta property="twitter:description" content="${formData.ogDescription || formData.description || ''}">\n`;
        code += `<meta property="twitter:image" content="${formData.ogImage || ''}">\n`;
        if (formData.twitterCreator) code += `<meta property="twitter:creator" content="${formData.twitterCreator}">\n`;

        return code;
    }, [formData]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const renderCodePreview = () => {
        const lines = generatedCode.split('\n');
        return lines.map((line, i) => {
            if (line.startsWith('<!--')) {
                return <div key={i} className="comment-syntax">{line}</div>;
            }
            if (line.startsWith('<meta') || line.startsWith('<title')) {
                const parts = line.split(/(<[\w:]+|"[\w\s,:/.-]*"|[\s=>]+)/g).filter(Boolean);
                return (
                    <div key={i}>
                        {parts.map((part, pi) => {
                            if (part.startsWith('<')) return <span key={pi} className="tag-syntax">{part}</span>;
                            if (part.startsWith('"')) return <span key={pi} className="val-syntax">{part}</span>;
                            if (part.includes('=')) return <span key={pi} className="attr-syntax">{part}</span>;
                            return <span key={pi}>{part}</span>;
                        })}
                    </div>
                );
            }
            return <div key={i}>{line}</div>;
        });
    };

    return (
        <div className="meta-tag-generator">
            <Row className="gy-4">
                <Col lg={7}>
                    <div className="p-4 glass-card rounded-4 mb-4">
                        <div className="section-title">
                            <FaGlobe className="me-2 text-primary" /> Basic Site Information
                        </div>
                        <Row className="gy-3">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Site Title</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="title"
                                        placeholder="e.g. My Awesome Website"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                    />
                                    <Form.Text className="text-muted small">Recommended: Under 60 characters</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Site Description</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={3}
                                        name="description"
                                        placeholder="Enter a brief description of your website..."
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    />
                                    <Form.Text className="text-muted small">Recommended: 150-160 characters</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Keywords</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="keywords"
                                        placeholder="keyword1, keyword2, keyword3"
                                        value={formData.keywords}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Author</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="author"
                                        placeholder="Your Name or Company"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>

                    <div className="p-4 glass-card rounded-4 mb-4">
                        <div className="section-title">
                            <FaCheck className="me-2 text-success" /> Search Engine Options
                        </div>
                        <Row className="gy-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Robots Indexing</Form.Label>
                                    <Form.Select name="robotsIndex" value={formData.robotsIndex} onChange={handleInputChange}>
                                        <option value="index">Index</option>
                                        <option value="noindex">No Index</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Robots Following</Form.Label>
                                    <Form.Select name="robotsFollow" value={formData.robotsFollow} onChange={handleInputChange}>
                                        <option value="follow">Follow</option>
                                        <option value="nofollow">No Follow</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>

                    <div className="p-4 glass-card rounded-4">
                        <div className="section-title">
                            <FaFacebook className="me-2 text-info" /> Social Media (OG & Twitter)
                        </div>
                        <Row className="gy-3">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>OG Image URL</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="ogImage"
                                        placeholder="https://example.com/og-image.jpg"
                                        value={formData.ogImage}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Canonical URL</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="ogUrl"
                                        placeholder="https://example.com/"
                                        value={formData.ogUrl}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Twitter Card Type</Form.Label>
                                    <Form.Select name="twitterCard" value={formData.twitterCard} onChange={handleInputChange}>
                                        <option value="summary_large_image">Summary with Large Image</option>
                                        <option value="summary">Summary</option>
                                        <option value="app">App</option>
                                        <option value="player">Player</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Twitter Username</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="twitterCreator"
                                        placeholder="@yourusername"
                                        value={formData.twitterCreator}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>
                </Col>

                <Col lg={5}>
                    <div className="code-preview-container">
                        <div className="glass-card rounded-4 p-0 overflow-hidden">
                            <div className="bg-primary bg-opacity-10 p-3 d-flex justify-content-between align-items-center">
                                <span className="fw-bold text-primary small"><FaCode className="me-2" /> Generated Meta Tags</span>
                                <Button 
                                    size="sm" 
                                    variant={copied ? "success" : "primary"} 
                                    onClick={handleCopy}
                                    className="d-flex align-items-center"
                                >
                                    {copied ? <><FaCheck className="me-2" /> Copied</> : <><FaCopy className="me-2" /> Copy Code</>}
                                </Button>
                            </div>
                            <div className="code-preview">
                                <pre>{renderCodePreview()}</pre>
                            </div>
                        </div>

                        <Alert variant="info" className="mt-4 border-0 shadow-sm rounded-4 d-flex align-items-start">
                            <FaInfoCircle className="mt-1 me-3 flex-shrink-0" />
                            <div className="small">
                                <strong>How to use:</strong> Copy the generated code and paste it into the <code>&lt;head&gt;</code> section of your HTML document.
                            </div>
                        </Alert>
                    </div>
                </Col>
            </Row>

            <div className="mt-5 pt-4 border-top">
                <h3 className="h5 fw-bold mb-3">Understanding Meta Tags</h3>
                <p className="text-muted small">
                    Meta tags are snippets of text that describe a page's content; the meta tags don't appear on the page itself, but only in the page's source code. Meta tags are essentially little content descriptors that help tell search engines what a web page is about.
                </p>
                <Row className="gy-4 mt-1">
                    <Col md={4}>
                        <div className="p-3 bg-light rounded-4 h-100">
                            <h6 className="fw-bold mb-2">SEO Meta Tags</h6>
                            <p className="text-muted small mb-0">Help search engines like Google and Bing understand your content to rank your site appropriately in search results.</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="p-3 bg-light rounded-4 h-100">
                            <h6 className="fw-bold mb-2">Open Graph (OG)</h6>
                            <p className="text-muted small mb-0">Control how your links are displayed when shared on social platforms like Facebook, LinkedIn, and WhatsApp.</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="p-3 bg-light rounded-4 h-100">
                            <h6 className="fw-bold mb-2">Twitter Cards</h6>
                            <p className="text-muted small mb-0">Specifically designed to optimize how your website looks when shared on X (formerly Twitter).</p>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default MetaTagGenerator;
