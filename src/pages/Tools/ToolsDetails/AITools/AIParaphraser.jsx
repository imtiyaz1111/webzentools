import React, { useState } from 'react';
import { Form, Button, Spinner, Alert, ProgressBar } from 'react-bootstrap';
import { 
    FaMagic, FaCopy, FaSyncAlt, FaEraser, FaRegFileAlt, 
    FaTextHeight, FaBolt, FaCheck, FaQuoteLeft 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './AIParaphraser.css';
import aiService from '../../../../services/aiService.js';

const AIParaphraser = () => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [mode, setMode] = useState('Standard');
    const [intensity, setIntensity] = useState(2); // 1: Low, 2: Med, 3: High
    const [loading, setLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const modes = [
        { name: 'Standard', desc: 'Rewrites text in a balanced way.' },
        { name: 'Fluency', desc: 'Ensures the text is easy to read.' },
        { name: 'Formal', desc: 'Makes the text more professional.' },
        { name: 'Creative', desc: 'Changes the text significantly.' },
        { name: 'Shorten', desc: 'Removes unnecessary words.' },
        { name: 'Expand', desc: 'Adds more detail and depth.' }
    ];

    const getIntensityLabel = (val) => {
        if (val === 1) return 'Low (Maintain original meaning)';
        if (val === 2) return 'Medium (Balanced changes)';
        return 'High (Significant rewriting)';
    };

    const handleParaphrase = async () => {
        if (!inputText.trim()) {
            toast.error('Please enter some text to paraphrase.');
            return;
        }

        setLoading(true);
        try {
            const prompt = `Paraphrase the following text using ${mode} mode. 
            Synonym intensity level: ${getIntensityLabel(intensity)}.
            Text to paraphrase: "${inputText}"
            
            Provide ONLY the paraphrased text in the response. Maintain the original language.`;

            const result = await aiService.generateContent(prompt, 'text');
            setOutputText(result);
            toast.success('Text paraphrased successfully!');
        } catch (err) {
            toast.error('Failed to paraphrase: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!outputText) return;
        navigator.clipboard.writeText(outputText);
        toast.success('Paraphrased text copied!');
    };

    const clearAll = () => {
        setInputText('');
        setOutputText('');
    };

    const getWordCount = (text) => text.trim() ? text.trim().split(/\s+/).length : 0;
    const getCharCount = (text) => text.length;

    return (
        <div className="paraphraser-container py-4">
            <div className="paraphrase-controls fade-in">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary">
                        <FaSyncAlt size={24} />
                    </div>
                    <div>
                        <h2 className="h4 fw-bold mb-1">AI Paraphraser Tool</h2>
                        <p className="text-muted mb-0 small">Rewrite any text to improve clarity, tone, and flow.</p>
                    </div>
                </div>

                <div className="row g-4 align-items-center">
                    <div className="col-lg-7">
                        <Form.Label className="fw-bold text-dark small text-uppercase mb-3">Select Mode</Form.Label>
                        <div className="mode-grid">
                            {modes.map(m => (
                                <button 
                                    key={m.name}
                                    className={`mode-btn ${mode === m.name ? 'active' : ''}`}
                                    onClick={() => setMode(m.name)}
                                    title={m.desc}
                                >
                                    {m.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="col-lg-5">
                        <div className="synonym-slider-container">
                            <Form.Label className="fw-bold small text-uppercase d-flex justify-content-between">
                                <span>Changes Level</span>
                                <span className="text-primary">{getIntensityLabel(intensity).split(' ')[0]}</span>
                            </Form.Label>
                            <Form.Range 
                                min={1}
                                max={3}
                                step={1}
                                value={intensity}
                                onChange={(e) => setIntensity(parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="paraphraser-layout fade-in">
                {/* Input Panel */}
                <div className="editor-panel">
                    <div className="editor-header">
                        <div className="editor-label">Input Text</div>
                        <Button variant="link" className="text-danger p-0 text-decoration-none small" onClick={clearAll}>
                            <FaEraser className="me-1" /> Clear
                        </Button>
                    </div>
                    <div className={`editor-card ${isFocused ? 'focused' : ''}`}>
                        <textarea 
                            className="editor-textarea"
                            placeholder="Type or paste your text here..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                        <div className="editor-footer">
                            <span>{getWordCount(inputText)} words</span>
                            <span>{getCharCount(inputText)} chars</span>
                        </div>
                    </div>
                </div>

                {/* Action Center (Desktop) */}
                <div className="d-none d-lg-flex flex-column justify-content-center gap-3">
                    <Button 
                        className="paraphrase-btn-main shadow-sm"
                        onClick={handleParaphrase}
                        disabled={loading}
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : <FaMagic />}
                    </Button>
                </div>

                {/* Output Panel */}
                <div className="editor-panel">
                    <div className="editor-header">
                        <div className="editor-label">Paraphrased Text</div>
                        {outputText && (
                            <Button variant="link" className="text-primary p-0 text-decoration-none small" onClick={copyToClipboard}>
                                <FaCopy className="me-1" /> Copy
                            </Button>
                        )}
                    </div>
                    <div className="editor-card bg-light bg-opacity-50">
                        {loading && (
                            <div className="result-overlay">
                                <div className="text-center">
                                    <Spinner animation="grow" variant="primary" className="mb-3" />
                                    <div className="fw-bold text-primary">Rewriting...</div>
                                </div>
                            </div>
                        )}
                        <textarea 
                            className="editor-textarea"
                            readOnly
                            placeholder="Your rewritten text will appear here..."
                            value={outputText}
                        />
                        <div className="editor-footer">
                            <span>{getWordCount(outputText)} words</span>
                            <div className="d-flex align-items-center gap-2">
                                {outputText && <FaCheck className="text-success" />}
                                <span>{getCharCount(outputText)} chars</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Action Button */}
            <div className="d-lg-none mb-4">
                <Button 
                    className="paraphrase-btn-main w-100 py-3 shadow"
                    onClick={handleParaphrase}
                    disabled={loading}
                >
                    {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <FaMagic className="me-2" />}
                    {loading ? 'Paraphrasing...' : 'Paraphrase Now'}
                </Button>
            </div>

            <div className="row mt-4 g-4">
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="text-primary mb-3"><FaBolt size={24} /></div>
                        <h5 className="fw-bold h6">Fast & Accurate</h5>
                        <p className="text-muted small mb-0">Powered by the latest AI to ensure human-like paraphrasing in seconds.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="text-success mb-3"><FaCheck size={24} /></div>
                        <h5 className="fw-bold h6">Anti-Plagiarism</h5>
                        <p className="text-muted small mb-0">Unique sentence structures help avoid plagiarism while keeping the core meaning.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="text-warning mb-3"><FaQuoteLeft size={24} /></div>
                        <h5 className="fw-bold h6">6+ Pro Modes</h5>
                        <p className="text-muted small mb-0">From formal academic writing to creative storytelling, we have a mode for every need.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIParaphraser;
