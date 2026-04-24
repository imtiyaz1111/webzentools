import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Badge, Spinner } from 'react-bootstrap';
import { 
    FaPython, FaPlay, FaTrash, FaCopy, FaDownload, 
    FaTerminal, FaBug, FaInfoCircle, FaSyncAlt, FaMicrochip
} from 'react-icons/fa';
import SEO from '../../../../components/SEO';
import "./PythonEditor.css";

const defaultPythonCode = `# Welcome to Webzen Python Studio
# Powered by Pyodide (Python in the Browser)

def greet(name):
    return f"Hello, {name}! Welcome to the premium Python editor."

# Test the function
print(greet("Webzen Developer"))

# Working with lists and math
numbers = [1, 2, 3, 4, 5]
squared = [n**2 for n in numbers]

print("Original Numbers:", numbers)
print("Squared Numbers:", squared)

# Loop example
for i in range(3):
    print(f"Loop iteration: {i}")`;

const PythonEditor = () => {
    const [code, setCode] = useState(defaultPythonCode);
    const [logs, setLogs] = useState([]);
    const [isPyodideLoading, setIsPyodideLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');
    const pyodideRef = useRef(null);
    const consoleEndRef = useRef(null);

    // Initialize Pyodide
    useEffect(() => {
        const loadPyodide = async () => {
            if (!window.loadPyodide) {
                const script = document.createElement('script');
                script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
                document.head.appendChild(script);
                await new Promise(resolve => script.onload = resolve);
            }
            
            // eslint-disable-next-line no-undef
            pyodideRef.current = await loadPyodide();
            setIsPyodideLoading(false);
        };
        loadPyodide();
    }, []);

    useEffect(() => {
        consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const runCode = async () => {
        if (!pyodideRef.current || isRunning) return;
        
        setIsRunning(true);
        setLogs([{ type: 'info', content: '>>> Executing Python code...', time: new Date().toLocaleTimeString() }]);
        
        const tempLogs = [];
        
        try {
            // Set up stdout redirection in Python
            pyodideRef.current.runPython(`
                import sys
                import io
                sys.stdout = io.String()
                sys.stderr = io.String()
            `);

            // Execute user code
            await pyodideRef.current.runPythonAsync(code);

            // Capture output
            const stdout = pyodideRef.current.runPython("sys.stdout.getvalue()");
            const stderr = pyodideRef.current.runPython("sys.stderr.getvalue()");

            if (stdout) {
                stdout.split('\n').filter(line => line.trim()).forEach(line => {
                    tempLogs.push({ type: 'log', content: line, time: new Date().toLocaleTimeString() });
                });
            }

            if (stderr) {
                tempLogs.push({ type: 'error', content: stderr, time: new Date().toLocaleTimeString() });
            }

            setLogs(prev => [...prev, ...tempLogs, { type: 'success', content: '>>> Execution finished.', time: new Date().toLocaleTimeString() }]);
        } catch (err) {
            setLogs(prev => [...prev, { type: 'error', content: err.message, time: new Date().toLocaleTimeString() }]);
        } finally {
            setIsRunning(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopySuccess('Python Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([code], { type: 'text/x-python' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'script.py';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="wt-python-page">
            <SEO 
                title="Python Online Editor Free - Run Python in Browser | WebzenTools"
                description="Execute Python code online with our free premium editor. Features real-time output console, Pyodide integration, and code export."
                keywords="python editor, online python compiler, run python in browser, free python tool, python playground"
                url="https://www.webzentools.com/tools/python-editor"
            />

            <Container fluid className="wt-editor-container p-0">
                {/* Header Toolbar */}
                <div className="wt-editor-toolbar d-flex align-items-center justify-content-between px-4 py-2 border-bottom bg-white">
                    <div className="d-flex align-items-center gap-3">
                        <div className="wt-editor-logo">
                            <FaPython className="text-primary" size={28} />
                            <span className="ms-2 fw-bold text-dark d-none d-md-inline">Python Web Studio</span>
                        </div>
                        {isPyodideLoading ? (
                            <Badge bg="light" className="text-muted border d-flex align-items-center gap-2">
                                <Spinner animation="border" size="sm" /> Initializing Runtime...
                            </Badge>
                        ) : (
                            <Badge bg="success-subtle" className="text-success border border-success-subtle d-none d-lg-inline-block">
                                <FaMicrochip className="me-1" /> Python 3.11 (Pyodide)
                            </Badge>
                        )}
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <Button variant="outline-secondary" size="sm" onClick={() => setCode('')} className="d-none d-md-block">
                            <FaTrash />
                        </Button>
                        <Button variant="outline-primary" size="sm" onClick={handleCopy}>
                            <FaCopy /> <span className="d-none d-md-inline">Copy Script</span>
                        </Button>
                        <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={runCode} 
                            disabled={isPyodideLoading || isRunning}
                            className="d-flex align-items-center gap-2 px-4 fw-bold shadow-sm"
                        >
                            {isRunning ? <FaSyncAlt className="spin" /> : <FaPlay size={12} />}
                            {isRunning ? 'RUNNING...' : 'RUN CODE'}
                        </Button>
                        <Button variant="dark" size="sm" onClick={handleDownload}>
                            <FaDownload />
                        </Button>
                    </div>
                </div>

                {/* Workspace Split */}
                <div className="wt-editor-workspace">
                    <Row className="g-0 h-100">
                        {/* Editor Pane */}
                        <Col lg={7} className="wt-editor-pane border-end position-relative">
                            <div className="wt-pane-header bg-light px-3 py-2 border-bottom d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2 small fw-bold text-muted">
                                    <FaPython className="text-primary" /> main.py
                                </div>
                            </div>
                            <textarea 
                                spellCheck="false"
                                className="wt-python-textarea"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="# Write your Python code here..."
                            />
                            {copySuccess && <div className="wt-python-toast">{copySuccess}</div>}
                        </Col>

                        {/* Console Pane */}
                        <Col lg={5} className="wt-python-console bg-dark d-flex flex-column">
                            <div className="wt-console-header px-3 py-2 d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2 small fw-bold text-white-50">
                                    <FaTerminal /> PYODIDE CONSOLE
                                </div>
                                <Button variant="link" size="sm" className="text-white-50 p-0 text-decoration-none small" onClick={() => setLogs([])}>
                                    Clear Console
                                </Button>
                            </div>
                            <div className="wt-console-body flex-grow-1 p-3">
                                {logs.length === 0 ? (
                                    <div className="text-center text-muted mt-5 opacity-50">
                                        <FaPython size={50} className="mb-3" />
                                        <p>Run your code to see the output here.</p>
                                    </div>
                                ) : (
                                    logs.map((log, idx) => (
                                        <div key={idx} className={`wt-py-log-line ${log.type}`}>
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

            {/* Content Section */}
            <section className="wt-python-info py-5 bg-white border-top">
                <Container>
                    <Row className="justify-content-center text-center mb-5">
                        <Col lg={9}>
                            <h2 className="display-6 fw-bold">Professional <span className="text-primary">Python</span> Playground</h2>
                            <p className="lead text-muted">Execute Python code directly in your browser with zero installation. Perfect for data science testing, learning, and debugging.</p>
                        </Col>
                    </Row>

                    <Row className="g-4">
                        <Col md={4}>
                            <div className="wt-python-feature-card p-4 h-100 border rounded-4 text-center">
                                <div className="feature-icon bg-primary-subtle text-primary mb-3">
                                    <FaMicrochip size={24} />
                                </div>
                                <h5 className="fw-bold">Pyodide Engine</h5>
                                <p className="text-muted small">Leverages the power of WebAssembly to run a full Python 3.11 environment in your browser without any server-side execution.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="wt-python-feature-card p-4 h-100 border rounded-4 text-center">
                                <div className="feature-icon bg-info-subtle text-info mb-3">
                                    <FaTerminal size={24} />
                                </div>
                                <h5 className="fw-bold">Virtual Stdout</h5>
                                <p className="text-muted small">Captures all print statements and error traces in a dedicated console window, just like a real terminal.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="wt-python-feature-card p-4 h-100 border rounded-4 text-center">
                                <div className="feature-icon bg-success-subtle text-success mb-3">
                                    <FaInfoCircle size={24} />
                                </div>
                                <h5 className="fw-bold">Zero Latency</h5>
                                <p className="text-muted small">Because it runs on your machine, there's no network delay between writing code and seeing the results.</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default PythonEditor;
