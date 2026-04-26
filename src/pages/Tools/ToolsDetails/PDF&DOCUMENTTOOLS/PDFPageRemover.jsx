import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { Form, Button, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { 
    FaFilePdf, FaTrashAlt, FaDownload, FaFileUpload, 
    FaCheckCircle, FaUndo, FaEraser 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const PDFPageRemover = () => {
    const [file, setFile] = useState(null);
    const [thumbnails, setThumbnails] = useState([]);
    const [selectedPages, setSelectedPages] = useState(new Set());
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultPdfUrl, setResultPdfUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            toast.error('Only PDF files are allowed.');
            return;
        }

        setFile(selectedFile);
        setSelectedPages(new Set());
        setResultPdfUrl(null);
        setThumbnails([]);
        setIsLoading(true);
        
        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            const thumbs = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.3 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport }).promise;
                thumbs.push({
                    pageNumber: i,
                    dataUrl: canvas.toDataURL()
                });
            }
            setThumbnails(thumbs);
            toast.success(`PDF Loaded: ${pdf.numPages} pages`);
        } catch {
            toast.error('Failed to read PDF file.');
        } finally {
            setIsLoading(false);
        }
    };

    const togglePageSelection = (pageNumber) => {
        const newSelection = new Set(selectedPages);
        if (newSelection.has(pageNumber)) {
            newSelection.delete(pageNumber);
        } else {
            newSelection.add(pageNumber);
        }
        setSelectedPages(newSelection);
        setResultPdfUrl(null);
    };

    const removePages = async () => {
        if (!file || selectedPages.size === 0) return;
        if (selectedPages.size === thumbnails.length) {
            toast.error('Cannot remove all pages from a PDF.');
            return;
        }

        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfLibDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            
            // Convert page numbers (1-indexed) to 0-indexed and sort descending
            const indicesToRemove = Array.from(selectedPages)
                .map(p => p - 1)
                .sort((a, b) => b - a);

            indicesToRemove.forEach(index => {
                pdfLibDoc.removePage(index);
            });

            const pdfBytes = await pdfLibDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            
            setResultPdfUrl(url);
            toast.success(`${selectedPages.size} pages removed successfully!`);
        } catch {
            toast.error('An error occurred during page removal.');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadResult = () => {
        if (!resultPdfUrl) return;
        const link = document.createElement('a');
        link.href = resultPdfUrl;
        link.download = `updated_${file.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="pdf-page-remover-container py-4">
            <style>{`
                .pdf-page-remover-container {
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
                .pages-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                    gap: 15px;
                    margin-bottom: 2rem;
                }
                .page-thumb-card {
                    background: white;
                    border: 2px solid #edf2f7;
                    border-radius: 12px;
                    padding: 10px;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.2s;
                }
                .page-thumb-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .page-thumb-card.selected {
                    border-color: #e53e3e;
                    background: #fff5f5;
                }
                .page-thumb-card img {
                    width: 100%;
                    height: 160px;
                    object-fit: contain;
                    margin-bottom: 8px;
                    background: #f1f5f9;
                }
                .selection-badge {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: white;
                    border: 2px solid #cbd5e0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .selected .selection-badge {
                    background: #e53e3e;
                    border-color: #e53e3e;
                    color: white;
                }
                .btn-remove {
                    background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
                    border: none;
                    padding: 1rem 2.5rem;
                    font-weight: 700;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(229, 62, 62, 0.3);
                    transition: all 0.3s;
                }
                .btn-remove:hover:not(:disabled) {
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
                    <div className="p-3 rounded-4" style={{ background: '#fff5f5' }}>
                        <FaTrashAlt size={28} style={{ color: '#e53e3e' }} />
                    </div>
                    <div>
                        <h2 className="h4 fw-bold mb-1" style={{ color: '#1a202c' }}>PDF Page Remover</h2>
                        <p className="text-muted mb-0 small">Select and remove unwanted pages from your PDF file.</p>
                    </div>
                </div>

                {!file ? (
                    <div className="upload-zone">
                        <input type="file" accept=".pdf" onChange={onFileChange} />
                        <FaFileUpload size={48} className="mb-3" style={{ color: '#e53e3e' }} />
                        <h5 className="fw-bold mb-2">Upload PDF to Edit</h5>
                        <p className="text-muted small mb-0">Select the PDF file you want to remove pages from</p>
                    </div>
                ) : (
                    <div className="file-info fade-in p-3 border rounded-4 mb-4 d-flex align-items-center justify-content-between bg-light">
                        <div className="d-flex align-items-center gap-3">
                            <FaFilePdf size={32} color="#e53e3e" />
                            <div>
                                <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '300px' }}>{file.name}</div>
                                <div className="text-muted small">{(file.size / 1024 / 1024).toFixed(2)} MB • {thumbnails.length} Pages</div>
                            </div>
                        </div>
                        <Button variant="link" className="text-danger p-0 fw-bold" onClick={() => { setFile(null); setThumbnails([]); setSelectedPages(new Set()); setResultPdfUrl(null); }}>
                            Change File
                        </Button>
                    </div>
                )}

                {isLoading && (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="danger" className="mb-3" />
                        <p className="text-muted fw-bold">Generating page previews...</p>
                    </div>
                )}

                {thumbnails.length > 0 && (
                    <div className="fade-in">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="fw-bold mb-0 text-muted">SELECT PAGES TO REMOVE</h6>
                            <Badge bg="danger" className="rounded-pill px-3 py-2">
                                {selectedPages.size} selected for removal
                            </Badge>
                        </div>
                        
                        <div className="pages-grid">
                            {thumbnails.map(thumb => (
                                <div 
                                    key={thumb.pageNumber} 
                                    className={`page-thumb-card ${selectedPages.has(thumb.pageNumber) ? 'selected' : ''}`}
                                    onClick={() => togglePageSelection(thumb.pageNumber)}
                                >
                                    <div className="selection-badge">
                                        {selectedPages.has(thumb.pageNumber) && <FaTrashAlt size={10} />}
                                    </div>
                                    <img src={thumb.dataUrl} alt={`Page ${thumb.pageNumber}`} />
                                    <div className="text-center small fw-bold text-muted">PAGE {thumb.pageNumber}</div>
                                </div>
                            ))}
                        </div>

                        <div className="d-flex flex-column flex-md-row gap-3 justify-content-center mt-4">
                            {!resultPdfUrl ? (
                                <>
                                    <Button 
                                        variant="outline-secondary" 
                                        style={{ borderRadius: '12px', padding: '1rem 2rem' }}
                                        onClick={() => setSelectedPages(new Set())}
                                        disabled={selectedPages.size === 0 || isProcessing}
                                    >
                                        <FaUndo className="me-2" /> Deselect All
                                    </Button>
                                    <Button 
                                        className="btn-remove text-white d-flex align-items-center justify-content-center gap-2"
                                        onClick={removePages}
                                        disabled={selectedPages.size === 0 || isProcessing}
                                    >
                                        {isProcessing ? <Spinner animation="border" size="sm" /> : <FaEraser />}
                                        {isProcessing ? 'Processing PDF...' : `Remove ${selectedPages.size} Pages`}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button 
                                        variant="outline-danger" 
                                        style={{ borderRadius: '12px', padding: '1rem 2rem' }}
                                        onClick={() => { setResultPdfUrl(null); setSelectedPages(new Set()); }}
                                    >
                                        Undo Changes
                                    </Button>
                                    <Button 
                                        className="btn-download text-white d-flex align-items-center justify-content-center gap-2"
                                        onClick={downloadResult}
                                    >
                                        <FaDownload /> Download Updated PDF
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {resultPdfUrl && (
                    <div className="mt-4 p-3 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-4 d-flex align-items-center gap-3 fade-in">
                        <FaCheckCircle className="text-success" size={20} />
                        <span className="text-success fw-bold">Success! Your new PDF document is ready for download.</span>
                    </div>
                )}
            </div>

            <div className="how-it-works main-card fade-in">
                <h4 className="fw-bold mb-4">How it Works</h4>
                <div className="row g-4 text-center">
                    <div className="col-md-4">
                        <div className="p-3">
                            <div className="h4 text-danger fw-bold mb-2">01</div>
                            <h6 className="fw-bold">Upload PDF</h6>
                            <p className="text-muted small">Load your PDF file to see a preview of all pages.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3">
                            <div className="h4 text-danger fw-bold mb-2">02</div>
                            <h6 className="fw-bold">Select Pages</h6>
                            <p className="text-muted small">Click on the thumbnails of the pages you want to delete.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3">
                            <div className="h4 text-danger fw-bold mb-2">03</div>
                            <h6 className="fw-bold">Download</h6>
                            <p className="text-muted small">Click remove and download your updated PDF instantly.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFPageRemover;
