import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { 
    FaCode, FaLightbulb, FaBrain, FaTerminal, FaClock, 
    FaDatabase, FaCopy, FaSyncAlt, FaLayerGroup, FaChevronRight 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './AICodeExplainer.css';

const AICodeExplainer = () => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('JavaScript');
    const [level, setLevel] = useState('Detailed');
    const [loading, setLoading] = useState(false);
    const [explanation, setExplanation] = useState(null);

    const languages = [
        'JavaScript', 'Python', 'Java', 'C++', 'PHP', 
        'HTML/CSS', 'SQL', 'Ruby', 'Swift', 'Go'
    ];

    const levels = [
        { name: 'Beginner', desc: 'Simple analogy and plain English.' },
        { name: 'Detailed', desc: 'Break down logic and flow.' },
        { name: 'Line-by-Line', desc: 'Explain every single line of code.' }
    ];

    const explainCode = async () => {
        if (!code.trim()) {
            toast.error('Please paste some code first!');
            return;
        }

        setLoading(true);
        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            const prompt = `Explain this ${language} code in a ${level} level.
            Code:
            ${code}
            
            Provide the response in the following JSON format:
            {
                "summary": "Brief overall summary",
                "howItWorks": "Detailed explanation of the logic",
                "keyConcepts": ["Concept 1", "Concept 2"],
                "timeComplexity": "e.g. O(n)",
                "spaceComplexity": "e.g. O(1)"
            }
            Do not include any other text except the JSON object.`;

            const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                contents: [{ parts: [{ text: prompt }] }]
            });

            const data = response.data;
            if (data.error) throw new Error(data.error.message);
            
            const rawText = data.candidates[0].content.parts[0].text;
            const jsonStr = rawText.replace(/```json|```/g, '').trim();
            const result = JSON.parse(jsonStr);
            
            setExplanation(result);
            toast.success('Code explained!');
        } catch (err) {
            console.error(err);
            toast.error('Explanation failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyExplanation = () => {
        if (!explanation) return;
        const text = `Summary: ${explanation.summary}\n\nHow it works: ${explanation.howItWorks}\n\nComplexity: Time: ${explanation.timeComplexity}, Space: ${explanation.spaceComplexity}`;
        navigator.clipboard.writeText(text);
        toast.success('Explanation copied!');
    };

    return (
        <div className="code-explainer-container py-4">
            <div className="ide-card fade-in">
                <div className="ide-header">
                    <div className="ide-dots">
                        <div className="ide-dot dot-red"></div>
                        <div className="ide-dot dot-yellow"></div>
                        <div className="ide-dot dot-green"></div>
                    </div>
                    <div className="ide-tab">
                        <FaTerminal /> main.{language.toLowerCase().split('/')[0]}
                    </div>
                    <div className="language-pill-group">
                        <Form.Select 
                            size="sm" 
                            className="bg-dark text-light border-secondary"
                            style={{ fontSize: '0.7rem', width: 'auto' }}
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            {languages.map(l => <option key={l} value={l}>{l}</option>)}
                        </Form.Select>
                    </div>
                </div>

                <div className="code-editor-area">
                    <textarea 
                        className="code-textarea"
                        placeholder="// Paste your code here to get a clear explanation..."
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        spellCheck={false}
                    />
                </div>

                <div className="p-3 bg-dark bg-opacity-50 border-top border-secondary d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-2">
                        {levels.map(l => (
                            <Button 
                                key={l.name}
                                variant={level === l.name ? 'primary' : 'outline-secondary'}
                                size="sm"
                                className="px-3"
                                style={{ fontSize: '0.75rem' }}
                                onClick={() => setLevel(l.name)}
                                title={l.desc}
                            >
                                {l.name}
                            </Button>
                        ))}
                    </div>
                    <Button 
                        className="btn-explain-main px-4 py-2" 
                        onClick={explainCode}
                        disabled={loading}
                    >
                        {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <FaBrain className="me-2" />}
                        {loading ? 'Analyzing...' : 'Explain Code'}
                    </Button>
                </div>
            </div>

            {explanation && (
                <div className="explanation-panel fade-in-up">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <h2 className="h4 fw-bold mb-0 d-flex align-items-center gap-3">
                            <FaLightbulb className="text-warning" /> Explanation Results
                        </h2>
                        <div className="d-flex gap-2">
                            <button className="btn btn-light rounded-pill shadow-sm" onClick={copyExplanation}>
                                <FaCopy />
                            </button>
                            <button className="btn btn-light rounded-pill shadow-sm" onClick={() => setExplanation(null)}>
                                <FaSyncAlt />
                            </button>
                        </div>
                    </div>

                    <div className="explanation-section">
                        <div className="explanation-title"><FaTerminal className="text-primary" /> Summary</div>
                        <div className="explanation-content">{explanation.summary}</div>
                    </div>

                    <div className="explanation-section">
                        <div className="explanation-title"><FaBrain className="text-purple-500" /> How it works</div>
                        <div className="explanation-content">{explanation.howItWorks}</div>
                    </div>

                    <div className="row g-4 mb-4">
                        <div className="col-md-6">
                            <div className="explanation-title small text-uppercase text-muted"><FaClock /> Time Complexity</div>
                            <div className="complexity-badge time">{explanation.timeComplexity}</div>
                        </div>
                        <div className="col-md-6">
                            <div className="explanation-title small text-uppercase text-muted"><FaDatabase /> Space Complexity</div>
                            <div className="complexity-badge space">{explanation.spaceComplexity}</div>
                        </div>
                    </div>

                    <div className="explanation-section mb-0">
                        <div className="explanation-title"><FaLayerGroup className="text-info" /> Key Concepts</div>
                        <div className="d-flex flex-wrap gap-2">
                            {explanation.keyConcepts.map((c, i) => (
                                <span key={i} className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-normal">
                                    <FaChevronRight className="me-1 text-primary small" /> {c}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {!explanation && !loading && (
                <div className="mt-5 text-center opacity-50">
                    <FaCode size={48} className="mb-3 text-primary" />
                    <p>Paste a snippet above to start the explanation engine.</p>
                </div>
            )}
        </div>
    );
};

export default AICodeExplainer;
