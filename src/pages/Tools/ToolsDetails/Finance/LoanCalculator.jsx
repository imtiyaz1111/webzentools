import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { FaUndo, FaFileInvoiceDollar, FaCalendarAlt, FaPercentage, FaWallet } from 'react-icons/fa';
import './LoanCalculator.css';

const LoanCalculator = () => {
    const [loanAmount, setLoanAmount] = useState(1000000);
    const [interestRate, setInterestRate] = useState(8.5);
    const [loanTenure, setLoanTenure] = useState(15);
    const [tenureType, setTenureType] = useState('years'); // 'years' or 'months'

    // Calculated states
    const [results, setResults] = useState({
        emi: 0,
        totalInterest: 0,
        totalPayment: 0,
        principalPercent: 0,
        interestPercent: 0
    });

    const calculateLoan = () => {
        const P = loanAmount;
        const R = interestRate / 12 / 100;
        const N = tenureType === 'years' ? loanTenure * 12 : loanTenure;

        if (P > 0 && R > 0 && N > 0) {
            const emiValue = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
            const totalPayable = emiValue * N;
            const totalInt = totalPayable - P;

            setResults({
                emi: Math.round(emiValue),
                totalInterest: Math.round(totalInt),
                totalPayment: Math.round(totalPayable),
                principalPercent: (P / totalPayable) * 100,
                interestPercent: (totalInt / totalPayable) * 100
            });
        }
    };

    useEffect(() => {
        calculateLoan();
    }, [loanAmount, interestRate, loanTenure, tenureType]);

    const handleReset = () => {
        setLoanAmount(1000000);
        setInterestRate(8.5);
        setLoanTenure(15);
        setTenureType('years');
    };

    // Generate yearly breakdown
    const yearlyBreakdown = useMemo(() => {
        const breakdown = [];
        let balance = loanAmount;
        const R = interestRate / 12 / 100;
        const N = tenureType === 'years' ? loanTenure * 12 : loanTenure;
        const emi = results.emi;

        if (emi === 0) return [];

        for (let i = 1; i <= Math.ceil(N / 12); i++) {
            let yearlyInterest = 0;
            let yearlyPrincipal = 0;
            
            for (let m = 1; m <= 12; m++) {
                if (balance <= 0) break;
                const interest = balance * R;
                const principal = emi - interest;
                yearlyInterest += interest;
                yearlyPrincipal += principal;
                balance -= principal;
            }

            breakdown.push({
                year: i,
                principal: Math.round(yearlyPrincipal),
                interest: Math.round(yearlyInterest),
                balance: Math.max(0, Math.round(balance))
            });
        }
        return breakdown;
    }, [loanAmount, interestRate, loanTenure, tenureType, results.emi]);

    // Donut Chart logic
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const interestOffset = circumference - (results.interestPercent / 100) * circumference;

    return (
        <div className="loan-calculator-container">
            <div className="premium-card overflow-hidden">
                <Row className="g-0">
                    {/* Left Column: Inputs */}
                    <Col lg={7} className="input-section border-end border-light">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold mb-0 text-dark">Loan Details</h4>
                            <button className="btn btn-link text-muted p-0 text-decoration-none small" onClick={handleReset}>
                                <FaUndo className="me-1" /> Reset
                            </button>
                        </div>

                        <Form>
                            {/* Loan Amount */}
                            <Form.Group className="mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <Form.Label className="form-label mb-0">Loan Amount</Form.Label>
                                    <span className="value-display">₹ {loanAmount.toLocaleString()}</span>
                                </div>
                                <input 
                                    type="range" 
                                    className="custom-range"
                                    min={50000} 
                                    max={10000000} 
                                    step={10000} 
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                                />
                                <div className="d-flex justify-content-between small text-muted">
                                    <span>50k</span>
                                    <span>1 Cr</span>
                                </div>
                            </Form.Group>

                            {/* Interest Rate */}
                            <Form.Group className="mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <Form.Label className="form-label mb-0">Interest Rate (% P.A.)</Form.Label>
                                    <span className="value-display">{interestRate}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    className="custom-range"
                                    min={1} 
                                    max={30} 
                                    step={0.1} 
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(Number(e.target.value))}
                                />
                                <div className="d-flex justify-content-between small text-muted">
                                    <span>1%</span>
                                    <span>30%</span>
                                </div>
                            </Form.Group>

                            {/* Tenure */}
                            <Form.Group className="mb-2">
                                <div className="d-flex justify-content-between align-items-center">
                                    <Form.Label className="form-label mb-0">Loan Tenure</Form.Label>
                                    <span className="value-display">{loanTenure} {tenureType}</span>
                                </div>
                                <input 
                                    type="range" 
                                    className="custom-range"
                                    min={1} 
                                    max={tenureType === 'years' ? 30 : 360} 
                                    step={1} 
                                    value={loanTenure}
                                    onChange={(e) => setLoanTenure(Number(e.target.value))}
                                />
                            </Form.Group>

                            <div className="tenure-toggle">
                                <button 
                                    type="button"
                                    className={`toggle-btn ${tenureType === 'years' ? 'active' : ''}`}
                                    onClick={() => {
                                        if (tenureType === 'months') setLoanTenure(Math.round(loanTenure / 12));
                                        setTenureType('years');
                                    }}
                                >
                                    Years
                                </button>
                                <button 
                                    type="button"
                                    className={`toggle-btn ${tenureType === 'months' ? 'active' : ''}`}
                                    onClick={() => {
                                        if (tenureType === 'years') setLoanTenure(loanTenure * 12);
                                        setTenureType('months');
                                    }}
                                >
                                    Months
                                </button>
                            </div>
                        </Form>
                    </Col>

                    {/* Right Column: Results & Chart */}
                    <Col lg={5} className="result-section">
                        <div className="chart-container">
                            <svg className="donut-chart" width="200" height="200" viewBox="0 0 200 200">
                                {/* Principal Circle */}
                                <circle 
                                    cx="100" cy="100" r={radius} 
                                    fill="transparent" 
                                    stroke="#2563eb" 
                                    strokeWidth="20"
                                />
                                {/* Interest Circle (Overlay) */}
                                <circle 
                                    cx="100" cy="100" r={radius} 
                                    fill="transparent" 
                                    stroke="#38bdf8" 
                                    strokeWidth="20"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={interestOffset}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="chart-text">
                                <span className="chart-label">Monthly EMI</span>
                                <span className="chart-value">₹{results.emi.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-label">Total Interest</div>
                                <div className="stat-value secondary">₹ {results.totalInterest.toLocaleString()}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Total Payment</div>
                                <div className="stat-value accent">₹ {results.totalPayment.toLocaleString()}</div>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-top border-light d-flex gap-4 justify-content-center">
                            <div className="d-flex align-items-center gap-2">
                                <div style={{ width: '12px', height: '12px', background: '#2563eb', borderRadius: '3px' }}></div>
                                <span className="small text-muted">Principal</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <div style={{ width: '12px', height: '12px', background: '#38bdf8', borderRadius: '3px' }}></div>
                                <span className="small text-muted">Interest</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Repayment Schedule Section */}
            <div className="mt-5">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="p-3 bg-primary bg-opacity-10 rounded-4 text-primary">
                        <FaFileInvoiceDollar size={24} />
                    </div>
                    <div>
                        <h4 className="fw-bold mb-1 text-dark">Repayment Schedule</h4>
                        <p className="text-muted small mb-0">Year-on-year breakdown of your loan payment</p>
                    </div>
                </div>

                <div className="schedule-table-wrapper">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Principal Paid</th>
                                <th>Interest Paid</th>
                                <th>Balance Remaining</th>
                            </tr>
                        </thead>
                        <tbody>
                            {yearlyBreakdown.map((row) => (
                                <tr key={row.year}>
                                    <td className="fw-bold">Year {row.year}</td>
                                    <td>₹ {row.principal.toLocaleString()}</td>
                                    <td>₹ {row.interest.toLocaleString()}</td>
                                    <td className="text-dark fw-semibold">₹ {row.balance.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Features Section */}
            <div className="row g-4 mt-5">
                <Col md={4}>
                    <div className="p-4 bg-white rounded-4 border border-light h-100">
                        <div className="text-primary mb-3"><FaWallet size={20} /></div>
                        <h6 className="fw-bold text-dark">Total Repayment</h6>
                        <p className="text-muted small mb-0">Understand exactly how much you'll pay back including principal and interest over the entire duration.</p>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="p-4 bg-white rounded-4 border border-light h-100">
                        <div className="text-info mb-3"><FaPercentage size={20} /></div>
                        <h6 className="fw-bold text-dark">Interest Savings</h6>
                        <p className="text-muted small mb-0">Experiment with different rates and tenures to see how you can save on total interest payments.</p>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="p-4 bg-white rounded-4 border border-light h-100">
                        <div className="text-warning mb-3"><FaCalendarAlt size={20} /></div>
                        <h6 className="fw-bold text-dark">Yearly Breakdown</h6>
                        <p className="text-muted small mb-0">Get a clear picture of your declining balance and how your payments are split each year.</p>
                    </div>
                </Col>
            </div>
        </div>
    );
};

export default LoanCalculator;
