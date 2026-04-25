import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { Form, Button, Spinner, Row, Col, Modal, Tabs, Tab } from 'react-bootstrap';
import { 
    FaFilePdf, FaSignature, FaDownload, FaFileUpload, 
    FaCheck, FaTimes, FaFont, FaEraser, 
    FaSave, FaArrowLeft, FaArrowRight, FaSearchPlus, FaSearchMinus, 
    FaTrash, FaPenNib, FaUpload, FaKeyboard
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const FillAndSign = () => {
    const [file, setFile] = useState(null);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(1.2);
    const [elements, setElements] = useState({}); // { pageIndex: [elements] }
    const [activeTool, setActiveTool] = useState('select'); // select, text, signature, check, cross
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showSignModal, setShowSignModal] = useState(false);
    
    // Signature State
    const [savedSignatures, setSavedSignatures] = useState([]);
    
    const editorRef = useRef(null);
    const canvasRef = useRef(null);
    const sigCanvasRef = useRef(null);

    const onFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            toast.error('Please upload a valid PDF file.');
            return;
        }

        setFile(selectedFile);
        setIsLoading(true);
        setElements({});
        setCurrentPage(1);
        
        try {
            const fileUrl = URL.createObjectURL(selectedFile);
            const loadingTask = pdfjsLib.getDocument(fileUrl);
            
            loadingTask.onPassword = (updatePassword) => {
                const password = prompt('This PDF is password protected. Please enter the password:');
                if (password) updatePassword(password);
                else toast.error('Password required.');
            };

            const pdf = await loadingTask.promise;
            setNumPages(pdf.numPages);
            setPdfDoc(pdf);
            toast.success('PDF loaded successfully!');
        } catch (error) {
            console.error('Error loading PDF:', error);
            toast.error(`Failed to read PDF: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const renderPage = async () => {
        if (!pdfDoc || !canvasRef.current) return;
        try {
            const page = await pdfDoc.getPage(currentPage);
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
        if (pdfDoc) renderPage();
    }, [pdfDoc, currentPage, scale]);

    const handleCanvasClick = (e) => {
        if (activeTool === 'select') return;

        const rect = editorRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left);
        const y = (e.clientY - rect.top);

        if (activeTool === 'signature') {
            setShowSignModal(true);
            return;
        }

        const newElement = {
            id: Date.now(),
            type: activeTool,
            x,
            y,
            page: currentPage,
            text: activeTool === 'text' ? 'Type here...' : '',
            value: activeTool === 'signature' ? null : true,
            fontSize: 18,
            color: '#000000'
        };

        setElements(prev => ({
            ...prev,
            [currentPage]: [...(prev[currentPage] || []), newElement]
        }));
        
        if (activeTool !== 'text') setActiveTool('select');
    };

    const updateElement = (id, updates) => {
        setElements(prev => ({
            ...prev,
            [currentPage]: prev[currentPage].map(el => el.id === id ? { ...el, ...updates } : el)
        }));
    };

    const deleteElement = (id) => {
        setElements(prev => ({
            ...prev,
            [currentPage]: prev[currentPage].filter(el => el.id !== id)
        }));
    };

    // Signature Pad Logic
    const [isDrawing, setIsDrawing] = useState(false);
    
    const startDrawing = (e) => {
        const canvas = sigCanvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = sigCanvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        
        ctx.lineTo(x, y);
        ctx.stroke();
        e.preventDefault();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearSigPad = () => {
        const canvas = sigCanvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const saveSignature = () => {
        const canvas = sigCanvasRef.current;
        // Check if blank
        const blank = document.createElement('canvas');
        blank.width = canvas.width;
        blank.height = canvas.height;
        if (canvas.toDataURL() === blank.toDataURL()) {
            toast.error('Signature is empty');
            return;
        }

        const dataUrl = canvas.toDataURL();
        addSignatureToPdf(dataUrl);
        setShowSignModal(false);
    };

    const addSignatureToPdf = (dataUrl) => {
        const rect = editorRef.current.getBoundingClientRect();
        // Place it roughly in the center or where clicked? 
        // For now, let's use a fixed position or state from click
        const newElement = {
            id: Date.now(),
            type: 'signature',
            x: rect.width / 2 - 100,
            y: rect.height / 2 - 50,
            page: currentPage,
            dataUrl,
            width: 200,
            height: 100
        };

        setElements(prev => ({
            ...prev,
            [currentPage]: [...(prev[currentPage] || []), newElement]
        }));
        setActiveTool('select');
    };

    const handleDownload = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const libPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            const helveticaFont = await libPdf.embedFont(StandardFonts.Helvetica);
            const pages = libPdf.getPages();

            for (const pageIdx in elements) {
                const page = pages[parseInt(pageIdx) - 1];
                const { width, height } = page.getSize();
                const pdfJsPage = await pdfDoc.getPage(parseInt(pageIdx));
                const viewport = pdfJsPage.getViewport({ scale });
                
                const ratioX = width / viewport.width;
                const ratioY = height / viewport.height;

                for (const el of elements[pageIdx]) {
                    const pdfX = el.x * ratioX;
                    const pdfY = height - (el.y * ratioY);

                    if (el.type === 'text') {
                        page.drawText(el.text, {
                            x: pdfX,
                            y: pdfY - (el.fontSize * ratioY),
                            size: el.fontSize * ratioY,
                            font: helveticaFont,
                            color: hexToRgb(el.color)
                        });
                    } else if (el.type === 'check') {
                        page.drawText('✓', {
                            x: pdfX,
                            y: pdfY - (24 * ratioY),
                            size: 24 * ratioY,
                            font: helveticaFont,
                            color: rgb(0, 0, 0)
                        });
                    } else if (el.type === 'cross') {
                        page.drawText('✕', {
                            x: pdfX,
                            y: pdfY - (24 * ratioY),
                            size: 24 * ratioY,
                            font: helveticaFont,
                            color: rgb(0, 0, 0)
                        });
                    } else if (el.type === 'signature') {
                        const img = await libPdf.embedPng(el.dataUrl);
                        page.drawImage(img, {
                            x: pdfX,
                            y: pdfY - (el.height * ratioY),
                            width: el.width * ratioX,
                            height: el.height * ratioY,
                        });
                    }
                }
            }

            const pdfBytes = await libPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `signed_${file.name}`;
            link.click();
            toast.success('Signed PDF downloaded!');
        } catch (error) {
            console.error('Save Error:', error);
            toast.error('Failed to save document.');
        } finally {
            setIsProcessing(false);
        }
    };

    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return rgb(r, g, b);
    };

    return (
        <div className="esign-tool py-4">
            <style>{`
                .esign-tool {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .esign-wrapper {
                    background: #ffffff;
                    border-radius: 28px;
                    overflow: hidden;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    display: flex;
                    flex-direction: column;
                    height: 85vh;
                }
                .esign-toolbar {
                    background: #ffffff;
                    border-bottom: 1px solid #e2e8f0;
                    padding: 0.8rem 1.5rem;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    align-items: center;
                    z-index: 100;
                }
                .esign-content {
                    flex: 1;
                    overflow: auto;
                    background: #f1f5f9;
                    padding: 3rem;
                    display: flex;
                    justify-content: center;
                    position: relative;
                }
                .pdf-canvas-container {
                    position: relative;
                    box-shadow: 0 0 40px rgba(0,0,0,0.15);
                    background: white;
                }
                .element-layer {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }
                .element-item {
                    position: absolute;
                    pointer-events: all;
                    cursor: move;
                    user-select: none;
                }
                .text-element {
                    border: 1px dashed transparent;
                    outline: none;
                    min-width: 50px;
                    padding: 2px 5px;
                }
                .text-element:hover, .text-element:focus {
                    border-color: #6366f1;
                    background: rgba(99, 102, 241, 0.05);
                }
                .tool-btn {
                    height: 42px;
                    padding: 0 16px;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    background: #ffffff;
                    color: #475569;
                    font-weight: 600;
                    font-size: 0.9rem;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .tool-btn:hover {
                    background: #f8fafc;
                    border-color: #cbd5e0;
                    transform: translateY(-1px);
                }
                .tool-btn.active {
                    background: #6366f1;
                    color: #ffffff;
                    border-color: #6366f1;
                    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
                }
                .finish-btn {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    border: none;
                    margin-left: auto;
                    padding: 0 24px;
                }
                .finish-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 20px -5px rgba(16, 185, 129, 0.4);
                }
                .upload-area {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: #ffffff;
                    padding: 4rem;
                    text-align: center;
                }
                .sig-pad {
                    border: 2px solid #e2e8f0;
                    border-radius: 16px;
                    background: #f8fafc;
                    cursor: crosshair;
                    touch-action: none;
                }
                .nav-group {
                    display: flex;
                    align-items: center;
                    background: #f1f5f9;
                    border-radius: 12px;
                    padding: 4px;
                }
                .nav-btn {
                    width: 34px;
                    height: 34px;
                    border: none;
                    background: transparent;
                    color: #64748b;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .nav-btn:hover:not(:disabled) {
                    background: #ffffff;
                    color: #1e293b;
                }
                .element-delete-btn {
                    position: absolute;
                    top: -12px;
                    right: -12px;
                    width: 24px;
                    height: 24px;
                    background: #ef4444;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity 0.2s;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                .element-item:hover .element-delete-btn {
                    opacity: 1;
                }
                .cursive-font {
                    font-family: 'Dancing Script', cursive, serif;
                }
                .signature-preview {
                    max-width: 150px;
                    max-height: 60px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 5px;
                    background: #f8fafc;
                }
            `}</style>

            <div className="esign-wrapper">
                {file && (
                    <div className="esign-toolbar">
                        <div className="d-flex gap-2">
                            <button className={`tool-btn ${activeTool === 'select' ? 'active' : ''}`} onClick={() => setActiveTool('select')}>
                                <FaPenNib /> Select
                            </button>
                            <button className={`tool-btn ${activeTool === 'text' ? 'active' : ''}`} onClick={() => setActiveTool('text')}>
                                <FaFont /> Text
                            </button>
                            <button className={`tool-btn ${activeTool === 'signature' ? 'active' : ''}`} onClick={() => setActiveTool('signature')}>
                                <FaSignature /> Sign
                            </button>
                            <button className={`tool-btn ${activeTool === 'check' ? 'active' : ''}`} onClick={() => setActiveTool('check')}>
                                <FaCheck /> Check
                            </button>
                            <button className={`tool-btn ${activeTool === 'cross' ? 'active' : ''}`} onClick={() => setActiveTool('cross')}>
                                <FaTimes /> Cross
                            </button>
                        </div>

                        <div className="nav-group mx-2">
                            <button className="nav-btn" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}>
                                <FaArrowLeft size={12} />
                            </button>
                            <span className="px-3 small fw-bold text-slate-700">{currentPage} / {numPages}</span>
                            <button className="nav-btn" onClick={() => setCurrentPage(p => Math.min(numPages, p+1))} disabled={currentPage === numPages}>
                                <FaArrowRight size={12} />
                            </button>
                        </div>

                        <div className="d-flex gap-2">
                            <button className="tool-btn px-3" onClick={() => setScale(s => Math.max(0.5, s - 0.2))}><FaSearchMinus /></button>
                            <button className="tool-btn px-3" onClick={() => setScale(s => Math.min(3, s + 0.2))}><FaSearchPlus /></button>
                        </div>

                        <button className="tool-btn finish-btn" onClick={handleDownload} disabled={isProcessing}>
                            {isProcessing ? <Spinner animation="border" size="sm" /> : <FaSave />}
                            {isProcessing ? 'Processing...' : 'Finish & Download'}
                        </button>
                    </div>
                )}

                <div className="esign-content">
                    {!file ? (
                        <div className="upload-area fade-in">
                            <div className="p-5 rounded-full bg-indigo-50 mb-4 animate-bounce">
                                <FaFilePdf size={64} className="text-indigo-600" />
                            </div>
                            <h2 className="display-6 fw-bold text-slate-900 mb-3">Fill & Sign Documents</h2>
                            <p className="text-slate-500 mb-4 lead" style={{ maxWidth: '600px' }}>
                                The easiest way to sign PDF documents online. Fill out forms, add checkmarks, and securely eSign in seconds.
                            </p>
                            <label className="btn btn-indigo btn-lg px-5 py-3 rounded-2xl shadow-xl d-flex align-items-center gap-3 transition-all hover:scale-105" style={{ background: '#6366f1', color: 'white' }}>
                                <FaUpload /> Select PDF to Sign
                                <input type="file" hidden accept=".pdf" onChange={onFileChange} />
                            </label>
                            <div className="mt-5 d-flex gap-4 text-slate-400 small">
                                <span>🔒 100% Browser Based</span>
                                <span>✨ Premium Quality</span>
                                <span>🚀 Instant Processing</span>
                            </div>
                        </div>
                    ) : (
                        <div className="pdf-canvas-container" ref={editorRef} onClick={handleCanvasClick} style={{ cursor: activeTool !== 'select' ? 'crosshair' : 'default' }}>
                            <canvas ref={canvasRef} />
                            <div className="element-layer">
                                {(elements[currentPage] || []).map(el => (
                                    <div 
                                        key={el.id} 
                                        className="element-item"
                                        style={{ 
                                            left: el.x, 
                                            top: el.y,
                                            color: el.color,
                                            fontSize: el.fontSize
                                        }}
                                    >
                                        {el.type === 'text' && (
                                            <div 
                                                contentEditable 
                                                className="text-element fw-medium" 
                                                onBlur={(e) => updateElement(el.id, { text: e.target.innerText })}
                                                suppressContentEditableWarning
                                                style={{ fontSize: el.fontSize }}
                                            >
                                                {el.text}
                                            </div>
                                        )}
                                        {el.type === 'check' && <FaCheck size={el.fontSize * 1.5} />}
                                        {el.type === 'cross' && <FaTimes size={el.fontSize * 1.5} />}
                                        {el.type === 'signature' && (
                                            <img src={el.dataUrl} alt="signature" style={{ width: el.width, height: el.height }} />
                                        )}
                                        <div className="element-delete-btn" onClick={(e) => { e.stopPropagation(); deleteElement(el.id); }}>
                                            <FaTrash />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Signature Modal */}
            <Modal show={showSignModal} onHide={() => setShowSignModal(false)} centered size="lg" className="rounded-3xl">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">Create Signature</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Tabs defaultActiveKey="draw" className="mb-4 custom-tabs border-0">
                        <Tab eventKey="draw" title={<><FaPenNib className="me-2" /> Draw</>}>
                            <div className="text-center">
                                <canvas 
                                    ref={sigCanvasRef}
                                    className="sig-pad w-100"
                                    width={700}
                                    height={300}
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDrawing}
                                />
                                <div className="mt-3 d-flex justify-content-between align-items-center">
                                    <p className="text-muted small mb-0">Use your mouse or touch screen to draw your signature.</p>
                                    <Button variant="link" className="text-danger p-0 fw-bold" onClick={clearSigPad}>
                                        <FaEraser className="me-1" /> Clear
                                    </Button>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="type" title={<><FaKeyboard className="me-2" /> Type</>}>
                            <div className="p-5 text-center bg-light rounded-4">
                                <p className="text-muted">Type feature coming soon for premium cursive fonts!</p>
                                <FaSignature size={48} className="text-slate-300" />
                            </div>
                        </Tab>
                        <Tab eventKey="upload" title={<><FaUpload className="me-2" /> Upload</>}>
                            <div className="p-5 text-center bg-light rounded-4 border-2 border-dashed">
                                <FaFileUpload size={48} className="text-indigo-400 mb-3" />
                                <h6 className="fw-bold">Upload signature image</h6>
                                <p className="text-muted small">PNG with transparent background recommended</p>
                                <input type="file" hidden id="sigUpload" accept="image/*" onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (e) => addSignatureToPdf(e.target.result);
                                        reader.readAsDataURL(file);
                                        setShowSignModal(false);
                                    }
                                }} />
                                <Button variant="indigo" style={{ background: '#6366f1', color: 'white' }} onClick={() => document.getElementById('sigUpload').click()}>
                                    Choose Image
                                </Button>
                            </div>
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" className="rounded-xl px-4" onClick={() => setShowSignModal(false)}>Cancel</Button>
                    <Button variant="indigo" className="rounded-xl px-4" style={{ background: '#6366f1', color: 'white' }} onClick={saveSignature}>
                        Apply Signature
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                        <FaPenNib className="text-indigo-600" />
                    </div>
                    <h5 className="fw-bold mb-3">eSign in Seconds</h5>
                    <p className="text-slate-500 small mb-0">Draw your signature or upload an image. Apply it to any document with a single click. Professional and fast.</p>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                        <FaFont className="text-emerald-600" />
                    </div>
                    <h5 className="fw-bold mb-3">Fill Forms Easily</h5>
                    <p className="text-slate-500 small mb-0">Add text anywhere on the page. Use checkmarks and crosses to fill out complex PDF forms without printing.</p>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
                        <FaSave className="text-orange-600" />
                    </div>
                    <h5 className="fw-bold mb-3">100% Private</h5>
                    <p className="text-slate-500 small mb-0">Your documents never leave your computer. All signing and filling happens entirely in your browser for maximum security.</p>
                </div>
            </div>
        </div>
    );
};

export default FillAndSign;
