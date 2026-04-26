import React, { useState } from 'react';
import { Form, Button, Spinner, ProgressBar } from 'react-bootstrap';
import { 
    FaHashtag, FaMagic, FaChartLine, FaRedo, 
    FaFire, FaLock, FaGlobe, FaSearch 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import aiService from '../../../../services/aiService.js';

const HashtagAnalyzer = () => {
    const [hashtag, setHashtag] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const analyzeHashtag = async () => {
        const cleanTag = hashtag.trim().replace(/^#/, '');
        if (!cleanTag) {
            toast.error('Please enter a hashtag to analyze!');
            return;
        }

        setLoading(true);
        try {
                        const prompt = `Analyze the hashtag "#${cleanTag}" for social media (Instagram, Twitter, TikTok).
            Provide:
            1. reachScore (0-100)
            2. competitionScore (0-100)
            3. difficulty (Low, Medium, High)
            4. recommendedPostTime (best time to post)
            5. relatedHashtags (array of 10 related trending hashtags)
            6. summary (short explanation of why this hashtag is good or bad)
            
            Format the response as a valid JSON object.
            Do not include any other text except the JSON object.`;

            const results = await aiService.generateContent(prompt, 'json');
            
            setAnalysis(results);
            toast.success('Analysis complete!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to analyze hashtag. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyTag = (tag) => {
        navigator.clipboard.writeText(tag);
        toast.success(`Hashtag ${tag} copied!`);
    };

    return (
        <div className="hashtag-analyzer-container py-4">
            <style>{`
                .hashtag-analyzer-container {
                    max-width: 900px;
                    margin: 0 auto;
                }
                .main-input-card {
                    background: #ffffff;
                    border: 1px solid #e1e8ed;
                    border-radius: 24px;
                    padding: 2.5rem;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                    margin-bottom: 2rem;
                    text-align: center;
                }
                .premium-input-group {
                    position: relative;
                    max-width: 500px;
                    margin: 0 auto 1.5rem;
                }
                .hashtag-icon {
                    position: absolute;
                    left: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #e1306c;
                    font-size: 1.2rem;
                }
                .premium-input {
                    padding: 1.2rem 1.2rem 1.2rem 3.5rem !important;
                    background: #f8fafc !important;
                    border: 2px solid #edf2f7 !important;
                    border-radius: 16px !important;
                    font-size: 1.1rem !important;
                    font-weight: 600 !important;
                    color: #1a202c !important;
                    transition: all 0.3s;
                }
                .premium-input:focus {
                    border-color: #e1306c !important;
                    background: #fff !important;
                    box-shadow: 0 0 0 4px rgba(225, 48, 108, 0.1) !important;
                }
                .btn-analyze {
                    background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
                    border: none;
                    padding: 1rem 2.5rem;
                    font-weight: 700;
                    font-size: 1.1rem;
                    border-radius: 12px;
                    color: white;
                    box-shadow: 0 4px 15px rgba(225, 48, 108, 0.3);
                    transition: all 0.3s;
                }
                .btn-analyze:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(225, 48, 108, 0.4);
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 2rem;
                }
                .stat-card {
                    background: #fff;
                    border: 1px solid #edf2f7;
                    border-radius: 20px;
                    padding: 1.5rem;
                    text-align: center;
                    transition: all 0.3s;
                }
                .stat-card:hover {
                    border-color: #e1306c;
                    transform: translateY(-5px);
                }
                .stat-value {
                    font-size: 1.8rem;
                    font-weight: 800;
                    color: #1a202c;
                    margin-bottom: 5px;
                }
                .stat-label {
                    color: #718096;
                    font-size: 0.85rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .analysis-dashboard {
                    background: #ffffff;
                    border: 1px solid #edf2f7;
                    border-radius: 24px;
                    padding: 2rem;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
                }
                .progress-label {
                    display: flex;
                    justify-content: space-between;
                    font-weight: 700;
                    color: #4a5568;
                    font-size: 0.9rem;
                    margin-bottom: 8px;
                }
                .custom-progress {
                    height: 12px !important;
                    border-radius: 10px !important;
                    background: #f1f5f9 !important;
                    margin-bottom: 1.5rem;
                }
                .tag-suggestions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-top: 1.5rem;
                }
                .suggested-tag {
                    background: #f8fafc;
                    border: 1px solid #edf2f7;
                    padding: 8px 16px;
                    border-radius: 50px;
                    color: #4a5568;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: 0.2s;
                }
                .suggested-tag:hover {
                    background: #e1306c;
                    color: white;
                    border-color: #e1306c;
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
                <FaHashtag size={48} className="mb-4" style={{ color: '#e1306c' }} />
                <h2 className="h3 fw-bold mb-2" style={{ color: '#1a202c' }}>Hashtag Analyzer</h2>
                <p className="text-muted mb-4">Analyze reach, competition, and find trending related tags.</p>
                
                <div className="premium-input-group">
                    <FaSearch className="hashtag-icon" />
                    <Form.Control 
                        type="text"
                        placeholder="Enter hashtag (e.g. travelvlogs)"
                        value={hashtag}
                        onChange={(e) => setHashtag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && analyzeHashtag()}
                        className="premium-input"
                    />
                </div>

                <Button 
                    className="btn-analyze"
                    onClick={analyzeHashtag}
                    disabled={loading}
                >
                    {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <FaMagic className="me-2" />}
                    {loading ? 'Analyzing Data...' : 'Analyze Hashtag'}
                </Button>
            </div>

            {analysis && (
                <div className="analysis-dashboard fade-in">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="h5 fw-bold mb-0" style={{ color: '#2d3748' }}>
                            Report for #{hashtag.replace(/^#/, '')}
                        </h3>
                        <Button variant="link" className="p-0 text-decoration-none fw-bold" style={{ color: '#e1306c' }} onClick={analyzeHashtag}>
                            <FaRedo size={14} className="me-1" /> Refresh
                        </Button>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <FaChartLine className="mb-2 text-primary" size={24} />
                            <div className="stat-value">{analysis.reachScore}%</div>
                            <div className="stat-label">Reach Potential</div>
                        </div>
                        <div className="stat-card">
                            <FaLock className="mb-2 text-danger" size={24} />
                            <div className="stat-value">{analysis.competitionScore}%</div>
                            <div className="stat-label">Competition</div>
                        </div>
                        <div className="stat-card">
                            <FaFire className="mb-2 text-warning" size={24} />
                            <div className="stat-value">{analysis.difficulty}</div>
                            <div className="stat-label">Difficulty</div>
                        </div>
                        <div className="stat-card">
                            <FaGlobe className="mb-2 text-success" size={24} />
                            <div className="stat-value">{analysis.recommendedPostTime}</div>
                            <div className="stat-label">Best Post Time</div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="progress-label">
                            <span>Visibility Score</span>
                            <span>{analysis.reachScore}/100</span>
                        </div>
                        <ProgressBar now={analysis.reachScore} className="custom-progress" variant="primary" />
                        
                        <div className="progress-label">
                            <span>Saturations Level</span>
                            <span>{analysis.competitionScore}/100</span>
                        </div>
                        <ProgressBar now={analysis.competitionScore} className="custom-progress" variant="danger" />
                    </div>

                    <div className="p-3 rounded-4 bg-light mb-4">
                        <p className="small mb-0 text-dark"><strong>AI Summary:</strong> {analysis.summary}</p>
                    </div>

                    <h4 className="h6 fw-bold mb-3" style={{ color: '#2d3748' }}>Related Trending Hashtags:</h4>
                    <div className="tag-suggestions">
                        {analysis.relatedHashtags.map((tag, idx) => (
                            <div key={idx} className="suggested-tag" onClick={() => copyTag(tag)}>
                                {tag.startsWith('#') ? tag : `#${tag}`}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!loading && !analysis && (
                <div className="text-center py-5" style={{ opacity: 0.3 }}>
                    <FaChartLine size={60} className="mb-3" style={{ color: '#e1306c' }} />
                    <p className="fw-bold" style={{ color: '#2d3748' }}>Your hashtag data will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default HashtagAnalyzer;
