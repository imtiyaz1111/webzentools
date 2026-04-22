import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { FaUndo, FaChartLine, FaHistory, FaCalculator, FaLightbulb } from 'react-icons/fa';
import './CagrCalculator.css';

const CagrCalculator = () => {
    const [initialValue, setInitialValue] = useState(10000);
    const [finalValue, setFinalValue] = useState(25000);
    const [years, setYears] = useState(5);

    const [results, setResults] = useState({
        cagr: 0,
        totalReturns: 0,
        absoluteGrowth: 0
    });

    const calculateCAGR = () => {
        const BV = parseFloat(initialValue);
        const EV = parseFloat(finalValue);
        const n = parseFloat(years);

        if (BV > 0 && EV > 0 && n > 0) {
            const cagrValue = (Math.pow(EV / BV, 1 / n) - 1) * 100;
            const absoluteGrowthValue = ((EV - BV) / BV) * 100;
            const totalReturnsValue = EV - BV;

            setResults({
                cagr: cagrValue.toFixed(2),
                totalReturns: totalReturnsValue.toFixed(0),
                absoluteGrowth: absoluteGrowthValue.toFixed(2)
            });
        } else {
            setResults({ cagr: 0, totalReturns: 0, absoluteGrowth: 0 });
        }
    };

    useEffect(() => {
        calculateCAGR();
    }, [initialValue, finalValue, years]);

    const handleReset = () => {
        setInitialValue(10000);
        setFinalValue(25000);
        setYears(5);
    };

    return (
        <div className="cagr-calculator-container">
            <div className="premium-card overflow-hidden">
                <Row className="g-0">
                    {/* Left Column: Inputs */}
                    <Col lg={7} className="input-section border-end border-light">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold mb-0 text-dark">Investment Timeline</h4>
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
                                    value={initialValue}
                                    onChange={(e) => setInitialValue(e.target.value)}
                                    placeholder="Enter starting value"
                                />
                                <Form.Text className="text-muted small">The amount you invested at the start.</Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="form-label">Final Value (₹)</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    className="premium-input"
                                    value={finalValue}
                                    onChange={(e) => setFinalValue(e.target.value)}
                                    placeholder="Enter ending value"
                                />
                                <Form.Text className="text-muted small">The current or expected value of the investment.</Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="form-label">Duration (Years)</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    className="premium-input"
                                    value={years}
                                    onChange={(e) => setYears(e.target.value)}
                                    placeholder="Enter number of years"
                                />
                                <Form.Text className="text-muted small">The time period between initial and final values.</Form.Text>
                            </Form.Group>
                        </Form>

                        <div className="info-box shadow-sm border-0 bg-primary bg-opacity-10 text-primary">
                            <div className="info-title">
                                <FaLightbulb /> Why CAGR matters?
                            </div>
                            <div className="info-content text-dark opacity-75">
                                CAGR is the best way to determine the geometric progression of an investment over a period of time. It smooths out the returns by providing a constant annual growth rate.
                            </div>
                        </div>
                    </Col>

                    {/* Right Column: Results */}
                    <Col lg={5} className="result-section">
                        <div className="main-result-card shadow-sm">
                            <div className="result-label">CAGR (Annual Growth)</div>
                            <div className="result-value">{results.cagr}%</div>
                            <p className="small text-muted mt-2 mb-0">Compounded annually over {years} years</p>
                        </div>

                        <div className="stats-list">
                            <div className="stat-item shadow-sm">
                                <span className="stat-label d-flex align-items-center gap-2">
                                    <FaHistory className="text-muted" /> Absolute Returns
                                </span>
                                <span className="stat-value success">{results.absoluteGrowth}%</span>
                            </div>
                            <div className="stat-item shadow-sm">
                                <span className="stat-label d-flex align-items-center gap-2">
                                    <FaChartLine className="text-muted" /> Total Gains
                                </span>
                                <span className="stat-value">₹ {parseFloat(results.totalReturns).toLocaleString()}</span>
                            </div>
                            <div className="stat-item shadow-sm">
                                <span className="stat-label d-flex align-items-center gap-2">
                                    <FaCalculator className="text-muted" /> Multiple
                                </span>
                                <span className="stat-value">{(finalValue / initialValue).toFixed(2)}x</span>
                            </div>
                        </div>

                        <div className="mt-5 p-3 rounded-4 bg-white border border-light small text-muted">
                            <h6 className="fw-bold text-dark mb-2">Calculation Formula</h6>
                            <code>CAGR = [(End Value / Start Value) ^ (1 / Years)] - 1</code>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Understanding CAGR Section */}
            <div className="mt-5 pt-4">
                <h3 className="h4 fw-bold mb-4 text-dark">Deeper Insights</h3>
                <Row className="g-4">
                    <Col md={6}>
                        <div className="p-4 bg-white rounded-4 border border-light h-100 shadow-sm">
                            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                <div className="p-2 bg-success bg-opacity-10 rounded-circle text-success"><FaChartLine size={14} /></div>
                                Geometric vs Arithmetic
                            </h6>
                            <p className="text-muted small mb-0">Unlike simple average returns, CAGR accounts for the fact that returns are reinvested year after year, providing a much more accurate picture of investment growth.</p>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="p-4 bg-white rounded-4 border border-light h-100 shadow-sm">
                            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                <div className="p-2 bg-info bg-opacity-10 rounded-circle text-info"><FaHistory size={14} /></div>
                                Benchmarking
                            </h6>
                            <p className="text-muted small mb-0">Use CAGR to compare the performance of different asset classes (like stocks vs gold vs real estate) over the same time period to see which one truly outperformed.</p>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default CagrCalculator;
