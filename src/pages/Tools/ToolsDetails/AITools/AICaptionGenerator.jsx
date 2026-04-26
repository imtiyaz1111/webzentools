import React, { useState } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { 
    FaInstagram, FaTiktok, FaLinkedin, FaTwitter, FaFacebook, 
    FaMagic, FaCopy, FaHashtag, FaSmile, FaRegPaperPlane, FaRedo 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './AICaptionGenerator.css';
import aiService from '../../../../services/aiService.js';

const AICaptionGenerator = () => {
    const [description, setDescription] = useState('');
    const [platform, setPlatform] = useState('Instagram');
    const [tone, setTone] = useState('Professional');
    const [includeEmojis, setIncludeEmojis] = useState(true);
    const [hashtagsCount, setHashtagsCount] = useState(5);
    const [loading, setLoading] = useState(false);
    const [captions, setCaptions] = useState([]);

    const platforms = [
        { name: 'Instagram', icon: <FaInstagram />, class: 'instagram' },
        { name: 'TikTok', icon: <FaTiktok />, class: 'tiktok' },
        { name: 'LinkedIn', icon: <FaLinkedin />, class: 'linkedin' },
        { name: 'Twitter', icon: <FaTwitter />, class: 'twitter' },
        { name: 'Facebook', icon: <FaFacebook />, class: 'facebook' }
    ];

    const tones = ['Funny', 'Inspirational', 'Professional', 'Minimalist', 'Savage', 'Informative', 'Friendly'];

    const generateCaptions = async () => {
        if (!description.trim()) {
            toast.error('Please describe your post first!');
            return;
        }

        setLoading(true);
        try {
                        const prompt = `Generate 4 distinct social media captions for ${platform} based on this description: "${description}".
            Tone: ${tone}
            Include Emojis: ${includeEmojis ? 'Yes' : 'No'}
            Hashtag Count: ${hashtagsCount}
            
            Format the response as a JSON array of strings. Each string is one caption. 
            Make them engaging and optimized for ${platform}. 
            Do not include any other text except the JSON array.`;

            const results = await aiService.generateContent(prompt, 'json');
            
            setCaptions(results);
            toast.success('Captions generated!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to generate: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyCaption = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Caption copied!');
    };

    return (
        <div className="caption-generator-container py-4">
            <div className="main-input-card fade-in">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary">
                        <FaRegPaperPlane size={24} />
                    </div>
                    <div>
                        <h2 className="h4 fw-bold mb-1">Viral Caption Generator</h2>
                        <p className="text-muted mb-0 small">Create engaging captions that stop the scroll.</p>
                    </div>
                </div>

                <div className="platform-tabs">
                    {platforms.map(p => (
                        <div 
                            key={p.name}
                            className={`platform-tab ${platform === p.name ? `active ${p.class}` : ''}`}
                            onClick={() => setPlatform(p.name)}
                        >
                            {p.icon} {p.name}
                        </div>
                    ))}
                </div>

                <Form.Group className="mb-4">
                    <Form.Label className="fw-bold text-dark small text-uppercase">What is your post about?</Form.Label>
                    <Form.Control 
                        as="textarea"
                        rows={3}
                        placeholder="e.g. A sunset photo at the beach with my dog..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="premium-input border-0 bg-light p-3 rounded-4"
                    />
                </Form.Group>

                <div className="row align-items-end">
                    <div className="col-md-8">
                        <Form.Label className="fw-bold text-dark small text-uppercase">Select Tone</Form.Label>
                        <div className="tone-selector">
                            {tones.map(t => (
                                <div 
                                    key={t}
                                    className={`tone-chip ${tone === t ? 'active' : ''}`}
                                    onClick={() => setTone(t)}
                                >
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="d-flex gap-2 mb-3">
                            <div className="emoji-toggle flex-grow-1">
                                <FaSmile className={includeEmojis ? 'text-warning' : 'text-muted'} />
                                <Form.Check 
                                    type="switch"
                                    label="Emojis"
                                    checked={includeEmojis}
                                    onChange={(e) => setIncludeEmojis(e.target.checked)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-6">
                        <Form.Label className="fw-bold text-dark small text-uppercase d-flex align-items-center gap-2">
                            <FaHashtag /> Hashtags Count: {hashtagsCount}
                        </Form.Label>
                        <Form.Range 
                            min={0}
                            max={30}
                            value={hashtagsCount}
                            onChange={(e) => setHashtagsCount(e.target.value)}
                        />
                    </div>
                </div>

                <Button 
                    className="btn-generate-main d-flex align-items-center justify-content-center gap-2"
                    onClick={generateCaptions}
                    disabled={loading}
                >
                    {loading ? <Spinner animation="border" size="sm" /> : <FaMagic />}
                    {loading ? 'AI is Drafting...' : 'Generate 4 Viral Captions'}
                </Button>
            </div>

            {captions.length > 0 && (
                <div className="captions-results fade-in">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3 className="h5 fw-bold mb-0">Generated Variations:</h3>
                        <Button variant="link" className="text-primary text-decoration-none p-0" onClick={generateCaptions}>
                            <FaRedo className="me-1" /> Regenerate
                        </Button>
                    </div>
                    <div className="row">
                        {captions.map((caption, idx) => (
                            <div key={idx} className="col-12">
                                <div className="caption-card">
                                    <div className="caption-text">{caption}</div>
                                    <div className="caption-footer">
                                        <div className="text-muted small">Option {idx + 1}</div>
                                        <button className="btn-copy-caption" onClick={() => copyCaption(caption)}>
                                            <FaCopy /> Copy Caption
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!loading && captions.length === 0 && (
                <div className="text-center py-5 opacity-50">
                    <FaRegPaperPlane size={48} className="mb-3 text-primary" />
                    <p className="mb-0">Your high-engagement captions will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default AICaptionGenerator;
