import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { 
    FaMagic, FaCopy, FaDownload, FaSyncAlt, FaRegLightbulb, 
    FaEnvelopeOpenText, FaInbox, FaBolt, FaUserCircle, FaQuoteLeft 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './EmailSubjectGenerator.css';

const EmailSubjectGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [subjects, setSubjects] = useState([]);
    
    const [formData, setFormData] = useState({
        emailTopic: '',
        targetAudience: '',
        emailType: 'Newsletter',
        tone: 'Catchy',
        includeEmoji: true
    });

    const emailTypes = [
        'Newsletter', 'Sales/Promotion', 'Welcome Email', 'Abandoned Cart', 
        'Follow-up', 'Event Invitation', 'Product Update'
    ];

    const tones = [
        'Catchy', 'Professional', 'Urgent', 'Curious', 
        'Humorous', 'Personal', 'Fear of Missing Out (FOMO)'
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const callGeminiAI = async (prompt) => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
        }

        const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            contents: [{ parts: [{ text: prompt }] }]
        });

        const data = response.data;
        if (data.error) throw new Error(data.error.message);
        return data.candidates[0].content.parts[0].text;
    };

    const generateSubjects = async () => {
        if (!formData.emailTopic) {
            toast.error('Please enter the email topic.');
            return;
        }

        setLoading(true);
        setError('');
        
        const prompt = `Generate 15 high-open-rate email subject lines for:
        Topic: "${formData.emailTopic}"
        Type: ${formData.emailType}
        Tone: ${formData.tone}
        Target Audience: "${formData.targetAudience || 'General'}"
        Include Emojis: ${formData.includeEmoji ? 'Yes' : 'No'}
        
        Use proven email marketing strategies (like curiosity gap, urgency, or personalization placeholders like [Name]).
        Provide only the list of subject lines, one per line, without numbers or extra text.`;

        try {
            const result = await callGeminiAI(prompt);
            const cleanedSubjects = result.split('\n')
                .map(s => s.trim().replace(/^\d+\.\s*/, '').replace(/^"|"$/g, ''))
                .filter(s => s.length > 5)
                .slice(0, 15);
            
            setSubjects(cleanedSubjects);
            toast.success('Subject lines generated!');
        } catch (err) {
            setError('Failed to generate subject lines: ' + err.message);
            toast.error('Generation failed.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const downloadSubjects = () => {
        const content = subjects.join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `email_subjects_${formData.emailTopic.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const resetTool = () => {
        setSubjects([]);
        setFormData({
            emailTopic: '',
            targetAudience: '',
            emailType: 'Newsletter',
            tone: 'Catchy',
            includeEmoji: true
        });
        setError('');
    };

    return (
        <div className="email-subject-gen-container py-4">
            <div className="text-center mb-5">
                <div className="premium-badge mb-3">
                    <FaEnvelopeOpenText className="me-2" /> Open Rate Optimizer
                </div>
                <h1 className="display-5 fw-bold mb-3 gradient-text">Email Subject Generator</h1>
                <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                    Stop being ignored. Generate catchy and persuasive email subject lines that grab attention and skyrocket your open rates.
                </p>
            </div>

            {error && <Alert variant="danger" className="mb-4 rounded-4 border-0 shadow-sm">{error}</Alert>}

            <div className="row g-4">
                {/* Input Section */}
                <div className={subjects.length > 0 ? "col-lg-5" : "col-lg-8 mx-auto"}>
                    <Card className="premium-card border-0 shadow-lg h-100">
                        <Card.Body className="p-4 p-md-5">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary">
                                    <FaInbox size={24} />
                                </div>
                                <div>
                                    <h2 className="h4 fw-bold mb-1">Campaign Details</h2>
                                    <p className="text-muted mb-0 small">Optimize for clicks</p>
                                </div>
                            </div>

                            <Form>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Email Topic / Offer</Form.Label>
                                    <Form.Control 
                                        name="emailTopic"
                                        placeholder="e.g. Free SEO Audit, Summer Sale 20% Off"
                                        value={formData.emailTopic}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Target Audience</Form.Label>
                                    <Form.Control 
                                        name="targetAudience"
                                        placeholder="e.g. Marketing Managers, Pet Owners"
                                        value={formData.targetAudience}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <Form.Label className="fw-bold text-dark small text-uppercase">Email Type</Form.Label>
                                        <Form.Select 
                                            name="emailType"
                                            value={formData.emailType}
                                            onChange={handleInputChange}
                                            className="premium-input"
                                        >
                                            {emailTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <Form.Label className="fw-bold text-dark small text-uppercase">Tone</Form.Label>
                                        <Form.Select 
                                            name="tone"
                                            value={formData.tone}
                                            onChange={handleInputChange}
                                            className="premium-input"
                                        >
                                            {tones.map(t => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                </div>

                                <Form.Group className="mb-5 d-flex align-items-center gap-2">
                                    <Form.Check 
                                        type="switch"
                                        id="emoji-switch"
                                        name="includeEmoji"
                                        label="Include Emojis in subjects"
                                        checked={formData.includeEmoji}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>

                                <Button 
                                    className="btn-premium w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                                    onClick={generateSubjects}
                                    disabled={loading}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : <FaMagic />}
                                    {loading ? 'Crafting Lines...' : 'Generate 15 Subject Lines'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>

                {/* Results Section */}
                {subjects.length > 0 && (
                    <div className="col-lg-7">
                        <Card className="premium-card border-0 shadow-lg h-100">
                            <Card.Body className="p-4 p-md-5">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-3 rounded-4 bg-success bg-opacity-10 text-success">
                                            <FaBolt size={24} />
                                        </div>
                                        <div>
                                            <h2 className="h4 fw-bold mb-1">Subject Lines</h2>
                                            <p className="text-muted mb-0 small">Ready to boost your CTR</p>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-light rounded-pill p-2" onClick={downloadSubjects} title="Download All">
                                            <FaDownload />
                                        </button>
                                        <button className="btn btn-light rounded-pill p-2" onClick={resetTool} title="Start Over">
                                            <FaSyncAlt />
                                        </button>
                                    </div>
                                </div>

                                <div className="subjects-list">
                                    {subjects.map((subject, index) => (
                                        <div key={index} className="subject-item fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                                            <div className="subject-text-container">
                                                <FaQuoteLeft className="text-muted opacity-25 me-2" size={12} />
                                                <span className="subject-text">{subject}</span>
                                            </div>
                                            <button 
                                                className="subject-copy-btn" 
                                                onClick={() => copyToClipboard(subject)}
                                                title="Copy Subject"
                                            >
                                                <FaCopy />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                )}
            </div>

            {/* Footer Tips */}
            {!loading && subjects.length === 0 && (
                <div className="mt-5 p-4 glass-panel rounded-4 border border-white shadow-sm">
                    <h5 className="h6 fw-bold text-dark d-flex align-items-center gap-2 mb-3">
                        <FaRegLightbulb className="text-warning" /> Subject Line Mastery
                    </h5>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="tip-box text-center">
                                <FaBolt className="text-primary mb-2" />
                                <div className="fw-bold small mb-1">Action-Oriented</div>
                                <p className="extra-small text-muted mb-0">Use strong verbs that tell the user what they will get or do.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="tip-box text-center">
                                <FaUserCircle className="text-success mb-2" />
                                <div className="fw-bold small mb-1">Personalization</div>
                                <p className="extra-small text-muted mb-0">Using [Name] or "You" can increase open rates by up to 26%.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="tip-box text-center">
                                <FaEnvelopeOpenText className="text-danger mb-2" />
                                <div className="fw-bold small mb-1">Keep it Short</div>
                                <p className="extra-small text-muted mb-0">Aim for 6-10 words. Most emails are opened on mobile devices.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailSubjectGenerator;
