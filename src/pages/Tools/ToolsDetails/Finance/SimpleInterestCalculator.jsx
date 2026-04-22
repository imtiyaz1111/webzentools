import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { FaUndo, FaPercentage, FaClock, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import './SimpleInterestCalculator.css';

const SimpleInterestCalculator = () => {
    const [principal, setPrincipal] = useState(10000);
    const [rate, setRate] = useState(5);
    const [time, setTime] = useState(1);
    const [timeUnit, setTimeUnit] = useState('years'); // years, months, days

    const [results, setResults] = useState({
        interest: 0,
        totalAmount: 0,
        principalPercent: 0,
        interestPercent: 0
    });

    const calculateSI = () => {
        const P = parseFloat(principal) || 0;
        const R = parseFloat(rate) || 0;
        let T = parseFloat(time) || 0;

        // Convert time to years
        let timeInYears = T;
        if (timeUnit === 'months') timeInYears = T / 12;
        else if (timeUnit === 'days') timeInYears = T / 365;

        if (P >= 0 && R >= 0 && T >= 0) {
            const interest = (P * R * timeInYears) / 100;
            const totalAmount = P + interest;

            setResults({
                interest: Math.round(interest),
                totalAmount: Math.round(totalAmount),
                principalPercent: totalAmount > 0 ? (P / totalAmount) * 100 : 100,
                interestPercent: totalAmount > 0 ? (interest / totalAmount) * 100 : 0
            });
        }
    };

    useEffect(() => {
        calculateSI();
    }, [principal, rate, time, timeUnit]);

    const handleReset = () => {
        setPrincipal(10000);
        setRate(5);
        setTime(1);
        setTimeUnit('years');
    };

    // Donut Chart logic
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const interestOffset = circumference - (results.interestPercent / 100) * circumference;

    return (
        <div className="simple-interest-container">
            <div className="premium-card overflow-hidden">
                <Row className="g-0">
                    {/* Left Column: Inputs */}
                    <Col lg={7} className="input-section border-end border-light">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold mb-0 text-dark">Interest Configuration</h4>
                            <button className="btn btn-link text-muted p-0 text-decoration-none small" onClick={handleReset}>
                                <FaUndo className="me-1" /> Reset
                            </button>
                        </div>

                        <Form>
                            <Form.Group className="mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <Form.Label className="form-label mb-0">Principal Amount (₹)</Form.Label>
                                    <span className="value-display">₹ {principal.toLocaleString()}</span>
                                </div>
                                <input 
                                    type="range" 
                                    className="custom-range"
                                    min={1000} 
                                    max={1000000} 
                                    step={1000} 
                                    value={principal}
                                    onChange={(e) => setPrincipal(Number(e.target.value))}
                                />
                                <div className="d-flex justify-content-between small text-muted">
                                    <span>₹1k</span>
                                    <span>₹10L</span>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <Form.Label className="form-label mb-0">Interest Rate (% p.a)</Form.Label>
                                    <span className="value-display">{rate}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    className="custom-range"
                                    min={0.1} 
                                    max={50} 
                                    step={0.1} 
                                    value={rate}
                                    onChange={(e) => setRate(Number(e.target.value))}
                                />
                                <div className="d-flex justify-content-between small text-muted">
                                    <span>0.1%</span>
                                    <span>50%</span>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <Form.Label className="form-label mb-0">Time Period ({timeUnit})</Form.Label>
                                    <span className="value-display">{time}</span>
                                </div>
                                <input 
                                    type="range" 
                                    className="custom-range"
                                    min={1} 
                                    max={timeUnit === 'years' ? 30 : timeUnit === 'months' ? 360 : 3650} 
                                    step={1} 
                                    value={time}
                                    onChange={(e) => setTime(Number(e.target.value))}
                                />
                                <div className="mt-3 d-flex gap-2">
                                    {['years', 'months', 'days'].map(unit => (
                                        <button 
                                            key={unit}
                                            type="button"
                                            className={`btn btn-sm rounded-pill px-3 ${timeUnit === unit ? 'btn-warning text-white' : 'btn-outline-secondary opacity-50'}`}
                                            onClick={() => {
                                                setTimeUnit(unit);
                                                setTime(1);
                                            }}
                                        >
                                            {unit.charAt(0).toUpperCase() + unit.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </Form.Group>
                        </Form>

                        <div className="mt-4 p-3 bg-light rounded-4 d-flex gap-3 align-items-start">
                            <FaInfoCircle className="text-warning mt-1" />
                            <p className="small text-muted mb-0">
                                Simple Interest is calculated only on the principal amount of a loan or deposit. Unlike compound interest, it does not factor in interest earned over previous periods.
                            </p>
                        </div>
                    </Col>

                    {/* Right Column: Results & Chart */}
                    <Col lg={5} className="result-section">
                        <div className="chart-container">
                            <svg className="donut-chart" width="200" height="200" viewBox="0 0 200 200">
                                {/* Principal Circle */}
                                <circle 
                                    cx="100" cy="100" r={radius} 
                                    fill="transparent" 
                                    stroke="#e2e8f0" 
                                    strokeWidth="20"
                                />
                                {/* Interest Circle (Overlay) */}
                                <circle 
                                    cx="100" cy="100" r={radius} 
                                    fill="transparent" 
                                    stroke="#f59e0b" 
                                    strokeWidth="20"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={interestOffset}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="chart-text">
                                <span className="chart-label">Total Amount</span>
                                <span className="chart-value">₹{results.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-card shadow-sm">
                                <div className="stat-label">Principal Amount</div>
                                <div className="stat-value">₹ {principal.toLocaleString()}</div>
                            </div>
                            <div className="stat-card shadow-sm">
                                <div className="stat-label">Total Interest</div>
                                <div className="stat-value accent">₹ {results.interest.toLocaleString()}</div>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-top border-warning border-opacity-10 d-flex gap-4 justify-content-center">
                            <div className="legend-item">
                                <div className="legend-dot" style={{ background: '#e2e8f0' }}></div>
                                <span>Principal</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-dot" style={{ background: '#f59e0b' }}></div>
                                <span>Interest</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Quick Summary Cards */}
            <div className="row g-4 mt-5">
                <Col md={4}>
                    <div className="p-4 bg-white rounded-4 border border-light h-100 shadow-sm text-center">
                        <div className="text-warning mb-3"><FaPercentage size={24} /></div>
                        <h6 className="fw-bold">Fixed Growth</h6>
                        <p className="text-muted small mb-0">Unlike compound interest, simple interest grows linearly, making it easy to predict future earnings.</p>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="p-4 bg-white rounded-4 border border-light h-100 shadow-sm text-center">
                        <div className="text-warning mb-3"><FaClock size={24} /></div>
                        <h6 className="fw-bold">Time Flexibilty</h6>
                        <p className="text-muted small mb-0">Calculate interest for any duration—whether it's just a few days or several decades.</p>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="p-4 bg-white rounded-4 border border-light h-100 shadow-sm text-center">
                        <div className="text-warning mb-3"><FaCalendarAlt size={24} /></div>
                        <h6 className="fw-bold">Financial Clarity</h6>
                        <p className="text-muted small mb-0">Perfect for calculating interest on short-term loans, savings accounts, or personal debts.</p>
                    </div>
                </Col>
            </div>
        </div>
    );
};

export default SimpleInterestCalculator;
