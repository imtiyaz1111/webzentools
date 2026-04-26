import React, { useState, useMemo } from 'react';
import { Row, Col, Form, Button, Tabs, Tab, Alert } from 'react-bootstrap';
import { FaSitemap, FaPlus, FaTrash, FaCopy, FaDownload, FaListUl, FaEdit, FaCheck, FaInfoCircle } from 'react-icons/fa';
import './SitemapGenerator.css';

const SitemapGenerator = () => {
    const [urls, setUrls] = useState([
        { url: 'https://example.com/', priority: '1.0', freq: 'daily', lastMod: new Date().toISOString().split('T')[0] }
    ]);
    const [bulkInput, setBulkInput] = useState('');
    const [activeTab, setActiveTab] = useState('manual');
    const [copied, setCopied] = useState(false);

    const addUrl = () => {
        setUrls([...urls, { url: '', priority: '0.8', freq: 'weekly', lastMod: new Date().toISOString().split('T')[0] }]);
    };

    const removeUrl = (index) => {
        setUrls(urls.filter((_, i) => i !== index));
    };

    const updateUrl = (index, field, value) => {
        const newUrls = [...urls];
        newUrls[index][field] = value;
        setUrls(newUrls);
    };

    const processBulk = () => {
        const lines = bulkInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const newUrls = lines.map(url => ({
            url: url.startsWith('http') ? url : `https://${url}`,
            priority: '0.5',
            freq: 'monthly',
            lastMod: new Date().toISOString().split('T')[0]
        }));
        setUrls([...urls, ...newUrls]);
        setBulkInput('');
        setActiveTab('manual');
    };

    const generatedCode = useMemo(() => {
        let code = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        code += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        
        urls.forEach(item => {
            if (!item.url) return;
            code += `  <url>\n`;
            code += `    <loc>${item.url}</loc>\n`;
            code += `    <lastmod>${item.lastMod}</lastmod>\n`;
            code += `    <changefreq>${item.freq}</changefreq>\n`;
            code += `    <priority>${item.priority}</priority>\n`;
            code += `  </url>\n`;
        });

        code += `</urlset>`;
        return code;
    }, [urls]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([generatedCode], {type: 'text/xml'});
        element.href = URL.createObjectURL(file);
        element.download = "sitemap.xml";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const renderPreview = () => {
        return generatedCode.split('\n').map((line, i) => {
            const parts = line.split(/(<[\w/]+>|[\w\s,:/.-]+)/g).filter(Boolean);
            return (
                <div key={i}>
                    {parts.map((part, pi) => {
                        if (part.startsWith('<')) return <span key={pi} className="tag-syntax">{part}</span>;
                        return <span key={pi}>{part}</span>;
                    })}
                </div>
            );
        });
    };

    return (
        <div className="sitemap-generator">
            <Row className="gy-4">
                <Col lg={7}>
                    <div className="p-4 glass-card rounded-4">
                        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
                            <Tab eventKey="manual" title={<span><FaEdit className="me-2" /> Manual Builder</span>}>
                                <div className="url-list-container">
                                    {urls.map((item, idx) => (
                                        <div key={idx} className="url-item">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <span className="badge bg-primary rounded-pill">URL #{idx + 1}</span>
                                                <button className="btn btn-link btn-remove p-0" onClick={() => removeUrl(idx)}>
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                            <Form.Group className="mb-3">
                                                <Form.Control 
                                                    size="sm"
                                                    placeholder="https://example.com/page"
                                                    value={item.url}
                                                    onChange={(e) => updateUrl(idx, 'url', e.target.value)}
                                                    className="border-0 bg-white"
                                                />
                                            </Form.Group>
                                            <Row className="g-2">
                                                <Col md={4}>
                                                    <Form.Label className="x-small fw-bold text-muted mb-1">Priority</Form.Label>
                                                    <Form.Select 
                                                        size="sm"
                                                        value={item.priority}
                                                        onChange={(e) => updateUrl(idx, 'priority', e.target.value)}
                                                        className="border-0 bg-white"
                                                    >
                                                        <option value="1.0">1.0 (High)</option>
                                                        <option value="0.8">0.8</option>
                                                        <option value="0.5">0.5 (Medium)</option>
                                                        <option value="0.3">0.3</option>
                                                        <option value="0.1">0.1 (Low)</option>
                                                    </Form.Select>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Label className="x-small fw-bold text-muted mb-1">Frequency</Form.Label>
                                                    <Form.Select 
                                                        size="sm"
                                                        value={item.freq}
                                                        onChange={(e) => updateUrl(idx, 'freq', e.target.value)}
                                                        className="border-0 bg-white"
                                                    >
                                                        <option value="always">Always</option>
                                                        <option value="hourly">Hourly</option>
                                                        <option value="daily">Daily</option>
                                                        <option value="weekly">Weekly</option>
                                                        <option value="monthly">Monthly</option>
                                                        <option value="yearly">Yearly</option>
                                                        <option value="never">Never</option>
                                                    </Form.Select>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Label className="x-small fw-bold text-muted mb-1">Last Mod</Form.Label>
                                                    <Form.Control 
                                                        size="sm"
                                                        type="date"
                                                        value={item.lastMod}
                                                        onChange={(e) => updateUrl(idx, 'lastMod', e.target.value)}
                                                        className="border-0 bg-white"
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline-primary" className="w-100 rounded-3 mt-2" onClick={addUrl}>
                                    <FaPlus className="me-2" /> Add Another URL
                                </Button>
                            </Tab>
                            <Tab eventKey="bulk" title={<span><FaListUl className="me-2" /> Bulk Import</span>}>
                                <div className="p-2">
                                    <Form.Label className="fw-bold small">Paste your URLs (one per line)</Form.Label>
                                    <Form.Control 
                                        as="textarea"
                                        className="bulk-textarea mb-3"
                                        placeholder="https://example.com/page-1&#10;https://example.com/page-2"
                                        value={bulkInput}
                                        onChange={(e) => setBulkInput(e.target.value)}
                                    />
                                    <Button className="w-100 btn-success rounded-3" onClick={processBulk}>
                                        Add to List
                                    </Button>
                                    <Alert variant="info" className="mt-3 border-0 rounded-3 small">
                                        <FaInfoCircle className="me-2" /> All bulk imported URLs will use default settings (0.5 Priority, Monthly).
                                    </Alert>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </Col>

                <Col lg={5}>
                    <div className="code-preview-container">
                        <div className="code-preview">
                            {renderPreview()}
                        </div>
                        <div className="preview-actions">
                            <Button variant={copied ? "success" : "primary"} className="btn-action" onClick={handleCopy}>
                                {copied ? <><FaCheck className="me-2" /> Copied!</> : <><FaCopy className="me-2" /> Copy XML</>}
                            </Button>
                            <Button variant="dark" className="btn-action" onClick={handleDownload}>
                                <FaDownload className="me-2" /> Download
                            </Button>
                        </div>
                        <Alert variant="success" className="mt-4 border-0 shadow-sm rounded-4">
                            <div className="d-flex align-items-start">
                                <FaCheck className="mt-1 me-3 flex-shrink-0" />
                                <div className="small">
                                    <strong>SEO Tip:</strong> A sitemap should not exceed 50,000 URLs or 50MB in size. Most websites only need one sitemap.
                                </div>
                            </div>
                        </Alert>
                    </div>
                </Col>
            </Row>

            <div className="mt-5 pt-4 border-top">
                <h3 className="h5 fw-bold mb-3">Why Use an XML Sitemap?</h3>
                <p className="text-muted small">
                    An XML sitemap is a file where you provide information about the pages, videos, and other files on your site, and the relationships between them. Search engines like Google read this file to more intelligently crawl your site. A sitemap tells Google which pages and files you think are important in your site, and also provides valuable information about these files.
                </p>
                <Row className="gy-4 mt-2">
                    <Col md={6}>
                        <div className="d-flex align-items-start p-3 bg-light rounded-4 h-100">
                            <FaSitemap className="text-primary me-3 mt-1" />
                            <div>
                                <h6 className="fw-bold mb-1">Better Crawling</h6>
                                <p className="text-muted small mb-0">Help search engine bots find all your pages, including those that might not be discoverable through normal crawling.</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="d-flex align-items-start p-3 bg-light rounded-4 h-100">
                            <FaInfoCircle className="text-success me-3 mt-1" />
                            <div>
                                <h6 className="fw-bold mb-1">Priority & Frequency</h6>
                                <p className="text-muted small mb-0">Indicate to search engines which pages change often and which ones are the most important for your business.</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default SitemapGenerator;
