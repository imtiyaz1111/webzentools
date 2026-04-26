import React, { useState } from 'react';
import { Form, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { 
    FaRocket, FaSearch, FaCopy, FaExternalLinkAlt, 
    FaLightbulb, FaCheck, FaRegStar, FaMicrochip, FaBriefcase, FaPaintBrush 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './AIBusinessNameGenerator.css';
import aiService from '../../../../services/aiService.js';

const AIBusinessNameGenerator = () => {
    const [keywords, setKeywords] = useState('');
    const [style, setStyle] = useState('Modern');
    const [loading, setLoading] = useState(false);
    const [names, setNames] = useState([]);

    const styles = [
        { name: 'Modern', icon: <FaMicrochip /> },
        { name: 'Corporate', icon: <FaBriefcase /> },
        { name: 'Quirky', icon: <FaPaintBrush /> },
        { name: 'Minimalist', icon: <FaLightbulb /> }
    ];

    const generateNames = async () => {
        if (!keywords.trim()) {
            toast.error('Please enter some keywords or industry.');
            return;
        }

        setLoading(true);
        try {
                        const prompt = `Generate 12 creative and brandable business names for: ${keywords}.
            Style preference: ${style}.
            
            Provide the response in the following JSON format:
            {
                "businessNames": [
                    { "name": "BrandName", "rationale": "Short explanation of why this name fits." }
                ]
            }
            Do not include any other text except the JSON object.`;

            const result = await aiService.generateContent(prompt, 'json');
            
            setNames(result.businessNames);
            toast.success('Generated 12 unique names!');
        } catch (err) {
            console.error(err);
            toast.error('Generation failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (name) => {
        navigator.clipboard.writeText(name);
        toast.success(`"${name}" copied!`);
    };

    return (
        <div className="name-generator-container py-4">
            <div className="generator-hero fade-in">
                <Badge bg="primary" className="mb-3 px-3 py-2 rounded-pill">
                    <FaRocket className="me-2" /> AI POWERED
                </Badge>
                <h1 className="h2 fw-bold mb-3">Business Name Generator</h1>
                <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                    Instantly generate thousands of high-quality business name ideas and check domain availability.
                </p>

                <div className="search-container">
                    <input 
                        className="search-input-premium"
                        placeholder="e.g. coffee shop, tech startup, organic skin care..."
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && generateNames()}
                    />
                    <button 
                        className="btn-generate-float"
                        onClick={generateNames}
                        disabled={loading}
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : 'Generate'}
                    </button>
                </div>

                <div className="style-chips">
                    {styles.map(s => (
                        <div 
                            key={s.name}
                            className={`style-chip ${style === s.name ? 'active' : ''}`}
                            onClick={() => setStyle(s.name)}
                        >
                            <span className="me-2">{s.icon}</span>
                            {s.name}
                        </div>
                    ))}
                </div>
            </div>

            {loading && (
                <div className="names-grid">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="loading-skeleton"></div>
                    ))}
                </div>
            )}

            {!loading && names.length > 0 && (
                <div className="names-grid fade-in">
                    {names.map((item, idx) => (
                        <div key={idx} className="name-card">
                            <span className="name-text">{item.name}</span>
                            <p className="name-rationale">{item.rationale}</p>
                            <div className="name-actions">
                                <a 
                                    href={`https://www.namecheap.com/domains/registration/results/?domain=${item.name.toLowerCase().replace(/\s+/g, '')}.com`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="domain-link"
                                >
                                    Check .com <FaExternalLinkAlt size={10} />
                                </a>
                                <button 
                                    className="copy-icon-btn" 
                                    onClick={() => copyToClipboard(item.name)}
                                    title="Copy Name"
                                >
                                    <FaCopy size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && names.length === 0 && (
                <div className="text-center mt-5 opacity-50">
                    <div className="mb-4">
                        <FaRegStar size={48} className="text-warning mb-2" />
                    </div>
                    <p>Enter your business idea above to see the magic.</p>
                </div>
            )}

            <div className="row mt-5 g-4">
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100 text-center">
                        <div className="text-primary mb-3"><FaSearch size={32} /></div>
                        <h5 className="fw-bold h6">Keyword Targeted</h5>
                        <p className="text-muted small mb-0">Our AI understands the nuances of your industry and generates names that resonate with your target audience.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100 text-center">
                        <div className="text-success mb-3"><FaCheck size={32} /></div>
                        <h5 className="fw-bold h6">Domain Ready</h5>
                        <p className="text-muted small mb-0">We suggest names that have a higher probability of being available as .com domains.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100 text-center">
                        <div className="text-warning mb-3"><FaLightbulb size={32} /></div>
                        <h5 className="fw-bold h6">Brand Rationale</h5>
                        <p className="text-muted small mb-0">Every name comes with a brand explanation, helping you understand the psychology behind the choice.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIBusinessNameGenerator;
