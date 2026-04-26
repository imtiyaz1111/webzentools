import React, { useState } from 'react';
import aiService from '../../../../services/aiService';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { 
    FaCheckCircle, FaPenNib, FaListUl, FaChevronLeft, 
    FaSyncAlt, FaCopy, FaDownload, FaRegLightbulb, FaMagic 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const AIBlogWriter = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Step 1: Input Data
    const [formData, setFormData] = useState({
        topic: '',
        keywords: '',
        audience: '',
        tone: 'Informative',
        length: 'Medium'
    });

    // Step 2: Generated Outline
    const [outline, setOutline] = useState([]);
    
    // Step 3: Final Content
    const [finalContent, setFinalContent] = useState('');

    const tones = [
        'Informative', 'Professional', 'Storytelling', 
        'Conversational', 'Persuasive', 'Humorous'
    ];

    const lengths = [
        { label: 'Short (~300 words)', value: 'Short' },
        { label: 'Medium (~700 words)', value: 'Medium' },
        { label: 'Long (~1500 words)', value: 'Long' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generateOutline = async () => {
        if (!formData.topic) {
            toast.error('Please enter a blog topic.');
            return;
        }

        setLoading(true);
        setError('');
        
        const prompt = `Create a structured blog outline for the topic: "${formData.topic}". 
        Keywords: ${formData.keywords || 'None'}. 
        Target Audience: ${formData.audience || 'General'}. 
        Tone: ${formData.tone}.
        Format the output as a simple list of section headers, one per line. No extra text.`;

        try {
            const result = await aiService.generateContent(prompt, 'text');
            const sections = result.split('\n')
                .map(s => s.trim())
                .filter(s => s && !s.startsWith('*') && !s.match(/^\d\./))
                .slice(0, 10);
            
            setOutline(sections.length > 0 ? sections : result.split('\n').filter(s => s.trim()).slice(0, 8));
            setCurrentStep(2);
            toast.success('Outline generated!');
        } catch (err) {
            setError('Failed to generate outline: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const generateFullBlog = async () => {
        setLoading(true);
        setError('');

        const prompt = `Write a high-quality blog post about: "${formData.topic}".
        Outline:
        ${outline.join('\n')}
        
        Keywords to include: ${formData.keywords || 'None'}.
        Audience: ${formData.audience || 'General'}.
        Tone: ${formData.tone}.
        Length: ${formData.length}.
        
        Please format the output in clean HTML (using <h1>, <h2>, <p> tags). 
        Make it engaging, informative, and SEO-friendly.`;

        try {
            const result = await aiService.generateContent(prompt, 'text');
            setFinalContent(result);
            setCurrentStep(3);
            toast.success('Full blog generated!');
        } catch (err) {
            setError('Failed to generate content: ' + err.message);
        } finally {
            setLoading(false);
        }
    };


    const copyToClipboard = () => {
        const textOnly = finalContent.replace(/<[^>]*>/g, '');
        navigator.clipboard.writeText(textOnly);
        toast.success('Content copied to clipboard!');
    };

    const downloadBlog = () => {
        const textOnly = finalContent.replace(/<[^>]*>/g, '');
        const blob = new Blob([textOnly], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData.topic.replace(/\s+/g, '_')}_blog.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const resetTool = () => {
        setCurrentStep(1);
        setOutline([]);
        setFinalContent('');
        setFormData({
            topic: '',
            keywords: '',
            audience: '',
            tone: 'Informative',
            length: 'Medium'
        });
    };

    return (
        <div className="ai-blog-writer-container py-4">
            {/* Stepper */}
            <div className="ai-stepper">
                <div className={`step-item ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                    <div className="step-number">{currentStep > 1 ? <FaCheckCircle /> : '1'}</div>
                    <div className="step-label">Setup</div>
                </div>
                <div className={`step-item ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                    <div className="step-number">{currentStep > 2 ? <FaCheckCircle /> : '2'}</div>
                    <div className="step-label">Outline</div>
                </div>
                <div className={`step-item ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
                    <div className="step-number">{currentStep > 3 ? <FaCheckCircle /> : '3'}</div>
                    <div className="step-label">Content</div>
                </div>
            </div>

            {error && <Alert variant="danger" className="mb-4 rounded-4 border-0 shadow-sm">{error}</Alert>}

            {/* Step 1: Input Form */}
            {currentStep === 1 && (
                <div className="ai-writer-card fade-in">
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary">
                            <FaPenNib size={24} />
                        </div>
                        <div>
                            <h2 className="h4 fw-bold mb-1">Create Your Blog Idea</h2>
                            <p className="text-muted mb-0 small">Fill in the details to generate a premium blog post.</p>
                        </div>
                    </div>

                    <Form>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold text-dark small text-uppercase">Blog Topic or Title</Form.Label>
                            <Form.Control 
                                name="topic"
                                placeholder="e.g. The Future of AI in Web Development"
                                value={formData.topic}
                                onChange={handleInputChange}
                                className="premium-input"
                            />
                        </Form.Group>

                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <Form.Label className="fw-bold text-dark small text-uppercase">Keywords (Optional)</Form.Label>
                                <Form.Control 
                                    name="keywords"
                                    placeholder="e.g. React, NextJS, Automation"
                                    value={formData.keywords}
                                    onChange={handleInputChange}
                                    className="premium-input"
                                />
                            </div>
                            <div className="col-md-6 mb-4">
                                <Form.Label className="fw-bold text-dark small text-uppercase">Target Audience</Form.Label>
                                <Form.Control 
                                    name="audience"
                                    placeholder="e.g. Beginners, Tech Enthusiasts"
                                    value={formData.audience}
                                    onChange={handleInputChange}
                                    className="premium-input"
                                />
                            </div>
                        </div>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold text-dark small text-uppercase">Writing Tone</Form.Label>
                            <div className="tone-grid">
                                {tones.map(t => (
                                    <div 
                                        key={t}
                                        className={`tone-option ${formData.tone === t ? 'selected' : ''}`}
                                        onClick={() => setFormData(p => ({ ...p, tone: t }))}
                                    >
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-5">
                            <Form.Label className="fw-bold text-dark small text-uppercase">Post Length</Form.Label>
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
                        </Form.Group>

                        <Button 
                            className="btn-premium w-100 d-flex align-items-center justify-content-center gap-2"
                            onClick={generateOutline}
                            disabled={loading}
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : <FaMagic />}
                            {loading ? 'Generating Strategy...' : 'Generate Blog Outline'}
                        </Button>
                    </Form>
                </div>
            )}

            {/* Step 2: Outline Preview */}
            {currentStep === 2 && (
                <div className="ai-writer-card fade-in">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-3 rounded-4 bg-indigo-500 bg-opacity-10 text-indigo-600">
                                <FaListUl size={24} />
                            </div>
                            <div>
                                <h2 className="h4 fw-bold mb-1">Review Blog Outline</h2>
                                <p className="text-muted mb-0 small">This is the structure your blog will follow.</p>
                            </div>
                        </div>
                        <Button variant="link" className="text-decoration-none text-muted p-0" onClick={() => setCurrentStep(1)}>
                            <FaChevronLeft className="me-1" /> Edit Setup
                        </Button>
                    </div>

                    <div className="outline-list mb-5">
                        {outline.map((item, idx) => (
                            <div key={idx} className="outline-item">
                                <div className="outline-item-number">{idx + 1}</div>
                                <div className="fw-medium text-dark">{item}</div>
                            </div>
                        ))}
                    </div>

                    <div className="d-flex gap-3">
                        <Button 
                            variant="outline-secondary" 
                            className="rounded-4 px-4 py-3 fw-bold flex-grow-1"
                            onClick={generateOutline}
                            disabled={loading}
                        >
                            <FaSyncAlt className={`me-2 ${loading ? 'fa-spin' : ''}`} /> 
                            Regenerate
                        </Button>
                        <Button 
                            className="btn-premium px-5 py-3 flex-grow-2 w-100"
                            onClick={generateFullBlog}
                            disabled={loading}
                        >
                            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <FaMagic className="me-2" />}
                            {loading ? 'Writing Full Blog...' : 'Generate Full Content'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 3: Full Content */}
            {currentStep === 3 && (
                <div className="ai-writer-card fade-in">
                    <div className="blog-result-header">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-3 rounded-4 bg-success bg-opacity-10 text-success">
                                <FaPenNib size={24} />
                            </div>
                            <div>
                                <h2 className="h4 fw-bold mb-1">Final Blog Post</h2>
                                <p className="text-muted mb-0 small">Your SEO-optimized blog is ready.</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-light rounded-pill border-0 shadow-sm" onClick={copyToClipboard} title="Copy Text">
                                <FaCopy />
                            </button>
                            <button className="btn btn-light rounded-pill border-0 shadow-sm" onClick={downloadBlog} title="Download .txt">
                                <FaDownload />
                            </button>
                            <button className="btn btn-light rounded-pill border-0 shadow-sm" onClick={resetTool} title="Start Over">
                                <FaSyncAlt />
                            </button>
                        </div>
                    </div>

                    <div 
                        className="blog-content-wrapper"
                        dangerouslySetInnerHTML={{ __html: finalContent }}
                    />

                    <div className="mt-5 text-center">
                        <Button 
                            variant="outline-primary" 
                            className="rounded-pill px-5 py-2 fw-bold"
                            onClick={resetTool}
                        >
                            Write Another Blog
                        </Button>
                    </div>
                </div>
            )}

            {/* Footer Tips */}
            {currentStep === 1 && (
                <div className="mt-5 p-4 bg-light bg-opacity-50 rounded-4 border border-white">
                    <h5 className="h6 fw-bold text-dark d-flex align-items-center gap-2 mb-3">
                        <FaRegLightbulb className="text-warning" /> Pro Tips for Amazing Blogs
                    </h5>
                    <ul className="text-muted small mb-0 ps-3">
                        <li className="mb-2"><strong>Be Specific:</strong> Instead of "Travel", try "Budget-friendly 7-day itinerary for Tokyo".</li>
                        <li className="mb-2"><strong>Target Audience:</strong> Mentioning the audience helps the AI adjust the vocabulary and complexity.</li>
                        <li><strong>Keywords:</strong> Add 2-3 specific keywords you want to rank for to improve SEO performance.</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AIBlogWriter;
