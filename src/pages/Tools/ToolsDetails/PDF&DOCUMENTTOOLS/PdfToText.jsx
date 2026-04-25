import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Form, Button, Spinner, Card } from 'react-bootstrap';
import { 
    FaFilePdf, FaFileAlt, FaDownload, FaFileUpload, 
    FaExchangeAlt, FaCheckCircle, FaCopy, FaTrash
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const PdfToText = () => {
    const [file, setFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        if (selectedFile.type !== 'application/pdf') {
            toast.error('Please upload a PDF file.');
            return;
        }
        setFile(selectedFile);
        setExtractedText('');
        setProgress(0);
    };

    const extractText = async () => {
        if (!file) return;

        setIsConverting(true);
        setProgress(0);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const numPages = pdf.numPages;
            let fullText = '';

            for (let i = 1; i <= numPages; i++) {
                setProgress(Math.round((i / numPages) * 100));
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += `--- Page ${i} ---\n${pageText}\n\n`;
            }

            setExtractedText(fullText);
            toast.success('Text extraction complete!');
        } catch (error) {
            console.error('Extraction Error:', error);
            toast.error('Failed to extract text from PDF.');
        } finally {
            setIsConverting(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(extractedText);
        toast.success('Text copied to clipboard!');
    };

    const downloadText = () => {
        const blob = new Blob([extractedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${file.name.replace('.pdf', '')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="pdf-to-text-tool py-4">
            <style>{`
                .pdf-to-text-tool {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                .main-card {
                    background: #ffffff;
                    border-radius: 32px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    padding: 3rem;
                }
                .upload-zone {
                    border: 2px dashed #cbd5e0;
                    border-radius: 24px;
                    padding: 4rem 2rem;
                    background: #f8fafc;
                    transition: all 0.3s;
                    cursor: pointer;
                    margin-bottom: 2.5rem;
                    text-align: center;
                }
                .upload-zone:hover {
                    border-color: #3b82f6;
                    background: #eff6ff;
                }
                .text-result-area {
                    background: #f1f5f9;
                    border-radius: 20px;
                    border: 1px solid #e2e8f0;
                    padding: 2rem;
                    margin-top: 2rem;
                    text-align: left;
                }
                .text-content {
                    width: 100%;
                    height: 400px;
                    border: 1px solid #e2e8f0;
                    border-radius: 14px;
                    padding: 1.5rem;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.95rem;
                    line-height: 1.6;
                    color: #334155;
                    background: white;
                    resize: none;
                    white-space: pre-wrap;
                    overflow-y: auto;
                }
                .convert-btn {
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
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
                .convert-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 25px -5px rgba(59, 130, 246, 0.5);
                }
            `}</style>

            <div className="main-card fade-in">
                <div className="d-flex align-items-center justify-content-center gap-3 mb-5">
                    <div className="p-3 rounded-4 bg-blue-50 text-blue-600">
                        <FaFileAlt size={32} />
                    </div>
                    <div className="text-start">
                        <h2 className="h4 fw-bold mb-1">PDF to Text Extractor</h2>
                        <p className="text-muted mb-0 small">Instantly extract all text content from your PDF documents.</p>
                    </div>
                </div>

                {!file ? (
                    <div className="upload-zone" onClick={() => document.getElementById('pdfInput').click()}>
                        <input type="file" id="pdfInput" hidden accept=".pdf" onChange={onFileChange} />
                        <div className="p-4 rounded-circle bg-blue-50 d-inline-block mb-4 text-blue-600">
                            <FaFileUpload size={48} />
                        </div>
                        <h4 className="fw-bold mb-2">Upload PDF Document</h4>
                        <p className="text-slate-500 mb-0">Select the file you want to convert to plain text</p>
                    </div>
                ) : (
                    <div className="fade-in">
                        <div className="p-4 border rounded-4 mb-4 d-flex align-items-center justify-content-between bg-light">
                            <div className="d-flex align-items-center gap-3">
                                <FaFilePdf size={32} className="text-danger" />
                                <div className="text-start">
                                    <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '300px' }}>{file.name}</div>
                                    <div className="text-muted small">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                                </div>
                            </div>
                            <Button variant="link" className="text-danger p-0 fw-bold" onClick={() => { setFile(null); setExtractedText(''); }}>Change</Button>
                        </div>

                        {!extractedText ? (
                            <Button 
                                className="convert-btn"
                                onClick={extractText}
                                disabled={isConverting}
                            >
                                {isConverting ? <Spinner animation="border" size="sm" className="me-2" /> : <FaExchangeAlt className="me-2" />}
                                {isConverting ? `Extracting... ${progress}%` : 'Extract Text Now'}
                            </Button>
                        ) : (
                            <div className="text-result-area fade-in">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="fw-bold mb-0">Extracted Content:</h6>
                                    <div className="d-flex gap-2">
                                        <Button variant="outline-primary" size="sm" className="rounded-pill px-3" onClick={copyToClipboard}>
                                            <FaCopy className="me-1" /> Copy
                                        </Button>
                                        <Button variant="success" size="sm" className="rounded-pill px-3" onClick={downloadText}>
                                            <FaDownload className="me-1" /> Download .txt
                                        </Button>
                                    </div>
                                </div>
                                <textarea 
                                    className="text-content scrollbar-hide" 
                                    value={extractedText} 
                                    readOnly 
                                />
                                <div className="mt-3 text-center">
                                    <Button variant="link" className="text-muted small" onClick={() => { setFile(null); setExtractedText(''); }}>
                                        <FaTrash className="me-1" /> Clear and start over
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-5 row g-4">
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-blue-600">
                            <FaFileAlt /> Pure Text
                        </div>
                        <p className="text-muted small mb-0">Extracts only the raw text, removing all formatting, images, and complex layouts for a clean reading experience.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-blue-600">
                            <FaExchangeAlt /> Fast Processing
                        </div>
                        <p className="text-muted small mb-0">Our engine parses documents in real-time, providing near-instant results even for large, multi-page PDFs.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-blue-600">
                            <FaCheckCircle /> Highly Secure
                        </div>
                        <p className="text-muted small mb-0">Everything happens in your browser. Your sensitive text content is never sent to a server, keeping your data 100% private.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfToText;
