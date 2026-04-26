import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Row, Col, Form, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaSearch, FaShieldAlt, FaLock, FaCalendarAlt, FaIdCard, FaGlobe, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const SslChecker = () => {
    const [domain, setDomain] = useState('');
    const [cert, setCert] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchSslData = useCallback(async (searchDomain) => {
        if (!searchDomain) return;
        setLoading(true);
        setError('');
        setCert(null);

        // Sanitize domain (remove http/https and trailing slashes)
        const cleanDomain = searchDomain.replace(/^(https?:\/\/)/, '').replace(/\/$/, '').toLowerCase().trim();

        try {
            // Using Certificate Transparency logs via crt.sh and AllOrigins proxy
            const targetUrl = `https://crt.sh/?q=${cleanDomain}&output=json`;
            const response = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
            
            const logs = JSON.parse(response.data.contents);

            if (!logs || logs.length === 0) {
                throw new Error('No certificates found for this domain.');
            }

            // Get the most recent certificate
            const latestCert = logs.sort((a, b) => new Date(b.not_after) - new Date(a.not_after))[0];
            
            // Calculate days remaining
            const expiryDate = new Date(latestCert.not_after);
            const today = new Date();
            const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
            const totalDays = Math.ceil((expiryDate - new Date(latestCert.not_before)) / (1000 * 60 * 60 * 24));
            const progress = Math.max(0, Math.min(100, (daysRemaining / totalDays) * 100));

            setCert({
                ...latestCert,
                daysRemaining,
                progress,
                isValid: daysRemaining > 0
            });

        } catch (err) {
            setError('Could not retrieve SSL data. Ensure the domain is correct and try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchSslData(domain);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    return (
        <div className="ssl-checker container-fluid px-0">
            <style>
                {`
                .ssl-checker { animation: fadeIn 0.8s ease-out; color: #1e293b; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                
                .premium-glass {
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.05);
                    border-radius: 24px;
                    padding: 30px;
                    margin-bottom: 30px;
                }

                .search-bar {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 100px;
                    padding: 8px 10px 8px 25px;
                    display: flex;
                    align-items: center;
                    transition: all 0.3s ease;
                }

                .search-bar:focus-within {
                    border-color: #2563eb;
                    background: #ffffff;
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                }

                .domain-input {
                    background: transparent;
                    border: none;
                    flex: 1;
                    padding: 8px 0;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #1e293b;
                    outline: none !important;
                }

                .status-card {
                    background: #ffffff;
                    border: 1px solid #f1f5f9;
                    border-radius: 20px;
                    padding: 25px;
                    height: 100%;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                    transition: transform 0.3s ease;
                }

                .status-card:hover { transform: translateY(-4px); }

                .icon-circle {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    margin-bottom: 15px;
                }

                .expiry-box {
                    background: #f8fafc;
                    border-radius: 20px;
                    padding: 30px;
                    text-align: center;
                    border: 1px solid #e2e8f0;
                }

                .days-count {
                    font-size: 3.5rem;
                    font-weight: 800;
                    line-height: 1;
                    margin-bottom: 5px;
                }

                .progress-custom {
                    height: 10px;
                    border-radius: 10px;
                    background: #e2e8f0;
                    overflow: hidden;
                    margin: 20px 0;
                }

                .progress-bar-custom {
                    height: 100%;
                    transition: width 1s ease;
                }
                `}
            </style>

            <div className="premium-glass">
                <Form onSubmit={handleSubmit}>
                    <div className="search-bar">
                        <FaGlobe className="text-muted me-3" />
                        <input 
                            type="text" 
                            className="domain-input" 
                            placeholder="Check SSL (e.g. google.com)" 
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                        />
                        <Button 
                            type="submit" 
                            variant="primary" 
                            className="rounded-pill px-4 py-2"
                            disabled={loading}
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : <><FaSearch className="me-2" /> Check</>}
                        </Button>
                    </div>
                </Form>
                {error && <Alert variant="danger" className="mt-3 border-0 rounded-4 small"><FaInfoCircle className="me-2" /> {error}</Alert>}
            </div>

            {cert && (
                <div className="animate-in">
                    <Row className="g-4 mb-4">
                        <Col lg={8}>
                            <div className="premium-glass h-100">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="fw-bold mb-0">Certificate Details</h4>
                                    <Badge bg={cert.isValid ? 'success' : 'danger'} className="px-3 py-2 rounded-pill">
                                        {cert.isValid ? <><FaCheckCircle className="me-1" /> VALID</> : <><FaExclamationTriangle className="me-1" /> EXPIRED</>}
                                    </Badge>
                                </div>
                                
                                <div className="mb-4">
                                    <div className="text-muted small fw-bold text-uppercase mb-1">Common Name</div>
                                    <div className="fw-bold text-primary fs-5">{cert.common_name}</div>
                                </div>

                                <Row className="g-3">
                                    <Col md={6}>
                                        <div className="p-3 bg-light rounded-4">
                                            <div className="text-muted extra-small fw-bold text-uppercase mb-1"><FaIdCard className="me-1" /> Issuer</div>
                                            <div className="small fw-bold">{cert.issuer_name.split(',')[0].replace('O=', '')}</div>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="p-3 bg-light rounded-4">
                                            <div className="text-muted extra-small fw-bold text-uppercase mb-1"><FaLock className="me-1" /> Serial Number</div>
                                            <div className="small font-monospace opacity-75">{cert.serial_number.substring(0, 16)}...</div>
                                        </div>
                                    </Col>
                                </Row>

                                <div className="mt-4">
                                    <div className="d-flex justify-content-between small fw-bold mb-2">
                                        <span>Issued: {formatDate(cert.not_before)}</span>
                                        <span>Expires: {formatDate(cert.not_after)}</span>
                                    </div>
                                    <div className="progress-custom">
                                        <div 
                                            className="progress-bar-custom" 
                                            style={{ 
                                                width: `${cert.progress}%`, 
                                                backgroundColor: cert.daysRemaining < 30 ? '#ef4444' : '#2563eb' 
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={4}>
                            <div className="expiry-box h-100 shadow-sm">
                                <div className="text-muted small fw-bold text-uppercase mb-3">Time Remaining</div>
                                <div className={`days-count ${cert.daysRemaining < 30 ? 'text-danger' : 'text-primary'}`}>
                                    {cert.daysRemaining > 0 ? cert.daysRemaining : 0}
                                </div>
                                <div className="fw-bold fs-5 text-slate-500 mb-3">Days</div>
                                <p className="text-muted small mb-0">
                                    {cert.daysRemaining > 30 
                                        ? "Your certificate is healthy and has plenty of time before renewal."
                                        : cert.daysRemaining > 0 
                                            ? "Warning: Your certificate will expire soon. Plan a renewal."
                                            : "Critical: This certificate has expired and is no longer secure."}
                                </p>
                            </div>
                        </Col>
                    </Row>
                </div>
            )}

            <div className="mt-5 pt-4 border-top border-slate-200">
                <h3 className="h5 fw-bold mb-3 d-flex align-items-center text-slate-900">
                    <FaShieldAlt className="me-2 text-success" /> Why SSL Matters?
                </h3>
                <p className="text-muted small">
                    SSL (Secure Sockets Layer) is the standard security technology for establishing an encrypted link between a web server and a browser. This link ensures that all data passed between the web server and browsers remain private and integral. A valid SSL certificate is not only crucial for security but also significantly impacts your search engine ranking (SEO) and user trust.
                </p>
                <Row className="g-3 mt-2">
                    <Col md={6}>
                        <div className="p-3 bg-light rounded-4 h-100">
                            <h6 className="fw-bold extra-small text-uppercase mb-2">Authentication</h6>
                            <p className="text-muted extra-small mb-0">SSL provides authentication, ensuring that you are sending information to the right server and not an imposter.</p>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="p-3 bg-light rounded-4 h-100">
                            <h6 className="fw-bold extra-small text-uppercase mb-2">Data Integrity</h6>
                            <p className="text-muted extra-small mb-0">It prevents unauthorized parties from altering the data sent over the network without being detected.</p>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default SslChecker;
