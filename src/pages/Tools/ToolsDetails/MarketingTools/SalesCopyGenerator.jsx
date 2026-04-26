import React, { useState } from 'react';
import { Form, Button, Spinner, Alert, Card, Accordion } from 'react-bootstrap';
import { 
    FaMagic, FaCopy, FaDownload, FaSyncAlt, FaRegLightbulb, 
    FaChartLine, FaQuoteLeft, FaClipboardCheck, FaLayerGroup, FaCheckCircle 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './SalesCopyGenerator.css';
import aiService from '../../../../services/aiService.js';

const SalesCopyGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    
    const [formData, setFormData] = useState({
        productName: '',
        targetAudience: '',
        painPoints: '',
        solution: '',
        framework: 'AIDA'
    });

    const frameworks = [
        { id: 'AIDA', name: 'AIDA (Attention, Interest, Desire, Action)' },
        { id: 'PAS', name: 'PAS (Problem, Agitation, Solution)' },
        { id: 'BAB', name: 'BAB (Before, After, Bridge)' },
        { id: '4Cs', name: '4Cs (Clear, Concise, Compelling, Credible)' },
        { id: 'FAB', name: 'FAB (Features, Advantages, Benefits)' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generateSalesCopy = async () => {
        if (!formData.productName || !formData.solution) {
            toast.error('Please enter product name and solution details.');
            return;
        }

        setLoading(true);
        setError('');
        
        const prompt = `Generate a high-converting sales copy using the ${formData.framework} framework for:
        Product/Service: "${formData.productName}"
        Target Audience: "${formData.targetAudience || 'General customers'}"
        Pain Points to Address: "${formData.painPoints || 'Not specified'}"
        Main Solution/Offer: "${formData.solution}"
        
        Format the output clearly with headers for each part of the framework (e.g., if AIDA: Attention, Interest, Desire, Action).
        Make it persuasive, engaging, and professional.
        Include a catchy headline at the start.`;

        try {
            const resultText = await aiService.generateContent(prompt);
            setResult(resultText);
            toast.success('Sales copy generated!');
        } catch (err) {
            setError('Failed to generate sales copy: ' + err.message);
            toast.error('Generation failed.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        toast.success('Copy copied to clipboard!');
    };

    const downloadCopy = () => {
        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sales_copy_${formData.productName.replace(/\s+/g, '_')}.txt`;
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
            painPoints: '',
            solution: '',
            framework: 'AIDA'
        });
        setError('');
    };

    return (
        <div className="sales-copy-generator-container py-4">
            <div className="text-center mb-5">
                <div className="premium-badge mb-3">
                    <FaChartLine className="me-2" /> Conversion Frameworks
                </div>
                <h1 className="display-5 fw-bold mb-3 gradient-text">Smart Sales Copy Gen</h1>
                <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                    Generate persuasive sales copy in seconds using proven marketing frameworks like AIDA and PAS. Perfect for landing pages, emails, and ads.
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
                                    <FaLayerGroup size={24} />
                                </div>
                                <div>
                                    <h2 className="h4 fw-bold mb-1">Copy Parameters</h2>
                                    <p className="text-muted mb-0 small">Select framework and details</p>
                                </div>
                            </div>

                            <Form>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Framework</Form.Label>
                                    <Form.Select 
                                        name="framework"
                                        value={formData.framework}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    >
                                        {frameworks.map(f => (
                                            <option key={f.id} value={f.id}>{f.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Product Name</Form.Label>
                                    <Form.Control 
                                        name="productName"
                                        placeholder="e.g. AI-Powered CRM Software"
                                        value={formData.productName}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Target Audience</Form.Label>
                                    <Form.Control 
                                        name="targetAudience"
                                        placeholder="e.g. Small Business Owners"
                                        value={formData.targetAudience}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Main Pain Points</Form.Label>
                                    <Form.Control 
                                        as="textarea"
                                        rows={2}
                                        name="painPoints"
                                        placeholder="e.g. High customer churn, disorganized leads, wasting time on manual entry"
                                        value={formData.painPoints}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-5">
                                    <Form.Label className="fw-bold text-dark small text-uppercase">Your Solution / Offer</Form.Label>
                                    <Form.Control 
                                        as="textarea"
                                        rows={3}
                                        name="solution"
                                        placeholder="e.g. Automated lead tracking, 30% reduction in churn, free 30-day trial"
                                        value={formData.solution}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Button 
                                    className="btn-premium w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                                    onClick={generateSalesCopy}
                                    disabled={loading}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : <FaMagic />}
                                    {loading ? 'Crafting Sales Copy...' : 'Generate Sales Copy'}
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
                                            <FaClipboardCheck size={24} />
                                        </div>
                                        <div>
                                            <h2 className="h4 fw-bold mb-1">Generated Copy</h2>
                                            <p className="text-muted mb-0 small">Based on {formData.framework} framework</p>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-light rounded-pill p-2" onClick={copyToClipboard} title="Copy All">
                                            <FaCopy />
                                        </button>
                                        <button className="btn btn-light rounded-pill p-2" onClick={downloadCopy} title="Download .txt">
                                            <FaDownload />
                                        </button>
                                        <button className="btn btn-light rounded-pill p-2" onClick={resetTool} title="Reset">
                                            <FaSyncAlt />
                                        </button>
                                    </div>
                                </div>

                                <div className="copy-result-area">
                                    <div className="result-container p-4 rounded-4 bg-white border">
                                        <FaQuoteLeft className="text-light mb-3" size={32} />
                                        <div className="copy-text">
                                            {result.split('\n').map((line, i) => (
                                                <p key={i} className={line.match(/^[A-Z\s]+:$/) ? "fw-bold text-primary mt-4 mb-2" : "mb-2"}>
                                                    {line}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                )}
            </div>

            {/* Framework Info Section */}
            {!loading && !result && (
                <div className="mt-5">
                    <h5 className="h6 fw-bold text-dark text-center mb-4">Understand the Frameworks</h5>
                    <Accordion className="premium-accordion border-0 shadow-sm rounded-4 overflow-hidden">
                        <Accordion.Item eventKey="0" className="border-0 border-bottom">
                            <Accordion.Header>AIDA - The Classic Marketing Funnel</Accordion.Header>
                            <Accordion.Body className="small text-muted">
                                <strong>Attention:</strong> Grab the reader's eye. <strong>Interest:</strong> Build interest with facts. <strong>Desire:</strong> Make them want it. <strong>Action:</strong> Tell them what to do.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1" className="border-0 border-bottom">
                            <Accordion.Header>PAS - The Problem Solver</Accordion.Header>
                            <Accordion.Body className="small text-muted">
                                <strong>Problem:</strong> Identify the pain. <strong>Agitation:</strong> Make the pain feel real. <strong>Solution:</strong> Present your product as the cure.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2" className="border-0">
                            <Accordion.Header>BAB - The Transformation Story</Accordion.Header>
                            <Accordion.Body className="small text-muted">
                                <strong>Before:</strong> The current world. <strong>After:</strong> The world after your product. <strong>Bridge:</strong> How to get there.
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            )}
        </div>
    );
};

export default SalesCopyGenerator;
