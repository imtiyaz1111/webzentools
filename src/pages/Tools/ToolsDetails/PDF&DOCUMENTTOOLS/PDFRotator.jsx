import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { Form, Button, Spinner, Row, Col, Card } from 'react-bootstrap';
import { 
    FaFilePdf, FaSync, FaDownload, FaFileUpload, 
    FaRedo, FaUndo, FaCheckCircle, FaTrash, FaThLarge
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const PDFRotator = () => {
    const [file, setFile] = useState(null);
    const [thumbnails, setThumbnails] = useState([]); // [{ pageIndex, dataUrl, rotation }]
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resultPdfUrl, setResultPdfUrl] = useState(null);

    const onFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            toast.error('Please upload a valid PDF file.');
            return;
        }

        setFile(selectedFile);
        setIsLoading(true);
        setThumbnails([]);
        setResultPdfUrl(null);
        
        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const numPages = pdf.numPages;
            
            const newThumbnails = [];
            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.3 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                await page.render({ canvasContext: context, viewport }).promise;
                newThumbnails.push({
                    index: i - 1,
                    dataUrl: canvas.toDataURL(),
                    rotation: 0 // 0, 90, 180, 270
                });
            }
            setThumbnails(newThumbnails);
            toast.success(`${numPages} pages loaded for rotation!`);
        } catch (error) {
            console.error('Load Error:', error);
            toast.error('Failed to read PDF file.');
        } finally {
            setIsLoading(false);
        }
    };

    const rotatePage = (index, delta) => {
        setThumbnails(prev => prev.map(thumb => {
            if (thumb.index === index) {
                let newRot = (thumb.rotation + delta) % 360;
                if (newRot < 0) newRot += 360;
                return { ...thumb, rotation: newRot };
            }
            return thumb;
        }));
        setResultPdfUrl(null);
    };

    const rotateAll = (delta) => {
        setThumbnails(prev => prev.map(thumb => {
            let newRot = (thumb.rotation + delta) % 360;
            if (newRot < 0) newRot += 360;
            return { ...thumb, rotation: newRot };
        }));
        setResultPdfUrl(null);
    };

    const handleRotatePdf = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            const pages = pdfDoc.getPages();

            thumbnails.forEach(thumb => {
                const page = pages[thumb.index];
                const currentRot = page.getRotation().angle;
                page.setRotation(degrees((currentRot + thumb.rotation) % 360));
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setResultPdfUrl(url);
            toast.success('PDF rotated successfully!');
        } catch (error) {
            console.error('Rotation Error:', error);
            toast.error('Failed to rotate PDF.');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadPdf = () => {
        if (!resultPdfUrl) return;
        const link = document.createElement('a');
        link.href = resultPdfUrl;
        link.download = `rotated_${file.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="pdf-rotator-tool py-4">
            <style>{`
                .pdf-rotator-tool {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .main-card {
                    background: #ffffff;
                    border-radius: 28px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    padding: 2.5rem;
                }
                .page-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 2rem;
                    margin-top: 2rem;
                    max-height: 60vh;
                    overflow-y: auto;
                    padding: 1rem;
                    background: #f8fafc;
                    border-radius: 20px;
                }
                .page-card {
                    background: white;
                    border-radius: 16px;
                    border: 1px solid #e2e8f0;
                    padding: 1rem;
                    text-align: center;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }
                .page-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.1);
                    border-color: #3b82f6;
                }
                .thumb-wrapper {
                    height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1rem;
                    overflow: hidden;
                }
                .page-thumb {
                    max-width: 100%;
                    max-height: 100%;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .rotation-controls {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                }
                .rot-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    border: 1px solid #e2e8f0;
                    background: white;
                    color: #64748b;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .rot-btn:hover {
                    background: #3b82f6;
                    color: white;
                    border-color: #3b82f6;
                }
                .upload-zone {
                    border: 2px dashed #cbd5e0;
                    border-radius: 24px;
                    padding: 4rem 2rem;
                    text-align: center;
                    background: #f8fafc;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .upload-zone:hover {
                    border-color: #3b82f6;
                    background: #eff6ff;
                }
                .action-bar {
                    background: white;
                    border: 1px solid #e2e8f0;
                    padding: 1.2rem 2rem;
                    border-radius: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 2rem;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
                }
                .apply-btn {
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    color: white;
                    border: none;
                    padding: 12px 32px;
                    border-radius: 14px;
                    font-weight: 700;
                    transition: all 0.3s;
                }
                .apply-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
                }
                .page-number {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    width: 24px;
                    height: 24px;
                    background: #3b82f6;
                    color: white;
                    border-radius: 50%;
                    font-size: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }
            `}</style>

            <div className="main-card fade-in">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <div className="p-3 rounded-4 bg-blue-50 text-blue-600">
                            <FaSync size={28} className={isLoading ? 'animate-spin' : ''} />
                        </div>
                        <div>
                            <h2 className="h4 fw-bold mb-1">Rotate PDF Pages</h2>
                            <p className="text-muted mb-0 small">Rotate specific pages or the entire document clockwise or counter-clockwise.</p>
                        </div>
                    </div>
                    {thumbnails.length > 0 && (
                        <div className="d-flex gap-2">
                            <Button variant="outline-primary" className="rounded-xl px-3 d-flex align-items-center gap-2" onClick={() => rotateAll(-90)}>
                                <FaUndo /> Rotate All Left
                            </Button>
                            <Button variant="primary" className="rounded-xl px-3 d-flex align-items-center gap-2" onClick={() => rotateAll(90)}>
                                <FaRedo /> Rotate All Right
                            </Button>
                        </div>
                    )}
                </div>

                {!file ? (
                    <div className="upload-zone" onClick={() => document.getElementById('pdfInput').click()}>
                        <input type="file" id="pdfInput" hidden accept=".pdf" onChange={onFileChange} />
                        <div className="p-4 rounded-circle bg-blue-50 d-inline-block mb-4 text-blue-600">
                            <FaFileUpload size={48} />
                        </div>
                        <h4 className="fw-bold mb-2">Upload PDF Document</h4>
                        <p className="text-slate-500 mb-0">Click or drag and drop to start rotating pages</p>
                    </div>
                ) : (
                    <>
                        <div className="page-grid scrollbar-hide">
                            {isLoading ? (
                                <div className="w-100 py-5 text-center">
                                    <Spinner animation="border" variant="primary" className="mb-3" />
                                    <p className="text-muted fw-bold">Analyzing document and generating previews...</p>
                                </div>
                            ) : (
                                thumbnails.map((thumb) => (
                                    <div key={thumb.index} className="page-card fade-in">
                                        <div className="page-number">{thumb.index + 1}</div>
                                        <div className="thumb-wrapper">
                                            <img 
                                                src={thumb.dataUrl} 
                                                alt={`Page ${thumb.index + 1}`} 
                                                className="page-thumb"
                                                style={{ transform: `rotate(${thumb.rotation}deg)` }}
                                            />
                                        </div>
                                        <div className="rotation-controls">
                                            <button className="rot-btn" onClick={() => rotatePage(thumb.index, -90)} title="Rotate Left">
                                                <FaUndo size={14} />
                                            </button>
                                            <button className="rot-btn" onClick={() => rotatePage(thumb.index, 90)} title="Rotate Right">
                                                <FaRedo size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="action-bar fade-in">
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-2 rounded-3 bg-blue-50 text-blue-600">
                                    <FaFilePdf size={20} />
                                </div>
                                <div className="d-none d-md-block">
                                    <div className="small fw-bold text-dark text-truncate" style={{ maxWidth: '250px' }}>{file.name}</div>
                                    <div className="x-small text-muted">{thumbnails.length} Pages • Ready to rotate</div>
                                </div>
                            </div>

                            <div className="d-flex gap-3">
                                {resultPdfUrl ? (
                                    <>
                                        <Button variant="outline-secondary" className="rounded-3 px-4" onClick={() => setResultPdfUrl(null)}>
                                            <FaSync className="me-2" /> Reset
                                        </Button>
                                        <Button variant="success" className="rounded-3 px-4 fw-bold" onClick={downloadPdf}>
                                            <FaDownload className="me-2" /> Download Rotated PDF
                                        </Button>
                                    </>
                                ) : (
                                    <Button className="apply-btn" onClick={handleRotatePdf} disabled={isProcessing || thumbnails.length === 0}>
                                        {isProcessing ? <Spinner animation="border" size="sm" className="me-2" /> : <FaCheckCircle className="me-2" />}
                                        {isProcessing ? 'Applying Rotation...' : 'Rotate & Save Document'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="mt-5 row g-4">
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-blue-600">
                            <FaThLarge /> Individual Control
                        </div>
                        <p className="text-muted small mb-0">Selectively rotate only the pages that were scanned upside down or sideways. Perfect for correcting orientation errors.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-blue-600">
                            <FaRedo /> Batch Rotation
                        </div>
                        <p className="text-muted small mb-0">Use the "Rotate All" feature to flip the entire document in 90-degree increments with a single click.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-blue-600">
                            <FaCheckCircle /> Instant Preview
                        </div>
                        <p className="text-muted small mb-0">See your orientation changes instantly with visual thumbnails for every page before saving the final document.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFRotator;
