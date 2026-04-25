import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner, Table } from 'react-bootstrap';
import { 
    FaFileExcel, FaFilePdf, FaDownload, FaFileUpload, 
    FaExchangeAlt, FaCheckCircle, FaTable, FaEye
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';

const ExcelToPdf = () => {
    const [file, setFile] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const [resultPdfUrl, setResultPdfUrl] = useState(null);
    const [previewData, setPreviewData] = useState(null); // { sheetName: [rows] }
    const [isLibLoaded, setIsLibLoaded] = useState(false);

    useEffect(() => {
        // Load SheetJS from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
        script.async = true;
        script.onload = () => setIsLibLoaded(true);
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const onFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const ext = selectedFile.name.split('.').pop().toLowerCase();
        if (!['xlsx', 'xls', 'csv'].includes(ext)) {
            toast.error('Please upload a valid Excel or CSV file.');
            return;
        }

        setFile(selectedFile);
        setResultPdfUrl(null);
        generatePreview(selectedFile);
    };

    const generatePreview = async (file) => {
        if (!window.XLSX) {
            toast.error('Excel library still loading, please wait...');
            return;
        }

        try {
            const data = await file.arrayBuffer();
            const workbook = window.XLSX.read(data);
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = window.XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            setPreviewData({
                name: firstSheetName,
                rows: jsonData.slice(0, 15) // Show first 15 rows for preview
            });
            toast.success('Excel file loaded for conversion!');
        } catch (error) {
            console.error('Preview Error:', error);
            toast.error('Failed to preview Excel file.');
        }
    };

    const convertToPdf = async () => {
        if (!file || !window.XLSX) return;

        setIsConverting(true);
        try {
            const data = await file.arrayBuffer();
            const workbook = window.XLSX.read(data);
            
            // Create a hidden div to render all sheets as HTML tables
            const container = document.createElement('div');
            container.style.padding = '40px';
            container.style.background = 'white';
            container.style.width = '800px'; // Standard A4-ish width

            workbook.SheetNames.forEach((sheetName, index) => {
                const worksheet = workbook.Sheets[sheetName];
                const html = window.XLSX.utils.sheet_to_html(worksheet);
                
                const title = document.createElement('h2');
                title.innerText = `Sheet: ${sheetName}`;
                title.style.marginBottom = '20px';
                if (index > 0) title.style.pageBreakBefore = 'always';
                
                const tableWrapper = document.createElement('div');
                tableWrapper.innerHTML = html;
                
                // Style the table for PDF
                const table = tableWrapper.querySelector('table');
                if (table) {
                    table.style.width = '100%';
                    table.style.borderCollapse = 'collapse';
                    table.style.marginBottom = '40px';
                    table.querySelectorAll('td, th').forEach(cell => {
                        cell.style.border = '1px solid #ddd';
                        cell.style.padding = '8px';
                        cell.style.fontSize = '12px';
                    });
                }

                container.appendChild(title);
                container.appendChild(tableWrapper);
            });

            const opt = {
                margin: 10,
                filename: `${file.name.split('.')[0]}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
            };

            const pdfBlob = await html2pdf().from(container).set(opt).output('blob');
            const url = URL.createObjectURL(pdfBlob);
            setResultPdfUrl(url);
            toast.success('PDF generated successfully!');
        } catch (error) {
            console.error('Conversion Error:', error);
            toast.error('Failed to convert Excel to PDF.');
        } finally {
            setIsConverting(false);
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
        <div className="excel-to-pdf-tool py-4">
            <style>{`
                .excel-to-pdf-tool {
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
                .upload-zone {
                    border: 2px dashed #cbd5e0;
                    border-radius: 24px;
                    padding: 4rem 2rem;
                    background: #f8fafc;
                    transition: all 0.3s;
                    cursor: pointer;
                    margin-bottom: 2.5rem;
                    text-align: center;
                }
                .upload-zone:hover {
                    border-color: #059669;
                    background: #ecfdf5;
                }
                .preview-container {
                    background: #f8fafc;
                    border-radius: 20px;
                    border: 1px solid #e2e8f0;
                    padding: 2rem;
                    margin-top: 2rem;
                    overflow-x: auto;
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
                .table-preview {
                    font-size: 0.85rem;
                    color: #475569;
                }
                .table-preview th {
                    background: #f1f5f9;
                    font-weight: 700;
                }
            `}</style>

            <div className="main-card fade-in">
                <div className="d-flex align-items-center justify-content-center gap-3 mb-5">
                    <div className="p-3 rounded-4 bg-emerald-50 text-emerald-600">
                        <FaExchangeAlt size={32} />
                    </div>
                    <div className="text-start">
                        <h2 className="h4 fw-bold mb-1">Excel to PDF Converter</h2>
                        <p className="text-muted mb-0 small">Transform your spreadsheets into professional PDF documents instantly.</p>
                    </div>
                </div>

                {!isLibLoaded && (
                    <div className="alert alert-info py-2 rounded-3 mb-4">
                        <Spinner animation="border" size="sm" className="me-2" />
                        Initializing Excel engine...
                    </div>
                )}

                {!file ? (
                    <div className="upload-zone" onClick={() => document.getElementById('excelInput').click()}>
                        <input type="file" id="excelInput" hidden accept=".xlsx,.xls,.csv" onChange={onFileChange} />
                        <div className="p-4 rounded-circle bg-emerald-50 d-inline-block mb-4 text-emerald-600">
                            <FaFileUpload size={48} />
                        </div>
                        <h4 className="fw-bold mb-2">Select Excel / CSV File</h4>
                        <p className="text-slate-500 mb-0">Drag and drop your spreadsheet here to start conversion</p>
                    </div>
                ) : (
                    <div className="fade-in">
                        <div className="p-4 border rounded-4 mb-4 d-flex align-items-center justify-content-between bg-light">
                            <div className="d-flex align-items-center gap-3">
                                <FaFileExcel size={32} className="text-emerald-600" />
                                <div className="text-start">
                                    <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '300px' }}>{file.name}</div>
                                    <div className="text-muted small">{(file.size / 1024).toFixed(2)} KB</div>
                                </div>
                            </div>
                            <Button variant="link" className="text-danger p-0 fw-bold" onClick={() => { setFile(null); setPreviewData(null); setResultPdfUrl(null); }}>Change</Button>
                        </div>

                        {previewData && (
                            <div className="preview-container mb-4">
                                <div className="d-flex align-items-center gap-2 mb-3 text-emerald-700">
                                    <FaEye /> <span className="fw-bold small">Data Preview: {previewData.name}</span>
                                </div>
                                <Table responsive bordered hover className="table-preview bg-white">
                                    <tbody>
                                        {previewData.rows.map((row, rIdx) => (
                                            <tr key={rIdx}>
                                                {row.map((cell, cIdx) => (
                                                    <td key={cIdx}>{cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <p className="text-muted x-small italic text-center mb-0">Preview limited to first 15 rows</p>
                            </div>
                        )}

                        {!resultPdfUrl ? (
                            <Button 
                                className="convert-btn"
                                onClick={convertToPdf}
                                disabled={isConverting}
                            >
                                {isConverting ? <Spinner animation="border" size="sm" className="me-2" /> : <FaFilePdf className="me-2" />}
                                {isConverting ? 'Generating PDF...' : 'Convert to Professional PDF'}
                            </Button>
                        ) : (
                            <div className="fade-in mt-4">
                                <div className="p-3 bg-success bg-opacity-10 text-success rounded-3 mb-4 d-flex align-items-center justify-content-center gap-2 fw-bold">
                                    <FaCheckCircle /> PDF Conversion Complete!
                                </div>
                                <div className="d-flex gap-3">
                                    <Button variant="outline-secondary" className="flex-grow-1 py-3 rounded-4" onClick={() => { setFile(null); setPreviewData(null); setResultPdfUrl(null); }}>
                                        Convert Another
                                    </Button>
                                    <Button variant="success" className="convert-btn flex-grow-1" onClick={downloadPdf}>
                                        <FaDownload className="me-2" /> Download Your PDF
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
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-emerald-600">
                            <FaTable /> Multi-Sheet Support
                        </div>
                        <p className="text-muted small mb-0">Automatically converts every sheet in your Excel workbook into a separate page in the final PDF document.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-emerald-600">
                            <FaFilePdf /> Optimized Layout
                        </div>
                        <p className="text-muted small mb-0">Adjusts column widths and uses landscape orientation to ensure your data tables are readable and professionally formatted.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-emerald-600">
                            <FaCheckCircle /> Smart Parsing
                        </div>
                        <p className="text-muted small mb-0">Supports .xlsx, .xls, and .csv formats with intelligent cell type detection to preserve numbers and dates correctly.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExcelToPdf;
