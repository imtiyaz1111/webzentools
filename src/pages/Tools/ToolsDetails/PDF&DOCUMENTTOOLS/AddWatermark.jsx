import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { Form, Button, Spinner, Row, Col, Card } from 'react-bootstrap';
import { 
    FaFilePdf, FaFont, FaImage, FaDownload, FaFileUpload, 
    FaSync, FaSearchPlus, FaSearchMinus, FaArrowLeft, FaArrowRight,
    FaEye, FaCog, FaCheckCircle
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const AddWatermark = () => {
    const [file, setFile] = useState(null);
    const [pdfPreview, setPdfPreview] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(0.8);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resultPdfUrl, setResultPdfUrl] = useState(null);

    // Watermark Settings
    const [watermarkType, setWatermarkType] = useState('text'); // 'text' or 'image'
    const [watermarkText, setWatermarkText] = useState('DRAFT');
    const [watermarkImage, setWatermarkImage] = useState(null);
    const [watermarkImagePreview, setWatermarkImagePreview] = useState(null);
    const [opacity, setOpacity] = useState(0.3);
    const [rotation, setRotation] = useState(-45);
    const [fontSize, setFontSize] = useState(60);
    const [color, setColor] = useState('#ff0000');
    const [position, setPosition] = useState('center'); // center, top-left, top-right, bottom-left, bottom-right, tiled

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
        setResultPdfUrl(null);
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

    const onImageChange = (e) => {
        const selectedImg = e.target.files[0];
        if (!selectedImg) return;
        setWatermarkImage(selectedImg);
        setWatermarkImagePreview(URL.createObjectURL(selectedImg));
    };

    const renderPreview = async () => {
        if (!pdfPreview || !canvasRef.current) return;
        
        try {
            const page = await pdfPreview.getPage(currentPage);
            const viewport = page.getViewport({ scale });
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport }).promise;

            // Draw Watermark Preview on top of Canvas
            context.save();
            context.globalAlpha = opacity;
            context.translate(canvas.width / 2, canvas.height / 2);
            context.rotate((rotation * Math.PI) / 180);

            if (watermarkType === 'text') {
                context.font = `bold ${fontSize * scale}px Arial`;
                context.fillStyle = color;
                context.textAlign = 'center';
                context.fillText(watermarkText, 0, 0);
            } else if (watermarkImagePreview) {
                const img = new Image();
                img.src = watermarkImagePreview;
                await new Promise((resolve) => {
                    img.onload = () => {
                        const imgScale = (fontSize / 100) * scale;
                        const w = img.width * imgScale;
                        const h = img.height * imgScale;
                        context.drawImage(img, -w / 2, -h / 2, w, h);
                        resolve();
                    };
                });
            }
            context.restore();
        } catch (error) {
            console.error('Render Error:', error);
        }
    };

    useEffect(() => {
        if (pdfPreview) renderPreview();
    }, [pdfPreview, currentPage, watermarkText, watermarkType, watermarkImagePreview, opacity, rotation, fontSize, color, position]);

    const applyWatermark = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const pages = pdfDoc.getPages();

            let embeddedImage = null;
            if (watermarkType === 'image' && watermarkImage) {
                const imgBuffer = await watermarkImage.arrayBuffer();
                if (watermarkImage.type === 'image/png') {
                    embeddedImage = await pdfDoc.embedPng(imgBuffer);
                } else {
                    embeddedImage = await pdfDoc.embedJpg(imgBuffer);
                }
            }

            for (const page of pages) {
                const { width, height } = page.getSize();
                
                page.pushOperators(); // Save state

                if (watermarkType === 'text') {
                    page.drawText(watermarkText, {
                        x: width / 2,
                        y: height / 2,
                        size: fontSize,
                        font: helveticaFont,
                        color: hexToRgb(color),
                        opacity: opacity,
                        rotate: degrees(rotation),
                        pivot: [0, 0], // Center pivot
                    });
                } else if (embeddedImage) {
                    const imgScale = fontSize / 100;
                    const imgWidth = embeddedImage.width * imgScale;
                    const imgHeight = embeddedImage.height * imgScale;
                    
                    page.drawImage(embeddedImage, {
                        x: width / 2 - imgWidth / 2,
                        y: height / 2 - imgHeight / 2,
                        width: imgWidth,
                        height: imgHeight,
                        opacity: opacity,
                        rotate: degrees(rotation),
                    });
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setResultPdfUrl(url);
            toast.success('Watermark applied successfully!');
        } catch (error) {
            console.error('Watermark Error:', error);
            toast.error('Failed to add watermark.');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadPdf = () => {
        if (!resultPdfUrl) return;
        const link = document.createElement('a');
        link.href = resultPdfUrl;
        link.download = `watermarked_${file.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return rgb(r, g, b);
    };

    return (
        <div className="watermark-tool py-4">
            <style>{`
                .watermark-tool {
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
                .settings-sidebar {
                    background: #f8fafc;
                    border-right: 1px solid #e2e8f0;
                    padding: 2rem;
                    height: 100%;
                }
                .preview-area {
                    background: #64748b;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 2rem;
                    overflow: auto;
                    flex-grow: 1;
                }
                .preview-canvas {
                    box-shadow: 0 0 40px rgba(0,0,0,0.3);
                    background: white;
                    max-width: 100%;
                }
                .control-card {
                    background: white;
                    border-radius: 20px;
                    border: 1px solid #e2e8f0;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                }
                .premium-slider {
                    height: 6px;
                    background: #e2e8f0;
                    border-radius: 3px;
                }
                .type-selector {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 1.5rem;
                }
                .type-btn {
                    flex: 1;
                    padding: 12px;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    background: white;
                    color: #64748b;
                    font-weight: 600;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                .type-btn.active {
                    background: #3b82f6;
                    color: white;
                    border-color: #3b82f6;
                    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
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
                .nav-group {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: rgba(255,255,255,0.1);
                    padding: 8px 20px;
                    border-radius: 100px;
                    margin-bottom: 1.5rem;
                    backdrop-filter: blur(10px);
                }
                .action-bar {
                    background: white;
                    border-top: 1px solid #e2e8f0;
                    padding: 1.2rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .apply-btn {
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    color: white;
                    border: none;
                    padding: 12px 32px;
                    border-radius: 14px;
                    font-weight: 700;
                    box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
                    transition: all 0.3s;
                }
                .apply-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 25px -5px rgba(59, 130, 246, 0.5);
                }
            `}</style>

            <div className="main-container fade-in">
                {!file ? (
                    <div className="upload-placeholder">
                        <div className="p-5 rounded-full bg-blue-50 mb-4 animate-pulse">
                            <FaFilePdf size={64} className="text-blue-600" />
                        </div>
                        <h2 className="display-6 fw-bold text-slate-900 mb-3">Add Watermark to PDF</h2>
                        <p className="text-slate-500 mb-4 lead" style={{ maxWidth: '600px' }}>
                            Protect your intellectual property by adding professional text or image watermarks to your PDF documents. Secure, fast, and entirely in your browser.
                        </p>
                        <label className="btn btn-primary btn-lg px-5 py-3 rounded-2xl shadow-xl d-flex align-items-center gap-3 transition-all hover:scale-105" style={{ background: '#3b82f6', color: 'white', border: 'none' }}>
                            <FaFileUpload /> Select PDF Document
                            <input type="file" hidden accept=".pdf" onChange={onFileChange} />
                        </label>
                    </div>
                ) : (
                    <Row className="g-0 flex-grow-1">
                        <Col lg={4} className="settings-sidebar">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <FaCog className="text-blue-600" size={24} />
                                <h4 className="fw-bold mb-0">Settings</h4>
                            </div>

                            <div className="type-selector">
                                <button className={`type-btn ${watermarkType === 'text' ? 'active' : ''}`} onClick={() => setWatermarkType('text')}>
                                    <FaFont /> Text
                                </button>
                                <button className={`type-btn ${watermarkType === 'image' ? 'active' : ''}`} onClick={() => setWatermarkType('image')}>
                                    <FaImage /> Image
                                </button>
                            </div>

                            <div className="control-card">
                                {watermarkType === 'text' ? (
                                    <>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-bold">Watermark Text</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                value={watermarkText} 
                                                onChange={(e) => setWatermarkText(e.target.value)}
                                                className="rounded-3"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-bold">Text Color</Form.Label>
                                            <Form.Control 
                                                type="color" 
                                                value={color} 
                                                onChange={(e) => setColor(e.target.value)}
                                                className="w-100 p-1 rounded-3 h-40"
                                            />
                                        </Form.Group>
                                    </>
                                ) : (
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-bold">Watermark Image</Form.Label>
                                        <Form.Control 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={onImageChange}
                                            className="rounded-3"
                                        />
                                        {watermarkImagePreview && (
                                            <div className="mt-3 p-2 border rounded-3 bg-light text-center">
                                                <img src={watermarkImagePreview} alt="watermark" style={{ maxHeight: '60px' }} />
                                            </div>
                                        )}
                                    </Form.Group>
                                )}

                                <Form.Group className="mb-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <Form.Label className="small fw-bold mb-0">Opacity</Form.Label>
                                        <span className="small text-blue-600 fw-bold">{Math.round(opacity * 100)}%</span>
                                    </div>
                                    <Form.Range 
                                        min="0" 
                                        max="1" 
                                        step="0.05" 
                                        value={opacity} 
                                        onChange={(e) => setOpacity(parseFloat(e.target.value))}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <Form.Label className="small fw-bold mb-0">Rotation</Form.Label>
                                        <span className="small text-blue-600 fw-bold">{rotation}°</span>
                                    </div>
                                    <Form.Range 
                                        min="-180" 
                                        max="180" 
                                        step="1" 
                                        value={rotation} 
                                        onChange={(e) => setRotation(parseInt(e.target.value))}
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <div className="d-flex justify-content-between mb-2">
                                        <Form.Label className="small fw-bold mb-0">Scale / Font Size</Form.Label>
                                        <span className="small text-blue-600 fw-bold">{fontSize}</span>
                                    </div>
                                    <Form.Range 
                                        min="10" 
                                        max="300" 
                                        step="1" 
                                        value={fontSize} 
                                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    />
                                </Form.Group>
                            </div>

                            <div className="control-card bg-light border-0">
                                <h6 className="fw-bold mb-3 small">Placement</h6>
                                <Form.Select 
                                    className="rounded-3" 
                                    value={position} 
                                    onChange={(e) => setPosition(e.target.value)}
                                    disabled
                                >
                                    <option value="center">Center</option>
                                    <option value="tiled">Tiled (Coming Soon)</option>
                                </Form.Select>
                            </div>
                        </Col>

                        <Col lg={8} className="preview-area">
                            <div className="nav-group">
                                <Button variant="link" className="text-white p-0" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}>
                                    <FaArrowLeft />
                                </Button>
                                <span className="text-white small fw-bold">Page {currentPage} of {numPages}</span>
                                <Button variant="link" className="text-white p-0" onClick={() => setCurrentPage(p => Math.min(numPages, p+1))} disabled={currentPage === numPages}>
                                    <FaArrowRight />
                                </Button>
                                <div className="border-start border-secondary mx-2 h-20"></div>
                                <Button variant="link" className="text-white p-0" onClick={() => setScale(s => Math.max(0.4, s - 0.1))}><FaSearchMinus /></Button>
                                <Button variant="link" className="text-white p-0" onClick={() => setScale(s => Math.min(2, s + 0.1))}><FaSearchPlus /></Button>
                            </div>

                            <div className="position-relative">
                                {isLoading && (
                                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-25 rounded" style={{ zIndex: 10 }}>
                                        <Spinner animation="border" variant="light" />
                                    </div>
                                )}
                                <canvas ref={canvasRef} className="preview-canvas" />
                            </div>
                        </Col>
                    </Row>
                )}

                {file && (
                    <div className="action-bar">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-2 rounded-3 bg-blue-50 text-blue-600">
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
                                    <Button className="apply-btn" onClick={downloadPdf}>
                                        <FaDownload className="me-2" /> Download Watermarked PDF
                                    </Button>
                                </>
                            ) : (
                                <Button className="apply-btn" onClick={applyWatermark} disabled={isProcessing}>
                                    {isProcessing ? <Spinner animation="border" size="sm" className="me-2" /> : <FaCheckCircle className="me-2" />}
                                    {isProcessing ? 'Applying Watermark...' : 'Apply to All Pages'}
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-5 row g-4">
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2">
                            <FaFont className="text-blue-500" /> Text Watermarks
                        </div>
                        <p className="text-muted small mb-0">Customize text content, font size, rotation, and color. Perfect for adding "Draft", "Confidential", or company names.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2">
                            <FaImage className="text-blue-500" /> Image Logos
                        </div>
                        <p className="text-muted small mb-0">Upload your brand logo or official seal. Adjust opacity and scale to ensure it doesn't obscure document content.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2">
                            <FaEye className="text-blue-500" /> Live Preview
                        </div>
                        <p className="text-muted small mb-0">See exactly how your watermark will look on every page with our real-time interactive preview engine.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddWatermark;
