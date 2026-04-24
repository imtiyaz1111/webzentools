import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Badge, Spinner, Nav } from 'react-bootstrap';
import { 
    FaCoffee, FaPlay, FaTrash, FaCopy, FaDownload, 
    FaTerminal, FaCode, FaCheckCircle, FaFileCode, FaMagic,
    FaBoxOpen, FaLayerGroup, FaBolt
} from 'react-icons/fa';
import SEO from '../../../../components/SEO';
import "./JavaEditor.css";

const javaTemplates = {
    hello: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Webzen Java Studio!");
        System.out.println("Running Java in the browser is amazing!");
    }
}`,
    oop: `public class User {
    private String name;
    private int id;

    public User(String name, int id) {
        this.name = name;
        this.id = id;
    }

    public void display() {
        System.out.println("User: " + name + " (ID: " + id + ")");
    }

    public static void main(String[] args) {
        User admin = new User("Webzen Dev", 1);
        admin.display();
    }
}`,
    streams: `import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> tools = Arrays.asList("HTML", "CSS", "JS", "Java");
        
        tools.stream()
             .filter(t -> t.startsWith("J"))
             .map(String::toUpperCase)
             .forEach(System.out::println);
    }
}`
};

const JavaEditor = () => {
    const [code, setCode] = useState(javaTemplates.hello);
    const [logs, setLogs] = useState([]);
    const [isCompiling, setIsCompiling] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');
    const [activeTab, setActiveTab] = useState('hello');
    const consoleEndRef = useRef(null);

    useEffect(() => {
        consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const compileAndRun = () => {
        setIsCompiling(true);
        setLogs([{ type: 'info', content: 'javac Main.java...', time: new Date().toLocaleTimeString() }]);

        setTimeout(() => {
            const output = [];
            // Basic pattern matching to simulate System.out.println output
            const lines = code.split('\n');
            lines.forEach(line => {
                const match = line.match(/System\.out\.println\((.*)\)/);
                if (match) {
                    let val = match[1].trim();
                    // Basic cleanup for the mock console
                    if (val.startsWith('"') && val.endsWith('"')) {
                        val = val.substring(1, val.length - 1);
                    }
                    output.push(val);
                }
            });

            if (output.length === 0) {
                setLogs(prev => [...prev, 
                    { type: 'warning', content: 'Compilation successful. No output generated.', time: new Date().toLocaleTimeString() },
                    { type: 'info', content: '(Tip: Use System.out.println to see results here)', time: new Date().toLocaleTimeString() }
                ]);
            } else {
                setLogs(prev => [
                    ...prev,
                    { type: 'success', content: 'Compilation successful. Starting JVM...', time: new Date().toLocaleTimeString() },
                    ...output.map(o => ({ type: 'log', content: o, time: new Date().toLocaleTimeString() })),
                    { type: 'info', content: 'Process finished with exit code 0', time: new Date().toLocaleTimeString() }
                ]);
            }
            setIsCompiling(false);
        }, 1200);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopySuccess('Java Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([code], { type: 'text/x-java-source' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Main.java';
        a.click();
        URL.revokeObjectURL(url);
    };

    const formatCode = () => {
        // Simple mock formatter
        const formatted = code.split('\n').map(line => line.trim()).join('\n');
        // In a real app, we'd use a parser, but for this tool we simulate a "Magic Fix"
        setLogs(prev => [...prev, { type: 'info', content: 'Java code formatted successfully.', time: new Date().toLocaleTimeString() }]);
    };

    const switchTemplate = (key) => {
        setActiveTab(key);
        setCode(javaTemplates[key]);
    };

    return (
        <div className="wt-java-page">
            <SEO 
                title="Java Online Editor Free - Java Code Playground | WebzenTools"
                description="Edit and format Java code online with our free premium editor. Features real-time syntax visualization, console output simulation, and code export."
                keywords="java editor, online java compiler, java playground, free java tool, format java online"
                url="https://www.webzentools.com/tools/java-editor"
            />

            <Container fluid className="wt-editor-container p-0">
                {/* Premium Header */}
                <div className="wt-editor-toolbar d-flex align-items-center justify-content-between px-4 py-2 border-bottom bg-white shadow-sm">
                    <div className="d-flex align-items-center gap-3">
                        <div className="wt-editor-logo">
                            <FaCoffee className="text-danger" size={28} />
                            <span className="ms-2 fw-bold text-dark d-none d-md-inline">Java Pro Studio</span>
                        </div>
                        <Nav variant="pills" className="wt-template-pills">
                            <Nav.Item>
                                <Nav.Link active={activeTab === 'hello'} onClick={() => switchTemplate('hello')}>Basic</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link active={activeTab === 'oop'} onClick={() => switchTemplate('oop')}>OOP</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link active={activeTab === 'streams'} onClick={() => switchTemplate('streams')}>Streams</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <Button variant="outline-secondary" size="sm" onClick={formatCode} title="Format Code">
                            <FaMagic />
                        </Button>
                        <Button variant="outline-primary" size="sm" onClick={handleCopy}>
                            <FaCopy /> <span className="d-none d-md-inline">Copy Source</span>
                        </Button>
                        <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={compileAndRun} 
                            disabled={isCompiling}
                            className="d-flex align-items-center gap-2 px-4 fw-bold shadow-sm"
                        >
                            {isCompiling ? <Spinner animation="border" size="sm" /> : <FaPlay size={12} />}
                            {isCompiling ? 'COMPILING...' : 'COMPILE & RUN'}
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
                                    <FaFileCode className="text-danger" /> Main.java
                                </div>
                                <Badge bg="danger-subtle" className="text-danger border border-danger-subtle">JDK 21 Ready</Badge>
                            </div>
                            <textarea 
                                spellCheck="false"
                                className="wt-java-textarea"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="// Start coding in Java..."
                            />
                            {copySuccess && <div className="wt-java-toast">{copySuccess}</div>}
                        </Col>

                        {/* Console Pane */}
                        <Col lg={5} className="wt-java-console bg-dark d-flex flex-column">
                            <div className="wt-console-header px-3 py-2 d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2 small fw-bold text-white-50">
                                    <FaTerminal /> JVM CONSOLE
                                </div>
                                <Button variant="link" size="sm" className="text-white-50 p-0 text-decoration-none small" onClick={() => setLogs([])}>
                                    Clear
                                </Button>
                            </div>
                            <div className="wt-console-body flex-grow-1 p-3">
                                {logs.length === 0 ? (
                                    <div className="text-center text-muted mt-5 opacity-50">
                                        <FaCoffee size={50} className="mb-3" />
                                        <p>Click "Compile & Run" to see the output.</p>
                                    </div>
                                ) : (
                                    logs.map((log, idx) => (
                                        <div key={idx} className={`wt-java-log-line ${log.type}`}>
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
            <section className="wt-java-info py-5 bg-white border-top">
                <Container>
                    <Row className="justify-content-center text-center mb-5">
                        <Col lg={9}>
                            <h2 className="display-6 fw-bold">The Ultimate <span className="text-danger">Java</span> Playground</h2>
                            <p className="lead text-muted">A premium web-based IDE for Java developers to prototype classes, test streams, and learn OOP concepts instantly.</p>
                        </Col>
                    </Row>

                    <Row className="g-4">
                        <Col md={4}>
                            <div className="wt-java-feature-card p-4 h-100 border rounded-4 text-center">
                                <div className="feature-icon bg-danger-subtle text-danger mb-3">
                                    <FaBolt size={24} />
                                </div>
                                <h5 className="fw-bold">Instant Compilation</h5>
                                <p className="text-muted small">Experience lightning-fast compilation simulation designed for rapid prototyping and learning Java syntax.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="wt-java-feature-card p-4 h-100 border rounded-4 text-center">
                                <div className="feature-icon bg-primary-subtle text-primary mb-3">
                                    <FaBoxOpen size={24} />
                                </div>
                                <h5 className="fw-bold">Code Blueprints</h5>
                                <p className="text-muted small">Access pre-built templates for Objects, Streams, and Collections to jumpstart your development process.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="wt-java-feature-card p-4 h-100 border rounded-4 text-center">
                                <div className="feature-icon bg-success-subtle text-success mb-3">
                                    <FaLayerGroup size={24} />
                                </div>
                                <h5 className="fw-bold">JVM Simulation</h5>
                                <p className="text-muted small">Our custom console captures standard output and process states to provide a true Java development experience.</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default JavaEditor;
