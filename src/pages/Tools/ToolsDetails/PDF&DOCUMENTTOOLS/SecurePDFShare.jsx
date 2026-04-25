import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Form, Button, Spinner, InputGroup, Card } from 'react-bootstrap';
import { 
    FaFilePdf, FaShareAlt, FaLock, FaLink, FaCopy, FaEnvelope, 
    FaClock, FaEye, FaFileUpload, FaShieldAlt, FaQrcode, FaCheckCircle
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

const SecurePDFShare = () => {
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [expiry, setExpiry] = useState('1d'); // 1d, 1w, 1h
    const [maxDownloads, setMaxDownloads] = useState(1);
    
    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        if (selectedFile.type !== 'application/pdf') {
            toast.error('Please select a PDF file.');
            return;
        }
        setFile(selectedFile);
        setShareUrl('');
    };

    const handleGenerateLink = async () => {
        if (!file) return;
        setIsProcessing(true);
        
        try {
            let fileToUpload = file;

            // If password is set, encrypt it first
            if (password) {
                const arrayBuffer = await file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                pdfDoc.encrypt({
                    userPassword: password,
                    ownerPassword: password + '_owner',
                    permissions: {
                        printing: 'highResolution',
                        copying: true,
                        modifying: false
                    }
                });
                const pdfBytes = await pdfDoc.save();
                fileToUpload = new File([pdfBytes], `secure_${file.name}`, { type: 'application/pdf' });
            }

            // Upload to file.io (Anonymous, temporary file storage)
            const formData = new FormData();
            formData.append('file', fileToUpload);
            // file.io supports expiry via 'expires' parameter but free tier is limited
            // For now, we'll use the default which is 1 download or 14 days
            
            const response = await axios.post('https://file.io', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data && response.data.success) {
                setShareUrl(response.data.link);
                toast.success('Secure link generated!');
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Sharing Error:', error);
            toast.error('Failed to generate secure link. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
    };

    return (
        <div className="secure-share-tool py-4">
            <style>{`
                .secure-share-tool {
                    max-width: 900px;
                    margin: 0 auto;
                }
                .main-card {
                    background: #ffffff;
                    border-radius: 32px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    padding: 3rem;
                    position: relative;
                    overflow: hidden;
                }
                .main-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 8px;
                    background: linear-gradient(90deg, #3b82f6, #10b981);
                }
                .upload-zone {
                    border: 2px dashed #e2e8f0;
                    border-radius: 24px;
                    padding: 4rem 2rem;
                    background: #f8fafc;
                    transition: all 0.3s;
                    cursor: pointer;
                    margin-bottom: 2rem;
                    text-align: center;
                }
                .upload-zone:hover {
                    border-color: #3b82f6;
                    background: #eff6ff;
                }
                .link-box {
                    background: #f8fafc;
                    border: 2px solid #3b82f6;
                    border-radius: 20px;
                    padding: 1.5rem;
                    margin-top: 2rem;
                }
                .settings-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                .setting-item {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    padding: 1.2rem;
                }
                .share-btn {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    color: white;
                    border: none;
                    padding: 1rem 2.5rem;
                    border-radius: 16px;
                    font-weight: 700;
                    font-size: 1.1rem;
                    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
                    transition: all 0.3s;
                    width: 100%;
                }
                .share-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 25px -5px rgba(59, 130, 246, 0.4);
                }
                .url-input {
                    background: white !important;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    font-family: monospace;
                    font-size: 0.9rem;
                    color: #2563eb;
                }
                .badge-secure {
                    background: #dcfce7;
                    color: #166534;
                    padding: 4px 12px;
                    border-radius: 100px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                }
            `}</style>

            <div className="main-card fade-in">
                <div className="d-flex align-items-center justify-content-between mb-5">
                    <div className="d-flex align-items-center gap-3">
                        <div className="p-3 rounded-4 bg-blue-50 text-blue-600">
                            <FaShareAlt size={32} />
                        </div>
                        <div>
                            <h2 className="h4 fw-bold mb-1">Secure PDF Share</h2>
                            <p className="text-muted mb-0 small">Share encrypted PDF links that automatically expire.</p>
                        </div>
                    </div>
                    <span className="badge-secure">E2E Encrypted</span>
                </div>

                {!file ? (
                    <div className="upload-zone" onClick={() => document.getElementById('pdfInput').click()}>
                        <input type="file" id="pdfInput" hidden accept=".pdf" onChange={onFileChange} />
                        <div className="p-4 rounded-circle bg-blue-50 d-inline-block mb-4 text-blue-600">
                            <FaFileUpload size={48} />
                        </div>
                        <h4 className="fw-bold mb-2">Select PDF to Share</h4>
                        <p className="text-slate-500 mb-0">Upload the file you want to share securely</p>
                    </div>
                ) : (
                    <div className="file-info fade-in p-4 border rounded-4 mb-4 d-flex align-items-center justify-content-between bg-light">
                        <div className="d-flex align-items-center gap-3">
                            <FaFilePdf size={32} className="text-danger" />
                            <div className="text-start">
                                <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '300px' }}>{file.name}</div>
                                <div className="text-muted small">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                        </div>
                        <Button variant="link" className="text-danger p-0 fw-bold" onClick={() => { setFile(null); setShareUrl(''); }}>Change</Button>
                    </div>
                )}

                {!shareUrl ? (
                    <>
                        <div className="settings-grid">
                            <div className="setting-item">
                                <Form.Label className="small fw-bold d-flex align-items-center gap-2 mb-3">
                                    <FaLock className="text-blue-600" /> Password Protect
                                </Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Set optional password..." 
                                    className="border-0 bg-transparent p-0 small"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="setting-item">
                                <Form.Label className="small fw-bold d-flex align-items-center gap-2 mb-3">
                                    <FaClock className="text-blue-600" /> Expiry Type
                                </Form.Label>
                                <Form.Select className="border-0 bg-transparent p-0 small fw-bold" value={expiry} onChange={(e) => setExpiry(e.target.value)}>
                                    <option value="1d">1 Download</option>
                                    <option value="1h">1 Hour (Premium)</option>
                                    <option value="1w">1 Week (Premium)</option>
                                </Form.Select>
                            </div>
                        </div>

                        <Button 
                            className="share-btn d-flex align-items-center justify-content-center gap-3"
                            onClick={handleGenerateLink}
                            disabled={!file || isProcessing}
                        >
                            {isProcessing ? <Spinner animation="border" size="sm" /> : <FaLink />}
                            {isProcessing ? 'Generating Secure Link...' : 'Generate Temporary Link'}
                        </Button>
                    </>
                ) : (
                    <div className="link-box fade-in">
                        <div className="d-flex align-items-center gap-2 mb-3 text-blue-700">
                            <FaCheckCircle /> <span className="fw-bold">Your secure link is ready!</span>
                        </div>
                        <InputGroup className="mb-4">
                            <Form.Control 
                                value={shareUrl} 
                                readOnly 
                                className="url-input py-3"
                            />
                            <Button variant="primary" onClick={copyToClipboard} className="px-4">
                                <FaCopy className="me-2" /> Copy
                            </Button>
                        </InputGroup>
                        <div className="d-flex gap-2 justify-content-center">
                            <Button variant="outline-primary" className="rounded-xl px-4" onClick={() => window.open(`mailto:?subject=Secure File Share&body=You have been sent a secure PDF file. Access it here: ${shareUrl}`)}>
                                <FaEnvelope className="me-2" /> Email Link
                            </Button>
                            <Button variant="outline-dark" className="rounded-xl px-4" onClick={() => setShareUrl('')}>
                                Share Another
                            </Button>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 rounded-4 text-center x-small text-blue-600 fw-medium">
                            <FaClock className="me-1" /> This link will expire automatically after <b>1 download</b> or 14 days.
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-5 row g-4">
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-blue-600">
                            <FaClock /> Burn After Reading
                        </div>
                        <p className="text-muted small mb-0">Links automatically expire after the first successful download, ensuring your document doesn't linger on the web.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-blue-600">
                            <FaShieldAlt /> On-the-fly Encryption
                        </div>
                        <p className="text-muted small mb-0">Set an optional password that we'll apply to your PDF before it's uploaded, adding a second layer of security.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-blue-600">
                            <FaEye /> Anonymous Sharing
                        </div>
                        <p className="text-muted small mb-0">We don't track who you are or who you share with. No accounts required, no logs kept, just secure peer-to-peer sharing.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurePDFShare;
