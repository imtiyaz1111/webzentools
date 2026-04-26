import React, { useState } from 'react';
import { Form, Row, Col, Button, Toast, ToastContainer } from 'react-bootstrap';
import { 
    FaExchangeAlt, FaMicrochip, FaTrash, FaCopy, 
    FaDownload, FaCheck, FaKeyboard, FaTerminal 
} from 'react-icons/fa';

const TextToBinary = () => {
    const [input, setInput] = useState('');
    const [isBinaryToText, setIsBinaryToText] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    const convertToBinary = (str) => {
        return str.split('').map(char => {
            return char.charCodeAt(0).toString(2).padStart(8, '0');
        }).join(' ');
    };

    const convertToText = (bin) => {
        try {
            return bin.split(/\s+/).filter(x => x).map(b => {
                return String.fromCharCode(parseInt(b, 2));
            }).join('');
        } catch {
            return 'Invalid binary format';
        }
    };

    const output = input ? (isBinaryToText ? convertToText(input) : convertToBinary(input)) : '';

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setToastMsg('Copied to clipboard!');
        setShowToast(true);
    };

    const handleDownload = () => {
        if (!output) return;
        const element = document.createElement("a");
        const file = new Blob([output], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = isBinaryToText ? "decoded-text.txt" : "encoded-binary.txt";
        document.body.appendChild(element);
        element.click();
        setToastMsg('File downloaded!');
        setShowToast(true);
    };

    const toggleMode = () => {
        const tempInput = output;
        setIsBinaryToText(!isBinaryToText);
        setInput(tempInput);
    };

    return (
        <div className="text-to-binary-tool">
            <div className="mode-toggle mb-4 text-center">
                <Button 
                    variant="outline-primary" 
                    className="rounded-pill px-5 py-2 fw-bold d-flex align-items-center mx-auto"
                    onClick={toggleMode}
                >
                    {isBinaryToText ? (
                        <><FaTerminal className="me-2" /> Binary to Text</>
                    ) : (
                        <><FaKeyboard className="me-2" /> Text to Binary</>
                    )}
                    <FaExchangeAlt className="ms-3" />
                </Button>
            </div>

            <Row className="g-4">
                <Col md={6}>
                    <Form.Group>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <Form.Label className="fw-bold mb-0">
                                {isBinaryToText ? 'Enter Binary Content:' : 'Enter ASCII Text:'}
                            </Form.Label>
                            <Button variant="link" className="text-danger p-0 text-decoration-none small" onClick={() => setInput('')}>
                                <FaTrash className="me-1" /> Clear
                            </Button>
                        </div>
                        <Form.Control 
                            as="textarea" 
                            rows={10} 
                            placeholder={isBinaryToText ? "01001000 01001001..." : "Type your text here..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="border-0 bg-light p-3 rounded-4 shadow-sm"
                            style={{ fontSize: '1rem', lineHeight: '1.6', minHeight: '300px' }}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <Form.Label className="fw-bold mb-0">
                                {isBinaryToText ? 'Decoded Text:' : 'Encoded Binary:'}
                            </Form.Label>
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
                            rows={10} 
                            readOnly
                            value={output}
                            placeholder="Result will appear here..."
                            className="border-0 bg-white p-3 rounded-4 shadow-sm"
                            style={{ fontSize: '1rem', lineHeight: '1.6', minHeight: '300px' }}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row className="g-3 mt-3">
                <Col md={4}>
                    <div className="stats-card p-3 glass-card rounded-4 text-center border">
                        <FaMicrochip className="text-primary mb-2" />
                        <h5 className="fw-bold mb-0">{output ? (isBinaryToText ? output.length : output.split(' ').length) : 0}</h5>
                        <span className="text-muted small">Bytes / Characters</span>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="stats-card p-3 glass-card rounded-4 text-center border">
                        <FaTerminal className="text-success mb-2" />
                        <h5 className="fw-bold mb-0">{output ? (isBinaryToText ? output.length * 8 : output.replace(/\s/g, '').length) : 0}</h5>
                        <span className="text-muted small">Total Bits</span>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="stats-card p-3 glass-card rounded-4 text-center border">
                        <FaExchangeAlt className="text-secondary mb-2" />
                        <h5 className="fw-bold mb-0">{isBinaryToText ? 'Decoding' : 'Encoding'}</h5>
                        <span className="text-muted small">Current Mode</span>
                    </div>
                </Col>
            </Row>

            <div className="mt-5 pt-4 border-top">
                <h3 className="h5 fw-bold mb-3">Professional Text to Binary Converter</h3>
                <p className="text-muted">
                    This premium utility allows you to encode any ASCII text into its binary equivalent (0s and 1s) and decode binary back into readable text. 
                    Binary is the base language of all computers, and this tool is perfect for educational purposes, low-level data analysis, or simply for creating encoded messages. 
                    Each character is converted into an 8-bit byte, following the standard ASCII/UTF-8 character encoding.
                </p>
                <div className="row mt-4 g-4 text-muted small">
                    <div className="col-md-6">
                        <div className="p-3 bg-light rounded-3">
                            <strong>How it works:</strong> Each character has a decimal ASCII code (e.g., 'A' is 65). This tool converts that decimal value into an 8-digit binary string (01000001).
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="p-3 bg-light rounded-3">
                            <strong>Privacy:</strong> All conversions are done locally on your device. Your text and binary data are never sent to our servers.
                        </div>
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

export default TextToBinary;
