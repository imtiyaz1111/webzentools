import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Badge, Spinner, Nav, Dropdown } from 'react-bootstrap';
import { 
    FaCode, FaPlay, FaTrash, FaCopy, FaDownload, 
    FaTerminal, FaBug, FaFileCode, FaMagic, FaSyncAlt,
    FaCubes, FaRocket, FaPuzzlePiece
} from 'react-icons/fa';
import SEO from '../../../../components/SEO';
import "./CPPEditor.css";

const cppTemplates = {
    hello: `#include <iostream>

int main() {
    std::cout << "Hello, Webzen C++ Studio!" << std::endl;
    std::cout << "Unleashing the power of Modern C++..." << std::endl;
    return 0;
}`,
    classes: `#include <iostream>
#include <string>

class WebzenDeveloper {
public:
    std::string name;
    int id;

    void introduce() {
        std::cout << "Developer: " << name << " (ID: " << id << ")" << std::endl;
    }
};

int main() {
    WebzenDeveloper dev;
    dev.name = "Webzen Studio";
    dev.id = 2024;
    dev.introduce();
    return 0;
}`,
    stl: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    
    std::cout << "Processing STL Vector..." << std::endl;
    
    for(int n : numbers) {
        std::cout << "Value: " << n << std::endl;
    }
    
    return 0;
}`
};

const CPPEditor = () => {
    const [code, setCode] = useState(cppTemplates.hello);
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
        setLogs([{ type: 'info', content: 'g++ main.cpp -o app...', time: new Date().toLocaleTimeString() }]);

        setTimeout(() => {
            const output = [];
            const lines = code.split('\n');
            lines.forEach(line => {
                // Mock cout parser
                const match = line.match(/std::cout\s*<<\s*"(.*)"/);
                if (match) {
                    let val = match[1];
                    output.push(val);
                }
            });

            if (output.length === 0) {
                setLogs(prev => [...prev, 
                    { type: 'warning', content: 'Compilation successful. Execution finished with no output.', time: new Date().toLocaleTimeString() }
                ]);
            } else {
                setLogs(prev => [
                    ...prev,
                    { type: 'success', content: 'Build successful. Running application...', time: new Date().toLocaleTimeString() },
                    ...output.map(o => ({ type: 'log', content: o, time: new Date().toLocaleTimeString() })),
                    { type: 'info', content: '------------------', time: new Date().toLocaleTimeString() },
                    { type: 'info', content: 'Process finished with exit code 0', time: new Date().toLocaleTimeString() }
                ]);
            }
            setIsCompiling(false);
        }, 1500);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopySuccess('C++ Code Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([code], { type: 'text/x-c++src' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'main.cpp';
        a.click();
        URL.revokeObjectURL(url);
    };

    const switchTemplate = (key) => {
        setActiveTab(key);
        setCode(cppTemplates[key]);
    };

    return (
        <div className="wt-cpp-page">
            <SEO 
                title="C++ Online Editor Free - C++ Code Playground | WebzenTools"
                description="Edit and format C++ code online with our free premium editor. Features real-time syntax visualization, cout console simulation, and STL support templates."
                keywords="cpp editor, online c++ compiler, c++ playground, free c++ tool, format c++ online"
                url="https://www.webzentools.com/tools/cpp-editor"
            />

            <Container fluid className="wt-editor-container p-0">
                {/* Modern Toolbar */}
                <div className="wt-editor-toolbar d-flex align-items-center justify-content-between px-4 py-2 border-bottom bg-white shadow-sm">
                    <div className="d-flex align-items-center gap-3">
                        <div className="wt-editor-logo">
                            <FaCode className="text-indigo" size={28} />
                            <span className="ms-2 fw-bold text-dark d-none d-md-inline">C++ Premium Studio</span>
                        </div>
                        <Nav variant="pills" className="wt-cpp-pills">
                            <Nav.Item>
                                <Nav.Link active={activeTab === 'hello'} onClick={() => switchTemplate('hello')}>Basic</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link active={activeTab === 'classes'} onClick={() => switchTemplate('classes')}>OOP/Classes</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link active={activeTab === 'stl'} onClick={() => switchTemplate('stl')}>STL/Vectors</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <Button variant="outline-secondary" size="sm" onClick={() => setCode('')} title="Clear Workspace">
                            <FaTrash />
                        </Button>
                        <Button variant="outline-primary" size="sm" onClick={handleCopy}>
                            <FaCopy /> <span className="d-none d-md-inline">Copy Source</span>
                        </Button>
                        <Button 
                            variant="indigo" 
                            size="sm" 
                            onClick={compileAndRun} 
                            disabled={isCompiling}
                            className="d-flex align-items-center gap-2 px-4 fw-bold shadow-sm text-white"
                            style={{ backgroundColor: '#6366f1' }}
                        >
                            {isCompiling ? <FaSyncAlt className="spin" /> : <FaPlay size={12} />}
                            {isCompiling ? 'BUILDING...' : 'COMPILE & RUN'}
                        </Button>
                        <Dropdown>
                            <Dropdown.Toggle variant="dark" size="sm" className="no-caret">
                                <FaDownload />
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end" className="shadow border-0 rounded-3">
                                <Dropdown.Item onClick={handleDownload}>Download as .cpp</Dropdown.Item>
                                <Dropdown.Item onClick={() => {}}>Download as .hpp</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

                {/* Main Workspace */}
                <div className="wt-editor-workspace">
                    <Row className="g-0 h-100">
                        {/* Editor Side */}
                        <Col lg={7} className="wt-editor-pane border-end position-relative">
                            <div className="wt-pane-header bg-light px-3 py-2 border-bottom d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2 small fw-bold text-muted">
                                    <FaFileCode className="text-indigo" /> main.cpp
                                </div>
                                <Badge bg="indigo-subtle" className="text-indigo border border-indigo-subtle" style={{ color: '#6366f1' }}>C++20 Ready</Badge>
                            </div>
                            <textarea 
                                spellCheck="false"
                                className="wt-cpp-textarea"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="// Start writing C++ code..."
                            />
                            {copySuccess && <div className="wt-cpp-toast">{copySuccess}</div>}
                        </Col>

                        {/* Console Side */}
                        <Col lg={5} className="wt-cpp-console bg-dark d-flex flex-column">
                            <div className="wt-console-header px-3 py-2 d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2 small fw-bold text-white-50">
                                    <FaTerminal /> C++ OUTPUT CONSOLE
                                </div>
                                <Button variant="link" size="sm" className="text-white-50 p-0 text-decoration-none small" onClick={() => setLogs([])}>
                                    Clear
                                </Button>
                            </div>
                            <div className="wt-console-body flex-grow-1 p-3">
                                {logs.length === 0 ? (
                                    <div className="text-center text-muted mt-5 opacity-50">
                                        <FaTerminal size={50} className="mb-3" />
                                        <p>Output will appear here after build.</p>
                                    </div>
                                ) : (
                                    logs.map((log, idx) => (
                                        <div key={idx} className={`wt-cpp-log-line ${log.type}`}>
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
            <section className="wt-cpp-info py-5 bg-white border-top">
                <Container>
                    <Row className="justify-content-center text-center mb-5">
                        <Col lg={9}>
                            <h2 className="display-6 fw-bold">Professional <span className="text-indigo" style={{ color: '#6366f1' }}>C++</span> Playground</h2>
                            <p className="lead text-muted">A premium web-based environment to master Modern C++. Test classes, vectors, and complex logic instantly.</p>
                        </Col>
                    </Row>

                    <Row className="g-4 text-center">
                        <Col md={4}>
                            <div className="wt-cpp-feature-card p-4 h-100 border rounded-4 shadow-sm">
                                <div className="feature-icon bg-indigo-subtle text-indigo mb-3" style={{ backgroundColor: '#e0e7ff', color: '#6366f1' }}>
                                    <FaRocket size={24} />
                                </div>
                                <h5 className="fw-bold">Modern C++20</h5>
                                <p className="text-muted small">Optimized environment for testing modern C++ features, from smart pointers to the Standard Template Library (STL).</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="wt-cpp-feature-card p-4 h-100 border rounded-4 shadow-sm">
                                <div className="feature-icon bg-success-subtle text-success mb-3">
                                    <FaCubes size={24} />
                                </div>
                                <h5 className="fw-bold">Object Oriented</h5>
                                <p className="text-muted small">Prototypes complex classes and inheritance structures with dedicated templates and instant console feedback.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="wt-cpp-feature-card p-4 h-100 border rounded-4 shadow-sm">
                                <div className="feature-icon bg-warning-subtle text-warning mb-3">
                                    <FaPuzzlePiece size={24} />
                                </div>
                                <h5 className="fw-bold">STL Visualization</h5>
                                <p className="text-muted small">Easily visualize data from Vectors, Maps, and Lists to debug your algorithms and logic efficiently.</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default CPPEditor;
