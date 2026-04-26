import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge, Card, Alert } from 'react-bootstrap';
import { 
    FaFileCode, FaCheckCircle, FaExclamationTriangle, FaMagic, 
    FaCompressArrowsAlt, FaCopy, FaDownload, FaTrash,
    FaCode, FaSearch, FaIndent
} from 'react-icons/fa';
import SEO from '../../../../components/SEO';
import "./XMLEditor.css";

const XMLEditor = () => {
    const [xml, setXml] = useState(`<?xml version="1.0" encoding="UTF-8"?>
<webzentools>
  <tool id="105">
    <name>XML Editor</name>
    <category>Developer Tools</category>
    <features>
      <feature>Syntax Highlighting</feature>
      <feature>Validation</feature>
      <feature>Formatting</feature>
    </features>
  </tool>
  <company>Webzen Studio</company>
</webzentools>`);

    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ tags: 0, depth: 0 });
    const [copySuccess, setCopySuccess] = useState('');

    useEffect(() => {
        validateXML(xml);
    }, [xml]);

    const validateXML = (input) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(input, "application/xml");
        const parserError = xmlDoc.getElementsByTagName("parsererror");

        if (parserError.length > 0) {
            setError(parserError[0].textContent);
            setStats({ tags: 0, depth: 0 });
        } else {
            setError(null);
            // Simple stats
            const tagCount = input.match(/<[^/][^>]*>/g)?.length || 0;
            setStats({ tags: tagCount, depth: calculateDepth(xmlDoc.documentElement) });
        }
    };

    const calculateDepth = (node) => {
        let maxDepth = 0;
        if (node.children.length > 0) {
            for (let i = 0; i < node.children.length; i++) {
                maxDepth = Math.max(maxDepth, calculateDepth(node.children[i]));
            }
            return 1 + maxDepth;
        }
        return 1;
    };

    const beautifyXML = () => {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, "application/xml");
            if (xmlDoc.getElementsByTagName("parsererror").length > 0) throw new Error("Invalid XML");

            const serialize = new XMLSerializer();
            let formatted = serialize.serializeToString(xmlDoc);
            
            // Simple regex-based formatting for better readability
            let reg = /(>)(<)(\/*)/g;
            let wSpace = formatted.replace(reg, '$1\r\n$2$3');
            let formattedXml = '';
            let pad = 0;
            wSpace.split('\r\n').forEach((node) => {
                let indent = 0;
                if (node.match(/.+<\/\w[^>]*>$/)) {
                    indent = 0;
                } else if (node.match(/^<\/\w/)) {
                    if (pad !== 0) pad -= 1;
                } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                    indent = 1;
                } else {
                    indent = 0;
                }

                formattedXml += '  '.repeat(pad) + node + '\r\n';
                pad += indent;
            });
            setXml(formattedXml.trim());
        } catch {
            alert("Cannot beautify invalid XML");
        }
    };

    const minifyXML = () => {
        const minified = xml.replace(/>\s+</g, '><').trim();
        setXml(minified);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(xml);
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([xml], { type: 'text/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'webzentools.xml';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="wt-xml-editor-page">
            <SEO 
                title="XML Online Editor Free - Format & Validate XML | WebzenTools"
                description="Edit, validate, and format XML data with our free online XML editor. Features syntax highlighting, error detection, and beautify options."
                keywords="xml editor, online xml editor, free xml tool, validate xml online, format xml online"
                url="https://www.webzentools.com/tools/xml-editor"
            />

            <Container className="py-4">
                <Card className="wt-xml-card shadow-lg border-0 overflow-hidden">
                    <Card.Header className="bg-white px-4 py-3 border-bottom d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                            <div className="wt-xml-icon bg-success-subtle text-success">
                                <FaFileCode size={20} />
                            </div>
                            <div>
                                <h5 className="mb-0 fw-bold">XML Editor & Validator</h5>
                                <p className="mb-0 text-muted small">Standard XML 1.0 Compliant</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <Button variant="outline-secondary" size="sm" onClick={() => setXml('')} title="Clear">
                                <FaTrash />
                            </Button>
                            <Button variant="outline-primary" size="sm" onClick={handleCopy}>
                                <FaCopy /> {copySuccess || 'Copy'}
                            </Button>
                            <Button variant="success" size="sm" onClick={handleDownload}>
                                <FaDownload /> Download
                            </Button>
                        </div>
                    </Card.Header>

                    <Card.Body className="p-0">
                        <Row className="g-0">
                            {/* Editor Area */}
                            <Col lg={8} className="border-end">
                                <div className="wt-xml-toolbar px-3 py-2 bg-light border-bottom d-flex gap-2">
                                    <Button variant="primary" size="sm" onClick={beautifyXML} className="d-flex align-items-center gap-2">
                                        <FaMagic size={12} /> Beautify
                                    </Button>
                                    <Button variant="outline-primary" size="sm" onClick={minifyXML} className="d-flex align-items-center gap-2">
                                        <FaCompressArrowsAlt size={12} /> Minify
                                    </Button>
                                </div>
                                <textarea 
                                    spellCheck="false"
                                    className="wt-xml-textarea"
                                    value={xml}
                                    onChange={(e) => setXml(e.target.value)}
                                    placeholder="Paste your XML here..."
                                />
                            </Col>

                            {/* Sidebar Area */}
                            <Col lg={4} className="bg-light-subtle">
                                <div className="p-4">
                                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                        <FaSearch className="text-primary" /> Analysis Result
                                    </h6>

                                    {error ? (
                                        <Alert variant="danger" className="border-0 shadow-sm rounded-4 small">
                                            <div className="fw-bold mb-1 d-flex align-items-center gap-2">
                                                <FaExclamationTriangle /> Invalid XML
                                            </div>
                                            {error.split('Location:')[0]}
                                        </Alert>
                                    ) : (
                                        <Alert variant="success" className="border-0 shadow-sm rounded-4 small">
                                            <div className="fw-bold mb-1 d-flex align-items-center gap-2">
                                                <FaCheckCircle /> Valid XML
                                            </div>
                                            Your XML structure is perfectly formed.
                                        </Alert>
                                    )}

                                    <div className="wt-xml-stats mt-4">
                                        <div className="stat-item mb-3">
                                            <span className="text-muted small d-block">Tag Count</span>
                                            <span className="h4 fw-bold">{stats.tags}</span>
                                        </div>
                                        <div className="stat-item mb-3">
                                            <span className="text-muted small d-block">Max Nesting Depth</span>
                                            <span className="h4 fw-bold">{stats.depth}</span>
                                        </div>
                                    </div>

                                    <hr className="my-4" />

                                    <div className="wt-xml-tips">
                                        <h6 className="fw-bold mb-3 small text-uppercase opacity-50">Editor Tips</h6>
                                        <ul className="list-unstyled small text-muted">
                                            <li className="mb-2 d-flex gap-2">
                                                <FaIndent className="mt-1" /> Use <strong>Beautify</strong> to fix indentation.
                                            </li>
                                            <li className="mb-2 d-flex gap-2">
                                                <FaCompressArrowsAlt className="mt-1" /> Use <strong>Minify</strong> for production files.
                                            </li>
                                            <li className="d-flex gap-2">
                                                <FaCode className="mt-1" /> Ensure tags are properly closed.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Additional Info */}
                <Row className="mt-5 justify-content-center">
                    <Col lg={8} className="text-center">
                        <h2 className="fw-bold mb-3">Professional XML Tooling</h2>
                        <p className="text-muted">
                            WebzenTools XML Editor is a lightweight yet powerful utility for developers. 
                            Whether you're working with configuration files, SOAP requests, or sitemaps, 
                            our editor provides the real-time feedback you need to ensure data integrity.
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default XMLEditor;
