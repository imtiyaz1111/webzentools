import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaRobot, FaMagic, FaCopy } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AITextGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generateText = async () => {
        if (!prompt.trim()) {
            toast.error('Please enter a prompt first.');
            return;
        }

        setLoading(true);
        setError('');
        setResult('');

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            
            if (!apiKey) {
                throw new Error('Gemini API key is not configured in environment variables.');
            }

            // Simple fetch call to Gemini API
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message || 'Failed to generate text.');
            }

            const generatedText = data.candidates[0].content.parts[0].text;
            setResult(generatedText);
            toast.success('Text generated successfully!');
        } catch (err) {
            console.error('AI Generation Error:', err);
            setError(err.message || 'Something went wrong while generating text.');
            toast.error('Generation failed.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        toast.success('Generated text copied!');
    };

    return (
        <div className="ai-text-generator">
            <div className="mb-4">
                <Form.Label className="fw-bold mb-2">What would you like me to write?</Form.Label>
                <Form.Control 
                    as="textarea"
                    rows={4}
                    placeholder="e.g. Write a professional email about a project delay, or a short blog post about React hooks..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="border-0 bg-light p-3 rounded-4 mb-3"
                    disabled={loading}
                />
                <Button 
                    className="btn btn-primary rounded-pill px-4 py-2 fw-bold w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={generateText}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" /> Generating...
                        </>
                    ) : (
                        <>
                            <FaMagic /> Generate with Gemini AI
                        </>
                    )}
                </Button>
            </div>

            {error && <Alert variant="danger" className="rounded-4">{error}</Alert>}

            {result && (
                <div className="mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <Form.Label className="fw-bold mb-0">Generated Content:</Form.Label>
                        <button className="btn btn-outline-secondary btn-sm rounded-pill" onClick={copyToClipboard}>
                            <FaCopy className="me-1" /> Copy Result
                        </button>
                    </div>
                    <div className="result-area p-4 glass-card bg-white rounded-4 border-0 shadow-sm" style={{ whiteSpace: 'pre-wrap' }}>
                        {result}
                    </div>
                </div>
            )}

            {!result && !loading && !error && (
                <div className="text-center py-5 opacity-50">
                    <FaRobot size={48} className="mb-3 text-primary" />
                    <p className="mb-0">Your AI-generated results will appear here.</p>
                </div>
            )}
            
            <div className="mt-5 pt-4 border-top">
                <h3 className="h6 fw-bold text-uppercase tracking-wider mb-3">Tips for better results</h3>
                <ul className="text-muted small mb-0">
                    <li className="mb-2">Be specific about the tone (e.g., professional, friendly, sarcastic).</li>
                    <li className="mb-2">Mention any specific keywords you want to include.</li>
                    <li>Specify the length (e.g., "in 100 words" or "one paragraph").</li>
                </ul>
            </div>
        </div>
    );
};

export default AITextGenerator;
