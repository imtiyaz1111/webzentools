import React, { useState, useRef } from 'react';
import mammoth from 'mammoth';
import html2pdf from 'html2pdf.js';
import { Form, Button, Spinner } from 'react-bootstrap';
import { 
    FaFilePdf, FaFileWord, FaDownload, FaFileUpload, 
    FaCheckCircle, FaExchangeAlt, FaEye 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const WordToPdf = () => {
    const [file, setFile] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const [htmlPreview, setHtmlPreview] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const previewRef = useRef(null);

    const onFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.name.split('.').pop().toLowerCase() !== 'docx') {
            toast.error('Only .docx files are allowed.');
            return;
        }

        setFile(selectedFile);
        setIsComplete(false);
        setHtmlPreview('');
        
        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            setHtmlPreview(result.value);
            toast.success('Word document loaded!');
        } catch (error) {
            console.error('Mammoth Error:', error);
            toast.error('Failed to read Word document.');
        }
    };

    const convertToPdf = async () => {
        if (!file || !htmlPreview) return;

        setIsConverting(true);
        try {
            const element = previewRef.current;
            const opt = {
                margin:       [10, 10],
                filename:     `${file.name.replace('.docx', '')}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // Process with html2pdf
            await html2pdf().set(opt).from(element).save();
            
            setIsComplete(true);
            toast.success('PDF generated and download started!');
        } catch (error) {
            console.error('PDF Conversion Error:', error);
            toast.error('An error occurred during PDF generation.');
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <div className="word-to-pdf-container py-4">
            <style>{`
                .word-to-pdf-container {
                    max-width: 900px;
                    margin: 0 auto;
                }
                .main-card {
                    background: #ffffff;
                    border: 1px solid #e1e8ed;
                    border-radius: 24px;
                    padding: 2.5rem;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                    margin-bottom: 2rem;
                }
                .upload-zone {
                    border: 2px dashed #cbd5e0;
                    border-radius: 16px;
                    padding: 3rem 2rem;
                    text-align: center;
                    transition: all 0.3s ease;
                    background: #f8fafc;
                    cursor: pointer;
                    margin-bottom: 2rem;
                    position: relative;
                }
                .upload-zone:hover {
                    border-color: #2b6cb0;
                    background: #ebf8ff;
                }
                .upload-zone input {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    cursor: pointer;
                }
                .preview-container {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    padding: 2rem;
                    max-height: 400px;
                    overflow-y: auto;
                    margin-bottom: 2rem;
                    font-family: 'Inter', sans-serif;
                }
                .preview-container h1, .preview-container h2 { color: #2d3748; }
                .preview-container p { color: #4a5568; line-height: 1.6; }
                
                .btn-convert {
                    background: linear-gradient(135deg, #2c5282 0%, #1a365d 100%);
                    border: none;
                    padding: 1rem 2.5rem;
                    font-weight: 700;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(26, 54, 93, 0.3);
                    transition: all 0.3s;
                }
                .btn-convert:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(26, 54, 93, 0.4);
                }
                .btn-reset {
                    background: #f7fafc;
                    color: #4a5568;
                    border: 1px solid #e2e8f0;
                    padding: 1rem 2rem;
                    border-radius: 12px;
                    font-weight: 600;
                }
                .fade-in {
                    animation: fadeIn 0.4s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="main-card fade-in">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="p-3 rounded-4" style={{ background: '#ebf8ff' }}>
                        <FaFileWord size={28} style={{ color: '#2b6cb0' }} />
                    </div>
                    <div>
                        <h2 className="h4 fw-bold mb-1" style={{ color: '#1a202c' }}>Word to PDF Converter</h2>
                        <p className="text-muted mb-0 small">Transform your Word documents into professional PDF files instantly.</p>
                    </div>
                </div>

                {!file ? (
                    <div className="upload-zone">
                        <input type="file" accept=".docx" onChange={onFileChange} />
                        <FaFileUpload size={48} className="mb-3" style={{ color: '#2b6cb0' }} />
                        <h5 className="fw-bold mb-2">Upload .docx to Convert</h5>
                        <p className="text-muted small mb-0">Select a Word document from your computer</p>
                    </div>
                ) : (
                    <div className="file-info fade-in p-3 border rounded-4 mb-4 d-flex align-items-center justify-content-between bg-light">
                        <div className="d-flex align-items-center gap-3">
                            <FaFileWord size={32} color="#2b6cb0" />
                            <div>
                                <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '300px' }}>{file.name}</div>
                                <div className="text-muted small">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                        </div>
                        <Button variant="link" className="text-danger p-0 fw-bold" onClick={() => { setFile(null); setHtmlPreview(''); setIsComplete(false); }}>
                            Change
                        </Button>
                    </div>
                )}

                {htmlPreview && (
                    <div className="fade-in">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <FaEye className="text-muted" />
                            <span className="fw-bold text-muted small uppercase letter-spacing-1">Document Preview</span>
                        </div>
                        <div className="preview-container" ref={previewRef} dangerouslySetInnerHTML={{ __html: htmlPreview }} />
                        
                        {!isComplete ? (
                            <Button 
                                className="btn-convert w-100 text-white d-flex align-items-center justify-content-center gap-2"
                                onClick={convertToPdf}
                                disabled={isConverting}
                            >
                                {isConverting ? <Spinner animation="border" size="sm" /> : <FaExchangeAlt />}
                                {isConverting ? 'Generating PDF...' : 'Convert and Download PDF'}
                            </Button>
                        ) : (
                            <div className="text-center fade-in">
                                <div className="p-3 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-4 d-flex align-items-center justify-content-center gap-3 mb-4">
                                    <FaCheckCircle className="text-success" size={20} />
                                    <span className="text-success fw-bold">PDF Created Successfully!</span>
                                </div>
                                <div className="d-flex gap-3">
                                    <button className="btn-reset flex-grow-1" onClick={() => { setFile(null); setHtmlPreview(''); setIsComplete(false); }}>
                                        Convert Another
                                    </button>
                                    <Button className="btn-convert flex-grow-1 text-white" onClick={convertToPdf}>
                                        <FaDownload className="me-2" /> Download Again
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="how-it-works main-card fade-in">
                <h4 className="fw-bold mb-4">Smart Conversion Features</h4>
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="p-3">
                            <div className="h6 fw-bold mb-2 d-flex align-items-center gap-2">
                                <FaCheckCircle color="#3182ce" /> Layout Preservation
                            </div>
                            <p className="text-muted small">We analyze the Word document structure to maintain headings, paragraphs, and styling in the PDF.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3">
                            <div className="h6 fw-bold mb-2 d-flex align-items-center gap-2">
                                <FaCheckCircle color="#3182ce" /> Instant Preview
                            </div>
                            <p className="text-muted small">See a live preview of your document before converting to ensure everything looks perfect.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3">
                            <div className="h6 fw-bold mb-2 d-flex align-items-center gap-2">
                                <FaCheckCircle color="#3182ce" /> Secure & Local
                            </div>
                            <p className="text-muted small">Processing is done directly in your browser. Your document is never uploaded to any cloud server.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WordToPdf;
