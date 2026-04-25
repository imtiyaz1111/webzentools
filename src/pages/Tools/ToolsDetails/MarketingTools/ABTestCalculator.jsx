import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert, Badge } from 'react-bootstrap';
import { 
    FaCalculator, FaFlask,
    FaArrowTrendUp, FaRegLightbulb, FaCircleInfo,
    FaVial, FaScaleBalanced,
    FaTimeline
} from 'react-icons/fa6';
import { FaRegCheckCircle, FaSyncAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './ABTestCalculator.css';

const ABTestCalculator = () => {
    const [data, setData] = useState({
        visitorsA: '',
        conversionsA: '',
        visitorsB: '',
        conversionsB: ''
    });

    const [results, setResults] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const calculateSignificance = () => {
        const vA = parseInt(data.visitorsA) || 0;
        const cA = parseInt(data.conversionsA) || 0;
        const vB = parseInt(data.visitorsB) || 0;
        const cB = parseInt(data.conversionsB) || 0;

        if (vA <= 0 || vB <= 0 || cA < 0 || cB < 0) {
            toast.error('Please enter valid visitor and conversion counts.');
            return;
        }

        const crA = cA / vA;
        const crB = cB / vB;
        
        // Z-score calculation
        const pooledProb = (cA + cB) / (vA + vB);
        const standardError = Math.sqrt(pooledProb * (1 - pooledProb) * (1/vA + 1/vB));
        const zScore = (crB - crA) / standardError;
        
        // Standard normal distribution for confidence levels
        // 90% = 1.645, 95% = 1.96, 99% = 2.576
        const absZ = Math.abs(zScore);
        let confidence = 0;
        if (absZ >= 2.576) confidence = 99;
        else if (absZ >= 1.96) confidence = 95;
        else if (absZ >= 1.645) confidence = 90;
        else confidence = (0.5 * (1 + Math.erf(absZ / Math.sqrt(2)))) * 100;

        const improvement = ((crB - crA) / crA) * 100;
        const isSignificant = absZ >= 1.96; // 95% threshold

        setResults({
            crA: (crA * 100).toFixed(2),
            crB: (crB * 100).toFixed(2),
            improvement: improvement.toFixed(2),
            confidence: confidence.toFixed(1),
            isSignificant,
            winner: crB > crA ? 'Variation B' : 'Variation A',
            zScore: zScore.toFixed(3)
        });
        
        toast.success('Statistical analysis complete!');
    };

    const resetTool = () => {
        setData({
            visitorsA: '',
            conversionsA: '',
            visitorsB: '',
            conversionsB: ''
        });
        setResults(null);
    };

    return (
        <div className="ab-test-calculator-container py-4">
            <div className="text-center mb-5">
                <div className="premium-badge mb-3">
                    <FaFlask className="me-2" /> Data-Driven Testing
                </div>
                <h1 className="display-5 fw-bold mb-3 gradient-text">A/B Test Calculator</h1>
                <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                    Determine if your experiment results are statistically significant. Stop guessing and start knowing which variation actually performs better.
                </p>
            </div>

            <div className="row g-4">
                {/* Inputs Section */}
                <div className="col-lg-6">
                    <Card className="premium-card border-0 shadow-lg h-100">
                        <Card.Body className="p-4 p-md-5">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary">
                                    <FaVial size={24} />
                                </div>
                                <div>
                                    <h2 className="h4 fw-bold mb-1">Experiment Data</h2>
                                    <p className="text-muted mb-0 small">Enter Variation Metrics</p>
                                </div>
                            </div>

                            <Form>
                                <Row className="g-4">
                                    {/* Variation A */}
                                    <Col md={6}>
                                        <div className="variation-box p-4 rounded-4 border bg-light">
                                            <h3 className="h6 fw-bold mb-3 text-primary text-uppercase">Variation A (Control)</h3>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="extra-small fw-bold text-muted uppercase">Visitors</Form.Label>
                                                <Form.Control 
                                                    type="number"
                                                    name="visitorsA"
                                                    placeholder="e.g. 5000"
                                                    value={data.visitorsA}
                                                    onChange={handleInputChange}
                                                    className="premium-input-sm"
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label className="extra-small fw-bold text-muted uppercase">Conversions</Form.Label>
                                                <Form.Control 
                                                    type="number"
                                                    name="conversionsA"
                                                    placeholder="e.g. 150"
                                                    value={data.conversionsA}
                                                    onChange={handleInputChange}
                                                    className="premium-input-sm"
                                                />
                                            </Form.Group>
                                        </div>
                                    </Col>

                                    {/* Variation B */}
                                    <Col md={6}>
                                        <div className="variation-box p-4 rounded-4 border bg-light">
                                            <h3 className="h6 fw-bold mb-3 text-purple text-uppercase">Variation B (Test)</h3>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="extra-small fw-bold text-muted uppercase">Visitors</Form.Label>
                                                <Form.Control 
                                                    type="number"
                                                    name="visitorsB"
                                                    placeholder="e.g. 5000"
                                                    value={data.visitorsB}
                                                    onChange={handleInputChange}
                                                    className="premium-input-sm"
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label className="extra-small fw-bold text-muted uppercase">Conversions</Form.Label>
                                                <Form.Control 
                                                    type="number"
                                                    name="conversionsB"
                                                    placeholder="e.g. 185"
                                                    value={data.conversionsB}
                                                    onChange={handleInputChange}
                                                    className="premium-input-sm"
                                                />
                                            </Form.Group>
                                        </div>
                                    </Col>
                                </Row>

                                <div className="d-flex gap-3 mt-4">
                                    <Button 
                                        className="btn-premium flex-grow-1 py-3 d-flex align-items-center justify-content-center gap-2"
                                        onClick={calculateSignificance}
                                    >
                                        <FaCalculator /> Analyze Significance
                                    </Button>
                                    <Button 
                                        variant="light" 
                                        className="rounded-4 px-4 border shadow-sm"
                                        onClick={resetTool}
                                    >
                                        <FaSyncAlt />
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>

                {/* Results Section */}
                <div className="col-lg-6">
                    {results ? (
                        <Card className="premium-card border-0 shadow-lg h-100 overflow-hidden">
                            <Card.Body className="p-0">
                                {/* Significance Banner */}
                                <div className={`p-4 text-center ${results.isSignificant ? 'bg-success' : 'bg-warning'} text-white mb-4`}>
                                    <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                                        {results.isSignificant ? <FaRegCheckCircle size={24} /> : <FaTimeline size={24} />}
                                        <h3 className="h4 fw-bold mb-0">
                                            {results.isSignificant ? 'Statistically Significant!' : 'Not Significant Yet'}
                                        </h3>
                                    </div>
                                    <p className="mb-0 opacity-75 small">
                                        Confidence Level: {results.confidence}%
                                    </p>
                                </div>

                                <div className="p-4 p-md-5 pt-0">
                                    <Row className="g-4 mb-4">
                                        <Col xs={6}>
                                            <div className="result-metric p-3 rounded-4 bg-light border text-center">
                                                <div className="extra-small text-muted uppercase fw-bold mb-1">Conv. Rate A</div>
                                                <div className="h4 fw-bold mb-0 text-primary">{results.crA}%</div>
                                            </div>
                                        </Col>
                                        <Col xs={6}>
                                            <div className="result-metric p-3 rounded-4 bg-light border text-center">
                                                <div className="extra-small text-muted uppercase fw-bold mb-1">Conv. Rate B</div>
                                                <div className="h4 fw-bold mb-0 text-purple">{results.crB}%</div>
                                            </div>
                                        </Col>
                                    </Row>

                                    <div className="winner-box p-4 rounded-4 bg-white border shadow-sm mb-4 text-center">
                                        <div className="h6 text-muted uppercase fw-bold mb-2">Outcome</div>
                                        <div className="h2 fw-bold mb-2">
                                            {results.improvement > 0 ? '+' : ''}{results.improvement}%
                                        </div>
                                        <div className="text-muted small">
                                            Variation B is {results.improvement > 0 ? 'better' : 'worse'} than Variation A.
                                        </div>
                                    </div>

                                    <Alert variant={results.isSignificant ? "success" : "info"} className="border-0 rounded-4">
                                        <FaCircleInfo className="me-2" />
                                        {results.isSignificant 
                                            ? `We are ${results.confidence}% confident that ${results.winner} is the true winner.` 
                                            : "There is not enough data to be 95% confident in the results. Consider running the test longer."}
                                    </Alert>
                                </div>
                            </Card.Body>
                        </Card>
                    ) : (
                        <Card className="premium-card border-0 shadow-lg h-100 d-flex align-items-center justify-content-center text-center p-5 bg-light bg-opacity-50 border-dashed">
                            <div className="opacity-50">
                                <FaScaleBalanced size={64} className="mb-4 text-muted" />
                                <h3 className="h4 fw-bold mb-2">Awaiting Results</h3>
                                <p className="text-muted small mb-0">Enter Variation A & B data to see statistical analysis.</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* Educational Section */}
            <div className="mt-5 p-4 glass-panel rounded-4 border border-white">
                <h5 className="h6 fw-bold text-dark d-flex align-items-center gap-2 mb-4">
                    <FaRegLightbulb className="text-warning" /> A/B Testing Best Practices
                </h5>
                <Row className="g-4">
                    <Col md={4}>
                        <div className="d-flex gap-3">
                            <div className="text-primary"><FaCircleInfo /></div>
                            <div>
                                <div className="fw-bold small mb-1">Sample Size Matters</div>
                                <p className="extra-small text-muted mb-0">Small samples can lead to false winners. Ensure you have enough visitors before trusting the results.</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="d-flex gap-3">
                            <div className="text-success"><FaCircleInfo /></div>
                            <div>
                                <div className="fw-bold small mb-1">95% Confidence</div>
                                <p className="extra-small text-muted mb-0">The industry standard for a "winner" is a 95% confidence level, meaning there's only a 5% chance of error.</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="d-flex gap-3">
                            <div className="text-danger"><FaCircleInfo /></div>
                            <div>
                                <div className="fw-bold small mb-1">Don't Peep!</div>
                                <p className="extra-small text-muted mb-0">Avoid stopping tests early just because you see a winner. Let it run for at least 7 days to account for weekly cycles.</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ABTestCalculator;
