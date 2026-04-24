import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { 
    FaTerminal, FaPlay, FaTrash, FaCopy, FaDownload, 
    FaCode, FaBug, FaCheckCircle, FaInfoCircle, FaExclamationTriangle,
    FaBox, FaLightbulb
} from 'react-icons/fa';
import { SiTypescript } from 'react-icons/si';
import SEO from '../../../../components/SEO';
import "./TypeScriptEditor.css";

const defaultTSCode = `// TypeScript Playground
// Strong typing in your browser!

interface User {
  id: number;
  name: string;
  role: 'Admin' | 'User';
}

const welcome = (user: User): string => {
  return \`Welcome \${user.name}! Your ID is \${user.id}.\`;
};

const currentUser: User = {
  id: 101,
  name: "Webzen Dev",
  role: "Admin"
};

console.log(welcome(currentUser));

// Generic function example
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const numbers = [10, 20, 30];
console.log("First Number:", getFirst(numbers));`;

const TypeScriptEditor = () => {
    const [code, setCode] = useState(defaultTSCode);
    const [logs, setLogs] = useState([]);
    const [copySuccess, setCopySuccess] = useState('');
    const [isCompiling, setIsCompiling] = useState(false);
    const consoleEndRef = useRef(null);

    const scrollToBottom = () => {
        consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [logs]);

    const runTSCode = async () => {
        setIsCompiling(true);
        setLogs([]);
        const tempLogs = [];

        // Override console.log
        const originalLog = console.log;
        console.log = (...args) => {
            const output = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ');
            tempLogs.push({ type: 'log', content: output, time: new Date().toLocaleTimeString() });
            originalLog(...args);
        };

        try {
            // Load Babel if not already loaded (for TS transpilation)
            if (!window.Babel) {
                const script = document.createElement('script');
                script.src = "https://unpkg.com/@babel/standalone/babel.min.js";
                document.head.appendChild(script);
                await new Promise(resolve => script.onload = resolve);
            }

            // Transpile TS to JS
            const result = window.Babel.transform(code, {
                presets: ['typescript']
            }).code;

            // Execute the compiled JS
            // eslint-disable-next-line no-eval
            eval(result);
            setLogs([...tempLogs]);
        } catch (err) {
            setLogs([...tempLogs, { type: 'error', content: err.message, time: new Date().toLocaleTimeString() }]);
        } finally {
            console.log = originalLog;
            setIsCompiling(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopySuccess('TS Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([code], { type: 'application/typescript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'main.ts';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="wt-ts-editor-page">
            <SEO 
                title="TypeScript Online Editor Free - TS Playground & Compiler | WebzenTools"
                description="Compile and run TypeScript code online with our free TS editor. Features real-time type checking simulation, console output, and premium UI."
                keywords="typescript editor, online ts editor, free ts tool, typescript playground, ts compiler online"
                url="https://www.webzentools.com/tools/typescript-editor"
            />

            <Container fluid className="wt-editor-container p-0">
                {/* Modern Toolbar */}
                <div className="wt-editor-toolbar d-flex align-items-center justify-content-between px-4 py-2 border-bottom bg-white">
                    <div className="d-flex align-items-center gap-3">
                        <div className="wt-editor-logo">
                            <SiTypescript className="text-primary rounded-1" size={28} />
                            <span className="ms-2 fw-bold text-dark d-none d-md-inline">TypeScript Pro</span>
                        </div>
                        <Badge bg="primary-subtle" className="text-primary border border-primary-subtle d-none d-lg-inline-block">v5.x Transpiler</Badge>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <Button variant="outline-secondary" size="sm" onClick={() => setCode('')} className="d-none d-md-block">
                            <FaTrash />
                        </Button>
                        <Button variant="outline-primary" size="sm" onClick={handleCopy}>
                            <FaCopy /> <span className="d-none d-md-inline">Copy TS</span>
                        </Button>
                        <Button variant="primary" size="sm" onClick={runTSCode} disabled={isCompiling} className="d-flex align-items-center gap-2 px-4 fw-bold shadow-sm">
                            {isCompiling ? <FaSyncAlt className="spin" /> : <FaPlay size={12} />}
                            {isCompiling ? 'COMPILING...' : 'RUN CODE'}
                        </Button>
                        <Button variant="dark" size="sm" onClick={handleDownload}>
                            <FaDownload />
                        </Button>
                    </div>
                </div>

                {/* Workspace Split */}
                <div className="wt-editor-workspace">
                    <Row className="g-0 h-100">
                        {/* TypeScript Editor Pane */}
                        <Col lg={7} className="wt-editor-pane border-end position-relative">
                            <div className="wt-pane-header bg-light px-3 py-2 border-bottom d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2 small fw-bold text-muted">
                                    <FaCode className="text-primary" /> main.ts
                                </div>
                                <OverlayTrigger placement="left" overlay={<Tooltip>TypeScript provides static typing!</Tooltip>}>
                                    <FaLightbulb className="text-warning cursor-pointer" size={14} />
                                </OverlayTrigger>
                            </div>
                            <textarea 
                                spellCheck="false"
                                className="wt-ts-textarea"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="// Start writing TypeScript..."
                            />
                            {copySuccess && <div className="wt-ts-toast">{copySuccess}</div>}
                        </Col>

                        {/* Integrated Console Pane */}
                        <Col lg={5} className="wt-ts-console-pane bg-dark d-flex flex-column">
                            <div className="wt-console-header px-3 py-2 d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2 small fw-bold text-white-50">
                                    <FaTerminal /> COMPILED OUTPUT
                                </div>
                                <Button variant="link" size="sm" className="text-white-50 p-0 text-decoration-none small" onClick={() => setLogs([])}>
                                    Clear
                                </Button>
                            </div>
                            <div className="wt-console-body flex-grow-1 p-3">
                                {logs.length === 0 ? (
                                    <div className="text-center text-muted mt-5 opacity-50">
                                        <FaBox size={40} className="mb-3" />
                                        <p>Output will appear here after compilation.</p>
                                    </div>
                                ) : (
                                    logs.map((log, idx) => (
                                        <div key={idx} className={`wt-log-line ${log.type}`}>
                                            <span className="log-prefix">
                                                {log.type === 'error' ? '✖' : '›'}
                                            </span>
                                            <pre className="log-text">{log.content}</pre>
                                            <span className="log-timestamp">{log.time}</span>
                                        </div>
                                    ))
                                )}
                                <div ref={consoleEndRef} />
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>

            {/* Content Section */}
            <section className="wt-ts-info py-5 bg-white border-top">
                <Container>
                    <Row className="justify-content-center text-center mb-5">
                        <Col lg={9}>
                            <h2 className="display-6 fw-bold">Master <span className="text-primary">TypeScript</span> Anywhere</h2>
                            <p className="lead text-muted">A premium cloud-based playground to test types, interfaces, and modern JS features without local installation.</p>
                        </Col>
                    </Row>

                    <Row className="g-4">
                        <Col md={4}>
                            <div className="wt-ts-feature-card p-4 h-100 border rounded-4 text-center">
                                <div className="feature-icon bg-primary-subtle text-primary mb-3">
                                    <FaCheckCircle size={24} />
                                </div>
                                <h5 className="fw-bold">Babel Compiling</h5>
                                <p className="text-muted small">Uses industry-standard Babel compilation to transpile your TypeScript into browser-executable JavaScript instantly.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="wt-ts-feature-card p-4 h-100 border rounded-4 text-center">
                                <div className="feature-icon bg-info-subtle text-info mb-3">
                                    <FaInfoCircle size={24} />
                                </div>
                                <h5 className="fw-bold">Type Simulation</h5>
                                <p className="text-muted small">Experiment with Interfaces, Enums, Generics, and Type Aliases to see how TypeScript strengthens your code architecture.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="wt-ts-feature-card p-4 h-100 border rounded-4 text-center">
                                <div className="feature-icon bg-danger-subtle text-danger mb-3">
                                    <FaBug size={24} />
                                </div>
                                <h5 className="fw-bold">Error Reporting</h5>
                                <p className="text-muted small">Get clear feedback on syntax and compilation errors directly in the integrated terminal-style console window.</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default TypeScriptEditor;
