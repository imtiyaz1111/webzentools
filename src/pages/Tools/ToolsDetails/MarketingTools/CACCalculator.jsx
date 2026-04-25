import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { 
    FaCalculator, FaUserPlus, FaDollarSign, 
    FaSackDollar, FaArrowTrendUp, FaRegLightbulb, FaCircleInfo,
    FaArrowTrendDown, FaChartPie
} from 'react-icons/fa6';
import { FaAdn, FaSyncAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './CACCalculator.css';

const CACCalculator = () => {
    const [data, setData] = useState({
        marketingSpend: '',
        salesSpend: '',
        softwareSpend: '',
        newCustomers: ''
    });

    const [results, setResults] = useState({
        cac: 0,
        totalSpend: 0,
        marketingRatio: 0,
        salesRatio: 0
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const calculateCAC = () => {
        const marketing = parseFloat(data.marketingSpend) || 0;
        const sales = parseFloat(data.salesSpend) || 0;
        const software = parseFloat(data.softwareSpend) || 0;
        const customers = parseFloat(data.newCustomers) || 0;

        if (customers <= 0) {
            toast.error('Please enter the number of new customers.');
            return;
        }

        const total = marketing + sales + software;
        const cac = total / customers;
        
        const mRatio = total > 0 ? (marketing / total) * 100 : 0;
        const sRatio = total > 0 ? ((sales + software) / total) * 100 : 0;

        setResults({
            cac: cac.toFixed(2),
            totalSpend: total.toFixed(2),
            marketingRatio: mRatio.toFixed(1),
            salesRatio: sRatio.toFixed(1)
        });
        
        toast.success('CAC calculated successfully!');
    };

    const resetTool = () => {
        setData({
            marketingSpend: '',
            salesSpend: '',
            softwareSpend: '',
            newCustomers: ''
        });
        setResults({
            cac: 0,
            totalSpend: 0,
            marketingRatio: 0,
            salesRatio: 0
        });
    };

    return (
        <div className="cac-calculator-container py-4">
            <div className="text-center mb-5">
                <div className="premium-badge mb-3">
                    <FaUserPlus className="me-2" /> Acquisition Efficiency
                </div>
                <h1 className="display-5 fw-bold mb-3 gradient-text">CAC Calculator</h1>
                <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                    Calculate exactly how much you spend to acquire a single customer. A critical metric for understanding your marketing ROI and business scalability.
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
                                    <h2 className="h4 fw-bold mb-1">Cost Inputs</h2>
                                    <p className="text-muted mb-0 small">Total Acquisition Costs</p>
                                </div>
                            </div>

                            <Form>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase d-flex align-items-center gap-2">
                                        <FaAdn className="text-primary" /> Marketing Spend (Ads, Content)
                                    </Form.Label>
                                    <Form.Control 
                                        type="number"
                                        name="marketingSpend"
                                        placeholder="e.g. 5000"
                                        value={data.marketingSpend}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase d-flex align-items-center gap-2">
                                        <FaSackDollar className="text-success" /> Sales Spend (Salaries, Commissions)
                                    </Form.Label>
                                    <Form.Control 
                                        type="number"
                                        name="salesSpend"
                                        placeholder="e.g. 3000"
                                        value={data.salesSpend}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold text-dark small text-uppercase d-flex align-items-center gap-2">
                                        <FaChartPie className="text-info" /> Tech & Software Spend
                                    </Form.Label>
                                    <Form.Control 
                                        type="number"
                                        name="softwareSpend"
                                        placeholder="e.g. 500"
                                        value={data.softwareSpend}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-5">
                                    <Form.Label className="fw-bold text-dark small text-uppercase d-flex align-items-center gap-2">
                                        <FaUserPlus className="text-danger" /> Number of New Customers
                                    </Form.Label>
                                    <Form.Control 
                                        type="number"
                                        name="newCustomers"
                                        placeholder="e.g. 100"
                                        value={data.newCustomers}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <div className="d-flex gap-3">
                                    <Button 
                                        className="btn-premium flex-grow-1 py-3 d-flex align-items-center justify-content-center gap-2"
                                        onClick={calculateCAC}
                                    >
                                        <FaCalculator /> Calculate CAC
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
                        {/* Main CAC Result */}
                        <Card className="premium-card border-0 shadow-lg text-center bg-gradient-red text-white">
                            <Card.Body className="p-4 p-md-5">
                                <div className="display-3 fw-bold mb-0">${results.cac}</div>
                                <div className="h5 mb-0 opacity-75">Customer Acquisition Cost (CAC)</div>
                                <div className="mt-3">
                                    <span className="badge bg-white bg-opacity-20 rounded-pill px-3 py-2">
                                        Cost to acquire 1 customer
                                    </span>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Metrics Grid */}
                        <Row className="g-4 flex-grow-1">
                            <Col md={6}>
                                <Card className="premium-card border-0 shadow-lg h-100 bg-white">
                                    <Card.Body className="p-4 text-center">
                                        <div className="p-3 rounded-circle bg-danger bg-opacity-10 text-danger mx-auto mb-3" style={{ width: 'fit-content' }}>
                                            <FaDollarSign size={20} />
                                        </div>
                                        <div className="h3 fw-bold mb-1">${results.totalSpend}</div>
                                        <div className="text-muted small uppercase fw-bold">Total Acquisition Spend</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="premium-card border-0 shadow-lg h-100 bg-white">
                                    <Card.Body className="p-4 text-center">
                                        <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary mx-auto mb-3" style={{ width: 'fit-content' }}>
                                            <FaAdn size={20} />
                                        </div>
                                        <div className="h3 fw-bold mb-1">{results.marketingRatio}%</div>
                                        <div className="text-muted small uppercase fw-bold">Marketing Cost Ratio</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={12}>
                                <Card className="premium-card border-0 shadow-lg h-100 bg-white">
                                    <Card.Body className="p-4 d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-3 text-start">
                                            <div className="p-3 rounded-circle bg-red-100 text-red-600">
                                                <FaArrowTrendDown size={20} />
                                            </div>
                                            <div>
                                                <div className="h4 fw-bold mb-0">Optimization Path</div>
                                                <div className="text-muted small uppercase fw-bold">Efficiency Focus</div>
                                            </div>
                                        </div>
                                        <div className="text-muted small italic px-3 border-start max-w-250">
                                            {results.cac > 50 ? 'Focus on organic growth or improve ad conversion to lower your CAC.' : 'Your acquisition efficiency looks healthy for mid-tier products.'}
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
                    <FaRegLightbulb className="text-warning" /> Understanding CAC
                </h5>
                <Row className="g-4">
                    <Col md={4}>
                        <div className="d-flex gap-3">
                            <div className="text-primary"><FaCircleInfo /></div>
                            <div>
                                <div className="fw-bold small mb-1">What is CAC?</div>
                                <p className="extra-small text-muted mb-0">Total cost of sales and marketing efforts, plus tech, divided by the number of customers acquired during a specific period.</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="d-flex gap-3">
                            <div className="text-success"><FaCircleInfo /></div>
                            <div>
                                <div className="fw-bold small mb-1">LTV:CAC Ratio</div>
                                <p className="extra-small text-muted mb-0">The benchmark for a good SaaS business is a 3:1 ratio. Your Customer Lifetime Value should be 3x your CAC.</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="d-flex gap-3">
                            <div className="text-danger"><FaCircleInfo /></div>
                            <div>
                                <div className="fw-bold small mb-1">Payback Period</div>
                                <p className="extra-small text-muted mb-0">The time it takes for a customer to generate enough revenue to cover the cost of acquiring them.</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default CACCalculator;
