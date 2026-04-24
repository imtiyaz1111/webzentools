import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import { 
    FaCss3Alt, FaDownload, FaCopy, FaTrash, 
    FaPlay, FaSyncAlt, FaDesktop, FaMobileAlt,
    FaMagic, FaEye
} from 'react-icons/fa';
import SEO from '../../../../components/SEO';
import "./CSSEditor.css";

const templates = {
    card: {
        name: 'Product Card',
        html: `
<div class="card-container">
  <div class="card">
    <div class="card-image"></div>
    <div class="card-content">
      <span class="category">Technology</span>
      <h2>Webzen Editor</h2>
      <p>The ultimate CSS playground for modern developers. Build faster, design better.</p>
      <div class="card-footer">
        <span class="price">$29.99</span>
        <button class="buy-btn">Add to Cart</button>
      </div>
    </div>
  </div>
</div>`
    },
    button: {
        name: 'Animated Buttons',
        html: `
<div class="button-grid">
  <button class="btn btn-primary">Primary Action</button>
  <button class="btn btn-secondary">Secondary</button>
  <button class="btn btn-outline">Outline Effect</button>
  <button class="btn btn-ghost">Ghost Mode</button>
</div>`
    },
    profile: {
        name: 'User Profile',
        html: `
<div class="profile-card">
  <div class="profile-header"></div>
  <div class="profile-body">
    <div class="avatar"></div>
    <h3>Alex Rivers</h3>
    <p class="title">Frontend Architect</p>
    <div class="stats">
      <div><strong>12k</strong><span>Followers</span></div>
      <div><strong>450</strong><span>Projects</span></div>
    </div>
    <button class="follow-btn">Follow</button>
  </div>
</div>`
    }
};

const CSSEditor = () => {
    const [css, setCss] = useState(`/* Start styling your template! */
:root {
  --primary: #3b82f6;
  --bg: #f8fafc;
}

body {
  background: var(--bg);
  font-family: 'Inter', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
}

.card {
  background: white;
  width: 350px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-10px);
}

.card-image {
  height: 200px;
  background: linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%);
}

.card-content {
  padding: 24px;
}

.category {
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

h2 {
  margin: 10px 0;
  font-size: 1.5rem;
}

p {
  color: #64748b;
  line-height: 1.6;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.price {
  font-size: 1.25rem;
  font-weight: 800;
}

.buy-btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}`);
    const [activeTemplate, setActiveTemplate] = useState('card');
    const [viewMode, setViewMode] = useState('desktop');
    const [srcDoc, setSrcDoc] = useState('');
    const [copySuccess, setCopySuccess] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSrcDoc(`
                <html>
                    <head>
                        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
                        <style>${css}</style>
                    </head>
                    <body>${templates[activeTemplate].html}</body>
                </html>
            `);
        }, 500);

        return () => clearTimeout(timeout);
    }, [css, activeTemplate]);

    const handleCopy = () => {
        navigator.clipboard.writeText(css);
        setCopySuccess('CSS Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([css], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'style.css';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleClear = () => {
        if(window.confirm('Clear all CSS?')) setCss('');
    };

    return (
        <div className="wt-css-editor-page">
            <SEO 
                title="CSS Online Editor Free - Real-time CSS Playground | WebzenTools"
                description="Experiment with CSS styles in real-time. Use our premium CSS editor with live preview, pre-built templates, and instant CSS export."
                keywords="css editor, online css playground, free css tool, css live preview, web design tools"
                url="https://www.webzentools.com/tools/css-editor"
            />

            <Container fluid className="wt-editor-container p-0">
                {/* Header Toolbar */}
                <div className="wt-editor-toolbar d-flex align-items-center justify-content-between px-4 py-2 border-bottom bg-white">
                    <div className="d-flex align-items-center gap-3">
                        <div className="wt-editor-logo">
                            <FaCss3Alt className="text-primary" size={24} />
                            <span className="ms-2 fw-bold text-dark d-none d-md-inline">CSS Stylist</span>
                        </div>
                        
                        <Dropdown>
                            <Dropdown.Toggle variant="light" size="sm" className="border d-flex align-items-center gap-2">
                                <FaMagic /> {templates[activeTemplate].name}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="shadow border-0">
                                {Object.keys(templates).map(key => (
                                    <Dropdown.Item 
                                        key={key} 
                                        onClick={() => setActiveTemplate(key)}
                                        active={activeTemplate === key}
                                    >
                                        {templates[key].name}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>

                        <ButtonGroup>
                            <Button 
                                variant={viewMode === 'desktop' ? 'primary' : 'outline-primary'} 
                                size="sm" onClick={() => setViewMode('desktop')}
                            >
                                <FaDesktop />
                            </Button>
                            <Button 
                                variant={viewMode === 'mobile' ? 'primary' : 'outline-primary'} 
                                size="sm" onClick={() => setViewMode('mobile')}
                            >
                                <FaMobileAlt />
                            </Button>
                        </ButtonGroup>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <Button variant="outline-secondary" size="sm" onClick={handleClear} className="d-none d-md-block">
                            <FaTrash />
                        </Button>
                        <Button variant="outline-primary" size="sm" onClick={handleCopy}>
                            <FaCopy /> <span className="d-none d-lg-inline">Copy CSS</span>
                        </Button>
                        <Button variant="success" size="sm" onClick={handleDownload} className="d-flex align-items-center gap-2">
                            <FaDownload size={12} /> <span className="d-none d-md-inline">Download</span>
                        </Button>
                    </div>
                </div>

                {/* Main Body */}
                <div className="wt-editor-workspace">
                    <Row className="g-0 h-100">
                        {/* CSS Input Area */}
                        <Col lg={5} className="wt-editor-pane border-end position-relative">
                            <div className="wt-pane-label d-flex align-items-center gap-2 px-3 py-2 bg-light border-bottom">
                                <FaCss3Alt className="text-primary" /> <span className="small fw-bold">style.css</span>
                            </div>
                            <textarea 
                                spellCheck="false"
                                className="wt-css-textarea"
                                value={css}
                                onChange={(e) => setCss(e.target.value)}
                                placeholder="Write your CSS here..."
                            />
                            {copySuccess && <div className="wt-copy-toast">{copySuccess}</div>}
                        </Col>

                        {/* Preview Area */}
                        <Col lg={7} className="wt-preview-pane bg-light-subtle p-4 d-flex align-items-center justify-content-center">
                            <div className={`wt-preview-frame shadow-xl ${viewMode}`}>
                                <div className="wt-browser-head d-flex align-items-center px-3 gap-2">
                                    <div className="dots d-flex gap-1">
                                        <span style={{background:'#ff5f56'}}></span>
                                        <span style={{background:'#ffbd2e'}}></span>
                                        <span style={{background:'#27c93f'}}></span>
                                    </div>
                                    <div className="wt-search-bar ms-2 flex-grow-1">preview.local</div>
                                    <FaSyncAlt className="text-muted small" />
                                </div>
                                <iframe 
                                    srcDoc={srcDoc}
                                    title="CSS Preview"
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

            {/* SEO Content Section */}
            <section className="wt-css-info-section py-5 bg-white border-top">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={10}>
                            <div className="text-center mb-5">
                                <h2 className="display-5 fw-bold text-dark">The Ultimate <span className="text-primary">CSS Playground</span></h2>
                                <p className="lead text-muted">A premium, real-time CSS editor built for designers who want to visualize their styles instantly.</p>
                            </div>

                            <Row className="g-4">
                                <Col md={4}>
                                    <div className="wt-feature-box text-center p-4 h-100">
                                        <div className="icon-wrap bg-primary-subtle text-primary mb-3">
                                            <FaEye size={24} />
                                        </div>
                                        <h5 className="fw-bold">Visual Templates</h5>
                                        <p className="text-muted small">Don't start from scratch. Choose from professional UI components and style them your way.</p>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="wt-feature-box text-center p-4 h-100">
                                        <div className="icon-wrap bg-success-subtle text-success mb-3">
                                            <FaSyncAlt size={24} />
                                        </div>
                                        <h5 className="fw-bold">Instant Sync</h5>
                                        <p className="text-muted small">Every character you type is reflected instantly. No more refreshing to see minor color changes.</p>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="wt-feature-box text-center p-4 h-100">
                                        <div className="icon-wrap bg-info-subtle text-info mb-3">
                                            <FaDownload size={24} />
                                        </div>
                                        <h5 className="fw-bold">Clean Exports</h5>
                                        <p className="text-muted small">Get production-ready CSS files with a single click. Ready to be dropped into your project.</p>
                                    </div>
                                </Col>
                            </Row>

                            <div className="mt-5 p-5 bg-dark rounded-5 text-white overflow-hidden position-relative">
                                <div className="row align-items-center">
                                    <Col lg={7}>
                                        <h3 className="fw-bold mb-3">Master modern CSS Layouts</h3>
                                        <p className="opacity-75">
                                            Flexbox, CSS Grid, Custom Variables—test it all in our secure playground. 
                                            Our editor supports the latest CSS3 features, giving you the freedom to 
                                            push the boundaries of modern web design.
                                        </p>
                                        <ul className="list-unstyled mt-4 d-flex flex-wrap gap-3">
                                            <li className="d-flex align-items-center gap-2"><div className="dot bg-success"></div> Flexbox</li>
                                            <li className="d-flex align-items-center gap-2"><div className="dot bg-info"></div> CSS Grid</li>
                                            <li className="d-flex align-items-center gap-2"><div className="dot bg-warning"></div> Animations</li>
                                            <li className="d-flex align-items-center gap-2"><div className="dot bg-danger"></div> Variables</li>
                                        </ul>
                                    </Col>
                                    <Col lg={5} className="d-none d-lg-block text-end">
                                        <FaCss3Alt size={180} className="opacity-10" />
                                    </Col>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default CSSEditor;
