import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Form, Table, Nav, Tab, Badge } from 'react-bootstrap';
import { FaSearch, FaUndo, FaFileAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './KeywordDensityChecker.css';

const STOP_WORDS = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having', 'here', 'how', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 's', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'you', 'your', 'yours', 'yourself', 'yourselves'
]);

const KeywordDensityChecker = () => {
    const [text, setText] = useState('');
    const [results, setResults] = useState({
        oneWord: [],
        twoWords: [],
        threeWords: [],
        stats: {
            totalWords: 0,
            uniqueWords: 0,
            readingTime: 0
        }
    });
    const [excludeStopWords, setExcludeStopWords] = useState(true);

    const analyzeText = useCallback(() => {
        if (!text.trim()) {
            setResults({
                oneWord: [],
                twoWords: [],
                threeWords: [],
                stats: { totalWords: 0, uniqueWords: 0, readingTime: 0 }
            });
            return;
        }

        // Tokenize and clean
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(w => w.length > 0);

        const totalWordsCount = words.length;
        const readingTime = Math.ceil(totalWordsCount / 200); // Avg 200 wpm

        // Helper for N-grams
        const getNgrams = (size, filterStopWords) => {
            const counts = {};
            for (let i = 0; i <= words.length - size; i++) {
                const ngram = words.slice(i, i + size).join(' ');
                
                // For single words, check stop words if requested
                if (size === 1 && filterStopWords && STOP_WORDS.has(ngram)) continue;
                
                // For phrases, maybe skip if all words are stop words? 
                // Usually for SEO, we want phrases even if they contain stop words, but single words are filtered.
                
                counts[ngram] = (counts[ngram] || 0) + 1;
            }
            
            return Object.entries(counts)
                .map(([keyword, count]) => ({
                    keyword,
                    count,
                    density: ((count / totalWordsCount) * 100).toFixed(2)
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 50); // Top 50
        };

        const oneWord = getNgrams(1, excludeStopWords);
        const twoWords = getNgrams(2, false);
        const threeWords = getNgrams(3, false);
        const uniqueWords = new Set(words).size;

        setResults({
            oneWord,
            twoWords,
            threeWords,
            stats: {
                totalWords: totalWordsCount,
                uniqueWords,
                readingTime
            }
        });
    }, [text, excludeStopWords]);

    useEffect(() => {
        const timeout = setTimeout(analyzeText, 500); // Debounce
        return () => clearTimeout(timeout);
    }, [text, excludeStopWords, analyzeText]);

    const handleReset = () => {
        setText('');
    };

    const renderTable = (data) => (
        <div className="keyword-table-container">
            <Table hover responsive className="mb-0">
                <thead>
                    <tr>
                        <th>Keyword / Phrase</th>
                        <th>Count</th>
                        <th>Density</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? data.map((item, index) => (
                        <tr key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                            <td>
                                <span className="keyword-tag">{item.keyword}</span>
                            </td>
                            <td className="fw-bold">{item.count}</td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <span className="me-2" style={{ minWidth: '45px' }}>{item.density}%</span>
                                    <div className="density-bar-wrapper flex-grow-1">
                                        <div 
                                            className="density-bar" 
                                            style={{ width: `${Math.min(parseFloat(item.density) * 10, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="3" className="text-center py-4 text-muted">No keywords found</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );

    return (
        <div className="keyword-density-checker">
            <Row className="gy-4">
                <Col lg={7}>
                    <div className="p-4 glass-card rounded-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0">Content to Analyze</h5>
                            <button className="btn btn-link text-muted p-0" onClick={handleReset}>
                                <FaUndo className="me-1" /> Reset
                            </button>
                        </div>
                        <Form.Group className="mb-3">
                            <Form.Control
                                as="textarea"
                                className="analysis-textarea rounded-3 p-3 shadow-sm"
                                placeholder="Paste your article or text here for SEO analysis..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </Form.Group>
                        <div className="d-flex align-items-center">
                            <Form.Check 
                                type="switch"
                                id="stop-words-switch"
                                label="Exclude Common Stop Words"
                                checked={excludeStopWords}
                                onChange={(e) => setExcludeStopWords(e.target.checked)}
                                className="small text-muted"
                            />
                        </div>
                    </div>
                </Col>

                <Col lg={5}>
                    <Row className="gy-3">
                        <Col xs={6}>
                            <div className="p-3 glass-card rounded-4 stat-card h-100">
                                <p className="text-muted small mb-1">Total Words</p>
                                <h3 className="fw-bold text-gradient mb-0">{results.stats.totalWords}</h3>
                            </div>
                        </Col>
                        <Col xs={6}>
                            <div className="p-3 glass-card rounded-4 stat-card h-100" style={{ borderLeftColor: '#a855f7' }}>
                                <p className="text-muted small mb-1">Unique Words</p>
                                <h3 className="fw-bold text-gradient mb-0">{results.stats.uniqueWords}</h3>
                            </div>
                        </Col>
                        <Col xs={12}>
                            <div className="p-3 glass-card rounded-4 d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3 text-primary">
                                    <FaFileAlt size={20} />
                                </div>
                                <div>
                                    <p className="text-muted small mb-0">Estimated Reading Time</p>
                                    <h6 className="fw-bold mb-0">{results.stats.readingTime} Minute{results.stats.readingTime !== 1 ? 's' : ''}</h6>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12}>
                            <div className="p-3 rounded-4 bg-success bg-opacity-10 border border-success border-opacity-20 d-flex align-items-start">
                                <FaCheckCircle className="text-success mt-1 me-2" />
                                <p className="small mb-0 text-success">
                                    <strong>SEO Tip:</strong> Aim for a keyword density of 1% to 2% for your primary keywords to avoid keyword stuffing penalties.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Col>

                <Col xs={12}>
                    <div className="p-4 glass-card rounded-4">
                        <h5 className="fw-bold mb-4">Keyword Density Analysis</h5>
                        <Tab.Container defaultActiveKey="one-word">
                            <Nav variant="pills" className="mb-4 gap-2">
                                <Nav.Item>
                                    <Nav.Link eventKey="one-word">1-Word Phrases</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="two-words">2-Word Phrases</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="three-words">3-Word Phrases</Nav.Link>
                                </Nav.Item>
                            </Nav>

                            <Tab.Content>
                                <Tab.Pane eventKey="one-word">
                                    {renderTable(results.oneWord)}
                                </Tab.Pane>
                                <Tab.Pane eventKey="two-words">
                                    {renderTable(results.twoWords)}
                                </Tab.Pane>
                                <Tab.Pane eventKey="three-words">
                                    {renderTable(results.threeWords)}
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </div>
                </Col>
            </Row>

            <div className="mt-5 pt-4 border-top">
                <h3 className="h5 fw-bold mb-3">About Keyword Density Checker</h3>
                <p className="text-muted small">
                    Keyword density is the percentage of times a keyword or phrase appears on a web page compared to the total number of words on the page. In the context of search engine optimization (SEO), keyword density can be used to determine whether a web page is relevant to a specified keyword or keyword phrase.
                </p>
                <div className="row g-4 mt-1">
                    <Col md={6}>
                        <div className="d-flex">
                            <FaCheckCircle className="text-success me-2 mt-1 flex-shrink-0" />
                            <div>
                                <h6 className="fw-bold mb-1">Optimize for Relevance</h6>
                                <p className="text-muted small mb-0">Helps you ensure that your content is focused on the right keywords without over-optimizing.</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="d-flex">
                            <FaExclamationCircle className="text-warning me-2 mt-1 flex-shrink-0" />
                            <div>
                                <h6 className="fw-bold mb-1">Avoid Keyword Stuffing</h6>
                                <p className="text-muted small mb-0">Detect if a word appears too many times, which could lead to search engine penalties.</p>
                            </div>
                        </div>
                    </Col>
                </div>
            </div>
        </div>
    );
};

export default KeywordDensityChecker;
