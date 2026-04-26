import React, { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { 
    FaTwitter, FaMagic, FaCopy, FaRedo, 
    FaHashtag, FaListUl, FaRegLightbulb 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import aiService from '../../../../services/aiService.js';

const TweetGenerator = () => {
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState('Witty');
    const [isThread, setIsThread] = useState(false);
    const [includeHashtags, setIncludeHashtags] = useState(true);
    const [loading, setLoading] = useState(false);
    const [tweets, setTweets] = useState([]);

    const tones = ['Witty', 'Professional', 'Controversial', 'Inspirational', 'Savage', 'Informative', 'Minimalist'];

    const generateTweets = async () => {
        if (!topic.trim()) {
            toast.error('Please enter a topic or idea first!');
            return;
        }

        setLoading(true);
        try {
                        const prompt = `Generate ${isThread ? 'a 5-tweet thread' : '5 distinct tweet variations'} based on this topic/idea: "${topic}".
            Tone: ${tone}
            Include Hashtags: ${includeHashtags ? 'Yes' : 'No'}
            
            Each tweet should be:
            1. Under 280 characters.
            2. Engaging and optimized for X (Twitter).
            3. Reflecting the ${tone} personality.
            ${isThread ? '4. Connected logically as a thread.' : ''}
            
            Format the response as a JSON array of strings. Each string is one tweet.
            Do not include any other text except the JSON array.`;

            const results = await aiService.generateContent(prompt, 'json');
            
            setTweets(results);
            toast.success(isThread ? 'Thread generated!' : 'Tweets generated!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to generate. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyTweet = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Tweet copied!');
    };

    const copyAll = () => {
        const allText = tweets.join('\n\n---\n\n');
        navigator.clipboard.writeText(allText);
        toast.success('All tweets copied!');
    };

    return (
        <div className="tweet-generator-container py-4">
            <style>{`
                .tweet-generator-container {
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
                    border-color: #1da1f2 !important;
                    background: #fff !important;
                    box-shadow: 0 0 0 4px rgba(29, 161, 242, 0.1) !important;
                }
                .toggle-row {
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
                    flex: 1;
                }
                .custom-toggle:hover {
                    border-color: #1da1f2;
                }
                .custom-toggle span {
                    color: #4a5568;
                    font-weight: 600;
                    font-size: 0.9rem;
                }
                .btn-generate-main {
                    background: #1da1f2;
                    border: none;
                    padding: 1rem;
                    font-weight: 700;
                    font-size: 1.1rem;
                    border-radius: 12px;
                    width: 100%;
                    color: white;
                    box-shadow: 0 4px 15px rgba(29, 161, 242, 0.3);
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .btn-generate-main:hover {
                    background: #1991db;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(29, 161, 242, 0.4);
                    color: white;
                }
                .tweet-card {
                    background: #fff;
                    border: 1px solid #edf2f7;
                    border-radius: 16px;
                    padding: 1.5rem;
                    margin-bottom: 1rem;
                    transition: all 0.3s;
                    position: relative;
                }
                .tweet-card:hover {
                    border-color: #1da1f2;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
                }
                .tweet-text {
                    color: #1a202c;
                    font-size: 1.1rem;
                    line-height: 1.5;
                    margin-bottom: 1rem;
                    white-space: pre-wrap;
                }
                .tweet-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 1rem;
                    border-top: 1px solid #f7fafc;
                }
                .btn-copy-tweet {
                    background: #eff6ff;
                    color: #1d4ed8;
                    border: 1px solid #dbeafe;
                    padding: 6px 16px;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 0.85rem;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: 0.2s;
                }
                .btn-copy-tweet:hover {
                    background: #1d4ed8;
                    color: #fff;
                }
                .thread-indicator {
                    width: 2px;
                    height: 20px;
                    background: #e1e8ed;
                    margin-left: 20px;
                    margin-top: -10px;
                    margin-bottom: -10px;
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
                    <div className="p-3 rounded-4" style={{ background: '#e1f5fe' }}>
                        <FaTwitter size={28} style={{ color: '#1da1f2' }} />
                    </div>
                    <div>
                        <h2 className="h4 fw-bold mb-1" style={{ color: '#1a202c' }}>Tweet Generator</h2>
                        <p className="text-muted mb-0 small">Draft viral tweets and threads in seconds.</p>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-12">
                        <label className="premium-label">
                            <FaRegLightbulb size={14} /> Tone of Voice
                        </label>
                        <div className="d-flex flex-wrap gap-2">
                            {tones.map(t => (
                                <Button 
                                    key={t}
                                    variant={tone === t ? "primary" : "light"}
                                    onClick={() => setTone(t)}
                                    className="rounded-pill px-3 py-1 border-0"
                                    style={{ 
                                        fontSize: '0.85rem', 
                                        fontWeight: 600,
                                        background: tone === t ? '#1da1f2' : '#f1f5f9',
                                        color: tone === t ? '#fff' : '#475569'
                                    }}
                                >
                                    {t}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="premium-label">What's on your mind?</label>
                    <Form.Control 
                        as="textarea"
                        rows={3}
                        placeholder="e.g. AI is going to change how we write code forever..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="premium-input"
                    />
                </div>

                <div className="toggle-row">
                    <div className="custom-toggle" onClick={() => setIsThread(!isThread)}>
                        <FaListUl size={16} color={isThread ? '#1da1f2' : '#a0aec0'} />
                        <span>Generate Thread</span>
                        <Form.Check 
                            type="switch"
                            checked={isThread}
                            onChange={() => {}}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="custom-toggle" onClick={() => setIncludeHashtags(!includeHashtags)}>
                        <FaHashtag size={16} color={includeHashtags ? '#1da1f2' : '#a0aec0'} />
                        <span>Hashtags</span>
                        <Form.Check 
                            type="switch"
                            checked={includeHashtags}
                            onChange={() => {}}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>

                <Button 
                    className="btn-generate-main"
                    onClick={generateTweets}
                    disabled={loading}
                >
                    {loading ? <Spinner animation="border" size="sm" /> : <FaMagic />}
                    {loading ? 'AI is Drafting...' : `Generate ${isThread ? 'Thread' : 'Tweets'}`}
                </Button>
            </div>

            {tweets.length > 0 && (
                <div className="fade-in">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="h5 fw-bold mb-0" style={{ color: '#2d3748' }}>
                            {isThread ? 'Generated Thread:' : 'Tweet Variations:'}
                        </h3>
                        <div className="d-flex gap-2">
                            <Button variant="link" className="p-0 fw-bold text-decoration-none" style={{ color: '#1da1f2' }} onClick={generateTweets}>
                                <FaRedo className="me-1" />
                            </Button>
                            <Button variant="link" className="p-0 fw-bold text-decoration-none text-muted" onClick={copyAll}>
                                <FaCopy className="me-1" /> Copy All
                            </Button>
                        </div>
                    </div>
                    <div className="tweets-list">
                        {tweets.map((tweet, idx) => (
                            <React.Fragment key={idx}>
                                <div className="tweet-card">
                                    <div className="tweet-text">{tweet}</div>
                                    <div className="tweet-footer">
                                        <div className="text-muted small fw-bold">
                                            {isThread ? `${idx + 1}/${tweets.length}` : `Option ${idx + 1}`} • {tweet.length} Chars
                                        </div>
                                        <button className="btn-copy-tweet" onClick={() => copyTweet(tweet)}>
                                            <FaCopy /> Copy
                                        </button>
                                    </div>
                                </div>
                                {isThread && idx < tweets.length - 1 && <div className="thread-indicator"></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            {!loading && tweets.length === 0 && (
                <div className="text-center py-5" style={{ opacity: 0.3 }}>
                    <FaTwitter size={60} className="mb-3" style={{ color: '#1da1f2' }} />
                    <p className="fw-bold" style={{ color: '#2d3748' }}>Your viral tweets will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default TweetGenerator;
