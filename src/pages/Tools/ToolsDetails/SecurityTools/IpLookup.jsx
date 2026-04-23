import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Row, Col, Form, Button, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaSearch, FaMapMarkerAlt, FaGlobe, FaNetworkWired, FaInfoCircle, FaClock, FaSatellite, FaCopy } from 'react-icons/fa';

const IpLookup = () => {
    const [ip, setIp] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const fetchIpData = useCallback(async (searchIp = '') => {
        setLoading(true);
        setError('');
        try {
            const url = searchIp ? `https://ipapi.co/${searchIp}/json/` : 'https://ipapi.co/json/';
            const response = await axios.get(url);
            if (response.data.error) {
                throw new Error(response.data.reason || 'Invalid IP Address');
            }
            setData(response.data);
            if (!searchIp) setIp(response.data.ip);
        } catch (err) {
            setError(err.message || 'Failed to fetch IP data. Please check the address and try again.');
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchIpData();
    }, [fetchIpData]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (ip.trim()) fetchIpData(ip.trim());
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const InfoCard = ({ icon, label, value, color }) => (
        <div className="info-card">
            <div className="d-flex align-items-center gap-3">
                <div className="icon-box" style={{ color }}>{icon}</div>
                <div>
                    <div className="label text-muted extra-small fw-bold text-uppercase">{label}</div>
                    <div className="value fw-bold text-slate-800">{value || 'N/A'}</div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="ip-lookup container-fluid px-0">
            <style>
                {`
                .ip-lookup { animation: fadeIn 0.8s ease-out; color: #1e293b; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                
                .premium-glass {
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.05);
                    border-radius: 24px;
                    padding: 30px;
                    margin-bottom: 30px;
                }

                .search-input-group {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 100px;
                    padding: 8px 10px 8px 25px;
                    display: flex;
                    align-items: center;
                    transition: all 0.3s ease;
                }

                .search-input-group:focus-within {
                    border-color: #2563eb;
                    background: #ffffff;
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                }

                .ip-input {
                    background: transparent;
                    border: none;
                    flex: 1;
                    padding: 8px 0;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #1e293b;
                    outline: none !important;
                }

                .info-card {
                    background: #ffffff;
                    border: 1px solid #f1f5f9;
                    border-radius: 20px;
                    padding: 20px;
                    height: 100%;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                }

                .info-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                    border-color: #e2e8f0;
                }

                .icon-box {
                    width: 48px;
                    height: 48px;
                    background: #f8fafc;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                }

                .result-header {
                    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
                    color: white;
                    border-radius: 20px;
                    padding: 30px;
                    margin-bottom: 30px;
                    position: relative;
                    overflow: hidden;
                }

                .result-header::after {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -10%;
                    width: 300px;
                    height: 300px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                }

                .ip-badge {
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    padding: 8px 20px;
                    border-radius: 50px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 1.2rem;
                    font-weight: 700;
                }
                `}
            </style>

            <div className="premium-glass">
                <Form onSubmit={handleSearch}>
                    <div className="d-flex flex-column flex-md-row gap-3 align-items-center">
                        <div className="flex-grow-1 w-100">
                            <div className="search-input-group">
                                <FaGlobe className="text-muted me-3" />
                                <input 
                                    type="text" 
                                    className="ip-input" 
                                    placeholder="Enter IP Address (e.g. 8.8.8.8)" 
                                    value={ip}
                                    onChange={(e) => setIp(e.target.value)}
                                />
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    className="rounded-pill px-4 py-2"
                                    disabled={loading}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : <><FaSearch className="me-2" /> Lookup</>}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Form>
                {error && <Alert variant="danger" className="mt-3 border-0 rounded-4 small"><FaInfoCircle className="me-2" /> {error}</Alert>}
            </div>

            {data && (
                <div className="animate-in">
                    <div className="result-header shadow-lg">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h2 className="fw-bold mb-1">{data.city || 'Unknown City'}, {data.country_name}</h2>
                                <p className="mb-0 opacity-75">{data.org} • {data.asn}</p>
                            </div>
                            <div className="text-end d-none d-md-block">
                                <span className="ip-badge">{data.ip}</span>
                                <Button 
                                    variant="link" 
                                    className="text-white opacity-75 d-block w-100 mt-2 p-0 text-decoration-none small"
                                    onClick={() => copyToClipboard(data.ip)}
                                >
                                    {copied ? 'Copied!' : <><FaCopy className="me-1" /> Copy IP</>}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Row className="g-4 mb-4">
                        <Col lg={3} md={6}>
                            <InfoCard icon={<FaMapMarkerAlt />} label="Location" value={`${data.city}, ${data.region_code}`} color="#ef4444" />
                        </Col>
                        <Col lg={3} md={6}>
                            <InfoCard icon={<FaNetworkWired />} label="ISP / Provider" value={data.org} color="#3b82f6" />
                        </Col>
                        <Col lg={3} md={6}>
                            <InfoCard icon={<FaSatellite />} label="Coordinates" value={`${data.latitude}, ${data.longitude}`} color="#8b5cf6" />
                        </Col>
                        <Col lg={3} md={6}>
                            <InfoCard icon={<FaClock />} label="Timezone" value={data.timezone} color="#f59e0b" />
                        </Col>
                    </Row>

                    <div className="premium-glass p-0 overflow-hidden">
                        <div className="p-4 border-bottom bg-light">
                            <h6 className="fw-bold mb-0">Detailed Network Information</h6>
                        </div>
                        <Table responsive hover className="mb-0">
                            <tbody>
                                <tr>
                                    <td className="ps-4 text-muted small py-3" style={{ width: '200px' }}>Country Flag</td>
                                    <td className="fw-bold py-3"><span className="fs-4">{data.country_code === 'IN' ? '🇮🇳' : data.country_code}</span> {data.country_name}</td>
                                </tr>
                                <tr>
                                    <td className="ps-4 text-muted small py-3">Currency</td>
                                    <td className="fw-bold py-3">{data.currency_name} ({data.currency})</td>
                                </tr>
                                <tr>
                                    <td className="ps-4 text-muted small py-3">Calling Code</td>
                                    <td className="fw-bold py-3">+{data.country_calling_code}</td>
                                </tr>
                                <tr>
                                    <td className="ps-4 text-muted small py-3">ASN</td>
                                    <td className="fw-bold py-3"><Badge bg="secondary" className="bg-opacity-10 text-secondary">{data.asn}</Badge></td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
            )}

            <div className="mt-5 pt-4 border-top border-slate-200">
                <h3 className="h5 fw-bold mb-3 d-flex align-items-center text-slate-900">
                    <FaInfoCircle className="me-2 text-primary" /> About IP Lookup
                </h3>
                <p className="text-muted small">
                    An IP address (Internet Protocol address) is a numerical label assigned to each device connected to a computer network. IP Lookup allows you to find geographic information, network provider details, and other metadata associated with a specific IP. This tool is useful for security auditing, verifying user locations, and troubleshooting network connectivity issues.
                </p>
            </div>
        </div>
    );
};

export default IpLookup;
