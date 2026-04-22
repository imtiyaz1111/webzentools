import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { FaUndo, FaPercentage, FaCalculator, FaInfoCircle, FaFileInvoice } from 'react-icons/fa';
import './GstCalculator.css';

const GstCalculator = () => {
    const [amount, setAmount] = useState(1000);
    const [gstRate, setGstRate] = useState(18);
    const [isInclusive, setIsInclusive] = useState(false); // false = Exclusive, true = Inclusive

    // Calculated states
    const [results, setResults] = useState({
        netAmount: 0,
        gstAmount: 0,
        cgst: 0,
        sgst: 0,
        totalAmount: 0
    });

    const calculateGst = () => {
        const rate = parseFloat(gstRate) || 0;
        const baseAmount = parseFloat(amount) || 0;

        let gst, net, total;

        if (isInclusive) {
            // Amount includes GST
            total = baseAmount;
            gst = total - (total * (100 / (100 + rate)));
            net = total - gst;
        } else {
            // Amount excludes GST
            net = baseAmount;
            gst = (net * rate) / 100;
            total = net + gst;
        }

        setResults({
            netAmount: net.toFixed(2),
            gstAmount: gst.toFixed(2),
            cgst: (gst / 2).toFixed(2),
            sgst: (gst / 2).toFixed(2),
            totalAmount: total.toFixed(2)
        });
    };

    useEffect(() => {
        calculateGst();
    }, [amount, gstRate, isInclusive]);

    const handleReset = () => {
        setAmount(1000);
        setGstRate(18);
        setIsInclusive(false);
    };

    const gstRates = [5, 12, 18, 28];

    return (
        <div className="gst-calculator-container">
            <div className="premium-card overflow-hidden">
                <Row className="g-0">
                    {/* Left Column: Inputs */}
                    <Col lg={7} className="input-section border-end border-light">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold mb-0 text-dark">GST Details</h4>
                            <button className="btn btn-link text-muted p-0 text-decoration-none small" onClick={handleReset}>
                                <FaUndo className="me-1" /> Reset
                            </button>
                        </div>

                        <div className="calculation-toggle">
                            <button 
                                type="button"
                                className={`toggle-btn ${!isInclusive ? 'active' : ''}`}
                                onClick={() => setIsInclusive(false)}
                            >
                                GST Exclusive
                            </button>
                            <button 
                                type="button"
                                className={`toggle-btn ${isInclusive ? 'active' : ''}`}
                                onClick={() => setIsInclusive(true)}
                            >
                                GST Inclusive
                            </button>
                        </div>

                        <Form>
                            <Form.Group className="mb-4">
                                <Form.Label className="form-label">Amount (₹)</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    className="premium-input"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="form-label">GST Rate (%)</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    className="premium-input"
                                    value={gstRate}
                                    onChange={(e) => setGstRate(e.target.value)}
                                    placeholder="Enter GST rate"
                                />
                                <div className="gst-rate-grid">
                                    {gstRates.map(rate => (
                                        <button 
                                            key={rate}
                                            type="button"
                                            className={`rate-btn ${gstRate == rate ? 'active' : ''}`}
                                            onClick={() => setGstRate(rate)}
                                        >
                                            {rate}%
                                        </button>
                                    ))}
                                </div>
                            </Form.Group>
                        </Form>

                        <div className="mt-4 p-3 bg-light rounded-4 d-flex gap-3 align-items-start">
                            <FaInfoCircle className="text-primary mt-1" />
                            <p className="small text-muted mb-0">
                                {isInclusive 
                                    ? "GST Inclusive: The amount you entered already includes GST. We will calculate the base price and tax portion." 
                                    : "GST Exclusive: GST will be added on top of the amount you entered."}
                            </p>
                        </div>
                    </Col>

                    {/* Right Column: Results */}
                    <Col lg={5} className="result-section">
                        <div className="result-card shadow-sm">
                            <div className="result-label">
                                {isInclusive ? "Net Amount" : "Total Amount"}
                            </div>
                            <div className="result-value">
                                ₹{isInclusive ? parseFloat(results.netAmount).toLocaleString() : parseFloat(results.totalAmount).toLocaleString()}
                            </div>
                        </div>

                        <div className="breakdown-section p-2">
                            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center">
                                <FaFileInvoice className="me-2 text-success" /> Tax Breakdown
                            </h6>
                            
                            <div className="breakdown-item">
                                <span className="item-label">Net Amount</span>
                                <span className="item-value">₹{parseFloat(results.netAmount).toLocaleString()}</span>
                            </div>

                            <div className="breakdown-item">
                                <span className="item-label">
                                    CGST <span className="tax-badge">{(gstRate / 2)}%</span>
                                </span>
                                <span className="item-value">₹{parseFloat(results.cgst).toLocaleString()}</span>
                            </div>

                            <div className="breakdown-item">
                                <span className="item-label">
                                    SGST <span className="tax-badge">{(gstRate / 2)}%</span>
                                </span>
                                <span className="item-value">₹{parseFloat(results.sgst).toLocaleString()}</span>
                            </div>

                            <div className="breakdown-item pt-3 mt-2 border-top border-dark border-opacity-10">
                                <span className="item-label fw-bold text-dark">Total GST</span>
                                <span className="item-value text-success">₹{parseFloat(results.gstAmount).toLocaleString()}</span>
                            </div>

                            <div className="breakdown-item">
                                <span className="item-label fw-bold text-dark">Gross Amount</span>
                                <span className="item-value text-primary fs-5">₹{parseFloat(results.totalAmount).toLocaleString()}</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Understanding GST Section */}
            <div className="mt-5 pt-4">
                <h3 className="h4 fw-bold mb-4 text-dark">Understanding GST Calculations</h3>
                <div className="row g-4">
                    <Col md={6}>
                        <div className="p-4 bg-white rounded-4 border border-light h-100 shadow-sm">
                            <h5 className="fw-bold mb-3 text-primary d-flex align-items-center">
                                <FaCalculator className="me-2" /> GST Exclusive
                            </h5>
                            <p className="text-muted small mb-3">
                                When a price is exclusive of GST, the tax is added to the base price. This is common in B2B transactions.
                            </p>
                            <code className="d-block p-3 bg-light rounded-3 text-dark small">
                                GST Amount = (Base Price × GST Rate) / 100<br/>
                                Total Price = Base Price + GST Amount
                            </code>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="p-4 bg-white rounded-4 border border-light h-100 shadow-sm">
                            <h5 className="fw-bold mb-3 text-success d-flex align-items-center">
                                <FaPercentage className="me-2" /> GST Inclusive
                            </h5>
                            <p className="text-muted small mb-3">
                                When a price is inclusive of GST, the tax is already part of the total price. This is common in retail (MRP).
                            </p>
                            <code className="d-block p-3 bg-light rounded-3 text-dark small">
                                GST Amount = Total Price - (Total Price × (100 / (100 + GST Rate)))<br/>
                                Base Price = Total Price - GST Amount
                            </code>
                        </div>
                    </Col>
                </div>
            </div>
        </div>
    );
};

export default GstCalculator;
