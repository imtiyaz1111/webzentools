import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { 
    FaCalculator, FaScaleBalanced, FaDollarSign, FaBox, 
    FaArrowTrendUp, FaRegLightbulb,
    FaMoneyBillWave, FaChartPie,
    FaCircleInfo
} from 'react-icons/fa6';
import toast from 'react-hot-toast';
import './BreakEvenCalculator.css';
import { FaSync } from 'react-icons/fa';

const BreakEvenCalculator = () => {
    const [data, setData] = useState({
        fixedCosts: '',
        pricePerUnit: '',
        variableCostPerUnit: ''
    });

    const [results, setResults] = useState({
        breakEvenUnits: 0,
        breakEvenRevenue: 0,
        contributionMargin: 0,
        marginPercentage: 0
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const calculateBreakEven = () => {
        const fixed = parseFloat(data.fixedCosts) || 0;
        const price = parseFloat(data.pricePerUnit) || 0;
        const variable = parseFloat(data.variableCostPerUnit) || 0;

        if (price <= variable) {
            toast.error('Price per unit must be greater than variable cost per unit.');
            return;
        }

        const margin = price - variable;
        const marginPerc = (margin / price) * 100;
        const units = fixed / margin;
        const revenue = units * price;

        setResults({
            breakEvenUnits: Math.ceil(units),
            breakEvenRevenue: revenue.toFixed(2),
            contributionMargin: margin.toFixed(2),
            marginPercentage: marginPerc.toFixed(2)
        });
        
        toast.success('Break-even analysis complete!');
    };

    const resetTool = () => {
        setData({
            fixedCosts: '',
            pricePerUnit: '',
            variableCostPerUnit: ''
        });
        setResults({
            breakEvenUnits: 0,
            breakEvenRevenue: 0,
            contributionMargin: 0,
            marginPercentage: 0
        });
    };

    return (
        <div className="break-even-calculator-container py-4">
            <div className="text-center mb-5">
                <div className="premium-badge mb-3">
                    <FaScaleBalanced className="me-2" /> Business Profitability
                </div>
                <h1 className="display-5 fw-bold mb-3 gradient-text">Break-even Calculator</h1>
                <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                    Calculate the exact point where your business starts making a profit. Essential for pricing strategy and financial planning.
                </p>
            </div>

            <div className="row g-4">
                {/* Inputs Section */}
                <div className="col-lg-5">
                    <Card className="premium-card border-0 shadow-lg h-100">
                        <Card.Body className="p-4 p-md-5">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary">
                                    <FaCalculator size={24} />
                                </div>
                                <div>
                                    <h2 className="h4 fw-bold mb-1">Cost Details</h2>
                                    <p className="text-muted mb-0 small">Fixed and Variable Costs</p>
                                </div>
                            </div>

                            <Form>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase d-flex align-items-center gap-2">
                                        <FaMoneyBillWave className="text-primary" /> Total Fixed Costs
                                    </Form.Label>
                                    <Form.Control 
                                        type="number"
                                        name="fixedCosts"
                                        placeholder="e.g. 5000 (Rent, Salaries, etc.)"
                                        value={data.fixedCosts}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase d-flex align-items-center gap-2">
                                        <FaDollarSign className="text-success" /> Sale Price Per Unit
                                    </Form.Label>
                                    <Form.Control 
                                        type="number"
                                        name="pricePerUnit"
                                        placeholder="e.g. 100"
                                        value={data.pricePerUnit}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-5">
                                    <Form.Label className="fw-bold text-dark small text-uppercase d-flex align-items-center gap-2">
                                        <FaBox className="text-danger" /> Variable Cost Per Unit
                                    </Form.Label>
                                    <Form.Control 
                                        type="number"
                                        name="variableCostPerUnit"
                                        placeholder="e.g. 40 (Materials, Shipping, etc.)"
                                        value={data.variableCostPerUnit}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <div className="d-flex gap-3">
                                    <Button 
                                        className="btn-premium flex-grow-1 py-3 d-flex align-items-center justify-content-center gap-2"
                                        onClick={calculateBreakEven}
                                    >
                                        <FaCalculator /> Calculate Break-even
                                    </Button>
                                    <Button 
                                        variant="light" 
                                        className="rounded-4 px-4 border shadow-sm"
                                        onClick={resetTool}
                                    >
                                        <FaSync />
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>

                {/* Results Section */}
                <div className="col-lg-7">
                    <div className="h-100 d-flex flex-column gap-4">
                        {/* Main Units Result */}
                        <Card className="premium-card border-0 shadow-lg text-center bg-gradient-indigo text-white">
                            <Card.Body className="p-4 p-md-5">
                                <div className="display-3 fw-bold mb-0">{results.breakEvenUnits}</div>
                                <div className="h5 mb-0 opacity-75">Units to Break-even</div>
                                <div className="mt-3">
                                    <span className="badge bg-white bg-opacity-20 rounded-pill px-3 py-2">
                                        Target: {results.breakEvenUnits} Sales
                                    </span>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Metrics Grid */}
                        <Row className="g-4 flex-grow-1">
                            <Col md={6}>
                                <Card className="premium-card border-0 shadow-lg h-100 bg-white">
                                    <Card.Body className="p-4 text-center">
                                        <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success mx-auto mb-3" style={{ width: 'fit-content' }}>
                                            <FaDollarSign size={20} />
                                        </div>
                                        <div className="h3 fw-bold mb-1">${results.breakEvenRevenue}</div>
                                        <div className="text-muted small uppercase fw-bold">Break-even Revenue</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="premium-card border-0 shadow-lg h-100 bg-white">
                                    <Card.Body className="p-4 text-center">
                                        <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary mx-auto mb-3" style={{ width: 'fit-content' }}>
                                            <FaChartPie size={20} />
                                        </div>
                                        <div className="h3 fw-bold mb-1">${results.contributionMargin}</div>
                                        <div className="text-muted small uppercase fw-bold">Contribution Margin</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={12}>
                                <Card className="premium-card border-0 shadow-lg h-100 bg-white">
                                    <Card.Body className="p-4 d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-3 text-start">
                                            <div className="p-3 rounded-circle bg-indigo-100 text-indigo-600">
                                                <FaArrowTrendUp size={20} />
                                            </div>
                                            <div>
                                                <div className="h4 fw-bold mb-0">{results.marginPercentage}%</div>
                                                <div className="text-muted small uppercase fw-bold">Gross Margin Percentage</div>
                                            </div>
                                        </div>
                                        <div className="text-muted small italic px-3 border-start">
                                            Profit potential per sale
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>

            {/* Educational Section */}
            <div className="mt-5 p-4 glass-panel rounded-4 border border-white">
                <h5 className="h6 fw-bold text-dark d-flex align-items-center gap-2 mb-4">
                    <FaRegLightbulb className="text-warning" /> Understanding Your Results
                </h5>
                <Row className="g-4">
                    <Col md={4}>
                        <div className="d-flex gap-3">
                            <div className="text-primary"><FaCircleInfo /></div>
                            <div>
                                <div className="fw-bold small mb-1">Fixed Costs</div>
                                <p className="extra-small text-muted mb-0">Costs that stay the same regardless of how many units you sell (e.g., Rent, Insurance).</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="d-flex gap-3">
                            <div className="text-success"><FaCircleInfo /></div>
                            <div>
                                <div className="fw-bold small mb-1">Variable Costs</div>
                                <p className="extra-small text-muted mb-0">Costs that increase as you sell more units (e.g., Raw Materials, Direct Labor).</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="d-flex gap-3">
                            <div className="text-info"><FaCircleInfo /></div>
                            <div>
                                <div className="fw-bold small mb-1">Contribution Margin</div>
                                <p className="extra-small text-muted mb-0">The selling price minus variable costs. This amount "contributes" to covering fixed costs.</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default BreakEvenCalculator;
