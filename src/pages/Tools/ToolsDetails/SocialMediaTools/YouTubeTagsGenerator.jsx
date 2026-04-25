import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Spinner } from 'react-bootstrap';
import { 
    FaYoutube, FaMagic, FaCopy, FaRedo, 
    FaSearch, FaCheckCircle, FaTrashAlt 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const YouTubeTagsGenerator = () => {
    const [topic, setTopic] = useState('');
    const [tagCount, setTagCount] = useState(25);
    const [language, setLanguage] = useState('English');
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState([]);

    const languages = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Arabic', 'Portuguese'];

    const generateTags = async () => {
        if (!topic.trim()) {
            toast.error('Please enter a topic or keyword!');
            return;
        }

        setLoading(true);
        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            const prompt = `Generate ${tagCount} highly relevant, SEO-optimized YouTube tags for a video about: "${topic}".
            Language: ${language}
            
            The tags should:
            1. Include a mix of broad and specific keywords.
            2. Be relevant to YouTube search trends.
            3. Help improve video discoverability.
            
            Format the response as a JSON array of strings. Each string is one tag.
            Do not include any other text except the JSON array.`;

            const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                contents: [{ parts: [{ text: prompt }] }]
            });

            const data = response.data;
            if (data.error) throw new Error(data.error.message);
            
            const rawText = data.candidates[0].content.parts[0].text;
            const jsonStr = rawText.replace(/```json|```/g, '').trim();
            const results = JSON.parse(jsonStr);
            
            setTags(results);
            toast.success('Optimized tags generated!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to generate tags. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyAllTags = () => {
        const tagsString = tags.join(', ');
        navigator.clipboard.writeText(tagsString);
        toast.success('All tags copied as comma-separated list!');
    };

    const copySingleTag = (tag) => {
        navigator.clipboard.writeText(tag);
        toast.success(`Tag "${tag}" copied!`);
    };

    const clearTags = () => {
        setTags([]);
        setTopic('');
    };

    return (
        <div className="yt-tags-generator-container py-4">
            <style>{`
                .yt-tags-generator-container {
                    max-width: 900px;
                    margin: 0 auto;
                }
                .main-input-card {
                    background: #ffffff;
                    border: 1px solid #e1e8ed;
                    border-radius: 24px;
                    padding: 2rem;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                    margin-bottom: 2rem;
                }
                .premium-label {
                    font-weight: 700;
                    color: #2c3e50;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    margin-bottom: 0.6rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .premium-input {
                    background: #f8fafc !important;
                    border: 2px solid #edf2f7 !important;
                    color: #1a202c !important;
                    padding: 0.8rem !important;
                    border-radius: 12px !important;
                    transition: all 0.3s ease;
                }
                .premium-input:focus {
                    border-color: #ff0000 !important;
                    background: #fff !important;
                    box-shadow: 0 0 0 4px rgba(255, 0, 0, 0.1) !important;
                }
                .btn-generate-main {
                    background: #ff0000;
                    border: none;
                    padding: 1rem;
                    font-weight: 700;
                    font-size: 1.1rem;
                    border-radius: 12px;
                    width: 100%;
                    color: white;
                    box-shadow: 0 4px 15px rgba(255, 0, 0, 0.3);
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .btn-generate-main:hover {
                    background: #cc0000;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(255, 0, 0, 0.4);
                    color: white;
                }
                .btn-generate-main:disabled {
                    background: #ffa1a1;
                    cursor: not-allowed;
                }
                .results-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .tags-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    background: #ffffff;
                    border: 1px solid #edf2f7;
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.02);
                }
                .tag-chip {
                    background: #f1f5f9;
                    color: #334155;
                    border: 1px solid #e2e8f0;
                    padding: 8px 16px;
                    border-radius: 50px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .tag-chip:hover {
                    background: #ff0000;
                    color: white;
                    border-color: #ff0000;
                    transform: scale(1.05);
                }
                .btn-copy-all {
                    background: #fdf2f8;
                    color: #be185d;
                    border: 1px solid #fce7f3;
                    padding: 8px 20px;
                    border-radius: 12px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: 0.2s;
                }
                .btn-copy-all:hover {
                    background: #be185d;
                    color: #fff;
                }
                .fade-in {
                    animation: fadeIn 0.4s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="main-input-card fade-in">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="p-3 rounded-4" style={{ background: '#fff5f5' }}>
                        <FaYoutube size={28} style={{ color: '#ff0000' }} />
                    </div>
                    <div>
                        <h2 className="h4 fw-bold mb-1" style={{ color: '#1a202c' }}>YouTube Tags Generator</h2>
                        <p className="text-muted mb-0 small">Generate SEO-optimized keywords to rank your videos.</p>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <label className="premium-label">Language</label>
                        <Form.Select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="premium-input"
                        >
                            {languages.map(l => <option key={l} value={l}>{l}</option>)}
                        </Form.Select>
                    </div>
                    <div className="col-md-6">
                        <label className="premium-label">Tag Count: {tagCount}</label>
                        <div className="px-2">
                            <Form.Range 
                                min={10}
                                max={50}
                                step={5}
                                value={tagCount}
                                onChange={(e) => setTagCount(e.target.value)}
                                className="mt-2"
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="premium-label">Video Topic or Main Keywords</label>
                    <Form.Control 
                        type="text"
                        placeholder="e.g. Best budget cameras for vlogging 2024..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="premium-input"
                    />
                </div>

                <div className="d-flex gap-3">
                    <Button 
                        className="btn-generate-main flex-grow-1"
                        onClick={generateTags}
                        disabled={loading}
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : <FaMagic />}
                        {loading ? 'Analyzing Keywords...' : 'Generate SEO Tags'}
                    </Button>
                    <Button 
                        variant="light"
                        className="p-3 rounded-4 border"
                        onClick={clearTags}
                        title="Clear All"
                    >
                        <FaTrashAlt color="#e53e3e" />
                    </Button>
                </div>
            </div>

            {tags.length > 0 && (
                <div className="fade-in">
                    <div className="results-header">
                        <div>
                            <h3 className="h5 fw-bold mb-0" style={{ color: '#2d3748' }}>Generated SEO Tags:</h3>
                            <p className="text-muted small mb-0">Click a tag to copy it, or use "Copy All".</p>
                        </div>
                        <div className="d-flex gap-2">
                            <Button variant="link" className="p-0 fw-bold text-decoration-none" style={{ color: '#ff0000' }} onClick={generateTags}>
                                <FaRedo className="me-1" />
                            </Button>
                            <button className="btn-copy-all" onClick={copyAllTags}>
                                <FaCopy /> Copy All
                            </button>
                        </div>
                    </div>
                    <div className="tags-container">
                        {tags.map((tag, idx) => (
                            <div key={idx} className="tag-chip" onClick={() => copySingleTag(tag)}>
                                {tag}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 rounded-4 bg-light border text-center">
                        <p className="text-muted small mb-0 d-flex align-items-center justify-content-center gap-2">
                            <FaCheckCircle className="text-success" /> These tags are optimized for YouTube SEO and search trends.
                        </p>
                    </div>
                </div>
            )}

            {!loading && tags.length === 0 && (
                <div className="text-center py-5" style={{ opacity: 0.3 }}>
                    <FaSearch size={60} className="mb-3" style={{ color: '#ff0000' }} />
                    <p className="fw-bold" style={{ color: '#2d3748' }}>Your SEO-optimized tags will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default YouTubeTagsGenerator;
