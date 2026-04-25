import React, { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Form, Button, Spinner, InputGroup, Dropdown } from 'react-bootstrap';
import { 
    FaFilePdf, FaSearchPlus, FaSearchMinus, FaArrowLeft, 
    FaArrowRight, FaDownload, FaPrint, FaFileUpload, 
    FaExpand, FaCompress, FaEllipsisV 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const PDFViewer = () => {
    const [file, setFile] = useState(null);
    const [pdf, setPdf] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(1.5);
    const [isRendering, setIsRendering] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
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
        setCurrentPage(1);
        
        try {
            const fileUrl = URL.createObjectURL(selectedFile);
            const loadingTask = pdfjsLib.getDocument(fileUrl);
            
            loadingTask.onPassword = (updatePassword, reason) => {
                const password = prompt('This PDF is password protected. Please enter the password:');
                if (password) {
                    updatePassword(password);
                } else {
                    toast.error('Password required to view this PDF.');
                }
            };

            const loadedPdf = await loadingTask.promise;
            setPdf(loadedPdf);
            setNumPages(loadedPdf.numPages);
            toast.success('PDF loaded successfully!');
        } catch (error) {
            console.error('Error loading PDF:', error);
            toast.error(`Failed to read PDF: ${error.message || 'Unknown error'}`);
        }
    };

    const renderPage = async (pageNumber, currentScale) => {
        if (!pdf || !canvasRef.current) return;
        setIsRendering(true);
        
        try {
            const page = await pdf.getPage(pageNumber);
            const viewport = page.getViewport({ scale: currentScale });
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            
            await page.render(renderContext).promise;
        } catch (error) {
            console.error('Render Error:', error);
        } finally {
            setIsRendering(false);
        }
    };

    useEffect(() => {
        if (pdf) {
            renderPage(currentPage, scale);
        }
    }, [pdf, currentPage, scale]);

    const changePage = (offset) => {
        const newPage = currentPage + offset;
        if (newPage >= 1 && newPage <= numPages) {
            setCurrentPage(newPage);
        }
    };

    const jumpToPage = (e) => {
        const val = parseInt(e.target.value);
        if (val >= 1 && val <= numPages) {
            setCurrentPage(val);
        }
    };

    const zoom = (factor) => {
        setScale(prev => Math.max(0.5, Math.min(prev + factor, 3)));
    };

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    useEffect(() => {
        const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFsChange);
        return () => document.removeEventListener('fullscreenchange', handleFsChange);
    }, []);

    const downloadPdf = () => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const printPdf = () => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        const win = window.open(url, '_blank');
        win.focus();
        win.print();
    };

    return (
        <div className="pdf-viewer-tool py-4">
            <style>{`
                .pdf-viewer-tool {
                    max-width: 1100px;
                    margin: 0 auto;
                }
                .viewer-main-container {
                    background: #f1f5f9;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.1);
                    border: 1px solid #e2e8f0;
                    display: flex;
                    flex-direction: column;
                    height: 80vh;
                }
                .viewer-toolbar {
                    background: #ffffff;
                    border-bottom: 1px solid #e2e8f0;
                    padding: 0.8rem 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    z-index: 10;
                }
                .viewer-content {
                    flex: 1;
                    overflow: auto;
                    display: flex;
                    justify-content: center;
                    padding: 2rem;
                    background: #64748b;
                }
                .pdf-canvas {
                    box-shadow: 0 0 20px rgba(0,0,0,0.3);
                    background: white;
                    max-width: 100%;
                }
                .control-group {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: #f8fafc;
                    padding: 0.4rem;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                }
                .viewer-btn {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    border: none;
                    background: transparent;
                    color: #475569;
                    transition: all 0.2s;
                }
                .viewer-btn:hover {
                    background: #e2e8f0;
                    color: #1e293b;
                }
                .viewer-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }
                .page-input {
                    width: 50px !important;
                    text-align: center;
                    border: none !important;
                    background: transparent !important;
                    font-weight: 700;
                    padding: 0 !important;
                }
                .upload-placeholder {
                    background: white;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem;
                    text-align: center;
                }
                .fade-in {
                    animation: fadeIn 0.4s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                :fullscreen .viewer-main-container {
                    height: 100vh;
                    border-radius: 0;
                }
            `}</style>

            <div className="viewer-main-container fade-in" ref={containerRef}>
                <div className="viewer-toolbar">
                    <div className="d-flex align-items-center gap-3">
                        <div className="p-2 rounded-3 bg-danger bg-opacity-10 text-danger">
                            <FaFilePdf size={20} />
                        </div>
                        <span className="fw-bold text-dark d-none d-md-inline text-truncate" style={{ maxWidth: '200px' }}>
                            {file ? file.name : 'PDF Viewer'}
                        </span>
                    </div>

                    {pdf && (
                        <>
                            <div className="control-group">
                                <button className="viewer-btn" onClick={() => changePage(-1)} disabled={currentPage <= 1}>
                                    <FaArrowLeft size={14} />
                                </button>
                                <div className="d-flex align-items-center px-2 border-start border-end">
                                    <Form.Control 
                                        type="number" 
                                        className="page-input" 
                                        value={currentPage} 
                                        onChange={jumpToPage}
                                        min="1" 
                                        max={numPages}
                                    />
                                    <span className="text-muted small">/ {numPages}</span>
                                </div>
                                <button className="viewer-btn" onClick={() => changePage(1)} disabled={currentPage >= numPages}>
                                    <FaArrowRight size={14} />
                                </button>
                            </div>

                            <div className="control-group d-none d-sm-flex">
                                <button className="viewer-btn" onClick={() => zoom(-0.2)}>
                                    <FaSearchMinus size={14} />
                                </button>
                                <span className="small fw-bold px-2 border-start border-end">
                                    {Math.round(scale * 100)}%
                                </span>
                                <button className="viewer-btn" onClick={() => zoom(0.2)}>
                                    <FaSearchPlus size={14} />
                                </button>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <button className="viewer-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
                                    {isFullscreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
                                </button>
                                <Dropdown align="end">
                                    <Dropdown.Toggle as="button" className="viewer-btn">
                                        <FaEllipsisV size={14} />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="rounded-4 shadow-lg border-0">
                                        <Dropdown.Item onClick={downloadPdf} className="py-2">
                                            <FaDownload className="me-2 text-primary" /> Download PDF
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={printPdf} className="py-2">
                                            <FaPrint className="me-2 text-success" /> Print Document
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item className="text-danger py-2" onClick={() => { setFile(null); setPdf(null); }}>
                                            Close File
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </>
                    )}
                </div>

                <div className="viewer-content">
                    {!file ? (
                        <div className="upload-placeholder">
                            <div className="p-4 rounded-circle bg-light mb-4 shadow-sm">
                                <FaFilePdf size={60} className="text-danger opacity-50" />
                            </div>
                            <h3 className="fw-bold mb-3">Open PDF to View</h3>
                            <p className="text-muted mb-4" style={{ maxWidth: '400px' }}>
                                Securely view your PDF documents directly in the browser. All processing is local, your files stay private.
                            </p>
                            <label className="btn btn-danger btn-lg px-5 py-3 rounded-4 shadow-lg d-flex align-items-center gap-3">
                                <FaFileUpload /> Select PDF File
                                <input type="file" hidden accept=".pdf" onChange={onFileChange} />
                            </label>
                        </div>
                    ) : (
                        <div className="position-relative">
                            {isRendering && (
                                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-25 rounded" style={{ zIndex: 5 }}>
                                    <Spinner animation="border" variant="light" />
                                </div>
                            )}
                            <canvas ref={canvasRef} className="pdf-canvas" />
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-5 row g-4">
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <h5 className="fw-bold mb-3">Privacy Protected</h5>
                        <p className="text-muted small mb-0">Documents are rendered entirely on your local machine. No data is sent to our servers.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <h5 className="fw-bold mb-3">Smooth Navigation</h5>
                        <p className="text-muted small mb-0">Use the intuitive toolbar to zoom, navigate pages, and enter fullscreen mode for focused reading.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <h5 className="fw-bold mb-3">Direct Actions</h5>
                        <p className="text-muted small mb-0">Easily print or download your document directly from the viewer menu.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFViewer;
