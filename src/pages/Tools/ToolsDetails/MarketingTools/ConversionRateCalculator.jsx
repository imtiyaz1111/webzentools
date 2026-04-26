import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { 
    FaPercent, FaCalculator, FaChartLine, 
    FaDollarSign, FaUsers, FaMousePointer, FaSyncAlt, FaRegLightbulb,
    FaInfoCircle
} from 'react-icons/fa';
import { FaArrowTrendUp } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import './ConversionRateCalculator.css';

const ConversionRateCalculator = () => {
    const [data, setData] = useState({
        visitors: '',
        conversions: '',
        adSpend: '',
        revenuePerConversion: ''
    });

    const [results, setResults] = useState({
        conversionRate: 0,
        cpa: 0,
        roi: 0,
        totalRevenue: 0,
        profit: 0
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const calculateMetrics = () => {
        const visitors = parseFloat(data.visitors) || 0;
        const conversions = parseFloat(data.conversions) || 0;
        const spend = parseFloat(data.adSpend) || 0;
        const revPerConv = parseFloat(data.revenuePerConversion) || 0;

        if (visitors <= 0 && spend <= 0) {
            toast.error('Please enter visitors or ad spend.');
            return;
        }

        const cr = visitors > 0 ? (conversions / visitors) * 100 : 0;
        const cpa = conversions > 0 ? spend / conversions : 0;
        const totalRev = conversions * revPerConv;
        const profit = totalRev - spend;
        const roi = spend > 0 ? (profit / spend) * 100 : 0;

        setResults({
            conversionRate: cr.toFixed(2),
            cpa: cpa.toFixed(2),
            roi: roi.toFixed(2),
            totalRevenue: totalRev.toFixed(2),
            profit: profit.toFixed(2)
        });
        
        toast.success('Metrics updated!');
    };

    const resetTool = () => {
        setData({
            visitors: '',
            conversions: '',
            adSpend: '',
            revenuePerConversion: ''
        });
        setResults({
            conversionRate: 0,
            cpa: 0,
            roi: 0,
            totalRevenue: 0,
            profit: 0
        });
    };

    return (
        <div className="cr-calculator-container py-4">
            <div className="text-center mb-5">
                <div className="premium-badge mb-3">
                    <FaChartLine className="me-2" /> ROI Optimizer
                </div>
                <h1 className="display-5 fw-bold mb-3 gradient-text">Conversion Rate Calculator</h1>
                <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                    Measure your marketing efficiency with precision. Calculate Conversion Rates, CPA, and ROI to optimize your campaigns for maximum profit.
                </p>
            </div>

            <div className="row g-4">
                {/* Inputs Section */}
                <div className="col-lg-5">
                    <Card className="premium-card border-0 shadow-lg h-100">
                        <Card.Body className="p-4 p-md-5">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary">
                                    <FaCalculator size={24} />
                                </div>
                                <div>
                                    <h2 className="h4 fw-bold mb-1">Campaign Data</h2>
                                    <p className="text-muted mb-0 small">Enter your metrics</p>
                                </div>
                            </div>

                            <Form>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase d-flex align-items-center gap-2">
                                        <FaUsers className="text-primary" /> Total Visitors / Clicks
                                    </Form.Label>
                                    <Form.Control 
                                        type="number"
                                        name="visitors"
                                        placeholder="e.g. 10000"
                                        value={data.visitors}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase d-flex align-items-center gap-2">
                                        <FaMousePointer className="text-success" /> Total Conversions / Sales
                                    </Form.Label>
                                    <Form.Control 
                                        type="number"
                                        name="conversions"
                                        placeholder="e.g. 250"
                                        value={data.conversions}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase d-flex align-items-center gap-2">
                                        <FaDollarSign className="text-danger" /> Total Ad Spend / Cost
                                    </Form.Label>
                                    <Form.Control 
                                        type="number"
                                        name="adSpend"
                                        placeholder="e.g. 5000"
                                        value={data.adSpend}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-5">
                                    <Form.Label className="fw-bold text-dark small text-uppercase d-flex align-items-center gap-2">
                                        <FaDollarSign className="text-warning" /> Revenue Per Conversion
                                    </Form.Label>
                                    <Form.Control 
                                        type="number"
                                        name="revenuePerConversion"
                                        placeholder="e.g. 45"
                                        value={data.revenuePerConversion}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <div className="d-flex gap-3">
                                    <Button 
                                        className="btn-premium flex-grow-1 py-3 d-flex align-items-center justify-content-center gap-2"
                                        onClick={calculateMetrics}
                                    >
                                        <FaCalculator /> Calculate Results
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
                    <div className="h-100 d-flex flex-column gap-4">
                        {/* Main CR Result */}
                        <Card className="premium-card border-0 shadow-lg text-center bg-gradient-primary text-white">
                            <Card.Body className="p-4 p-md-5">
                                <div className="display-3 fw-bold mb-0">{results.conversionRate}%</div>
                                <div className="h5 mb-0 opacity-75">Conversion Rate</div>
                                <div className="mt-3">
                                    <span className="badge bg-white bg-opacity-20 rounded-pill px-3 py-2">
                                        {results.conversionRate > 2 ? 'Excellent Performance' : 'Room for Improvement'}
                                    </span>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Metrics Grid */}
                        <Row className="g-4 flex-grow-1">
                            <Col md={6}>
                                <Card className="premium-card border-0 shadow-lg h-100 bg-white">
                                    <Card.Body className="p-4 text-center">
                                        <div className="p-3 rounded-circle bg-danger bg-opacity-10 text-danger mx-auto mb-3" style={{ width: 'fit-content' }}>
                                            <FaDollarSign size={20} />
                                        </div>
                                        <div className="h3 fw-bold mb-1">${results.cpa}</div>
                                        <div className="text-muted small uppercase fw-bold">Cost Per Acquisition (CPA)</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="premium-card border-0 shadow-lg h-100 bg-white">
                                    <Card.Body className="p-4 text-center">
                                        <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success mx-auto mb-3" style={{ width: 'fit-content' }}>
                                            <FaArrowTrendUp size={20} />
                                        </div>
                                        <div className="h3 fw-bold mb-1">{results.roi}%</div>
                                        <div className="text-muted small uppercase fw-bold">Return on Investment (ROI)</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="premium-card border-0 shadow-lg h-100 bg-white">
                                    <Card.Body className="p-4 text-center">
                                        <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning mx-auto mb-3" style={{ width: 'fit-content' }}>
                                            <FaDollarSign size={20} />
                                        </div>
                                        <div className="h3 fw-bold mb-1">${results.totalRevenue}</div>
                                        <div className="text-muted small uppercase fw-bold">Total Revenue</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="premium-card border-0 shadow-lg h-100 bg-white">
                                    <Card.Body className="p-4 text-center">
                                        <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary mx-auto mb-3" style={{ width: 'fit-content' }}>
                                            <FaChartLine size={20} />
                                        </div>
                                        <div className={`h3 fw-bold mb-1 ${results.profit < 0 ? 'text-danger' : 'text-primary'}`}>
                                            ${results.profit}
                                        </div>
                                        <div className="text-muted small uppercase fw-bold">Net Profit / Loss</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>

            {/* Educational Section */}
            <div className="mt-5 p-4 glass-panel rounded-4 border border-white">
                <h5 className="h6 fw-bold text-dark d-flex align-items-center gap-2 mb-4">
                    <FaRegLightbulb className="text-warning" /> Understanding Your Results
                </h5>
                <Row className="g-4">
                    <Col md={4}>
                        <div className="d-flex gap-3">
                            <div className="text-primary"><FaInfoCircle /></div>
                            <div>
                                <div className="fw-bold small mb-1">CPA (Cost Per Acquisition)</div>
                                <p className="extra-small text-muted mb-0">The average amount you pay to get one customer. Ideally, this should be lower than your Average Order Value (AOV).</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="d-flex gap-3">
                            <div className="text-success"><FaInfoCircle /></div>
                            <div>
                                <div className="fw-bold small mb-1">ROI (Return on Investment)</div>
                                <p className="extra-small text-muted mb-0">A measure of the profitability of your ad spend. A positive ROI means you're making money.</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="d-flex gap-3">
                            <div className="text-info"><FaInfoCircle /></div>
                            <div>
                                <div className="fw-bold small mb-1">Conversion Rate (CR)</div>
                                <p className="extra-small text-muted mb-0">The percentage of visitors who complete a desired action. Avg. ecommerce CR is around 1-3%.</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ConversionRateCalculator;
