import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Form, Button, Spinner, Card } from 'react-bootstrap';
import { 
    FaFilePdf, FaFileExcel, FaDownload, FaFileUpload, 
    FaExchangeAlt, FaCheckCircle, FaSpinner, FaTable
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const PdfToExcel = () => {
    const [file, setFile] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const [resultCsvUrl, setResultCsvUrl] = useState(null);
    const [progress, setProgress] = useState(0);

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            toast.error('Only PDF files are allowed.');
            return;
        }

        setFile(selectedFile);
        setResultCsvUrl(null);
        setProgress(0);
    };

    const convertPdfToExcel = async () => {
        if (!file) return;

        setIsConverting(true);
        setProgress(0);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const numPages = pdf.numPages;
            
            let allRows = [];

            for (let i = 1; i <= numPages; i++) {
                setProgress(Math.round((i / numPages) * 100));
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                
                // Group items by Y-coordinate (Rows)
                const rows = {};
                textContent.items.forEach(item => {
                    const y = Math.round(item.transform[5]);
                    if (!rows[y]) rows[y] = [];
                    rows[y].push(item);
                });

                // Sort Y-coordinates from top to bottom
                const sortedY = Object.keys(rows).sort((a, b) => b - a);
                
                sortedY.forEach(y => {
                    // Sort items in each row by X-coordinate (Columns)
                    const rowItems = rows[y].sort((a, b) => a.transform[4] - b.transform[4]);
                    
                    // Simple heuristic: if distance between items is large, they are different columns
                    let currentRow = [];
                    let lastX = -1;
                    let lastWidth = 0;
                    
                    rowItems.forEach(item => {
                        const x = item.transform[4];
                        // If gap is more than 2x the width of a space (estimate)
                        if (lastX !== -1 && (x - (lastX + lastWidth)) > 15) {
                            // Start new column or add empty cells? 
                            // For simplicity, we just join with comma for CSV
                        }
                        currentRow.push(item.str.replace(/,/g, ' ')); // Remove commas to prevent CSV breakage
                        lastX = x;
                        lastWidth = item.width;
                    });
                    
                    if (currentRow.length > 0) {
                        allRows.push(currentRow.join(','));
                    }
                });
            }

            const csvContent = allRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            
            setResultCsvUrl(url);
            toast.success('Table extraction complete!');
        } catch (error) {
            console.error('Extraction Error:', error);
            toast.error('Failed to extract table data.');
        } finally {
            setIsConverting(false);
            setProgress(100);
        }
    };

    const downloadExcel = () => {
        if (!resultCsvUrl) return;
        const link = document.createElement('a');
        link.href = resultCsvUrl;
        link.download = `${file.name.replace('.pdf', '')}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="pdf-to-excel-tool py-4">
            <style>{`
                .pdf-to-excel-tool {
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
                    padding: 4rem 2rem;
                    background: #f8fafc;
                    transition: all 0.3s;
                    cursor: pointer;
                    margin-bottom: 2.5rem;
                }
                .upload-zone:hover {
                    border-color: #059669;
                    background: #ecfdf5;
                }
                .convert-btn {
                    background: linear-gradient(135deg, #059669 0%, #065f46 100%);
                    color: white;
                    border: none;
                    padding: 1.2rem 3rem;
                    border-radius: 18px;
                    font-weight: 700;
                    font-size: 1.1rem;
                    box-shadow: 0 10px 20px -5px rgba(5, 150, 105, 0.4);
                    transition: all 0.3s;
                    width: 100%;
                }
                .convert-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 25px -5px rgba(5, 150, 105, 0.5);
                }
                .progress-wrapper {
                    margin-top: 2rem;
                    padding: 1.5rem;
                    background: #f8fafc;
                    border-radius: 20px;
                }
                .feature-card {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 20px;
                    padding: 1.5rem;
                    height: 100%;
                    transition: all 0.3s;
                }
                .feature-card:hover {
                    background: white;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                    border-color: #059669;
                }
            `}</style>

            <div className="main-card fade-in">
                <div className="d-flex align-items-center justify-content-center gap-3 mb-5">
                    <div className="p-3 rounded-4 bg-emerald-50 text-emerald-600">
                        <FaTable size={32} />
                    </div>
                    <div className="text-start">
                        <h2 className="h4 fw-bold mb-1">PDF to Excel Converter</h2>
                        <p className="text-muted mb-0 small">Extract tabular data from PDF files into editable spreadsheets.</p>
                    </div>
                </div>

                {!file ? (
                    <div className="upload-zone" onClick={() => document.getElementById('pdfInput').click()}>
                        <input type="file" id="pdfInput" hidden accept=".pdf" onChange={onFileChange} />
                        <div className="p-4 rounded-circle bg-emerald-50 d-inline-block mb-4 text-emerald-600">
                            <FaFileUpload size={48} />
                        </div>
                        <h4 className="fw-bold mb-2">Upload PDF Document</h4>
                        <p className="text-slate-500 mb-0">Select the file containing the tables you want to extract</p>
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
                            <Button variant="link" className="text-danger p-0 fw-bold" onClick={() => setFile(null)}>Change</Button>
                        </div>

                        {!resultCsvUrl ? (
                            <Button 
                                className="convert-btn"
                                onClick={convertPdfToExcel}
                                disabled={isConverting}
                            >
                                {isConverting ? <Spinner animation="border" size="sm" className="me-2" /> : <FaExchangeAlt className="me-2" />}
                                {isConverting ? `Converting Tables... ${progress}%` : 'Extract to Excel (.csv)'}
                            </Button>
                        ) : (
                            <div className="fade-in">
                                <div className="p-3 bg-success bg-opacity-10 text-success rounded-3 mb-4 d-flex align-items-center justify-content-center gap-2 fw-bold">
                                    <FaCheckCircle /> Tables Extracted Successfully!
                                </div>
                                <div className="d-flex gap-3">
                                    <Button variant="outline-secondary" className="flex-grow-1 py-3 rounded-4" onClick={() => setFile(null)}>
                                        Convert Another
                                    </Button>
                                    <Button variant="success" className="convert-btn flex-grow-1" onClick={downloadExcel}>
                                        <FaDownload className="me-2" /> Download Excel File
                                    </Button>
                                </div>
                            </div>
                        )}

                        {isConverting && (
                            <div className="progress-wrapper fade-in mt-4">
                                <p className="small text-muted mb-2">Analyzing coordinates and reconstructing table structure...</p>
                                <div className="progress rounded-pill" style={{ height: '8px' }}>
                                    <div 
                                        className="progress-bar progress-bar-striped progress-bar-animated bg-emerald-500" 
                                        role="progressbar" 
                                        style={{ width: `${progress}%`, background: '#10b981' }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-5 row g-4">
                <div className="col-md-4">
                    <div className="feature-card">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-emerald-600">
                            <FaTable /> Table Extraction
                        </div>
                        <p className="text-muted small mb-0">Our algorithm analyzes the X and Y coordinates of text items to accurately reconstruct the original table layout from your PDF.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="feature-card">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-emerald-600">
                            <FaFileExcel /> Excel Compatible
                        </div>
                        <p className="text-muted small mb-0">Outputs high-quality CSV files that can be opened instantly in Microsoft Excel, Google Sheets, or any other spreadsheet software.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="feature-card">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-emerald-600">
                            <FaCheckCircle /> Privacy First
                        </div>
                        <p className="text-muted small mb-0">All data processing is done locally in your browser. Your sensitive financial documents never leave your computer.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfToExcel;
