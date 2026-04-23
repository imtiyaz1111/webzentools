import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Form, Button, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
import { FaCopy, FaTrash, FaLink, FaExchangeAlt, FaShieldAlt, FaInfoCircle, FaCheck } from 'react-icons/fa';

const UrlEncoderDecoder = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(false);

    const processText = useCallback(() => {
        if (!input) {
            setOutput('');
            setError(false);
            return;
        }

        try {
            if (mode === 'encode') {
                setOutput(encodeURIComponent(input));
            } else {
                setOutput(decodeURIComponent(input));
            }
            setError(false);
        } catch (e) {
            setOutput('Error: Invalid URL or Malformed Input');
            setError(true);
        }
    }, [input, mode]);

    useEffect(() => {
        processText();
    }, [processText]);

    const copyToClipboard = () => {
        if (!output || error) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleMode = () => {
        setMode(mode === 'encode' ? 'decode' : 'encode');
        setInput(output && !error ? output : '');
    };

    return (
        <div className="url-encoder-decoder container-fluid px-0">
            <style>
                {`
                .url-encoder-decoder { animation: fadeIn 0.8s ease-out; color: #1e293b; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                
                .premium-glass {
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.05);
                    border-radius: 24px;
                    padding: 30px;
                    transition: all 0.4s ease;
                }

                .mode-switcher {
                    background: #f1f5f9;
                    border-radius: 16px;
                    padding: 8px;
                    display: flex;
                    gap: 8px;
                    margin-bottom: 30px;
                    border: 1px solid rgba(0, 0, 0, 0.05);
                }

                .mode-btn {
                    flex: 1;
                    padding: 12px;
                    border-radius: 12px;
                    border: none;
                    background: transparent;
                    color: #64748b;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    font-size: 0.85rem;
                    transition: all 0.3s ease;
                }

                .mode-btn.active {
                    background: #2563eb;
                    color: #fff;
                    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
                }

                .url-textarea {
                    background: #f8fafc !important;
                    border: 1px solid #e2e8f0 !important;
                    color: #1e293b !important;
                    border-radius: 16px !important;
                    padding: 20px !important;
                    font-size: 1rem !important;
                    min-height: 180px;
                    font-family: 'JetBrains Mono', monospace;
                    transition: all 0.3s ease !important;
                }

                .url-textarea:focus {
                    border-color: #2563eb !important;
                    background: #fff !important;
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1) !important;
                }

                .output-section {
                    background: #f0f7ff;
                    border: 1px solid #cce3ff;
                    border-radius: 20px;
                    padding: 25px;
                    margin-top: 30px;
                }

                .output-box {
                    background: #fff;
                    border-radius: 12px;
                    padding: 18px;
                    color: #1e293b;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.95rem;
                    word-break: break-all;
                    min-height: 80px;
                    border: 1px solid #e2e8f0;
                    position: relative;
                }

                .error-box {
                    border-color: #fee2e2 !important;
                    color: #991b1b !important;
                    background: #fef2f2 !important;
                }

                .copy-badge {
                    position: absolute;
                    top: -10px;
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

                .stats-pill {
                    background: #f1f5f9;
                    color: #64748b;
                    padding: 6px 14px;
                    border-radius: 50px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    border: 1px solid #e2e8f0;
                }

                .info-panel {
                    border-left: 4px solid #2563eb;
                    background: #f8fafc;
                }
                `}
            </style>

            <div className="premium-glass">
                <div className="mode-switcher">
                    <button className={`mode-btn ${mode === 'encode' ? 'active' : ''}`} onClick={() => setMode('encode')}>URL Encode</button>
                    <button className={`mode-btn ${mode === 'decode' ? 'active' : ''}`} onClick={() => setMode('decode')}>URL Decode</button>
                </div>

                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                        <h6 className="fw-bold mb-0 text-slate-800">
                            <FaLink className="me-2 text-primary" /> Input URL/String
                        </h6>
                        <div className="d-flex gap-3 align-items-center">
                            <span className="stats-pill">{input.length} Characters</span>
                            <Button variant="link" className="text-danger p-0 text-decoration-none small" onClick={() => setInput('')}>
                                <FaTrash className="me-1" /> Clear
                            </Button>
                        </div>
                    </div>
                    <Form.Control 
                        as="textarea" 
                        placeholder={mode === 'encode' ? "Paste text here..." : "Paste encoded URL here..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="url-textarea"
                    />
                </div>

                <div className="d-flex justify-content-center">
                    <Button variant="outline-primary" className="rounded-pill px-4 py-2 small fw-bold" onClick={toggleMode}>
                        <FaExchangeAlt className="me-2" /> Swap Output to Input
                    </Button>
                </div>

                <div className="output-section">
                    <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                        <h6 className="fw-bold mb-0 text-primary">
                            <FaCheck className="me-2" /> Resulting Output
                        </h6>
                        {output && !error && (
                            <Button variant="primary" className="rounded-pill px-3 btn-sm fw-bold" onClick={copyToClipboard}>
                                <FaCopy className="me-2" /> Copy Result
                            </Button>
                        )}
                    </div>
                    <div className={`output-box ${error ? 'error-box' : ''}`}>
                        {copied && <div className="copy-badge"><FaCheck className="me-1" /> Copied</div>}
                        {output || <span className="text-muted small">Your result will appear here...</span>}
                    </div>
                </div>
            </div>

            <div className="mt-5 pt-4 border-top border-slate-200">
                <Row className="gy-4">
                    <Col md={7}>
                        <h3 className="h5 fw-bold mb-3 d-flex align-items-center text-slate-900">
                            <FaShieldAlt className="me-2 text-success" /> Why Encode URLs?
                        </h3>
                        <p className="text-muted small">
                            URLs can only be sent over the Internet using the ASCII character-set. URL encoding replaces unsafe ASCII characters with a "%" followed by two hexadecimal digits.
                        </p>
                    </Col>
                    <Col md={5}>
                        <div className="p-4 premium-glass h-100 bg-slate-50">
                            <h6 className="fw-bold text-slate-800 small mb-3">Quick Reference</h6>
                            <div className="d-flex justify-content-between text-muted extra-small border-bottom border-slate-100 pb-2 mb-2">
                                <span>Space</span> <span className="text-primary fw-bold">%20</span>
                            </div>
                            <div className="d-flex justify-content-between text-muted extra-small border-bottom border-slate-100 pb-2 mb-2">
                                <span>Slash (/)</span> <span className="text-primary fw-bold">%2F</span>
                            </div>
                            <div className="d-flex justify-content-between text-muted extra-small">
                                <span>At (@)</span> <span className="text-primary fw-bold">%40</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default UrlEncoderDecoder;
