import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { FaUndo, FaArrowUp, FaWallet, FaHandHoldingUsd, FaChartLine, FaInfoCircle } from 'react-icons/fa';
import './RoiCalculator.css';

const RoiCalculator = () => {
    const [initialCost, setInitialCost] = useState(10000);
    const [finalValue, setFinalValue] = useState(15000);

    const [results, setResults] = useState({
        roi: 0,
        profit: 0,
        multiple: 0
    });

    const calculateROI = () => {
        const IC = parseFloat(initialCost) || 0;
        const FV = parseFloat(finalValue) || 0;

        if (IC > 0) {
            const profit = FV - IC;
            const roi = (profit / IC) * 100;
            const multiple = FV / IC;

            setResults({
                roi: roi.toFixed(2),
                profit: profit.toFixed(2),
                multiple: multiple.toFixed(2)
            });
        } else {
            setResults({ roi: 0, profit: 0, multiple: 0 });
        }
    };

    useEffect(() => {
        calculateROI();
    }, [initialCost, finalValue]);

    const handleReset = () => {
        setInitialCost(10000);
        setFinalValue(15000);
    };

    return (
        <div className="roi-calculator-container">
            <div className="premium-card overflow-hidden">
                <Row className="g-0">
                    {/* Left Column: Inputs */}
                    <Col lg={7} className="input-section border-end border-light">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold mb-0 text-dark">Investment Stats</h4>
                            <button className="btn btn-link text-muted p-0 text-decoration-none small" onClick={handleReset}>
                                <FaUndo className="me-1" /> Reset
                            </button>
                        </div>

                        <Form>
                            <Form.Group className="mb-4">
                                <Form.Label className="form-label">Initial Investment (₹)</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    className="premium-input"
                                    value={initialCost}
                                    onChange={(e) => setInitialCost(e.target.value)}
                                    placeholder="Amount invested"
                                />
                                <Form.Text className="text-muted small">Total capital spent on this investment.</Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="form-label">Final Value (₹)</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    className="premium-input"
                                    value={finalValue}
                                    onChange={(e) => setFinalValue(e.target.value)}
                                    placeholder="Current/Final value"
                                />
                                <Form.Text className="text-muted small">Total amount returned or current market value.</Form.Text>
                            </Form.Group>
                        </Form>

                        <div className="formula-card shadow-sm border-0">
                            <div className="d-flex align-items-center gap-2 mb-2 text-dark fw-bold small">
                                <FaInfoCircle className="text-primary" /> ROI Formula
                            </div>
                            <div className="formula-text text-center py-2 bg-white rounded-3 border border-light">
                                ROI = ((Final Value - Cost) / Cost) × 100
                            </div>
                        </div>
                    </Col>

                    {/* Right Column: Results */}
                    <Col lg={5} className="result-section">
                        <div className="roi-display-card shadow-sm">
                            <div className="roi-label">Your ROI</div>
                            <div className="roi-value">{results.roi}%</div>
                            <div className="profit-badge">
                                <FaArrowUp size={12} /> Total Profit: ₹ {parseFloat(results.profit).toLocaleString()}
                            </div>
                        </div>

                        <div className="metrics-list">
                            <div className="metric-item shadow-sm">
                                <div className="metric-info">
                                    <div className="metric-icon text-primary"><FaWallet /></div>
                                    <span className="metric-label">Investment Multiple</span>
                                </div>
                                <span className="metric-value">{results.multiple}x</span>
                            </div>
                            <div className="metric-item shadow-sm">
                                <div className="metric-info">
                                    <div className="metric-icon text-success"><FaHandHoldingUsd /></div>
                                    <span className="metric-label">Final Value</span>
                                </div>
                                <span className="metric-value text-success">₹ {parseFloat(finalValue || 0).toLocaleString()}</span>
                            </div>
                            <div className="metric-item shadow-sm">
                                <div className="metric-info">
                                    <div className="metric-icon text-warning"><FaChartLine /></div>
                                    <span className="metric-label">Principal Paid</span>
                                </div>
                                <span className="metric-value">₹ {parseFloat(initialCost || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Why ROI Matters Section */}
            <div className="mt-5 pt-4">
                <h3 className="h4 fw-bold mb-4 text-dark">Investment Wisdom</h3>
                <Row className="g-4">
                    <Col md={6}>
                        <div className="p-4 bg-white rounded-4 border border-light h-100 shadow-sm transition-all hover-translate">
                            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-primary">
                                Relative Growth
                            </h6>
                            <p className="text-muted small mb-0">ROI is a universal metric that allows you to compare the efficiency of different investments, regardless of the initial amount spent. It tells you how hard your money is working for you.</p>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="p-4 bg-white rounded-4 border border-light h-100 shadow-sm transition-all hover-translate">
                            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-success">
                                Net Gains
                            </h6>
                            <p className="text-muted small mb-0">While percentage is important, always keep an eye on the absolute profit. A high ROI on a tiny investment might return less cash than a moderate ROI on a larger one.</p>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default RoiCalculator;
