import React, { useState } from 'react';
import { Form, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { 
    FaMagic, FaCopy, FaDownload, FaSyncAlt, FaRegLightbulb, 
    FaPaperPlane, FaUserTie, FaHandshake, FaBullseye, FaCheckCircle 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './ColdEmailGenerator.css';
import aiService from '../../../../services/aiService.js';

const ColdEmailGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    
    const [formData, setFormData] = useState({
        recipientName: '',
        recipientRole: '',
        companyName: '',
        yourOffer: '',
        goal: 'Schedule a Meeting',
        tone: 'Professional'
    });

    const goals = [
        'Schedule a Meeting', 'Get Feedback', 'Partnership Inquiry', 
        'Product Demo', 'General Networking', 'Job Inquiry'
    ];

    const tones = [
        'Professional', 'Friendly', 'Direct', 'Creative', 'Helpful'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generateColdEmail = async () => {
        if (!formData.recipientName || !formData.yourOffer) {
            toast.error('Please enter recipient name and your offer.');
            return;
        }

        setLoading(true);
        setError('');
        
        const prompt = `Generate a high-converting, personalized cold email for:
        Recipient Name: "${formData.recipientName}"
        Recipient Role: "${formData.recipientRole || 'Decision Maker'}"
        Recipient Company: "${formData.companyName || 'their company'}"
        My Offer/Value Proposition: "${formData.yourOffer}"
        Main Goal: ${formData.goal}
        Tone: ${formData.tone}
        
        Guidelines:
        1. Keep it short (under 150 words).
        2. Start with a non-generic hook.
        3. Focus on how I can help THEM.
        4. End with a clear, low-friction CTA.
        5. Include a catchy subject line at the very top.`;

        try {
            const result = await aiService.generateContent(prompt);
            setEmail(result);
            toast.success('Cold email generated!');
        } catch (err) {
            setError('Failed to generate email: ' + err.message);
            toast.error('Generation failed.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(email);
        toast.success('Email copied to clipboard!');
    };

    const downloadEmail = () => {
        const blob = new Blob([email], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cold_email_${formData.recipientName.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const resetTool = () => {
        setEmail('');
        setFormData({
            recipientName: '',
            recipientRole: '',
            companyName: '',
            yourOffer: '',
            goal: 'Schedule a Meeting',
            tone: 'Professional'
        });
        setError('');
    };

    return (
        <div className="cold-email-gen-container py-4">
            <div className="text-center mb-5">
                <div className="premium-badge mb-3">
                    <FaPaperPlane className="me-2" /> Outreach Engine
                </div>
                <h1 className="display-5 fw-bold mb-3 gradient-text">Smart Cold Email Generator</h1>
                <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                    Turn "Cold" into "Sold". Generate personalized, professional cold emails that break through the noise and get real responses.
                </p>
            </div>

            {error && <Alert variant="danger" className="mb-4 rounded-4 border-0 shadow-sm">{error}</Alert>}

            <div className="row g-4">
                {/* Input Section */}
                <div className={email ? "col-lg-5" : "col-lg-8 mx-auto"}>
                    <Card className="premium-card border-0 shadow-lg h-100">
                        <Card.Body className="p-4 p-md-5">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary">
                                    <FaUserTie size={24} />
                                </div>
                                <div>
                                    <h2 className="h4 fw-bold mb-1">Outreach Details</h2>
                                    <p className="text-muted mb-0 small">Personalize your message</p>
                                </div>
                            </div>

                            <Form>
                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <Form.Label className="fw-bold text-dark small text-uppercase">Recipient Name</Form.Label>
                                        <Form.Control 
                                            name="recipientName"
                                            placeholder="e.g. John Doe"
                                            value={formData.recipientName}
                                            onChange={handleInputChange}
                                            className="premium-input"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <Form.Label className="fw-bold text-dark small text-uppercase">Company Name</Form.Label>
                                        <Form.Control 
                                            name="companyName"
                                            placeholder="e.g. Acme Corp"
                                            value={formData.companyName}
                                            onChange={handleInputChange}
                                            className="premium-input"
                                        />
                                    </div>
                                </div>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Recipient's Role</Form.Label>
                                    <Form.Control 
                                        name="recipientRole"
                                        placeholder="e.g. Head of Marketing, CEO"
                                        value={formData.recipientRole}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Your Value Proposition / Offer</Form.Label>
                                    <Form.Control 
                                        as="textarea"
                                        rows={3}
                                        name="yourOffer"
                                        placeholder="e.g. I help SaaS companies reduce churn by 20% using automated feedback loops."
                                        value={formData.yourOffer}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <Form.Label className="fw-bold text-dark small text-uppercase">Call Goal</Form.Label>
                                        <Form.Select 
                                            name="goal"
                                            value={formData.goal}
                                            onChange={handleInputChange}
                                            className="premium-input"
                                        >
                                            {goals.map(g => (
                                                <option key={g} value={g}>{g}</option>
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

                                <Button 
                                    className="btn-premium w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                                    onClick={generateColdEmail}
                                    disabled={loading}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : <FaPaperPlane />}
                                    {loading ? 'Writing Email...' : 'Generate Cold Email'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>

                {/* Results Section */}
                {email && (
                    <div className="col-lg-7">
                        <Card className="premium-card border-0 shadow-lg h-100">
                            <Card.Body className="p-4 p-md-5">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-3 rounded-4 bg-success bg-opacity-10 text-success">
                                            <FaHandshake size={24} />
                                        </div>
                                        <div>
                                            <h2 className="h4 fw-bold mb-1">Generated Email</h2>
                                            <p className="text-muted mb-0 small">Personalized outreach</p>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-light rounded-pill p-2" onClick={copyToClipboard} title="Copy Email">
                                            <FaCopy />
                                        </button>
                                        <button className="btn btn-light rounded-pill p-2" onClick={downloadEmail} title="Download .txt">
                                            <FaDownload />
                                        </button>
                                        <button className="btn btn-light rounded-pill p-2" onClick={resetTool} title="Start Over">
                                            <FaSyncAlt />
                                        </button>
                                    </div>
                                </div>

                                <div className="email-preview p-4 rounded-4 bg-white border">
                                    <div className="email-content" style={{ whiteSpace: 'pre-wrap' }}>
                                        {email}
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-indigo-50 rounded-4 d-flex align-items-center gap-2">
                                    <FaCheckCircle className="text-primary" />
                                    <span className="small text-muted">Personalization tokens [Name], [Company] included where relevant.</span>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                )}
            </div>

            {/* Footer Tips */}
            {!loading && !email && (
                <div className="mt-5 p-4 glass-panel rounded-4 border border-white">
                    <h5 className="h6 fw-bold text-dark d-flex align-items-center gap-2 mb-3">
                        <FaRegLightbulb className="text-warning" /> Cold Outreach Principles
                    </h5>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="tip-item">
                                <FaBullseye className="text-primary mb-2" size={20} />
                                <div className="fw-bold small mb-1">Relevance Over Volume</div>
                                <p className="extra-small text-muted mb-0">One highly researched email is better than 100 generic ones.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="tip-item">
                                <FaPaperPlane className="text-success mb-2" size={20} />
                                <div className="fw-bold small mb-1">Low-Friction CTA</div>
                                <p className="extra-small text-muted mb-0">Ask for 5 minutes or a quick opinion rather than a full demo.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="tip-item">
                                <FaMagic className="text-danger mb-2" size={20} />
                                <div className="fw-bold small mb-1">The "Why Now"</div>
                                <p className="extra-small text-muted mb-0">Always mention why you are reaching out to them specifically right now.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColdEmailGenerator;
