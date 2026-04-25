import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Spinner } from 'react-bootstrap';
import { 
    FaInstagram, FaMagic, FaCopy, FaRedo, 
    FaVideo, FaSmile, FaHashtag, FaMobileAlt 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const ReelCaptionGenerator = () => {
    const [topic, setTopic] = useState('');
    const [platform, setPlatform] = useState('Instagram Reels');
    const [tone, setTone] = useState('Aesthetic');
    const [includeHashtags, setIncludeHashtags] = useState(true);
    const [loading, setLoading] = useState(false);
    const [captions, setCaptions] = useState([]);

    const platforms = ['Instagram Reels', 'TikTok', 'YouTube Shorts'];
    const tones = ['Aesthetic', 'Funny', 'Inspirational', 'Educational', 'Minimalist', 'Salesy', 'Hype'];

    const generateCaptions = async () => {
        if (!topic.trim()) {
            toast.error('Please describe your video first!');
            return;
        }

        setLoading(true);
        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            const prompt = `Generate 5 viral, engaging captions for a ${platform} video about: "${topic}".
            Tone: ${tone}
            Include Hashtags: ${includeHashtags ? 'Yes' : 'No'}
            
            Each caption should:
            1. Start with a powerful hook.
            2. Be optimized for ${platform} engagement.
            3. Reflect the ${tone} style.
            4. Include line breaks for readability.
            
            Format the response as a JSON array of strings. Each string is one caption.
            Do not include any other text except the JSON array.`;

            const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                contents: [{ parts: [{ text: prompt }] }]
            });

            const data = response.data;
            if (data.error) throw new Error(data.error.message);
            
            const rawText = data.candidates[0].content.parts[0].text;
            const jsonStr = rawText.replace(/```json|```/g, '').trim();
            const results = JSON.parse(jsonStr);
            
            setCaptions(results);
            toast.success('Viral captions ready!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to generate captions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyCaption = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Caption copied!');
    };

    return (
        <div className="reel-generator-container py-4">
            <style>{`
                .reel-generator-container {
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
                    border-color: #e1306c !important;
                    background: #fff !important;
                    box-shadow: 0 0 0 4px rgba(225, 48, 108, 0.1) !important;
                }
                .btn-generate-main {
                    background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
                    border: none;
                    padding: 1rem;
                    font-weight: 700;
                    font-size: 1.1rem;
                    border-radius: 12px;
                    width: 100%;
                    color: white;
                    box-shadow: 0 4px 15px rgba(225, 48, 108, 0.3);
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .btn-generate-main:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(225, 48, 108, 0.4);
                }
                .caption-card {
                    background: #fff;
                    border: 1px solid #edf2f7;
                    border-radius: 16px;
                    padding: 1.5rem;
                    margin-bottom: 1rem;
                    transition: all 0.3s;
                }
                .caption-card:hover {
                    border-color: #e1306c;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
                }
                .caption-text {
                    color: #1a202c;
                    font-size: 1rem;
                    line-height: 1.6;
                    margin-bottom: 1.2rem;
                    white-space: pre-wrap;
                }
                .caption-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid #f7fafc;
                    padding-top: 1rem;
                }
                .btn-copy-cap {
                    background: #fdf2f8;
                    color: #be185d;
                    border: 1px solid #fce7f3;
                    padding: 6px 16px;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 0.85rem;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: 0.2s;
                }
                .btn-copy-cap:hover {
                    background: #be185d;
                    color: #fff;
                }
                .platform-chip {
                    padding: 8px 16px;
                    border-radius: 50px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: 0.2s;
                    border: 1px solid #edf2f7;
                    background: #f8fafc;
                    color: #64748b;
                }
                .platform-chip.active {
                    background: #1a202c;
                    color: white;
                    border-color: #1a202c;
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
                    <div className="p-3 rounded-4" style={{ background: '#fdf2f8' }}>
                        <FaVideo size={28} style={{ color: '#e1306c' }} />
                    </div>
                    <div>
                        <h2 className="h4 fw-bold mb-1" style={{ color: '#1a202c' }}>Reel Caption Generator</h2>
                        <p className="text-muted mb-0 small">Hooks, captions, and hashtags that drive views.</p>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="premium-label">Select Platform</label>
                    <div className="d-flex flex-wrap gap-2">
                        {platforms.map(p => (
                            <div 
                                key={p} 
                                className={`platform-chip ${platform === p ? 'active' : ''}`}
                                onClick={() => setPlatform(p)}
                            >
                                {p === 'Instagram Reels' && <FaInstagram className="me-2" />}
                                {p}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <label className="premium-label">Tone of Caption</label>
                        <Form.Select 
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            className="premium-input"
                        >
                            {tones.map(t => <option key={t} value={t}>{t}</option>)}
                        </Form.Select>
                    </div>
                    <div className="col-md-6 d-flex align-items-end pb-2">
                        <Form.Check 
                            type="switch"
                            label="Include Hashtags"
                            checked={includeHashtags}
                            onChange={(e) => setIncludeHashtags(e.target.checked)}
                            className="fw-bold text-muted"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="premium-label">Describe your video (Topic, Action, Vibes)</label>
                    <Form.Control 
                        as="textarea"
                        rows={3}
                        placeholder="e.g. A day in the life of a software engineer in Bangalore..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="premium-input"
                    />
                </div>

                <Button 
                    className="btn-generate-main"
                    onClick={generateCaptions}
                    disabled={loading}
                >
                    {loading ? <Spinner animation="border" size="sm" /> : <FaMagic />}
                    {loading ? 'AI is Writing...' : 'Generate 5 Viral Captions'}
                </Button>
            </div>

            {captions.length > 0 && (
                <div className="fade-in">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="h5 fw-bold mb-0" style={{ color: '#2d3748' }}>Generated Variations:</h3>
                        <Button variant="link" className="p-0 fw-bold text-decoration-none" style={{ color: '#e1306c' }} onClick={generateCaptions}>
                            <FaRedo className="me-1" />
                        </Button>
                    </div>
                    <div className="captions-list">
                        {captions.map((cap, idx) => (
                            <div key={idx} className="caption-card">
                                <div className="caption-text">{cap}</div>
                                <div className="caption-footer">
                                    <div className="text-muted small fw-bold">Option {idx + 1}</div>
                                    <button className="btn-copy-cap" onClick={() => copyCaption(cap)}>
                                        <FaCopy /> Copy Caption
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!loading && captions.length === 0 && (
                <div className="text-center py-5" style={{ opacity: 0.3 }}>
                    <FaMobileAlt size={60} className="mb-3" style={{ color: '#bc1888' }} />
                    <p className="fw-bold" style={{ color: '#2d3748' }}>Your viral captions will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default ReelCaptionGenerator;
