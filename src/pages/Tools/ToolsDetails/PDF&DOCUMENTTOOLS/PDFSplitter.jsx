import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Form, Button, Spinner, Badge } from 'react-bootstrap';
import { 
    FaFilePdf, FaDownload, FaFileUpload, 
    FaCheckCircle, FaExclamationTriangle, FaInfoCircle 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { FaHandScissors } from 'react-icons/fa6';

const PDFSplitter = () => {
    const [file, setFile] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [range, setRange] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultPdfUrl, setResultPdfUrl] = useState(null);

    const onFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            toast.error('Only PDF files are allowed.');
            return;
        }

        setFile(selectedFile);
        setResultPdfUrl(null);
        
        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            setPageCount(pdf.getPageCount());
            toast.success(`PDF loaded: ${pdf.getPageCount()} pages`);
        } catch (error) {
            console.error('Error loading PDF:', error);
            toast.error('Failed to read PDF file.');
        }
    };

    const parseRange = (rangeStr, maxPages) => {
        const pages = new Set();
        const parts = rangeStr.split(',').map(p => p.trim());

        for (const part of parts) {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(Number);
                if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start) {
                    for (let i = start; i <= Math.min(end, maxPages); i++) {
                        pages.add(i - 1); // 0-indexed
                    }
                }
            } else {
                const num = Number(part);
                if (!isNaN(num) && num > 0 && num <= maxPages) {
                    pages.add(num - 1); // 0-indexed
                }
            }
        }
        return Array.from(pages).sort((a, b) => a - b);
    };

    const splitPdf = async () => {
        if (!file || !range.trim()) {
            toast.error('Please upload a PDF and specify pages to extract.');
            return;
        }

        const pagesToExtract = parseRange(range, pageCount);
        if (pagesToExtract.length === 0) {
            toast.error('Invalid page range. Example: 1, 3, 5-7');
            return;
        }

        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            const extractedPdf = await PDFDocument.create();
            
            const copiedPages = await extractedPdf.copyPages(pdf, pagesToExtract);
            copiedPages.forEach((page) => extractedPdf.addPage(page));

            const pdfBytes = await extractedPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            
            setResultPdfUrl(url);
            toast.success('Pages extracted successfully!');
        } catch (error) {
            console.error('Split Error:', error);
            toast.error('An error occurred while splitting the PDF.');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadResult = () => {
        if (!resultPdfUrl) return;
        const link = document.createElement('a');
        link.href = resultPdfUrl;
        link.download = `extracted_pages_${file.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="pdf-splitter-container py-4">
            <style>{`
                .pdf-splitter-container {
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
                    border-color: #e53e3e;
                    background: #fff5f5;
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
                .range-input-container {
                    background: #f8fafc;
                    border: 1px solid #edf2f7;
                    border-radius: 16px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                }
                .premium-label {
                    font-weight: 700;
                    color: #2c3e50;
                    font-size: 0.9rem;
                    margin-bottom: 0.8rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .premium-input {
                    background: #ffffff !important;
                    border: 2px solid #edf2f7 !important;
                    padding: 0.8rem 1rem !important;
                    border-radius: 12px !important;
                    font-size: 1.1rem !important;
                    transition: all 0.3s ease;
                }
                .premium-input:focus {
                    border-color: #e53e3e !important;
                    box-shadow: 0 0 0 4px rgba(229, 62, 62, 0.1) !important;
                }
                .info-badge {
                    background: #ebf8ff;
                    color: #2b6cb0;
                    border: 1px solid #bee3f8;
                    padding: 0.5rem 1rem;
                    border-radius: 10px;
                    font-size: 0.85rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 1rem;
                }
                .btn-split {
                    background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
                    border: none;
                    padding: 1rem 2.5rem;
                    font-weight: 700;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(229, 62, 62, 0.3);
                    transition: all 0.3s;
                }
                .btn-split:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(229, 62, 62, 0.4);
                }
                .btn-download {
                    background: linear-gradient(135deg, #48bb78 0%, #2f855a 100%);
                    border: none;
                    padding: 1rem 2.5rem;
                    font-weight: 700;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
                    transition: all 0.3s;
                }
                .btn-download:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(72, 187, 120, 0.4);
                }
                .fade-in {
                    animation: fadeIn 0.4s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .file-info {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: #fff;
                    border: 1px solid #edf2f7;
                    padding: 1.2rem;
                    border-radius: 16px;
                    margin-bottom: 1.5rem;
                }
            `}</style>

            <div className="main-card fade-in">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="p-3 rounded-4" style={{ background: '#fff5f5' }}>
                        <FaHandScissors size={28} style={{ color: '#e53e3e' }} />
                    </div>
                    <div>
                        <h2 className="h4 fw-bold mb-1" style={{ color: '#1a202c' }}>PDF Splitter</h2>
                        <p className="text-muted mb-0 small">Extract specific pages or ranges from your PDF instantly.</p>
                    </div>
                </div>

                {!file ? (
                    <div className="upload-zone">
                        <input type="file" accept=".pdf" onChange={onFileChange} />
                        <FaFileUpload size={48} className="mb-3" style={{ color: '#e53e3e' }} />
                        <h5 className="fw-bold mb-2">Upload PDF to Split</h5>
                        <p className="text-muted small mb-0">Select a PDF file from your computer</p>
                    </div>
                ) : (
                    <div className="file-info fade-in">
                        <div className="d-flex align-items-center gap-3">
                            <FaFilePdf size={32} color="#e53e3e" />
                            <div>
                                <div className="fw-bold text-dark mb-0 text-truncate" style={{ maxWidth: '300px' }}>{file.name}</div>
                                <div className="text-muted small">{(file.size / 1024 / 1024).toFixed(2)} MB • {pageCount} Pages</div>
                            </div>
                        </div>
                        <Button variant="link" className="text-danger p-0 fw-bold" onClick={() => { setFile(null); setRange(''); setResultPdfUrl(null); }}>
                            Change File
                        </Button>
                    </div>
                )}

                {file && (
                    <div className="range-input-container fade-in">
                        <label className="premium-label">
                            <FaHandScissors size={14} /> Enter Page Range to Extract
                        </label>
                        <Form.Control 
                            type="text"
                            placeholder="e.g. 1, 3, 5-7, 10"
                            value={range}
                            onChange={(e) => setRange(e.target.value)}
                            className="premium-input mb-3"
                        />
                        <div className="info-badge">
                            <FaInfoCircle />
                            <span>Use commas for individual pages and hyphens for ranges (max: {pageCount}).</span>
                        </div>
                    </div>
                )}

                <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                    {!resultPdfUrl ? (
                        <Button 
                            className="btn-split text-white d-flex align-items-center justify-content-center gap-2"
                            onClick={splitPdf}
                            disabled={!file || !range.trim() || isProcessing}
                        >
                            {isProcessing ? <Spinner animation="border" size="sm" /> : <FaHandScissors />}
                            {isProcessing ? 'Extracting Pages...' : 'Split & Extract PDF'}
                        </Button>
                    ) : (
                        <>
                            <Button 
                                variant="outline-danger" 
                                style={{ borderRadius: '12px', padding: '1rem 2rem' }}
                                onClick={() => { setResultPdfUrl(null); setRange(''); }}
                            >
                                Reset Split
                            </Button>
                            <Button 
                                className="btn-download text-white d-flex align-items-center justify-content-center gap-2"
                                onClick={downloadResult}
                            >
                                <FaDownload /> Download Extracted PDF
                            </Button>
                        </>
                    )}
                </div>

                {resultPdfUrl && (
                    <div className="mt-4 p-3 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-4 d-flex align-items-center gap-3 fade-in">
                        <FaCheckCircle className="text-success" size={20} />
                        <span className="text-success fw-bold">Success! Your extracted PDF is ready.</span>
                    </div>
                )}
            </div>

            <div className="how-it-works main-card fade-in">
                <h4 className="fw-bold mb-4">Tips for Splitting</h4>
                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="p-3 border rounded-4 bg-light bg-opacity-50 h-100">
                            <div className="fw-bold mb-2 d-flex align-items-center gap-2">
                                <FaCheckCircle color="#48bb78" /> Single Pages
                            </div>
                            <p className="text-muted small mb-0">Enter numbers separated by commas to extract specific pages. Example: <b>1, 4, 8</b></p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="p-3 border rounded-4 bg-light bg-opacity-50 h-100">
                            <div className="fw-bold mb-2 d-flex align-items-center gap-2">
                                <FaCheckCircle color="#48bb78" /> Page Ranges
                            </div>
                            <p className="text-muted small mb-0">Use a hyphen to extract a sequence of pages. Example: <b>5-12</b></p>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="p-3 border rounded-4 bg-warning bg-opacity-10 h-100">
                            <div className="fw-bold mb-2 d-flex align-items-center gap-2" style={{ color: '#b7791f' }}>
                                <FaExclamationTriangle /> Important Note
                            </div>
                            <p className="text-muted small mb-0">All processing happens in your browser. Your file is never uploaded to our servers, keeping your documents 100% private.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFSplitter;
