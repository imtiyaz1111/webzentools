import React, { useState } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { 
    FaEnvelope, FaUser, FaTag, FaMagic, FaCopy, 
    FaRedo, FaBriefcase, FaHandshake, FaGraduationCap, 
    FaRegSmile, FaRegAngry, FaRegClock, FaTrash 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './AIEmailWriter.css';
import aiService from '../../../../services/aiService.js';

const AIEmailWriter = () => {
    const [scenario, setScenario] = useState('Job Application');
    const [recipient, setRecipient] = useState('');
    const [keyPoints, setKeyPoints] = useState('');
    const [tone, setTone] = useState('Formal');
    const [loading, setLoading] = useState(false);
    const [emailResult, setEmailResult] = useState(null);

    const scenarios = [
        { name: 'Job Application', icon: <FaBriefcase /> },
        { name: 'Business Meeting', icon: <FaHandshake /> },
        { name: 'Follow-up', icon: <FaRegClock /> },
        { name: 'Inquiry', icon: <FaTag /> },
        { name: 'Resignation', icon: <FaTrash /> },
        { name: 'Personal', icon: <FaRegSmile /> }
    ];

    const tones = ['Formal', 'Friendly', 'Urgent', 'Apologetic', 'Persuasive'];

    const generateEmail = async () => {
        if (!keyPoints.trim()) {
            toast.error('Please enter some key points for the email.');
            return;
        }

        setLoading(true);
        try {
                        const prompt = `Write a professional email for a ${scenario} scenario.
            Recipient Name: ${recipient || 'Recruiter/Manager'}
            Key Points to include: ${keyPoints}
            Tone: ${tone}
            
            Provide the response in the following JSON format:
            {
                "subject": "Email subject line",
                "body": "Complete email body text"
            }
            Do not include any other text except the JSON object.`;

            const result = await aiService.generateContent(prompt, 'json');
            
            setEmailResult(result);
            toast.success('Email drafted!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to generate email: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyBody = () => {
        if (!emailResult) return;
        navigator.clipboard.writeText(emailResult.body);
        toast.success('Email body copied!');
    };

    const copySubject = () => {
        if (!emailResult) return;
        navigator.clipboard.writeText(emailResult.subject);
        toast.success('Subject line copied!');
    };

    const resetForm = () => {
        setEmailResult(null);
        setKeyPoints('');
        setRecipient('');
    };

    return (
        <div className="email-writer-container py-4">
            <div className="email-compose-card fade-in">
                <div className="compose-header">
                    <div className="d-flex align-items-center gap-2">
                        <FaEnvelope />
                        <span className="fw-bold">AI Email Composer</span>
                    </div>
                    <div className="small opacity-75">New Message</div>
                </div>

                <div className="compose-body">
                    {!emailResult ? (
                        <>
                            <div className="email-field">
                                <div className="email-field-label">Recipient</div>
                                <input 
                                    className="email-field-input"
                                    placeholder="Enter recipient name or title..."
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                />
                            </div>

                            <div className="mt-4">
                                <Form.Label className="fw-bold text-dark small text-uppercase mb-3">What's the scenario?</Form.Label>
                                <div className="scenario-grid">
                                    {scenarios.map(s => (
                                        <button 
                                            key={s.name}
                                            className={`scenario-btn ${scenario === s.name ? 'active' : ''}`}
                                            onClick={() => setScenario(s.name)}
                                        >
                                            {s.icon} {s.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold text-dark small text-uppercase">Email Content (Key Points)</Form.Label>
                                <Form.Control 
                                    as="textarea"
                                    rows={5}
                                    placeholder="e.g. Applying for Senior Developer role, 5 years experience, mention portfolio link..."
                                    value={keyPoints}
                                    onChange={(e) => setKeyPoints(e.target.value)}
                                    className="border-0 bg-light p-3 rounded-4"
                                    style={{ resize: 'none' }}
                                />
                            </Form.Group>

                            <div className="mb-5">
                                <Form.Label className="fw-bold text-dark small text-uppercase mb-3">Writing Tone</Form.Label>
                                <div className="tone-pill-group">
                                    {tones.map(t => (
                                        <div 
                                            key={t}
                                            className={`tone-pill ${tone === t ? 'active' : ''}`}
                                            onClick={() => setTone(t)}
                                        >
                                            {t}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button 
                                className="btn-generate-email w-100 d-flex align-items-center justify-content-center gap-2"
                                onClick={generateEmail}
                                disabled={loading}
                            >
                                {loading ? <Spinner animation="border" size="sm" /> : <FaMagic />}
                                {loading ? 'AI is Writing...' : 'Draft Professional Email'}
                            </Button>
                        </>
                    ) : (
                        <div className="slide-up">
                            <div className="preview-window">
                                <div className="preview-subject">
                                    <span className="text-muted small fw-normal me-2">Subject:</span>
                                    {emailResult.subject}
                                    <button className="btn btn-link btn-sm p-0 ms-2 text-primary" onClick={copySubject} title="Copy Subject">
                                        <FaCopy />
                                    </button>
                                </div>
                                <div className="preview-body">
                                    {emailResult.body}
                                </div>
                            </div>

                            <div className="mt-4 d-flex gap-3">
                                <Button 
                                    className="btn-generate-email flex-grow-1"
                                    onClick={copyBody}
                                >
                                    <FaCopy className="me-2" /> Copy Full Email
                                </Button>
                                <Button 
                                    variant="outline-secondary" 
                                    className="rounded-4 px-4"
                                    onClick={resetForm}
                                >
                                    <FaRedo className="me-2" /> Rewrite
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="action-bar">
                    <div className="d-flex align-items-center gap-3 text-muted small">
                        <FaMagic className="text-primary" /> 
                        <span>AI Optimization Active</span>
                    </div>
                    <div className="d-flex gap-2">
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
                    </div>
                </div>
            </div>

            {!emailResult && (
                <div className="mt-5 row g-4">
                    <div className="col-md-6">
                        <div className="p-4 bg-white rounded-4 border shadow-sm">
                            <h5 className="fw-bold h6 mb-3 d-flex align-items-center gap-2">
                                <FaMagic className="text-primary" /> Perfect Grammar
                            </h5>
                            <p className="text-muted small mb-0">Our AI ensures your emails are grammatically perfect and flow naturally, making a great impression on the recipient.</p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="p-4 bg-white rounded-4 border shadow-sm">
                            <h5 className="fw-bold h6 mb-3 d-flex align-items-center gap-2">
                                <FaTag className="text-warning" /> Subject Line SEO
                            </h5>
                            <p className="text-muted small mb-0">We generate subject lines with high open rates, specifically tailored to the scenario and urgency of your message.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIEmailWriter;
