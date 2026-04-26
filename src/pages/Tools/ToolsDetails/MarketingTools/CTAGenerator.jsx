import React, { useState } from 'react';
import { Form, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { 
    FaMagic, FaCopy, FaDownload, FaSyncAlt, FaRegLightbulb, 
    FaMousePointer, FaLayerGroup, FaBolt, FaStar, FaInfoCircle 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './CTAGenerator.css';
import aiService from '../../../../services/aiService.js';

const CTAGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [ctas, setCtas] = useState([]);
    
    const [formData, setFormData] = useState({
        productName: '',
        offer: '',
        ctaType: 'Button Text',
        tone: 'Urgent',
        goal: 'Sign Up'
    });

    const ctaTypes = [
        'Button Text', 'Email CTA', 'Sales Page Link', 
        'Social Media Post CTA', 'Popup Heading', 'Micro-copy'
    ];

    const tones = [
        'Urgent', 'Friendly', 'Professional', 'Fear of Missing Out (FOMO)', 
        'Direct', 'Benefit-focused', 'Curiosity-driven'
    ];

    const goals = [
        'Sign Up', 'Buy Now', 'Download', 'Contact Us', 
        'Learn More', 'Start Free Trial', 'Book a Call'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generateCTAs = async () => {
        if (!formData.productName || !formData.offer) {
            toast.error('Please enter product name and offer details.');
            return;
        }

        setLoading(true);
        setError('');
        
        const prompt = `Generate 12 high-converting ${formData.ctaType} options for:
        Product/Service: "${formData.productName}"
        Offer/Benefit: "${formData.offer}"
        Tone: ${formData.tone}
        Main Goal: ${formData.goal}
        
        Use psychological triggers and proven marketing formulas.
        Provide only the list of CTAs, one per line, without numbers or extra text.`;

        try {
            const result = await aiService.generateContent(prompt);
            const cleanedCtas = result.split('\n')
                .map(c => c.trim().replace(/^\d+\.\s*/, '').replace(/^"|"$/g, ''))
                .filter(c => c.length > 2)
                .slice(0, 12);
            
            setCtas(cleanedCtas);
            toast.success('CTA options generated!');
        } catch (err) {
            setError('Failed to generate CTAs: ' + err.message);
            toast.error('Generation failed.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const downloadCTAs = () => {
        const content = ctas.join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ctas_${formData.productName.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const resetTool = () => {
        setCtas([]);
        setFormData({
            productName: '',
            offer: '',
            ctaType: 'Button Text',
            tone: 'Urgent',
            goal: 'Sign Up'
        });
        setError('');
    };

    return (
        <div className="cta-generator-container py-4">
            <div className="text-center mb-5">
                <div className="premium-badge mb-3">
                    <FaBolt className="me-2 text-warning" /> Conversion Optimized
                </div>
                <h1 className="display-5 fw-bold mb-3 gradient-text">Smart CTA Generator</h1>
                <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                    Generate high-converting Call-to-Actions using AI that drives more clicks, sign-ups, and sales for your marketing campaigns.
                </p>
            </div>

            {error && <Alert variant="danger" className="mb-4 rounded-4 border-0 shadow-sm">{error}</Alert>}

            <div className="row g-4">
                {/* Input Section */}
                <div className={ctas.length > 0 ? "col-lg-5" : "col-lg-8 mx-auto"}>
                    <Card className="premium-card border-0 shadow-lg h-100">
                        <Card.Body className="p-4 p-md-5">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="p-3 rounded-4 bg-indigo-500 bg-opacity-10 text-indigo-600">
                                    <FaLayerGroup size={24} />
                                </div>
                                <div>
                                    <h2 className="h4 fw-bold mb-1">CTA Configuration</h2>
                                    <p className="text-muted mb-0 small">Tailor your call-to-action</p>
                                </div>
                            </div>

                            <Form>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Product or Service Name</Form.Label>
                                    <Form.Control 
                                        name="productName"
                                        placeholder="e.g. WebzenTools Premium"
                                        value={formData.productName}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">The Offer / Main Benefit</Form.Label>
                                    <Form.Control 
                                        as="textarea"
                                        rows={2}
                                        name="offer"
                                        placeholder="e.g. Get 50% off for the first month or Free 7-day trial of all AI tools"
                                        value={formData.offer}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <Form.Label className="fw-bold text-dark small text-uppercase">CTA Type</Form.Label>
                                        <Form.Select 
                                            name="ctaType"
                                            value={formData.ctaType}
                                            onChange={handleInputChange}
                                            className="premium-input"
                                        >
                                            {ctaTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <Form.Label className="fw-bold text-dark small text-uppercase">Desired Goal</Form.Label>
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
                                </div>

                                <Form.Group className="mb-5">
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
                                </Form.Group>

                                <Button 
                                    className="btn-premium w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                                    onClick={generateCTAs}
                                    disabled={loading}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : <FaMagic />}
                                    {loading ? 'Crafting CTAs...' : 'Generate 12 Options'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>

                {/* Results Section */}
                {ctas.length > 0 && (
                    <div className="col-lg-7">
                        <Card className="premium-card border-0 shadow-lg h-100">
                            <Card.Body className="p-4 p-md-5">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary">
                                            <FaStar size={24} />
                                        </div>
                                        <div>
                                            <h2 className="h4 fw-bold mb-1">Generated CTAs</h2>
                                            <p className="text-muted mb-0 small">Optimized for conversion</p>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-light rounded-pill p-2 shadow-sm" onClick={downloadCTAs} title="Download All">
                                            <FaDownload />
                                        </button>
                                        <button className="btn btn-light rounded-pill p-2 shadow-sm" onClick={resetTool} title="Start Over">
                                            <FaSyncAlt />
                                        </button>
                                    </div>
                                </div>

                                <div className="cta-grid">
                                    {ctas.map((cta, index) => (
                                        <div key={index} className="cta-item fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                                            <div className="cta-content">
                                                <div className="cta-label">Option {index + 1}</div>
                                                <div className="cta-text">{cta}</div>
                                            </div>
                                            <button 
                                                className="cta-copy-btn" 
                                                onClick={() => copyToClipboard(cta)}
                                                title="Copy CTA"
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

            {/* Educational Section */}
            {!loading && ctas.length === 0 && (
                <div className="mt-5 p-4 glass-panel rounded-4 border border-white shadow-sm">
                    <h5 className="h6 fw-bold text-dark d-flex align-items-center gap-2 mb-4">
                        <FaRegLightbulb className="text-warning" /> Why CTAs Matter
                    </h5>
                    <div className="row g-4">
                        <div className="col-md-3">
                            <div className="info-item">
                                <FaMousePointer className="mb-2 text-primary" />
                                <div className="fw-bold small">Direct Action</div>
                                <p className="text-muted extra-small mb-0">Tells your audience exactly what to do next.</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="info-item">
                                <FaBolt className="mb-2 text-warning" />
                                <div className="fw-bold small">Create Urgency</div>
                                <p className="text-muted extra-small mb-0">Triggers immediate response with time-sensitive language.</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="info-item">
                                <FaStar className="mb-2 text-success" />
                                <div className="fw-bold small">Benefit Driven</div>
                                <p className="text-muted extra-small mb-0">Focuses on what the user gets, not what they have to do.</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="info-item">
                                <FaInfoCircle className="mb-2 text-info" />
                                <div className="fw-bold small">Clear Guidance</div>
                                <p className="text-muted extra-small mb-0">Reduces friction by removing decision fatigue.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CTAGenerator;
