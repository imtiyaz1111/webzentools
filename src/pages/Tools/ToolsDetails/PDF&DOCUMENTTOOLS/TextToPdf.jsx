import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { 
    FaFileAlt, FaFilePdf, FaDownload, FaFileUpload, 
    FaKeyboard, FaCheckCircle, FaCog, FaFont
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const TextToPdf = () => {
    const [text, setText] = useState('');
    const [fontSize, setFontSize] = useState(12);
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultPdfUrl, setResultPdfUrl] = useState(null);

    const onFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
            toast.error('Please upload a valid .txt file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setText(event.target.result);
            toast.success('Text file loaded!');
        };
        reader.readAsText(file);
    };

    const generatePdf = () => {
        if (!text.trim()) {
            toast.error('Please enter some text to convert.');
            return;
        }

        setIsGenerating(true);
        try {
            const doc = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4',
            });

            // Set font and size
            doc.setFont('helvetica');
            doc.setFontSize(fontSize);

            // Split text to fit page width
            const splitText = doc.splitTextToSize(text, 180); // 180mm width (A4 is 210mm)
            
            // Add pages and text
            let y = 15;
            splitText.forEach((line) => {
                if (y > 280) { // Page height check
                    doc.addPage();
                    y = 15;
                }
                doc.text(line, 15, y);
                y += fontSize * 0.5; // Line height based on font size
            });

            const pdfBlob = doc.output('blob');
            const url = URL.createObjectURL(pdfBlob);
            setResultPdfUrl(url);
            toast.success('PDF created successfully!');
        } catch (error) {
            console.error('PDF Generation Error:', error);
            toast.error('Failed to generate PDF.');
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadPdf = () => {
        if (!resultPdfUrl) return;
        const link = document.createElement('a');
        link.href = resultPdfUrl;
        link.download = 'converted_text.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="text-to-pdf-tool py-4">
            <style>{`
                .text-to-pdf-tool {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                .main-card {
                    background: #ffffff;
                    border-radius: 32px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    padding: 3rem;
                }
                .text-editor-area {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 20px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                }
                .custom-textarea {
                    width: 100%;
                    height: 400px;
                    border: 1px solid #e2e8f0;
                    border-radius: 14px;
                    padding: 1.5rem;
                    font-family: 'Inter', sans-serif;
                    font-size: 1rem;
                    line-height: 1.6;
                    color: #334155;
                    background: white;
                    resize: none;
                    transition: all 0.3s;
                }
                .custom-textarea:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
                }
                .settings-card {
                    background: #f1f5f9;
                    border-radius: 20px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                }
                .generate-btn {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    border: none;
                    padding: 1.2rem 3rem;
                    border-radius: 18px;
                    font-weight: 700;
                    font-size: 1.1rem;
                    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
                    transition: all 0.3s;
                    width: 100%;
                }
                .generate-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 25px -5px rgba(16, 185, 129, 0.4);
                }
            `}</style>

            <div className="main-card fade-in">
                <div className="d-flex align-items-center justify-content-between mb-5">
                    <div className="d-flex align-items-center gap-3">
                        <div className="p-3 rounded-4 bg-emerald-50 text-emerald-600">
                            <FaKeyboard size={32} />
                        </div>
                        <div className="text-start">
                            <h2 className="h4 fw-bold mb-1">Text to PDF Converter</h2>
                            <p className="text-muted mb-0 small">Turn your raw text or notes into professionally formatted PDF documents.</p>
                        </div>
                    </div>
                    <label className="btn btn-outline-primary rounded-pill px-4 d-flex align-items-center gap-2 cursor-pointer">
                        <FaFileUpload /> Upload .txt
                        <input type="file" hidden accept=".txt" onChange={onFileChange} />
                    </label>
                </div>

                <div className="text-editor-area">
                    <textarea 
                        className="custom-textarea scrollbar-hide"
                        placeholder="Start typing or paste your content here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                <div className="settings-card">
                    <Row className="align-items-center">
                        <Col md={6}>
                            <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                <FaCog className="text-slate-400" /> Document Settings
                            </h6>
                        </Col>
                        <Col md={6}>
                            <div className="d-flex align-items-center justify-content-end gap-3">
                                <span className="small text-muted d-flex align-items-center gap-2"><FaFont /> Font Size:</span>
                                <Form.Range 
                                    min={8} 
                                    max={24} 
                                    step={1} 
                                    value={fontSize} 
                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    className="w-50"
                                />
                                <span className="fw-bold text-emerald-600" style={{ minWidth: '30px' }}>{fontSize}px</span>
                            </div>
                        </Col>
                    </Row>
                </div>

                {!resultPdfUrl ? (
                    <Button 
                        className="generate-btn"
                        onClick={generatePdf}
                        disabled={isGenerating || !text.trim()}
                    >
                        {isGenerating ? 'Generating PDF...' : 'Convert to PDF Now'}
                    </Button>
                ) : (
                    <div className="fade-in">
                        <div className="p-3 bg-success bg-opacity-10 text-success rounded-3 mb-4 d-flex align-items-center justify-content-center gap-2 fw-bold">
                            <FaCheckCircle /> Your PDF is ready for download!
                        </div>
                        <div className="d-flex gap-3">
                            <Button variant="outline-secondary" className="flex-grow-1 py-3 rounded-4" onClick={() => setResultPdfUrl(null)}>
                                Back to Editor
                            </Button>
                            <Button className="generate-btn flex-grow-1" onClick={downloadPdf}>
                                <FaDownload className="me-2" /> Download PDF File
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-5 row g-4">
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-emerald-600">
                            <FaKeyboard /> Write or Paste
                        </div>
                        <p className="text-muted small mb-0">Use our premium text editor to write your content directly, or paste text from any other source instantly.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-emerald-600">
                            <FaFont /> Pro Formatting
                        </div>
                        <p className="text-muted small mb-0">Automatically handles line wrapping, page breaks, and margin alignments to ensure your PDF looks professional.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-emerald-600">
                            <FaCheckCircle /> Universal Support
                        </div>
                        <p className="text-muted small mb-0">Generates standard A4 PDF documents that are perfectly readable on any mobile or desktop device.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextToPdf;
