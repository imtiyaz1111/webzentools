import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Form, Button, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
import { FaCopy, FaTrash, FaExchangeAlt, FaShieldAlt, FaInfoCircle, FaCheck, FaSyncAlt } from 'react-icons/fa';

// RFC 4648 Base32 implementation
const base32 = {
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
    encode: (str) => {
        let bin = '';
        for (let i = 0; i < str.length; i++) {
            bin += str.charCodeAt(i).toString(2).padStart(8, '0');
        }
        let encoded = '';
        for (let i = 0; i < bin.length; i += 5) {
            let chunk = bin.substring(i, i + 5).padEnd(5, '0');
            encoded += base32.alphabet[parseInt(chunk, 2)];
        }
        let pad = (8 - (encoded.length % 8)) % 8;
        return encoded + '='.repeat(pad);
    },
    decode: (str) => {
        str = str.replace(/=+$/, '').toUpperCase();
        let bin = '';
        for (let i = 0; i < str.length; i++) {
            let idx = base32.alphabet.indexOf(str[i]);
            if (idx === -1) throw new Error('Invalid Base32 character');
            bin += idx.toString(2).padStart(5, '0');
        }
        let decoded = '';
        for (let i = 0; i < bin.length; i += 8) {
            let chunk = bin.substring(i, i + 8);
            if (chunk.length === 8) decoded += String.fromCharCode(parseInt(chunk, 2));
        }
        return decoded;
    }
};

const Base32Encoder = () => {
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
                setOutput(base32.encode(input));
            } else {
                setOutput(base32.decode(input));
            }
            setError(false);
        } catch (e) {
            setOutput('Error: Malformed Base32 Input');
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
        <div className="base32-encoder container-fluid px-0">
            <style>
                {`
                .base32-encoder { animation: fadeIn 0.8s ease-out; color: #1e293b; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                
                .premium-glass {
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.05);
                    border-radius: 24px;
                    padding: 30px;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .mode-switcher {
                    background: #f1f5f9;
                    border-radius: 16px;
                    padding: 8px;
                    display: flex;
                    gap: 8px;
                    margin-bottom: 30px;
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
                    background: #ffffff !important;
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
                    background: #ffffff;
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
                `}
            </style>

            <div className="premium-glass">
                <div className="mode-switcher">
                    <button className={`mode-btn ${mode === 'encode' ? 'active' : ''}`} onClick={() => setMode('encode')}>Base32 Encode</button>
                    <button className={`mode-btn ${mode === 'decode' ? 'active' : ''}`} onClick={() => setMode('decode')}>Base32 Decode</button>
                </div>

                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                        <h6 className="fw-bold mb-0">
                            <FaSyncAlt className="me-2 text-primary" /> Input String
                        </h6>
                        <div className="d-flex gap-3 align-items-center">
                            <span className="stats-pill">{input.length} Chars</span>
                            <Button variant="link" className="text-danger p-0 text-decoration-none small" onClick={() => setInput('')}>
                                <FaTrash className="me-1" /> Clear
                            </Button>
                        </div>
                    </div>
                    <Form.Control 
                        as="textarea" 
                        placeholder={mode === 'encode' ? "Paste standard text here..." : "Paste Base32 string here..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="url-textarea"
                    />
                </div>

                <div className="d-flex justify-content-center">
                    <Button variant="outline-primary" className="rounded-pill px-4 py-2 small fw-bold" onClick={toggleMode}>
                        <FaExchangeAlt className="me-2" /> Swap Result to Input
                    </Button>
                </div>

                <div className="output-section">
                    <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                        <h6 className="fw-bold mb-0 text-primary">
                            <FaCheck className="me-2" /> Processed Output
                        </h6>
                        {output && !error && (
                            <Button variant="primary" className="rounded-pill px-3 btn-sm fw-bold" onClick={copyToClipboard}>
                                <FaCopy className="me-2" /> Copy Result
                            </Button>
                        )}
                    </div>
                    <div className={`output-box ${error ? 'border-danger text-danger bg-danger bg-opacity-10' : ''}`}>
                        {copied && <div className="copy-badge"><FaCheck className="me-1" /> Copied</div>}
                        {output || <span className="text-muted small">Your result will appear here...</span>}
                    </div>
                    {error && <div className="mt-2 text-danger extra-small px-1"><FaInfoCircle className="me-1" /> The input contains invalid Base32 characters.</div>}
                </div>
            </div>

            <div className="mt-5 pt-4 border-top border-slate-200">
                <Row className="gy-4">
                    <Col md={7}>
                        <h3 className="h5 fw-bold mb-3 d-flex align-items-center text-slate-900">
                            <FaShieldAlt className="me-2 text-success" /> What is Base32?
                        </h3>
                        <p className="text-muted small">
                            Base32 is a notation for encoding arbitrary byte data using a restricted set of 32 characters. Unlike Base64, it is case-insensitive and avoids characters like '1', '8', and '0' which can be easily confused in certain fonts. This makes it ideal for human-readable codes, such as those used in **2FA/TOTP authentication** (Google Authenticator) and legacy file systems.
                        </p>
                    </Col>
                    <Col md={5}>
                        <div className="p-4 premium-glass h-100 bg-slate-50 border-0 shadow-none">
                            <h6 className="fw-bold text-slate-800 small mb-3">RFC 4648 Alphabet</h6>
                            <div className="d-flex flex-wrap gap-2">
                                {'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 2 3 4 5 6 7'.split(' ').map((char, i) => (
                                    <Badge key={i} bg="white" className="text-slate-600 border border-slate-200 px-2 py-1">{char}</Badge>
                                ))}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Base32Encoder;
