import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import { 
    FaFilePdf, FaCode, FaDownload, FaFileUpload, 
    FaExchangeAlt, FaCheckCircle, FaGlobe, FaEye
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const PdfToHtml = () => {
    const [file, setFile] = useState(null);
    const [htmlCode, setHtmlCode] = useState('');
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        if (selectedFile.type !== 'application/pdf') {
            toast.error('Please upload a PDF file.');
            return;
        }
        setFile(selectedFile);
        setHtmlCode('');
        setProgress(0);
    };

    const convertPdfToHtml = async () => {
        if (!file) return;

        setIsConverting(true);
        setProgress(0);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const numPages = pdf.numPages;
            
            let bodyContent = '';

            for (let i = 1; i <= numPages; i++) {
                setProgress(Math.round((i / numPages) * 100));
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                
                // Group text by Y-coordinate for basic paragraph grouping
                const rows = {};
                textContent.items.forEach(item => {
                    const y = Math.round(item.transform[5]);
                    if (!rows[y]) rows[y] = [];
                    rows[y].push(item);
                });

                const sortedY = Object.keys(rows).sort((a, b) => b - a);
                
                bodyContent += `<section class="pdf-page" id="page-${i}" style="margin-bottom: 40px; padding: 20px; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 8px;">\n`;
                bodyContent += `  <h2 style="color: #64748b; font-size: 14px; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">Page ${i}</h2>\n`;

                sortedY.forEach(y => {
                    const rowItems = rows[y].sort((a, b) => a.transform[4] - b.transform[4]);
                    const rowText = rowItems.map(item => item.str).join(' ');
                    if (rowText.trim()) {
                        bodyContent += `  <p style="margin-bottom: 10px; font-family: sans-serif; line-height: 1.6;">${rowText}</p>\n`;
                    }
                });
                bodyContent += `</section>\n\n`;
            }

            const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted Document - ${file.name}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; color: #1e293b; padding: 40px; line-height: 1.6; }
        .container { max-width: 900px; margin: 0 auto; }
        p { margin: 0 0 15px; }
    </style>
</head>
<body>
    <div class="container">
        ${bodyContent}
    </div>
</body>
</html>`;

            setHtmlCode(fullHtml);
            toast.success('Conversion to HTML complete!');
        } catch (error) {
            console.error('Conversion Error:', error);
            toast.error('Failed to convert PDF to HTML.');
        } finally {
            setIsConverting(false);
        }
    };

    const downloadHtml = () => {
        const blob = new Blob([htmlCode], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${file.name.replace('.pdf', '')}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="pdf-to-html-tool py-4">
            <style>{`
                .pdf-to-html-tool {
                    max-width: 1000px;
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
                    background: #f1f5f9;
                    transition: all 0.3s;
                    cursor: pointer;
                    margin-bottom: 2.5rem;
                }
                .upload-zone:hover {
                    border-color: #6366f1;
                    background: #f5f3ff;
                }
                .code-editor {
                    background: #0f172a;
                    border-radius: 20px;
                    padding: 2rem;
                    margin-top: 2rem;
                    text-align: left;
                }
                .html-preview-box {
                    width: 100%;
                    height: 400px;
                    background: #1e293b;
                    border: 1px solid #334155;
                    border-radius: 14px;
                    color: #94a3b8;
                    padding: 1.5rem;
                    font-family: 'Fira Code', monospace;
                    font-size: 0.85rem;
                    overflow: auto;
                    white-space: pre-wrap;
                }
                .convert-btn {
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                    color: white;
                    border: none;
                    padding: 1.2rem 3rem;
                    border-radius: 18px;
                    font-weight: 700;
                    font-size: 1.1rem;
                    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
                    transition: all 0.3s;
                    width: 100%;
                }
                .convert-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 25px -5px rgba(99, 102, 241, 0.4);
                }
            `}</style>

            <div className="main-card fade-in">
                <div className="d-flex align-items-center justify-content-center gap-3 mb-5">
                    <div className="p-3 rounded-4 bg-indigo-50 text-indigo-600">
                        <FaCode size={32} />
                    </div>
                    <div className="text-start">
                        <h2 className="h4 fw-bold mb-1">PDF to HTML Converter</h2>
                        <p className="text-muted mb-0 small">Convert your PDF documents into clean, responsive web pages.</p>
                    </div>
                </div>

                {!file ? (
                    <div className="upload-zone" onClick={() => document.getElementById('pdfInput').click()}>
                        <input type="file" id="pdfInput" hidden accept=".pdf" onChange={onFileChange} />
                        <div className="p-4 rounded-circle bg-white shadow-sm d-inline-block mb-4 text-indigo-600">
                            <FaFileUpload size={48} />
                        </div>
                        <h4 className="fw-bold mb-2">Select PDF File</h4>
                        <p className="text-slate-500 mb-0">Drag and drop your document to generate HTML code</p>
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
                            <Button variant="link" className="text-danger p-0 fw-bold" onClick={() => { setFile(null); setHtmlCode(''); }}>Change</Button>
                        </div>

                        {!htmlCode ? (
                            <Button 
                                className="convert-btn"
                                onClick={convertPdfToHtml}
                                disabled={isConverting}
                            >
                                {isConverting ? <Spinner animation="border" size="sm" className="me-2" /> : <FaExchangeAlt className="me-2" />}
                                {isConverting ? `Converting to HTML... ${progress}%` : 'Generate HTML Webpage'}
                            </Button>
                        ) : (
                            <div className="code-editor fade-in">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="d-flex align-items-center gap-2 text-white small">
                                        <FaCode className="text-indigo-400" /> index.html
                                    </div>
                                    <Button variant="success" size="sm" className="rounded-pill px-4" onClick={downloadHtml}>
                                        <FaDownload className="me-2" /> Download HTML
                                    </Button>
                                </div>
                                <div className="html-preview-box scrollbar-hide">
                                    {htmlCode}
                                </div>
                                <div className="mt-4 text-center">
                                    <Button variant="outline-light" size="sm" className="border-0 bg-transparent text-slate-400" onClick={() => setHtmlCode('')}>
                                        <FaExchangeAlt className="me-2" /> Reset Conversion
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-5 row g-4">
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-indigo-600">
                            <FaGlobe /> Web Ready
                        </div>
                        <p className="text-muted small mb-0">Generates clean, semantic HTML5 code that can be easily integrated into any website or blog.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-indigo-600">
                            <FaCheckCircle /> Responsive Structure
                        </div>
                        <p className="text-muted small mb-0">Our algorithm groups text into sections and paragraphs, ensuring your document looks great on both mobile and desktop screens.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-indigo-600">
                            <FaEye /> Instant Preview
                        </div>
                        <p className="text-muted small mb-0">View your generated HTML code immediately after conversion with our built-in high-performance code viewer.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfToHtml;
