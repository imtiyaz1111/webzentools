import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Spinner, Alert, ProgressBar } from 'react-bootstrap';
import { 
    FaCheckCircle, FaExclamationTriangle, FaMagic, FaSyncAlt, 
    FaCopy, FaEraser, FaRegFileAlt, FaChartLine, FaSmileBeam 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './AIGrammarChecker.css';

const AIGrammarChecker = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [wordCount, setWordCount] = useState(0);

    useEffect(() => {
        const count = text.trim() ? text.trim().split(/\s+/).length : 0;
        setWordCount(count);
    }, [text]);

    const checkGrammar = async () => {
        if (!text.trim()) {
            toast.error('Please enter some text to check.');
            return;
        }

        setLoading(true);
        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            const prompt = `Analyze this text for grammar, spelling, and punctuation errors. 
            Provide a list of issues and a fully corrected version.
            Text: "${text}"
            
            Provide the response in the following JSON format:
            {
                "correctedText": "The full corrected text",
                "issues": [
                    { "type": "grammar|spelling|style", "original": "wrong word", "suggestion": "correct word", "explanation": "Why it's wrong" }
                ],
                "tone": "e.g. Professional",
                "clarityScore": 85
            }
            Do not include any other text except the JSON object.`;

            const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                contents: [{ parts: [{ text: prompt }] }]
            });

            const data = response.data;
            if (data.error) throw new Error(data.error.message);
            
            const rawText = data.candidates[0].content.parts[0].text;
            const jsonStr = rawText.replace(/```json|```/g, '').trim();
            const result = JSON.parse(jsonStr);
            
            setResults(result);
            toast.success('Analysis complete!');
        } catch (err) {
            console.error(err);
            toast.error('Check failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const applyFix = () => {
        if (!results) return;
        setText(results.correctedText);
        setResults(null);
        toast.success('All fixes applied!');
    };

    const copyText = () => {
        navigator.clipboard.writeText(text);
        toast.success('Text copied!');
    };

    const clearText = () => {
        setText('');
        setResults(null);
    };

    return (
        <div className="grammar-checker-container py-4">
            <div className="d-flex align-items-center gap-3 mb-4 fade-in">
                <div className="p-3 rounded-4 bg-success bg-opacity-10 text-success">
                    <FaCheckCircle size={24} />
                </div>
                <div>
                    <h2 className="h4 fw-bold mb-1">AI Grammar Checker</h2>
                    <p className="text-muted mb-0 small">Perfect your writing with advanced AI corrections.</p>
                </div>
            </div>

            <div className="row g-0 grammar-editor-card fade-in">
                <div className="col-lg">
                    <div className="editor-toolbar">
                        <div className="d-flex gap-2">
                            <Button variant="light" size="sm" className="rounded-pill" onClick={copyText}>
                                <FaCopy className="me-1" /> Copy
                            </Button>
                            <Button variant="light" size="sm" className="rounded-pill" onClick={clearText}>
                                <FaEraser className="me-1" /> Clear
                            </Button>
                        </div>
                        <Button 
                            className="btn-fix-all btn-sm px-4" 
                            disabled={!results || loading}
                            onClick={applyFix}
                        >
                            <FaMagic className="me-2" /> Fix All Errors
                        </Button>
                    </div>
                    <div className="grammar-textarea-wrapper">
                        <textarea 
                            className="grammar-textarea"
                            placeholder="Type or paste your text here to check for grammar, spelling, and style improvements..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                    <div className="stats-bar">
                        <div className="d-flex align-items-center gap-2">
                            <FaRegFileAlt /> {wordCount} Words
                        </div>
                        {results && (
                            <>
                                <div className="d-flex align-items-center gap-2">
                                    <FaSmileBeam className="text-primary" /> Tone: <span className="tone-badge">{results.tone}</span>
                                </div>
                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between small mb-1">
                                        <span>Clarity Score</span>
                                        <span className="fw-bold">{results.clarityScore}%</span>
                                    </div>
                                    <div className="clarity-meter">
                                        <div className="clarity-fill" style={{ width: `${results.clarityScore}%` }}></div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="feedback-sidebar d-none d-lg-block">
                    <h5 className="h6 fw-bold mb-4 d-flex align-items-center gap-2">
                        <FaChartLine className="text-primary" /> AI Insights
                    </h5>

                    {!results && !loading && (
                        <div className="text-center py-5 opacity-50">
                            <FaExclamationTriangle size={32} className="mb-3 text-warning" />
                            <p className="small">No analysis yet.<br/>Click "Check Text" to start.</p>
                            <Button 
                                variant="primary" 
                                size="sm" 
                                className="rounded-pill px-4 mt-2"
                                onClick={checkGrammar}
                            >
                                Check Text
                            </Button>
                        </div>
                    )}

                    {loading && (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" className="mb-3" />
                            <p className="small text-muted">Analyzing your writing...</p>
                        </div>
                    )}

                    {results && results.issues.length === 0 && (
                        <div className="alert alert-success rounded-4 small">
                            <FaCheckCircle className="me-2" /> Looks perfect! No major issues found.
                        </div>
                    )}

                    {results && results.issues.map((issue, idx) => (
                        <div key={idx} className={`issue-card ${issue.type}`}>
                            <div className="issue-label">{issue.type}</div>
                            <div className="issue-original mb-1">{issue.original}</div>
                            <div className="issue-suggestion mb-2">{issue.suggestion}</div>
                            <div className="small text-muted" style={{ fontSize: '0.75rem' }}>{issue.explanation}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Action Button */}
            <div className="d-lg-none mt-3">
                <Button 
                    className="btn-fix-all w-100 py-3"
                    onClick={checkGrammar}
                    disabled={loading}
                >
                    {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <FaCheckCircle className="me-2" />}
                    {loading ? 'Analyzing...' : 'Check My Grammar'}
                </Button>
            </div>

            <div className="row mt-5 g-4">
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="text-danger mb-3"><FaExclamationTriangle size={24} /></div>
                        <h5 className="fw-bold h6">Error Detection</h5>
                        <p className="text-muted small mb-0">Catches complex grammar mistakes, subject-verb agreement issues, and more.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="text-primary mb-3"><FaMagic size={24} /></div>
                        <h5 className="fw-bold h6">Style Suggestions</h5>
                        <p className="text-muted small mb-0">Improves clarity and word choice to make your writing more professional and engaging.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="text-success mb-3"><FaChartLine size={24} /></div>
                        <h5 className="fw-bold h6">Real-time Analytics</h5>
                        <p className="text-muted small mb-0">Get a clarity score and tone analysis to understand how your writing sounds to others.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIGrammarChecker;
