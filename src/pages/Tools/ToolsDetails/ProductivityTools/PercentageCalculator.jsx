import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Badge, Button, InputGroup } from 'react-bootstrap';
import { 
    FaPercentage, FaCalculator,
    FaTag, FaHandHoldingUsd, FaHistory, FaInfoCircle, FaCopy
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { MoveDown, MoveUp } from 'lucide-react';

const PercentageCalculator = () => {
    // Mode 1: What is X% of Y?
    const [m1X, setM1X] = useState(10);
    const [m1Y, setM1Y] = useState(100);
    const m1Res = (m1X / 100) * m1Y;

    // Mode 2: X is what % of Y?
    const [m2X, setM2X] = useState(20);
    const [m2Y, setM2Y] = useState(200);
    const m2Res = (m2X / m2Y) * 100;

    // Mode 3: % Increase/Decrease from X to Y
    const [m3X, setM3X] = useState(100);
    const [m3Y, setM3Y] = useState(150);
    const m3Res = ((m3Y - m3X) / m3X) * 100;

    // Mode 4: X + Y% (Tip/Tax)
    const [m4X, setM4X] = useState(1000);
    const [m4Y, setM4Y] = useState(18);
    const m4Tip = (m4Y / 100) * m4X;
    const m4Res = parseFloat(m4X) + m4Tip;

    // Mode 5: X - Y% (Discount)
    const [m5X, setM5X] = useState(500);
    const [m5Y, setM5Y] = useState(20);
    const m5Saved = (m5Y / 100) * m5X;
    const m5Res = m5X - m5Saved;

    const copyToClipboard = (val) => {
        navigator.clipboard.writeText(val.toString());
        toast.success('Result copied!');
    };

    const formatNum = (num) => {
        return isNaN(num) || !isFinite(num) ? '0' : Number(num).toLocaleString(undefined, { maximumFractionDigits: 2 });
    };

    return (
        <div className="percentage-calc-container py-4">
            <style>
                {`
                .percentage-calc-container {
                    animation: fadeIn 0.6s ease-out;
                    max-width: 1000px;
                    margin: 0 auto;
                    color: #1e293b;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .calc-card {
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    border-radius: 24px;
                    padding: 30px;
                    height: 100%;
                    transition: all 0.3s;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.03);
                }

                .calc-card:hover {
                    box-shadow: 0 15px 35px rgba(0,0,0,0.06);
                    border-color: #6366f1;
                }

                .calc-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 25px;
                }

                .icon-box {
                    width: 40px;
                    height: 40px;
                    background: #f1f5f9;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #6366f1;
                }

                .input-field {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 12px 15px;
                    font-weight: 600;
                    color: #1e293b;
                    text-align: center;
                    width: 100%;
                    outline: none;
                    transition: all 0.2s;
                }

                .input-field:focus {
                    background: #ffffff;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                }

                .result-box {
                    background: #f1f5f9;
                    border-radius: 16px;
                    padding: 20px;
                    text-align: center;
                    margin-top: 25px;
                    position: relative;
                }

                .result-value {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #6366f1;
                    display: block;
                    line-height: 1.2;
                }

                .result-label {
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .copy-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    padding: 5px;
                    font-size: 0.8rem;
                    color: #94a3b8;
                    cursor: pointer;
                    transition: color 0.2s;
                }

                .copy-btn:hover {
                    color: #6366f1;
                }

                .inline-text {
                    font-weight: 600;
                    color: #64748b;
                    margin: 0 10px;
                    white-space: nowrap;
                }
                `}
            </style>

            <Row className="g-4 mb-4">
                {/* Mode 1: What is X% of Y? */}
                <Col md={6}>
                    <div className="calc-card">
                        <div className="calc-header">
                            <div className="icon-box"><FaPercentage /></div>
                            <h6 className="fw-bold m-0">Percentage Of</h6>
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="inline-text">What is</span>
                            <input type="number" className="input-field" value={m1X} onChange={(e) => setM1X(e.target.value)} />
                            <span className="inline-text">% of</span>
                            <input type="number" className="input-field" value={m1Y} onChange={(e) => setM1Y(e.target.value)} />
                        </div>
                        <div className="result-box">
                            <div className="copy-btn" onClick={() => copyToClipboard(m1Res)}><FaCopy /></div>
                            <span className="result-value">{formatNum(m1Res)}</span>
                            <span className="result-label">Result</span>
                        </div>
                    </div>
                </Col>

                {/* Mode 2: X is what % of Y? */}
                <Col md={6}>
                    <div className="calc-card">
                        <div className="calc-header">
                            <div className="icon-box"><FaCalculator /></div>
                            <h6 className="fw-bold m-0">Calculate Percentage</h6>
                        </div>
                        <div className="d-flex align-items-center">
                            <input type="number" className="input-field" value={m2X} onChange={(e) => setM2X(e.target.value)} />
                            <span className="inline-text">is what % of</span>
                            <input type="number" className="input-field" value={m2Y} onChange={(e) => setM2Y(e.target.value)} />
                        </div>
                        <div className="result-box">
                            <div className="copy-btn" onClick={() => copyToClipboard(m2Res)}><FaCopy /></div>
                            <span className="result-value">{formatNum(m2Res)}%</span>
                            <span className="result-label">Result</span>
                        </div>
                    </div>
                </Col>

                {/* Mode 3: Increase/Decrease */}
                <Col md={12}>
                    <div className="calc-card">
                        <div className="calc-header">
                            <div className="icon-box">
                                {m3Res >= 0 ? <MoveUp /> : <MoveDown className="text-danger" />}
                            </div>
                            <h6 className="fw-bold m-0">Percentage Change (Increase/Decrease)</h6>
                        </div>
                        <Row className="align-items-center g-3">
                            <Col sm={5}>
                                <div className="d-flex align-items-center">
                                    <span className="inline-text">From</span>
                                    <input type="number" className="input-field" value={m3X} onChange={(e) => setM3X(e.target.value)} />
                                </div>
                            </Col>
                            <Col sm={5}>
                                <div className="d-flex align-items-center">
                                    <span className="inline-text">To</span>
                                    <input type="number" className="input-field" value={m3Y} onChange={(e) => setM3Y(e.target.value)} />
                                </div>
                            </Col>
                            <Col sm={2}>
                                <Badge bg={m3Res >= 0 ? 'success' : 'danger'} className="w-100 py-2 rounded-3">
                                    {m3Res >= 0 ? 'Increase' : 'Decrease'}
                                </Badge>
                            </Col>
                        </Row>
                        <div className="result-box" style={{ background: m3Res >= 0 ? '#f0fdf4' : '#fef2f2' }}>
                            <div className="copy-btn" onClick={() => copyToClipboard(m3Res)}><FaCopy /></div>
                            <span className="result-value" style={{ color: m3Res >= 0 ? '#10b981' : '#ef4444' }}>
                                {m3Res > 0 ? '+' : ''}{formatNum(m3Res)}%
                            </span>
                            <span className="result-label">Difference</span>
                        </div>
                    </div>
                </Col>

                {/* Mode 4: Tip/Tax */}
                <Col md={6}>
                    <div className="calc-card">
                        <div className="calc-header">
                            <div className="icon-box"><FaHandHoldingUsd /></div>
                            <h6 className="fw-bold m-0">Add Percentage (Tip / Tax)</h6>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                            <span className="inline-text">Amount</span>
                            <input type="number" className="input-field" value={m4X} onChange={(e) => setM4X(e.target.value)} />
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="inline-text">Add</span>
                            <input type="number" className="input-field" value={m4Y} onChange={(e) => setM4Y(e.target.value)} />
                            <span className="inline-text">%</span>
                        </div>
                        <div className="result-box">
                            <div className="copy-btn" onClick={() => copyToClipboard(m4Res)}><FaCopy /></div>
                            <span className="result-value">{formatNum(m4Res)}</span>
                            <span className="result-label">Total (Tax/Tip: {formatNum(m4Tip)})</span>
                        </div>
                    </div>
                </Col>

                {/* Mode 5: Discount */}
                <Col md={6}>
                    <div className="calc-card">
                        <div className="calc-header">
                            <div className="icon-box"><FaTag /></div>
                            <h6 className="fw-bold m-0">Subtract Percentage (Discount)</h6>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                            <span className="inline-text">Price</span>
                            <input type="number" className="input-field" value={m5X} onChange={(e) => setM5X(e.target.value)} />
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="inline-text">Discount</span>
                            <input type="number" className="input-field" value={m5Y} onChange={(e) => setM5Y(e.target.value)} />
                            <span className="inline-text">%</span>
                        </div>
                        <div className="result-box">
                            <div className="copy-btn" onClick={() => copyToClipboard(m5Res)}><FaCopy /></div>
                            <span className="result-value">{formatNum(m5Res)}</span>
                            <span className="result-label">Final Price (Saved: {formatNum(m5Saved)})</span>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Info Section */}
            <Card className="border-0 rounded-4 bg-light p-4 shadow-sm">
                <Row className="align-items-center g-4">
                    <Col md={1}>
                        <div className="text-center text-primary opacity-25">
                            <FaInfoCircle size={40} />
                        </div>
                    </Col>
                    <Col md={11}>
                        <h6 className="fw-bold mb-2">Versatile Percentage Calculations</h6>
                        <p className="small text-muted mb-0">
                            Whether you're calculating sales tax, stock market changes, or restaurant tips, 
                            this tool provides a comprehensive set of calculators to handle any percentage-based math. 
                            Results update instantly as you change any value, and you can easily copy results to your 
                            clipboard for use elsewhere.
                        </p>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default PercentageCalculator;
