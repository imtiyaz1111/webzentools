import React, { useState } from 'react';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import { 
    FaCode, FaFilePdf, FaDownload, FaFileUpload, 
    FaExchangeAlt, FaCheckCircle, FaGlobe, FaEye
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';

const HtmlToPdf = () => {
    const [htmlInput, setHtmlInput] = useState('');
    const [isConverting, setIsConverting] = useState(false);
    const [resultPdfUrl, setResultPdfUrl] = useState(null);

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
            toast.error('Please upload an HTML file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setHtmlInput(event.target.result);
            toast.success('HTML file loaded!');
        };
        reader.readAsText(file);
    };

    const generatePdf = async () => {
        if (!htmlInput.trim()) {
            toast.error('Please enter some HTML code.');
            return;
        }

        setIsConverting(true);
        try {
            // Create a temporary container to render HTML
            const container = document.createElement('div');
            container.innerHTML = htmlInput;
            container.style.padding = '40px';
            container.style.background = 'white';
            
            const opt = {
                margin: 10,
                filename: 'converted_webpage.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            const pdfBlob = await html2pdf().from(container).set(opt).output('blob');
            const url = URL.createObjectURL(pdfBlob);
            setResultPdfUrl(url);
            toast.success('PDF generated successfully!');
        } catch (error) {
            console.error('PDF Error:', error);
            toast.error('Failed to generate PDF. Check your HTML code.');
        } finally {
            setIsConverting(false);
        }
    };

    const downloadPdf = () => {
        if (!resultPdfUrl) return;
        const link = document.createElement('a');
        link.href = resultPdfUrl;
        link.download = 'webpage.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="html-to-pdf-tool py-4">
            <style>{`
                .html-to-pdf-tool {
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
                .editor-container {
                    background: #0f172a;
                    border-radius: 24px;
                    padding: 2rem;
                    margin-bottom: 2.5rem;
                    text-align: left;
                    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.3);
                }
                .html-textarea {
                    width: 100%;
                    height: 400px;
                    background: #1e293b;
                    border: 1px solid #334155;
                    border-radius: 16px;
                    color: #94a3b8;
                    padding: 1.5rem;
                    font-family: 'Fira Code', monospace;
                    font-size: 0.9rem;
                    resize: none;
                    transition: all 0.3s;
                }
                .html-textarea:focus {
                    outline: none;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
                    color: #f8fafc;
                }
                .convert-btn {
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                    color: white;
                    border: none;
                    padding: 1.2rem 3rem;
                    border-radius: 18px;
                    font-weight: 700;
                    font-size: 1.1rem;
                    box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
                    transition: all 0.3s;
                    width: 100%;
                }
                .convert-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 25px -5px rgba(99, 102, 241, 0.5);
                }
                .upload-label {
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: #f1f5f9;
                    border-radius: 100px;
                    font-size: 13px;
                    font-weight: 600;
                    color: #475569;
                    transition: all 0.2s;
                }
                .upload-label:hover {
                    background: #e2e8f0;
                    color: #1e293b;
                }
            `}</style>

            <div className="main-card fade-in">
                <div className="d-flex align-items-center justify-content-between mb-5">
                    <div className="d-flex align-items-center gap-3">
                        <div className="p-3 rounded-4 bg-indigo-50 text-indigo-600">
                            <FaExchangeAlt size={32} />
                        </div>
                        <div className="text-start">
                            <h2 className="h4 fw-bold mb-1 ">HTML to PDF Converter</h2>
                            <p className="text-muted mb-0 small">Convert raw HTML code or web files into professional PDF documents.</p>
                        </div>
                    </div>
                    <label className="upload-label">
                        <FaFileUpload /> Upload .html file
                        <input type="file" hidden accept=".html,.htm" onChange={onFileChange} />
                    </label>
                </div>

                <div className="editor-container">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-2 text-white small fw-bold">
                            <FaCode /> HTML EDITOR
                        </div>
                        <span className="x-small text-white">Supports CSS and Inline Styles</span>
                    </div>
                    <textarea 
                        className="html-textarea scrollbar-hide"
                        placeholder="Paste your HTML code here (e.g., <h1>Hello World</h1>)..."
                        value={htmlInput}
                        onChange={(e) => setHtmlInput(e.target.value)}
                    />
                </div>

                {!resultPdfUrl ? (
                    <Button 
                        className="convert-btn"
                        onClick={generatePdf}
                        disabled={isConverting || !htmlInput.trim()}
                    >
                        {isConverting ? <Spinner animation="border" size="sm" className="me-2" /> : <FaFilePdf className="me-2" />}
                        {isConverting ? 'Rendering PDF...' : 'Convert HTML to PDF'}
                    </Button>
                ) : (
                    <div className="fade-in">
                        <div className="p-3 bg-success bg-opacity-10 text-success rounded-3 mb-4 d-flex align-items-center justify-content-center gap-2 fw-bold">
                            <FaCheckCircle /> PDF Rendering Complete!
                        </div>
                        <div className="d-flex gap-3">
                            <Button variant="outline-secondary" className="flex-grow-1 py-3 rounded-4" onClick={() => setResultPdfUrl(null)}>
                                Edit HTML
                            </Button>
                            <Button className="convert-btn flex-grow-1" onClick={downloadPdf}>
                                <FaDownload className="me-2" /> Download PDF File
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-5 row g-4">
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-indigo-600">
                            <FaGlobe /> CSS Support
                        </div>
                        <p className="text-muted small mb-0">Full support for inline styles and internal CSS blocks, allowing you to maintain complex layouts and branding.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-indigo-600">
                            <FaEye /> Live Rendering
                        </div>
                        <p className="text-muted small mb-0">Our engine renders your HTML exactly as a browser would before capturing it as a high-resolution PDF document.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-indigo-600">
                            <FaCheckCircle /> Fast & Private
                        </div>
                        <p className="text-muted small mb-0">All rendering happens in your browser. Your code and resulting PDFs are never sent to a server, ensuring 100% privacy.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HtmlToPdf;
