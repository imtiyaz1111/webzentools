import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { Row, Col, Form, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaLock, FaKey, FaShieldAlt, FaCheck, FaTimes, FaCopy, FaSyncAlt, FaInfoCircle } from 'react-icons/fa';

const BcryptGenerator = () => {
    // Generate State
    const [genInput, setGenInput] = useState('');
    const [rounds, setRounds] = useState(10);
    const [genHash, setGenHash] = useState('');
    const [generating, setGenerating] = useState(false);
    const [genCopied, setGenCopied] = useState(false);

    // Verify State
    const [verifyText, setVerifyText] = useState('');
    const [verifyHash, setVerifyHash] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [verifyResult, setVerifyResult] = useState(null); // null, true, false

    const handleGenerate = async () => {
        if (!genInput) return;
        setGenerating(true);
        try {
            // Using a small timeout to let the UI update before blocking the main thread
            await new Promise(resolve => setTimeout(resolve, 50));
            const salt = bcrypt.genSaltSync(rounds);
            const hash = bcrypt.hashSync(genInput, salt);
            setGenHash(hash);
        } catch (err) {
            console.error(err);
        } finally {
            setGenerating(false);
        }
    };

    const handleVerify = async () => {
        if (!verifyText || !verifyHash) return;
        setVerifying(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 50));
            const isValid = bcrypt.compareSync(verifyText, verifyHash);
            setVerifyResult(isValid);
        } catch (err) {
            setVerifyResult(false);
        } finally {
            setVerifying(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setGenCopied(true);
        setTimeout(() => setGenCopied(false), 2000);
    };

    return (
        <div className="bcrypt-generator container-fluid px-0">
            <style>
                {`
                .bcrypt-generator { animation: fadeIn 0.8s ease-out; color: #1e293b; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                
                .premium-glass {
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.05);
                    border-radius: 24px;
                    padding: 30px;
                    margin-bottom: 30px;
                }

                .config-section {
                    background: #f8fafc;
                    border-radius: 20px;
                    padding: 25px;
                    margin-bottom: 25px;
                    border: 1px solid #e2e8f0;
                }

                .bcrypt-input {
                    background: #f8fafc !important;
                    border: 1px solid #e2e8f0 !important;
                    color: #1e293b !important;
                    border-radius: 12px !important;
                    padding: 12px 15px !important;
                    font-size: 1rem !important;
                    transition: all 0.3s ease !important;
                    font-family: 'JetBrains Mono', monospace;
                }

                .bcrypt-input:focus {
                    border-color: #2563eb !important;
                    background: #ffffff !important;
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1) !important;
                }

                .result-card {
                    background: #f1f5f9;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    padding: 20px;
                    position: relative;
                }

                .hash-text {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.9rem;
                    word-break: break-all;
                    color: #334155;
                }

                .mode-title {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: #0f172a;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .verify-indicator {
                    border-radius: 12px;
                    padding: 20px;
                    text-align: center;
                    font-weight: 800;
                    font-size: 1.1rem;
                    margin-top: 20px;
                    animation: zoomIn 0.3s ease;
                }

                @keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

                .success-bg { background: #ecfdf5; color: #059669; border: 1px solid #10b981; }
                .danger-bg { background: #fef2f2; color: #991b1b; border: 1px solid #ef4444; }

                .copy-toast {
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
                `}
            </style>

            <Row className="g-4">
                <Col lg={6}>
                    <div className="premium-glass h-100">
                        <div className="mode-title"><FaKey className="text-primary" /> Generate Hash</div>
                        
                        <div className="config-section">
                            <Form.Group className="mb-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <Form.Label className="small fw-bold">Cost Factor (Rounds)</Form.Label>
                                    <Badge bg="primary">{rounds}</Badge>
                                </div>
                                <Form.Range 
                                    min={4} max={15} value={rounds} 
                                    onChange={(e) => setRounds(parseInt(e.target.value))} 
                                />
                                <div className="d-flex justify-content-between mt-2 text-muted extra-small">
                                    <span>Fast (4)</span>
                                    <span>Secure (15)</span>
                                </div>
                            </Form.Group>
                        </div>

                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold">Plain Text String</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter text to hash..." 
                                value={genInput}
                                onChange={(e) => setGenInput(e.target.value)}
                                className="bcrypt-input"
                            />
                        </Form.Group>

                        <Button 
                            variant="primary" 
                            className="w-100 rounded-pill py-3 fw-bold mb-4"
                            onClick={handleGenerate}
                            disabled={generating || !genInput}
                        >
                            {generating ? <Spinner animation="border" size="sm" className="me-2" /> : <FaSyncAlt className="me-2" />}
                            {generating ? 'Hashing...' : 'Generate Bcrypt Hash'}
                        </Button>

                        {genHash && (
                            <div className="result-card shadow-sm animate-in">
                                {genCopied && <div className="copy-toast"><FaCheck className="me-1" /> Copied</div>}
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="extra-small text-muted fw-bold">RESULTING HASH</span>
                                    <Button variant="link" className="p-0 text-primary small fw-bold" onClick={() => copyToClipboard(genHash)}>
                                        <FaCopy className="me-1" /> Copy
                                    </Button>
                                </div>
                                <div className="hash-text">{genHash}</div>
                            </div>
                        )}
                    </div>
                </Col>

                <Col lg={6}>
                    <div className="premium-glass h-100">
                        <div className="mode-title"><FaShieldAlt className="text-success" /> Verify Hash</div>
                        
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Plain Text String</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Password or string..." 
                                value={verifyText}
                                onChange={(e) => setVerifyText(e.target.value)}
                                className="bcrypt-input"
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold">Bcrypt Hash to Compare</Form.Label>
                            <Form.Control 
                                as="textarea"
                                rows={2}
                                placeholder="$2a$10$..." 
                                value={verifyHash}
                                onChange={(e) => setVerifyHash(e.target.value)}
                                className="bcrypt-input"
                            />
                        </Form.Group>

                        <Button 
                            variant="outline-primary" 
                            className="w-100 rounded-pill py-3 fw-bold"
                            onClick={handleVerify}
                            disabled={verifying || !verifyText || !verifyHash}
                        >
                            {verifying ? <Spinner animation="border" size="sm" className="me-2" /> : <FaShieldAlt className="me-2" />}
                            {verifying ? 'Verifying...' : 'Check Match'}
                        </Button>

                        {verifyResult !== null && (
                            <div className={`verify-indicator ${verifyResult ? 'success-bg' : 'danger-bg'}`}>
                                {verifyResult ? (
                                    <><FaCheck className="me-2" /> Match Successful!</>
                                ) : (
                                    <><FaTimes className="me-2" /> No Match Found</>
                                )}
                            </div>
                        )}
                        
                        <div className="mt-4 p-3 bg-light rounded-4 small">
                            <FaInfoCircle className="me-2 text-primary" />
                            <span className="text-muted">Bcrypt hashes are salted, meaning the same input will produce different hashes every time. Use this tool to verify if a password matches a hash.</span>
                        </div>
                    </div>
                </Col>
            </Row>

            <div className="mt-5 pt-4 border-top border-slate-200">
                <h3 className="h5 fw-bold mb-3 d-flex align-items-center text-slate-900">
                    <FaLock className="me-2 text-primary" /> Why Bcrypt?
                </h3>
                <p className="text-muted small">
                    Bcrypt is a password-hashing function designed by Niels Provos and David Mazières, based on the Blowfish cipher. It is the gold standard for password storage because it is **computationally expensive** by design. By using a "cost factor," it protects against brute-force attacks by making the hashing process slow enough to discourage attackers, while remaining fast enough for legitimate users.
                </p>
            </div>
        </div>
    );
};

export default BcryptGenerator;
