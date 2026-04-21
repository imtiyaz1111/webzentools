import React, { useState, useRef, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "react-hot-toast";
import { 
  FaCloudUploadAlt, FaDownload, FaTrash, FaFilePdf, FaImage, 
  FaCogs, FaCheckCircle, FaFileArchive, FaArrowRight, FaLayerGroup
} from "react-icons/fa";
import "./PdfToJpg.css";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const PdfToJpg = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [pdfDocument, setPdfDocument] = useState(null);
    const [pages, setPages] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    
    // Settings
    const [scale, setScale] = useState(2); // 2x scale for high quality (~192 DPI)
    const [quality, setQuality] = useState(0.9);
    
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            processPdf(file);
        } else {
            toast.error("Please upload a valid PDF file");
        }
    };

    const processPdf = async (file) => {
        setIsProcessing(true);
        setSelectedFile(file);
        setPages([]);
        setProgress(0);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            setPdfDocument(pdf);
            toast.success(`PDF Loaded: ${pdf.numPages} pages detected`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load PDF");
        } finally {
            setIsProcessing(false);
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
                
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport }).promise;
                
                const dataUrl = canvas.toDataURL("image/jpeg", quality);
                extractedPages.push({
                    id: i,
                    dataUrl,
                    blob: dataURLtoBlob(dataUrl)
                });
                
                setProgress(Math.round((i / pdfDocument.numPages) * 100));
            }
            setPages(extractedPages);
            toast.success("Extraction complete!");
        } catch (error) {
            console.error(error);
            toast.error("Error during extraction");
        } finally {
            setIsProcessing(false);
        }
    };

    const dataURLtoBlob = (dataurl) => {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    };

    const downloadZip = async () => {
        if (pages.length === 0) return;
        
        const zip = new JSZip();
        const folder = zip.folder("extracted_images");
        
        pages.forEach((page, index) => {
            folder.file(`page_${index + 1}.jpg`, page.blob);
        });
        
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `extracted_from_${selectedFile.name.split('.')[0]}.zip`);
        toast.success("Zip archive downloaded!");
    };

    const reset = () => {
        setSelectedFile(null);
        setPdfDocument(null);
        setPages([]);
        setProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="pdf-to-jpg-tech">
            <div className="container py-5">
                <div className="row g-4">
                    {/* LEFT: CONFIG */}
                    <div className="col-lg-5">
                        <div className="tech-card p-4 h-100">
                            <div className="card-header-gradient mb-4">
                                <h5 className="m-0 fw-bold d-flex align-items-center">
                                    <FaCogs className="me-2 text-primary" /> EXTRACTION ENGINE
                                </h5>
                                <p className="x-small text-muted mb-0 mt-1">Configure page rendering and magnitudes</p>
                            </div>

                            {!selectedFile ? (
                                <div className="tech-upload-zone mb-4" onClick={() => fileInputRef.current.click()}>
                                    <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept=".pdf" />
                                    <FaCloudUploadAlt className="display-4 text-primary mb-3" />
                                    <h6 className="fw-bold">LOAD PDF CORE</h6>
                                    <p className="x-small text-muted mb-0">Drag payload or click to select</p>
                                </div>
                            ) : (
                                <div className="tech-file-info mb-4">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <FaFilePdf className="text-danger me-2" />
                                            <span className="small fw-medium text-truncate" style={{ maxWidth: '180px' }}>{selectedFile.name}</span>
                                        </div>
                                        <button className="btn-icon text-danger" onClick={reset}><FaTrash /></button>
                                    </div>
                                    <div className="mt-2 pt-2 border-top border-white border-opacity-10 d-flex justify-content-between">
                                        <span className="x-small text-muted">VOLUMETRIC PAGES:</span>
                                        <span className="x-small fw-bold text-primary">{pdfDocument?.numPages || 'SCANNING...'}</span>
                                    </div>
                                </div>
                            )}

                            {/* SECTION: RESOLUTION (SCALE) */}
                            <div className="tech-section mb-4">
                                <div className="tech-label-group">
                                    <FaLayerGroup className="text-primary" />
                                    <span>RESOLUTION SCALE: {scale}x</span>
                                </div>
                                <div className="tech-kb-presets mb-3">
                                    {[1, 1.5, 2, 3].map(s => (
                                        <button 
                                            key={s} 
                                            className={`tech-kb-pill ${scale === s ? 'active' : ''}`}
                                            onClick={() => setScale(s)}
                                            disabled={!selectedFile || isProcessing}
                                        >
                                            {s === 1 ? 'SD' : s === 2 ? 'HD' : s === 3 ? '4K' : s+'x'}
                                        </button>
                                    ))}
                                </div>
                                <p className="x-small text-muted mb-0">Higher scale increases resolution but uses more memory.</p>
                            </div>

                            {/* QUALITY */}
                            <div className="tech-section mb-4">
                                <div className="tech-label-group">
                                    <FaArrowRight className="text-warning" />
                                    <span>ENCODING QUALITY: {Math.round(quality * 100)}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    className="form-range tech-range"
                                    min="0.1" max="1" step="0.1"
                                    value={quality}
                                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                                    disabled={!selectedFile || isProcessing}
                                />
                            </div>

                            <button 
                                className="tech-main-btn w-100"
                                onClick={extractPages}
                                disabled={!selectedFile || isProcessing || pages.length > 0}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        EXTRACTING: {progress}%
                                    </>
                                ) : pages.length > 0 ? (
                                    <>EXTRACTION COMPLETE</>
                                ) : (
                                    <>INITIALIZE PAGE EXTRACTION</>
                                )}
                            </button>

                            {pages.length > 0 && (
                                <button className="tech-zip-btn w-100 mt-3" onClick={downloadZip}>
                                    <FaFileArchive className="me-2" /> COMPILE TO ZIP
                                </button>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: BUFFER PREVIEW */}
                    <div className="col-lg-7">
                        <div className="tech-card h-100 p-4">
                            <h5 className="fw-bold mb-4 pb-3 border-bottom border-white border-opacity-10">PAGE BUFFER REPOSITORY</h5>
                            
                            {!selectedFile ? (
                                <div className="tech-empty-state">
                                    <FaImage className="opacity-10 display-1 mb-3" />
                                    <p className="text-muted">WAITING FOR CORE PAYLOAD...</p>
                                </div>
                            ) : pages.length === 0 ? (
                                <div className="tech-empty-state">
                                    {isProcessing ? (
                                        <div className="text-center">
                                            <div className="spinner-border text-primary mb-3"></div>
                                            <p className="small text-primary fw-bold">PROCESSING BUFFER... {progress}%</p>
                                        </div>
                                    ) : (
                                        <>
                                            <FaFilePdf className="opacity-10 display-1 mb-3 text-danger" />
                                            <p className="text-muted">READY TO EXTRACT {pdfDocument?.numPages} PAGES</p>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="tech-pages-gallery">
                                    <div className="row g-3">
                                        {pages.map(page => (
                                            <div key={page.id} className="col-md-4 col-6">
                                                <div className="tech-page-card">
                                                    <div className="page-img-wrapper">
                                                        <img src={page.dataUrl} alt={`Page ${page.id}`} className="img-fluid" />
                                                    </div>
                                                    <div className="page-info">
                                                        <span>PAGE_{page.id < 10 ? '0'+page.id : page.id}</span>
                                                        <a href={page.dataUrl} download={`page_${page.id}.jpg`}><FaDownload /></a>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfToJpg;
