import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import { 
    FaFilePdf, FaImage, FaDownload, FaFileUpload, 
    FaCheckCircle, FaFileArchive, FaCogs, FaSearchPlus 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const PdfToJpg = () => {
    const [file, setFile] = useState(null);
    const [pdfDocument, setPdfDocument] = useState(null);
    const [pages, setPages] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [scale, setScale] = useState(2);
    const [quality, setQuality] = useState(0.9);

    const onFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            toast.error('Only PDF files are allowed.');
            return;
        }

        setFile(selectedFile);
        setPages([]);
        setProgress(0);
        
        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            setPdfDocument(pdf);
            toast.success(`PDF Loaded: ${pdf.numPages} pages detected`);
        } catch (error) {
            console.error('Error loading PDF:', error);
            toast.error('Failed to read PDF file.');
        }
    };

    const extractPages = async () => {
        if (!pdfDocument) return;

        setIsProcessing(true);
        const extractedPages = [];
        
        try {
            for (let i = 1; i <= pdfDocument.numPages; i++) {
                const page = await pdfDocument.getPage(i);
                const viewport = page.getViewport({ scale });
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport }).promise;
                
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                extractedPages.push({
                    id: i,
                    dataUrl,
                    blob: await (await fetch(dataUrl)).blob()
                });
                
                setProgress(Math.round((i / pdfDocument.numPages) * 100));
            }
            setPages(extractedPages);
            toast.success('All pages extracted successfully!');
        } catch (error) {
            console.error('Extraction Error:', error);
            toast.error('An error occurred during extraction.');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadZip = async () => {
        if (pages.length === 0) return;
        
        const zip = new JSZip();
        pages.forEach((page) => {
            zip.file(`page_${page.id}.jpg`, page.blob);
        });
        
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `${file.name.replace('.pdf', '')}_images.zip`);
        toast.success('ZIP archive downloaded!');
    };

    return (
        <div className="pdf-to-jpg-container py-4">
            <style>{`
                .pdf-to-jpg-container {
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
                    border-color: #f6ad55;
                    background: #fffaf0;
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
                .settings-bar {
                    background: #f7fafc;
                    border-radius: 16px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                    border: 1px solid #edf2f7;
                }
                .gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 20px;
                    margin-top: 2rem;
                }
                .page-card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    overflow: hidden;
                    transition: transform 0.2s;
                }
                .page-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .page-img {
                    width: 100%;
                    height: 200px;
                    object-fit: contain;
                    background: #f1f5f9;
                    border-bottom: 1px solid #e2e8f0;
                }
                .page-footer {
                    padding: 8px 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #4a5568;
                }
                .btn-extract {
                    background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
                    border: none;
                    padding: 1rem 2.5rem;
                    font-weight: 700;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(237, 137, 54, 0.3);
                    transition: all 0.3s;
                }
                .btn-extract:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(237, 137, 54, 0.4);
                }
                .btn-zip {
                    background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
                    border: none;
                    padding: 1rem 2.5rem;
                    font-weight: 700;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(74, 85, 104, 0.3);
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
                    <div className="p-3 rounded-4" style={{ background: '#fffaf0' }}>
                        <FaImage size={28} style={{ color: '#ed8936' }} />
                    </div>
                    <div>
                        <h2 className="h4 fw-bold mb-1" style={{ color: '#1a202c' }}>PDF to JPG Converter</h2>
                        <p className="text-muted mb-0 small">Extract pages from your PDF as high-quality images instantly.</p>
                    </div>
                </div>

                {!file ? (
                    <div className="upload-zone">
                        <input type="file" accept=".pdf" onChange={onFileChange} />
                        <FaFileUpload size={48} className="mb-3" style={{ color: '#ed8936' }} />
                        <h5 className="fw-bold mb-2">Upload PDF to Extract Images</h5>
                        <p className="text-muted small mb-0">Select the PDF file you want to convert</p>
                    </div>
                ) : (
                    <div className="file-info fade-in p-3 border rounded-4 mb-4 d-flex align-items-center justify-content-between bg-light">
                        <div className="d-flex align-items-center gap-3">
                            <FaFilePdf size={32} color="#e53e3e" />
                            <div>
                                <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '300px' }}>{file.name}</div>
                                <div className="text-muted small">{(file.size / 1024 / 1024).toFixed(2)} MB • {pdfDocument?.numPages} Pages</div>
                            </div>
                        </div>
                        <Button variant="link" className="text-danger p-0 fw-bold" onClick={() => { setFile(null); setPages([]); setPdfDocument(null); }}>
                            Change
                        </Button>
                    </div>
                )}

                {file && (
                    <div className="settings-bar fade-in">
                        <Row className="align-items-center">
                            <Col md={6} className="mb-3 mb-md-0">
                                <label className="fw-bold small text-muted mb-2 d-flex align-items-center gap-2">
                                    <FaSearchPlus /> Image Resolution (Quality)
                                </label>
                                <div className="d-flex gap-2">
                                    {[1, 2, 3].map(s => (
                                        <button 
                                            key={s}
                                            className={`btn btn-sm flex-grow-1 ${scale === s ? 'btn-warning text-white' : 'btn-outline-secondary'}`}
                                            onClick={() => setScale(s)}
                                            style={{ borderRadius: '8px', fontWeight: '700' }}
                                        >
                                            {s === 1 ? 'Standard' : s === 2 ? 'HD' : '4K'}
                                        </button>
                                    ))}
                                </div>
                            </Col>
                            <Col md={6}>
                                <label className="fw-bold small text-muted mb-2 d-flex align-items-center gap-2">
                                    <FaCogs /> Image Quality: {Math.round(quality * 100)}%
                                </label>
                                <Form.Range 
                                    min="0.1" max="1" step="0.1" 
                                    value={quality} 
                                    onChange={(e) => setQuality(parseFloat(e.target.value))} 
                                />
                            </Col>
                        </Row>
                    </div>
                )}

                {!pages.length > 0 ? (
                    <Button 
                        className="btn-extract w-100 text-white d-flex align-items-center justify-content-center gap-2"
                        onClick={extractPages}
                        disabled={!file || isProcessing}
                    >
                        {isProcessing ? <Spinner animation="border" size="sm" /> : <FaImage />}
                        {isProcessing ? `Extracting... ${progress}%` : 'Extract All Pages as JPG'}
                    </Button>
                ) : (
                    <div className="d-flex gap-3 fade-in">
                        <Button 
                            variant="outline-warning" 
                            className="flex-grow-1"
                            style={{ borderRadius: '12px', padding: '1rem' }}
                            onClick={() => { setPages([]); }}
                        >
                            Reset Extraction
                        </Button>
                        <Button 
                            className="btn-zip flex-grow-1 text-white d-flex align-items-center justify-content-center gap-2"
                            onClick={downloadZip}
                        >
                            <FaFileArchive /> Download All as ZIP
                        </Button>
                    </div>
                )}

                {pages.length > 0 && (
                    <div className="gallery-grid fade-in">
                        {pages.map(page => (
                            <div key={page.id} className="page-card">
                                <img src={page.dataUrl} alt={`Page ${page.id}`} className="page-img" />
                                <div className="page-footer">
                                    <span>PAGE {page.id}</span>
                                    <a href={page.dataUrl} download={`page_${page.id}.jpg`} className="text-warning">
                                        <FaDownload />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isProcessing && (
                    <div className="mt-4 text-center">
                        <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                            <div 
                                className="progress-bar progress-bar-striped progress-bar-animated bg-warning" 
                                role="progressbar" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="text-muted small mt-2">Rendering page images...</div>
                    </div>
                )}
            </div>

            <div className="how-it-works main-card fade-in">
                <h4 className="fw-bold mb-4">Why use our Converter?</h4>
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="p-3 border rounded-4 h-100">
                            <h6 className="fw-bold text-warning">Ultra HD Quality</h6>
                            <p className="text-muted small mb-0">Choose from Standard, HD, or 4K resolution to get the clearest images possible from your PDF.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 border rounded-4 h-100">
                            <h6 className="fw-bold text-warning">ZIP Compression</h6>
                            <p className="text-muted small mb-0">Download all extracted pages at once in a neatly organized ZIP file to save time.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 border rounded-4 h-100">
                            <h6 className="fw-bold text-warning">100% Private</h6>
                            <p className="text-muted small mb-0">Your document is never uploaded. All rendering is done locally on your machine for maximum security.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfToJpg;
