import React, { useState } from 'react';
import { Form, Row, Col, Button, Toast, ToastContainer } from 'react-bootstrap';
import { 
    FaEraser, FaCompressAlt, FaTrash, FaCopy, 
    FaDownload, FaCheck, FaTextWidth, FaArrowsAltH 
} from 'react-icons/fa';

const WhitespaceRemover = () => {
    const [text, setText] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [stats, setStats] = useState({
        original: 0,
        cleaned: 0,
        reduction: 0
    });

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
        element.download = "cleaned-text.txt";
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

    const applyCleaning = (newText) => {
        const reduction = text.length - newText.length;
        setText(newText);
        setStats(prev => ({ ...prev, cleaned: newText.length, reduction: prev.reduction + reduction }));
    };

    const removeAllSpaces = () => applyCleaning(text.replace(/\s/g, ''));
    const removeExtraSpaces = () => applyCleaning(text.replace(/  +/g, ' '));
    const removeTabs = () => applyCleaning(text.replace(/\t/g, ' '));
    const removeAllNewlines = () => applyCleaning(text.replace(/\n/g, ' '));
    const removeExtraNewlines = () => applyCleaning(text.replace(/\n\s*\n/g, '\n\n'));
    const trimAllLines = () => applyCleaning(text.split(/\n/).map(line => line.trim()).join('\n'));

    return (
        <div className="whitespace-remover-tool">
            <Form.Group className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Label className="fw-bold mb-0">Input Text:</Form.Label>
                    <Button variant="link" className="text-danger p-0 text-decoration-none small" onClick={handleClear}>
                        <FaTrash className="me-1" /> Clear
                    </Button>
                </div>
                <Form.Control 
                    as="textarea" 
                    rows={12} 
                    placeholder="Paste your text with messy whitespace here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="border-0 bg-light p-4 rounded-4 shadow-sm"
                    style={{ fontSize: '1rem', lineHeight: '1.6', minHeight: '350px' }}
                />
            </Form.Group>

            <div className="cleaning-actions mb-4">
                <h6 className="fw-bold mb-3 text-muted">Cleaning Actions</h6>
                <div className="d-flex flex-wrap gap-2">
                    <Button variant="outline-primary" className="rounded-pill px-3" onClick={removeExtraSpaces}>
                        <FaCompressAlt className="me-2" /> Remove Extra Spaces
                    </Button>
                    <Button variant="outline-primary" className="rounded-pill px-3" onClick={trimAllLines}>
                        <FaTextWidth className="me-2" /> Trim All Lines
                    </Button>
                    <Button variant="outline-info" className="rounded-pill px-3" onClick={removeExtraNewlines}>
                        <FaArrowsAltH className="me-2" /> Remove Extra Newlines
                    </Button>
                    <Button variant="outline-info" className="rounded-pill px-3" onClick={removeTabs}>
                        <FaEraser className="me-2" /> Convert Tabs to Spaces
                    </Button>
                    <Button variant="outline-danger" className="rounded-pill px-3" onClick={removeAllSpaces}>
                        <FaTrash className="me-2" /> Strip All Whitespace
                    </Button>
                    <Button variant="outline-danger" className="rounded-pill px-3" onClick={removeAllNewlines}>
                        <FaTrash className="me-2" /> Remove All Newlines
                    </Button>
                </div>
            </div>

            <Row className="g-3 mb-4">
                <Col md={4}>
                    <div className="stats-card p-3 glass-card rounded-4 text-center border">
                        <div className="small text-muted mb-1">Current Size</div>
                        <h5 className="fw-bold mb-0">{text.length} <span className="small fw-normal">chars</span></h5>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="stats-card p-3 glass-card rounded-4 text-center border bg-primary bg-opacity-10 border-primary border-opacity-25">
                        <div className="small text-primary fw-bold mb-1">Total Reduction</div>
                        <h5 className="fw-bold mb-0 text-primary">{stats.reduction} <span className="small fw-normal">chars</span></h5>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="stats-card p-3 glass-card rounded-4 text-center border">
                        <div className="small text-muted mb-1">Savings</div>
                        <h5 className="fw-bold mb-0">{text.length > 0 ? Math.round((stats.reduction / (text.length + stats.reduction)) * 100) : 0}%</h5>
                    </div>
                </Col>
            </Row>

            <div className="d-flex gap-3 justify-content-center">
                <Button variant="primary" className="rounded-pill px-5 py-2 fw-bold d-flex align-items-center" onClick={handleCopy}>
                    <FaCopy className="me-2" /> Copy Cleaned Text
                </Button>
                <Button variant="success" className="rounded-pill px-5 py-2 fw-bold d-flex align-items-center" onClick={handleDownload}>
                    <FaDownload className="me-2" /> Download .txt
                </Button>
            </div>

            <div className="mt-5 pt-4 border-top">
                <h3 className="h5 fw-bold mb-3">Professional Whitespace Remover</h3>
                <p className="text-muted">
                    Cleaning up text for data processing, coding, or publishing often requires stripping away unnecessary whitespace. 
                    Our Whitespace Remover tool provides specialized cleaning functions to handle everything from double-spaces and tabs to extra line breaks. 
                    Whether you need to minify a string for code or just clean up a messy document, this tool offers a fast, client-side solution.
                </p>
                <div className="row mt-3 text-muted small">
                    <div className="col-md-4">
                        <strong>Extra Spaces:</strong> Condenses multiple spaces into a single space.
                    </div>
                    <div className="col-md-4">
                        <strong>Trim:</strong> Removes whitespace from the beginning and end of every line.
                    </div>
                    <div className="col-md-4">
                        <strong>Strip All:</strong> Aggressively removes every single space, tab, and newline.
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

export default WhitespaceRemover;
