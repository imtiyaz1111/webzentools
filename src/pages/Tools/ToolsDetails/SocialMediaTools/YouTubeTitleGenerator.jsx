import React, { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { 
    FaYoutube, FaMagic, FaCopy, FaRedo, 
    FaBullseye, FaLightbulb, FaPlayCircle 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import aiService from '../../../../services/aiService.js';

const YouTubeTitleGenerator = () => {
    const [topic, setTopic] = useState('');
    const [style, setStyle] = useState('Clickbaity');
    const [audience, setAudience] = useState('General');
    const [loading, setLoading] = useState(false);
    const [titles, setTitles] = useState([]);

    const styles = ['Clickbaity', 'Educational', 'How-to', 'Storytelling', 'Listicle', 'Question-based', 'Urgent'];
    const audiences = ['General', 'Tech Enthusiasts', 'Gamers', 'Entrepreneurs', 'Students', 'Parents', 'Beginners'];

    const generateTitles = async () => {
        if (!topic.trim()) {
            toast.error('Please enter a video topic or description!');
            return;
        }

        setLoading(true);
        try {
                        const prompt = `Generate 10 catchy, high-CTR YouTube title variations based on this topic/description: "${topic}".
            Target Audience: ${audience}
            Title Style: ${style}
            
            Each title should be:
            1. Under 70 characters (to avoid truncation).
            2. Optimized for high click-through rates.
            3. Use ${style} psychological triggers.
            
            Format the response as a JSON array of strings. Each string is one title.
            Do not include any other text except the JSON array.`;

            const results = await aiService.generateContent(prompt, 'json');
            
            setTitles(results);
            toast.success('Viral titles generated!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to generate titles. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyTitle = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Title copied!');
    };

    return (
        <div className="yt-title-generator-container py-4">
            <style>{`
                .yt-title-generator-container {
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
                    padding: 1rem !important;
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
                .results-title {
                    color: #2d3748;
                    font-weight: 800;
                    margin-bottom: 1.5rem;
                }
                .title-card {
                    background: #fff;
                    border: 1px solid #edf2f7;
                    border-radius: 16px;
                    padding: 1.2rem;
                    margin-bottom: 1rem;
                    transition: all 0.3s;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 15px;
                }
                .title-card:hover {
                    border-color: #ff0000;
                    background: #fffaf0;
                    transform: scale(1.01);
                }
                .title-text {
                    color: #1a202c;
                    font-size: 1.05rem;
                    font-weight: 600;
                    line-height: 1.4;
                }
                .btn-copy-title {
                    background: #f7fafc;
                    color: #4a5568;
                    border: 1px solid #edf2f7;
                    padding: 8px;
                    border-radius: 10px;
                    transition: 0.2s;
                    flex-shrink: 0;
                }
                .btn-copy-title:hover {
                    background: #ff0000;
                    color: #fff;
                    border-color: #ff0000;
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
                        <h2 className="h4 fw-bold mb-1" style={{ color: '#1a202c' }}>YouTube Title Generator</h2>
                        <p className="text-muted mb-0 small">Skyrocket your CTR with AI-powered viral titles.</p>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <label className="premium-label">
                            <FaBullseye size={14} /> Target Audience
                        </label>
                        <Form.Select 
                            value={audience}
                            onChange={(e) => setAudience(e.target.value)}
                            className="premium-input"
                        >
                            {audiences.map(a => <option key={a} value={a}>{a}</option>)}
                        </Form.Select>
                    </div>
                    <div className="col-md-6">
                        <label className="premium-label">
                            <FaLightbulb size={14} /> Title Style
                        </label>
                        <Form.Select 
                            value={style}
                            onChange={(e) => setStyle(e.target.value)}
                            className="premium-input"
                        >
                            {styles.map(s => <option key={s} value={s}>{s}</option>)}
                        </Form.Select>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="premium-label">What is your video about?</label>
                    <Form.Control 
                        as="textarea"
                        rows={3}
                        placeholder="e.g. Building a simple React app from scratch in 10 minutes..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="premium-input"
                    />
                </div>

                <Button 
                    className="btn-generate-main"
                    onClick={generateTitles}
                    disabled={loading}
                >
                    {loading ? <Spinner animation="border" size="sm" /> : <FaMagic />}
                    {loading ? 'Analyzing Content...' : 'Generate 10 Viral Titles'}
                </Button>
            </div>

            {titles.length > 0 && (
                <div className="fade-in">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="h5 fw-bold mb-0 results-title">Generated Variations:</h3>
                        <Button variant="link" className="p-0 fw-bold text-decoration-none" style={{ color: '#ff0000' }} onClick={generateTitles}>
                            <FaRedo className="me-1" /> Regenerate
                        </Button>
                    </div>
                    <div className="titles-list">
                        {titles.map((title, idx) => (
                            <div key={idx} className="title-card">
                                <div className="d-flex align-items-center gap-3">
                                    <span className="text-muted small fw-bold">{idx + 1}.</span>
                                    <div className="title-text">{title}</div>
                                </div>
                                <button className="btn-copy-title" onClick={() => copyTitle(title)} title="Copy Title">
                                    <FaCopy />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!loading && titles.length === 0 && (
                <div className="text-center py-5" style={{ opacity: 0.3 }}>
                    <FaPlayCircle size={60} className="mb-3" style={{ color: '#ff0000' }} />
                    <p className="fw-bold" style={{ color: '#2d3748' }}>Your viral YouTube titles will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default YouTubeTitleGenerator;
