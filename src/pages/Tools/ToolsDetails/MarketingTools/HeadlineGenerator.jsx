import React, { useState } from 'react';
import { Form, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { 
    FaMagic, FaCopy, FaDownload, FaSyncAlt, FaRegLightbulb, 
    FaBullhorn, FaQuoteLeft, FaRocket, FaFire, FaCheckCircle 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './HeadlineGenerator.css';
import aiService from '../../../../services/aiService.js';

const HeadlineGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [headlines, setHeadlines] = useState([]);
    
    const [formData, setFormData] = useState({
        topic: '',
        contentType: 'Blog Post',
        tone: 'Catchy',
        audience: ''
    });

    const contentTypes = [
        'Blog Post', 'Facebook Ad', 'Google Ad', 'Email Subject', 
        'YouTube Title', 'Landing Page', 'Instagram Caption'
    ];

    const tones = [
        'Catchy', 'Professional', 'Urgent', 'Mysterious', 
        'Controversial', 'How-to', 'Benefit-Driven'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generateHeadlines = async () => {
        if (!formData.topic) {
            toast.error('Please enter a topic or keyword.');
            return;
        }

        setLoading(true);
        setError('');
        
        const prompt = `Generate 10 premium, high-converting ${formData.contentType} headlines/titles for the topic: "${formData.topic}". 
        Tone: ${formData.tone}.
        Target Audience: ${formData.audience || 'General'}.
        Use proven copywriting formulas (like PAS, AIDA, or Curiosity Gap).
        Provide only the list of headlines, one per line, without numbers or extra text.`;

        try {
            const result = await aiService.generateContent(prompt);
            const cleanedHeadlines = result.split('\n')
                .map(h => h.trim().replace(/^\d+\.\s*/, '').replace(/^"|"$/g, ''))
                .filter(h => h.length > 5)
                .slice(0, 10);
            
            setHeadlines(cleanedHeadlines);
            toast.success('Headlines generated successfully!');
        } catch (err) {
            setError('Failed to generate headlines: ' + err.message);
            toast.error('Generation failed.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const downloadHeadlines = () => {
        const content = headlines.join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `headlines_${formData.topic.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const resetTool = () => {
        setHeadlines([]);
        setFormData({
            topic: '',
            contentType: 'Blog Post',
            tone: 'Catchy',
            audience: ''
        });
        setError('');
    };

    return (
        <div className="headline-generator-container py-4">
            <div className="text-center mb-5">
                <div className="premium-badge mb-3">
                    <FaFire className="me-2" /> AI Powered Marketing
                </div>
                <h1 className="display-5 fw-bold mb-3 gradient-text">Premium Headline Generator</h1>
                <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                    Create viral, high-converting titles for blogs, ads, and social media in seconds using advanced AI copywriting formulas.
                </p>
            </div>

            {error && <Alert variant="danger" className="mb-4 rounded-4 border-0 shadow-sm">{error}</Alert>}

            <div className="row g-4">
                {/* Input Section */}
                <div className={headlines.length > 0 ? "col-lg-5" : "col-lg-8 mx-auto"}>
                    <Card className="premium-card border-0 shadow-lg h-100">
                        <Card.Body className="p-4 p-md-5">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary">
                                    <FaBullhorn size={24} />
                                </div>
                                <div>
                                    <h2 className="h4 fw-bold mb-1">Campaign Details</h2>
                                    <p className="text-muted mb-0 small">Define your target and goal</p>
                                </div>
                            </div>

                            <Form>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">What's your topic?</Form.Label>
                                    <Form.Control 
                                        name="topic"
                                        placeholder="e.g. Digital Marketing, Vegan Recipes, Crypto Trading"
                                        value={formData.topic}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <Form.Label className="fw-bold text-dark small text-uppercase">Content Type</Form.Label>
                                        <Form.Select 
                                            name="contentType"
                                            value={formData.contentType}
                                            onChange={handleInputChange}
                                            className="premium-input"
                                        >
                                            {contentTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <Form.Label className="fw-bold text-dark small text-uppercase">Tone of Voice</Form.Label>
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

                                <Form.Group className="mb-5">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Target Audience (Optional)</Form.Label>
                                    <Form.Control 
                                        name="audience"
                                        placeholder="e.g. Small business owners, Parents, Developers"
                                        value={formData.audience}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Button 
                                    className="btn-premium w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                                    onClick={generateHeadlines}
                                    disabled={loading}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : <FaMagic />}
                                    {loading ? 'Generating...' : 'Generate 10 Headlines'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>

                {/* Results Section */}
                {headlines.length > 0 && (
                    <div className="col-lg-7">
                        <Card className="premium-card border-0 shadow-lg h-100">
                            <Card.Body className="p-4 p-md-5">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-3 rounded-4 bg-success bg-opacity-10 text-success">
                                            <FaRocket size={24} />
                                        </div>
                                        <div>
                                            <h2 className="h4 fw-bold mb-1">Your Headlines</h2>
                                            <p className="text-muted mb-0 small">Proven to drive engagement</p>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-light rounded-pill p-2" onClick={downloadHeadlines} title="Download All">
                                            <FaDownload />
                                        </button>
                                        <button className="btn btn-light rounded-pill p-2" onClick={resetTool} title="Start Over">
                                            <FaSyncAlt />
                                        </button>
                                    </div>
                                </div>

                                <div className="headline-results">
                                    {headlines.map((headline, index) => (
                                        <div key={index} className="headline-item fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                            <div className="headline-text">
                                                <FaQuoteLeft className="quote-icon me-2" />
                                                <span>{headline}</span>
                                            </div>
                                            <button 
                                                className="copy-btn" 
                                                onClick={() => copyToClipboard(headline)}
                                                title="Copy"
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
            {!loading && headlines.length === 0 && (
                <div className="mt-5 p-4 bg-white bg-opacity-50 rounded-4 border border-white shadow-sm">
                    <h5 className="h6 fw-bold text-dark d-flex align-items-center gap-2 mb-3">
                        <FaRegLightbulb className="text-warning" /> Pro Copywriting Tips
                    </h5>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <div className="tip-card p-3 rounded-3 bg-white border-0 shadow-sm">
                                <div className="fw-bold mb-1 small text-primary">Use Numbers</div>
                                <p className="small text-muted mb-0">Odd numbers like 7, 11, or 13 tend to perform better in headlines.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="tip-card p-3 rounded-3 bg-white border-0 shadow-sm">
                                <div className="fw-bold mb-1 small text-success">Curiosity Gap</div>
                                <p className="small text-muted mb-0">Give readers enough info to be interested, but not enough to be satisfied.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="tip-card p-3 rounded-3 bg-white border-0 shadow-sm">
                                <div className="fw-bold mb-1 small text-danger">Negative Power</div>
                                <p className="small text-muted mb-0">"Stop doing X" often gets more clicks than "Start doing X".</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeadlineGenerator;
