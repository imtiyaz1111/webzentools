import React, { useState } from 'react';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import { 
    FaChartPie, FaMagic, FaUsers, FaHeart, 
    FaComment, FaShare, FaLightbulb 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import aiService from '../../../../services/aiService.js';

const EngagementCalculator = () => {
    const [followers, setFollowers] = useState('');
    const [likes, setLikes] = useState('');
    const [comments, setComments] = useState('');
    const [shares, setShares] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const calculateEngagement = async () => {
        const f = parseFloat(followers);
        const l = parseFloat(likes) || 0;
        const c = parseFloat(comments) || 0;
        const s = parseFloat(shares) || 0;

        if (!f || f <= 0) {
            toast.error('Please enter a valid number of followers!');
            return;
        }

        const engagementRate = ((l + c + s) / f) * 100;
        
        setLoading(true);
        try {
                        const prompt = `Analyze this social media engagement rate: ${engagementRate.toFixed(2)}%.
            Data: Followers: ${f}, Likes: ${l}, Comments: ${c}, Shares: ${s}.
            Provide:
            1. rating (Poor, Average, Good, Excellent)
            2. benchmark (what is the industry average for this follower count)
            3. suggestions (3 bullet points on how to improve this rate)
            4. verdict (1-2 sentences summary)
            
            Format the response as a valid JSON object.
            Do not include any other text except the JSON object.`;

            const analysis = await aiService.generateContent(prompt, 'json');
            
            setResult({
                rate: engagementRate.toFixed(2),
                ...analysis
            });
            toast.success('Calculation complete!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to get AI insights. Showing basic calculation.');
            setResult({
                rate: engagementRate.toFixed(2),
                rating: 'Unknown',
                benchmark: 'N/A',
                suggestions: ['Consistently post high-quality content', 'Engage with your audience', 'Use relevant hashtags'],
                verdict: 'Your engagement rate is calculated, but AI insights are currently unavailable.'
            });
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setFollowers('');
        setLikes('');
        setComments('');
        setShares('');
        setResult(null);
    };

    return (
        <div className="engagement-calculator-container py-4">
            <style>{`
                .engagement-calculator-container {
                    max-width: 900px;
                    margin: 0 auto;
                }
                .input-card {
                    background: #ffffff;
                    border: 1px solid #e1e8ed;
                    border-radius: 24px;
                    padding: 2.5rem;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                    margin-bottom: 2rem;
                }
                .premium-label {
                    font-weight: 700;
                    color: #475569;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    margin-bottom: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .premium-input {
                    padding: 0.8rem 1rem !important;
                    background: #f8fafc !important;
                    border: 2px solid #edf2f7 !important;
                    border-radius: 12px !important;
                    font-weight: 600 !important;
                    color: #1e293b !important;
                    transition: 0.3s;
                }
                .premium-input:focus {
                    border-color: #6366f1 !important;
                    background: #fff !important;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
                }
                .btn-calculate {
                    background: #6366f1;
                    border: none;
                    padding: 1rem;
                    font-weight: 700;
                    font-size: 1.1rem;
                    border-radius: 12px;
                    width: 100%;
                    color: white;
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
                    transition: 0.3s;
                }
                .btn-calculate:hover {
                    background: #4f46e5;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
                }
                .result-card {
                    background: #fff;
                    border: 1px solid #edf2f7;
                    border-radius: 24px;
                    padding: 2.5rem;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.02);
                }
                .rate-display {
                    text-align: center;
                    margin-bottom: 2rem;
                }
                .rate-value {
                    font-size: 4rem;
                    font-weight: 900;
                    color: #6366f1;
                    line-height: 1;
                }
                .rate-label {
                    font-weight: 800;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-top: 10px;
                }
                .rating-badge {
                    display: inline-block;
                    padding: 6px 16px;
                    border-radius: 50px;
                    font-weight: 700;
                    font-size: 0.9rem;
                    margin-top: 15px;
                }
                .rating-Excellent { background: #dcfce7; color: #166534; }
                .rating-Good { background: #dcfce7; color: #166534; }
                .rating-Average { background: #fef9c3; color: #854d0e; }
                .rating-Poor { background: #fee2e2; color: #991b1b; }
                
                .insight-box {
                    background: #f8fafc;
                    border: 1px solid #edf2f7;
                    border-radius: 16px;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                }
                .suggestion-item {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 12px;
                    color: #334155;
                    font-weight: 500;
                }
                .fade-in {
                    animation: fadeIn 0.4s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="input-card fade-in">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="p-3 rounded-4" style={{ background: '#eef2ff' }}>
                        <FaChartPie size={28} style={{ color: '#6366f1' }} />
                    </div>
                    <div>
                        <h2 className="h4 fw-bold mb-1" style={{ color: '#1e293b' }}>Engagement Calculator</h2>
                        <p className="text-muted mb-0 small">Measure your social impact and get AI growth tips.</p>
                    </div>
                </div>

                <Row className="mb-4">
                    <Col md={6} className="mb-3">
                        <label className="premium-label"><FaUsers size={12} /> Total Followers</label>
                        <Form.Control 
                            type="number"
                            placeholder="e.g. 10000"
                            value={followers}
                            onChange={(e) => setFollowers(e.target.value)}
                            className="premium-input"
                        />
                    </Col>
                    <Col md={6} className="mb-3">
                        <label className="premium-label"><FaHeart size={12} /> Avg. Likes</label>
                        <Form.Control 
                            type="number"
                            placeholder="e.g. 500"
                            value={likes}
                            onChange={(e) => setLikes(e.target.value)}
                            className="premium-input"
                        />
                    </Col>
                    <Col md={6} className="mb-3">
                        <label className="premium-label"><FaComment size={12} /> Avg. Comments</label>
                        <Form.Control 
                            type="number"
                            placeholder="e.g. 50"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            className="premium-input"
                        />
                    </Col>
                    <Col md={6} className="mb-3">
                        <label className="premium-label"><FaShare size={12} /> Avg. Shares</label>
                        <Form.Control 
                            type="number"
                            placeholder="e.g. 20"
                            value={shares}
                            onChange={(e) => setShares(e.target.value)}
                            className="premium-input"
                        />
                    </Col>
                </Row>

                <div className="d-flex gap-3">
                    <Button 
                        className="btn-calculate"
                        onClick={calculateEngagement}
                        disabled={loading}
                    >
                        {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <FaMagic className="me-2" />}
                        {loading ? 'Analyzing Profile...' : 'Calculate & Analyze'}
                    </Button>
                    <Button variant="light" className="px-4 rounded-3 border" onClick={reset}>Reset</Button>
                </div>
            </div>

            {result && (
                <div className="result-card fade-in">
                    <div className="rate-display">
                        <div className="rate-value">{result.rate}%</div>
                        <div className="rate-label">Engagement Rate</div>
                        <div className={`rating-badge rating-${result.rating}`}>
                            {result.rating} Performance
                        </div>
                    </div>

                    <div className="insight-box">
                        <h4 className="h6 fw-bold mb-3 d-flex align-items-center gap-2">
                            <FaLightbulb className="text-warning" /> AI Benchmarks & Insights
                        </h4>
                        <p className="small mb-2"><strong>Industry Average:</strong> {result.benchmark}</p>
                        <p className="small mb-0"><strong>Verdict:</strong> {result.verdict}</p>
                    </div>

                    <h4 className="h6 fw-bold mb-3" style={{ color: '#1e293b' }}>How to improve:</h4>
                    <div className="suggestions">
                        {result.suggestions.map((s, idx) => (
                            <div key={idx} className="suggestion-item">
                                <div className="text-primary fw-bold">{idx + 1}.</div>
                                <div className="small">{s}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!loading && !result && (
                <div className="text-center py-5" style={{ opacity: 0.3 }}>
                    <FaChartPie size={60} className="mb-3" style={{ color: '#6366f1' }} />
                    <p className="fw-bold" style={{ color: '#1e293b' }}>Enter your data above to see the magic.</p>
                </div>
            )}
        </div>
    );
};

export default EngagementCalculator;
