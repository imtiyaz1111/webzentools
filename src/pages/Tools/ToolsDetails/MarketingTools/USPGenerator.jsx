import React, { useState } from 'react';
import { Form, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { 
    FaMagic, FaCopy, FaDownload, FaSyncAlt, FaRegLightbulb, 
    FaCrown, FaShieldAlt, FaLightbulb, FaRocket, FaUserCheck 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './USPGenerator.css';
import aiService from '../../../../services/aiService.js';

const USPGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [usps, setUsps] = useState([]);
    
    const [formData, setFormData] = useState({
        productName: '',
        industry: '',
        competitors: '',
        uniqueFeature: '',
        customerPain: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generateUSP = async () => {
        if (!formData.productName || !formData.uniqueFeature) {
            toast.error('Please enter product name and your unique feature.');
            return;
        }

        setLoading(true);
        setError('');
        
        const prompt = `Generate 8 powerful Unique Selling Propositions (USPs) for:
        Product Name: "${formData.productName}"
        Industry: "${formData.industry}"
        Competitors: "${formData.competitors}"
        Unique Feature/Secret Sauce: "${formData.uniqueFeature}"
        Target Customer Pain Point: "${formData.customerPain}"
        
        A good USP should be:
        1. Bold and Assertive
        2. Specific and Quantifiable
        3. Solve a major pain point better than competitors.
        
        Provide only the list of USPs, one per line, without numbers or extra text.`;

        try {
            const result = await aiService.generateContent(prompt);
            const cleanedUsps = result.split('\n')
                .map(u => u.trim().replace(/^\d+\.\s*/, '').replace(/^"|"$/g, ''))
                .filter(u => u.length > 5)
                .slice(0, 8);
            
            setUsps(cleanedUsps);
            toast.success('USPs generated successfully!');
        } catch (err) {
            setError('Failed to generate: ' + err.message);
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
        const content = usps.join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `usps_${formData.productName.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const resetTool = () => {
        setUsps([]);
        setFormData({
            productName: '',
            industry: '',
            competitors: '',
            uniqueFeature: '',
            customerPain: ''
        });
        setError('');
    };

    return (
        <div className="usp-generator-container py-4">
            <div className="text-center mb-5">
                <div className="premium-badge mb-3">
                    <FaCrown className="me-2 text-warning" /> Competitive Edge Creator
                </div>
                <h1 className="display-5 fw-bold mb-3 gradient-text">USP Generator</h1>
                <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                    Stop being just another option. Craft a powerful Unique Selling Proposition that makes you the only logical choice for your customers.
                </p>
            </div>

            {error && <Alert variant="danger" className="mb-4 rounded-4 border-0 shadow-sm">{error}</Alert>}

            <div className="row g-4">
                {/* Input Section */}
                <div className={usps.length > 0 ? "col-lg-5" : "col-lg-8 mx-auto"}>
                    <Card className="premium-card border-0 shadow-lg h-100">
                        <Card.Body className="p-4 p-md-5">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary">
                                    <FaShieldAlt size={24} />
                                </div>
                                <div>
                                    <h2 className="h4 fw-bold mb-1">Differentiation Factor</h2>
                                    <p className="text-muted mb-0 small">Tell us what makes you special</p>
                                </div>
                            </div>

                            <Form>
                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <Form.Label className="fw-bold text-dark small text-uppercase">Product Name</Form.Label>
                                        <Form.Control 
                                            name="productName"
                                            placeholder="e.g. SpeedOps"
                                            value={formData.productName}
                                            onChange={handleInputChange}
                                            className="premium-input"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <Form.Label className="fw-bold text-dark small text-uppercase">Industry</Form.Label>
                                        <Form.Control 
                                            name="industry"
                                            placeholder="e.g. Cloud Hosting"
                                            value={formData.industry}
                                            onChange={handleInputChange}
                                            className="premium-input"
                                        />
                                    </div>
                                </div>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Key Competitors</Form.Label>
                                    <Form.Control 
                                        name="competitors"
                                        placeholder="e.g. AWS, DigitalOcean, Heroku"
                                        value={formData.competitors}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">What's your "Secret Sauce"?</Form.Label>
                                    <Form.Control 
                                        as="textarea"
                                        rows={2}
                                        name="uniqueFeature"
                                        placeholder="e.g. Proprietary edge-caching algorithm that reduces latency by 40%."
                                        value={formData.uniqueFeature}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-5">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Main Customer Pain Point</Form.Label>
                                    <Form.Control 
                                        as="textarea"
                                        rows={2}
                                        name="customerPain"
                                        placeholder="e.g. Slow loading times causing high bounce rates."
                                        value={formData.customerPain}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Button 
                                    className="btn-premium w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                                    onClick={generateUSP}
                                    disabled={loading}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : <FaMagic />}
                                    {loading ? 'Finding Your Edge...' : 'Generate 8 Unique USPs'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>

                {/* Results Section */}
                {usps.length > 0 && (
                    <div className="col-lg-7">
                        <Card className="premium-card border-0 shadow-lg h-100">
                            <Card.Body className="p-4 p-md-5">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-3 rounded-4 bg-success bg-opacity-10 text-success">
                                            <FaRocket size={24} />
                                        </div>
                                        <div>
                                            <h2 className="h4 fw-bold mb-1">Your Competitive Edge</h2>
                                            <p className="text-muted mb-0 small">Bold claims that convert</p>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-light rounded-pill p-2" onClick={downloadResult} title="Download All">
                                            <FaDownload />
                                        </button>
                                        <button className="btn btn-light rounded-pill p-2" onClick={resetTool} title="Reset">
                                            <FaSyncAlt />
                                        </button>
                                    </div>
                                </div>

                                <div className="usp-grid">
                                    {usps.map((usp, index) => (
                                        <div key={index} className="usp-item fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                            <div className="usp-label">Concept {index + 1}</div>
                                            <div className="d-flex justify-content-between align-items-center gap-3">
                                                <div className="usp-text fw-bold text-dark">{usp}</div>
                                                <button className="copy-btn-circle" onClick={() => copyToClipboard(usp)} title="Copy USP">
                                                    <FaCopy />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                )}
            </div>

            {/* Footer Tips */}
            {!loading && usps.length === 0 && (
                <div className="mt-5 p-4 glass-panel rounded-4 border border-white">
                    <h5 className="h6 fw-bold text-dark d-flex align-items-center gap-2 mb-3">
                        <FaRegLightbulb className="text-warning" /> The "USP" Checklist
                    </h5>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="tip-box text-center p-3">
                                <FaLightbulb className="text-primary mb-2" size={24} />
                                <div className="fw-bold small mb-1">Be Specific</div>
                                <p className="extra-small text-muted mb-0">Don't say "we are fast". Say "we deliver in 24 hours or it's free".</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="tip-box text-center p-3">
                                <FaUserCheck className="text-success mb-2" size={24} />
                                <div className="fw-bold small mb-1">Resonate with Pain</div>
                                <p className="extra-small text-muted mb-0">A USP only works if it solves a problem the customer actually cares about.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="tip-box text-center p-3">
                                <FaCrown className="text-danger mb-2" size={24} />
                                <div className="fw-bold small mb-1">Hard to Imitate</div>
                                <p className="extra-small text-muted mb-0">If your competitor can say the same thing, it's not a USP.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default USPGenerator;
