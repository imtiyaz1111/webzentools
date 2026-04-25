import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import { 
    FaFilePdf, FaFilePowerpoint, FaDownload, FaFileUpload, 
    FaExchangeAlt, FaCheckCircle, FaImages, FaSlidersH
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const PdfToPpt = () => {
    const [file, setFile] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const [resultPptBlob, setResultPptBlob] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isLibLoaded, setIsLibLoaded] = useState(false);

    useEffect(() => {
        // Load PptxGenJS from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/gh/gitbrent/PptxGenJS@3.12.0/dist/pptxgen.bundle.js';
        script.async = true;
        script.onload = () => setIsLibLoaded(true);
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            toast.error('Please upload a valid PDF file.');
            return;
        }

        setFile(selectedFile);
        setResultPptBlob(null);
        setProgress(0);
    };

    const convertToPpt = async () => {
        if (!file || !window.PptxGenJS) return;

        setIsConverting(true);
        setProgress(0);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const numPages = pdf.numPages;
            
            const pptx = new window.PptxGenJS();
            pptx.layout = 'LAYOUT_WIDE'; // Standard modern PPT layout

            for (let i = 1; i <= numPages; i++) {
                setProgress(Math.round((i / numPages) * 100));
                
                const page = await pdf.getPage(i);
                // Render page to high-res image (scale 2.0 for better quality in slides)
                const viewport = page.getViewport({ scale: 2.0 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport }).promise;
                const imgData = canvas.toDataURL('image/png');

                // Add slide and set image as background
                const slide = pptx.addSlide();
                slide.addImage({ 
                    data: imgData, 
                    x: 0, y: 0, 
                    w: '100%', h: '100%' 
                });
            }

            const output = await pptx.write('blob');
            setResultPptBlob(output);
            toast.success('PowerPoint presentation ready!');
        } catch (error) {
            console.error('PPT Conversion Error:', error);
            toast.error('Failed to convert PDF to PowerPoint.');
        } finally {
            setIsConverting(false);
            setProgress(100);
        }
    };

    const downloadPpt = () => {
        if (!resultPptBlob) return;
        const url = URL.createObjectURL(resultPptBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${file.name.split('.')[0]}.pptx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="pdf-to-ppt-tool py-4">
            <style>{`
                .pdf-to-ppt-tool {
                    max-width: 900px;
                    margin: 0 auto;
                }
                .main-card {
                    background: #ffffff;
                    border-radius: 32px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    padding: 3.5rem;
                    text-align: center;
                }
                .upload-zone {
                    border: 2px dashed #e2e8f0;
                    border-radius: 24px;
                    padding: 4.5rem 2rem;
                    background: #fdf2f2;
                    transition: all 0.3s;
                    cursor: pointer;
                    margin-bottom: 2.5rem;
                }
                .upload-zone:hover {
                    border-color: #d33;
                    background: #fff5f5;
                }
                .convert-btn {
                    background: linear-gradient(135deg, #d33 0%, #b91c1c 100%);
                    color: white;
                    border: none;
                    padding: 1.2rem 3rem;
                    border-radius: 18px;
                    font-weight: 700;
                    font-size: 1.1rem;
                    box-shadow: 0 10px 20px -5px rgba(220, 38, 38, 0.4);
                    transition: all 0.3s;
                    width: 100%;
                }
                .convert-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 25px -5px rgba(220, 38, 38, 0.5);
                }
                .progress-container {
                    margin-top: 2rem;
                    padding: 1.5rem;
                    background: #f8fafc;
                    border-radius: 20px;
                    border: 1px solid #e2e8f0;
                }
            `}</style>

            <div className="main-card fade-in">
                <div className="d-flex align-items-center justify-content-center gap-3 mb-5">
                    <div className="p-3 rounded-4 bg-red-50 text-red-600">
                        <FaFilePowerpoint size={36} />
                    </div>
                    <div className="text-start">
                        <h2 className="h4 fw-bold mb-1">PDF to PowerPoint</h2>
                        <p className="text-muted mb-0 small">Convert PDF pages into high-quality PowerPoint slides instantly.</p>
                    </div>
                </div>

                {!isLibLoaded && (
                    <div className="alert alert-warning py-2 rounded-3 mb-4">
                        <Spinner animation="border" size="sm" className="me-2" />
                        Loading presentation engine...
                    </div>
                )}

                {!file ? (
                    <div className="upload-zone" onClick={() => document.getElementById('pdfInput').click()}>
                        <input type="file" id="pdfInput" hidden accept=".pdf" onChange={onFileChange} />
                        <div className="p-4 rounded-circle bg-white shadow-sm d-inline-block mb-4 text-red-600">
                            <FaFileUpload size={48} />
                        </div>
                        <h4 className="fw-bold mb-2">Upload PDF File</h4>
                        <p className="text-slate-500 mb-0">Drag and drop your document to create a presentation</p>
                    </div>
                ) : (
                    <div className="fade-in">
                        <div className="p-4 border rounded-4 mb-4 d-flex align-items-center justify-content-between bg-light">
                            <div className="d-flex align-items-center gap-3">
                                <FaFilePdf size={32} className="text-danger" />
                                <div className="text-start">
                                    <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '300px' }}>{file.name}</div>
                                    <div className="text-muted small">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                                </div>
                            </div>
                            <Button variant="link" className="text-danger p-0 fw-bold" onClick={() => { setFile(null); setResultPptBlob(null); }}>Change</Button>
                        </div>

                        {!resultPptBlob ? (
                            <Button 
                                className="convert-btn"
                                onClick={convertToPpt}
                                disabled={isConverting || !isLibLoaded}
                            >
                                {isConverting ? <Spinner animation="border" size="sm" className="me-2" /> : <FaExchangeAlt className="me-2" />}
                                {isConverting ? `Processing Slides... ${progress}%` : 'Convert to PowerPoint (.pptx)'}
                            </Button>
                        ) : (
                            <div className="fade-in">
                                <div className="p-3 bg-success bg-opacity-10 text-success rounded-3 mb-4 d-flex align-items-center justify-content-center gap-2 fw-bold">
                                    <FaCheckCircle /> Slides Generated Successfully!
                                </div>
                                <div className="d-flex gap-3">
                                    <Button variant="outline-secondary" className="flex-grow-1 py-3 rounded-4" onClick={() => { setFile(null); setResultPptBlob(null); }}>
                                        Convert Another
                                    </Button>
                                    <Button variant="success" className="convert-btn flex-grow-1" onClick={downloadPpt} style={{ background: '#22c55e', border: 'none' }}>
                                        <FaDownload className="me-2" /> Download Presentation
                                    </Button>
                                </div>
                            </div>
                        )}

                        {isConverting && (
                            <div className="progress-container fade-in mt-4 text-start">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="small fw-bold text-slate-600">Generating Slide {Math.ceil((progress/100) * 10)}...</span>
                                    <span className="small fw-bold text-red-600">{progress}%</span>
                                </div>
                                <div className="progress rounded-pill" style={{ height: '10px' }}>
                                    <div 
                                        className="progress-bar progress-bar-striped progress-bar-animated bg-danger" 
                                        role="progressbar" 
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <p className="x-small text-muted mt-2 mb-0">High-resolution image rendering and slide positioning in progress.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-5 row g-4">
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-red-600">
                            <FaImages /> High-Res Slides
                        </div>
                        <p className="text-muted small mb-0">Each PDF page is converted into a high-resolution slide, ensuring that charts, text, and images remain crisp and professional.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-red-600">
                            <FaSlidersH /> Layout Wide
                        </div>
                        <p className="text-muted small mb-0">Slides are automatically generated in the modern 16:9 Wide layout, perfect for presentations on today's screens and projectors.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-red-600">
                            <FaCheckCircle /> One-Click Export
                        </div>
                        <p className="text-muted small mb-0">No complicated settings. Just upload your PDF and get a fully compatible .pptx file in seconds, ready for PowerPoint or Keynote.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfToPpt;
