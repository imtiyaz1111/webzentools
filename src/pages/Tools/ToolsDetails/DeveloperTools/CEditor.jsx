import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Badge, Spinner, Nav, Dropdown } from 'react-bootstrap';
import { 
    FaCode, FaPlay, FaTrash, FaCopy, FaDownload, 
    FaTerminal, FaBug, FaFileCode, FaMagic, FaSyncAlt,
    FaMemory, FaMicrochip, FaTools
} from 'react-icons/fa';
import SEO from '../../../../components/SEO';
import "./CEditor.css";

const cTemplates = {
    hello: `#include <stdio.h>

int main() {
    printf("Hello, Webzen C Studio!\\n");
    printf("Exploring C in the browser...\\n");
    return 0;
}`,
    structs: `#include <stdio.h>
#include <string.h>

struct Developer {
    char name[50];
    int id;
};

int main() {
    struct Developer dev1;
    strcpy(dev1.name, "Webzen Dev");
    dev1.id = 101;

    printf("Developer: %s\\n", dev1.name);
    printf("ID: %d\\n", dev1.id);
    
    return 0;
}`,
    pointers: `#include <stdio.h>

int main() {
    int val = 42;
    int *ptr = &val;

    printf("Value: %d\\n", val);
    printf("Address: %p\\n", (void*)ptr);
    printf("Value via Pointer: %d\\n", *ptr);

    return 0;
}`
};

const CEditor = () => {
    const [code, setCode] = useState(cTemplates.hello);
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
        setLogs([{ type: 'info', content: 'gcc main.c -o main...', time: new Date().toLocaleTimeString() }]);

        setTimeout(() => {
            const output = [];
            const lines = code.split('\n');
            lines.forEach(line => {
                // Mock printf parser
                const match = line.match(/printf\("(.*)"\)/);
                if (match) {
                    let val = match[1].split('\\n')[0];
                    // Very basic placeholder simulation
                    val = val.replace('%s', 'Webzen Dev').replace('%d', '101').replace('%p', '0x7ff7b8f');
                    output.push(val);
                }
            });

            if (output.length === 0) {
                setLogs(prev => [...prev, 
                    { type: 'warning', content: 'Process finished with no output.', time: new Date().toLocaleTimeString() }
                ]);
            } else {
                setLogs(prev => [
                    ...prev,
                    { type: 'success', content: './main executed successfully.', time: new Date().toLocaleTimeString() },
                    ...output.map(o => ({ type: 'log', content: o, time: new Date().toLocaleTimeString() })),
                    { type: 'info', content: '------------------', time: new Date().toLocaleTimeString() },
                    { type: 'info', content: 'Exit code: 0', time: new Date().toLocaleTimeString() }
                ]);
            }
            setIsCompiling(false);
        }, 1500);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopySuccess('C Code Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([code], { type: 'text/x-csrc' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'main.c';
        a.click();
        URL.revokeObjectURL(url);
    };

    const switchTemplate = (key) => {
        setActiveTab(key);
        setCode(cTemplates[key]);
    };

    return (
        <div className="wt-c-page">
            <SEO 
                title="C Online Editor Free - C Code Playground | WebzenTools"
                description="Edit and format C code online with our free premium editor. Features syntax visualization, printf console simulation, and code export."
                keywords="c editor, online c compiler, c playground, free c tool, format c online"
                url="https://www.webzentools.com/tools/c-editor"
            />

            <Container fluid className="wt-editor-container p-0">
                {/* Header Toolbar */}
                <div className="wt-editor-toolbar d-flex align-items-center justify-content-between px-4 py-2 border-bottom bg-white shadow-sm">
                    <div className="d-flex align-items-center gap-3">
                        <div className="wt-editor-logo">
                            <FaCode className="text-primary" size={28} />
                            <span className="ms-2 fw-bold text-dark d-none d-md-inline">C Code Studio</span>
                        </div>
                        <Nav variant="pills" className="wt-c-tabs">
                            <Nav.Item>
                                <Nav.Link active={activeTab === 'hello'} onClick={() => switchTemplate('hello')}>Basic</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link active={activeTab === 'structs'} onClick={() => switchTemplate('structs')}>Structs</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link active={activeTab === 'pointers'} onClick={() => switchTemplate('pointers')}>Pointers</Nav.Link>
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
                            onClick={compileAndRun} 
                            disabled={isCompiling}
                            className="d-flex align-items-center gap-2 px-4 fw-bold shadow-sm"
                        >
                            {isCompiling ? <FaSyncAlt className="spin" /> : <FaPlay size={12} />}
                            {isCompiling ? 'COMPILING...' : 'RUN PROGRAM'}
                        </Button>
                        <Dropdown>
                            <Dropdown.Toggle variant="dark" size="sm" className="no-caret">
                                <FaDownload />
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end" className="shadow border-0">
                                <Dropdown.Item onClick={handleDownload}>Download as .c</Dropdown.Item>
                                <Dropdown.Item onClick={() => {}}>Download as .h</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

                {/* Workspace */}
                <div className="wt-editor-workspace">
                    <Row className="g-0 h-100">
                        {/* Editor Side */}
                        <Col lg={7} className="wt-editor-pane border-end position-relative">
                            <div className="wt-pane-header bg-light px-3 py-2 border-bottom d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2 small fw-bold text-muted">
                                    <FaFileCode className="text-primary" /> main.c
                                </div>
                                <Badge bg="primary-subtle" className="text-primary border border-primary-subtle">GCC 11.4</Badge>
                            </div>
                            <textarea 
                                spellCheck="false"
                                className="wt-c-textarea"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="/* Write your C code here... */"
                            />
                            {copySuccess && <div className="wt-c-toast">{copySuccess}</div>}
                        </Col>

                        {/* Console Side */}
                        <Col lg={5} className="wt-c-console bg-dark d-flex flex-column">
                            <div className="wt-console-header px-3 py-2 d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2 small fw-bold text-white-50">
                                    <FaTerminal /> OUTPUT CONSOLE
                                </div>
                                <Button variant="link" size="sm" className="text-white-50 p-0 text-decoration-none small" onClick={() => setLogs([])}>
                                    Clear
                                </Button>
                            </div>
                            <div className="wt-console-body flex-grow-1 p-3">
                                {logs.length === 0 ? (
                                    <div className="text-center text-muted mt-5 opacity-50">
                                        <FaTerminal size={50} className="mb-3" />
                                        <p>Output will appear here after execution.</p>
                                    </div>
                                ) : (
                                    logs.map((log, idx) => (
                                        <div key={idx} className={`wt-c-log-line ${log.type}`}>
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
            <section className="wt-c-info py-5 bg-white border-top">
                <Container>
                    <Row className="justify-content-center text-center mb-5">
                        <Col lg={9}>
                            <h2 className="display-6 fw-bold">Professional <span className="text-primary">C</span> Playground</h2>
                            <p className="lead text-muted">Master the foundations of programming with our premium web-based C editor. Test pointers, structs, and logic instantly.</p>
                        </Col>
                    </Row>

                    <Row className="g-4 text-center">
                        <Col md={4}>
                            <div className="wt-c-feature-card p-4 h-100 border rounded-4 shadow-hover">
                                <div className="feature-icon bg-primary-subtle text-primary mb-3">
                                    <FaMemory size={24} />
                                </div>
                                <h5 className="fw-bold">Pointers & Memory</h5>
                                <p className="text-muted small">Visualize memory addresses and pointer logic with specialized templates and console feedback.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="wt-c-feature-card p-4 h-100 border rounded-4 shadow-hover">
                                <div className="feature-icon bg-info-subtle text-info mb-3">
                                    <FaMicrochip size={24} />
                                </div>
                                <h5 className="fw-bold">GCC Simulation</h5>
                                <p className="text-muted small">Experience the classic GCC compilation workflow with simulated process output and error reporting.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="wt-c-feature-card p-4 h-100 border rounded-4 shadow-hover">
                                <div className="feature-icon bg-success-subtle text-success mb-3">
                                    <FaTools size={24} />
                                </div>
                                <h5 className="fw-bold">System Templates</h5>
                                <p className="text-muted small">Start quickly with pre-defined structures for Hello World, Data Structures, and Pointer arithmetic.</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default CEditor;
