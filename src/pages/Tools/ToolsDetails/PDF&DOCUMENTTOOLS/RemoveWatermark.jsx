import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import { 
    FaFilePdf, FaEraser, FaDownload, FaFileUpload, 
    FaSync, FaSearchPlus, FaSearchMinus, FaArrowLeft, FaArrowRight,
    FaEye, FaCropAlt, FaCheckCircle, FaTrashAlt
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const RemoveWatermark = () => {
    const [file, setFile] = useState(null);
    const [pdfPreview, setPdfPreview] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(0.8);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resultPdfUrl, setResultPdfUrl] = useState(null);

    // Removal Areas
    const [removalAreas, setRemovalAreas] = useState([]); // [{ id, x, y, width, height }]
    const [isSelecting, setIsSelecting] = useState(false);
    const [startPos, setStartPos] = useState(null);
    const [currentSelection, setCurrentSelection] = useState(null);

    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    const onFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            toast.error('Please upload a valid PDF file.');
            return;
        }

        setFile(selectedFile);
        setIsLoading(true);
        setResultPdfUrl(null);
        setRemovalAreas([]);
        setCurrentPage(1);
        
        try {
            const fileUrl = URL.createObjectURL(selectedFile);
            const loadingTask = pdfjsLib.getDocument(fileUrl);
            const pdf = await loadingTask.promise;
            setNumPages(pdf.numPages);
            setPdfPreview(pdf);
            toast.success('PDF loaded successfully!');
        } catch (error) {
            console.error('Error loading PDF:', error);
            toast.error('Failed to read PDF file.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderPage = async () => {
        if (!pdfPreview || !canvasRef.current) return;
        
        try {
            const page = await pdfPreview.getPage(currentPage);
            const viewport = page.getViewport({ scale });
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport }).promise;
        } catch (error) {
            console.error('Render Error:', error);
        }
    };

    useEffect(() => {
        if (pdfPreview) renderPage();
    }, [pdfPreview, currentPage, scale]);

    const handleMouseDown = (e) => {
        if (!file || resultPdfUrl) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setStartPos({ x, y });
        setIsSelecting(true);
    };

    const handleMouseMove = (e) => {
        if (!isSelecting || !startPos) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setCurrentSelection({
            x: Math.min(x, startPos.x),
            y: Math.min(y, startPos.y),
            width: Math.abs(x - startPos.x),
            height: Math.abs(y - startPos.y)
        });
    };

    const handleMouseUp = () => {
        if (currentSelection && currentSelection.width > 10 && currentSelection.height > 10) {
            setRemovalAreas(prev => [...prev, { ...currentSelection, id: Date.now() }]);
        }
        setIsSelecting(false);
        setStartPos(null);
        setCurrentSelection(null);
    };

    const removeArea = (id) => {
        setRemovalAreas(prev => prev.filter(area => area.id !== id));
    };

    const processRemoval = async () => {
        if (!file || removalAreas.length === 0) return;
        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            const pages = pdfDoc.getPages();

            // Calculate ratios for all areas
            // Since we use the same scale for all pages in this tool, we can use the current viewport
            const pdfJsPage = await pdfPreview.getPage(currentPage);
            const viewport = pdfJsPage.getViewport({ scale });

            for (const page of pages) {
                const { width, height } = page.getSize();
                const ratioX = width / viewport.width;
                const ratioY = height / viewport.height;

                for (const area of removalAreas) {
                    page.drawRectangle({
                        x: area.x * ratioX,
                        y: height - (area.y * ratioY) - (area.height * ratioY),
                        width: area.width * ratioX,
                        height: area.height * ratioY,
                        color: rgb(1, 1, 1), // Whiteout
                    });
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setResultPdfUrl(url);
            toast.success('Watermarks removed (whited out)!');
        } catch (error) {
            console.error('Removal Error:', error);
            toast.error('Failed to remove watermark areas.');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadPdf = () => {
        if (!resultPdfUrl) return;
        const link = document.createElement('a');
        link.href = resultPdfUrl;
        link.download = `cleaned_${file.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="remove-watermark-tool py-4">
            <style>{`
                .remove-watermark-tool {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .main-container {
                    background: #ffffff;
                    border-radius: 28px;
                    overflow: hidden;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    display: flex;
                    flex-direction: column;
                    min-height: 80vh;
                }
                .sidebar {
                    background: #f8fafc;
                    border-right: 1px solid #e2e8f0;
                    padding: 2rem;
                    height: 100%;
                }
                .preview-area {
                    background: #475569;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 3rem;
                    overflow: auto;
                    flex-grow: 1;
                    position: relative;
                }
                .pdf-canvas-container {
                    position: relative;
                    box-shadow: 0 0 50px rgba(0,0,0,0.3);
                    background: white;
                    cursor: crosshair;
                    user-select: none;
                }
                .preview-canvas {
                    display: block;
                }
                .selection-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }
                .removal-box {
                    position: absolute;
                    border: 2px solid #ef4444;
                    background: rgba(239, 68, 68, 0.1);
                    pointer-events: all;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .current-selection {
                    position: absolute;
                    border: 2px dashed #3b82f6;
                    background: rgba(59, 130, 246, 0.2);
                    pointer-events: none;
                }
                .delete-area-btn {
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 2px 6px;
                    font-size: 10px;
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .removal-box:hover .delete-area-btn {
                    opacity: 1;
                }
                .control-card {
                    background: white;
                    border-radius: 20px;
                    border: 1px solid #e2e8f0;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                }
                .nav-group {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: rgba(0,0,0,0.5);
                    padding: 8px 24px;
                    border-radius: 100px;
                    margin-bottom: 2rem;
                    backdrop-filter: blur(10px);
                }
                .upload-placeholder {
                    background: white;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 4rem;
                }
                .action-bar {
                    background: white;
                    border-top: 1px solid #e2e8f0;
                    padding: 1.2rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .remove-btn {
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                    color: white;
                    border: none;
                    padding: 12px 32px;
                    border-radius: 14px;
                    font-weight: 700;
                    box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.4);
                    transition: all 0.3s;
                }
                .remove-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 25px -5px rgba(239, 68, 68, 0.5);
                }
            `}</style>

            <div className="main-container fade-in">
                {!file ? (
                    <div className="upload-placeholder">
                        <div className="p-5 rounded-full bg-red-50 mb-4 animate-pulse">
                            <FaEraser size={64} className="text-red-500" />
                        </div>
                        <h2 className="display-6 fw-bold text-slate-900 mb-3">Remove PDF Watermark</h2>
                        <p className="text-slate-500 mb-4 lead" style={{ maxWidth: '600px' }}>
                            Easily clean your PDF documents by removing unwanted watermarks, logos, or headers. Simply draw a box over the area and we'll handle the rest across all pages.
                        </p>
                        <label className="btn btn-danger btn-lg px-5 py-3 rounded-2xl shadow-xl d-flex align-items-center gap-3 transition-all hover:scale-105" style={{ background: '#ef4444', color: 'white', border: 'none' }}>
                            <FaFileUpload /> Upload PDF to Clean
                            <input type="file" hidden accept=".pdf" onChange={onFileChange} />
                        </label>
                    </div>
                ) : (
                    <Row className="g-0 flex-grow-1">
                        <Col lg={4} className="sidebar">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <FaCropAlt className="text-red-500" size={24} />
                                <h4 className="fw-bold mb-0">Tools</h4>
                            </div>

                            <div className="control-card">
                                <h6 className="fw-bold mb-3 small">Instructions</h6>
                                <p className="text-muted x-small mb-0">
                                    1. Navigate to the page with the watermark.<br/>
                                    2. Click and drag your mouse to select the watermark area.<br/>
                                    3. The selected area will be whited out across <b>all pages</b> of the document.
                                </p>
                            </div>

                            <div className="control-card">
                                <h6 className="fw-bold mb-3 small">Selected Areas ({removalAreas.length})</h6>
                                {removalAreas.length === 0 ? (
                                    <p className="text-muted x-small italic mb-0">No areas selected yet.</p>
                                ) : (
                                    <div className="d-flex flex-column gap-2">
                                        {removalAreas.map((area, idx) => (
                                            <div key={area.id} className="d-flex justify-content-between align-items-center p-2 bg-light rounded-3 border">
                                                <span className="small fw-bold">Area {idx + 1}</span>
                                                <Button variant="link" className="text-danger p-0" onClick={() => removeArea(area.id)}>
                                                    <FaTrashAlt size={12} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="control-card bg-light border-0 mt-auto">
                                <h6 className="fw-bold mb-2 small">Why whiteout?</h6>
                                <p className="text-muted x-small mb-0">
                                    Directly deleting content stream objects can often corrupt PDF structures. Whiteout is the safest, most compatible way to visually remove watermarks in the browser.
                                </p>
                            </div>
                        </Col>

                        <Col lg={8} className="preview-area">
                            <div className="nav-group">
                                <Button variant="link" className="text-white p-0" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}>
                                    <FaArrowLeft />
                                </Button>
                                <span className="text-white small fw-bold mx-2">Page {currentPage} of {numPages}</span>
                                <Button variant="link" className="text-white p-0" onClick={() => setCurrentPage(p => Math.min(numPages, p+1))} disabled={currentPage === numPages}>
                                    <FaArrowRight />
                                </Button>
                                <div className="border-start border-secondary mx-2 h-20"></div>
                                <Button variant="link" className="text-white p-0" onClick={() => setScale(s => Math.max(0.4, s - 0.1))}><FaSearchMinus /></Button>
                                <Button variant="link" className="text-white p-0" onClick={() => setScale(s => Math.min(2, s + 0.1))}><FaSearchPlus /></Button>
                            </div>

                            <div 
                                className="pdf-canvas-container" 
                                ref={containerRef}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                            >
                                <canvas ref={canvasRef} className="preview-canvas" />
                                <div className="selection-overlay">
                                    {removalAreas.map(area => (
                                        <div 
                                            key={area.id} 
                                            className="removal-box"
                                            style={{
                                                left: area.x,
                                                top: area.y,
                                                width: area.width,
                                                height: area.height
                                            }}
                                        >
                                            <button className="delete-area-btn" onClick={() => removeArea(area.id)}>
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    ))}
                                    {currentSelection && (
                                        <div 
                                            className="current-selection"
                                            style={{
                                                left: currentSelection.x,
                                                top: currentSelection.y,
                                                width: currentSelection.width,
                                                height: currentSelection.height
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>
                )}

                {file && (
                    <div className="action-bar">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-2 rounded-3 bg-red-50 text-red-500">
                                <FaFilePdf size={20} />
                            </div>
                            <div>
                                <div className="small fw-bold text-dark text-truncate" style={{ maxWidth: '200px' }}>{file.name}</div>
                                <div className="x-small text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                        </div>

                        <div className="d-flex gap-3">
                            {resultPdfUrl ? (
                                <>
                                    <Button variant="outline-secondary" className="rounded-3 px-4" onClick={() => setResultPdfUrl(null)}>
                                        <FaSync className="me-2" /> Modify
                                    </Button>
                                    <Button variant="success" className="rounded-3 px-4 fw-bold" onClick={downloadPdf}>
                                        <FaDownload className="me-2" /> Download Cleaned PDF
                                    </Button>
                                </>
                            ) : (
                                <Button className="remove-btn" onClick={processRemoval} disabled={isProcessing || removalAreas.length === 0}>
                                    {isProcessing ? <Spinner animation="border" size="sm" className="me-2" /> : <FaCheckCircle className="me-2" />}
                                    {isProcessing ? 'Processing...' : 'Apply Removal to All Pages'}
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-5 row g-4">
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-red-500">
                            <FaCropAlt /> Area Selection
                        </div>
                        <p className="text-muted small mb-0">Use your mouse to precisely select the areas where watermarks or logos appear. You can add multiple removal boxes to a single document.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-red-500">
                            <FaSync /> Batch Removal
                        </div>
                        <p className="text-muted small mb-0">Once you select a watermark area, it's automatically applied to every page in the PDF, saving you time on long documents.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-red-500">
                            <FaEye /> Clean Results
                        </div>
                        <p className="text-muted small mb-0">We use high-fidelity coordinate mapping to ensure the whiteout covers the watermark perfectly while preserving the rest of your content.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RemoveWatermark;
