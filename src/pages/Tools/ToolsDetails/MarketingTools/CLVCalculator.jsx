import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { 
    FaCalculator, FaUserTag, FaDollarSign, FaRepeat, 
    FaCalendarDays, FaRegLightbulb, FaCircleInfo,
    FaHeartPulse, FaChartBar
} from 'react-icons/fa6';
import toast from 'react-hot-toast';
import './CLVCalculator.css';
import { FaSyncAlt } from 'react-icons/fa';

const CLVCalculator = () => {
    const [data, setData] = useState({
        avgOrderValue: '',
        purchaseFrequency: '',
        customerLifespan: '',
        profitMargin: '100'
    });

    const [results, setResults] = useState({
        clv: 0,
        annualRevenue: 0,
        totalPurchases: 0,
        totalProfit: 0
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const calculateCLV = () => {
        const aov = parseFloat(data.avgOrderValue) || 0;
        const frequency = parseFloat(data.purchaseFrequency) || 0; // Per year
        const lifespan = parseFloat(data.customerLifespan) || 0; // In years
        const margin = (parseFloat(data.profitMargin) || 100) / 100;

        if (aov <= 0 || frequency <= 0 || lifespan <= 0) {
            toast.error('Please enter all values to calculate CLV.');
            return;
        }

        const annualRev = aov * frequency;
        const totalPurchases = frequency * lifespan;
        const lifetimeRev = annualRev * lifespan;
        const clv = lifetimeRev * margin;

        setResults({
            clv: clv.toFixed(2),
            annualRevenue: annualRev.toFixed(2),
            totalPurchases: totalPurchases.toFixed(0),
            totalProfit: clv.toFixed(2)
        });
        
        toast.success('CLV calculated successfully!');
    };

    const resetTool = () => {
        setData({
            avgOrderValue: '',
            purchaseFrequency: '',
            customerLifespan: '',
            profitMargin: '100'
        });
        setResults({
            clv: 0,
            annualRevenue: 0,
            totalPurchases: 0,
            totalProfit: 0
        });
    };

    return (
        <div className="clv-calculator-container py-4">
            <div className="text-center mb-5">
                <div className="premium-badge mb-3">
                    <FaUserTag className="me-2" /> Long-term Growth
                </div>
                <h1 className="display-5 fw-bold mb-3 gradient-text">Customer Lifetime Value</h1>
                <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                    Predict the total value of your customers over time. Optimize your acquisition costs and focus on high-value retention strategies.
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
                                    <h2 className="h4 fw-bold mb-1">Customer Metrics</h2>
                                    <p className="text-muted mb-0 small">Behavioral Data</p>
                                </div>
                            </div>

                            <Form>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase d-flex align-items-center gap-2">
                                        <FaDollarSign className="text-success" /> Avg. Order Value (AOV)
                                    </Form.Label>
                                    <Form.Control 
                                        type="number"
                                        name="avgOrderValue"
                                        placeholder="e.g. 50"
                                        value={data.avgOrderValue}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase d-flex align-items-center gap-2">
                                        <FaRepeat className="text-primary" /> Purchase Frequency (Yearly)
                                    </Form.Label>
                                    <Form.Control 
                                        type="number"
                                        name="purchaseFrequency"
                                        placeholder="e.g. 12 (Once a month)"
                                        value={data.purchaseFrequency}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase d-flex align-items-center gap-2">
                                        <FaCalendarDays className="text-danger" /> Customer Lifespan (Years)
                                    </Form.Label>
                                    <Form.Control 
                                        type="number"
                                        name="customerLifespan"
                                        placeholder="e.g. 3"
                                        value={data.customerLifespan}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-5">
                                    <Form.Label className="fw-bold text-dark small text-uppercase d-flex align-items-center gap-2">
                                        <FaChartBar className="text-warning" /> Profit Margin (%)
                                    </Form.Label>
                                    <Form.Control 
                                        type="number"
                                        name="profitMargin"
                                        placeholder="e.g. 30"
                                        value={data.profitMargin}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <div className="d-flex gap-3">
                                    <Button 
                                        className="btn-premium flex-grow-1 py-3 d-flex align-items-center justify-content-center gap-2"
                                        onClick={calculateCLV}
                                    >
                                        <FaCalculator /> Calculate CLV
                                    </Button>
                                    <Button 
                                        variant="light" 
                                        className="rounded-4 px-4 border shadow-sm"
                                        onClick={resetTool}
                                    >
                                        <FaSyncAlt />
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>

                {/* Results Section */}
                <div className="col-lg-7">
                    <div className="h-100 d-flex flex-column gap-4">
                        {/* Main CLV Result */}
                        <Card className="premium-card border-0 shadow-lg text-center bg-gradient-gold text-white">
                            <Card.Body className="p-4 p-md-5">
                                <div className="display-3 fw-bold mb-0">${results.clv}</div>
                                <div className="h5 mb-0 opacity-75">Customer Lifetime Value (CLV)</div>
                                <div className="mt-3">
                                    <span className="badge bg-white bg-opacity-20 rounded-pill px-3 py-2">
                                        Total Predicted Lifetime Profit
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
                                        <div className="h3 fw-bold mb-1">${results.annualRevenue}</div>
                                        <div className="text-muted small uppercase fw-bold">Annual Revenue / Customer</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="premium-card border-0 shadow-lg h-100 bg-white">
                                    <Card.Body className="p-4 text-center">
                                        <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary mx-auto mb-3" style={{ width: 'fit-content' }}>
                                            <FaRepeat size={20} />
                                        </div>
                                        <div className="h3 fw-bold mb-1">{results.totalPurchases}</div>
                                        <div className="text-muted small uppercase fw-bold">Total Lifetime Purchases</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={12}>
                                <Card className="premium-card border-0 shadow-lg h-100 bg-white">
                                    <Card.Body className="p-4 d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-3 text-start">
                                            <div className="p-3 rounded-circle bg-pink-100 text-pink-600">
                                                <FaHeartPulse size={20} />
                                            </div>
                                            <div>
                                                <div className="h4 fw-bold mb-0">${results.totalProfit}</div>
                                                <div className="text-muted small uppercase fw-bold">Lifetime Net Profit</div>
                                            </div>
                                        </div>
                                        <div className="text-muted small italic px-3 border-start max-w-200">
                                            The maximum you should spend to acquire a customer (CAC) must be significantly lower than this.
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
                    <FaRegLightbulb className="text-warning" /> Why CLV Matters
                </h5>
                <Row className="g-4">
                    <Col md={4}>
                        <div className="d-flex gap-3">
                            <div className="text-primary"><FaCircleInfo /></div>
                            <div>
                                <div className="fw-bold small mb-1">Predictive Growth</div>
                                <p className="extra-small text-muted mb-0">Knowing your CLV helps you forecast future revenue and plan business expansion with confidence.</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="d-flex gap-3">
                            <div className="text-success"><FaCircleInfo /></div>
                            <div>
                                <div className="fw-bold small mb-1">CAC vs CLV</div>
                                <p className="extra-small text-muted mb-0">Your Customer Acquisition Cost (CAC) should ideally be 1/3 of your CLV for a healthy, sustainable business.</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="d-flex gap-3">
                            <div className="text-danger"><FaCircleInfo /></div>
                            <div>
                                <div className="fw-bold small mb-1">Retention Focus</div>
                                <p className="extra-small text-muted mb-0">Increasing retention by 5% can increase profits by 25% to 95%. Focus on keeping high-value customers.</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default CLVCalculator;
