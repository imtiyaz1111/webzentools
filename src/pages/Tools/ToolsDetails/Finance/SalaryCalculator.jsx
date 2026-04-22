import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { FaUndo, FaClock, FaCalendarDay, FaCalendarWeek, FaCalendarAlt, FaBriefcase } from 'react-icons/fa';
import './SalaryCalculator.css';

const SalaryCalculator = () => {
    const [amount, setAmount] = useState(50000);
    const [period, setPeriod] = useState('yearly');
    const [hoursPerWeek, setHoursPerWeek] = useState(40);
    const [daysPerWeek, setDaysPerWeek] = useState(5);

    const [results, setResults] = useState({
        hourly: 0,
        daily: 0,
        weekly: 0,
        biweekly: 0,
        monthly: 0,
        yearly: 0
    });

    const calculateSalary = () => {
        let yearlySalary = 0;
        const val = parseFloat(amount) || 0;

        switch (period) {
            case 'hourly':
                yearlySalary = val * hoursPerWeek * 52;
                break;
            case 'daily':
                yearlySalary = val * daysPerWeek * 52;
                break;
            case 'weekly':
                yearlySalary = val * 52;
                break;
            case 'biweekly':
                yearlySalary = val * 26;
                break;
            case 'monthly':
                yearlySalary = val * 12;
                break;
            case 'yearly':
                yearlySalary = val;
                break;
            default:
                yearlySalary = val;
        }

        setResults({
            hourly: yearlySalary / (52 * hoursPerWeek),
            daily: yearlySalary / (52 * daysPerWeek),
            weekly: yearlySalary / 52,
            biweekly: yearlySalary / 26,
            monthly: yearlySalary / 12,
            yearly: yearlySalary
        });
    };

    useEffect(() => {
        calculateSalary();
    }, [amount, period, hoursPerWeek, daysPerWeek]);

    const handleReset = () => {
        setAmount(50000);
        setPeriod('yearly');
        setHoursPerWeek(40);
        setDaysPerWeek(5);
    };

    return (
        <div className="salary-calculator-container">
            <div className="premium-card overflow-hidden">
                <div className="input-section border-bottom border-light">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="fw-bold mb-0 text-dark">Salary Configuration</h4>
                        <button className="btn btn-link text-muted p-0 text-decoration-none small" onClick={handleReset}>
                            <FaUndo className="me-1" /> Reset
                        </button>
                    </div>

                    <Form>
                        <Row className="g-4">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="form-label">Salary Amount (₹)</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        className="premium-input"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Enter amount"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="form-label">Pay Period</Form.Label>
                                    <Form.Select 
                                        className="premium-select"
                                        value={period}
                                        onChange={(e) => setPeriod(e.target.value)}
                                    >
                                        <option value="hourly">Hourly</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="biweekly">Bi-Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="form-label">Hours Per Week</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        className="premium-input"
                                        value={hoursPerWeek}
                                        onChange={(e) => setHoursPerWeek(e.target.value)}
                                        min={1}
                                        max={168}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="form-label">Days Per Week</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        className="premium-input"
                                        value={daysPerWeek}
                                        onChange={(e) => setDaysPerWeek(e.target.value)}
                                        min={1}
                                        max={7}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </div>

                <div className="result-section">
                    <h5 className="fw-bold text-dark mb-4 d-flex align-items-center">
                        <FaBriefcase className="me-2 text-primary" /> Salary Breakdown
                    </h5>
                    
                    <div className="salary-results-grid">
                        <div className="salary-card shadow-sm">
                            <div className="salary-label">Hourly</div>
                            <div className="salary-value">₹ {results.hourly.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                            <FaClock className="mt-2 text-muted opacity-25" />
                        </div>
                        <div className="salary-card shadow-sm">
                            <div className="salary-label">Daily</div>
                            <div className="salary-value">₹ {results.daily.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                            <FaCalendarDay className="mt-2 text-muted opacity-25" />
                        </div>
                        <div className="salary-card shadow-sm">
                            <div className="salary-label">Weekly</div>
                            <div className="salary-value">₹ {results.weekly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                            <FaCalendarWeek className="mt-2 text-muted opacity-25" />
                        </div>
                        <div className="salary-card shadow-sm">
                            <div className="salary-label">Monthly</div>
                            <div className="salary-value">₹ {results.monthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                            <FaCalendarAlt className="mt-2 text-muted opacity-25" />
                        </div>
                        <div className="salary-card shadow-sm border-primary border-opacity-25" style={{ background: 'rgba(99, 102, 241, 0.05)' }}>
                            <div className="salary-label text-primary">Yearly Salary</div>
                            <div className="salary-value main">₹ {results.yearly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        </div>
                    </div>

                    <div className="mt-5 info-banner d-flex align-items-start gap-3">
                        <div className="p-2 bg-white rounded-3 shadow-sm text-primary">
                            <FaBriefcase />
                        </div>
                        <p className="mb-0">
                            <strong>Note:</strong> These calculations are based on a standard work year of 52 weeks. Actual payouts may vary depending on taxes, benefits, and company-specific payroll policies.
                        </p>
                    </div>
                </div>
            </div>

            {/* Additional Info Section */}
            <div className="mt-5 pt-4">
                <h3 className="h4 fw-bold mb-4 text-dark">Salary Calculation Logic</h3>
                <Row className="g-4">
                    <Col md={6}>
                        <div className="p-4 bg-white rounded-4 border border-light h-100 shadow-sm">
                            <h6 className="fw-bold mb-2">Hourly to Yearly</h6>
                            <p className="text-muted small mb-0">We multiply your hourly rate by the number of hours worked per week, then by 52 weeks in a year.</p>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="p-4 bg-white rounded-4 border border-light h-100 shadow-sm">
                            <h6 className="fw-bold mb-2">Yearly to Monthly</h6>
                            <p className="text-muted small mb-0">Your total annual compensation is divided by 12 equal months to determine your gross monthly pay.</p>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default SalaryCalculator;
