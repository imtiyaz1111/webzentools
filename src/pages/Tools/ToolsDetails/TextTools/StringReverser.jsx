import React, { useState } from 'react';
import { Form, Row, Col, Button, Toast, ToastContainer } from 'react-bootstrap';
import { 
    FaExchangeAlt, FaArrowsAltH, FaTrash, FaCopy, 
    FaDownload, FaCheck, FaFont, FaAlignLeft, FaListUl
} from 'react-icons/fa';

const StringReverser = () => {
    const [inputText, setInputText] = useState('');
    const [mode, setMode] = useState('character'); // character, word, line
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    let outputText = '';
    let stats = { chars: 0, words: 0, lines: 0 };

    if (inputText) {
        if (mode === 'character') {
            outputText = inputText.split('').reverse().join('');
        } else if (mode === 'word') {
            outputText = inputText.split(/\s+/).reverse().join(' ');
        } else if (mode === 'line') {
            outputText = inputText.split(/\r?\n/).reverse().join('\n');
        }

        stats = {
            chars: inputText.length,
            words: inputText.trim() ? inputText.trim().split(/\s+/).length : 0,
            lines: inputText.trim() ? inputText.split(/\n/).length : 0
        };
    }

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
        element.download = `reversed-${mode}.txt`;
        document.body.appendChild(element);
        element.click();
        setToastMsg('File downloaded!');
        setShowToast(true);
    };

    const handleClear = () => {
        setInputText('');
        setToastMsg('Text cleared!');
        setShowToast(true);
    };

    return (
        <div className="string-reverser-tool">
            <div className="mode-selector mb-4 p-3 glass-card rounded-4 border d-flex justify-content-center gap-3">
                <Button 
                    variant={mode === 'character' ? 'primary' : 'outline-primary'} 
                    className="rounded-pill px-4 fw-bold"
                    onClick={() => setMode('character')}
                >
                    <FaFont className="me-2" /> Reverse Characters
                </Button>
                <Button 
                    variant={mode === 'word' ? 'primary' : 'outline-primary'} 
                    className="rounded-pill px-4 fw-bold"
                    onClick={() => setMode('word')}
                >
                    <FaArrowsAltH className="me-2" /> Reverse Words
                </Button>
                <Button 
                    variant={mode === 'line' ? 'primary' : 'outline-primary'} 
                    className="rounded-pill px-4 fw-bold"
                    onClick={() => setMode('line')}
                >
                    <FaListUl className="me-2" /> Reverse Lines
                </Button>
            </div>

            <Row className="g-4">
                <Col md={6}>
                    <Form.Group>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <Form.Label className="fw-bold mb-0">Original Text:</Form.Label>
                            <Button variant="link" className="text-danger p-0 text-decoration-none small" onClick={handleClear}>
                                <FaTrash className="me-1" /> Clear
                            </Button>
                        </div>
                        <Form.Control 
                            as="textarea" 
                            rows={10} 
                            placeholder="Enter text to reverse..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="border-0 bg-light p-3 rounded-4 shadow-sm"
                            style={{ fontSize: '1.05rem', lineHeight: '1.6', minHeight: '300px' }}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <Form.Label className="fw-bold mb-0">Reversed Result:</Form.Label>
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
                            value={outputText}
                            placeholder="Reversed text will appear here..."
                            className="border-0 bg-white p-3 rounded-4 shadow-sm"
                            style={{ fontSize: '1.05rem', lineHeight: '1.6', minHeight: '300px' }}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row className="g-3 mt-3">
                <Col md={4}>
                    <div className="stats-card p-3 glass-card rounded-3 text-center border">
                        <FaFont className="text-primary mb-2" />
                        <h5 className="fw-bold mb-0">{stats.chars}</h5>
                        <span className="text-muted small">Characters</span>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="stats-card p-3 glass-card rounded-3 text-center border">
                        <FaAlignLeft className="text-success mb-2" />
                        <h5 className="fw-bold mb-0">{stats.words}</h5>
                        <span className="text-muted small">Words</span>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="stats-card p-3 glass-card rounded-3 text-center border">
                        <FaListUl className="text-secondary mb-2" />
                        <h5 className="fw-bold mb-0">{stats.lines}</h5>
                        <span className="text-muted small">Lines</span>
                    </div>
                </Col>
            </Row>

            <div className="mt-5 pt-4 border-top">
                <h3 className="h5 fw-bold mb-3">Professional String Reverser</h3>
                <p className="text-muted">
                    Sometimes you need to flip text for specific coding tasks, creative design, or simply to check palindromes. 
                    Our String Reverser tool offers three distinct modes to handle any scenario:
                </p>
                <ul className="text-muted small">
                    <li><strong>Character Reverse:</strong> Flips every single character, including spaces and punctuation.</li>
                    <li><strong>Word Reverse:</strong> Keeps the characters of words intact but reverses the order of the words in a sentence.</li>
                    <li><strong>Line Reverse:</strong> Keeps the content of lines intact but reverses the order of the lines in a list.</li>
                </ul>
                <p className="text-muted small">
                    This tool operates entirely on your device, ensuring maximum speed and privacy for your data.
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

export default StringReverser;
