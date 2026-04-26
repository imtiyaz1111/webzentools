import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Row, Col, Form, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaSearch, FaGlobe, FaCalendarAlt, FaServer, FaUserAlt, FaInfoCircle, FaShieldAlt, FaHistory, FaCheck, FaCopy } from 'react-icons/fa';

const WhoisLookup = () => {
    const [domain, setDomain] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);
    const [copied, setCopied] = useState(false);

    const fetchWhoisData = useCallback(async (searchDomain) => {
        if (!searchDomain) return;
        setLoading(true);
        setError('');
        setData(null);

        try {
            // Using RDAP protocol via a CORS proxy
            const targetUrl = `https://rdap.org/domain/${searchDomain.toLowerCase().trim()}`;
            const response = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
            
            const rdapData = JSON.parse(response.data.contents);

            if (!rdapData || rdapData.errorCode || rdapData.error) {
                throw new Error('Domain not found or RDAP data unavailable.');
            }

            setData(rdapData);
            setHistory(prev => [searchDomain, ...prev.filter(d => d !== searchDomain).slice(0, 4)]);
        } catch (err) {
            setError('Could not fetch registration data. Ensure the domain is correct and try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchWhoisData(domain);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const getEventDate = (events, type) => {
        const event = events?.find(e => e.eventAction === type);
        return event ? formatDate(event.eventDate) : 'N/A';
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const DetailCard = ({ title, icon, children }) => (
        <div className="detail-card">
            <h6 className="fw-bold mb-3 d-flex align-items-center text-slate-700">
                <span className="icon-wrap me-2">{icon}</span> {title}
            </h6>
            {children}
        </div>
    );

    return (
        <div className="whois-lookup container-fluid px-0">
            <style>
                {`
                .whois-lookup { animation: fadeIn 0.8s ease-out; color: #1e293b; }
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

                .detail-card {
                    background: #ffffff;
                    border: 1px solid #f1f5f9;
                    border-radius: 20px;
                    padding: 25px;
                    height: 100%;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                }

                .icon-wrap {
                    color: #2563eb;
                    background: rgba(37, 99, 235, 0.05);
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                }

                .status-badge {
                    background: #ecfdf5;
                    color: #059669;
                    padding: 4px 12px;
                    border-radius: 50px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .history-pill {
                    background: #f1f5f9;
                    color: #64748b;
                    padding: 6px 15px;
                    border-radius: 50px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                }

                .history-pill:hover {
                    background: #fff;
                    border-color: #2563eb;
                    color: #2563eb;
                }

                .result-header {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    color: white;
                    border-radius: 24px;
                    padding: 40px;
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
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 50%;
                }
                `}
            </style>

            <div className="premium-glass">
                <Form onSubmit={handleSubmit}>
                    <div className="search-bar mb-3">
                        <FaGlobe className="text-muted me-3" />
                        <input 
                            type="text" 
                            className="domain-input" 
                            placeholder="Enter domain (e.g. google.com)" 
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
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
                </Form>

                {history.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 align-items-center px-1">
                        <span className="small text-muted me-2"><FaHistory className="me-1" /> Recent:</span>
                        {history.map((h, i) => (
                            <span key={i} className="history-pill" onClick={() => { setDomain(h); fetchWhoisData(h); }}>{h}</span>
                        ))}
                    </div>
                )}
                {error && <Alert variant="danger" className="mt-3 border-0 rounded-4 small"><FaInfoCircle className="me-2" /> {error}</Alert>}
            </div>

            {data && (
                <div className="animate-in">
                    <div className="result-header shadow-lg">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div>
                                <Badge bg="primary" className="mb-2 bg-opacity-25 text-white">Domain Registered</Badge>
                                <h1 className="fw-bold mb-1 text-white">{data.ldhName}</h1>
                                <div className="d-flex gap-3 small opacity-75">
                                    <span>Registrar ID: {data.entities?.[0]?.vcardArray?.[1]?.find(v => v[0] === 'fn')?.[3] || 'Unknown'}</span>
                                </div>
                            </div>
                            <div className="text-md-end">
                                <div className="status-badge mb-2">
                                    <FaCheck className="me-1" /> {data.status?.[0]?.replace(/([A-Z])/g, ' $1') || 'Active'}
                                </div>
                                <Button 
                                    variant="outline-light" 
                                    className="rounded-pill btn-sm px-3 opacity-75"
                                    onClick={() => copyToClipboard(data.ldhName)}
                                >
                                    {copied ? 'Copied!' : <><FaCopy className="me-1" /> Copy Domain</>}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Row className="g-4 mb-4">
                        <Col lg={4}>
                            <DetailCard title="Registration Timeline" icon={<FaCalendarAlt />}>
                                <div className="ps-2">
                                    <div className="mb-3 border-start ps-3 border-2 border-primary position-relative">
                                        <div className="small text-muted">Created On</div>
                                        <div className="fw-bold">{getEventDate(data.events, 'registration')}</div>
                                    </div>
                                    <div className="mb-3 border-start ps-3 border-2 border-warning position-relative">
                                        <div className="small text-muted">Last Updated</div>
                                        <div className="fw-bold">{getEventDate(data.events, 'last changed')}</div>
                                    </div>
                                    <div className="border-start ps-3 border-2 border-danger position-relative">
                                        <div className="small text-muted">Expires On</div>
                                        <div className="fw-bold">{getEventDate(data.events, 'expiration')}</div>
                                    </div>
                                </div>
                            </DetailCard>
                        </Col>
                        <Col lg={4}>
                            <DetailCard title="Name Servers" icon={<FaServer />}>
                                {data.nameservers ? (
                                    <div className="d-flex flex-column gap-2">
                                        {data.nameservers.map((ns, i) => (
                                            <div key={i} className="p-2 bg-light rounded-3 small font-monospace">{ns.ldhName}</div>
                                        ))}
                                    </div>
                                ) : <div className="text-muted small">No nameservers found</div>}
                            </DetailCard>
                        </Col>
                        <Col lg={4}>
                            <DetailCard title="Registrar Info" icon={<FaUserAlt />}>
                                <div className="small">
                                    <div className="mb-2"><span className="text-muted">Entity:</span> <span className="fw-bold">{data.entities?.[0]?.vcardArray?.[1]?.find(v => v[0] === 'fn')?.[3] || 'N/A'}</span></div>
                                    <div className="mb-2"><span className="text-muted">Country:</span> <span className="fw-bold">{data.entities?.[0]?.vcardArray?.[1]?.find(v => v[0] === 'adr')?.[3]?.[6] || 'N/A'}</span></div>
                                    <div><span className="text-muted">RDAP Source:</span> <span className="text-primary font-monospace extra-small">RDAP.ORG</span></div>
                                </div>
                            </DetailCard>
                        </Col>
                    </Row>
                </div>
            )}

            <div className="mt-5 pt-4 border-top border-slate-200">
                <h3 className="h5 fw-bold mb-3 d-flex align-items-center text-slate-900">
                    <FaShieldAlt className="me-2 text-primary" /> About WHOIS & RDAP
                </h3>
                <p className="text-muted small">
                    WHOIS is a query and response protocol that is widely used for querying databases that store the registered users or assignees of an Internet resource, such as a domain name. **RDAP (Registration Data Access Protocol)** is the modern successor to WHOIS, providing structured data and improved security. This tool helps you verify domain ownership, check expiration dates, and identify the hosting infrastructure of any website.
                </p>
            </div>
        </div>
    );
};

export default WhoisLookup;
