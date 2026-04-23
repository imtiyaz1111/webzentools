import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Row, Col, Form, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaSearch, FaMicrochip, FaNetworkWired, FaInfoCircle, FaShieldAlt, FaCopy, FaCheck, FaDesktop, FaWifi } from 'react-icons/fa';

const MacLookup = () => {
    const [mac, setMac] = useState('');
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const fetchVendorData = useCallback(async (searchMac) => {
        if (!searchMac) return;
        setLoading(true);
        setError('');
        setVendor(null);

        // Basic sanitization
        const cleanMac = searchMac.replace(/[^a-fA-F0-9]/g, '').toLowerCase();
        
        if (cleanMac.length < 6) {
            setError('Please enter at least the first 6 hex characters (OUI).');
            setLoading(false);
            return;
        }

        try {
            // Using MacVendors API via AllOrigins proxy
            const targetUrl = `https://api.macvendors.com/${searchMac.trim()}`;
            const response = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
            
            if (response.data.contents === "Vendor not found") {
                throw new Error('Vendor not found for this MAC OUI.');
            }

            setVendor({
                name: response.data.contents,
                mac: searchMac.trim(),
                oui: cleanMac.substring(0, 6).toUpperCase().match(/.{1,2}/g).join(':')
            });

        } catch (err) {
            setError('Could not find vendor. Ensure the MAC address is correct or try another one.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchVendorData(mac);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mac-lookup container-fluid px-0">
            <style>
                {`
                .mac-lookup { animation: fadeIn 0.8s ease-out; color: #1e293b; }
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

                .mac-input {
                    background: transparent;
                    border: none;
                    flex: 1;
                    padding: 8px 0;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #1e293b;
                    outline: none !important;
                    font-family: 'JetBrains Mono', monospace;
                }

                .vendor-card {
                    background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
                    border: 1px solid #e2e8f0;
                    border-radius: 24px;
                    padding: 40px;
                    text-align: center;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.03);
                    position: relative;
                }

                .oui-badge {
                    background: #e0f2fe;
                    color: #0369a1;
                    padding: 6px 15px;
                    border-radius: 50px;
                    font-family: 'JetBrains Mono', monospace;
                    font-weight: 700;
                    font-size: 0.9rem;
                    display: inline-block;
                    margin-bottom: 20px;
                }

                .vendor-name {
                    font-size: 2.2rem;
                    font-weight: 800;
                    color: #0f172a;
                    margin-bottom: 10px;
                    line-height: 1.2;
                }

                .device-icons {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-top: 30px;
                    opacity: 0.5;
                }

                .copy-feedback {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: #059669;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 50px;
                    font-size: 0.75rem;
                    font-weight: bold;
                    animation: slideDown 0.3s ease;
                }

                @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                `}
            </style>

            <div className="premium-glass">
                <Form onSubmit={handleSubmit}>
                    <div className="search-bar mb-2">
                        <FaNetworkWired className="text-muted me-3" />
                        <input 
                            type="text" 
                            className="mac-input" 
                            placeholder="XX:XX:XX:XX:XX:XX" 
                            value={mac}
                            onChange={(e) => setMac(e.target.value)}
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
                    <div className="px-3">
                        <small className="text-muted">Supports formats like 00:00:00, 00-00-00, or 000000</small>
                    </div>
                </Form>
                {error && <Alert variant="danger" className="mt-3 border-0 rounded-4 small"><FaInfoCircle className="me-2" /> {error}</Alert>}
            </div>

            {vendor && (
                <div className="animate-in">
                    <div className="vendor-card shadow-sm">
                        {copied && <div className="copy-feedback"><FaCheck className="me-1" /> Copied</div>}
                        <div className="oui-badge">OUI: {vendor.oui}</div>
                        <div className="vendor-name">{vendor.name}</div>
                        <p className="text-muted mb-4">Hardware Manufacturer identified for MAC prefix</p>
                        
                        <div className="d-flex justify-content-center gap-3">
                            <Button 
                                variant="primary" 
                                className="rounded-pill px-4 py-2 fw-bold"
                                onClick={() => copyToClipboard(vendor.name)}
                            >
                                <FaCopy className="me-2" /> Copy Vendor Name
                            </Button>
                        </div>

                        <div className="device-icons">
                            <FaDesktop size={24} title="Workstation" />
                            <FaWifi size={24} title="Networking" />
                            <FaMicrochip size={24} title="Embedded Systems" />
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-5 pt-4 border-top border-slate-200">
                <Row className="gy-4">
                    <Col md={7}>
                        <h3 className="h5 fw-bold mb-3 d-flex align-items-center text-slate-900">
                            <FaShieldAlt className="me-2 text-success" /> What is a MAC OUI?
                        </h3>
                        <p className="text-muted small">
                            A Media Access Control (MAC) address is a unique identifier assigned to a network interface controller. The first three octets (6 characters) of the address are known as the **Organizationally Unique Identifier (OUI)**. This prefix is uniquely assigned to hardware manufacturers (like Apple, Intel, or Cisco) by the IEEE, allowing you to identify the maker of any network device.
                        </p>
                    </Col>
                    <Col md={5}>
                        <div className="p-4 premium-glass h-100 bg-slate-50 border-0 shadow-none">
                            <h6 className="fw-bold text-slate-800 small mb-3">Example Prefixes</h6>
                            <div className="d-flex justify-content-between text-muted extra-small border-bottom border-slate-100 pb-2 mb-2">
                                <span>Apple Inc.</span> <span className="text-primary fw-bold">00:03:93</span>
                            </div>
                            <div className="d-flex justify-content-between text-muted extra-small border-bottom border-slate-100 pb-2 mb-2">
                                <span>Google LLC</span> <span className="text-primary fw-bold">3C:5A:B4</span>
                            </div>
                            <div className="d-flex justify-content-between text-muted extra-small">
                                <span>Cisco Systems</span> <span className="text-primary fw-bold">00:00:0C</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default MacLookup;
