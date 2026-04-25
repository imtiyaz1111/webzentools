import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { 
    FaMagic, FaCopy, FaDownload, FaSyncAlt, FaRegLightbulb, 
    FaGem, FaBullseye, FaLightbulb, FaRocket, FaCheckCircle 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './ValuePropositionGenerator.css';

const ValuePropositionGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    
    const [formData, setFormData] = useState({
        productName: '',
        targetCustomer: '',
        mainProblem: '',
        uniqueSolution: '',
        keyBenefit: ''
    });

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

    const generateValueProp = async () => {
        if (!formData.productName || !formData.uniqueSolution) {
            toast.error('Please enter product name and unique solution.');
            return;
        }

        setLoading(true);
        setError('');
        
        const prompt = `Generate a set of high-impact value propositions for:
        Product Name: "${formData.productName}"
        Target Customer: "${formData.targetCustomer}"
        Main Problem they face: "${formData.mainProblem}"
        My Unique Solution: "${formData.uniqueSolution}"
        Primary Benefit: "${formData.keyBenefit}"
        
        Please provide the following in JSON format:
        {
            "headline": "A short, punchy value proposition headline",
            "subheadline": "A 1-2 sentence explanation of how it works and who it's for",
            "bulletPoints": ["Benefit 1", "Benefit 2", "Benefit 3"],
            "elevatorPitch": "A 30-second summary for investors or customers",
            "tagline": "A memorable 3-5 word slogan"
        }
        Provide only the JSON object.`;

        try {
            const responseText = await callGeminiAI(prompt);
            const jsonStart = responseText.indexOf('{');
            const jsonEnd = responseText.lastIndexOf('}') + 1;
            const jsonStr = responseText.substring(jsonStart, jsonEnd);
            const data = JSON.parse(jsonStr);
            
            setResult(data);
            toast.success('Value propositions crafted!');
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
        if (!result) return;
        const content = `
VALUE PROPOSITION: ${formData.productName}

Headline: ${result.headline}
Subheadline: ${result.subheadline}

Key Benefits:
${result.bulletPoints.map(b => `- ${b}`).join('\n')}

Elevator Pitch:
${result.elevatorPitch}

Tagline: ${result.tagline}
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData.productName.replace(/\s+/g, '_')}_value_prop.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const resetTool = () => {
        setResult(null);
        setFormData({
            productName: '',
            targetCustomer: '',
            mainProblem: '',
            uniqueSolution: '',
            keyBenefit: ''
        });
        setError('');
    };

    return (
        <div className="value-prop-gen-container py-4">
            <div className="text-center mb-5">
                <div className="premium-badge mb-3">
                    <FaGem className="me-2 text-warning" /> Brand Core Defined
                </div>
                <h1 className="display-5 fw-bold mb-3 gradient-text">Value Proposition Gen</h1>
                <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                    Clearly define what makes your brand unique. Generate compelling value propositions that resonate with your customers and crush the competition.
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
                                    <FaBullseye size={24} />
                                </div>
                                <div>
                                    <h2 className="h4 fw-bold mb-1">Brand Strategy</h2>
                                    <p className="text-muted mb-0 small">Define your market fit</p>
                                </div>
                            </div>

                            <Form>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Product / Brand Name</Form.Label>
                                    <Form.Control 
                                        name="productName"
                                        placeholder="e.g. Webzen Designer Pro"
                                        value={formData.productName}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Target Customer</Form.Label>
                                    <Form.Control 
                                        name="targetCustomer"
                                        placeholder="e.g. Freelance graphic designers"
                                        value={formData.targetCustomer}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">The Main Problem You Solve</Form.Label>
                                    <Form.Control 
                                        as="textarea"
                                        rows={2}
                                        name="mainProblem"
                                        placeholder="e.g. Wasting hours on manual image background removal."
                                        value={formData.mainProblem}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Your Unique Solution</Form.Label>
                                    <Form.Control 
                                        as="textarea"
                                        rows={2}
                                        name="uniqueSolution"
                                        placeholder="e.g. AI-powered instant batch background removal."
                                        value={formData.uniqueSolution}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-5">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Biggest Benefit</Form.Label>
                                    <Form.Control 
                                        name="keyBenefit"
                                        placeholder="e.g. Save 10+ hours per week on editing."
                                        value={formData.keyBenefit}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Button 
                                    className="btn-premium w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                                    onClick={generateValueProp}
                                    disabled={loading}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : <FaRocket />}
                                    {loading ? 'Analyzing Fit...' : 'Craft Value Proposition'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>

                {/* Results Section */}
                {result && (
                    <div className="col-lg-7">
                        <Card className="premium-card border-0 shadow-lg h-100">
                            <Card.Body className="p-4 p-md-5">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-3 rounded-4 bg-success bg-opacity-10 text-success">
                                            <FaLightbulb size={24} />
                                        </div>
                                        <div>
                                            <h2 className="h4 fw-bold mb-1">Brand Core</h2>
                                            <p className="text-muted mb-0 small">Your unique positioning</p>
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

                                <div className="result-layout fade-in">
                                    <div className="mb-5">
                                        <h3 className="h4 fw-bold text-primary mb-2">{result.headline}</h3>
                                        <p className="text-muted">{result.subheadline}</p>
                                        <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={() => copyToClipboard(`${result.headline}\n${result.subheadline}`)}>
                                            <FaCopy className="me-2" /> Copy Section
                                        </Button>
                                    </div>

                                    <div className="mb-5">
                                        <h4 className="h6 fw-bold text-uppercase text-dark mb-3">Key Benefits</h4>
                                        <div className="benefit-grid">
                                            {result.bulletPoints.map((point, idx) => (
                                                <div key={idx} className="benefit-pill d-flex align-items-center gap-2 mb-2 p-2 px-3 rounded-3 bg-light border">
                                                    <FaCheckCircle className="text-success" />
                                                    <span className="small fw-semibold">{point}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <h4 className="h6 fw-bold text-uppercase text-dark mb-3">Elevator Pitch</h4>
                                        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-4 position-relative">
                                            <p className="mb-0 small italic">"{result.elevatorPitch}"</p>
                                        </div>
                                        <Button variant="link" size="sm" className="mt-2 p-0 text-decoration-none" onClick={() => copyToClipboard(result.elevatorPitch)}>
                                            <FaCopy className="me-2" /> Copy Pitch
                                        </Button>
                                    </div>

                                    <div className="tagline-box p-4 rounded-4 bg-dark text-center">
                                        <div className="text-muted extra-small text-uppercase mb-2">Tagline</div>
                                        <div className="h4 fw-bold text-white mb-0">"{result.tagline}"</div>
                                    </div>
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
                        <FaRegLightbulb className="text-warning" /> The 3 Rules of a Great Value Prop
                    </h5>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="tip-card p-3 rounded-3 bg-white shadow-sm h-100">
                                <div className="fw-bold small mb-2 text-primary">Clarity</div>
                                <p className="extra-small text-muted mb-0">It should be understood in 5 seconds or less. Avoid industry jargon.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="tip-card p-3 rounded-3 bg-white shadow-sm h-100">
                                <div className="fw-bold small mb-2 text-success">Benefit-Driven</div>
                                <p className="extra-small text-muted mb-0">Focus on the outcome for the user, not just the list of features.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="tip-card p-3 rounded-3 bg-white shadow-sm h-100">
                                <div className="fw-bold small mb-2 text-danger">Uniqueness</div>
                                <p className="extra-small text-muted mb-0">Why should they buy from you instead of your closest competitor?</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ValuePropositionGenerator;
