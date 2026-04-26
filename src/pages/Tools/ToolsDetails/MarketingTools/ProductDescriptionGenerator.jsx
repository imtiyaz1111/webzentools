import React, { useState } from 'react';
import { Form, Button, Spinner, Alert, Card, Tab, Nav } from 'react-bootstrap';
import { 
    FaMagic, FaCopy, FaDownload, FaSyncAlt, FaRegLightbulb, 
    FaShoppingBag, FaTags, FaClipboardList, FaCheckCircle, FaStar 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './ProductDescriptionGenerator.css';
import aiService from '../../../../services/aiService.js';

const ProductDescriptionGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    const [activeTab, setActiveTab] = useState('description');
    
    const [formData, setFormData] = useState({
        productName: '',
        keyFeatures: '',
        targetAudience: '',
        tone: 'Persuasive',
        length: 'Medium'
    });

    const tones = [
        'Persuasive', 'Luxury', 'Minimalist', 'Professional', 
        'Exciting', 'Friendly', 'Informative'
    ];

    const lengths = [
        { label: 'Short (Bullet points focus)', value: 'Short' },
        { label: 'Medium (Balanced)', value: 'Medium' },
        { label: 'Long (Story-telling focus)', value: 'Long' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generateDescription = async () => {
        if (!formData.productName || !formData.keyFeatures) {
            toast.error('Please enter product name and key features.');
            return;
        }

        setLoading(true);
        setError('');
        
        const prompt = `Generate a premium, high-converting product description for:
        Product Name: "${formData.productName}"
        Key Features/Benefits: "${formData.keyFeatures}"
        Target Audience: "${formData.targetAudience || 'General'}"
        Tone: ${formData.tone}
        Length: ${formData.length}
        
        Please provide the output in the following JSON format:
        {
            "headline": "A catchy product headline",
            "description": "The main description text (formatted with paragraphs)",
            "bullets": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
            "seo_tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
        }
        Provide only the JSON object.`;

        try {
            const data = await aiService.generateContent(prompt, 'json');
            setResult(data);
            toast.success('Description generated successfully!');
        } catch (err) {
            setError('Failed to generate description: ' + err.message);
            toast.error('Generation failed.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const downloadResult = () => {
        if (!result) return;
        const content = `
Product: ${formData.productName}
Headline: ${result.headline}

Description:
${result.description}

Key Features:
${result.bullets.map(b => `- ${b}`).join('\n')}

SEO Tags:
${result.seo_tags.join(', ')}
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData.productName.replace(/\s+/g, '_')}_description.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const resetTool = () => {
        setResult(null);
        setFormData({
            productName: '',
            keyFeatures: '',
            targetAudience: '',
            tone: 'Persuasive',
            length: 'Medium'
        });
        setError('');
    };

    return (
        <div className="product-desc-generator-container py-4">
            <div className="text-center mb-5">
                <div className="premium-badge mb-3">
                    <FaShoppingBag className="me-2" /> E-commerce Growth Tool
                </div>
                <h1 className="display-5 fw-bold mb-3 gradient-text">Product Description Gen</h1>
                <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                    Generate SEO-optimized, persuasive product descriptions that sell. Perfect for Shopify, Amazon, Etsy, and your custom store.
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
                                    <FaTags size={24} />
                                </div>
                                <div>
                                    <h2 className="h4 fw-bold mb-1">Product Info</h2>
                                    <p className="text-muted mb-0 small">Enter the core details</p>
                                </div>
                            </div>

                            <Form>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Product Name</Form.Label>
                                    <Form.Control 
                                        name="productName"
                                        placeholder="e.g. Ergonomic Office Chair"
                                        value={formData.productName}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Key Features (One per line)</Form.Label>
                                    <Form.Control 
                                        as="textarea"
                                        rows={4}
                                        name="keyFeatures"
                                        placeholder="e.g. Memory foam cushion\nAdjustable armrests\nBreathable mesh back\nHeavy-duty base"
                                        value={formData.keyFeatures}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Target Audience</Form.Label>
                                    <Form.Control 
                                        name="targetAudience"
                                        placeholder="e.g. Office workers, Gamers"
                                        value={formData.targetAudience}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <div className="row">
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
                                    <div className="col-md-6 mb-4">
                                        <Form.Label className="fw-bold text-dark small text-uppercase">Length</Form.Label>
                                        <Form.Select 
                                            name="length"
                                            value={formData.length}
                                            onChange={handleInputChange}
                                            className="premium-input"
                                        >
                                            {lengths.map(l => (
                                                <option key={l.value} value={l.value}>{l.label}</option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                </div>

                                <Button 
                                    className="btn-premium w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                                    onClick={generateDescription}
                                    disabled={loading}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : <FaMagic />}
                                    {loading ? 'Writing Description...' : 'Generate Description'}
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
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
                                            <FaCheckCircle />
                                        </div>
                                        <h3 className="h5 fw-bold mb-0">Generated Content</h3>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-light rounded-pill p-2" onClick={downloadResult} title="Download File">
                                            <FaDownload />
                                        </button>
                                        <button className="btn btn-light rounded-pill p-2" onClick={resetTool} title="Reset">
                                            <FaSyncAlt />
                                        </button>
                                    </div>
                                </div>
                                <Nav variant="tabs" className="premium-tabs border-0 gap-2">
                                    <Nav.Item>
                                        <Nav.Link 
                                            active={activeTab === 'description'}
                                            onClick={() => setActiveTab('description')}
                                        >
                                            Description
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link 
                                            active={activeTab === 'bullets'}
                                            onClick={() => setActiveTab('bullets')}
                                        >
                                            Bullets
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link 
                                            active={activeTab === 'seo'}
                                            onClick={() => setActiveTab('seo')}
                                        >
                                            SEO Tags
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Header>
                            <Card.Body className="p-4 pt-4">
                                <div className="result-content-area">
                                    {activeTab === 'description' && (
                                        <div className="fade-in">
                                            <h4 className="h5 fw-bold text-primary mb-3">{result.headline}</h4>
                                            <div className="description-text mb-4">
                                                {result.description.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                                            </div>
                                            <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={() => copyToClipboard(result.description)}>
                                                <FaCopy className="me-2" /> Copy Description
                                            </Button>
                                        </div>
                                    )}

                                    {activeTab === 'bullets' && (
                                        <div className="fade-in">
                                            <ul className="feature-bullets">
                                                {result.bullets.map((bullet, idx) => (
                                                    <li key={idx} className="mb-3 d-flex gap-2">
                                                        <FaStar className="text-warning mt-1 flex-shrink-0" size={14} />
                                                        <span>{bullet}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={() => copyToClipboard(result.bullets.join('\n'))}>
                                                <FaCopy className="me-2" /> Copy Bullets
                                            </Button>
                                        </div>
                                    )}

                                    {activeTab === 'seo' && (
                                        <div className="fade-in">
                                            <div className="seo-tags-grid mb-4">
                                                {result.seo_tags.map((tag, idx) => (
                                                    <span key={idx} className="seo-tag">#{tag}</span>
                                                ))}
                                            </div>
                                            <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={() => copyToClipboard(result.seo_tags.join(', '))}>
                                                <FaCopy className="me-2" /> Copy All Tags
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
                <div className="mt-5 p-4 bg-light bg-opacity-50 rounded-4 border border-white">
                    <h5 className="h6 fw-bold text-dark d-flex align-items-center gap-2 mb-3">
                        <FaRegLightbulb className="text-warning" /> Tips for High-Converting Descriptions
                    </h5>
                    <ul className="text-muted small mb-0 ps-3">
                        <li className="mb-2"><strong>Benefits over Features:</strong> Instead of "4000mAh battery", try "All-day power that keeps you moving".</li>
                        <li className="mb-2"><strong>Use Sensory Words:</strong> Words like "Smooth", "Breathable", or "Lustrous" help customers visualize the product.</li>
                        <li><strong>Social Proof:</strong> If possible, mention how many people are already using the product or its top rating.</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProductDescriptionGenerator;
