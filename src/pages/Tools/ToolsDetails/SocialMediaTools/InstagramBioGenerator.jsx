import React, { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { 
    FaInstagram, FaUserCircle, FaRocket, FaSmile, 
    FaHashtag, FaMagic, FaRedo, FaCopy 
} from 'react-icons/fa';
import aiService from '../../../../services/aiService';

const InstagramBioGenerator = () => {
    const [keywords, setKeywords] = useState('');
    const [style, setStyle] = useState('Creative');
    const [niche, setNiche] = useState('Personal');
    const [includeEmojis, setIncludeEmojis] = useState(true);
    const [includeCTA, setIncludeCTA] = useState(true);
    const [loading, setLoading] = useState(false);
    const [bios, setBios] = useState([]);

    const styles = ['Creative', 'Professional', 'Minimalist', 'Funny', 'Aesthetic', 'Witty', 'Bold'];
    const niches = ['Personal', 'Business', 'Creator', 'Lifestyle', 'Tech', 'Fitness', 'Food', 'Travel'];

    const generateBios = async () => {
        if (!keywords.trim()) {
            toast.error('Please enter some keywords or describe yourself!');
            return;
        }

        setLoading(true);
        try {
            const prompt = `Generate 5 distinct Instagram bio variations based on these keywords/description: "${keywords}".
            Niche/Category: ${niche}
            Style: ${style}
            Include Emojis: ${includeEmojis ? 'Yes' : 'No'}
            Include Call-to-Action: ${includeCTA ? 'Yes' : 'No'}
            
            Each bio should be:
            1. Within the 150-character Instagram limit.
            2. Formatted with line breaks if necessary.
            3. Engaging and optimized for the ${style} style.
            
            Format the response as a JSON array of strings. Each string is one bio.
            Do not include any other text except the JSON array.`;

            const results = await aiService.generateContent(prompt, 'json');
            
            setBios(results);
            toast.success('Stunning bios generated!');
        } catch {
            toast.error('Failed to generate bios.');
        } finally {
            setLoading(false);
        }
    };


    const copyBio = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Bio copied to clipboard!');
    };

    return (
        <div className="bio-generator-container py-4">
            <style>{`
                .bio-generator-container {
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
                    border-color: #e1306c !important;
                    background: #fff !important;
                    box-shadow: 0 0 0 4px rgba(225, 48, 108, 0.1) !important;
                }
                .toggle-container {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 1.5rem;
                }
                .custom-toggle {
                    background: #f8fafc;
                    padding: 12px 20px;
                    border-radius: 12px;
                    border: 1px solid #edf2f7;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .custom-toggle:hover {
                    border-color: #cbd5e0;
                }
                .custom-toggle span {
                    color: #4a5568;
                    font-weight: 600;
                    font-size: 0.9rem;
                }
                .btn-generate-main {
                    background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
                    border: none;
                    padding: 1rem;
                    font-weight: 700;
                    font-size: 1.1rem;
                    border-radius: 12px;
                    width: 100%;
                    box-shadow: 0 4px 15px rgba(225, 48, 108, 0.3);
                    transition: all 0.3s;
                }
                .btn-generate-main:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(225, 48, 108, 0.4);
                }
                .bio-results-title {
                    color: #2d3748;
                    font-weight: 800;
                    margin-bottom: 1.5rem;
                }
                .bio-card {
                    background: #fff;
                    border: 1px solid #edf2f7;
                    border-radius: 16px;
                    padding: 1.5rem;
                    margin-bottom: 1rem;
                    transition: all 0.3s;
                    position: relative;
                    overflow: hidden;
                }
                .bio-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    background: linear-gradient(to bottom, #f09433, #bc1888);
                }
                .bio-card:hover {
                    transform: translateX(5px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
                    border-color: #e1306c;
                }
                .bio-text {
                    color: #1a202c;
                    font-size: 1.05rem;
                    line-height: 1.6;
                    margin-bottom: 1.2rem;
                    white-space: pre-wrap;
                }
                .bio-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid #f7fafc;
                    padding-top: 1rem;
                }
                .char-count {
                    color: #718096;
                    font-size: 0.8rem;
                    font-weight: 600;
                }
                .btn-copy-bio {
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
                .btn-copy-bio:hover {
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
                    <div className="p-3 rounded-4" style={{ background: '#fdf2f8' }}>
                        <FaInstagram size={28} style={{ color: '#e1306c' }} />
                    </div>
                    <div>
                        <h2 className="h4 fw-bold mb-1" style={{ color: '#1a202c' }}>Instagram Bio Generator</h2>
                        <p className="text-muted mb-0 small">Create engaging bios that stop the scroll.</p>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <label className="premium-label">
                            <FaUserCircle size={14} /> Your Niche
                        </label>
                        <Form.Select 
                            value={niche}
                            onChange={(e) => setNiche(e.target.value)}
                            className="premium-input"
                        >
                            {niches.map(n => <option key={n} value={n}>{n}</option>)}
                        </Form.Select>
                    </div>
                    <div className="col-md-6">
                        <label className="premium-label">
                            <FaRocket size={14} /> Bio Style
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
                    <label className="premium-label">Describe yourself or your brand</label>
                    <Form.Control 
                        as="textarea"
                        rows={3}
                        placeholder="e.g. Travel photographer based in Bali, sharing tips for nomads..."
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        className="premium-input"
                    />
                </div>

                <div className="toggle-container">
                    <div className="custom-toggle" onClick={() => setIncludeEmojis(!includeEmojis)}>
                        <FaSmile size={18} color={includeEmojis ? '#f09433' : '#a0aec0'} />
                        <span>Emojis</span>
                        <Form.Check 
                            type="switch"
                            checked={includeEmojis}
                            onChange={() => {}}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="custom-toggle" onClick={() => setIncludeCTA(!includeCTA)}>
                        <FaHashtag size={16} color={includeCTA ? '#3182ce' : '#a0aec0'} />
                        <span>Call to Action</span>
                        <Form.Check 
                            type="switch"
                            checked={includeCTA}
                            onChange={() => {}}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>

                <Button 
                    className="btn-generate-main d-flex align-items-center justify-content-center gap-2 text-white"
                    onClick={generateBios}
                    disabled={loading}
                >
                    {loading ? <Spinner animation="border" size="sm" /> : <FaMagic />}
                    {loading ? 'AI is Crafting Your Bio...' : 'Generate 5 Premium Bios'}
                </Button>
            </div>

            {bios.length > 0 && (
                <div className="bio-results fade-in">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="h5 fw-bold mb-0 bio-results-title">Generated Variations:</h3>
                        <Button variant="link" className="p-0 fw-bold text-decoration-none" style={{ color: '#e1306c' }} onClick={generateBios}>
                            <FaRedo className="me-1" /> Regenerate
                        </Button>
                    </div>
                    <div className="row">
                        {bios.map((bio, idx) => (
                            <div key={idx} className="col-12">
                                <div className="bio-card">
                                    <div className="bio-text">{bio}</div>
                                    <div className="bio-footer">
                                        <div className="char-count text-uppercase">Option {idx + 1} • {bio.length}/150 Chars</div>
                                        <button className="btn-copy-bio" onClick={() => copyBio(bio)}>
                                            <FaCopy /> Copy Bio
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!loading && bios.length === 0 && (
                <div className="text-center py-5" style={{ opacity: 0.4 }}>
                    <FaInstagram size={56} className="mb-3" style={{ color: '#bc1888' }} />
                    <p className="fw-bold" style={{ color: '#2d3748' }}>Your professional Instagram bios will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default InstagramBioGenerator;
