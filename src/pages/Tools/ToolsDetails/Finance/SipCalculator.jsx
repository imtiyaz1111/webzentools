import React, { useState, useMemo } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { FaUndo, FaChartPie, FaCoins, FaArrowUp, FaInfoCircle } from 'react-icons/fa';
import './SipCalculator.css';

const SipCalculator = () => {
    const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
    const [returnRate, setReturnRate] = useState(12);
    const [timePeriod, setTimePeriod] = useState(10);

    const results = useMemo(() => {
        const P = monthlyInvestment;
        const i = returnRate / 12 / 100;
        const n = timePeriod * 12;

        if (P > 0 && i > 0 && n > 0) {
            const totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
            const totalInvestment = P * n;
            const estimatedReturns = totalValue - totalInvestment;

            return {
                totalInvestment: Math.round(totalInvestment),
                estimatedReturns: Math.round(estimatedReturns),
                totalValue: Math.round(totalValue),
                investedPercent: (totalInvestment / totalValue) * 100,
                returnsPercent: (estimatedReturns / totalValue) * 100
            };
        }
        return {
            totalInvestment: 0,
            estimatedReturns: 0,
            totalValue: 0,
            investedPercent: 0,
            returnsPercent: 0
        };
    }, [monthlyInvestment, returnRate, timePeriod]);

    const handleReset = () => {
        setMonthlyInvestment(5000);
        setReturnRate(12);
        setTimePeriod(10);
    };

    // Donut Chart logic
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const returnsOffset = circumference - (results.returnsPercent / 100) * circumference;

    return (
        <div className="sip-calculator-container">
            <div className="premium-card overflow-hidden">
                <Row className="g-0">
                    {/* Left Column: Inputs */}
                    <Col lg={7} className="input-section border-end border-light">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold mb-0 text-dark">Investment Details</h4>
                            <button className="btn btn-link text-muted p-0 text-decoration-none small" onClick={handleReset}>
                                <FaUndo className="me-1" /> Reset
                            </button>
                        </div>

                        <Form>
                            <Form.Group className="mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <Form.Label className="form-label mb-0">Monthly Investment</Form.Label>
                                    <span className="value-display">₹ {monthlyInvestment.toLocaleString()}</span>
                                </div>
                                <input 
                                    type="range" 
                                    className="custom-range"
                                    min={500} 
                                    max={100000} 
                                    step={500} 
                                    value={monthlyInvestment}
                                    onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                                />
                                <div className="d-flex justify-content-between small text-muted">
                                    <span>₹500</span>
                                    <span>₹1L</span>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <Form.Label className="form-label mb-0">Expected Return Rate (p.a)</Form.Label>
                                    <span className="value-display">{returnRate}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    className="custom-range"
                                    min={1} 
                                    max={30} 
                                    step={0.1} 
                                    value={returnRate}
                                    onChange={(e) => setReturnRate(Number(e.target.value))}
                                />
                                <div className="d-flex justify-content-between small text-muted">
                                    <span>1%</span>
                                    <span>30%</span>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <Form.Label className="form-label mb-0">Time Period</Form.Label>
                                    <span className="value-display">{timePeriod} Years</span>
                                </div>
                                <input 
                                    type="range" 
                                    className="custom-range"
                                    min={1} 
                                    max={40} 
                                    step={1} 
                                    value={timePeriod}
                                    onChange={(e) => setTimePeriod(Number(e.target.value))}
                                />
                                <div className="d-flex justify-content-between small text-muted">
                                    <span>1 Yr</span>
                                    <span>40 Yrs</span>
                                </div>
                            </Form.Group>
                        </Form>

                        <div className="mt-4 p-3 bg-light rounded-4 d-flex gap-3 align-items-start border border-white">
                            <FaInfoCircle className="text-primary mt-1" />
                            <p className="small text-muted mb-0">
                                SIP or Systematic Investment Plan allows you to invest small amounts regularly in mutual funds. Compounding helps your money grow significantly over long periods.
                            </p>
                        </div>
                    </Col>

                    {/* Right Column: Results & Chart */}
                    <Col lg={5} className="result-section">
                        <div className="chart-container">
                            <svg className="donut-chart" width="200" height="200" viewBox="0 0 200 200">
                                {/* Invested Circle */}
                                <circle 
                                    cx="100" cy="100" r={radius} 
                                    fill="transparent" 
                                    stroke="#10b981" 
                                    strokeWidth="20"
                                />
                                {/* Returns Circle (Overlay) */}
                                <circle 
                                    cx="100" cy="100" r={radius} 
                                    fill="transparent" 
                                    stroke="#38bdf8" 
                                    strokeWidth="20"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={returnsOffset}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="chart-text">
                                <span className="chart-label">Total Value</span>
                                <span className="chart-value">₹{results.totalValue.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-card shadow-sm">
                                <div className="stat-label">Invested Amount</div>
                                <div className="stat-value text-dark">₹ {results.totalInvestment.toLocaleString()}</div>
                            </div>
                            <div className="stat-card shadow-sm">
                                <div className="stat-label">Estimated Returns</div>
                                <div className="stat-value text-primary">₹ {results.estimatedReturns.toLocaleString()}</div>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-top border-dark border-opacity-10 d-flex gap-4 justify-content-center">
                            <div className="legend-item">
                                <div className="legend-dot" style={{ background: '#10b981' }}></div>
                                <span>Invested</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-dot" style={{ background: '#38bdf8' }}></div>
                                <span>Returns</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Why SIP Section */}
            <div className="mt-5 pt-4">
                <h3 className="h4 fw-bold mb-4 text-dark">Power of Compounding</h3>
                <div className="row g-4">
                    <Col md={4}>
                        <div className="p-4 bg-white rounded-4 border border-light h-100 shadow-sm transition-all hover-translate">
                            <div className="p-3 bg-primary bg-opacity-10 rounded-3 text-primary d-inline-block mb-3">
                                <FaCoins size={20} />
                            </div>
                            <h6 className="fw-bold text-dark">Regular Savings</h6>
                            <p className="text-muted small mb-0">Build a habit of saving small amounts every month without feeling the pinch on your lifestyle.</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="p-4 bg-white rounded-4 border border-light h-100 shadow-sm transition-all hover-translate">
                            <div className="p-3 bg-success bg-opacity-10 rounded-3 text-success d-inline-block mb-3">
                                <FaArrowUp size={20} />
                            </div>
                            <h6 className="fw-bold text-dark">Wealth Creation</h6>
                            <p className="text-muted small mb-0">Even small monthly investments can grow into a substantial corpus over 15-20 years due to compounding.</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="p-4 bg-white rounded-4 border border-light h-100 shadow-sm transition-all hover-translate">
                            <div className="p-3 bg-info bg-opacity-10 rounded-3 text-info d-inline-block mb-3">
                                <FaChartPie size={20} />
                            </div>
                            <h6 className="fw-bold text-dark">Diversification</h6>
                            <p className="text-muted small mb-0">SIPs allow you to spread your investments over time, reducing the impact of market volatility.</p>
                        </div>
                    </Col>
                </div>
            </div>
        </div>
    );
};

export default SipCalculator;
