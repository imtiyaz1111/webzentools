import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Toast, ToastContainer } from 'react-bootstrap';
import { 
    FaSortAmountDown, FaSortAmountUp, FaSortAlphaDown, FaSortAlphaUp, 
    FaSortNumericDown, FaSortNumericUp, FaRandom, FaTrash, FaCopy, 
    FaDownload, FaCheck, FaStream 
} from 'react-icons/fa';

const TextLineSorter = () => {
    const [text, setText] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [lineCount, setLineCount] = useState(0);

    // Options
    const [options, setOptions] = useState({
        trimLines: true,
        removeEmpty: true
    });

    useEffect(() => {
        const count = text.trim() ? text.split(/\n/).length : 0;
        setLineCount(count);
    }, [text]);

    const handleCopy = () => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setToastMsg('Copied to clipboard!');
        setShowToast(true);
    };

    const handleDownload = () => {
        if (!text) return;
        const element = document.createElement("a");
        const file = new Blob([text], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "sorted-text.txt";
        document.body.appendChild(element);
        element.click();
        setToastMsg('File downloaded!');
        setShowToast(true);
    };

    const handleClear = () => {
        setText('');
        setToastMsg('Text cleared!');
        setShowToast(true);
    };

    const getProcessedLines = () => {
        let lines = text.split(/\r?\n/);
        if (options.trimLines) lines = lines.map(l => l.trim());
        if (options.removeEmpty) lines = lines.filter(l => l.length > 0);
        return lines;
    };

    const sortAZ = () => {
        const lines = getProcessedLines();
        setText(lines.sort((a, b) => a.localeCompare(b)).join('\n'));
    };

    const sortZA = () => {
        const lines = getProcessedLines();
        setText(lines.sort((a, b) => b.localeCompare(a)).join('\n'));
    };

    const sortLengthAsc = () => {
        const lines = getProcessedLines();
        setText(lines.sort((a, b) => a.length - b.length).join('\n'));
    };

    const sortLengthDesc = () => {
        const lines = getProcessedLines();
        setText(lines.sort((a, b) => b.length - a.length).join('\n'));
    };

    const sortNumericAsc = () => {
        const lines = getProcessedLines();
        setText(lines.sort((a, b) => {
            const numA = parseFloat(a.replace(/[^\d.-]/g, '')) || 0;
            const numB = parseFloat(b.replace(/[^\d.-]/g, '')) || 0;
            return numA - numB;
        }).join('\n'));
    };

    const sortNumericDesc = () => {
        const lines = getProcessedLines();
        setText(lines.sort((a, b) => {
            const numA = parseFloat(a.replace(/[^\d.-]/g, '')) || 0;
            const numB = parseFloat(b.replace(/[^\d.-]/g, '')) || 0;
            return numB - numA;
        }).join('\n'));
    };

    const shuffle = () => {
        const lines = getProcessedLines();
        for (let i = lines.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [lines[i], lines[j]] = [lines[j], lines[i]];
        }
        setText(lines.join('\n'));
    };

    return (
        <div className="text-sorter-tool">
            <Form.Group className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Label className="fw-bold mb-0">Text to Sort:</Form.Label>
                    <div className="d-flex gap-3">
                        <Form.Check 
                            type="checkbox"
                            id="trim-lines"
                            label="Trim"
                            checked={options.trimLines}
                            onChange={(e) => setOptions({...options, trimLines: e.target.checked})}
                            className="small"
                        />
                        <Form.Check 
                            type="checkbox"
                            id="remove-empty"
                            label="Remove Empty"
                            checked={options.removeEmpty}
                            onChange={(e) => setOptions({...options, removeEmpty: e.target.checked})}
                            className="small"
                        />
                        <Button variant="link" className="text-danger p-0 text-decoration-none small ms-2" onClick={handleClear}>
                            <FaTrash className="me-1" /> Clear
                        </Button>
                    </div>
                </div>
                <Form.Control 
                    as="textarea" 
                    rows={12} 
                    placeholder="Paste your lines here to sort..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="border-0 bg-light p-4 rounded-4 shadow-sm"
                    style={{ fontSize: '1rem', lineHeight: '1.6', minHeight: '350px' }}
                />
            </Form.Group>

            <div className="sorting-actions mb-4">
                <h6 className="fw-bold mb-3 text-muted">Sorting Tools</h6>
                <div className="d-flex flex-wrap gap-2">
                    <Button variant="outline-primary" className="rounded-pill px-3" onClick={sortAZ}>
                        <FaSortAlphaDown className="me-2" /> A-Z
                    </Button>
                    <Button variant="outline-primary" className="rounded-pill px-3" onClick={sortZA}>
                        <FaSortAlphaUp className="me-2" /> Z-A
                    </Button>
                    <Button variant="outline-success" className="rounded-pill px-3" onClick={sortNumericAsc}>
                        <FaSortNumericDown className="me-2" /> Numeric 0-9
                    </Button>
                    <Button variant="outline-success" className="rounded-pill px-3" onClick={sortNumericDesc}>
                        <FaSortNumericUp className="me-2" /> Numeric 9-0
                    </Button>
                    <Button variant="outline-info" className="rounded-pill px-3" onClick={sortLengthAsc}>
                        <FaSortAmountDown className="me-2" /> Length (Shortest)
                    </Button>
                    <Button variant="outline-info" className="rounded-pill px-3" onClick={sortLengthDesc}>
                        <FaSortAmountUp className="me-2" /> Length (Longest)
                    </Button>
                    <Button variant="outline-secondary" className="rounded-pill px-3" onClick={shuffle}>
                        <FaRandom className="me-2" /> Shuffle
                    </Button>
                </div>
            </div>

            <div className="stats-card p-3 glass-card rounded-4 mb-4 border text-center">
                <div className="d-flex align-items-center justify-content-center gap-3">
                    <FaStream className="text-primary" />
                    <span className="fw-bold fs-5">{lineCount}</span>
                    <span className="text-muted">Total Lines</span>
                </div>
            </div>

            <div className="d-flex gap-3 justify-content-center mt-4">
                <Button variant="primary" className="rounded-pill px-5 py-2 fw-bold d-flex align-items-center" onClick={handleCopy}>
                    <FaCopy className="me-2" /> Copy to Clipboard
                </Button>
                <Button variant="success" className="rounded-pill px-5 py-2 fw-bold d-flex align-items-center" onClick={handleDownload}>
                    <FaDownload className="me-2" /> Download .txt
                </Button>
            </div>

            <div className="mt-5 pt-4 border-top">
                <h3 className="h5 fw-bold mb-3">Professional Text Line Sorter</h3>
                <p className="text-muted">
                    Organizing data manually can take hours. Our Text Line Sorter tool provides multiple ways to arrange your lists instantly. 
                    From simple alphabetical sorting to complex length-based or numeric ordering, it's designed to handle everything from keyword lists and email addresses to numerical data. 
                    The shuffle feature is also perfect for creating randomized lists for contests or testing.
                </p>
                <div className="row mt-3 text-muted small">
                    <div className="col-md-4">
                        <strong>Alphabetical:</strong> Arrange lines by their dictionary order.
                    </div>
                    <div className="col-md-4">
                        <strong>Numeric:</strong> Smart detection of numbers within lines for mathematical sorting.
                    </div>
                    <div className="col-md-4">
                        <strong>Length:</strong> Organize lines based on character count.
                    </div>
                </div>
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

export default TextLineSorter;
