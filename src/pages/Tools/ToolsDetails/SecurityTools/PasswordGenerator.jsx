import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Form, Button, Badge } from 'react-bootstrap';
import { FaCopy, FaSyncAlt, FaShieldAlt, FaHistory, FaCheck, FaTimes, FaLock, FaKey, FaShieldVirus, FaHashtag } from 'react-icons/fa';

const PasswordGenerator = () => {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true
    });
    const [strength, setStrength] = useState({ score: 0, label: 'Weak', color: '#dc3545', icon: <FaShieldAlt /> });
    const [history, setHistory] = useState([]);
    const [copied, setCopied] = useState(false);

    const generatePassword = useCallback(() => {
        const charSets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
        };

        let characters = '';
        Object.keys(options).forEach(key => {
            if (options[key]) characters += charSets[key];
        });

        if (!characters) {
            setPassword('');
            return;
        }

        let generatedPassword = '';
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            generatedPassword += characters.charAt(array[i] % characters.length);
        }

        setPassword(generatedPassword);
        calculateStrength(generatedPassword);
        setHistory(prev => [generatedPassword, ...prev.slice(0, 9)]);
    }, [length, options]);

    useEffect(() => {
        generatePassword();
    }, [generatePassword]);

    const calculateStrength = (pwd) => {
        let score = 0;
        if (pwd.length > 8) score++;
        if (pwd.length > 12) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;

        const labels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
        const colors = ['#dc3545', '#fd7e14', '#ffc107', '#198754', '#0dcaf0'];
        const icons = [<FaTimes />, <FaShieldAlt />, <FaShieldAlt />, <FaLock />, <FaShieldVirus />];
        const index = Math.min(score, 4);
        setStrength({ score: (index + 1) * 20, label: labels[index], color: colors[index], icon: icons[index] });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleOptionChange = (key) => {
        setOptions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="password-generator container-fluid px-0">
            <style>
                {`
                .password-generator { animation: fadeIn 0.8s ease-out; color: #1e293b; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                
                .premium-glass {
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.05);
                    border-radius: 24px;
                    transition: all 0.4s ease;
                }

                .display-section {
                    background: linear-gradient(145deg, #f8fafc 0%, #ffffff 100%);
                    padding: 40px;
                    margin-bottom: 30px;
                    text-align: center;
                    position: relative;
                }

                .password-main {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 2rem;
                    color: #0f172a;
                    word-break: break-all;
                    letter-spacing: 2px;
                    margin: 20px 0;
                }

                .strength-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 20px;
                    border-radius: 50px;
                    font-weight: 700;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    letter-spacing: 1px;
                }

                .config-card {
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    border-radius: 20px;
                    padding: 25px;
                    height: 100%;
                }

                .option-pill {
                    cursor: pointer;
                    padding: 12px 18px;
                    border-radius: 12px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 12px;
                }

                .option-pill:hover {
                    background: #f1f5f9;
                    transform: translateX(4px);
                }

                .option-pill.active {
                    background: rgba(37, 99, 235, 0.05);
                    border-color: #2563eb;
                    color: #2563eb;
                }

                .history-item {
                    padding: 12px;
                    border-bottom: 1px solid #f1f5f9;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .copy-toast {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: #059669;
                    color: white;
                    padding: 5px 15px;
                    border-radius: 50px;
                    font-size: 0.8rem;
                    font-weight: bold;
                    animation: slideDown 0.3s ease;
                }

                @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                `}
            </style>

            <div className="display-section premium-glass">
                {copied && <div className="copy-toast"><FaCheck className="me-2" /> Copied</div>}
                <div className="strength-badge" style={{ backgroundColor: `${strength.color}15`, color: strength.color, border: `1px solid ${strength.color}30` }}>
                    {strength.icon} {strength.label}
                </div>
                <div className="password-main">{password || '••••••••••••'}</div>
                <div className="d-flex justify-content-center gap-2 mt-3">
                    <Button variant="primary" className="rounded-pill px-4 py-2 fw-bold" onClick={() => copyToClipboard(password)} disabled={!password}>
                        <FaCopy className="me-2" /> Copy
                    </Button>
                    <Button variant="outline-secondary" className="rounded-pill px-4 py-2" onClick={generatePassword}>
                        <FaSyncAlt className="me-2" /> Refresh
                    </Button>
                </div>
            </div>

            <Row className="g-4 mb-5">
                <Col lg={8}>
                    <div className="config-card shadow-sm">
                        <h6 className="fw-bold mb-4">Settings</h6>
                        <Form.Group className="mb-4">
                            <div className="d-flex justify-content-between mb-2">
                                <Form.Label className="small fw-bold">Length: <span className="text-primary">{length}</span></Form.Label>
                            </div>
                            <Form.Range min={8} max={64} value={length} onChange={(e) => setLength(parseInt(e.target.value))} />
                        </Form.Group>

                        <Row>
                            {Object.keys(options).map((key) => (
                                <Col md={6} key={key}>
                                    <div className={`option-pill ${options[key] ? 'active' : ''}`} onClick={() => handleOptionChange(key)}>
                                        <div className="d-flex align-items-center gap-2">
                                            {key === 'uppercase' && <FaKey size={14} />}
                                            {key === 'lowercase' && <FaKey size={14} />}
                                            {key === 'numbers' && <FaHashtag size={14} />}
                                            {key === 'symbols' && <FaShieldVirus size={14} />}
                                            <span className="small fw-bold">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                        </div>
                                        {options[key] ? <FaCheck /> : <FaTimes className="text-muted" />}
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Col>

                <Col lg={4}>
                    <div className="config-card shadow-sm">
                        <h6 className="fw-bold mb-4 d-flex align-items-center">
                            <FaHistory className="me-2 text-primary" /> Recent
                        </h6>
                        <div className="history-list">
                            {history.length > 0 ? (
                                history.map((pwd, index) => (
                                    <div key={index} className="history-item">
                                        <code className="text-primary small">{pwd.substring(0, 15)}...</code>
                                        <Button variant="link" className="p-0 text-muted" onClick={() => copyToClipboard(pwd)}><FaCopy size={12} /></Button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-muted small">No history</div>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>

            <div className="mt-5 pt-4 border-top border-slate-200">
                <h3 className="h5 fw-bold mb-3 d-flex align-items-center text-slate-900">
                    <FaShieldAlt className="me-2 text-success" /> Pro Tips
                </h3>
                <p className="text-muted small">
                    Use a combination of all character types and at least 16 characters for maximum security.
                </p>
            </div>
        </div>
    );
};

export default PasswordGenerator;
