import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Toast, ToastContainer, InputGroup } from 'react-bootstrap';
import { 
    FaCopy, FaDownload, FaSyncAlt, FaParagraph, FaFont, 
    FaListUl, FaCheck, FaTrash, FaPenNib
} from 'react-icons/fa';

const LOREM_WORDS = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

const LoremIpsumGenerator = () => {
    const [result, setResult] = useState('');
    const [type, setType] = useState('paragraphs');
    const [count, setCount] = useState(3);
    const [startWithLorem, setStartWithLorem] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    const getRandomWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];

    const generateSentence = () => {
        const length = Math.floor(Math.random() * 10) + 8;
        let sentence = [];
        for (let i = 0; i < length; i++) sentence.push(getRandomWord());
        let str = sentence.join(' ');
        return str.charAt(0).toUpperCase() + str.slice(1) + '.';
    };

    const generateParagraph = () => {
        const length = Math.floor(Math.random() * 4) + 4;
        let p = [];
        for (let i = 0; i < length; i++) p.push(generateSentence());
        return p.join(' ');
    };

    const handleGenerate = () => {
        let output = [];
        if (type === 'paragraphs') {
            for (let i = 0; i < count; i++) output.push(generateParagraph());
            let final = output.join('\n\n');
            if (startWithLorem) final = "Lorem ipsum dolor sit amet, " + final.charAt(0).toLowerCase() + final.slice(1);
            setResult(final);
        } else if (type === 'sentences') {
            for (let i = 0; i < count; i++) output.push(generateSentence());
            let final = output.join(' ');
            if (startWithLorem) final = "Lorem ipsum dolor sit amet. " + final;
            setResult(final);
        } else if (type === 'words') {
            for (let i = 0; i < count; i++) output.push(getRandomWord());
            let final = output.join(' ');
            if (startWithLorem) final = "Lorem ipsum " + final;
            setResult(final);
        } else if (type === 'lists') {
            for (let i = 0; i < count; i++) output.push("• " + generateSentence());
            setResult(output.join('\n'));
        }
    };

    useEffect(() => {
        handleGenerate();
    }, []);

    const handleCopy = () => {
        if (!result) return;
        navigator.clipboard.writeText(result);
        setToastMsg('Copied to clipboard!');
        setShowToast(true);
    };

    const handleDownload = () => {
        if (!result) return;
        const element = document.createElement("a");
        const file = new Blob([result], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "lorem-ipsum.txt";
        document.body.appendChild(element);
        element.click();
        setToastMsg('File downloaded!');
        setShowToast(true);
    };

    const handleClear = () => {
        setResult('');
        setToastMsg('Text cleared!');
        setShowToast(true);
    };

    return (
        <div className="lorem-generator-tool">
            <div className="control-panel p-4 glass-card rounded-4 mb-4 border">
                <Row className="g-3 align-items-end">
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label className="fw-bold small text-muted">Generate Type</Form.Label>
                            <Form.Select 
                                value={type} 
                                onChange={(e) => setType(e.target.value)}
                                className="rounded-pill border-primary border-opacity-25"
                            >
                                <option value="paragraphs">Paragraphs</option>
                                <option value="sentences">Sentences</option>
                                <option value="words">Words</option>
                                <option value="lists">List Items</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label className="fw-bold small text-muted">Quantity</Form.Label>
                            <InputGroup>
                                <Form.Control 
                                    type="number" 
                                    min="1" 
                                    max="50" 
                                    value={count} 
                                    onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                                    className="rounded-start-pill border-primary border-opacity-25"
                                />
                                <InputGroup.Text className="rounded-end-pill bg-light border-primary border-opacity-25">
                                    {type}
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Check 
                            type="switch"
                            id="start-with-lorem"
                            label="Start with 'Lorem Ipsum'"
                            checked={startWithLorem}
                            onChange={(e) => setStartWithLorem(e.target.checked)}
                            className="mb-2 fw-medium"
                        />
                    </Col>
                    <Col md={3}>
                        <Button variant="primary" className="w-100 rounded-pill py-2 fw-bold" onClick={handleGenerate}>
                            <FaSyncAlt className="me-2" /> Generate
                        </Button>
                    </Col>
                </Row>
            </div>

            <Form.Group className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Label className="fw-bold mb-0">Generated Placeholder Text:</Form.Label>
                    <Button variant="link" className="text-danger p-0 text-decoration-none small" onClick={handleClear}>
                        <FaTrash className="me-1" /> Clear
                    </Button>
                </div>
                <Form.Control 
                    as="textarea" 
                    rows={12} 
                    value={result}
                    readOnly
                    placeholder="Click generate to see text here..."
                    className="border-0 bg-light p-4 rounded-4 shadow-sm"
                    style={{ fontSize: '1.05rem', lineHeight: '1.7', minHeight: '400px' }}
                />
            </Form.Group>

            <Row className="g-3 mb-4">
                <Col md={4}>
                    <div className="stats-card p-3 glass-card rounded-3 text-center border">
                        <FaParagraph className="text-primary mb-2" />
                        <h5 className="fw-bold mb-0">{result.split(/\n\n/).filter(x => x).length}</h5>
                        <span className="text-muted small">Paragraphs</span>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="stats-card p-3 glass-card rounded-3 text-center border">
                        <FaPenNib className="text-success mb-2" />
                        <h5 className="fw-bold mb-0">{result.split(' ').filter(x => x).length}</h5>
                        <span className="text-muted small">Words</span>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="stats-card p-3 glass-card rounded-3 text-center border">
                        <FaFont className="text-secondary mb-2" />
                        <h5 className="fw-bold mb-0">{result.length}</h5>
                        <span className="text-muted small">Characters</span>
                    </div>
                </Col>
            </Row>

            <div className="d-flex gap-3 justify-content-center">
                <Button variant="primary" className="rounded-pill px-5 py-2 fw-bold d-flex align-items-center shadow-sm" onClick={handleCopy}>
                    <FaCopy className="me-2" /> Copy to Clipboard
                </Button>
                <Button variant="success" className="rounded-pill px-5 py-2 fw-bold d-flex align-items-center shadow-sm" onClick={handleDownload}>
                    <FaDownload className="me-2" /> Download .txt
                </Button>
            </div>

            <div className="mt-5 pt-4 border-top">
                <h3 className="h5 fw-bold mb-3">About Lorem Ipsum Generator</h3>
                <p className="text-muted">
                    Lorem Ipsum is the industry standard dummy text used by designers and developers to simulate content in layouts. 
                    Our premium generator allows you to create precisely the amount of text you need, whether it's a few paragraphs for a blog post mock-up, 
                    a list of items for a sidebar, or just a few specific words for a headline.
                </p>
                <div className="row mt-3 text-muted small">
                    <div className="col-md-6">
                        <ul className="list-unstyled">
                            <li className="mb-2"><FaCheck className="text-success me-2" /> <strong>Professional Quality:</strong> Mimics natural sentence flow and paragraph length.</li>
                            <li><FaCheck className="text-success me-2" /> <strong>Clean Output:</strong> No hidden characters, just pure UTF-8 text.</li>
                        </ul>
                    </div>
                    <div className="col-md-6">
                        <ul className="list-unstyled">
                            <li className="mb-2"><FaCheck className="text-success me-2" /> <strong>Versatile:</strong> Generate paragraphs, sentences, words, or lists.</li>
                            <li><FaCheck className="text-success me-2" /> <strong>Fast:</strong> Instant generation with zero latency.</li>
                        </ul>
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

export default LoremIpsumGenerator;
