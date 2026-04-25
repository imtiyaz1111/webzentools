import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert, ProgressBar } from 'react-bootstrap';
import { 
    FaCalculator, FaChartBar, 
    FaEye, FaArrowTrendUp, FaRegLightbulb, FaCircleInfo,
    FaBullhorn, FaMoneyBillTrendUp
} from 'react-icons/fa6';
import { FaPercent, FaSyncAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './CampaignPerformanceAnalyzer.css';

const CampaignPerformanceAnalyzer = () => {
    const [data, setData] = useState({
        impressions: '',
        clicks: '',
        conversions: '',
        spend: '',
        revenue: ''
    });

    const [results, setResults] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const analyzePerformance = () => {
        const imp = parseFloat(data.impressions) || 0;
        const clicks = parseFloat(data.clicks) || 0;
        const conv = parseFloat(data.conversions) || 0;
        const spend = parseFloat(data.spend) || 0;
        const rev = parseFloat(data.revenue) || 0;

        if (imp <= 0 && spend <= 0) {
            toast.error('Please enter impressions or spend data.');
            return;
        }

        const ctr = imp > 0 ? (clicks / imp) * 100 : 0;
        const cr = clicks > 0 ? (conv / clicks) * 100 : 0;
        const cpc = clicks > 0 ? spend / clicks : 0;
        const cpm = imp > 0 ? (spend / imp) * 1000 : 0;
        const cpa = conv > 0 ? spend / conv : 0;
        const roas = spend > 0 ? rev / spend : 0;
        const roi = spend > 0 ? ((rev - spend) / spend) * 100 : 0;

        setResults({
            ctr: ctr.toFixed(2),
            cr: cr.toFixed(2),
            cpc: cpc.toFixed(2),
            cpm: cpm.toFixed(2),
            cpa: cpa.toFixed(2),
            roas: roas.toFixed(2),
            roi: roi.toFixed(2),
            profit: (rev - spend).toFixed(2)
        });
        
        toast.success('Analysis complete!');
    };

    const resetTool = () => {
        setData({
            impressions: '',
            clicks: '',
            conversions: '',
            spend: '',
            revenue: ''
        });
        setResults(null);
    };

    return (
        <div className="campaign-analyzer-container py-4">
            <div className="text-center mb-5">
                <div className="premium-badge mb-3">
                    <FaBullhorn className="me-2" /> Multi-Channel Insights
                </div>
                <h1 className="display-5 fw-bold mb-3 gradient-text">Campaign Performance Analyzer</h1>
                <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                    Evaluate your marketing success with surgical precision. Track CTR, ROAS, and ROI across all your advertising channels in one premium dashboard.
                </p>
            </div>

            <div className="row g-4">
                {/* Inputs Section */}
                <div className="col-lg-5">
                    <Card className="premium-card border-0 shadow-lg h-100">
                        <Card.Body className="p-4 p-md-5">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary">
                                    <FaChartBar size={24} />
                                </div>
                                <div>
                                    <h2 className="h4 fw-bold mb-1">Campaign Metrics</h2>
                                    <p className="text-muted mb-0 small">Input Raw Performance Data</p>
                                </div>
                            </div>

                            <Form>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="extra-small fw-bold text-muted uppercase">Impressions</Form.Label>
                                            <Form.Control 
                                                type="number"
                                                name="impressions"
                                                placeholder="e.g. 100000"
                                                value={data.impressions}
                                                onChange={handleInputChange}
                                                className="premium-input-sm"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="extra-small fw-bold text-muted uppercase">Clicks</Form.Label>
                                            <Form.Control 
                                                type="number"
                                                name="clicks"
                                                placeholder="e.g. 2500"
                                                value={data.clicks}
                                                onChange={handleInputChange}
                                                className="premium-input-sm"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label className="extra-small fw-bold text-muted uppercase">Total Conversions</Form.Label>
                                    <Form.Control 
                                        type="number"
                                        name="conversions"
                                        placeholder="e.g. 120"
                                        value={data.conversions}
                                        onChange={handleInputChange}
                                        className="premium-input-sm"
                                    />
                                </Form.Group>

                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="extra-small fw-bold text-muted uppercase">Total Spend ($)</Form.Label>
                                            <Form.Control 
                                                type="number"
                                                name="spend"
                                                placeholder="e.g. 1500"
                                                value={data.spend}
                                                onChange={handleInputChange}
                                                className="premium-input-sm"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="extra-small fw-bold text-muted uppercase">Total Revenue ($)</Form.Label>
                                            <Form.Control 
                                                type="number"
                                                name="revenue"
                                                placeholder="e.g. 4500"
                                                value={data.revenue}
                                                onChange={handleInputChange}
                                                className="premium-input-sm"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="d-flex gap-3">
                                    <Button 
                                        className="btn-premium flex-grow-1 py-3 d-flex align-items-center justify-content-center gap-2"
                                        onClick={analyzePerformance}
                                    >
                                        <FaCalculator /> Run Full Analysis
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
                <div className="col-lg-7">
                    {results ? (
                        <div className="results-grid h-100 d-flex flex-column gap-4">
                            {/* Top row: CTR & CR */}
                            <Row className="g-4">
                                <Col md={6}>
                                    <Card className="premium-card border-0 shadow-lg text-center bg-white h-100">
                                        <Card.Body className="p-4">
                                            <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary mx-auto mb-2" style={{ width: 'fit-content' }}>
                                                <FaPercent size={16} />
                                            </div>
                                            <div className="h2 fw-bold mb-0">{results.ctr}%</div>
                                            <div className="text-muted extra-small uppercase fw-bold">CTR (Click-Through Rate)</div>
                                            <ProgressBar now={Math.min(parseFloat(results.ctr) * 10, 100)} variant="primary" className="mt-3" style={{ height: '4px' }} />
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="premium-card border-0 shadow-lg text-center bg-white h-100">
                                        <Card.Body className="p-4">
                                            <div className="p-2 rounded-circle bg-success bg-opacity-10 text-success mx-auto mb-2" style={{ width: 'fit-content' }}>
                                                <FaArrowTrendUp size={16} />
                                            </div>
                                            <div className="h2 fw-bold mb-0">{results.cr}%</div>
                                            <div className="text-muted extra-small uppercase fw-bold">Conversion Rate</div>
                                            <ProgressBar now={Math.min(parseFloat(results.cr) * 10, 100)} variant="success" className="mt-3" style={{ height: '4px' }} />
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Main Metrics: ROAS & ROI */}
                            <Card className="premium-card border-0 shadow-lg bg-gradient-dark text-white">
                                <Card.Body className="p-4">
                                    <Row className="align-items-center">
                                        <Col xs={6} className="text-center border-end border-white border-opacity-10">
                                            <div className="h1 fw-bold mb-0">{results.roas}x</div>
                                            <div className="opacity-75 extra-small uppercase fw-bold">ROAS</div>
                                        </Col>
                                        <Col xs={6} className="text-center">
                                            <div className="h1 fw-bold mb-0">{results.roi}%</div>
                                            <div className="opacity-75 extra-small uppercase fw-bold">ROI</div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* Cost Metrics Row */}
                            <Row className="g-4">
                                <Col md={4}>
                                    <Card className="premium-card border-0 shadow-lg text-center bg-white h-100">
                                        <Card.Body className="p-3">
                                            <div className="h4 fw-bold mb-0">${results.cpc}</div>
                                            <div className="text-muted extra-small uppercase fw-bold">Avg. CPC</div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card className="premium-card border-0 shadow-lg text-center bg-white h-100">
                                        <Card.Body className="p-3">
                                            <div className="h4 fw-bold mb-0">${results.cpa}</div>
                                            <div className="text-muted extra-small uppercase fw-bold">Avg. CPA</div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card className="premium-card border-0 shadow-lg text-center bg-white h-100">
                                        <Card.Body className="p-3">
                                            <div className="h4 fw-bold mb-0">${results.cpm}</div>
                                            <div className="text-muted extra-small uppercase fw-bold">Avg. CPM</div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <Alert variant={parseFloat(results.profit) > 0 ? "success" : "danger"} className="border-0 rounded-4 mb-0">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-2">
                                        <FaMoneyBillTrendUp />
                                        <span className="fw-bold">Net Profit/Loss:</span>
                                    </div>
                                    <span className="h5 mb-0 fw-bold">${results.profit}</span>
                                </div>
                            </Alert>
                        </div>
                    ) : (
                        <div className="h-100 d-flex align-items-center justify-content-center text-center p-5 bg-light bg-opacity-50 rounded-5 border-dashed">
                            <div>
                                <div className="pulsing-icon mb-4">
                                    <FaBullhorn size={64} className="text-muted opacity-50" />
                                </div>
                                <h3 className="h4 fw-bold mb-2">Ready for Analysis</h3>
                                <p className="text-muted small mb-0">Enter your campaign metrics on the left to generate your performance dashboard.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Educational Section */}
            <div className="mt-5 p-4 glass-panel rounded-4 border border-white">
                <h5 className="h6 fw-bold text-dark d-flex align-items-center gap-2 mb-4">
                    <FaRegLightbulb className="text-warning" /> Key Marketing Terminologies
                </h5>
                <Row className="g-4">
                    <Col md={4}>
                        <div className="d-flex gap-3">
                            <div className="text-primary"><FaCircleInfo /></div>
                            <div>
                                <div className="fw-bold small mb-1">ROAS vs ROI</div>
                                <p className="extra-small text-muted mb-0">ROAS measures revenue for every dollar spent on ads. ROI measures profit after all costs.</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="d-flex gap-3">
                            <div className="text-success"><FaCircleInfo /></div>
                            <div>
                                <div className="fw-bold small mb-1">CTR (Click-Through Rate)</div>
                                <p className="extra-small text-muted mb-0">A high CTR means your ad is highly relevant to your audience. Avg. CTR is usually 1-3%.</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="d-flex gap-3">
                            <div className="text-danger"><FaCircleInfo /></div>
                            <div>
                                <div className="fw-bold small mb-1">CPA (Cost Per Acquisition)</div>
                                <p className="extra-small text-muted mb-0">This tells you exactly how much you paid to get one customer. It's the ultimate health metric.</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default CampaignPerformanceAnalyzer;
