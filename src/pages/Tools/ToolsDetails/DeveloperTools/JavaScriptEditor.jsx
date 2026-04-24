import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { 
    FaJs, FaPlay, FaTrash, FaCopy, FaDownload, 
    FaTerminal, FaBug, FaInfoCircle, FaCheckCircle, FaExclamationTriangle
} from 'react-icons/fa';
import SEO from '../../../../components/SEO';
import "./JavaScriptEditor.css";

const JavaScriptEditor = () => {
    const [code, setCode] = useState(`// Welcome to WebzenTools JS Editor
// Try running this example:

const greeting = "Hello, WebzenTools!";
const tools = ["HTML Editor", "CSS Editor", "JS Editor"];

console.log(greeting);
console.log("Available tools:", tools.length);

tools.forEach((tool, index) => {
  console.log(\`\${index + 1}. \${tool}\`);
});

// Test an object
const user = {
  name: "Developer",
  status: "Active",
  coding: true
};
console.log("User Info:", user);`);

    const [logs, setLogs] = useState([]);
    const [copySuccess, setCopySuccess] = useState('');
    const consoleEndRef = useRef(null);

    const scrollToBottom = () => {
        consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [logs]);

    const runCode = () => {
        setLogs([]); // Clear previous logs
        const newLogs = [];

        // Custom console.log to capture output
        const originalLog = console.log;
        console.log = (...args) => {
            const formattedArgs = args.map(arg => {
                if (typeof arg === 'object') return JSON.stringify(arg, null, 2);
                return String(arg);
            }).join(' ');
            newLogs.push({ type: 'log', content: formattedArgs, time: new Date().toLocaleTimeString() });
            originalLog(...args);
        };

        try {
            // eslint-disable-next-line no-eval
            eval(code);
            setLogs([...newLogs]);
        } catch (error) {
            setLogs([...newLogs, { type: 'error', content: error.message, time: new Date().toLocaleTimeString() }]);
        } finally {
            console.log = originalLog; // Restore original console.log
        }
    };

    const clearConsole = () => setLogs([]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopySuccess('JS Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([code], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'script.js';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="wt-js-editor-page">
            <SEO 
                title="JavaScript Online Editor Free - JS Console & Playground | WebzenTools"
                description="Run and debug JavaScript code online with our free JS editor. Features real-time console output, syntax-ready UI, and code export."
                keywords="javascript editor, online js editor, free js tool, javascript playground, js console online"
                url="https://www.webzentools.com/tools/javascript-editor"
            />

            <Container fluid className="wt-editor-container p-0">
                {/* Header Toolbar */}
                <div className="wt-editor-toolbar d-flex align-items-center justify-content-between px-4 py-2 border-bottom bg-white shadow-sm">
                    <div className="d-flex align-items-center gap-3">
                        <div className="wt-editor-logo">
                            <FaJs className="text-warning" size={28} />
                            <span className="ms-2 fw-bold text-dark d-none d-md-inline">JS Console Pro</span>
                        </div>
                        <Badge bg="warning" text="dark" className="d-none d-lg-inline-block">ES6+ Support</Badge>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <Button variant="outline-secondary" size="sm" onClick={() => setCode('')} className="d-none d-md-block">
                            <FaTrash />
                        </Button>
                        <Button variant="outline-primary" size="sm" onClick={handleCopy}>
                            <FaCopy /> <span className="d-none d-md-inline">Copy JS</span>
                        </Button>
                        <Button variant="outline-success" size="sm" onClick={handleDownload}>
                            <FaDownload /> <span className="d-none d-md-inline">Download</span>
                        </Button>
                        <Button variant="warning" size="sm" onClick={runCode} className="d-flex align-items-center gap-2 px-3 fw-bold">
                            <FaPlay size={12} /> RUN CODE
                        </Button>
                    </div>
                </div>

                {/* Editor Workspace */}
                <div className="wt-editor-workspace">
                    <Row className="g-0 h-100">
                        {/* JS Input Pane */}
                        <Col lg={7} className="wt-editor-pane border-end position-relative">
                            <div className="wt-pane-header px-3 py-2 bg-light border-bottom d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2 small fw-bold text-muted">
                                    <FaJs className="text-warning" /> script.js
                                </div>
                            </div>
                            <textarea 
                                spellCheck="false"
                                className="wt-js-textarea"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="// Write your JavaScript code here..."
                            />
                            {copySuccess && <div className="wt-js-copy-toast">{copySuccess}</div>}
                        </Col>

                        {/* Console Output Pane */}
                        <Col lg={5} className="wt-console-pane bg-dark d-flex flex-column">
                            <div className="wt-console-header px-3 py-2 d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2 small fw-bold text-light opacity-75">
                                    <FaTerminal /> CONSOLE OUTPUT
                                </div>
                                <Button variant="link" size="sm" className="text-light opacity-50 p-0 text-decoration-none" onClick={clearConsole}>
                                    Clear Console
                                </Button>
                            </div>
                            <div className="wt-console-output flex-grow-1 p-3">
                                {logs.length === 0 ? (
                                    <div className="text-center text-muted mt-5 opacity-50">
                                        <FaBug size={48} className="mb-3" />
                                        <p>No output yet. Click "RUN CODE" to see results.</p>
                                    </div>
                                ) : (
                                    logs.map((log, index) => (
                                        <div key={index} className={`wt-console-line ${log.type}`}>
                                            <span className="log-time">[{log.time}]</span>
                                            <span className="log-icon">
                                                {log.type === 'error' ? <FaExclamationTriangle /> : <FaInfoCircle />}
                                            </span>
                                            <pre className="log-content">{log.content}</pre>
                                        </div>
                                    ))
                                )}
                                <div ref={consoleEndRef} />
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>

            {/* Info Section */}
            <section className="wt-js-info-section py-5 bg-white">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={10}>
                            <div className="text-center mb-5">
                                <h2 className="display-6 fw-bold">Professional <span className="text-warning">JavaScript</span> Environment</h2>
                                <p className="text-muted lead">The fastest way to test code snippets, debug logic, and learn JavaScript directly in your browser.</p>
                            </div>

                            <Row className="g-4">
                                <Col md={6}>
                                    <div className="wt-js-card p-4 border rounded-4">
                                        <div className="wt-js-icon mb-3 text-warning">
                                            <FaCheckCircle size={32} />
                                        </div>
                                        <h4 className="fw-bold">Virtual Console</h4>
                                        <p className="text-muted">A dedicated terminal-style output window that captures all your console.log calls and formats complex objects for readability.</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="wt-js-card p-4 border rounded-4">
                                        <div className="wt-js-icon mb-3 text-danger">
                                            <FaBug size={32} />
                                        </div>
                                        <h4 className="fw-bold">Real-time Debugging</h4>
                                        <p className="text-muted">Catch syntax and runtime errors instantly. The editor provides clear error messages to help you fix bugs faster.</p>
                                    </div>
                                </Col>
                            </Row>

                            <div className="mt-5 p-4 bg-light rounded-4 border-start border-warning border-5">
                                <h3 className="h4 fw-bold mb-3">Why use our JS Playground?</h3>
                                <p className="text-muted mb-0">
                                    Our JavaScript Online Editor is optimized for performance and ease of use. It's the perfect tool for 
                                    interview preparation, testing small algorithms, or quickly verifying how a specific JS method 
                                    behaves without needing to open your browser's dev tools or create a local file.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default JavaScriptEditor;
