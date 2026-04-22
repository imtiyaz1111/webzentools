import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Spinner } from 'react-bootstrap';
import { FaExchangeAlt, FaSync, FaChartLine, FaGlobeAmericas, FaHistory } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';
import './CurrencyConverter.css';

const CurrencyConverter = () => {
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('INR');
    const [rate, setRate] = useState(null);
    const [convertedAmount, setConvertedAmount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currencies, setCurrencies] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Common currencies for the quick view
    const quickCurrencies = ['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'AED'];

    useEffect(() => {
        // Fetch supported currencies
        const fetchCurrencies = async () => {
            try {
                const response = await axios.get('https://api.frankfurter.app/currencies');
                setCurrencies(Object.keys(response.data));
            } catch (error) {
                console.error("Error fetching currencies:", error);
                // Fallback list of common currencies if API fails
                setCurrencies(['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'AED', 'SGD', 'CNY']);
            }
        };
        fetchCurrencies();
    }, []);

    const fetchRate = async (currentAmount) => {
        if (!currentAmount || isNaN(currentAmount)) {
            setConvertedAmount(0);
            return;
        }

        if (fromCurrency === toCurrency) {
            setRate(1);
            setConvertedAmount(currentAmount);
            return;
        }

        setLoading(true);
        try {
            // Using axios for more reliable requests and better error handling
            const response = await axios.get('https://api.frankfurter.app/latest', {
                params: {
                    amount: currentAmount,
                    from: fromCurrency,
                    to: toCurrency
                }
            });
            
            const data = response.data;
            if (data.rates && data.rates[toCurrency]) {
                setConvertedAmount(data.rates[toCurrency]);
                setRate(data.rates[toCurrency] / currentAmount);
                setLastUpdated(data.date);
            }
        } catch (error) {
            console.error("Primary API Error:", error);
            
            // Fallback API if Frankfurter fails
            try {
                const fallbackResponse = await axios.get(`https://open.er-api.com/v6/latest/${fromCurrency}`);
                const fallbackData = fallbackResponse.data;
                
                if (fallbackData.result === "success" && fallbackData.rates[toCurrency]) {
                    const exchangeRate = fallbackData.rates[toCurrency];
                    setRate(exchangeRate);
                    setConvertedAmount(currentAmount * exchangeRate);
                    setLastUpdated(new Date().toISOString().split('T')[0]);
                } else {
                    throw new Error("Fallback failed");
                }
            } catch (fallbackError) {
                console.error("Secondary API Error:", fallbackError);
                setRate(null);
                setConvertedAmount(null);
                toast.error("Exchange rate service is currently unavailable. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchRate(parseFloat(amount));
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [amount, fromCurrency, toCurrency]);

    const handleSwap = () => {
        const temp = fromCurrency;
        setFromCurrency(toCurrency);
        setToCurrency(temp);
    };

    return (
        <div className="currency-converter-container">
            <div className="premium-card overflow-hidden">
                <Row className="g-0">
                    {/* Left Column: Inputs */}
                    <Col lg={7} className="input-section border-end border-light">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold mb-0 text-dark">Convert Currency</h4>
                            <button className="btn btn-link text-muted p-0 text-decoration-none small" onClick={() => setAmount(1)}>
                                <FaSync className="me-1" /> Reset
                            </button>
                        </div>

                        <Form>
                            <Form.Group className="mb-4">
                                <Form.Label className="form-label">Amount</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    className="premium-input"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                />
                            </Form.Group>

                            <Row className="g-3 align-items-end">
                                <Col sm={5}>
                                    <Form.Group>
                                        <Form.Label className="form-label">From</Form.Label>
                                        <Form.Select 
                                            className="premium-select"
                                            value={fromCurrency}
                                            onChange={(e) => setFromCurrency(e.target.value)}
                                        >
                                            {currencies.map(curr => (
                                                <option key={curr} value={curr}>{curr}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col sm={2} className="text-center">
                                    <div className="swap-button-wrapper">
                                        <button type="button" className="swap-btn" onClick={handleSwap}>
                                            <FaExchangeAlt />
                                        </button>
                                    </div>
                                </Col>

                                <Col sm={5}>
                                    <Form.Group>
                                        <Form.Label className="form-label">To</Form.Label>
                                        <Form.Select 
                                            className="premium-select"
                                            value={toCurrency}
                                            onChange={(e) => setToCurrency(e.target.value)}
                                        >
                                            {currencies.map(curr => (
                                                <option key={curr} value={curr}>{curr}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>

                        <div className="mt-5 p-3 bg-light rounded-4 d-flex gap-3 align-items-center">
                            <div className="p-2 bg-white rounded-3 text-primary shadow-sm">
                                <FaGlobeAmericas />
                            </div>
                            <div>
                                <p className="small fw-bold text-dark mb-0">Global Live Rates</p>
                                <p className="text-muted mb-0" style={{ fontSize: '0.7rem' }}>We use real-time market data to provide the most accurate conversions.</p>
                            </div>
                        </div>
                    </Col>

                    {/* Right Column: Results */}
                    <Col lg={5} className="result-section">
                        {loading ? (
                            <div className="text-center">
                                <Spinner animation="border" variant="primary" />
                                <p className="text-muted mt-3 small">Fetching live rates...</p>
                            </div>
                        ) : (
                            <>
                                <div className="result-main">
                                    <div className="result-currency mb-2">{amount} {fromCurrency} =</div>
                                    <div className="result-amount">
                                        {convertedAmount ? parseFloat(convertedAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                                    </div>
                                    <div className="result-currency mt-2">{toCurrency}</div>
                                </div>

                                <div className="exchange-rate-info shadow-sm mb-3">
                                    1 {fromCurrency} = {rate ? rate.toFixed(4) : '0.0000'} {toCurrency}
                                </div>

                                {lastUpdated && (
                                    <div className="last-updated d-flex align-items-center justify-content-center gap-1">
                                        <FaHistory size={12} /> Last Updated: {lastUpdated}
                                    </div>
                                )}
                            </>
                        )}
                    </Col>
                </Row>
            </div>

            {/* Popular Conversions */}
            <div className="mt-5 pt-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h3 className="h4 fw-bold text-dark mb-0">Popular Conversions</h3>
                    <span className="badge bg-primary rounded-pill px-3 py-2">Live Market Data</span>
                </div>
                
                <div className="currency-grid">
                    {quickCurrencies.map(curr => (
                        <div key={curr} className="currency-mini-card shadow-sm">
                            <div className="mini-card-label mb-1">1 {fromCurrency} to</div>
                            <div className="mini-card-value text-primary">{curr}</div>
                            {/* Simple mock value for quick view or fetch them all if needed */}
                            <div className="small text-muted mt-2">Check Rate <FaChartLine className="ms-1" size={10} /></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CurrencyConverter;
