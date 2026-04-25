import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { Form, Button, Spinner } from 'react-bootstrap';
import { 
    FaFilePdf, FaFileWord, FaDownload, FaFileUpload, 
    FaCheckCircle, FaSpinner, FaExchangeAlt 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const PdfToWord = () => {
    const [file, setFile] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const [resultDocUrl, setResultDocUrl] = useState(null);
    const [progress, setProgress] = useState(0);

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            toast.error('Only PDF files are allowed.');
            return;
        }

        setFile(selectedFile);
        setResultDocUrl(null);
        setProgress(0);
        toast.success('PDF uploaded successfully!');
    };

    const convertPdfToWord = async () => {
        if (!file) return;

        setIsConverting(true);
        setProgress(0);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const numPages = pdf.numPages;
            
            const paragraphs = [];

            for (let i = 1; i <= numPages; i++) {
                setProgress(Math.round((i / numPages) * 100));
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                
                // Group text items by Y-coordinate (simple line detection)
                const lines = {};
                textContent.items.forEach(item => {
                    const y = Math.round(item.transform[5]);
                    if (!lines[y]) lines[y] = [];
                    lines[y].push(item);
                });

                // Sort lines from top to bottom
                const sortedY = Object.keys(lines).sort((a, b) => b - a);
                
                sortedY.forEach(y => {
                    // Sort items in line from left to right
                    const lineItems = lines[y].sort((a, b) => a.transform[4] - b.transform[4]);
                    const lineText = lineItems.map(item => item.str).join(' ');
                    
                    if (lineText.trim()) {
                        paragraphs.push(
                            new Paragraph({
                                children: [new TextRun(lineText)],
                            })
                        );
                    }
                });

                // Add a page break after each page except the last one
                if (i < numPages) {
                    // Note: Simple text extraction doesn't perfectly match pages in docx,
                    // but we can add space or a manual break if needed.
                }
            }

            const doc = new Document({
                sections: [{
                    children: paragraphs,
                }],
            });

            const docBlob = await Packer.toBlob(doc);
            const url = URL.createObjectURL(docBlob);
            
            setResultDocUrl(url);
            toast.success('Conversion complete!');
        } catch (error) {
            console.error('Conversion Error:', error);
            toast.error('An error occurred during conversion.');
        } finally {
            setIsConverting(false);
            setProgress(100);
        }
    };

    const downloadWordDoc = () => {
        if (!resultDocUrl) return;
        const link = document.createElement('a');
        link.href = resultDocUrl;
        link.download = `${file.name.replace('.pdf', '')}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="pdf-to-word-container py-4">
            <style>{`
                .pdf-to-word-container {
                    max-width: 900px;
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
                    border-color: #2b6cb0;
                    background: #ebf8ff;
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
                .conversion-steps {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 2rem;
                    margin-bottom: 2rem;
                }
                .step-box {
                    text-align: center;
                    flex: 1;
                }
                .step-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: #f7fafc;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 10px;
                    color: #4a5568;
                    transition: all 0.3s;
                }
                .active .step-icon {
                    background: #2b6cb0;
                    color: white;
                    box-shadow: 0 4px 12px rgba(43, 108, 176, 0.3);
                }
                .btn-convert {
                    background: linear-gradient(135deg, #2b6cb0 0%, #2c5282 100%);
                    border: none;
                    padding: 1rem 2.5rem;
                    font-weight: 700;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(43, 108, 176, 0.3);
                    transition: all 0.3s;
                }
                .btn-convert:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(43, 108, 176, 0.4);
                }
                .btn-download {
                    background: linear-gradient(135deg, #2f855a 0%, #276749 100%);
                    border: none;
                    padding: 1rem 2.5rem;
                    font-weight: 700;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(39, 103, 73, 0.3);
                    transition: all 0.3s;
                }
                .progress-container {
                    margin-top: 2rem;
                    text-align: center;
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
                    <div className="p-3 rounded-4" style={{ background: '#ebf8ff' }}>
                        <FaExchangeAlt size={28} style={{ color: '#2b6cb0' }} />
                    </div>
                    <div>
                        <h2 className="h4 fw-bold mb-1" style={{ color: '#1a202c' }}>PDF to Word Converter</h2>
                        <p className="text-muted mb-0 small">Convert your PDF documents to editable Microsoft Word files.</p>
                    </div>
                </div>

                {!file ? (
                    <div className="upload-zone">
                        <input type="file" accept=".pdf" onChange={onFileChange} />
                        <FaFileUpload size={48} className="mb-3" style={{ color: '#2b6cb0' }} />
                        <h5 className="fw-bold mb-2">Upload PDF to Convert</h5>
                        <p className="text-muted small mb-0">Select the file you want to turn into Word</p>
                    </div>
                ) : (
                    <div className="file-info fade-in p-3 border rounded-4 mb-4 d-flex align-items-center justify-content-between bg-light">
                        <div className="d-flex align-items-center gap-3">
                            <FaFilePdf size={32} color="#e53e3e" />
                            <div>
                                <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '300px' }}>{file.name}</div>
                                <div className="text-muted small">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                        </div>
                        <Button variant="link" className="text-danger p-0 fw-bold" onClick={() => { setFile(null); setResultDocUrl(null); setProgress(0); }}>
                            Change
                        </Button>
                    </div>
                )}

                <div className="conversion-steps">
                    <div className={`step-box ${file ? 'active' : ''}`}>
                        <div className="step-icon"><FaFilePdf size={24} /></div>
                        <div className="small fw-bold">PDF Source</div>
                    </div>
                    <div className="text-muted"><FaExchangeAlt /></div>
                    <div className={`step-box ${resultDocUrl ? 'active' : ''}`}>
                        <div className="step-icon"><FaFileWord size={24} /></div>
                        <div className="small fw-bold">Word Output</div>
                    </div>
                </div>

                {!resultDocUrl ? (
                    <Button 
                        className="btn-convert w-100 text-white d-flex align-items-center justify-content-center gap-2"
                        onClick={convertPdfToWord}
                        disabled={!file || isConverting}
                    >
                        {isConverting ? <Spinner animation="border" size="sm" /> : <FaExchangeAlt />}
                        {isConverting ? `Converting... ${progress}%` : 'Convert to Word (.docx)'}
                    </Button>
                ) : (
                    <div className="d-flex gap-3 fade-in">
                        <Button 
                            variant="outline-primary" 
                            className="flex-grow-1"
                            style={{ borderRadius: '12px', padding: '1rem' }}
                            onClick={() => { setFile(null); setResultDocUrl(null); }}
                        >
                            Convert Another
                        </Button>
                        <Button 
                            className="btn-download flex-grow-1 text-white d-flex align-items-center justify-content-center gap-2"
                            onClick={downloadWordDoc}
                        >
                            <FaDownload /> Download Word Doc
                        </Button>
                    </div>
                )}

                {isConverting && (
                    <div className="progress-container fade-in">
                        <div className="text-muted small mb-2">Analyzing PDF structure and extracting text...</div>
                        <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                            <div 
                                className="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                                role="progressbar" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {resultDocUrl && (
                    <div className="mt-4 p-3 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-4 d-flex align-items-center gap-3 fade-in">
                        <FaCheckCircle className="text-success" size={20} />
                        <span className="text-success fw-bold">Success! Your Word document is ready.</span>
                    </div>
                )}
            </div>

            <div className="how-it-works main-card fade-in">
                <h4 className="fw-bold mb-4">Features & Limitations</h4>
                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="p-3 border rounded-4 h-100">
                            <h6 className="fw-bold text-primary">Text Preservation</h6>
                            <p className="text-muted small mb-0">We extract text while maintaining line breaks and basic structure for easy editing in Microsoft Word.</p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="p-3 border rounded-4 h-100">
                            <h6 className="fw-bold text-primary">Privacy Guaranteed</h6>
                            <p className="text-muted small mb-0">Processing happens entirely in your browser. No files are uploaded to our servers, keeping your data secure.</p>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="p-3 border rounded-4 bg-light">
                            <div className="d-flex align-items-start gap-2">
                                <FaSpinner className="text-warning mt-1" />
                                <div>
                                    <h6 className="fw-bold">Note on Complex Layouts</h6>
                                    <p className="text-muted small mb-0">For highly complex PDFs with tables, images, or special formatting, the layout may require minor manual adjustments in Word after conversion.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfToWord;
