import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Row, Col, Form, Button, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaSearch, FaShieldAlt, FaTerminal, FaNetworkWired, FaInfoCircle, FaCheck, FaTimes, FaGlobe, FaCogs } from 'react-icons/fa';

const PortScanner = () => {
    const [host, setHost] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [parsedPorts, setParsedPorts] = useState([]);

    const runScan = useCallback(async (targetHost) => {
        if (!targetHost) return;
        setLoading(true);
        setError('');
        setResult('');
        setParsedPorts([]);

        // Sanitize host (remove http/https)
        const cleanHost = targetHost.replace(/^(https?:\/\/)/, '').replace(/\/$/, '').trim();

        try {
            // Using HackerTarget Nmap API via AllOrigins proxy
            const targetUrl = `https://api.hackertarget.com/nmap/?q=${cleanHost}`;
            const response = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
            
            const rawOutput = response.data.contents;

            if (!rawOutput || rawOutput.includes('API count exceeded') || rawOutput.includes('error')) {
                throw new Error('API limit reached or host unreachable. Please try again later.');
            }

            setResult(rawOutput);
            parseNmapOutput(rawOutput);

        } catch (err) {
            setError(err.message || 'Could not scan host. Ensure the address is correct and try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    const parseNmapOutput = (output) => {
        const lines = output.split('\n');
        const ports = [];
        const portRegex = /^(\d+)\/(\w+)\s+(\w+)\s+(.+)$/;

        lines.forEach(line => {
            const match = line.trim().match(portRegex);
            if (match) {
                ports.push({
                    port: match[1],
                    protocol: match[2],
                    status: match[3],
                    service: match[4]
                });
            }
        });
        setParsedPorts(ports);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        runScan(host);
    };

    return (
        <div className="port-scanner container-fluid px-0">
            <style>
                {`
                .port-scanner { animation: fadeIn 0.8s ease-out; color: #1e293b; }
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

                .host-input {
                    background: transparent;
                    border: none;
                    flex: 1;
                    padding: 8px 0;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #1e293b;
                    outline: none !important;
                }

                .terminal-card {
                    background: #0f172a;
                    border-radius: 20px;
                    padding: 25px;
                    color: #38bdf8;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.9rem;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                    min-height: 200px;
                    max-height: 400px;
                    overflow-y: auto;
                    border: 1px solid rgba(255,255,255,0.1);
                }

                .terminal-line { margin-bottom: 5px; line-height: 1.4; }
                .terminal-prompt { color: #10b981; margin-right: 10px; }

                .port-status-row {
                    background: #ffffff;
                    border: 1px solid #f1f5f9;
                    border-radius: 16px;
                    padding: 15px 20px;
                    margin-bottom: 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.2s;
                }

                .port-status-row:hover { transform: translateX(5px); border-color: #e2e8f0; }

                .status-badge-open { background: #ecfdf5; color: #059669; border: 1px solid #10b981; }
                .status-badge-closed { background: #fef2f2; color: #991b1b; border: 1px solid #ef4444; }

                .scan-pill {
                    background: #f1f5f9;
                    color: #64748b;
                    padding: 4px 12px;
                    border-radius: 50px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                `}
            </style>

            <div className="premium-glass">
                <Form onSubmit={handleSubmit}>
                    <div className="search-bar mb-2">
                        <FaGlobe className="text-muted me-3" />
                        <input 
                            type="text" 
                            className="host-input" 
                            placeholder="Domain or IP (e.g. google.com)" 
                            value={host}
                            onChange={(e) => setHost(e.target.value)}
                        />
                        <Button 
                            type="submit" 
                            variant="primary" 
                            className="rounded-pill px-4 py-2"
                            disabled={loading}
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : <><FaSearch className="me-2" /> Start Scan</>}
                        </Button>
                    </div>
                    <div className="px-3">
                        <small className="text-muted">Checks common ports for security auditing.</small>
                    </div>
                </Form>
                {error && <Alert variant="danger" className="mt-3 border-0 rounded-4 small"><FaInfoCircle className="me-2" /> {error}</Alert>}
            </div>

            {loading && (
                <div className="text-center py-5">
                    <Spinner animation="grow" variant="primary" className="mb-3" />
                    <h5 className="fw-bold text-slate-700">Analyzing Network Ports...</h5>
                    <p className="text-muted small">This may take a few seconds depending on the host response time.</p>
                </div>
            )}

            {result && !loading && (
                <div className="animate-in">
                    <Row className="g-4">
                        <Col lg={7}>
                            <div className="premium-glass h-100">
                                <h6 className="fw-bold mb-4 d-flex align-items-center">
                                    <FaCheck className="text-success me-2" /> Identified Services
                                </h6>
                                {parsedPorts.length > 0 ? (
                                    parsedPorts.map((p, i) => (
                                        <div key={i} className="port-status-row shadow-sm">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="fw-bold text-primary fs-5" style={{ width: '60px' }}>{p.port}</div>
                                                <div>
                                                    <div className="fw-bold small text-uppercase">{p.service}</div>
                                                    <div className="text-muted extra-small">{p.protocol.toUpperCase()} Protocol</div>
                                                </div>
                                            </div>
                                            <Badge className={`px-3 py-2 rounded-pill ${p.status === 'open' ? 'status-badge-open' : 'status-badge-closed'}`}>
                                                {p.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-5 text-muted small">
                                        <FaTimes size={30} className="mb-3 opacity-25" />
                                        <p>No common ports found open on this host.</p>
                                    </div>
                                )}
                            </div>
                        </Col>
                        <Col lg={5}>
                            <div className="terminal-card shadow-lg">
                                <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-white border-opacity-10 pb-2">
                                    <span className="small fw-bold opacity-75"><FaTerminal className="me-2" /> NMAP OUTPUT</span>
                                    <span className="scan-pill bg-white bg-opacity-10 text-white border-0">Audit Complete</span>
                                </div>
                                <div className="terminal-line">
                                    <span className="terminal-prompt">$</span> nmap -F {host}
                                </div>
                                <pre className="mb-0 text-info" style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
                                    {result}
                                </pre>
                            </div>
                        </Col>
                    </Row>
                </div>
            )}

            <div className="mt-5 pt-4 border-top border-slate-200">
                <h3 className="h5 fw-bold mb-3 d-flex align-items-center text-slate-900">
                    <FaShieldAlt className="me-2 text-success" /> Why Port Scanning?
                </h3>
                <p className="text-muted small">
                    Port scanning is a technique used to identify which ports on a network are open and could be receiving or sending data. It is also used to send packets to specific ports on a host and analyze the responses to identify vulnerabilities. In a security audit, this helps administrators ensure that only necessary services (like HTTPS on port 443) are accessible to the public, while sensitive ones (like Database ports) are properly firewalled.
                </p>
                <div className="p-3 bg-light rounded-4 mt-3 border border-slate-200 border-opacity-50">
                    <h6 className="fw-bold extra-small text-uppercase mb-2 text-primary"><FaCogs className="me-2" /> Common Ports Reference</h6>
                    <Row className="g-2 text-muted extra-small">
                        <Col xs={4}><strong>21:</strong> FTP</Col>
                        <Col xs={4}><strong>22:</strong> SSH</Col>
                        <Col xs={4}><strong>25:</strong> SMTP</Col>
                        <Col xs={4}><strong>80:</strong> HTTP</Col>
                        <Col xs={4}><strong>443:</strong> HTTPS</Col>
                        <Col xs={4}><strong>3306:</strong> MySQL</Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default PortScanner;
