import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge, Dropdown } from 'react-bootstrap';
import { 
    FaReact, FaPlay, FaDownload, FaCopy, FaTrash, 
    FaSyncAlt, FaDesktop, FaMobileAlt, FaCode,
    FaBoxOpen, FaLayerGroup, FaMagic
} from 'react-icons/fa';
import SEO from '../../../../components/SEO';
import "./ReactJSXEditor.css";

const defaultCode = `function App() {
  const [count, setCount] = React.useState(0);
  
  return (
    <div style={{ 
      fontFamily: 'Inter, sans-serif',
      padding: '40px',
      textAlign: 'center',
      background: '#f0f9ff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ color: '#0ea5e9', fontSize: '3rem', marginBottom: '1rem' }}>
        React JSX Editor
      </h1>
      <p style={{ color: '#64748b', fontSize: '1.2rem', marginBottom: '2rem' }}>
        Live preview your components instantly!
      </p>
      
      <div style={{ 
        background: 'white',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 10px 25px rgba(14, 165, 233, 0.1)'
      }}>
        <h2 style={{ fontSize: '4rem', margin: '0 0 20px 0' }}>{count}</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setCount(count - 1)}
            style={{
              padding: '10px 25px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            Decrease
          </button>
          <button 
            onClick={() => setCount(count + 1)}
            style={{
              padding: '10px 25px',
              borderRadius: '10px',
              border: 'none',
              background: '#0ea5e9',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Increase
          </button>
        </div>
      </div>
    </div>
  );
}

// Render the component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`;

const ReactJSXEditor = () => {
    const [code, setCode] = useState(defaultCode);
    const [viewMode, setViewMode] = useState('desktop');
    const [srcDoc, setSrcDoc] = useState('');
    const [copySuccess, setCopySuccess] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSrcDoc(`
                <!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="UTF-8" />
                        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
                        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                        <style>
                            body { margin: 0; padding: 0; }
                            #root { width: 100%; height: 100vh; }
                        </style>
                    </head>
                    <body>
                        <div id="root"></div>
                        <script type="text/babel">
                            ${code}
                        </script>
                    </body>
                </html>
            `);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [code]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopySuccess('JSX Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([code], { type: 'text/jsx' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Component.jsx';
        a.click();
        URL.revokeObjectURL(url);
    };

    const resetCode = () => {
        if(window.confirm('Reset to default code?')) setCode(defaultCode);
    };

    return (
        <div className="wt-react-editor-page">
            <SEO 
                title="React JSX Online Editor Free - Live React Playground | WebzenTools"
                description="Write and preview React components instantly in your browser. Features live rendering, Babel compilation, and premium UI."
                keywords="react editor, online jsx editor, free react playground, live react preview, jsx compiler online"
                url="https://www.webzentools.com/tools/react-jsx-editor"
            />

            <Container fluid className="wt-editor-container p-0">
                {/* Navbar Toolbar */}
                <div className="wt-editor-toolbar d-flex align-items-center justify-content-between px-4 py-2 border-bottom bg-white shadow-sm">
                    <div className="d-flex align-items-center gap-3">
                        <div className="wt-editor-logo">
                            <FaReact className="text-info spin-icon" size={28} />
                            <span className="ms-2 fw-bold text-dark d-none d-md-inline">React Studio</span>
                        </div>
                        <Badge bg="info" className="d-none d-lg-inline-block">React 18.x</Badge>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <Button variant="outline-danger" size="sm" onClick={() => setCode('')} title="Clear Code">
                            <FaTrash />
                        </Button>
                        <Button variant="outline-secondary" size="sm" onClick={resetCode} title="Reset Code">
                            <FaSyncAlt />
                        </Button>
                        <Button variant="outline-primary" size="sm" onClick={handleCopy}>
                            <FaCopy /> <span className="d-none d-md-inline">Copy JSX</span>
                        </Button>
                        <Button variant="info" size="sm" onClick={handleDownload} className="text-white fw-bold d-flex align-items-center gap-2">
                            <FaDownload size={12} /> <span className="d-none d-md-inline">Export</span>
                        </Button>
                    </div>
                </div>

                {/* Workspace Grid */}
                <div className="wt-editor-workspace">
                    <Row className="g-0 h-100">
                        {/* Editor Side */}
                        <Col lg={6} className="wt-editor-pane border-end position-relative">
                            <div className="wt-pane-header bg-light px-3 py-2 border-bottom d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2 small fw-bold text-muted">
                                    <FaCode className="text-info" /> Component.jsx
                                </div>
                                <div className="d-flex gap-2">
                                    <Button variant={viewMode === 'desktop' ? 'info' : 'outline-info'} size="xs" onClick={() => setViewMode('desktop')} className="px-2 py-0 btn-xs text-white-on-active">
                                        <FaDesktop size={10} />
                                    </Button>
                                    <Button variant={viewMode === 'mobile' ? 'info' : 'outline-info'} size="xs" onClick={() => setViewMode('mobile')} className="px-2 py-0 btn-xs text-white-on-active">
                                        <FaMobileAlt size={10} />
                                    </Button>
                                </div>
                            </div>
                            <textarea 
                                spellCheck="false"
                                className="wt-jsx-textarea"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="// Write your React component here..."
                            />
                            {copySuccess && <div className="wt-jsx-copy-toast">{copySuccess}</div>}
                        </Col>

                        {/* Preview Side */}
                        <Col lg={6} className="wt-preview-pane bg-dark-subtle d-flex align-items-center justify-content-center p-3 overflow-auto">
                            <div className={`wt-react-preview-frame shadow-2xl ${viewMode}`}>
                                <div className="wt-preview-top-bar d-flex align-items-center px-3 gap-2">
                                    <div className="browser-dots d-flex gap-1">
                                        <span className="dot bg-danger"></span>
                                        <span className="dot bg-warning"></span>
                                        <span className="dot bg-success"></span>
                                    </div>
                                    <div className="preview-url-bar flex-grow-1 text-center small text-muted">react-app.webzentools.io</div>
                                    <FaSyncAlt className="text-muted small" />
                                </div>
                                <iframe 
                                    srcDoc={srcDoc}
                                    title="React Preview"
                                    sandbox="allow-scripts"
                                    frameBorder="0"
                                    width="100%"
                                    height="100%"
                                    className="wt-react-iframe"
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>

            {/* Feature Section */}
            <section className="wt-react-features py-5 bg-white border-top">
                <Container>
                    <Row className="justify-content-center text-center mb-5">
                        <Col lg={8}>
                            <h2 className="display-6 fw-bold">Professional <span className="text-info">React Playground</span></h2>
                            <p className="lead text-muted">The ultimate tool for testing components, learning React hooks, and rapid prototyping without any local setup.</p>
                        </Col>
                    </Row>

                    <Row className="g-4">
                        <Col md={4}>
                            <div className="wt-react-feature-card p-4 text-center border rounded-4 h-100">
                                <div className="feature-icon-wrap bg-info-subtle text-info mb-3">
                                    <FaBoxOpen size={24} />
                                </div>
                                <h5 className="fw-bold">No-Setup Required</h5>
                                <p className="text-muted small">Forget npm install or create-react-app. Just open your browser and start writing React 18+ components instantly.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="wt-react-feature-card p-4 text-center border rounded-4 h-100">
                                <div className="feature-icon-wrap bg-primary-subtle text-primary mb-3">
                                    <FaLayerGroup size={24} />
                                </div>
                                <h5 className="fw-bold">Live Babel Compiling</h5>
                                <p className="text-muted small">Our editor uses Babel to compile your JSX into standard JavaScript in real-time, giving you instant visual feedback.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="wt-react-feature-card p-4 text-center border rounded-4 h-100">
                                <div className="feature-icon-wrap bg-warning-subtle text-warning mb-3">
                                    <FaMagic size={24} />
                                </div>
                                <h5 className="fw-bold">Modern React API</h5>
                                <p className="text-muted small">Fully supports the latest React features including Hooks (useState, useEffect), Functional Components, and the new Root API.</p>
                            </div>
                        </Col>
                    </Row>
                    
                    <div className="mt-5 p-5 bg-info rounded-5 text-white shadow-lg overflow-hidden position-relative">
                        <div className="row align-items-center">
                            <Col lg={8}>
                                <h3 className="fw-bold">Master React Development</h3>
                                <p className="opacity-90">
                                    Our playground is designed for developers of all levels. Whether you're debugging 
                                    a complex state issue or learning your first hook, the Webzen React Editor 
                                    provides the stability and speed you need.
                                </p>
                                <Button variant="light" className="text-info fw-bold mt-3 px-4 rounded-pill">Start Coding Now</Button>
                            </Col>
                            <Col lg={4} className="d-none d-lg-block text-end">
                                <FaReact size={160} className="opacity-20 spin-icon" />
                            </Col>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
};

export default ReactJSXEditor;
