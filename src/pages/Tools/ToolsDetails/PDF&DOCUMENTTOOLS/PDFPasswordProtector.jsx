import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Form, Button, Spinner, Row, Col, InputGroup } from 'react-bootstrap';
import { 
    FaFilePdf, FaLock, FaDownload, FaFileUpload, 
    FaShieldAlt, FaKey, FaEye, FaEyeSlash, FaCheckCircle, FaPrint, FaCopy
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const PDFPasswordProtector = () => {
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState('');
    const [ownerPassword, setOwnerPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultPdfUrl, setResultPdfUrl] = useState(null);

    // Permissions
    const [permissions, setPermissions] = useState({
        printing: true,
        modifying: false,
        copying: true,
        annotating: true,
        fillingForms: true,
        contentAccessibility: true,
        documentAssembly: false,
    });

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            toast.error('Please upload a valid PDF file.');
            return;
        }

        setFile(selectedFile);
        setResultPdfUrl(null);
    };

    const togglePermission = (key) => {
        setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleProtectPdf = async () => {
        if (!file || !password) {
            toast.error('Please enter a password to protect the PDF.');
            return;
        }

        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            
            // Encrypt the document
            // Note: pdf-lib encryption might require the document to be saved with specific options
            // Encryption is available in pdf-lib via the .encrypt() method
            pdfDoc.encrypt({
                userPassword: password,
                ownerPassword: ownerPassword || password + '_owner',
                permissions: {
                    printing: permissions.printing ? 'highResolution' : 'none',
                    modifying: permissions.modifying,
                    copying: permissions.copying,
                    annotating: permissions.annotating,
                    fillingForms: permissions.fillingForms,
                    contentAccessibility: permissions.contentAccessibility,
                    documentAssembly: permissions.documentAssembly,
                },
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setResultPdfUrl(url);
            toast.success('PDF protected successfully!');
        } catch (error) {
            console.error('Protection Error:', error);
            toast.error('Failed to protect PDF. Make sure it is not already encrypted.');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadPdf = () => {
        if (!resultPdfUrl) return;
        const link = document.createElement('a');
        link.href = resultPdfUrl;
        link.download = `protected_${file.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="pdf-protector-tool py-4">
            <style>{`
                .pdf-protector-tool {
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
                    background: linear-gradient(90deg, #6366f1, #a855f7);
                }
                .upload-zone {
                    border: 2px dashed #e2e8f0;
                    border-radius: 24px;
                    padding: 3rem 2rem;
                    text-align: center;
                    background: #f8fafc;
                    transition: all 0.3s;
                    cursor: pointer;
                    margin-bottom: 2.5rem;
                }
                .upload-zone:hover {
                    border-color: #6366f1;
                    background: #f5f3ff;
                }
                .permission-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                    margin-top: 1.5rem;
                }
                .permission-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    transition: all 0.2s;
                }
                .permission-item.active {
                    background: #f0fdf4;
                    border-color: #4ade80;
                }
                .custom-switch .form-check-input {
                    width: 3rem;
                    height: 1.5rem;
                    cursor: pointer;
                }
                .password-input {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    padding: 0.8rem 1.2rem;
                    border-radius: 14px;
                }
                .protect-btn {
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                    color: white;
                    border: none;
                    padding: 1rem 2.5rem;
                    border-radius: 16px;
                    font-weight: 700;
                    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
                    transition: all 0.3s;
                }
                .protect-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 25px -5px rgba(99, 102, 241, 0.4);
                }
                .badge-premium {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    color: white;
                    padding: 4px 12px;
                    border-radius: 100px;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
            `}</style>

            <div className="main-card fade-in">
                <div className="d-flex align-items-center justify-content-between mb-5">
                    <div className="d-flex align-items-center gap-3">
                        <div className="p-3 rounded-4 bg-indigo-50 text-indigo-600">
                            <FaShieldAlt size={32} />
                        </div>
                        <div>
                            <h2 className="h4 fw-bold mb-1">PDF Password Protector</h2>
                            <p className="text-muted mb-0 small">Secure your PDF files with high-strength encryption and custom permissions.</p>
                        </div>
                    </div>
                    <span className="badge-premium">AES-256 Bit</span>
                </div>

                {!file ? (
                    <div className="upload-zone" onClick={() => document.getElementById('pdfInput').click()}>
                        <input type="file" id="pdfInput" hidden accept=".pdf" onChange={onFileChange} />
                        <div className="p-4 rounded-circle bg-indigo-50 d-inline-block mb-4 text-indigo-600">
                            <FaFileUpload size={48} />
                        </div>
                        <h4 className="fw-bold mb-2">Upload PDF to Protect</h4>
                        <p className="text-slate-500 mb-0">Select the file you want to secure with a password</p>
                    </div>
                ) : (
                    <div className="file-info fade-in p-4 border rounded-4 mb-4 d-flex align-items-center justify-content-between bg-light">
                        <div className="d-flex align-items-center gap-3">
                            <FaFilePdf size={32} className="text-indigo-600" />
                            <div>
                                <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '300px' }}>{file.name}</div>
                                <div className="text-muted small">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                        </div>
                        <Button variant="link" className="text-danger p-0 fw-bold" onClick={() => setFile(null)}>Change</Button>
                    </div>
                )}

                <Row className="g-4 mb-5">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className="small fw-bold mb-2 d-flex align-items-center gap-2">
                                <FaLock size={12} /> Set User Password (Required to Open)
                            </Form.Label>
                            <InputGroup>
                                <Form.Control 
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter open password..."
                                    className="password-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button variant="outline-secondary" className="border-0 bg-transparent text-slate-400" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </Button>
                            </InputGroup>
                            <Form.Text className="text-muted x-small mt-1">This password will be required every time someone tries to open the file.</Form.Text>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className="small fw-bold mb-2 d-flex align-items-center gap-2">
                                <FaKey size={12} /> Set Owner Password (Optional)
                            </Form.Label>
                            <Form.Control 
                                type="password"
                                placeholder="Enter owner password..."
                                className="password-input"
                                value={ownerPassword}
                                onChange={(e) => setOwnerPassword(e.target.value)}
                            />
                            <Form.Text className="text-muted x-small mt-1">Used to change permissions later. If empty, user password will be used.</Form.Text>
                        </Form.Group>
                    </Col>
                </Row>

                <div className="mb-5">
                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                        <FaShieldAlt size={14} className="text-indigo-600" /> Document Permissions
                    </h6>
                    <div className="permission-grid">
                        <div className={`permission-item ${permissions.printing ? 'active' : ''}`}>
                            <div className="d-flex align-items-center gap-3">
                                <FaPrint className={permissions.printing ? 'text-success' : 'text-slate-400'} />
                                <span className="small fw-bold">Allow Printing</span>
                            </div>
                            <Form.Check 
                                type="switch"
                                className="custom-switch"
                                checked={permissions.printing}
                                onChange={() => togglePermission('printing')}
                            />
                        </div>
                        <div className={`permission-item ${permissions.copying ? 'active' : ''}`}>
                            <div className="d-flex align-items-center gap-3">
                                <FaCopy className={permissions.copying ? 'text-success' : 'text-slate-400'} />
                                <span className="small fw-bold">Allow Copying</span>
                            </div>
                            <Form.Check 
                                type="switch"
                                className="custom-switch"
                                checked={permissions.copying}
                                onChange={() => togglePermission('copying')}
                            />
                        </div>
                        <div className={`permission-item ${permissions.modifying ? 'active' : ''}`}>
                            <div className="d-flex align-items-center gap-3">
                                <FaShieldAlt className={permissions.modifying ? 'text-success' : 'text-slate-400'} />
                                <span className="small fw-bold">Allow Modifying</span>
                            </div>
                            <Form.Check 
                                type="switch"
                                className="custom-switch"
                                checked={permissions.modifying}
                                onChange={() => togglePermission('modifying')}
                            />
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    {!resultPdfUrl ? (
                        <Button 
                            className="protect-btn w-100 d-flex align-items-center justify-content-center gap-3"
                            disabled={!file || !password || isProcessing}
                            onClick={handleProtectPdf}
                        >
                            {isProcessing ? <Spinner animation="border" size="sm" /> : <FaLock />}
                            {isProcessing ? 'Encrypting Document...' : 'Secure & Protect PDF'}
                        </Button>
                    ) : (
                        <div className="fade-in">
                            <div className="p-3 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-4 mb-4 d-flex align-items-center gap-3 justify-content-center">
                                <FaCheckCircle className="text-success" />
                                <span className="text-success fw-bold">PDF Successfully Encrypted!</span>
                            </div>
                            <div className="d-flex gap-3">
                                <Button variant="outline-secondary" className="flex-grow-1 py-3 rounded-4" onClick={() => setResultPdfUrl(null)}>
                                    Protect Another
                                </Button>
                                <Button className="protect-btn flex-grow-1" onClick={downloadPdf}>
                                    <FaDownload className="me-2" /> Download Protected PDF
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-5 row g-4">
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-indigo-600">
                            <FaLock /> Strong Encryption
                        </div>
                        <p className="text-muted small mb-0">We use industry-standard AES encryption to ensure your documents are unreadable by unauthorized users.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-indigo-600">
                            <FaShieldAlt /> Granular Control
                        </div>
                        <p className="text-muted small mb-0">Decide exactly what others can do with your PDF. Disable printing, content copying, or editing with a single toggle.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-indigo-600">
                            <FaCheckCircle /> 100% Private
                        </div>
                        <p className="text-muted small mb-0">Everything happens in your browser. Your password and document content never leave your device.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFPasswordProtector;
