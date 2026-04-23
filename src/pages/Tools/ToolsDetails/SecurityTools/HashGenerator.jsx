import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Form, Button, Card, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaHashtag, FaCopy, FaTrash, FaShieldAlt, FaInfoCircle, FaCheck, FaLock, FaKey, FaFingerprint } from 'react-icons/fa';

// Lightweight MD5 Implementation
const md5 = (string) => {
    function k(n, s) { return (n << s) | (n >>> (32 - s)); }
    function add(x, y) {
        const l = (x & 0xFFFF) + (y & 0xFFFF);
        const m = (x >> 16) + (y >> 16) + (l >> 16);
        return (m << 16) | (l & 0xFFFF);
    }
    const r = [
        7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
        5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
        4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
        6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
    ];
    const c = [];
    for (let i = 0; i < 64; i++) c[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296);
    let v = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
    const b = [];
    for (let i = 0; i < string.length; i++) b[i >> 2] |= (string.charCodeAt(i) & 0xFF) << ((i % 4) * 8);
    b[string.length >> 2] |= 0x80 << ((string.length % 4) * 8);
    b[(((string.length + 8) >> 6) << 4) + 14] = string.length * 8;
    for (let i = 0; i < b.length; i += 16) {
        let [a, d, g, h] = v;
        for (let j = 0; j < 64; j++) {
            let f, e;
            if (j < 16) { f = (d & g) | (~d & h); e = j; }
            else if (j < 32) { f = (d & h) | (g & ~h); e = (5 * j + 1) % 16; }
            else if (j < 48) { f = d ^ g ^ h; e = (3 * j + 5) % 16; }
            else { f = g ^ (d | ~h); e = (7 * j) % 16; }
            const t = h; h = g; g = d;
            d = add(d, k(add(a, add(f, add(c[j], b[i + e]))), r[j]));
            a = t;
        }
        v[0] = add(v[0], a); v[1] = add(v[1], d); v[2] = add(v[2], g); v[3] = add(v[3], h);
    }
    let res = "";
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) res += ((v[i] >> (j * 8)) & 0xFF).toString(16).padStart(2, "0");
    return res;
};

const HashGenerator = () => {
    const [input, setInput] = useState('');
    const [hashes, setHashes] = useState({ MD5: '', 'SHA-1': '', 'SHA-256': '', 'SHA-384': '', 'SHA-512': '' });
    const [copyStatus, setCopyStatus] = useState({});

    const generateHashes = useCallback(async (text) => {
        if (!text) {
            setHashes({ MD5: '', 'SHA-1': '', 'SHA-256': '', 'SHA-384': '', 'SHA-512': '' });
            return;
        }
        const newHashes = { MD5: md5(text) };
        const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
        for (const algo of algorithms) {
            try {
                const msgUint8 = new TextEncoder().encode(text);
                const hashBuffer = await crypto.subtle.digest(algo, msgUint8);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                newHashes[algo] = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            } catch (e) { newHashes[algo] = 'Not Supported'; }
        }
        setHashes(newHashes);
    }, []);

    useEffect(() => { generateHashes(input); }, [input, generateHashes]);

    const copyToClipboard = (key, text) => {
        navigator.clipboard.writeText(text);
        setCopyStatus({ ...copyStatus, [key]: true });
        setTimeout(() => setCopyStatus({ ...copyStatus, [key]: false }), 2000);
    };

    const algoIcons = {
        'MD5': <FaLock className="text-danger" />,
        'SHA-1': <FaKey className="text-warning" />,
        'SHA-256': <FaShieldAlt className="text-primary" />,
        'SHA-384': <FaFingerprint className="text-success" />,
        'SHA-512': <FaHashtag className="text-info" />
    };

    return (
        <div className="hash-generator container-fluid px-0">
            <style>
                {`
                .hash-generator { animation: fadeIn 0.8s ease-out; color: #1e293b; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                
                .premium-glass {
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.05);
                    border-radius: 24px;
                    padding: 30px;
                    margin-bottom: 30px;
                }

                .hash-textarea {
                    background: #f8fafc !important;
                    border: 1px solid #e2e8f0 !important;
                    color: #1e293b !important;
                    border-radius: 16px !important;
                    padding: 20px !important;
                    font-size: 1rem !important;
                    min-height: 120px;
                    transition: all 0.3s ease !important;
                }

                .algo-card {
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    border-radius: 20px;
                    padding: 20px;
                    height: 100%;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                }

                .algo-card:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }

                .hash-result-box {
                    background: #f1f5f9;
                    border-radius: 12px;
                    padding: 12px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.85rem;
                    word-break: break-all;
                    color: #334155;
                    min-height: 60px;
                    border: 1px solid #e2e8f0;
                    cursor: pointer;
                }

                .stats-pill {
                    background: #f1f5f9;
                    color: #64748b;
                    padding: 6px 12px;
                    border-radius: 50px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                `}
            </style>

            <div className="premium-glass">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold mb-0">Input Text</h6>
                    <div className="d-flex gap-2">
                        <span className="stats-pill">{input.length} Chars</span>
                        <Button variant="link" className="text-danger p-0 text-decoration-none small" onClick={() => setInput('')}>
                            <FaTrash className="me-1" /> Clear
                        </Button>
                    </div>
                </div>
                <Form.Control 
                    as="textarea" 
                    placeholder="Enter text here..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="hash-textarea"
                />
            </div>

            <Row className="g-4 mb-5">
                {Object.entries(hashes).map(([algo, value]) => (
                    <Col lg={4} md={6} key={algo}>
                        <div className="algo-card">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="d-flex align-items-center gap-2">
                                    {algoIcons[algo]}
                                    <span className="fw-bold small text-slate-500 uppercase tracking-wider">{algo}</span>
                                </div>
                                {copyStatus[algo] && <Badge bg="success" className="small">Copied</Badge>}
                            </div>
                            <div className="hash-result-box" onClick={() => value && copyToClipboard(algo, value)}>
                                {value || <span className="text-muted opacity-50">Waiting...</span>}
                            </div>
                            <div className="mt-3 d-flex justify-content-between align-items-center">
                                <span className="extra-small text-muted">{value ? `${value.length * 4} bits` : '0 bits'}</span>
                                <Button variant="link" className="p-0 text-primary text-decoration-none small fw-bold" onClick={() => value && copyToClipboard(algo, value)} disabled={!value}>
                                    <FaCopy className="me-1" /> Copy
                                </Button>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default HashGenerator;
