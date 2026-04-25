import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner, Card } from 'react-bootstrap';
import { 
    FaFilePowerpoint, FaFilePdf, FaDownload, FaFileUpload, 
    FaExchangeAlt, FaCheckCircle, FaLayerGroup, FaDesktop
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';

const PptToPdf = () => {
    const [file, setFile] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const [resultPdfUrl, setResultPdfUrl] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isLibLoaded, setIsLibLoaded] = useState(false);

    useEffect(() => {
        // Load JSZip for parsing PPTX (which is a zip file)
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

        const ext = selectedFile.name.split('.').pop().toLowerCase();
        if (ext !== 'pptx') {
            toast.error('Currently, only .pptx files are supported.');
            return;
        }

        setFile(selectedFile);
        setResultPdfUrl(null);
        setProgress(0);
    };

    const convertPptToPdf = async () => {
        if (!file || !window.JSZip) return;

        setIsConverting(true);
        setProgress(0);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const zip = await window.JSZip.loadAsync(arrayBuffer);
            
            // PPTX structure: slides are in ppt/slides/slide1.xml, slide2.xml, etc.
            const slideFiles = Object.keys(zip.files).filter(name => name.startsWith('ppt/slides/slide') && name.endsWith('.xml'));
            const numSlides = slideFiles.length;

            if (numSlides === 0) {
                throw new Error('No slides found in the presentation.');
            }

            const container = document.createElement('div');
            container.style.width = '1120px'; // 16:9 Aspect ratio width for A4 landscape
            container.style.background = 'white';

            for (let i = 1; i <= numSlides; i++) {
                setProgress(Math.round((i / numSlides) * 100));
                
                const slideXml = await zip.file(`ppt/slides/slide${i}.xml`).async('string');
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(slideXml, 'text/xml');
                
                // Extract all text content from the slide
                const textNodes = xmlDoc.getElementsByTagName('a:t');
                let slideText = '';
                for (let j = 0; j < textNodes.length; j++) {
                    slideText += textNodes[j].textContent + ' ';
                }

                // Create a slide-like div
                const slideDiv = document.createElement('div');
                slideDiv.style.width = '100%';
                slideDiv.style.height = '630px'; // 16:9 height
                slideDiv.style.padding = '60px';
                slideDiv.style.boxSizing = 'border-box';
                slideDiv.style.border = '1px solid #eee';
                slideDiv.style.position = 'relative';
                slideDiv.style.display = 'flex';
                slideDiv.style.flexDirection = 'column';
                slideDiv.style.justifyContent = 'center';
                slideDiv.style.alignItems = 'center';
                slideDiv.style.textAlign = 'center';
                slideDiv.style.pageBreakAfter = 'always';
                slideDiv.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';

                const title = document.createElement('h3');
                title.innerText = `Slide ${i}`;
                title.style.position = 'absolute';
                title.style.top = '20px';
                title.style.left = '20px';
                title.style.fontSize = '14px';
                title.style.color = '#94a3b8';
                slideDiv.appendChild(title);

                const content = document.createElement('p');
                content.innerText = slideText || '[No text content on this slide]';
                content.style.fontSize = '24px';
                content.style.lineHeight = '1.6';
                content.style.color = '#1e293b';
                content.style.maxWidth = '800px';
                slideDiv.appendChild(content);

                container.appendChild(slideDiv);
            }

            const opt = {
                margin: 0,
                filename: `${file.name.split('.')[0]}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, logging: false },
                jsPDF: { unit: 'px', format: [1120, 630], orientation: 'landscape' }
            };

            const pdfBlob = await html2pdf().from(container).set(opt).output('blob');
            const url = URL.createObjectURL(pdfBlob);
            setResultPdfUrl(url);
            toast.success('PowerPoint converted to PDF!');
        } catch (error) {
            console.error('Conversion Error:', error);
            toast.error('Failed to convert PowerPoint. Make sure it is a valid .pptx file.');
        } finally {
            setIsConverting(false);
            setProgress(100);
        }
    };

    const downloadPdf = () => {
        if (!resultPdfUrl) return;
        const link = document.createElement('a');
        link.href = resultPdfUrl;
        link.download = `${file.name.split('.')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="ppt-to-pdf-tool py-4">
            <style>{`
                .ppt-to-pdf-tool {
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
                    border: 2px dashed #e2e8f0;
                    border-radius: 24px;
                    padding: 4.5rem 2rem;
                    background: #fff7ed;
                    transition: all 0.3s;
                    cursor: pointer;
                    margin-bottom: 2.5rem;
                }
                .upload-zone:hover {
                    border-color: #f97316;
                    background: #fffaf5;
                }
                .convert-btn {
                    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                    color: white;
                    border: none;
                    padding: 1.2rem 3rem;
                    border-radius: 18px;
                    font-weight: 700;
                    font-size: 1.1rem;
                    box-shadow: 0 10px 20px -5px rgba(249, 115, 22, 0.4);
                    transition: all 0.3s;
                    width: 100%;
                }
                .convert-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 25px -5px rgba(249, 115, 22, 0.5);
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
                    <div className="p-3 rounded-4 bg-orange-50 text-orange-600">
                        <FaExchangeAlt size={36} />
                    </div>
                    <div className="text-start">
                        <h2 className="h4 fw-bold mb-1">PowerPoint to PDF</h2>
                        <p className="text-muted mb-0 small">Convert your PPTX presentations into portable PDF documents.</p>
                    </div>
                </div>

                {!isLibLoaded && (
                    <div className="alert alert-warning py-2 rounded-3 mb-4">
                        <Spinner animation="border" size="sm" className="me-2" />
                        Initializing parsing engine...
                    </div>
                )}

                {!file ? (
                    <div className="upload-zone" onClick={() => document.getElementById('pptInput').click()}>
                        <input type="file" id="pptInput" hidden accept=".pptx" onChange={onFileChange} />
                        <div className="p-4 rounded-circle bg-white shadow-sm d-inline-block mb-4 text-orange-600">
                            <FaFileUpload size={48} />
                        </div>
                        <h4 className="fw-bold mb-2">Upload PPTX File</h4>
                        <p className="text-slate-500 mb-0">Drag and drop your presentation to start conversion</p>
                    </div>
                ) : (
                    <div className="fade-in">
                        <div className="p-4 border rounded-4 mb-4 d-flex align-items-center justify-content-between bg-light">
                            <div className="d-flex align-items-center gap-3">
                                <FaFilePowerpoint size={32} className="text-orange-600" />
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
                                onClick={convertPptToPdf}
                                disabled={isConverting || !isLibLoaded}
                            >
                                {isConverting ? <Spinner animation="border" size="sm" className="me-2" /> : <FaFilePdf className="me-2" />}
                                {isConverting ? `Converting Slides... ${progress}%` : 'Convert to PDF Now'}
                            </Button>
                        ) : (
                            <div className="fade-in">
                                <div className="p-3 bg-success bg-opacity-10 text-success rounded-3 mb-4 d-flex align-items-center justify-content-center gap-2 fw-bold">
                                    <FaCheckCircle /> Conversion Successful!
                                </div>
                                <div className="d-flex gap-3">
                                    <Button variant="outline-secondary" className="flex-grow-1 py-3 rounded-4" onClick={() => { setFile(null); setResultPdfUrl(null); }}>
                                        Convert Another
                                    </Button>
                                    <Button variant="success" className="convert-btn flex-grow-1" onClick={downloadPdf} style={{ background: '#22c55e', border: 'none' }}>
                                        <FaDownload className="me-2" /> Download Your PDF
                                    </Button>
                                </div>
                            </div>
                        )}

                        {isConverting && (
                            <div className="progress-container fade-in mt-4 text-start">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="small fw-bold text-slate-600">Parsing XML Structure...</span>
                                    <span className="small fw-bold text-orange-600">{progress}%</span>
                                </div>
                                <div className="progress rounded-pill" style={{ height: '10px' }}>
                                    <div 
                                        className="progress-bar progress-bar-striped progress-bar-animated bg-orange-500" 
                                        role="progressbar" 
                                        style={{ width: `${progress}%`, background: '#f97316' }}
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
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-orange-600">
                            <FaLayerGroup /> Slide Preservation
                        </div>
                        <p className="text-muted small mb-0">Our engine parses the internal XML structure of your PPTX to extract text content and reconstruct it slide-by-slide in the PDF.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-orange-600">
                            <FaDesktop /> Presentation Layout
                        </div>
                        <p className="text-muted small mb-0">PDFs are generated in a presentation-friendly landscape format, maintaining the original flow of your slides.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-orange-600">
                            <FaCheckCircle /> Universal Access
                        </div>
                        <p className="text-muted small mb-0">Make your presentations accessible to anyone, on any device, without needing Microsoft PowerPoint installed.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PptToPdf;
