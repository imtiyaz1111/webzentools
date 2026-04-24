import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Tab, Nav, Dropdown, ButtonGroup } from 'react-bootstrap';
import {
    FaTerminal, FaCss3Alt, FaHtml5, FaJs,
    FaCode,
    FaDesktop,
    FaMobileAlt,
    FaPlay,
    FaDownload,
    FaTrash,
    FaCopy,
    FaSyncAlt,
    FaEye,
    FaFileCode
} from 'react-icons/fa';

import SEO from '../../../../components/SEO';
import "./HTMLEditor.css";

const HTMLEditor = () => {
    const [html, setHtml] = useState('<!-- Welcome to WebzenTools HTML Editor -->\n<div class="welcome-card">\n  <h1>Hello, WebzenTools!</h1>\n  <p>Start coding your next big idea here.</p>\n  <button class="cta-btn">Click Me</button>\n</div>');
    const [css, setCss] = useState('/* Add your styles here */\nbody {\n  font-family: "Inter", sans-serif;\n  background: #f0f2f5;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n}\n\n.welcome-card {\n  background: #ffffff;\n  padding: 3rem;\n  border-radius: 20px;\n  box-shadow: 0 10px 30px rgba(0,0,0,0.1);\n  text-align: center;\n}\n\nh1 {\n  color: #3b82f6;\n  margin-bottom: 1rem;\n}\n\n.cta-btn {\n  background: #3b82f6;\n  color: white;\n  border: none;\n  padding: 10px 24px;\n  border-radius: 8px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: 0.3s;\n}\n\n.cta-btn:hover {\n  background: #2563eb;\n  transform: translateY(-2px);\n}');
    const [js, setJs] = useState('// Add your JavaScript here\ndocument.querySelector(".cta-btn").addEventListener("click", () => {\n  alert("WebzenTools HTML Editor is awesome!");\n});');

    const [activeTab, setActiveTab] = useState('html');
    const [viewMode, setViewMode] = useState('desktop'); // desktop, mobile
    const [srcDoc, setSrcDoc] = useState('');
    const [copySuccess, setCopySuccess] = useState('');

    const iframeRef = useRef(null);

    // Update Live Preview
    useEffect(() => {
        const timeout = setTimeout(() => {
            setSrcDoc(`
                <html>
                    <head>
                        <style>${css}</style>
                    </head>
                    <body>
                        ${html}
                        <script>${js}</script>
                    </body>
                </html>
            `);
        }, 3000); // 3-second delay for auto-refresh to avoid heavy computation

        return () => clearTimeout(timeout);
    }, [html, css, js]);

    const runCode = () => {
        setSrcDoc(`
            <html>
                <head>
                    <style>${css}</style>
                </head>
                <body>
                    ${html}
                    <script>${js}</script>
                </body>
            </html>
        `);
    };

    const handleCopy = (content) => {
        navigator.clipboard.writeText(content);
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    };

    const handleDownload = () => {
        const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebzenTools Export</title>
    <style>${css}</style>
</head>
<body>
    ${html}
    <script>${js}</script>
</body>
</html>`;
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'webzentools-code.html';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleClear = () => {
        if (window.confirm('Are you sure you want to clear all code?')) {
            setHtml('');
            setCss('');
            setJs('');
        }
    };

    return (
        <div className="wt-html-editor-page">
            <SEO
                title="HTML Online Editor Free - Real-time HTML/CSS/JS Editor | WebzenTools"
                description="Use our free online HTML editor to write and preview HTML, CSS, and JavaScript in real-time. Features live preview, download, and clean UI."
                keywords="html online editor, free html editor, real-time html preview, online code editor, web developer tools"
                url="https://www.webzentools.com/tools/html-editor"
            />

            <Container fluid className="wt-editor-container p-0">
                {/* Top Toolbar */}
                <div className="wt-editor-toolbar d-flex align-items-center justify-content-between px-4 py-2 border-bottom">
                    <div className="d-flex align-items-center gap-3">
                        <div className="wt-editor-logo">
                            <FaCode className="text-primary" size={24} />
                            <span className="ms-2 fw-bold text-dark d-none d-md-inline">WebzenTools Editor</span>
                        </div>
                        <ButtonGroup className="ms-md-4">
                            <Button
                                variant={viewMode === 'desktop' ? 'primary' : 'outline-primary'}
                                size="sm"
                                onClick={() => setViewMode('desktop')}
                                className="d-flex align-items-center gap-2"
                            >
                                <FaDesktop /> <span className="d-none d-lg-inline">Desktop</span>
                            </Button>
                            <Button
                                variant={viewMode === 'mobile' ? 'primary' : 'outline-primary'}
                                size="sm"
                                onClick={() => setViewMode('mobile')}
                                className="d-flex align-items-center gap-2"
                            >
                                <FaMobileAlt /> <span className="d-none d-lg-inline">Mobile</span>
                            </Button>
                        </ButtonGroup>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <Button variant="success" size="sm" onClick={runCode} className="d-flex align-items-center gap-2 px-3">
                            <FaPlay size={12} /> Run
                        </Button>
                        <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" size="sm" id="dropdown-basic">
                                Actions
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end" className="wt-editor-dropdown shadow">
                                <Dropdown.Item onClick={handleDownload} className="d-flex align-items-center gap-2">
                                    <FaDownload className="text-primary" /> Download HTML
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleCopy(html + '\n<style>\n' + css + '\n</style>\n<script>\n' + js + '\n</script>')} className="d-flex align-items-center gap-2">
                                    <FaCopy className="text-success" /> Copy All Code
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={handleClear} className="d-flex align-items-center gap-2 text-danger">
                                    <FaTrash /> Clear Everything
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

                {/* Main Workspace */}
                <div className="wt-editor-workspace">
                    <Row className="g-0 h-100">
                        {/* Editor Sidebar */}
                        <Col lg={6} className="wt-editor-pane border-end d-flex flex-column">
                            <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                                <Nav variant="tabs" className="wt-editor-tabs border-0 px-2 bg-light">
                                    <Nav.Item>
                                        <Nav.Link eventKey="html" className="d-flex align-items-center gap-2">
                                            <FaHtml5 className="text-danger" /> HTML
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="css" className="d-flex align-items-center gap-2">
                                            <FaCss3Alt className="text-primary" /> CSS
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="js" className="d-flex align-items-center gap-2">
                                            <FaJs className="text-warning" /> JavaScript
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content className="flex-grow-1 position-relative">
                                    <Tab.Pane eventKey="html" className="h-100">
                                        <textarea
                                            spellCheck="false"
                                            className="wt-code-textarea html-mode"
                                            value={html}
                                            onChange={(e) => setHtml(e.target.value)}
                                            placeholder="Write your HTML here..."
                                        />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="css" className="h-100">
                                        <textarea
                                            spellCheck="false"
                                            className="wt-code-textarea css-mode"
                                            value={css}
                                            onChange={(e) => setCss(e.target.value)}
                                            placeholder="Write your CSS here..."
                                        />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="js" className="h-100">
                                        <textarea
                                            spellCheck="false"
                                            className="wt-code-textarea js-mode"
                                            value={js}
                                            onChange={(e) => setJs(e.target.value)}
                                            placeholder="Write your JS here..."
                                        />
                                    </Tab.Pane>

                                    {/* Copy Feedback */}
                                    {copySuccess && (
                                        <div className="wt-copy-badge">
                                            {copySuccess}
                                        </div>
                                    )}
                                </Tab.Content>
                            </Tab.Container>
                        </Col>

                        {/* Preview Pane */}
                        <Col lg={6} className="wt-preview-pane bg-dark-subtle d-flex align-items-center justify-content-center p-3">
                            <div className={`wt-preview-frame shadow-lg ${viewMode}`}>
                                <div className="wt-preview-header d-flex align-items-center px-3 gap-2">
                                    <div className="dot red"></div>
                                    <div className="dot yellow"></div>
                                    <div className="dot green"></div>
                                    <div className="wt-url-bar ms-2 flex-grow-1 text-center small text-muted">
                                        live-preview.webzentools.com
                                    </div>
                                    <FaSyncAlt className="text-muted cursor-pointer" size={12} onClick={runCode} />
                                </div>
                                <iframe
                                    ref={iframeRef}
                                    srcDoc={srcDoc}
                                    title="Output Preview"
                                    sandbox="allow-scripts"
                                    frameBorder="0"
                                    width="100%"
                                    height="100%"
                                    className="wt-preview-iframe"
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>

            {/* Bottom Content for SEO */}
            <section className="wt-editor-info-section py-5 bg-white">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={9}>
                            <h2 className="display-6 fw-bold text-dark mb-4">Master the Web with Our <span className="text-primary">Free HTML Editor</span></h2>
                            <p className="lead text-muted mb-4">
                                WebzenTools provides a powerful, lightweight, and real-time online HTML editor for developers and students.
                                Whether you're learning the basics of web development or testing a quick component, our editor gives you
                                the perfect environment to experiment with HTML, CSS, and JavaScript.
                            </p>

                            <Row className="g-4 mt-2">
                                <Col md={6}>
                                    <div className="wt-info-card p-4 border rounded-4 h-100">
                                        <div className="wt-info-icon mb-3 text-primary">
                                            <FaEye size={32} />
                                        </div>
                                        <h4 className="fw-bold">Real-time Preview</h4>
                                        <p className="text-muted mb-0">See your changes instantly as you type. Our live preview engine handles HTML5, CSS3, and JavaScript modern syntax.</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="wt-info-card p-4 border rounded-4 h-100">
                                        <div className="wt-info-icon mb-3 text-success">
                                            <FaDownload size={32} />
                                        </div>
                                        <h4 className="fw-bold">Export & Download</h4>
                                        <p className="text-muted mb-0">Finished your masterpiece? Download a single, ready-to-use HTML file with all your CSS and JS bundled inside.</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="wt-info-card p-4 border rounded-4 h-100">
                                        <div className="wt-info-icon mb-3 text-warning">
                                            <FaFileCode size={32} />
                                        </div>
                                        <h4 className="fw-bold">Clean Code Environment</h4>
                                        <p className="text-muted mb-0">A distraction-free environment designed specifically for focus and rapid prototyping without heavy IDE overhead.</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="wt-info-card p-4 border rounded-4 h-100">
                                        <div className="wt-info-icon mb-3 text-danger">
                                            <FaTerminal size={32} />
                                        </div>
                                        <h4 className="fw-bold">JavaScript Support</h4>
                                        <p className="text-muted mb-0">Full support for client-side JavaScript. Test your event listeners, animations, and logic directly in the browser.</p>
                                    </div>
                                </Col>
                            </Row>

                            <div className="mt-5 p-4 bg-light rounded-4">
                                <h3 className="h4 fw-bold mb-3">Why use an Online HTML Editor?</h3>
                                <p className="text-muted">
                                    Setting up a local development environment can be time-consuming for small tasks. An online editor like
                                    WebzenTools allows you to jump straight into coding from any device. It's perfect for classroom demonstrations,
                                    quick bug fixes, and sharing code snippets with colleagues. Plus, with our integrated SEO features, your
                                    learning journey is always optimized for the modern web.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default HTMLEditor;
