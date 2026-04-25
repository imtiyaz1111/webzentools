import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import { 
    FaBook, FaFilePdf, FaDownload, FaFileUpload, 
    FaExchangeAlt, FaCheckCircle, FaBookOpen
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';

const EpubToPdf = () => {
    const [file, setFile] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const [resultPdfUrl, setResultPdfUrl] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isLibLoaded, setIsLibLoaded] = useState(false);

    useEffect(() => {
        // Load JSZip from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
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
        if (!selectedFile.name.endsWith('.epub')) {
            toast.error('Please upload an EPUB file.');
            return;
        }
        setFile(selectedFile);
        setResultPdfUrl(null);
        setProgress(0);
    };

    const convertEpubToPdf = async () => {
        if (!file || !window.JSZip) return;

        setIsConverting(true);
        setProgress(0);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const zip = await window.JSZip.loadAsync(arrayBuffer);
            
            // 1. Find content.opf path from container.xml
            const containerXml = await zip.file('META-INF/container.xml').async('string');
            const parser = new DOMParser();
            const containerDoc = parser.parseFromString(containerXml, 'text/xml');
            const opfPath = containerDoc.getElementsByTagName('rootfile')[0].getAttribute('full-path');
            const opfBaseDir = opfPath.substring(0, opfPath.lastIndexOf('/') + 1);

            // 2. Parse content.opf for manifest and spine
            const opfXml = await zip.file(opfPath).async('string');
            const opfDoc = parser.parseFromString(opfXml, 'text/xml');
            
            const manifest = {};
            const manifestItems = opfDoc.getElementsByTagName('item');
            for (let i = 0; i < manifestItems.length; i++) {
                manifest[manifestItems[i].getAttribute('id')] = manifestItems[i].getAttribute('href');
            }

            const spine = [];
            const spineItems = opfDoc.getElementsByTagName('itemref');
            for (let i = 0; i < spineItems.length; i++) {
                spine.push(spineItems[i].getAttribute('idref'));
            }

            // 3. Render each spine item into a container
            const container = document.createElement('div');
            container.style.padding = '40px';
            container.style.background = 'white';
            container.style.color = '#1e293b';
            container.style.lineHeight = '1.6';

            for (let i = 0; i < spine.length; i++) {
                setProgress(Math.round(((i + 1) / spine.length) * 100));
                const itemId = spine[i];
                const itemHref = manifest[itemId];
                const content = await zip.file(opfBaseDir + itemHref).async('string');
                
                const chapterDiv = document.createElement('div');
                chapterDiv.style.pageBreakAfter = 'always';
                
                // Strip <html> and <body> tags but keep internal content
                const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
                const internalHtml = bodyMatch ? bodyMatch[1] : content;
                
                chapterDiv.innerHTML = internalHtml;
                
                // Basic cleanup of images (won't work easily without re-bundling or data URLs)
                // For now, we focus on text conversion
                container.appendChild(chapterDiv);
            }

            const opt = {
                margin: 10,
                filename: `${file.name.replace('.epub', '')}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, logging: false },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            const pdfBlob = await html2pdf().from(container).set(opt).output('blob');
            const url = URL.createObjectURL(pdfBlob);
            setResultPdfUrl(url);
            toast.success('EPUB converted to PDF!');
        } catch (error) {
            console.error('Conversion Error:', error);
            toast.error('Failed to convert EPUB. Make sure it is a valid, unencrypted eBook.');
        } finally {
            setIsConverting(false);
        }
    };

    const downloadPdf = () => {
        if (!resultPdfUrl) return;
        const link = document.createElement('a');
        link.href = resultPdfUrl;
        link.download = `${file.name.replace('.epub', '')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="epub-to-pdf-tool py-4">
            <style>{`
                .epub-to-pdf-tool {
                    max-width: 900px;
                    margin: 0 auto;
                }
                .main-card {
                    background: #ffffff;
                    border-radius: 32px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    padding: 3rem;
                    text-align: center;
                }
                .upload-zone {
                    border: 2px dashed #cbd5e0;
                    border-radius: 24px;
                    padding: 4.5rem 2rem;
                    background: #fdf2f2;
                    transition: all 0.3s;
                    cursor: pointer;
                    margin-bottom: 2.5rem;
                }
                .upload-zone:hover {
                    border-color: #ef4444;
                    background: #fff5f5;
                }
                .convert-btn {
                    background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
                    color: white;
                    border: none;
                    padding: 1.2rem 3rem;
                    border-radius: 18px;
                    font-weight: 700;
                    font-size: 1.1rem;
                    box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.4);
                    transition: all 0.3s;
                    width: 100%;
                }
                .convert-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 25px -5px rgba(239, 68, 68, 0.5);
                }
                .progress-container {
                    margin-top: 2rem;
                    padding: 1.5rem;
                    background: #f8fafc;
                    border-radius: 20px;
                }
            `}</style>

            <div className="main-card fade-in">
                <div className="d-flex align-items-center justify-content-center gap-3 mb-5">
                    <div className="p-3 rounded-4 bg-red-50 text-red-600">
                        <FaBookOpen size={32} />
                    </div>
                    <div className="text-start">
                        <h2 className="h4 fw-bold mb-1">EPUB to PDF Converter</h2>
                        <p className="text-muted mb-0 small">Transform your E-books into printable PDF documents instantly.</p>
                    </div>
                </div>

                {!isLibLoaded && (
                    <div className="alert alert-warning py-2 rounded-3 mb-4">
                        <Spinner animation="border" size="sm" className="me-2" />
                        Initializing parsing engine...
                    </div>
                )}

                {!file ? (
                    <div className="upload-zone" onClick={() => document.getElementById('epubInput').click()}>
                        <input type="file" id="epubInput" hidden accept=".epub" onChange={onFileChange} />
                        <div className="p-4 rounded-circle bg-white shadow-sm d-inline-block mb-4 text-red-600">
                            <FaFileUpload size={48} />
                        </div>
                        <h4 className="fw-bold mb-2">Select EPUB eBook</h4>
                        <p className="text-slate-500 mb-0">Drag and drop your eBook to start conversion</p>
                    </div>
                ) : (
                    <div className="fade-in">
                        <div className="p-4 border rounded-4 mb-4 d-flex align-items-center justify-content-between bg-light">
                            <div className="d-flex align-items-center gap-3">
                                <FaBook size={32} className="text-amber-600" />
                                <div className="text-start">
                                    <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '300px' }}>{file.name}</div>
                                    <div className="text-muted small">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                                </div>
                            </div>
                            <Button variant="link" className="text-danger p-0 fw-bold" onClick={() => { setFile(null); setResultPdfUrl(null); }}>Change</Button>
                        </div>

                        {!resultPdfUrl ? (
                            <Button 
                                className="convert-btn"
                                onClick={convertEpubToPdf}
                                disabled={isConverting || !isLibLoaded}
                            >
                                {isConverting ? <Spinner animation="border" size="sm" className="me-2" /> : <FaFilePdf className="me-2" />}
                                {isConverting ? `Rendering eBook Content... ${progress}%` : 'Convert to PDF Now'}
                            </Button>
                        ) : (
                            <div className="fade-in">
                                <div className="p-3 bg-success bg-opacity-10 text-success rounded-3 mb-4 d-flex align-items-center justify-content-center gap-2 fw-bold">
                                    <FaCheckCircle /> PDF Conversion Successful!
                                </div>
                                <div className="d-flex gap-3">
                                    <Button variant="outline-secondary" className="flex-grow-1 py-3 rounded-4" onClick={() => { setFile(null); setResultPdfUrl(null); }}>
                                        Convert Another
                                    </Button>
                                    <Button className="convert-btn flex-grow-1" onClick={downloadPdf}>
                                        <FaDownload className="me-2" /> Download Your PDF
                                    </Button>
                                </div>
                            </div>
                        )}

                        {isConverting && (
                            <div className="progress-container fade-in mt-4 text-start">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="small fw-bold text-slate-600">Parsing eBook Chapters...</span>
                                    <span className="small fw-bold text-red-600">{progress}%</span>
                                </div>
                                <div className="progress rounded-pill" style={{ height: '10px' }}>
                                    <div 
                                        className="progress-bar progress-bar-striped progress-bar-animated bg-danger" 
                                        role="progressbar" 
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-5 row g-4">
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-red-600">
                            <FaBookOpen /> Chapter Awareness
                        </div>
                        <p className="text-muted small mb-0">Our engine parses the internal EPUB spine to ensure that chapters are converted in the correct order and maintain their natural breaks.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-red-600">
                            <FaFilePdf /> Optimized for Print
                        </div>
                        <p className="text-muted small mb-0">Converts eBooks into standard A4 PDF format, making your digital books ready for printing or professional reading on any device.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-red-600">
                            <FaCheckCircle /> Privacy First
                        </div>
                        <p className="text-muted small mb-0">No uploading to external servers. Your eBooks are parsed and converted locally in your browser, keeping your library private.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EpubToPdf;
