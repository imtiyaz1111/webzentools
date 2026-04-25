import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Form, Button, Spinner, InputGroup } from 'react-bootstrap';
import { 
    FaFilePdf, FaLockOpen, FaDownload, FaFileUpload, 
    FaKey, FaEye, FaEyeSlash, FaCheckCircle, FaUnlockAlt
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const PDFUnlocker = () => {
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultPdfUrl, setResultPdfUrl] = useState(null);
    const [isEncrypted, setIsEncrypted] = useState(false);

    const onFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            toast.error('Please upload a valid PDF file.');
            return;
        }

        setFile(selectedFile);
        setResultPdfUrl(null);
        setPassword('');
        
        // Check if PDF is encrypted
        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            await PDFDocument.load(arrayBuffer);
            setIsEncrypted(false);
        } catch (error) {
            if (error.message.includes('password')) {
                setIsEncrypted(true);
            } else {
                console.error('Check Error:', error);
            }
        }
    };

    const handleUnlockPdf = async () => {
        if (!file) return;
        
        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer, { 
                password: password,
                ignoreEncryption: false 
            });

            // Re-saving without encryption options removes the password
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setResultPdfUrl(url);
            toast.success('PDF unlocked successfully!');
        } catch (error) {
            console.error('Unlock Error:', error);
            toast.error('Incorrect password or failed to process the document.');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadPdf = () => {
        if (!resultPdfUrl) return;
        const link = document.createElement('a');
        link.href = resultPdfUrl;
        link.download = `unlocked_${file.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="pdf-unlocker-tool py-4">
            <style>{`
                .pdf-unlocker-tool {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .main-card {
                    background: #ffffff;
                    border-radius: 32px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    padding: 3.5rem;
                    position: relative;
                    overflow: hidden;
                    text-align: center;
                }
                .main-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 8px;
                    background: linear-gradient(90deg, #10b981, #3b82f6);
                }
                .upload-zone {
                    border: 2px dashed #e2e8f0;
                    border-radius: 24px;
                    padding: 4rem 2rem;
                    background: #f8fafc;
                    transition: all 0.3s;
                    cursor: pointer;
                    margin-bottom: 2.5rem;
                }
                .upload-zone:hover {
                    border-color: #10b981;
                    background: #f0fdf4;
                }
                .unlock-icon-wrapper {
                    width: 80px;
                    height: 80px;
                    background: #f0fdf4;
                    color: #10b981;
                    border-radius: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                }
                .password-box {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 20px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                }
                .unlock-btn {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    border: none;
                    padding: 1.2rem 3rem;
                    border-radius: 18px;
                    font-weight: 700;
                    font-size: 1.1rem;
                    box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4);
                    transition: all 0.3s;
                    width: 100%;
                }
                .unlock-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 25px -5px rgba(16, 185, 129, 0.5);
                }
                .file-display {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    margin-bottom: 2rem;
                    padding: 1rem;
                    background: #f1f5f9;
                    border-radius: 14px;
                }
            `}</style>

            <div className="main-card fade-in">
                <div className="unlock-icon-wrapper">
                    <FaUnlockAlt size={40} />
                </div>
                <h2 className="fw-bold mb-2">Unlock PDF Password</h2>
                <p className="text-muted mb-5">Remove security from password-protected PDF files to make them easily accessible.</p>

                {!file ? (
                    <div className="upload-zone" onClick={() => document.getElementById('pdfInput').click()}>
                        <input type="file" id="pdfInput" hidden accept=".pdf" onChange={onFileChange} />
                        <FaFileUpload size={48} className="text-slate-300 mb-3" />
                        <h5 className="fw-bold">Choose PDF File</h5>
                        <p className="small text-slate-400">Select the encrypted PDF you want to unlock</p>
                    </div>
                ) : (
                    <>
                        <div className="file-display">
                            <FaFilePdf className="text-danger" size={24} />
                            <span className="fw-bold text-dark">{file.name}</span>
                            <Button variant="link" className="text-muted p-0 small ms-2" onClick={() => setFile(null)}>Change</Button>
                        </div>

                        {isEncrypted ? (
                            <div className="password-box fade-in">
                                <Form.Group className="mb-4 text-start">
                                    <Form.Label className="small fw-bold mb-2">Enter PDF Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control 
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Type password here..."
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            style={{ height: '50px', borderRadius: '12px' }}
                                        />
                                        <Button variant="outline-secondary" className="border-0 bg-transparent text-slate-400" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </Button>
                                    </InputGroup>
                                    <Form.Text className="text-muted x-small mt-2">
                                        Note: You must know the password to unlock the file. This tool removes the password, it does not crack it.
                                    </Form.Text>
                                </Form.Group>

                                {!resultPdfUrl ? (
                                    <Button 
                                        className="unlock-btn"
                                        disabled={!password || isProcessing}
                                        onClick={handleUnlockPdf}
                                    >
                                        {isProcessing ? <Spinner animation="border" size="sm" className="me-2" /> : <FaLockOpen className="me-2" />}
                                        {isProcessing ? 'Unlocking...' : 'Remove Password Now'}
                                    </Button>
                                ) : (
                                    <div className="fade-in">
                                        <div className="p-3 bg-success bg-opacity-10 text-success rounded-3 mb-4 d-flex align-items-center justify-content-center gap-2 fw-bold">
                                            <FaCheckCircle /> Password Removed!
                                        </div>
                                        <Button variant="success" className="unlock-btn" onClick={downloadPdf}>
                                            <FaDownload className="me-2" /> Download Unlocked PDF
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-5 border rounded-4 bg-light mb-4">
                                <FaCheckCircle size={48} className="text-success mb-3" />
                                <h5 className="fw-bold">This PDF is not encrypted</h5>
                                <p className="text-muted small">The document you uploaded doesn't have an open password and is already accessible.</p>
                                <Button variant="outline-primary" className="rounded-xl mt-2" onClick={() => setFile(null)}>Select Another File</Button>
                            </div>
                        )}
                    </>
                )}

                <div className="mt-5 d-flex justify-content-center gap-4 text-slate-400 small">
                    <span>⚡ Instant Unlock</span>
                    <span>🔒 Private Processing</span>
                    <span>📁 Clean Export</span>
                </div>
            </div>

            <div className="mt-5 row g-4">
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-success">
                            <FaLockOpen /> Security Removal
                        </div>
                        <p className="text-muted small mb-0">Permanently remove passwords from your PDF files so you can share or read them without re-entering credentials.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-success">
                            <FaKey /> Knowledge Required
                        </div>
                        <p className="text-muted small mb-0">This tool is designed to remove known passwords. For security reasons, you must provide the current password to decrypt the file.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-success">
                            <FaFileUpload /> Batch Friendly
                        </div>
                        <p className="text-muted small mb-0">Clean your documents instantly and download a fresh, unprotected version of your PDF in seconds.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFUnlocker;
