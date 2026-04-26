import React, { useState } from 'react';
import { Form, Row, Col, Button, Toast, ToastContainer } from 'react-bootstrap';
import { 
    FaCopy, FaTrash, FaDownload, FaFont, FaAlignLeft, 
    FaTextHeight, FaCheck, FaSortAlphaDown 
} from 'react-icons/fa';

const CaseConverter = () => {
    const [text, setText] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const characters = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.trim() ? text.split(/\n/).length : 0;
    const stats = { characters, words, lines };

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
        element.download = "converted-text.txt";
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

    // Case Conversion Functions
    const toSentenceCase = () => {
        const sentences = text.toLowerCase().split(/([.!?]\s*)/);
        const result = sentences.map(s => {
            if (s.length === 0) return s;
            if (/[.!?]\s*/.test(s)) return s;
            return s.charAt(0).toUpperCase() + s.slice(1);
        }).join('');
        setText(result);
    };

    const toLowerCase = () => setText(text.toLowerCase());
    const toUpperCase = () => setText(text.toUpperCase());

    const toCapitalizedCase = () => {
        const result = text.toLowerCase().split(' ').map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
        setText(result);
    };

    const toTitleCase = () => {
        const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i;
        const result = text.toLowerCase().split(' ').map((word, index, array) => {
            if (index > 0 && index < array.length - 1 && smallWords.test(word)) {
                return word.toLowerCase();
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
        setText(result);
    };

    const toAlternatingCase = () => {
        const result = text.split('').map((char, i) => {
            return i % 2 === 0 ? char.toLowerCase() : char.toUpperCase();
        }).join('');
        setText(result);
    };

    const toInverseCase = () => {
        const result = text.split('').map(char => {
            if (char === char.toUpperCase()) return char.toLowerCase();
            return char.toUpperCase();
        }).join('');
        setText(result);
    };

    const toSnakeCase = () => {
        setText(text.trim().toLowerCase().replace(/\s+/g, '_'));
    };

    const toKebabCase = () => {
        setText(text.trim().toLowerCase().replace(/\s+/g, '-'));
    };

    const toPascalCase = () => {
        const result = text.toLowerCase().split(/[\s_-]+/).map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join('');
        setText(result);
    };

    const toCamelCase = () => {
        const result = text.toLowerCase().split(/[\s_-]+/).map((word, index) => {
            if (index === 0) return word;
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join('');
        setText(result);
    };

    return (
        <div className="case-converter-tool">
            <Form.Group className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Label className="fw-bold mb-0">Input Text:</Form.Label>
                    <div className="d-flex gap-2">
                        <Button variant="link" className="text-danger p-0 text-decoration-none small" onClick={handleClear}>
                            <FaTrash className="me-1" /> Clear
                        </Button>
                    </div>
                </div>
                <Form.Control 
                    as="textarea" 
                    rows={10} 
                    placeholder="Type or paste your content here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="border-0 bg-light p-4 rounded-4 shadow-sm"
                    style={{ fontSize: '1.05rem', lineHeight: '1.6', minHeight: '300px' }}
                />
            </Form.Group>

            <div className="conversion-actions mb-4">
                <h6 className="fw-bold mb-3 text-muted">Conversion Options</h6>
                <div className="d-flex flex-wrap gap-2">
                    <Button variant="outline-primary" className="rounded-pill px-4" onClick={toSentenceCase}>Sentence case</Button>
                    <Button variant="outline-primary" className="rounded-pill px-4" onClick={toLowerCase}>lower case</Button>
                    <Button variant="outline-primary" className="rounded-pill px-4" onClick={toUpperCase}>UPPER CASE</Button>
                    <Button variant="outline-primary" className="rounded-pill px-4" onClick={toCapitalizedCase}>Capitalized Case</Button>
                    <Button variant="outline-primary" className="rounded-pill px-4" onClick={toTitleCase}>Title Case</Button>
                    <Button variant="outline-primary" className="rounded-pill px-4" onClick={toAlternatingCase}>aLtErNaTiNg cAsE</Button>
                    <Button variant="outline-primary" className="rounded-pill px-4" onClick={toInverseCase}>InVeRsE CaSe</Button>
                    <Button variant="outline-secondary" className="rounded-pill px-4" onClick={toSnakeCase}>snake_case</Button>
                    <Button variant="outline-secondary" className="rounded-pill px-4" onClick={toKebabCase}>kebab-case</Button>
                    <Button variant="outline-secondary" className="rounded-pill px-4" onClick={toPascalCase}>PascalCase</Button>
                    <Button variant="outline-secondary" className="rounded-pill px-4" onClick={toCamelCase}>camelCase</Button>
                </div>
            </div>

            <Row className="g-3 mb-4">
                <Col md={4}>
                    <div className="stats-card p-3 glass-card rounded-3 text-center border">
                        <FaAlignLeft className="text-primary mb-2" />
                        <h5 className="fw-bold mb-0">{stats.words}</h5>
                        <span className="text-muted small">Words</span>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="stats-card p-3 glass-card rounded-3 text-center border">
                        <FaTextHeight className="text-secondary mb-2" />
                        <h5 className="fw-bold mb-0">{stats.characters}</h5>
                        <span className="text-muted small">Characters</span>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="stats-card p-3 glass-card rounded-3 text-center border">
                        <FaSortAlphaDown className="text-success mb-2" />
                        <h5 className="fw-bold mb-0">{stats.lines}</h5>
                        <span className="text-muted small">Lines</span>
                    </div>
                </Col>
            </Row>

            <div className="d-flex gap-3 justify-content-center">
                <Button variant="primary" className="rounded-pill px-5 py-2 fw-bold d-flex align-items-center" onClick={handleCopy}>
                    <FaCopy className="me-2" /> Copy to Clipboard
                </Button>
                <Button variant="success" className="rounded-pill px-5 py-2 fw-bold d-flex align-items-center" onClick={handleDownload}>
                    <FaDownload className="me-2" /> Download .txt
                </Button>
            </div>

            <div className="mt-5 pt-4 border-top">
                <h3 className="h5 fw-bold mb-3">About Case Converter</h3>
                <p className="text-muted">
                    This premium Case Converter tool allows you to easily transform any text into various formats. 
                    Whether you need to fix accidentally pressed caps lock, capitalize titles for an essay, or format strings for programming (like snake_case or camelCase), 
                    this tool provides a fast and reliable solution. All processing happens locally in your browser, ensuring your data remains private.
                </p>
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

export default CaseConverter;
