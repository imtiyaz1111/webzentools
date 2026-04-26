import React, { useState, useMemo } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { FaCalculator, FaUndo } from 'react-icons/fa';

const EmiCalculator = () => {
    const [loanAmount, setLoanAmount] = useState(1000000);
    const [interestRate, setInterestRate] = useState(8.5);
    const [loanTenure, setLoanTenure] = useState(20);
    const { emi, totalInterest, totalPayment } = useMemo(() => {
        const r = interestRate / 12 / 100;
        const n = loanTenure * 12;
        if (r === 0) return { emi: loanAmount / n, totalInterest: 0, totalPayment: loanAmount };
        
        const emiValue = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalPayable = emiValue * n;
        const totalInt = totalPayable - loanAmount;

        return {
            emi: Math.round(emiValue) || 0,
            totalInterest: Math.round(totalInt) || 0,
            totalPayment: Math.round(totalPayable) || 0
        };
    }, [loanAmount, interestRate, loanTenure]);

    const handleReset = () => {
        setLoanAmount(1000000);
        setInterestRate(8.5);
        setLoanTenure(20);
    };

    return (
        <div className="emi-calculator">
            <Row className="gy-4">
                <Col md={6}>
                    <div className="p-4 bg-light rounded-4 h-100">
                        <Form>
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold d-flex justify-content-between">
                                    Loan Amount <span>₹{loanAmount.toLocaleString()}</span>
                                </Form.Label>
                                <Form.Range 
                                    min={10000} 
                                    max={10000000} 
                                    step={10000} 
                                    value={loanAmount} 
                                    onChange={(e) => setLoanAmount(Number(e.target.value))} 
                                />
                                <Form.Control 
                                    type="number" 
                                    value={loanAmount} 
                                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                                    className="mt-2 border-0 bg-white"
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold d-flex justify-content-between">
                                    Interest Rate (p.a) <span>{interestRate}%</span>
                                </Form.Label>
                                <Form.Range 
                                    min={1} 
                                    max={20} 
                                    step={0.1} 
                                    value={interestRate} 
                                    onChange={(e) => setInterestRate(Number(e.target.value))} 
                                />
                                <Form.Control 
                                    type="number" 
                                    value={interestRate} 
                                    onChange={(e) => setInterestRate(Number(e.target.value))}
                                    className="mt-2 border-0 bg-white"
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold d-flex justify-content-between">
                                    Loan Tenure (Years) <span>{loanTenure} Yrs</span>
                                </Form.Label>
                                <Form.Range 
                                    min={1} 
                                    max={30} 
                                    step={1} 
                                    value={loanTenure} 
                                    onChange={(e) => setLoanTenure(Number(e.target.value))} 
                                />
                                <Form.Control 
                                    type="number" 
                                    value={loanTenure} 
                                    onChange={(e) => setLoanTenure(Number(e.target.value))}
                                    className="mt-2 border-0 bg-white"
                                />
                            </Form.Group>
                            
                            <button type="button" className="btn btn-outline-secondary btn-sm w-100 rounded-pill" onClick={handleReset}>
                                <FaUndo className="me-2" /> Reset Values
                            </button>
                        </Form>
                    </div>
                </Col>

                <Col md={6}>
                    <div className="p-4 glass-card rounded-4 h-100 text-center d-flex flex-column justify-content-center">
                        <div className="mb-4">
                            <h5 className="text-muted text-uppercase tracking-wider small mb-2">Monthly EMI</h5>
                            <h2 className="display-4 fw-bold text-gradient">₹{emi.toLocaleString()}</h2>
                        </div>
                        
                        <hr className="opacity-10" />
                        
                        <Row className="text-start mt-2">
                            <Col xs={6} className="mb-3">
                                <span className="text-muted small">Principal Amount</span>
                                <h6 className="fw-bold mb-0">₹{loanAmount.toLocaleString()}</h6>
                            </Col>
                            <Col xs={6} className="mb-3">
                                <span className="text-muted small">Total Interest</span>
                                <h6 className="fw-bold mb-0 text-danger">₹{totalInterest.toLocaleString()}</h6>
                            </Col>
                            <Col xs={12}>
                                <div className="p-3 bg-primary bg-opacity-10 rounded-3">
                                    <span className="text-muted small text-primary fw-bold">Total Payment</span>
                                    <h5 className="fw-bold mb-0 text-primary">₹{totalPayment.toLocaleString()}</h5>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>

            <div className="mt-5 pt-4 border-top">
                <h3 className="h5 fw-bold mb-3">Understanding EMI</h3>
                <p className="text-muted small">
                    EMI stands for Equated Monthly Installment. It represents a fixed amount paid by a borrower to a lender at a specified date each calendar month. EMIs are applied to both interest and principal each month so that over a specified number of years, the loan is paid off in full.
                </p>
                <div className="p-3 bg-light rounded-3 small">
                    <strong>Formula:</strong> [P x R x (1+R)^N]/[(1+R)^N-1] <br/>
                    P = Loan amount, R = Interest rate per month, N = Number of monthly installments.
                </div>
            </div>
        </div>
    );
};

export default EmiCalculator;
