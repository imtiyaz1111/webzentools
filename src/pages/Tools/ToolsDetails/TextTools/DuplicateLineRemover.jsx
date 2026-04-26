import React, { useState } from 'react';
import { Form, Row, Col, Button, Toast, ToastContainer } from 'react-bootstrap';
import { 
    FaTrash, FaCopy, FaDownload, FaFilter, FaListUl, 
    FaCheck, FaMinusCircle, FaStream
} from 'react-icons/fa';

const DuplicateLineRemover = () => {
    const [inputText, setInputText] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    
    // Options
    const [options, setOptions] = useState({
        caseSensitive: false,
        trimLines: true,
        removeEmptyLines: true
    });

    const { outputText, stats } = React.useMemo(() => {
        if (!inputText) {
            return { outputText: '', stats: { original: 0, unique: 0, removed: 0 } };
        }

        let lines = inputText.split(/\r?\n/);
        const originalCount = lines.length;
        
        let processedLines = [...lines];

        // Apply filters
        if (options.trimLines) {
            processedLines = processedLines.map(line => line.trim());
        }

        if (options.removeEmptyLines) {
            processedLines = processedLines.filter(line => line.length > 0);
        }

        // Deduplicate
        const seen = new Set();
        const uniqueLines = [];

        processedLines.forEach(line => {
            const compareKey = options.caseSensitive ? line : line.toLowerCase();
            if (!seen.has(compareKey)) {
                seen.add(compareKey);
                uniqueLines.push(line);
            }
        });

        const result = uniqueLines.join('\n');
        
        return {
            outputText: result,
            stats: {
                original: originalCount,
                unique: uniqueLines.length,
                removed: originalCount - uniqueLines.length
            }
        };
    }, [inputText, options]);

    const handleCopy = () => {
        if (!outputText) return;
        navigator.clipboard.writeText(outputText);
        setToastMsg('Copied to clipboard!');
        setShowToast(true);
    };

    const handleDownload = () => {
        if (!outputText) return;
        const element = document.createElement("a");
        const file = new Blob([outputText], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "deduplicated-text.txt";
        document.body.appendChild(element);
        element.click();
        setToastMsg('File downloaded!');
        setShowToast(true);
    };

    const handleClear = () => {
        setInputText('');
        setOutputText('');
        setToastMsg('Text cleared!');
        setShowToast(true);
    };

    return (
        <div className="duplicate-remover-tool">
            <Row className="g-4">
                <Col lg={12}>
                    <div className="options-panel p-4 glass-card rounded-4 mb-4 border">
                        <h6 className="fw-bold mb-3 d-flex align-items-center">
                            <FaFilter className="me-2 text-primary" /> Configuration Options
                        </h6>
                        <div className="d-flex flex-wrap gap-4">
                            <Form.Check 
                                type="switch"
                                id="case-sensitive"
                                label="Case Sensitive"
                                checked={options.caseSensitive}
                                onChange={(e) => setOptions({...options, caseSensitive: e.target.checked})}
                            />
                            <Form.Check 
                                type="switch"
                                id="trim-lines"
                                label="Trim Whitespace"
                                checked={options.trimLines}
                                onChange={(e) => setOptions({...options, trimLines: e.target.checked})}
                            />
                            <Form.Check 
                                type="switch"
                                id="remove-empty"
                                label="Remove Empty Lines"
                                checked={options.removeEmptyLines}
                                onChange={(e) => setOptions({...options, removeEmptyLines: e.target.checked})}
                            />
                        </div>
                    </div>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <Form.Label className="fw-bold mb-0">Original List:</Form.Label>
                            <Button variant="link" className="text-danger p-0 text-decoration-none small" onClick={handleClear}>
                                <FaTrash className="me-1" /> Clear
                            </Button>
                        </div>
                        <Form.Control 
                            as="textarea" 
                            rows={12} 
                            placeholder="Paste your list here (one item per line)..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="border-0 bg-light p-3 rounded-4 shadow-sm"
                            style={{ fontSize: '0.95rem', lineHeight: '1.5', minHeight: '350px' }}
                        />
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <Form.Label className="fw-bold mb-0">Cleaned List:</Form.Label>
                            <div className="d-flex gap-2">
                                <Button variant="link" className="text-primary p-0 text-decoration-none small" onClick={handleCopy}>
                                    <FaCopy className="me-1" /> Copy
                                </Button>
                                <Button variant="link" className="text-success p-0 text-decoration-none small" onClick={handleDownload}>
                                    <FaDownload className="me-1" /> Download
                                </Button>
                            </div>
                        </div>
                        <Form.Control 
                            as="textarea" 
                            rows={12} 
                            readOnly
                            value={outputText}
                            placeholder="Result will appear here..."
                            className="border-0 bg-white p-3 rounded-4 shadow-sm"
                            style={{ fontSize: '0.95rem', lineHeight: '1.5', minHeight: '350px' }}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row className="g-3 mt-2">
                <Col md={4}>
                    <div className="stats-card p-3 glass-card rounded-4 text-center border">
                        <FaListUl className="text-primary mb-2" />
                        <h5 className="fw-bold mb-0">{stats.original}</h5>
                        <span className="text-muted small">Original Lines</span>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="stats-card p-3 glass-card rounded-4 text-center border">
                        <FaStream className="text-success mb-2" />
                        <h5 className="fw-bold mb-0">{stats.unique}</h5>
                        <span className="text-muted small">Unique Lines</span>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="stats-card p-3 glass-card rounded-4 text-center border">
                        <FaMinusCircle className="text-danger mb-2" />
                        <h5 className="fw-bold mb-0">{stats.removed}</h5>
                        <span className="text-muted small">Duplicates Removed</span>
                    </div>
                </Col>
            </Row>

            <div className="mt-5 pt-4 border-top">
                <h3 className="h5 fw-bold mb-3">Professional Duplicate Line Remover</h3>
                <p className="text-muted">
                    Cleaning up large lists of data can be tedious. Our Duplicate Line Remover tool simplifies the process by identifying and removing redundant entries instantly. 
                    Whether you are cleaning an email list, organizing keywords for SEO, or processing code logs, this tool ensures your data is clean, unique, and well-formatted. 
                    The tool runs entirely in your browser, meaning your data never leaves your computer.
                </p>
                <ul className="text-muted small">
                    <li><strong>Case Sensitive:</strong> Toggle whether "Apple" and "apple" are considered the same.</li>
                    <li><strong>Trim Whitespace:</strong> Automatically remove leading and trailing spaces from each line.</li>
                    <li><strong>Remove Empty:</strong> Strip out blank lines from your final result.</li>
                </ul>
            </div>

            <ToastContainer position="bottom-end" className="p-3">
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide className="bg-dark text-white">
                    <Toast.Body className="d-flex align-items-center">
                        <FaCheck className="text-success me-2" /> {toastMsg}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default DuplicateLineRemover;
