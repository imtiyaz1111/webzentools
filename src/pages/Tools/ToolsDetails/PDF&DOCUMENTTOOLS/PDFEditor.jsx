import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { Form, Button, Spinner, Dropdown, Row, Col, Modal } from 'react-bootstrap';
import { 
    FaFilePdf, FaEdit, FaDownload, FaFileUpload, 
    FaTextHeight, FaImage, FaSignature, FaEraser, 
    FaSave, FaArrowLeft, FaArrowRight, FaSearchPlus, FaSearchMinus, FaTrash 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const PDFEditor = () => {
    const [file, setFile] = useState(null);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(1.2);
    const [annotations, setAnnotations] = useState({}); // { pageIndex: [annotations] }
    const [activeTool, setActiveTool] = useState('select'); // select, text, image, signature, whiteout
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Tools State
    const [fontSize, setFontSize] = useState(16);
    const [textColor, setTextColor] = useState('#000000');
    
    const editorRef = useRef(null);
    const canvasRef = useRef(null);

    const onFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            toast.error('Please upload a valid PDF file.');
            return;
        }

        setFile(selectedFile);
        setIsLoading(true);
        setAnnotations({});
        setCurrentPage(1);
        
        try {
            const fileUrl = URL.createObjectURL(selectedFile);
            const loadingTask = pdfjsLib.getDocument(fileUrl);
            
            // Handle password protected PDFs
            loadingTask.onPassword = (updatePassword, reason) => {
                const password = prompt('This PDF is password protected. Please enter the password:');
                if (password) {
                    updatePassword(password);
                } else {
                    toast.error('Password required to edit this PDF.');
                }
            };

            const pdf = await loadingTask.promise;
            setNumPages(pdf.numPages);
            setPdfDoc(pdf);
            toast.success('PDF loaded for editing!');
        } catch (error) {
            console.error('Error loading PDF:', error);
            toast.error(`Failed to read PDF: ${error.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const renderPage = async () => {
        if (!pdfDoc || !canvasRef.current) return;
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
    };

    useEffect(() => {
        if (pdfDoc) renderPage();
    }, [pdfDoc, currentPage, scale]);

    const handleCanvasClick = (e) => {
        if (activeTool === 'select') return;

        const rect = editorRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left);
        const y = (e.clientY - rect.top);

        const newAnnotation = {
            id: Date.now(),
            type: activeTool,
            x,
            y,
            page: currentPage,
            fontSize,
            color: textColor,
            text: activeTool === 'text' ? 'Click to edit text' : '',
            width: activeTool === 'whiteout' ? 100 : 0,
            height: activeTool === 'whiteout' ? 30 : 0,
        };

        setAnnotations(prev => ({
            ...prev,
            [currentPage]: [...(prev[currentPage] || []), newAnnotation]
        }));
        
        if (activeTool !== 'text') setActiveTool('select');
    };

    const updateAnnotation = (id, updates) => {
        setAnnotations(prev => ({
            ...prev,
            [currentPage]: prev[currentPage].map(ann => ann.id === id ? { ...ann, ...updates } : ann)
        }));
    };

    const deleteAnnotation = (id) => {
        setAnnotations(prev => ({
            ...prev,
            [currentPage]: prev[currentPage].filter(ann => ann.id !== id)
        }));
    };

    const saveChanges = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const libPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            const helveticaFont = await libPdf.embedFont(StandardFonts.Helvetica);
            
            const pages = libPdf.getPages();

            // Apply annotations for all pages
            for (const pageIdx in annotations) {
                const page = pages[parseInt(pageIdx) - 1];
                const { width, height } = page.getSize();
                
                // Get viewport for scale calculation
                const pdfJsPage = await pdfDoc.getPage(parseInt(pageIdx));
                const viewport = pdfJsPage.getViewport({ scale });
                
                const ratioX = width / viewport.width;
                const ratioY = height / viewport.height;

                for (const ann of annotations[pageIdx]) {
                    const pdfX = ann.x * ratioX;
                    const pdfY = height - (ann.y * ratioY); // PDF coordinate system starts from bottom-left

                    if (ann.type === 'text') {
                        page.drawText(ann.text, {
                            x: pdfX,
                            y: pdfY - (ann.fontSize * ratioY),
                            size: ann.fontSize * ratioY,
                            font: helveticaFont,
                            color: hexToRgb(ann.color)
                        });
                    } else if (ann.type === 'whiteout') {
                        page.drawRectangle({
                            x: pdfX,
                            y: pdfY - (ann.height * ratioY),
                            width: ann.width * ratioX,
                            height: ann.height * ratioY,
                            color: rgb(1, 1, 1) // White
                        });
                    }
                }
            }

            const pdfBytes = await libPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.body.appendChild(document.createElement('a'));
            link.href = url;
            link.download = `edited_${file.name}`;
            link.click();
            document.body.removeChild(link);
            toast.success('Changes saved and PDF downloaded!');
        } catch (error) {
            console.error('Save Error:', error);
            toast.error('Failed to save changes.');
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
        <div className="pdf-editor-container py-4">
            <style>{`
                .pdf-editor-container {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .editor-wrapper {
                    background: #ffffff;
                    border-radius: 24px;
                    overflow: hidden;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.05);
                    display: flex;
                    flex-direction: column;
                    height: 85vh;
                }
                .editor-toolbar {
                    background: #f8fafc;
                    border-bottom: 1px solid #e2e8f0;
                    padding: 1rem;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    align-items: center;
                }
                .editor-content {
                    flex: 1;
                    overflow: auto;
                    background: #64748b;
                    padding: 2rem;
                    display: flex;
                    justify-content: center;
                    position: relative;
                }
                .pdf-canvas-container {
                    position: relative;
                    box-shadow: 0 0 30px rgba(0,0,0,0.3);
                }
                .annotation-layer {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }
                .annotation-item {
                    position: absolute;
                    pointer-events: all;
                    cursor: move;
                }
                .text-annotation {
                    border: 1px dashed transparent;
                    outline: none;
                }
                .text-annotation:hover, .text-annotation:focus {
                    border-color: #3182ce;
                    background: rgba(49, 130, 206, 0.1);
                }
                .whiteout-annotation {
                    background: white;
                    border: 1px solid #cbd5e0;
                }
                .tool-btn {
                    padding: 10px 15px;
                    border-radius: 10px;
                    border: 1px solid #e2e8f0;
                    background: white;
                    color: #475569;
                    font-weight: 600;
                    font-size: 0.85rem;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .tool-btn:hover {
                    background: #f1f5f9;
                    border-color: #cbd5e0;
                }
                .tool-btn.active {
                    background: #3182ce;
                    color: white;
                    border-color: #3182ce;
                }
                .save-btn {
                    background: #48bb78;
                    color: white;
                    border: none;
                    margin-left: auto;
                }
                .save-btn:hover {
                    background: #38a169;
                }
                .upload-overlay {
                    width: 100%;
                    height: 100%;
                    background: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 3rem;
                }
                .page-nav {
                    background: #ffffff;
                    padding: 8px 15px;
                    border-radius: 10px;
                    border: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .annotation-delete-btn {
                    position: absolute;
                    top: -15px;
                    right: -15px;
                    width: 20px;
                    height: 20px;
                    background: #e53e3e;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 8px;
                    cursor: pointer;
                    display: none;
                }
                .annotation-item:hover .annotation-delete-btn {
                    display: flex;
                }
            `}</style>

            <div className="editor-wrapper">
                {file && (
                    <div className="editor-toolbar">
                        <div className="d-flex gap-2">
                            <button 
                                className={`tool-btn ${activeTool === 'select' ? 'active' : ''}`}
                                onClick={() => setActiveTool('select')}
                            >
                                <FaEdit /> Select
                            </button>
                            <button 
                                className={`tool-btn ${activeTool === 'text' ? 'active' : ''}`}
                                onClick={() => setActiveTool('text')}
                            >
                                <FaTextHeight /> Text
                            </button>
                            <button 
                                className={`tool-btn ${activeTool === 'whiteout' ? 'active' : ''}`}
                                onClick={() => setActiveTool('whiteout')}
                            >
                                <FaEraser /> Whiteout
                            </button>
                        </div>

                        <div className="border-start ps-3 d-flex gap-2 align-items-center">
                            <Form.Control 
                                type="number" 
                                className="px-2" 
                                style={{ width: '60px' }}
                                value={fontSize}
                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                title="Font Size"
                            />
                            <Form.Control 
                                type="color" 
                                style={{ width: '40px', padding: '0', height: '38px' }}
                                value={textColor}
                                onChange={(e) => setTextColor(e.target.value)}
                                title="Text Color"
                            />
                        </div>

                        <div className="page-nav mx-3">
                            <button className="viewer-btn border-0 bg-transparent" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}>
                                <FaArrowLeft />
                            </button>
                            <span className="fw-bold small">{currentPage} / {numPages}</span>
                            <button className="viewer-btn border-0 bg-transparent" onClick={() => setCurrentPage(p => Math.min(numPages, p+1))} disabled={currentPage === numPages}>
                                <FaArrowRight />
                            </button>
                        </div>

                        <div className="d-flex gap-2">
                            <button className="tool-btn" onClick={() => setScale(s => Math.max(0.5, s - 0.1))}><FaSearchMinus /></button>
                            <button className="tool-btn" onClick={() => setScale(s => Math.min(3, s + 0.1))}><FaSearchPlus /></button>
                        </div>

                        <button className="tool-btn save-btn" onClick={saveChanges} disabled={isProcessing}>
                            {isProcessing ? <Spinner animation="border" size="sm" /> : <FaSave />}
                            {isProcessing ? 'Saving...' : 'Download PDF'}
                        </button>
                    </div>
                )}

                <div className="editor-content">
                    {!file ? (
                        <div className="upload-overlay fade-in">
                            <div className="p-4 rounded-circle bg-light mb-4 shadow-sm">
                                <FaFilePdf size={64} className="text-danger opacity-50" />
                            </div>
                            <h2 className="fw-bold mb-3">Professional PDF Editor</h2>
                            <p className="text-muted mb-4" style={{ maxWidth: '500px' }}>
                                Add text, whiteout sections, and annotate your PDF documents. Premium features, zero cost, total privacy.
                            </p>
                            <label className="btn btn-primary btn-lg px-5 py-3 rounded-4 shadow-lg d-flex align-items-center gap-3">
                                <FaFileUpload /> Choose PDF to Edit
                                <input type="file" hidden accept=".pdf" onChange={onFileChange} />
                            </label>
                        </div>
                    ) : (
                        <div className="pdf-canvas-container" ref={editorRef} onClick={handleCanvasClick} style={{ cursor: activeTool !== 'select' ? 'crosshair' : 'default' }}>
                            <canvas ref={canvasRef} />
                            <div className="annotation-layer">
                                {(annotations[currentPage] || []).map(ann => (
                                    <div 
                                        key={ann.id} 
                                        className={`annotation-item ${ann.type === 'whiteout' ? 'whiteout-annotation' : ''}`}
                                        style={{ 
                                            left: ann.x, 
                                            top: ann.y,
                                            fontSize: ann.fontSize,
                                            color: ann.color,
                                            width: ann.type === 'whiteout' ? ann.width : 'auto',
                                            height: ann.type === 'whiteout' ? ann.height : 'auto'
                                        }}
                                    >
                                        {ann.type === 'text' && (
                                            <div 
                                                contentEditable 
                                                className="text-annotation" 
                                                onBlur={(e) => updateAnnotation(ann.id, { text: e.target.innerText })}
                                                suppressContentEditableWarning
                                            >
                                                {ann.text}
                                            </div>
                                        )}
                                        <div className="annotation-delete-btn" onClick={(e) => { e.stopPropagation(); deleteAnnotation(ann.id); }}>
                                            <FaTrash />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="main-card mt-4 fade-in">
                <h5 className="fw-bold mb-4">How to Edit your PDF</h5>
                <Row className="g-4">
                    <Col md={3}>
                        <div className="p-3 border rounded-4 h-100">
                            <FaTextHeight className="text-primary mb-2" />
                            <h6 className="fw-bold small">Add Text</h6>
                            <p className="text-muted x-small mb-0">Select the Text tool, click anywhere, and start typing. Adjust size and color from the toolbar.</p>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="p-3 border rounded-4 h-100">
                            <FaEraser className="text-danger mb-2" />
                            <h6 className="fw-bold small">Whiteout / Erase</h6>
                            <p className="text-muted x-small mb-0">Use the Whiteout tool to draw boxes over sensitive information or unwanted content.</p>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="p-3 border rounded-4 h-100">
                            <FaSave className="text-success mb-2" />
                            <h6 className="fw-bold small">Save & Export</h6>
                            <p className="text-muted x-small mb-0">When done, click Download PDF. All annotations will be permanently baked into the document.</p>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="p-3 border rounded-4 h-100">
                            <FaFilePdf className="text-warning mb-2" />
                            <h6 className="fw-bold small">Privacy Mode</h6>
                            <p className="text-muted x-small mb-0">Everything happens in your browser. We never see your files or your edits.</p>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default PDFEditor;
