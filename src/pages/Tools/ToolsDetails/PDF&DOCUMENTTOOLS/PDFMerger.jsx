import React, { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Form, Button, Spinner, Table } from 'react-bootstrap';
import { 
    FaFilePdf, FaPlus, FaTrash, FaArrowUp, FaArrowDown, 
    FaLink, FaDownload, FaFileUpload, FaCheckCircle 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const PDFMerger = () => {
    const [files, setFiles] = useState([]);
    const [isMerging, setIsMerging] = useState(false);
    const [mergedPdfUrl, setMergedPdfUrl] = useState(null);

    const onFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
        
        if (pdfFiles.length !== selectedFiles.length) {
            toast.error('Some files were skipped. Only PDF files are allowed.');
        }

        if (pdfFiles.length > 0) {
            const newFiles = pdfFiles.map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                file,
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
            }));
            setFiles(prev => [...prev, ...newFiles]);
            setMergedPdfUrl(null);
            toast.success(`${pdfFiles.length} PDF(s) added!`);
        }
    };

    const removeFile = (id) => {
        setFiles(prev => prev.filter(f => f.id !== id));
        setMergedPdfUrl(null);
    };

    const moveFile = (index, direction) => {
        const newFiles = [...files];
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < newFiles.length) {
            [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
            setFiles(newFiles);
            setMergedPdfUrl(null);
        }
    };

    const mergePdfs = async () => {
        if (files.length < 2) {
            toast.error('Please add at least 2 PDF files to merge.');
            return;
        }

        setIsMerging(true);
        try {
            const mergedPdf = await PDFDocument.create();
            
            for (const fileObj of files) {
                const arrayBuffer = await fileObj.file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            
            setMergedPdfUrl(url);
            toast.success('PDFs merged successfully!');
        } catch (error) {
            console.error('Merge Error:', error);
            toast.error('An error occurred while merging PDFs.');
        } finally {
            setIsMerging(false);
        }
    };

    const downloadMergedPdf = () => {
        if (!mergedPdfUrl) return;
        const link = document.createElement('a');
        link.href = mergedPdfUrl;
        link.download = 'merged_document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="pdf-merger-container py-4">
            <style>{`
                .pdf-merger-container {
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
                    border-color: #3182ce;
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
                .file-list-card {
                    background: #ffffff;
                    border: 1px solid #edf2f7;
                    border-radius: 20px;
                    overflow: hidden;
                    margin-bottom: 2rem;
                }
                .premium-table th {
                    background: #f7fafc;
                    color: #4a5568;
                    font-weight: 700;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    letter-spacing: 0.05em;
                    padding: 1rem;
                    border: none;
                }
                .premium-table td {
                    padding: 1rem;
                    vertical-align: middle;
                    border-bottom: 1px solid #f7fafc;
                }
                .file-icon {
                    color: #e53e3e;
                    font-size: 1.5rem;
                }
                .action-btn {
                    width: 32px;
                    height: 32px;
                    padding: 0;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    margin: 0 4px;
                    transition: all 0.2s;
                }
                .btn-merge {
                    background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
                    border: none;
                    padding: 1rem 2.5rem;
                    font-weight: 700;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(49, 130, 206, 0.3);
                    transition: all 0.3s;
                }
                .btn-merge:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(49, 130, 206, 0.4);
                }
                .btn-download {
                    background: linear-gradient(135deg, #48bb78 0%, #2f855a 100%);
                    border: none;
                    padding: 1rem 2.5rem;
                    font-weight: 700;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
                    transition: all 0.3s;
                }
                .btn-download:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(72, 187, 120, 0.4);
                }
                .fade-in {
                    animation: fadeIn 0.4s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .empty-state {
                    color: #a0aec0;
                    padding: 3rem;
                }
            `}</style>

            <div className="main-card fade-in">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="p-3 rounded-4" style={{ background: '#fff5f5' }}>
                        <FaFilePdf size={28} style={{ color: '#e53e3e' }} />
                    </div>
                    <div>
                        <h2 className="h4 fw-bold mb-1" style={{ color: '#1a202c' }}>PDF Merger</h2>
                        <p className="text-muted mb-0 small">Combine multiple PDF files into one professional document securely.</p>
                    </div>
                </div>

                <div className="upload-zone">
                    <input type="file" multiple accept=".pdf" onChange={onFileChange} />
                    <FaFileUpload size={48} className="mb-3 text-primary" />
                    <h5 className="fw-bold mb-2">Click or Drag PDFs here</h5>
                    <p className="text-muted small mb-0">Select 2 or more PDF files to combine</p>
                </div>

                {files.length > 0 && (
                    <div className="file-list-card fade-in">
                        <Table responsive className="premium-table mb-0">
                            <thead>
                                <tr>
                                    <th style={{ width: '50px' }}>#</th>
                                    <th>File Name</th>
                                    <th>Size</th>
                                    <th className="text-center">Reorder</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {files.map((fileObj, index) => (
                                    <tr key={fileObj.id}>
                                        <td className="fw-bold text-muted">{index + 1}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <FaFilePdf className="file-icon" />
                                                <span className="fw-semibold text-dark">{fileObj.name}</span>
                                            </div>
                                        </td>
                                        <td className="text-muted small">{fileObj.size}</td>
                                        <td className="text-center">
                                            <Button 
                                                variant="light" 
                                                className="action-btn"
                                                disabled={index === 0}
                                                onClick={() => moveFile(index, -1)}
                                            >
                                                <FaArrowUp size={12} />
                                            </Button>
                                            <Button 
                                                variant="light" 
                                                className="action-btn"
                                                disabled={index === files.length - 1}
                                                onClick={() => moveFile(index, 1)}
                                            >
                                                <FaArrowDown size={12} />
                                            </Button>
                                        </td>
                                        <td className="text-end">
                                            <Button 
                                                variant="outline-danger" 
                                                className="action-btn"
                                                onClick={() => removeFile(fileObj.id)}
                                            >
                                                <FaTrash size={12} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}

                {files.length === 0 && (
                    <div className="text-center empty-state border rounded-4 mb-4">
                        <FaLink size={40} className="mb-3 opacity-20" />
                        <p className="mb-0 fw-medium">No files selected. Start by uploading some PDFs!</p>
                    </div>
                )}

                <div className="d-flex flex-column flex-md-row gap-3 justify-content-center mt-4">
                    {!mergedPdfUrl ? (
                        <Button 
                            className="btn-merge text-white d-flex align-items-center justify-content-center gap-2"
                            onClick={mergePdfs}
                            disabled={files.length < 2 || isMerging}
                        >
                            {isMerging ? <Spinner animation="border" size="sm" /> : <FaPlus />}
                            {isMerging ? 'Merging Documents...' : 'Merge PDFs Now'}
                        </Button>
                    ) : (
                        <>
                            <Button 
                                className="btn-merge text-white d-flex align-items-center justify-content-center gap-2"
                                onClick={() => { setMergedPdfUrl(null); }}
                            >
                                <FaPlus /> Start New Merge
                            </Button>
                            <Button 
                                className="btn-download text-white d-flex align-items-center justify-content-center gap-2"
                                onClick={downloadMergedPdf}
                            >
                                <FaDownload /> Download Merged PDF
                            </Button>
                        </>
                    )}
                </div>

                {mergedPdfUrl && (
                    <div className="mt-4 p-3 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-4 d-flex align-items-center gap-3">
                        <FaCheckCircle className="text-success" size={20} />
                        <span className="text-success fw-bold">Success! Your PDF is ready for download.</span>
                    </div>
                )}
            </div>

            <div className="how-it-works main-card fade-in">
                <h4 className="fw-bold mb-4">How it Works</h4>
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="p-3">
                            <div className="h5 fw-bold text-primary mb-2">1. Upload</div>
                            <p className="text-muted small">Select the PDF files you want to combine from your device.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3">
                            <div className="h5 fw-bold text-primary mb-2">2. Organize</div>
                            <p className="text-muted small">Use the arrows to arrange the files in the order you want them to appear.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3">
                            <div className="h5 fw-bold text-primary mb-2">3. Merge</div>
                            <p className="text-muted small">Click merge and download your new combined PDF instantly.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFMerger;
