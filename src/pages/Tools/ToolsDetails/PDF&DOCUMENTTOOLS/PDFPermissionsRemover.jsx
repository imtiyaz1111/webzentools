import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button, Spinner, Card } from 'react-bootstrap';
import { 
    FaFilePdf, FaUnlock, FaDownload, FaFileUpload, 
    FaShieldAlt, FaCheckCircle, FaPrint, FaCopy, FaEdit
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const PDFPermissionsRemover = () => {
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultPdfUrl, setResultPdfUrl] = useState(null);

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

    const handleRemovePermissions = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            // Loading with ignoreEncryption: true strips all protection metadata
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setResultPdfUrl(url);
            toast.success('All restrictions removed successfully!');
        } catch (error) {
            console.error('Removal Error:', error);
            toast.error('Failed to remove permissions. The document might be too heavily protected.');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadPdf = () => {
        if (!resultPdfUrl) return;
        const link = document.createElement('a');
        link.href = resultPdfUrl;
        link.download = `unrestricted_${file.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="pdf-permissions-remover py-4">
            <style>{`
                .pdf-permissions-remover {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .main-card {
                    background: #ffffff;
                    border-radius: 32px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    padding: 3.5rem;
                    text-align: center;
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
                    background: linear-gradient(90deg, #3b82f6, #6366f1);
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
                    border-color: #3b82f6;
                    background: #eff6ff;
                }
                .status-card {
                    background: #f8fafc;
                    border-radius: 20px;
                    border: 1px solid #e2e8f0;
                    padding: 2rem;
                    margin-bottom: 2.5rem;
                }
                .restriction-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: #64748b;
                    font-size: 0.9rem;
                    margin-bottom: 10px;
                }
                .restriction-item svg {
                    color: #ef4444;
                }
                .remover-btn {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    color: white;
                    border: none;
                    padding: 1.2rem 3rem;
                    border-radius: 18px;
                    font-weight: 700;
                    font-size: 1.1rem;
                    box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
                    transition: all 0.3s;
                    width: 100%;
                }
                .remover-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 25px -5px rgba(59, 130, 246, 0.5);
                }
            `}</style>

            <div className="main-card fade-in">
                <div className="d-inline-flex p-4 rounded-4 bg-blue-50 text-blue-600 mb-4">
                    <FaShieldAlt size={40} />
                </div>
                <h2 className="fw-bold mb-2">Remove PDF Restrictions</h2>
                <p className="text-muted mb-5">Enable printing, copying, and editing on locked PDF documents instantly.</p>

                {!file ? (
                    <div className="upload-zone" onClick={() => document.getElementById('pdfInput').click()}>
                        <input type="file" id="pdfInput" hidden accept=".pdf" onChange={onFileChange} />
                        <FaFileUpload size={48} className="text-slate-300 mb-3" />
                        <h5 className="fw-bold">Upload Restricted PDF</h5>
                        <p className="small text-slate-400">Select the file you want to unlock permissions for</p>
                    </div>
                ) : (
                    <>
                        <div className="status-card fade-in">
                            <div className="d-flex align-items-center justify-content-center gap-3 mb-4 p-3 bg-white rounded-3 shadow-sm">
                                <FaFilePdf className="text-danger" size={24} />
                                <span className="fw-bold text-dark">{file.name}</span>
                            </div>
                            
                            <div className="text-start px-4">
                                <h6 className="fw-bold mb-3 small text-uppercase letter-spacing-1">Current Potential Restrictions:</h6>
                                <div className="row">
                                    <div className="col-6">
                                        <div className="restriction-item"><FaPrint /> <span>Printing Blocked</span></div>
                                        <div className="restriction-item"><FaCopy /> <span>Copying Disabled</span></div>
                                    </div>
                                    <div className="col-6">
                                        <div className="restriction-item"><FaEdit /> <span>Editing Restricted</span></div>
                                        <div className="restriction-item"><FaShieldAlt /> <span>Form Filling Disabled</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {!resultPdfUrl ? (
                            <Button 
                                className="remover-btn"
                                disabled={isProcessing}
                                onClick={handleRemovePermissions}
                            >
                                {isProcessing ? <Spinner animation="border" size="sm" className="me-2" /> : <FaUnlock className="me-2" />}
                                {isProcessing ? 'Removing Restrictions...' : 'Enable All Permissions Now'}
                            </Button>
                        ) : (
                            <div className="fade-in">
                                <div className="p-3 bg-success bg-opacity-10 text-success rounded-3 mb-4 d-flex align-items-center justify-content-center gap-2 fw-bold">
                                    <FaCheckCircle /> All Permissions Enabled!
                                </div>
                                <div className="d-flex gap-3">
                                    <Button variant="outline-secondary" className="flex-grow-1 py-3 rounded-4" onClick={() => setFile(null)}>
                                        Clean Another
                                    </Button>
                                    <Button variant="success" className="remover-btn flex-grow-1" onClick={downloadPdf}>
                                        <FaDownload className="me-2" /> Download Unrestricted PDF
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div className="mt-5 d-flex justify-content-center gap-4 text-slate-400 x-small">
                    <span>✔️ Print Anywhere</span>
                    <span>✔️ Copy Text</span>
                    <span>✔️ Modify Content</span>
                </div>
            </div>

            <div className="mt-5 row g-4">
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-blue-600">
                            <FaPrint /> Unlock Printing
                        </div>
                        <p className="text-muted small mb-0">Some PDFs disable the print button. Our tool strips this restriction so you can create physical copies of your documents.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-blue-600">
                            <FaCopy /> Content Extraction
                        </div>
                        <p className="text-muted small mb-0">Enable the selection and copying of text and images from documents that have been locked for content extraction.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-blue-600">
                            <FaEdit /> Full Editing
                        </div>
                        <p className="text-muted small mb-0">Remove owner passwords that prevent other tools from modifying, annotating, or rotating the pages of your PDF.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFPermissionsRemover;
