import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import { 
    FaFilePdf, FaExchangeAlt, FaDownload, FaFileUpload, 
    FaCheckCircle, FaArrowLeft, FaArrowRight, FaSync 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const PDFPageReorder = () => {
    const [file, setFile] = useState(null);
    const [pages, setPages] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resultPdfUrl, setResultPdfUrl] = useState(null);

    const onFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            toast.error('Only PDF files are allowed.');
            return;
        }

        setFile(selectedFile);
        setPages([]);
        setResultPdfUrl(null);
        setIsLoading(true);
        
        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            const loadedPages = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.3 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport }).promise;
                loadedPages.push({
                    id: Math.random().toString(36).substr(2, 9),
                    originalIndex: i - 1,
                    pageNumber: i,
                    thumbnail: canvas.toDataURL()
                });
            }
            setPages(loadedPages);
            toast.success(`PDF Loaded: ${pdf.numPages} pages ready to reorder.`);
        } catch (error) {
            console.error('Error loading PDF:', error);
            toast.error('Failed to read PDF file.');
        } finally {
            setIsLoading(false);
        }
    };

    const movePage = (index, direction) => {
        const newPages = [...pages];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= newPages.length) return;
        
        [newPages[index], newPages[newIndex]] = [newPages[newIndex], newPages[index]];
        setPages(newPages);
        setResultPdfUrl(null);
    };

    const saveNewOrder = async () => {
        if (!file || pages.length === 0) return;

        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const sourceDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            const newDoc = await PDFDocument.create();
            
            // Reconstruct PDF in the new order
            const pageIndices = pages.map(p => p.originalIndex);
            const copiedPages = await newDoc.copyPages(sourceDoc, pageIndices);
            
            copiedPages.forEach(page => {
                newDoc.addPage(page);
            });

            const pdfBytes = await newDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            
            setResultPdfUrl(url);
            toast.success('New page order saved successfully!');
        } catch (error) {
            console.error('Reorder Error:', error);
            toast.error('An error occurred while reordering pages.');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadPdf = () => {
        if (!resultPdfUrl) return;
        const link = document.createElement('a');
        link.href = resultPdfUrl;
        link.download = `reordered_${file.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="pdf-reorder-container py-4">
            <style>{`
                .pdf-reorder-container {
                    max-width: 1000px;
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
                    border-color: #667eea;
                    background: #f0f4ff;
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
                .pages-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                    gap: 20px;
                    margin-bottom: 2rem;
                }
                .page-card {
                    background: white;
                    border: 2px solid #edf2f7;
                    border-radius: 16px;
                    padding: 12px;
                    transition: all 0.2s;
                    position: relative;
                }
                .page-card:hover {
                    border-color: #667eea;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
                }
                .page-thumb {
                    width: 100%;
                    height: 180px;
                    object-fit: contain;
                    background: #f7fafc;
                    border-radius: 8px;
                    margin-bottom: 12px;
                    border: 1px solid #f1f5f9;
                }
                .page-label {
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: #4a5568;
                    margin-bottom: 10px;
                    display: block;
                    text-align: center;
                }
                .reorder-controls {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                }
                .control-btn {
                    flex: 1;
                    padding: 6px;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                    background: #f8fafc;
                    color: #4a5568;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .control-btn:hover:not(:disabled) {
                    background: #667eea;
                    color: white;
                    border-color: #667eea;
                }
                .btn-save {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    padding: 1rem 2.5rem;
                    font-weight: 700;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                    transition: all 0.3s;
                }
                .btn-save:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
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
                    <div className="p-3 rounded-4" style={{ background: '#f0f4ff' }}>
                        <FaExchangeAlt size={28} style={{ color: '#667eea' }} />
                    </div>
                    <div>
                        <h2 className="h4 fw-bold mb-1" style={{ color: '#1a202c' }}>PDF Page Reorder</h2>
                        <p className="text-muted mb-0 small">Drag or move pages to change the sequence of your PDF document.</p>
                    </div>
                </div>

                {!file ? (
                    <div className="upload-zone">
                        <input type="file" accept=".pdf" onChange={onFileChange} />
                        <FaFileUpload size={48} className="mb-3" style={{ color: '#667eea' }} />
                        <h5 className="fw-bold mb-2">Upload PDF to Reorder</h5>
                        <p className="text-muted small mb-0">Select the PDF file you want to edit</p>
                    </div>
                ) : (
                    <div className="file-info fade-in p-3 border rounded-4 mb-4 d-flex align-items-center justify-content-between bg-light">
                        <div className="d-flex align-items-center gap-3">
                            <FaFilePdf size={32} color="#e53e3e" />
                            <div>
                                <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '300px' }}>{file.name}</div>
                                <div className="text-muted small">{(file.size / 1024 / 1024).toFixed(2)} MB • {pages.length} Pages</div>
                            </div>
                        </div>
                        <Button variant="link" className="text-primary p-0 fw-bold" onClick={() => { setFile(null); setPages([]); setResultPdfUrl(null); }}>
                            Change File
                        </Button>
                    </div>
                )}

                {isLoading && (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" className="mb-3" />
                        <p className="text-muted fw-bold">Processing pages...</p>
                    </div>
                )}

                {pages.length > 0 && (
                    <div className="fade-in">
                        <div className="pages-grid">
                            {pages.map((page, index) => (
                                <div key={page.id} className="page-card">
                                    <span className="page-label">PAGE {page.pageNumber}</span>
                                    <img src={page.thumbnail} alt={`Page ${page.pageNumber}`} className="page-thumb" />
                                    <div className="reorder-controls">
                                        <button 
                                            className="control-btn" 
                                            onClick={() => movePage(index, -1)}
                                            disabled={index === 0}
                                            title="Move Left"
                                        >
                                            <FaArrowLeft size={12} />
                                        </button>
                                        <button 
                                            className="control-btn" 
                                            onClick={() => movePage(index, 1)}
                                            disabled={index === pages.length - 1}
                                            title="Move Right"
                                        >
                                            <FaArrowRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="d-flex flex-column flex-md-row gap-3 justify-content-center mt-4">
                            {!resultPdfUrl ? (
                                <Button 
                                    className="btn-save text-white d-flex align-items-center justify-content-center gap-2"
                                    onClick={saveNewOrder}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? <Spinner animation="border" size="sm" /> : <FaSync />}
                                    {isProcessing ? 'Processing PDF...' : 'Apply New Page Order'}
                                </Button>
                            ) : (
                                <>
                                    <Button 
                                        variant="outline-primary" 
                                        style={{ borderRadius: '12px', padding: '1rem 2rem' }}
                                        onClick={() => { setPages([]); setFile(null); setResultPdfUrl(null); }}
                                    >
                                        Start New
                                    </Button>
                                    <Button 
                                        className="btn-save text-white d-flex align-items-center justify-content-center gap-2"
                                        onClick={downloadPdf}
                                    >
                                        <FaDownload /> Download Reordered PDF
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {resultPdfUrl && (
                    <div className="mt-4 p-3 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-4 d-flex align-items-center gap-3 fade-in">
                        <FaCheckCircle className="text-success" size={20} />
                        <span className="text-success fw-bold">Success! Your pages have been reordered and the PDF is ready.</span>
                    </div>
                )}
            </div>

            <div className="how-it-works main-card fade-in">
                <h4 className="fw-bold mb-4">Why use PDF Reorder?</h4>
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="p-4 border rounded-4 h-100">
                            <h6 className="fw-bold text-primary mb-2">Visual Interface</h6>
                            <p className="text-muted small mb-0">See clear thumbnails of every page so you know exactly what you're moving.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-4 border rounded-4 h-100">
                            <h6 className="fw-bold text-primary mb-2">Easy Navigation</h6>
                            <p className="text-muted small mb-0">Use simple arrows to shift pages left or right until the sequence is perfect.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-4 border rounded-4 h-100">
                            <h6 className="fw-bold text-primary mb-2">Privacy First</h6>
                            <p className="text-muted small mb-0">All reordering and PDF generation happens on your device. Your data stays yours.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFPageReorder;
