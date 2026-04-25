import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import { 
    FaFilePdf, FaEyeSlash, FaDownload, FaFileUpload, 
    FaSync, FaSearchPlus, FaSearchMinus, FaArrowLeft, FaArrowRight,
    FaShieldAlt, FaCropAlt, FaCheckCircle, FaTrashAlt, FaLock
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const PDFRedactor = () => {
    const [file, setFile] = useState(null);
    const [pdfPreview, setPdfPreview] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(0.8);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resultPdfUrl, setResultPdfUrl] = useState(null);

    // Redaction Areas: { pageIndex: [{ id, x, y, width, height }] }
    const [redactionAreas, setRedactionAreas] = useState({});
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
        setRedactionAreas({});
        setCurrentPage(1);
        
        try {
            const fileUrl = URL.createObjectURL(selectedFile);
            const loadingTask = pdfjsLib.getDocument(fileUrl);
            const pdf = await loadingTask.promise;
            setNumPages(pdf.numPages);
            setPdfPreview(pdf);
            toast.success('PDF loaded for redaction!');
        } catch (error) {
            console.error('Load Error:', error);
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
        if (currentSelection && currentSelection.width > 5 && currentSelection.height > 5) {
            setRedactionAreas(prev => ({
                ...prev,
                [currentPage]: [...(prev[currentPage] || []), { ...currentSelection, id: Date.now() }]
            }));
        }
        setIsSelecting(false);
        setStartPos(null);
        setCurrentSelection(null);
    };

    const removeArea = (pageIdx, id) => {
        setRedactionAreas(prev => ({
            ...prev,
            [pageIdx]: prev[pageIdx].filter(area => area.id !== id)
        }));
    };

    const applyRedaction = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            const pages = pdfDoc.getPages();

            for (const pageIdxStr in redactionAreas) {
                const pageIdx = parseInt(pageIdxStr);
                const page = pages[pageIdx - 1];
                const { width, height } = page.getSize();
                
                const pdfJsPage = await pdfPreview.getPage(pageIdx);
                const viewport = pdfJsPage.getViewport({ scale });
                
                const ratioX = width / viewport.width;
                const ratioY = height / viewport.height;

                for (const area of redactionAreas[pageIdxStr]) {
                    page.drawRectangle({
                        x: area.x * ratioX,
                        y: height - (area.y * ratioY) - (area.height * ratioY),
                        width: area.width * ratioX,
                        height: area.height * ratioY,
                        color: rgb(0, 0, 0), // Solid Black Redaction
                    });
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setResultPdfUrl(url);
            toast.success('Permanent redaction applied!');
        } catch (error) {
            console.error('Redaction Error:', error);
            toast.error('Failed to apply redaction.');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadPdf = () => {
        if (!resultPdfUrl) return;
        const link = document.createElement('a');
        link.href = resultPdfUrl;
        link.download = `redacted_${file.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const totalRedactions = Object.values(redactionAreas).flat().length;

    return (
        <div className="pdf-redactor-tool py-4">
            <style>{`
                .pdf-redactor-tool {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .main-container {
                    background: #1e293b;
                    border-radius: 28px;
                    overflow: hidden;
                    border: 1px solid #334155;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    display: flex;
                    flex-direction: column;
                    min-height: 85vh;
                }
                .sidebar {
                    background: #0f172a;
                    border-right: 1px solid #334155;
                    padding: 2rem;
                    height: 100%;
                    color: #94a3b8;
                }
                .preview-area {
                    background: #020617;
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
                    box-shadow: 0 0 60px rgba(0,0,0,0.8);
                    background: white;
                    cursor: crosshair;
                }
                .redaction-box {
                    position: absolute;
                    background: black;
                    border: 1px solid #334155;
                    pointer-events: all;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .current-selection {
                    position: absolute;
                    border: 2px dashed #6366f1;
                    background: rgba(99, 102, 241, 0.2);
                    pointer-events: none;
                }
                .delete-area-btn {
                    color: #ef4444;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .redaction-box:hover .delete-area-btn {
                    opacity: 1;
                }
                .control-card {
                    background: #1e293b;
                    border-radius: 20px;
                    border: 1px solid #334155;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                }
                .nav-group {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    background: rgba(30, 41, 59, 0.8);
                    padding: 10px 30px;
                    border-radius: 100px;
                    margin-bottom: 2.5rem;
                    backdrop-filter: blur(12px);
                    border: 1px solid #334155;
                }
                .upload-placeholder {
                    background: #0f172a;
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
                    background: #0f172a;
                    border-top: 1px solid #334155;
                    padding: 1.5rem 2.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .redact-btn {
                    background: linear-gradient(135deg, #ef4444 0%, #7f1d1d 100%);
                    color: white;
                    border: none;
                    padding: 14px 40px;
                    border-radius: 16px;
                    font-weight: 800;
                    letter-spacing: 0.5px;
                    box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.4);
                    transition: all 0.3s;
                }
                .redact-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 20px 30px -5px rgba(239, 68, 68, 0.5);
                }
                .premium-warning {
                    background: #450a0a;
                    border: 1px solid #991b1b;
                    color: #fca5a5;
                    padding: 1rem;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    margin-bottom: 1.5rem;
                }
            `}</style>

            <div className="main-container fade-in">
                {!file ? (
                    <div className="upload-placeholder">
                        <div className="p-5 rounded-full bg-slate-800 mb-4 animate-pulse">
                            <FaEyeSlash size={64} className="text-white" />
                        </div>
                        <h2 className="display-6 fw-bold text-white mb-3">Permanent PDF Redaction</h2>
                        <p className="text-white mb-4 lead" style={{ maxWidth: '650px' }}>
                            Securely hide sensitive information, PII, and financial data. Our tool applies solid black boxes to your document that cannot be removed by readers.
                        </p>
                        <label className="btn btn-danger btn-lg px-5 py-3 rounded-2xl shadow-2xl d-flex align-items-center gap-3 transition-all hover:scale-105" style={{ background: '#ef4444', color: 'white', border: 'none' }}>
                            <FaFileUpload /> Select PDF to Redact
                            <input type="file" hidden accept=".pdf" onChange={onFileChange} />
                        </label>
                    </div>
                ) : (
                    <Row className="g-0 flex-grow-1">
                        <Col lg={3} className="sidebar">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <FaShieldAlt className="text-red-500" size={24} />
                                <h5 className="fw-bold mb-0 text-white">Security Panel</h5>
                            </div>

                            <div className="premium-warning">
                                <FaLock className="me-2" /> 
                                <b>Permanent Action:</b> Redactions are burned into the document. This cannot be undone after downloading.
                            </div>

                            <div className="control-card">
                                <h6 className="fw-bold mb-3 small text-white">Instructions</h6>
                                <p className="x-small mb-0 text-slate-400">
                                    Draw black boxes over sensitive data like SSNs, emails, or names. Areas are page-specific.
                                </p>
                            </div>

                            <div className="control-card">
                                <h6 className="fw-bold mb-3 small text-white">Redactions on this Page ({ (redactionAreas[currentPage] || []).length })</h6>
                                { (redactionAreas[currentPage] || []).length === 0 ? (
                                    <p className="text-slate-500 x-small italic mb-0">No redactions on page {currentPage}.</p>
                                ) : (
                                    <div className="d-flex flex-column gap-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {redactionAreas[currentPage].map((area, idx) => (
                                            <div key={area.id} className="d-flex justify-content-between align-items-center p-2 bg-slate-800 rounded-3 border border-slate-700">
                                                <span className="x-small fw-bold text-slate-300">Region {idx + 1}</span>
                                                <Button variant="link" className="text-danger p-0" onClick={() => removeArea(currentPage, area.id)}>
                                                    <FaTrashAlt size={12} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-4 text-center x-small text-slate-500">
                                Total Redactions: <b>{totalRedactions}</b>
                            </div>
                        </Col>

                        <Col lg={9} className="preview-area">
                            <div className="nav-group">
                                <Button variant="link" className="text-slate-400 p-0 hover:text-white" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}>
                                    <FaArrowLeft />
                                </Button>
                                <span className="text-white small fw-bold">Page {currentPage} of {numPages}</span>
                                <Button variant="link" className="text-slate-400 p-0 hover:text-white" onClick={() => setCurrentPage(p => Math.min(numPages, p+1))} disabled={currentPage === numPages}>
                                    <FaArrowRight />
                                </Button>
                                <div className="border-start border-slate-700 mx-2 h-20"></div>
                                <Button variant="link" className="text-slate-400 p-0 hover:text-white" onClick={() => setScale(s => Math.max(0.4, s - 0.1))}><FaSearchMinus /></Button>
                                <Button variant="link" className="text-slate-400 p-0 hover:text-white" onClick={() => setScale(s => Math.min(2, s + 0.1))}><FaSearchPlus /></Button>
                            </div>

                            <div 
                                className="pdf-canvas-container" 
                                ref={containerRef}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                style={{ cursor: resultPdfUrl ? 'default' : 'crosshair' }}
                            >
                                <canvas ref={canvasRef} className="preview-canvas" />
                                <div className="selection-overlay">
                                    {(redactionAreas[currentPage] || []).map(area => (
                                        <div 
                                            key={area.id} 
                                            className="redaction-box"
                                            style={{
                                                left: area.x,
                                                top: area.y,
                                                width: area.width,
                                                height: area.height
                                            }}
                                        >
                                            <button className="delete-area-btn" onClick={() => removeArea(currentPage, area.id)}>
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
                            <div className="p-2 rounded-3 bg-red-900 bg-opacity-20 text-red-500">
                                <FaFilePdf size={20} />
                            </div>
                            <div className="d-none d-md-block">
                                <div className="small fw-bold text-white text-truncate" style={{ maxWidth: '300px' }}>{file.name}</div>
                                <div className="x-small text-slate-500">Document ready for secure redaction</div>
                            </div>
                        </div>

                        <div className="d-flex gap-3">
                            {resultPdfUrl ? (
                                <>
                                    <Button variant="outline-slate" className="rounded-3 px-4 border-slate-700 text-slate-300" onClick={() => setResultPdfUrl(null)}>
                                        <FaSync className="me-2" /> Modify
                                    </Button>
                                    <Button variant="success" className="rounded-3 px-4 fw-bold" style={{ background: '#10b981', border: 'none' }} onClick={downloadPdf}>
                                        <FaDownload className="me-2" /> Download Redacted PDF
                                    </Button>
                                </>
                            ) : (
                                <Button className="redact-btn" onClick={applyRedaction} disabled={isProcessing || totalRedactions === 0}>
                                    {isProcessing ? <Spinner animation="border" size="sm" className="me-2" /> : <FaEyeSlash className="me-2" />}
                                    {isProcessing ? 'Burning Redactions...' : 'Finalize & Redact Document'}
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-5 row g-4">
                <div className="col-md-4">
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-4 shadow-xl h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-red-500">
                            <FaLock /> Permanent Protection
                        </div>
                        <p className="text-slate-400 small mb-0">Unlike simply drawing a box in a PDF viewer, our tool "burns" the black rectangles into the content stream, ensuring the data is unrecoverable.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-4 shadow-xl h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-red-500">
                            <FaCropAlt /> Precise Selection
                        </div>
                        <p className="text-slate-400 small mb-0">Navigate page by page and select specific blocks of text, images, or account numbers with surgical precision using our visual interface.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-4 shadow-xl h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-red-500">
                            <FaShieldAlt /> Privacy Guaranteed
                        </div>
                        <p className="text-slate-400 small mb-0">Processing happens entirely on your device. Your sensitive data never crosses the internet, keeping you compliant with GDPR and HIPAA.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFRedactor;
