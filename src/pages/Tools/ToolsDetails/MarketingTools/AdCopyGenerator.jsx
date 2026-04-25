import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Spinner, Alert, Card, Tab, Nav } from 'react-bootstrap';
import { 
    FaMagic, FaCopy, FaDownload, FaSyncAlt, FaRegLightbulb, 
    FaFacebook, FaGoogle, FaInstagram, FaLinkedin, FaAd 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './AdCopyGenerator.css';

const AdCopyGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    const [activeTab, setActiveTab] = useState('facebook');
    
    const [formData, setFormData] = useState({
        productName: '',
        targetAudience: '',
        mainBenefit: '',
        cta: 'Learn More',
        tone: 'Persuasive'
    });

    const platforms = [
        { id: 'facebook', name: 'Facebook', icon: <FaFacebook /> },
        { id: 'google', name: 'Google Search', icon: <FaGoogle /> },
        { id: 'instagram', name: 'Instagram', icon: <FaInstagram /> },
        { id: 'linkedin', name: 'LinkedIn', icon: <FaLinkedin /> }
    ];

    const ctas = [
        'Learn More', 'Sign Up', 'Buy Now', 'Get Offer', 
        'Download', 'Book Now', 'Join Today'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

    const generateAdCopy = async () => {
        if (!formData.productName || !formData.mainBenefit) {
            toast.error('Please enter product name and main benefit.');
            return;
        }

        setLoading(true);
        setError('');
        
        const prompt = `Generate high-converting ad copy for multiple platforms for:
        Product Name: "${formData.productName}"
        Main Benefit: "${formData.mainBenefit}"
        Target Audience: "${formData.targetAudience}"
        CTA: "${formData.cta}"
        Tone: ${formData.tone}
        
        Please provide the output in the following JSON format:
        {
            "facebook": {
                "primaryText": "The main ad text",
                "headline": "Ad headline",
                "description": "Short news feed description"
            },
            "google": {
                "headline1": "Main headline",
                "headline2": "Secondary headline",
                "description": "Ad description text"
            },
            "instagram": {
                "caption": "Catchy caption with emojis",
                "hashtags": ["tag1", "tag2", "tag3"]
            },
            "linkedin": {
                "introText": "Professional intro",
                "headline": "Business-focused headline"
            }
        }
        Provide only the JSON object.`;

        try {
            const responseText = await callGeminiAI(prompt);
            const jsonStart = responseText.indexOf('{');
            const jsonEnd = responseText.lastIndexOf('}') + 1;
            const jsonStr = responseText.substring(jsonStart, jsonEnd);
            const data = JSON.parse(jsonStr);
            
            setResult(data);
            toast.success('Ad copies generated for all platforms!');
        } catch (err) {
            setError('Failed to generate ad copy: ' + err.message);
            toast.error('Generation failed.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const resetTool = () => {
        setResult(null);
        setFormData({
            productName: '',
            targetAudience: '',
            mainBenefit: '',
            cta: 'Learn More',
            tone: 'Persuasive'
        });
        setError('');
    };

    return (
        <div className="ad-copy-gen-container py-4">
            <div className="text-center mb-5">
                <div className="premium-badge mb-3">
                    <FaAd className="me-2" /> Multi-Platform Ads
                </div>
                <h1 className="display-5 fw-bold mb-3 gradient-text">Smart Ad Copy Generator</h1>
                <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                    Create winning ad copy for every platform in one click. Optimized for high CTR and conversion rates across social and search.
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
                                    <FaMagic size={24} />
                                </div>
                                <div>
                                    <h2 className="h4 fw-bold mb-1">Ad Parameters</h2>
                                    <p className="text-muted mb-0 small">Define your campaign</p>
                                </div>
                            </div>

                            <Form>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Product / Service Name</Form.Label>
                                    <Form.Control 
                                        name="productName"
                                        placeholder="e.g. FitTrack Smart Watch"
                                        value={formData.productName}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Main Benefit / Offer</Form.Label>
                                    <Form.Control 
                                        as="textarea"
                                        rows={2}
                                        name="mainBenefit"
                                        placeholder="e.g. Track 15+ body metrics, 30-day battery life, 20% off today"
                                        value={formData.mainBenefit}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <Form.Label className="fw-bold text-dark small text-uppercase">Target Audience</Form.Label>
                                        <Form.Control 
                                            name="targetAudience"
                                            placeholder="e.g. Fitness Enthusiasts"
                                            value={formData.targetAudience}
                                            onChange={handleInputChange}
                                            className="premium-input"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <Form.Label className="fw-bold text-dark small text-uppercase">Call to Action</Form.Label>
                                        <Form.Select 
                                            name="cta"
                                            value={formData.cta}
                                            onChange={handleInputChange}
                                            className="premium-input"
                                        >
                                            {ctas.map(cta => (
                                                <option key={cta} value={cta}>{cta}</option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                </div>

                                <Form.Group className="mb-5">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Tone</Form.Label>
                                    <Form.Select 
                                        name="tone"
                                        value={formData.tone}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    >
                                        {['Persuasive', 'Urgent', 'Inspirational', 'Casual', 'Professional'].map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Button 
                                    className="btn-premium w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                                    onClick={generateAdCopy}
                                    disabled={loading}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : <FaMagic />}
                                    {loading ? 'Crafting Ad Copies...' : 'Generate Ads for All Platforms'}
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
                                            <FaAd size={24} />
                                        </div>
                                        <div>
                                            <h2 className="h4 fw-bold mb-1">Generated Ads</h2>
                                            <p className="text-muted mb-0 small">Select a platform to view</p>
                                        </div>
                                    </div>
                                    <Button variant="light" className="rounded-pill shadow-sm" onClick={resetTool}>
                                        <FaSyncAlt />
                                    </Button>
                                </div>
                                <Nav variant="tabs" className="premium-tabs border-0 gap-1 p-1 mb-3">
                                    {platforms.map(platform => (
                                        <Nav.Item key={platform.id}>
                                            <Nav.Link 
                                                active={activeTab === platform.id}
                                                onClick={() => setActiveTab(platform.id)}
                                                className="d-flex align-items-center gap-2"
                                            >
                                                {platform.icon} {platform.name}
                                            </Nav.Link>
                                        </Nav.Item>
                                    ))}
                                </Nav>
                            </Card.Header>
                            <Card.Body className="p-4 pt-0">
                                <div className="ad-preview-area fade-in">
                                    {activeTab === 'facebook' && (
                                        <div className="fb-preview p-3 rounded-4 bg-white border shadow-sm">
                                            <div className="small fw-bold text-primary mb-2">Facebook Ad Preview</div>
                                            <div className="mb-3">
                                                <div className="small text-muted mb-1">Primary Text</div>
                                                <div className="p-3 bg-light rounded-3 small">{result.facebook.primaryText}</div>
                                                <Button variant="link" size="sm" className="p-0 mt-1" onClick={() => copyToClipboard(result.facebook.primaryText)}>Copy Primary Text</Button>
                                            </div>
                                            <div className="mb-3">
                                                <div className="small text-muted mb-1">Headline</div>
                                                <div className="p-2 bg-light rounded-3 fw-bold small">{result.facebook.headline}</div>
                                                <Button variant="link" size="sm" className="p-0 mt-1" onClick={() => copyToClipboard(result.facebook.headline)}>Copy Headline</Button>
                                            </div>
                                            <Button className="btn-premium w-100 mt-2" size="sm">{formData.cta}</Button>
                                        </div>
                                    )}

                                    {activeTab === 'google' && (
                                        <div className="google-preview p-3 rounded-4 bg-white border shadow-sm">
                                            <div className="small fw-bold text-primary mb-2">Google Ads Preview</div>
                                            <div className="mb-3">
                                                <div className="small text-muted mb-1">Headlines</div>
                                                <div className="p-2 bg-light rounded-3 text-primary fw-bold mb-1">{result.google.headline1}</div>
                                                <div className="p-2 bg-light rounded-3 text-primary fw-bold">{result.google.headline2}</div>
                                                <Button variant="link" size="sm" className="p-0 mt-1" onClick={() => copyToClipboard(`${result.google.headline1} | ${result.google.headline2}`)}>Copy Headlines</Button>
                                            </div>
                                            <div>
                                                <div className="small text-muted mb-1">Description</div>
                                                <div className="p-3 bg-light rounded-3 small">{result.google.description}</div>
                                                <Button variant="link" size="sm" className="p-0 mt-1" onClick={() => copyToClipboard(result.google.description)}>Copy Description</Button>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'instagram' && (
                                        <div className="ig-preview p-3 rounded-4 bg-white border shadow-sm">
                                            <div className="small fw-bold text-primary mb-2">Instagram Caption Preview</div>
                                            <div className="p-3 bg-light rounded-3 small mb-3" style={{ whiteSpace: 'pre-wrap' }}>
                                                {result.instagram.caption}
                                                <div className="mt-3 text-primary">
                                                    {result.instagram.hashtags.map(tag => `#${tag} `)}
                                                </div>
                                            </div>
                                            <Button variant="outline-primary" size="sm" className="rounded-pill w-100" onClick={() => copyToClipboard(`${result.instagram.caption}\n\n${result.instagram.hashtags.map(t => `#${t}`).join(' ')}`)}>
                                                <FaCopy className="me-2" /> Copy Caption + Hashtags
                                            </Button>
                                        </div>
                                    )}

                                    {activeTab === 'linkedin' && (
                                        <div className="linkedin-preview p-3 rounded-4 bg-white border shadow-sm">
                                            <div className="small fw-bold text-primary mb-2">LinkedIn Post Preview</div>
                                            <div className="mb-3">
                                                <div className="small text-muted mb-1">Intro Text</div>
                                                <div className="p-3 bg-light rounded-3 small">{result.linkedin.introText}</div>
                                                <Button variant="link" size="sm" className="p-0 mt-1" onClick={() => copyToClipboard(result.linkedin.introText)}>Copy Intro Text</Button>
                                            </div>
                                            <div className="mb-3">
                                                <div className="small text-muted mb-1">Headline</div>
                                                <div className="p-2 bg-light rounded-3 fw-bold small">{result.linkedin.headline}</div>
                                                <Button variant="link" size="sm" className="p-0 mt-1" onClick={() => copyToClipboard(result.linkedin.headline)}>Copy Headline</Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                )}
            </div>

            {/* Tips Section */}
            {!loading && !result && (
                <div className="mt-5 p-4 bg-white bg-opacity-50 rounded-4 border border-white shadow-sm">
                    <h5 className="h6 fw-bold text-dark d-flex align-items-center gap-2 mb-3">
                        <FaRegLightbulb className="text-warning" /> Ad Performance Secrets
                    </h5>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="tip-card p-3 rounded-3 bg-white border-0 shadow-sm h-100">
                                <div className="fw-bold mb-1 small text-primary">Platform Fit</div>
                                <p className="extra-small text-muted mb-0">Google Ads should be intent-focused, while FB/IG should be disruptive and visual.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="tip-card p-3 rounded-3 bg-white border-0 shadow-sm h-100">
                                <div className="fw-bold mb-1 small text-success">CTA Clarity</div>
                                <p className="extra-small text-muted mb-0">Always use a single, clear CTA. Don't confuse the user with multiple next steps.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="tip-card p-3 rounded-3 bg-white border-0 shadow-sm h-100">
                                <div className="fw-bold mb-1 small text-danger">Emoji Strategy</div>
                                <p className="extra-small text-muted mb-0">Emojis can boost CTR on social platforms but should be used sparingly on LinkedIn.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdCopyGenerator;
