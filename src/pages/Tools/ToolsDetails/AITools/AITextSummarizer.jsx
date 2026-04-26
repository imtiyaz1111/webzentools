import React, { useState } from 'react';
import { Form, Button, Spinner, Alert, ProgressBar } from 'react-bootstrap';
import { 
    FaAlignLeft, FaListOl, FaBolt, FaHistory, FaCopy, 
    FaSyncAlt, FaRegFileAlt, FaCheckCircle, FaQuoteRight, FaLightbulb 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './AITextSummarizer.css';
import aiService from '../../../../services/aiService.js';

const AITextSummarizer = () => {
    const [text, setText] = useState('');
    const [format, setFormat] = useState('Bullet Points');
    const [length, setLength] = useState('Medium');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const formats = ['Bullet Points', 'Paragraph', 'Executive Summary'];
    const lengths = ['Short', 'Medium', 'Long'];

    const handleSummarize = async () => {
        if (!text.trim()) {
            toast.error('Please paste some text to summarize!');
            return;
        }

        setLoading(true);
        try {
                        const prompt = `Summarize the following text in ${format} format. 
            The length should be ${length}.
            Text: "${text}"
            
            Provide the response in the following JSON format:
            {
                "summary": "The main summary text (use HTML <ul><li> for bullets if needed)",
                "takeaways": ["Key point 1", "Key point 2", "Key point 3"],
                "originalWordCount": 1000,
                "summaryWordCount": 200
            }
            Do not include any other text except the JSON object.`;

            const summaryData = await aiService.generateContent(prompt, 'json');
            
            setResult(summaryData);
            toast.success('Summary generated!');
        } catch (err) {
            console.error(err);
            toast.error('Summarization failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const copySummary = () => {
        if (!result) return;
        const textOnly = result.summary.replace(/<[^>]*>/g, '');
        navigator.clipboard.writeText(textOnly);
        toast.success('Summary copied!');
    };

    const resetTool = () => {
        setResult(null);
        setText('');
    };

    const calculateSavedTime = (originalCount, summaryCount) => {
        const wordsPerMinute = 200;
        const originalTime = Math.ceil(originalCount / wordsPerMinute);
        const summaryTime = Math.ceil(summaryCount / wordsPerMinute);
        return originalTime - summaryTime;
    };

    return (
        <div className="summarizer-container py-4">
            {!result ? (
                <div className="fade-in">
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary">
                            <FaAlignLeft size={24} />
                        </div>
                        <div>
                            <h2 className="h4 fw-bold mb-1">AI Text Summarizer</h2>
                            <p className="text-muted mb-0 small">Condense long articles into readable insights instantly.</p>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-4 border shadow-sm mb-4">
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold text-dark small text-uppercase">Paste your long text below</Form.Label>
                            <Form.Control 
                                as="textarea"
                                rows={10}
                                placeholder="Paste an article, report, or any long text here..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="border-0 bg-light p-4 rounded-4"
                                style={{ fontSize: '1rem', lineHeight: '1.6' }}
                            />
                        </Form.Group>

                        <div className="row g-4 align-items-end">
                            <div className="col-md-5">
                                <Form.Label className="fw-bold text-dark small text-uppercase">Summary Format</Form.Label>
                                <div className="d-flex gap-2">
                                    {formats.map(f => (
                                        <Button 
                                            key={f}
                                            variant={format === f ? 'primary' : 'outline-light'}
                                            className={`flex-grow-1 border-secondary border-opacity-25 ${format === f ? '' : 'text-dark'}`}
                                            onClick={() => setFormat(f)}
                                            style={{ fontSize: '0.8rem' }}
                                        >
                                            {f}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <Form.Label className="fw-bold text-dark small text-uppercase">Target Length</Form.Label>
                                <Form.Select 
                                    className="bg-light border-0 p-2 rounded-3"
                                    value={length}
                                    onChange={(e) => setLength(e.target.value)}
                                >
                                    {lengths.map(l => <option key={l} value={l}>{l} Summary</option>)}
                                </Form.Select>
                            </div>
                            <div className="col-md-3">
                                <Button 
                                    className="btn-summarize-main w-100 py-2"
                                    onClick={handleSummarize}
                                    disabled={loading}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : <FaBolt />}
                                    {loading ? ' Summarizing...' : ' Summarize'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="fade-in">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Button variant="outline-secondary" className="rounded-pill px-4" onClick={resetTool}>
                            <FaSyncAlt className="me-2" /> Start Over
                        </Button>
                        <div className="d-flex gap-2">
                            <Button variant="primary" className="rounded-pill px-4" onClick={copySummary}>
                                <FaCopy className="me-2" /> Copy Summary
                            </Button>
                        </div>
                    </div>

                    <div className="summarizer-card mb-5">
                        <div className="control-panel">
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                                    <FaRegFileAlt />
                                </div>
                                <h3 className="h5 fw-bold mb-0">The Summary</h3>
                            </div>
                            <div className="format-group">
                                {formats.map(f => (
                                    <button 
                                        key={f}
                                        className={`format-btn ${format === f ? 'active' : ''}`}
                                        disabled
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="summary-output-area">
                            <div 
                                className="summary-content"
                                dangerouslySetInnerHTML={{ __html: result.summary }}
                            />

                            <div className="divider"></div>

                            <div className="takeaways-section">
                                <h4 className="h6 fw-bold mb-4 d-flex align-items-center gap-2">
                                    <FaLightbulb className="text-warning" /> Key Takeaways
                                </h4>
                                <div className="row">
                                    {result.takeaways.map((point, idx) => (
                                        <div key={idx} className="col-md-6 takeaway-item">
                                            <div className="takeaway-icon">{idx + 1}</div>
                                            <div className="small text-dark fw-medium">{point}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="efficiency-grid">
                                <div className="efficiency-card">
                                    <span className="efficiency-value text-primary">{result.originalWordCount}</span>
                                    <span className="efficiency-label">Original Words</span>
                                </div>
                                <div className="efficiency-card">
                                    <span className="efficiency-value text-success">
                                        {Math.round((1 - result.summaryWordCount / result.originalWordCount) * 100)}%
                                    </span>
                                    <span className="efficiency-label">Condensation</span>
                                </div>
                                <div className="efficiency-card">
                                    <span className="efficiency-value text-warning">
                                        ~{calculateSavedTime(result.originalWordCount, result.summaryWordCount)} min
                                    </span>
                                    <span className="efficiency-label">Reading Time Saved</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!result && !loading && (
                <div className="mt-5 row g-4">
                    <div className="col-md-4">
                        <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                            <div className="text-primary mb-3"><FaBolt size={24} /></div>
                            <h5 className="fw-bold h6">Instant Condensation</h5>
                            <p className="text-muted small mb-0">Turn hours of reading into minutes of browsing without losing the core message.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                            <div className="text-success mb-3"><FaCheckCircle size={24} /></div>
                            <h5 className="fw-bold h6">Key Points First</h5>
                            <p className="text-muted small mb-0">Our AI automatically extracts the most important "takeaways" so you can grasp the gist at a glance.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                            <div className="text-warning mb-3"><FaHistory size={24} /></div>
                            <h5 className="fw-bold h6">Time Efficiency</h5>
                            <p className="text-muted small mb-0">Perfect for busy professionals who need to stay informed without getting bogged down in detail.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AITextSummarizer;
