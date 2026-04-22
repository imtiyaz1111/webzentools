import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { FaUndo, FaChartBar, FaMoneyBillWave, FaLightbulb } from 'react-icons/fa';
import './ProfitMarginCalculator.css';
import { MoveUp } from 'lucide-react';

const ProfitMarginCalculator = () => {
    const [cost, setCost] = useState(100);
    const [revenue, setRevenue] = useState(150);

    const [results, setResults] = useState({
        grossProfit: 0,
        profitMargin: 0,
        markup: 0
    });

    const calculateProfit = () => {
        const C = parseFloat(cost) || 0;
        const R = parseFloat(revenue) || 0;

        if (R > 0) {
            const grossProfit = R - C;
            const profitMargin = (grossProfit / R) * 100;
            const markup = C > 0 ? (grossProfit / C) * 100 : 0;

            setResults({
                grossProfit: grossProfit.toFixed(2),
                profitMargin: profitMargin.toFixed(2),
                markup: markup.toFixed(2)
            });
        } else {
            setResults({ grossProfit: 0, profitMargin: 0, markup: 0 });
        }
    };

    useEffect(() => {
        calculateProfit();
    }, [cost, revenue]);

    const handleReset = () => {
        setCost(100);
        setRevenue(150);
    };

    return (
        <div className="profit-margin-container">
            <div className="premium-card overflow-hidden">
                <Row className="g-0">
                    {/* Left Column: Inputs */}
                    <Col lg={7} className="input-section border-end border-light">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold mb-0 text-dark">Price Details</h4>
                            <button className="btn btn-link text-muted p-0 text-decoration-none small" onClick={handleReset}>
                                <FaUndo className="me-1" /> Reset
                            </button>
                        </div>

                        <Form>
                            <Form.Group className="mb-4">
                                <Form.Label className="form-label">Cost of Item (₹)</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    className="premium-input"
                                    value={cost}
                                    onChange={(e) => setCost(e.target.value)}
                                    placeholder="Enter cost price"
                                />
                                <Form.Text className="text-muted small">The price you paid for the item.</Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="form-label">Selling Price (₹)</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    className="premium-input"
                                    value={revenue}
                                    onChange={(e) => setRevenue(e.target.value)}
                                    placeholder="Enter selling price"
                                />
                                <Form.Text className="text-muted small">The price you sell the item for.</Form.Text>
                            </Form.Group>
                        </Form>

                        <div className="mt-5 p-4 bg-light rounded-4 d-flex gap-3 align-items-start border border-white">
                            <div className="p-2 bg-white rounded-3 text-primary shadow-sm">
                                <FaLightbulb />
                            </div>
                            <div>
                                <h6 className="fw-bold text-dark mb-1">Business Tip</h6>
                                <p className="text-muted small mb-0">
                                    Aiming for a healthy profit margin ensures your business remains sustainable and can cover operating expenses beyond just the cost of goods.
                                </p>
                            </div>
                        </div>
                    </Col>

                    {/* Right Column: Results */}
                    <Col lg={5} className="result-section">
                        <div className="main-result-card shadow-sm">
                            <div className="main-result-label">Gross Profit</div>
                            <div className="main-result-value">₹ {parseFloat(results.grossProfit).toLocaleString()}</div>
                        </div>

                        <div className="secondary-results mb-4">
                            <div className="secondary-card">
                                <div className="secondary-label">Profit Margin</div>
                                <div className="secondary-value success">{results.profitMargin}%</div>
                            </div>
                            <div className="secondary-card">
                                <div className="secondary-label">Markup</div>
                                <div className="secondary-value info">{results.markup}%</div>
                            </div>
                        </div>

                        <div className="breakdown-list px-2">
                            <div className="info-item">
                                <span className="info-label d-flex align-items-center gap-2">
                                    <FaMoneyBillWave className="text-success" /> Revenue
                                </span>
                                <span className="info-value">₹ {parseFloat(revenue || 0).toLocaleString()}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label d-flex align-items-center gap-2">
                                    <FaChartBar className="text-danger" /> Cost
                                </span>
                                <span className="info-value">₹ {parseFloat(cost || 0).toLocaleString()}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label d-flex align-items-center gap-2">
                                    <MoveUp className="text-primary" /> Return on Investment
                                </span>
                                <span className="info-value">{results.markup}%</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Definitions Section */}
            <div className="mt-5 pt-4">
                <h3 className="h4 fw-bold mb-4 text-dark">Key Financial Terms</h3>
                <div className="row g-4">
                    <Col md={6}>
                        <div className="p-4 bg-white rounded-4 border border-light h-100 shadow-sm">
                            <h6 className="fw-bold text-dark">Profit Margin vs Markup</h6>
                            <p className="text-muted small">
                                <strong>Profit Margin</strong> is the percentage of the selling price that is profit. 
                                <strong>Markup</strong> is the percentage of the cost price that is added to reach the selling price.
                            </p>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="p-4 bg-white rounded-4 border border-light h-100 shadow-sm">
                            <h6 className="fw-bold text-dark">Why it matters?</h6>
                            <p className="text-muted small">
                                Tracking these metrics helps you set the right prices, manage costs, and understand the overall financial health of your products or services.
                            </p>
                        </div>
                    </Col>
                </div>
            </div>
        </div>
    );
};

export default ProfitMarginCalculator;
