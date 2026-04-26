import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Badge, Spinner, Nav } from 'react-bootstrap';
import { 
    FaNodeJs, FaPlay, FaTrash, FaCopy, FaDownload, 
    FaTerminal, FaBug, FaFileCode, FaMagic, FaSyncAlt,
    FaHdd, FaMicrochip, FaBoxOpen
} from 'react-icons/fa';
import SEO from '../../../../components/SEO';
import "./NodeJsEditor.css";

const nodeTemplates = {
    basic: `// Welcome to Webzen Node.js Studio
// Testing basic process and console

console.log("Starting Node.js environment...");

const platform = process.platform;
const arch = process.arch;

console.log(\`Platform: \${platform}\`);
console.log(\`Architecture: \${arch}\`);

const numbers = [10, 20, 30, 40];
const sum = numbers.reduce((a, b) => a + b, 0);

console.log("Sum of numbers:", sum);`,
    modules: `// Simulating CommonJS Modules
const math = {
    add: (a, b) => a + b,
    multiply: (a, b) => a * b
};

console.log("Testing Module Export Logic...");
console.log("Add (5 + 10):", math.add(5, 10));
console.log("Multiply (4 * 4):", math.multiply(4, 4));

module.exports = math;
console.log("Module exported successfully.");`,
    fs: `// Simulating File System (fs)
const fs = {
    readFileSync: (path) => \`Content of \${path}: { "name": "WebzenTools", "version": "1.0.0" }\`,
    writeFileSync: (path, data) => console.log(\`Successfully wrote to \${path}\`)
};

console.log("Reading config file...");
const config = fs.readFileSync('./package.json');
console.log(config);

fs.writeFileSync('./logs.txt', 'System healthy');`
};

const NodeJsEditor = () => {
    const [code, setCode] = useState(nodeTemplates.basic);
    const [logs, setLogs] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');
    const [activeTab, setActiveTab] = useState('basic');
    const consoleEndRef = useRef(null);

    useEffect(() => {
        consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const runCode = () => {
        setIsRunning(true);
        setLogs([]);
        const tempLogs = [];

        // Mock Node.js Globals
        const process = {
            platform: 'browser-wasm',
            arch: 'x64',
            version: 'v20.11.0',
            env: { NODE_ENV: 'production' }
        };

        const module = { exports: {} };

        // Override console.log
        const originalLog = console.log;
        console.log = (...args) => {
            const output = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ');
            tempLogs.push({ type: 'log', content: output, time: new Date().toLocaleTimeString() });
            originalLog(...args);
        };

        try {
            // Execute the code with Node context
            // eslint-disable-next-line no-new-func
            const executeCode = new Function('process', 'module', 'exports', code);
            executeCode(process, module, module.exports);
            setLogs([...tempLogs, { type: 'success', content: '>>> Process exited with code 0', time: new Date().toLocaleTimeString() }]);
        } catch (err) {
            setLogs([...tempLogs, { type: 'error', content: err.message, time: new Date().toLocaleTimeString() }]);
        } finally {
            console.log = originalLog;
            setIsRunning(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopySuccess('Node.js Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([code], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'app.js';
        a.click();
        URL.revokeObjectURL(url);
    };

    const switchTemplate = (key) => {
        setActiveTab(key);
        setCode(nodeTemplates[key]);
    };

    return (
        <div className="wt-node-page">
            <SEO 
                title="Node.js Online Editor Free - Node Playground | WebzenTools"
                description="Execute Node.js code online with our free premium editor. Features real-time output console, module system simulation, and code export."
                keywords="nodejs editor, online nodejs compiler, node playground, free node tool, nodejs playground"
                url="https://www.webzentools.com/tools/nodejs-editor"
            />

            <Container fluid className="wt-editor-container p-0">
                {/* Premium Header */}
                <div className="wt-editor-toolbar d-flex align-items-center justify-content-between px-4 py-2 border-bottom bg-white shadow-sm">
                    <div className="d-flex align-items-center gap-3">
                        <div className="wt-editor-logo">
                            <FaNodeJs className="text-success" size={32} />
                            <span className="ms-1 fw-bold text-dark d-none d-md-inline">Node.js Runtime</span>
                        </div>
                        <Nav variant="pills" className="wt-node-pills">
                            <Nav.Item>
                                <Nav.Link active={activeTab === 'basic'} onClick={() => switchTemplate('basic')}>Process</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link active={activeTab === 'modules'} onClick={() => switchTemplate('modules')}>Modules</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link active={activeTab === 'fs'} onClick={() => switchTemplate('fs')}>File System</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <Button variant="outline-secondary" size="sm" onClick={() => setCode('')} title="Clear">
                            <FaTrash />
                        </Button>
                        <Button variant="outline-primary" size="sm" onClick={handleCopy}>
                            <FaCopy /> <span className="d-none d-md-inline">Copy Script</span>
                        </Button>
                        <Button 
                            variant="success" 
                            size="sm" 
                            onClick={runCode} 
                            disabled={isRunning}
                            className="d-flex align-items-center gap-2 px-4 fw-bold shadow-sm"
                        >
                            {isRunning ? <FaSyncAlt className="spin" /> : <FaPlay size={12} />}
                            {isRunning ? 'EXECUTING...' : 'RUN SCRIPT'}
                        </Button>
                        <Button variant="dark" size="sm" onClick={handleDownload}>
                            <FaDownload />
                        </Button>
                    </div>
                </div>

                {/* Workspace Split */}
                <div className="wt-editor-workspace">
                    <Row className="g-0 h-100">
                        {/* Editor Side */}
                        <Col lg={7} className="wt-editor-pane border-end position-relative">
                            <div className="wt-pane-header bg-light px-3 py-2 border-bottom d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2 small fw-bold text-muted">
                                    <FaFileCode className="text-success" /> server.js
                                </div>
                                <Badge bg="success-subtle" className="text-success border border-success-subtle">LTS v20.x</Badge>
                            </div>
                            <textarea 
                                spellCheck="false"
                                className="wt-node-textarea"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="// Start writing Node.js code..."
                            />
                            {copySuccess && <div className="wt-node-toast">{copySuccess}</div>}
                        </Col>

                        {/* Console Side */}
                        <Col lg={5} className="wt-node-console bg-dark d-flex flex-column">
                            <div className="wt-console-header px-3 py-2 d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2 small fw-bold text-white-50">
                                    <FaTerminal /> NODE CONSOLE
                                </div>
                                <Button variant="link" size="sm" className="text-white-50 p-0 text-decoration-none small" onClick={() => setLogs([])}>
                                    Clear
                                </Button>
                            </div>
                            <div className="wt-console-body flex-grow-1 p-3">
                                {logs.length === 0 ? (
                                    <div className="text-center text-muted mt-5 opacity-50">
                                        <FaNodeJs size={50} className="mb-3" />
                                        <p>Output will appear here after execution.</p>
                                    </div>
                                ) : (
                                    logs.map((log, idx) => (
                                        <div key={idx} className={`wt-node-log-line ${log.type}`}>
                                            <span className="log-time">[{log.time}]</span>
                                            <pre className="log-text">{log.content}</pre>
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
            <section className="wt-node-info py-5 bg-white border-top">
                <Container>
                    <Row className="justify-content-center text-center mb-5">
                        <Col lg={9}>
                            <h2 className="display-6 fw-bold">The Ultimate <span className="text-success">Node.js</span> Playground</h2>
                            <p className="lead text-muted">A premium cloud-based environment to master Node.js backend development. Test modules, process logic, and algorithms instantly.</p>
                        </Col>
                    </Row>

                    <Row className="g-4 text-center">
                        <Col md={4}>
                            <div className="wt-node-feature-card p-4 h-100 border rounded-4 shadow-sm">
                                <div className="feature-icon bg-success-subtle text-success mb-3">
                                    <FaMicrochip size={24} />
                                </div>
                                <h5 className="fw-bold">Process Logic</h5>
                                <p className="text-muted small">Experiment with the `process` object to understand system architecture, platform specifics, and environment variables.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="wt-node-feature-card p-4 h-100 border rounded-4 shadow-sm">
                                <div className="feature-icon bg-primary-subtle text-primary mb-3">
                                    <FaBoxOpen size={24} />
                                </div>
                                <h5 className="fw-bold">Module System</h5>
                                <p className="text-muted small">Learn the foundations of CommonJS and ESM by prototyping export/import logic within our simulated runtime.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="wt-node-feature-card p-4 h-100 border rounded-4 shadow-sm">
                                <div className="feature-icon bg-warning-subtle text-warning mb-3">
                                    <FaHdd size={24} />
                                </div>
                                <h5 className="fw-bold">Virtual FS</h5>
                                <p className="text-muted small">Test File System interactions with our simulated `fs` module, designed for safe and educational backend prototyping.</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default NodeJsEditor;
