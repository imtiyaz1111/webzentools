import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { FaClock, FaParagraph, FaFont, FaAlignLeft } from 'react-icons/fa';

const WordCounter = () => {
    const [text, setText] = useState('');
    const [stats, setStats] = useState({
        words: 0,
        characters: 0,
        paragraphs: 0,
        readingTime: 0
    });

    useEffect(() => {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const characters = text.length;
        const paragraphs = text.trim() ? text.split(/\n\s*\n/).length : 0;
        const readingTime = Math.ceil(words / 200); // Avg 200 wpm

        setStats({ words, characters, paragraphs, readingTime });
    }, [text]);

    const handleClear = () => setText('');

    return (
        <div className="word-counter-tool">
            <Form.Group className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Label className="fw-bold mb-0">Enter your text below:</Form.Label>
                    <button className="btn btn-link btn-sm text-danger text-decoration-none" onClick={handleClear}>
                        Clear Text
                    </button>
                </div>
                <Form.Control 
                    as="textarea" 
                    rows={12} 
                    placeholder="Type or paste your content here to see instant statistics..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="border-0 bg-light p-4 rounded-4"
                    style={{ fontSize: '1rem', lineHeight: '1.6' }}
                />
            </Form.Group>

            <Row className="g-3">
                <Col md={3} xs={6}>
                    <div className="stats-card p-3 glass-card rounded-3 text-center">
                        <FaAlignLeft className="text-primary mb-2" />
                        <h4 className="fw-bold mb-0">{stats.words}</h4>
                        <span className="text-muted small">Words</span>
                    </div>
                </Col>
                <Col md={3} xs={6}>
                    <div className="stats-card p-3 glass-card rounded-3 text-center">
                        <FaFont className="text-secondary mb-2" />
                        <h4 className="fw-bold mb-0">{stats.characters}</h4>
                        <span className="text-muted small">Characters</span>
                    </div>
                </Col>
                <Col md={3} xs={6}>
                    <div className="stats-card p-3 glass-card rounded-3 text-center">
                        <FaParagraph className="text-success mb-2" />
                        <h4 className="fw-bold mb-0">{stats.paragraphs}</h4>
                        <span className="text-muted small">Paragraphs</span>
                    </div>
                </Col>
                <Col md={3} xs={6}>
                    <div className="stats-card p-3 glass-card rounded-3 text-center">
                        <FaClock className="text-warning mb-2" />
                        <h4 className="fw-bold mb-0">{stats.readingTime}m</h4>
                        <span className="text-muted small">Read Time</span>
                    </div>
                </Col>
            </Row>

            <div className="mt-5 pt-4 border-top">
                <h3 className="h5 fw-bold mb-3">Professional Text Analysis</h3>
                <p className="text-muted small">
                    This word counter tool provides real-time statistics for your writing projects. Whether you are drafting a blog post, a social media caption, or an academic essay, monitoring word count and reading time is crucial for audience engagement.
                </p>
                <div className="d-flex gap-4 mt-3">
                    <div className="small text-muted">Estimated Speaking Time: <strong>{Math.ceil(stats.words / 130)} minutes</strong></div>
                    <div className="small text-muted">Social Media Ready: <strong>{stats.characters <= 280 ? '✅ Twitter' : '❌ Too Long for Twitter'}</strong></div>
                </div>
            </div>
        </div>
    );
};

export default WordCounter;
