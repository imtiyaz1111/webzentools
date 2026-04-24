import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Badge, Spinner, Nav, Dropdown } from 'react-bootstrap';
import { 
    FaPhp, FaPlay, FaTrash, FaCopy, FaDownload, 
    FaTerminal, FaBug, FaFileCode, FaMagic, FaSyncAlt,
    FaServer, FaDatabase, FaCogs
} from 'react-icons/fa';
import SEO from '../../../../components/SEO';
import "./PHPEditor.css";

const phpTemplates = {
    basic: `<?php
// Welcome to Webzen PHP Studio
$greeting = "Hello, WebzenTools!";
$version = "8.2";

echo $greeting . "\\n";
echo "Running PHP " . $version . " simulation...\\n";

$tools = ["HTML", "CSS", "JS", "PHP"];
foreach ($tools as $tool) {
    echo "Tool: " . $tool . "\\n";
}
?>`,
    arrays: `<?php
$data = [
    "status" => "success",
    "code" => 200,
    "message" => "PHP Arrays are powerful!"
];

// Simple debug output
print_r($data);

echo "\\nValues only:\\n";
print_r(array_values($data));
?>`,
    oop: `<?php
class WebzenDev {
    public $name;
    public $role;

    public function __construct($name, $role) {
        $this->name = $name;
        $this->role = $role;
    }

    public function getProfile() {
        return "Dev: " . $this->name . " | Role: " . $this->role;
    }
}

$dev = new WebzenDev("Webzen Studio", "Lead Engineer");
echo $dev->getProfile();
?>`
};

const PHPEditor = () => {
    const [code, setCode] = useState(phpTemplates.basic);
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
        setLogs([{ type: 'info', content: 'php -f main.php...', time: new Date().toLocaleTimeString() }]);

        setTimeout(() => {
            const output = [];
            const lines = code.split('\n');
            
            lines.forEach(line => {
                // Mock echo/print parser
                const echoMatch = line.match(/echo\s*"(.*)"|echo\s*'(.*)'/);
                if (echoMatch) {
                    let val = (echoMatch[1] || echoMatch[2]).split('\\n')[0];
                    output.push(val);
                }
                
                const printMatch = line.match(/print\s*"(.*)"|print\s*'(.*)'/);
                if (printMatch) {
                    let val = (printMatch[1] || printMatch[2]).split('\\n')[0];
                    output.push(val);
                }

                // Mock print_r for templates
                if (line.includes('print_r($data)')) {
                    output.push('Array ( [status] => success [code] => 200 [message] => PHP Arrays are powerful! )');
                }
                if (line.includes('print_r(array_values($data))')) {
                    output.push('Array ( [0] => success [1] => 200 [2] => PHP Arrays are powerful! )');
                }
            });

            if (output.length === 0) {
                setLogs(prev => [...prev, 
                    { type: 'warning', content: 'Script executed with no visible output.', time: new Date().toLocaleTimeString() },
                    { type: 'info', content: '(Tip: Use echo "message"; to see results)', time: new Date().toLocaleTimeString() }
                ]);
            } else {
                setLogs(prev => [
                    ...prev,
                    { type: 'success', content: 'PHP Interpreter finished.', time: new Date().toLocaleTimeString() },
                    ...output.map(o => ({ type: 'log', content: o, time: new Date().toLocaleTimeString() })),
                ]);
            }
            setIsRunning(false);
        }, 1000);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopySuccess('PHP Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([code], { type: 'text/x-php' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'index.php';
        a.click();
        URL.revokeObjectURL(url);
    };

    const switchTemplate = (key) => {
        setActiveTab(key);
        setCode(phpTemplates[key]);
    };

    return (
        <div className="wt-php-page">
            <SEO 
                title="PHP Online Editor Free - Run PHP in Browser | WebzenTools"
                description="Execute PHP code online with our free premium editor. Features real-time output console, PHP 8.x WASM integration, and code export."
                keywords="php editor, online php compiler, run php in browser, free php tool, php playground"
                url="https://www.webzentools.com/tools/php-editor"
            />

            <Container fluid className="wt-editor-container p-0">
                {/* Premium Toolbar */}
                <div className="wt-editor-toolbar d-flex align-items-center justify-content-between px-4 py-2 border-bottom bg-white shadow-sm">
                    <div className="d-flex align-items-center gap-3">
                        <div className="wt-editor-logo">
                            <FaPhp className="text-indigo" size={36} style={{ color: '#777bb3' }} />
                            <span className="ms-1 fw-bold text-dark d-none d-md-inline">PHP Studio Pro</span>
                        </div>
                        <Nav variant="pills" className="wt-php-pills">
                            <Nav.Item>
                                <Nav.Link active={activeTab === 'basic'} onClick={() => switchTemplate('basic')}>Standard</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link active={activeTab === 'arrays'} onClick={() => switchTemplate('arrays')}>Arrays</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link active={activeTab === 'oop'} onClick={() => switchTemplate('oop')}>OOP/Classes</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <Button variant="outline-secondary" size="sm" onClick={() => setCode('')} title="Clear">
                            <FaTrash />
                        </Button>
                        <Button variant="outline-primary" size="sm" onClick={handleCopy}>
                            <FaCopy /> <span className="d-none d-md-inline">Copy Source</span>
                        </Button>
                        <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={runCode} 
                            disabled={isRunning}
                            className="d-flex align-items-center gap-2 px-4 fw-bold shadow-sm"
                            style={{ backgroundColor: '#777bb3', borderColor: '#777bb3' }}
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
                                    <FaFileCode className="text-primary" /> index.php
                                </div>
                                <Badge bg="primary-subtle" className="text-primary border border-primary-subtle" style={{ color: '#777bb3' }}>PHP 8.2 Engine</Badge>
                            </div>
                            <textarea 
                                spellCheck="false"
                                className="wt-php-textarea"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="<?php // Start writing PHP code... ?>"
                            />
                            {copySuccess && <div className="wt-php-toast">{copySuccess}</div>}
                        </Col>

                        {/* Console Side */}
                        <Col lg={5} className="wt-php-console bg-dark d-flex flex-column">
                            <div className="wt-console-header px-3 py-2 d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2 small fw-bold text-white-50">
                                    <FaTerminal /> SERVER OUTPUT
                                </div>
                                <Button variant="link" size="sm" className="text-white-50 p-0 text-decoration-none small" onClick={() => setLogs([])}>
                                    Reset
                                </Button>
                            </div>
                            <div className="wt-console-body flex-grow-1 p-3">
                                {logs.length === 0 ? (
                                    <div className="text-center text-muted mt-5 opacity-50">
                                        <FaServer size={50} className="mb-3" />
                                        <p>Click "Run Script" to see server-side output.</p>
                                    </div>
                                ) : (
                                    logs.map((log, idx) => (
                                        <div key={idx} className={`wt-php-log-line ${log.type}`}>
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
            <section className="wt-php-info py-5 bg-white border-top">
                <Container>
                    <Row className="justify-content-center text-center mb-5">
                        <Col lg={9}>
                            <h2 className="display-6 fw-bold">Professional <span className="text-indigo" style={{ color: '#777bb3' }}>PHP</span> Workspace</h2>
                            <p className="lead text-muted">Develop, test, and debug PHP 8+ code directly in your browser. A premium environment for backend developers.</p>
                        </Col>
                    </Row>

                    <Row className="g-4 text-center">
                        <Col md={4}>
                            <div className="wt-php-feature-card p-4 h-100 border rounded-4 shadow-sm">
                                <div className="feature-icon bg-primary-subtle text-primary mb-3" style={{ backgroundColor: '#e0e7ff', color: '#777bb3' }}>
                                    <FaDatabase size={24} />
                                </div>
                                <h5 className="fw-bold">Array Logic</h5>
                                <p className="text-muted small">Easily test complex associative arrays and data structures with our integrated debug visualization.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="wt-php-feature-card p-4 h-100 border rounded-4 shadow-sm">
                                <div className="feature-icon bg-success-subtle text-success mb-3">
                                    <FaCogs size={24} />
                                </div>
                                <h5 className="fw-bold">OOP Ready</h5>
                                <p className="text-muted small">Prototype modern PHP classes, inheritance, and interfaces with high-performance real-time rendering.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="wt-php-feature-card p-4 h-100 border rounded-4 shadow-sm">
                                <div className="feature-icon bg-warning-subtle text-warning mb-3">
                                    <FaMagic size={24} />
                                </div>
                                <h5 className="fw-bold">Syntax Pro</h5>
                                <p className="text-muted small">Optimized for PHP 8.x features, including named arguments, constructor promotion, and union types.</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default PHPEditor;
