import React, { useState } from 'react';
import { Form, Button, Spinner, Alert, Card, Tab, Nav } from 'react-bootstrap';
import { 
    FaMagic, FaCopy, FaDownload, FaSyncAlt, FaRegLightbulb, 
    FaDesktop, FaListAlt, FaQuestionCircle, FaStar, FaGlobe, FaCheckCircle 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './LandingPageGenerator.css';
import aiService from '../../../../services/aiService.js';

const LandingPageGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    const [activeTab, setActiveTab] = useState('hero');
    
    const [formData, setFormData] = useState({
        productName: '',
        targetAudience: '',
        keyBenefits: '',
        mainOffer: '',
        tone: 'Modern'
    });

    const tones = [
        'Modern', 'Professional', 'Minimalist', 'Energetic', 
        'Luxury', 'Trustworthy', 'Playful'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generateLandingPage = async () => {
        if (!formData.productName || !formData.mainOffer) {
            toast.error('Please enter product name and main offer.');
            return;
        }

        setLoading(true);
        setError('');
        
        const prompt = `Generate a complete landing page copy structure for:
        Product Name: "${formData.productName}"
        Main Offer: "${formData.mainOffer}"
        Key Benefits: "${formData.keyBenefits}"
        Target Audience: "${formData.targetAudience}"
        Tone: ${formData.tone}
        
        Please provide the output in the following JSON format:
        {
            "hero": {
                "headline": "Main headline",
                "subheadline": "Supporting subheadline",
                "cta": "Button text"
            },
            "features": [
                {"title": "Feature 1", "description": "Short description"},
                {"title": "Feature 2", "description": "Short description"},
                {"title": "Feature 3", "description": "Short description"}
            ],
            "benefits": [
                {"title": "Benefit 1", "description": "How it helps"},
                {"title": "Benefit 2", "description": "How it helps"},
                {"title": "Benefit 3", "description": "How it helps"}
            ],
            "faq": [
                {"question": "Common question 1", "answer": "The answer"},
                {"question": "Common question 2", "answer": "The answer"},
                {"question": "Common question 3", "answer": "The answer"}
            ]
        }
        Provide only the JSON object.`;

        try {
            const data = await aiService.generateContent(prompt, 'json');
            setResult(data);
            toast.success('Landing page copy generated!');
        } catch (err) {
            setError('Failed to generate copy: ' + err.message);
            toast.error('Generation failed.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const downloadFullCopy = () => {
        if (!result) return;
        const content = `
LANDING PAGE COPY: ${formData.productName}

[HERO SECTION]
Headline: ${result.hero.headline}
Subheadline: ${result.hero.subheadline}
CTA: ${result.hero.cta}

[FEATURES SECTION]
${result.features.map(f => `${f.title}: ${f.description}`).join('\n')}

[BENEFITS SECTION]
${result.benefits.map(b => `${b.title}: ${b.description}`).join('\n')}

[FAQ SECTION]
${result.faq.map(q => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n')}
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData.productName.replace(/\s+/g, '_')}_landing_page.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const resetTool = () => {
        setResult(null);
        setFormData({
            productName: '',
            targetAudience: '',
            keyBenefits: '',
            mainOffer: '',
            tone: 'Modern'
        });
        setError('');
    };

    return (
        <div className="landing-page-gen-container py-4">
            <div className="text-center mb-5">
                <div className="premium-badge mb-3">
                    <FaGlobe className="me-2" /> Web Conversion Suite
                </div>
                <h1 className="display-5 fw-bold mb-3 gradient-text">Landing Page Copy Gen</h1>
                <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                    Generate high-converting copy for every section of your landing page in seconds. From catchy hero headlines to helpful FAQs.
                </p>
            </div>

            {error && <Alert variant="danger" className="mb-4 rounded-4 border-0 shadow-sm">{error}</Alert>}

            <div className="row g-4">
                {/* Input Section */}
                <div className={result ? "col-lg-5" : "col-lg-8 mx-auto"}>
                    <Card className="premium-card border-0 shadow-lg h-100">
                        <Card.Body className="p-4 p-md-5">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary">
                                    <FaDesktop size={24} />
                                </div>
                                <div>
                                    <h2 className="h4 fw-bold mb-1">Page Details</h2>
                                    <p className="text-muted mb-0 small">Input your product core</p>
                                </div>
                            </div>

                            <Form>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Product / Service Name</Form.Label>
                                    <Form.Control 
                                        name="productName"
                                        placeholder="e.g. Webzen Cloud Storage"
                                        value={formData.productName}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Main Offer / Catch</Form.Label>
                                    <Form.Control 
                                        name="mainOffer"
                                        placeholder="e.g. 1TB free for 3 months"
                                        value={formData.mainOffer}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Key Benefits & Features</Form.Label>
                                    <Form.Control 
                                        as="textarea"
                                        rows={3}
                                        name="keyBenefits"
                                        placeholder="e.g. End-to-end encryption, multi-device sync, 24/7 support"
                                        value={formData.keyBenefits}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <Form.Label className="fw-bold text-dark small text-uppercase">Target Audience</Form.Label>
                                        <Form.Control 
                                            name="targetAudience"
                                            placeholder="e.g. Remote Teams"
                                            value={formData.targetAudience}
                                            onChange={handleInputChange}
                                            className="premium-input"
                                        />
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
                                    onClick={generateLandingPage}
                                    disabled={loading}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : <FaMagic />}
                                    {loading ? 'Designing Your Copy...' : 'Generate Full Page Copy'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>

                {/* Results Section */}
                {result && (
                    <div className="col-lg-7">
                        <Card className="premium-card border-0 shadow-lg h-100 overflow-hidden">
                            <Card.Header className="bg-transparent border-0 p-4 pb-0">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-3 rounded-4 bg-success bg-opacity-10 text-success">
                                            <FaStar size={24} />
                                        </div>
                                        <div>
                                            <h2 className="h4 fw-bold mb-1">Your Page Structure</h2>
                                            <p className="text-muted mb-0 small">Switch between sections</p>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-light rounded-pill p-2" onClick={downloadFullCopy} title="Download All">
                                            <FaDownload />
                                        </button>
                                        <button className="btn btn-light rounded-pill p-2" onClick={resetTool} title="Start Over">
                                            <FaSyncAlt />
                                        </button>
                                    </div>
                                </div>
                                <Nav variant="tabs" className="premium-tabs border-0 gap-1 p-1 mb-3">
                                    {['hero', 'features', 'benefits', 'faq'].map(tab => (
                                        <Nav.Item key={tab}>
                                            <Nav.Link 
                                                active={activeTab === tab}
                                                onClick={() => setActiveTab(tab)}
                                                className="text-capitalize"
                                            >
                                                {tab}
                                            </Nav.Link>
                                        </Nav.Item>
                                    ))}
                                </Nav>
                            </Card.Header>
                            <Card.Body className="p-4 pt-0">
                                <div className="tab-content-wrapper">
                                    {activeTab === 'hero' && (
                                        <div className="hero-preview p-4 rounded-4 bg-light fade-in">
                                            <h3 className="h4 fw-bold text-dark mb-3">{result.hero.headline}</h3>
                                            <p className="text-muted mb-4">{result.hero.subheadline}</p>
                                            <Button className="btn-premium px-4">{result.hero.cta}</Button>
                                            <div className="mt-4 pt-3 border-top d-flex gap-2">
                                                <Button variant="outline-primary" size="sm" onClick={() => copyToClipboard(result.hero.headline)}>Copy Headline</Button>
                                                <Button variant="outline-primary" size="sm" onClick={() => copyToClipboard(result.hero.subheadline)}>Copy Subheadline</Button>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'features' && (
                                        <div className="features-list fade-in">
                                            {result.features.map((f, i) => (
                                                <div key={i} className="feature-item-box p-3 mb-3 rounded-4 bg-white border shadow-sm d-flex gap-3">
                                                    <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary h-fit">
                                                        <FaCheckCircle />
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark">{f.title}</div>
                                                        <div className="small text-muted">{f.description}</div>
                                                    </div>
                                                </div>
                                            ))}
                                            <Button variant="outline-primary" className="w-100 rounded-pill mt-2" onClick={() => copyToClipboard(result.features.map(f => `${f.title}: ${f.description}`).join('\n'))}>
                                                <FaCopy className="me-2" /> Copy All Features
                                            </Button>
                                        </div>
                                    )}

                                    {activeTab === 'benefits' && (
                                        <div className="benefits-list fade-in">
                                             {result.benefits.map((b, i) => (
                                                <div key={i} className="feature-item-box p-3 mb-3 rounded-4 bg-white border shadow-sm d-flex gap-3">
                                                    <div className="p-2 rounded-3 bg-success bg-opacity-10 text-success h-fit">
                                                        <FaStar />
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark">{b.title}</div>
                                                        <div className="small text-muted">{b.description}</div>
                                                    </div>
                                                </div>
                                            ))}
                                            <Button variant="outline-primary" className="w-100 rounded-pill mt-2" onClick={() => copyToClipboard(result.benefits.map(b => `${b.title}: ${b.description}`).join('\n'))}>
                                                <FaCopy className="me-2" /> Copy All Benefits
                                            </Button>
                                        </div>
                                    )}

                                    {activeTab === 'faq' && (
                                        <div className="faq-list fade-in">
                                             {result.faq.map((q, i) => (
                                                <div key={i} className="p-3 mb-3 rounded-4 bg-white border shadow-sm">
                                                    <div className="fw-bold text-primary small mb-1">Q: {q.question}</div>
                                                    <div className="text-muted small">A: {q.answer}</div>
                                                </div>
                                            ))}
                                            <Button variant="outline-primary" className="w-100 rounded-pill mt-2" onClick={() => copyToClipboard(result.faq.map(q => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n'))}>
                                                <FaCopy className="me-2" /> Copy FAQ Section
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                )}
            </div>

            {/* Footer Tips */}
            {!loading && !result && (
                <div className="mt-5 p-4 glass-panel rounded-4 border border-white">
                    <h5 className="h6 fw-bold text-dark d-flex align-items-center gap-2 mb-3">
                        <FaRegLightbulb className="text-warning" /> High-Converting Page Structure
                    </h5>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <div className="tip-box p-3 rounded-3 bg-white border">
                                <div className="fw-bold small mb-1">Hero Section</div>
                                <p className="extra-small text-muted mb-0">Should solve the primary problem in under 5 seconds of reading.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="tip-box p-3 rounded-3 bg-white border">
                                <div className="fw-bold small mb-1">Features vs Benefits</div>
                                <p className="extra-small text-muted mb-0">Features tell, benefits sell. Always emphasize the "Why" over the "What".</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="tip-box p-3 rounded-3 bg-white border">
                                <div className="fw-bold small mb-1">FAQ Role</div>
                                <p className="extra-small text-muted mb-0">The FAQ section is for handling objections and building trust.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPageGenerator;
