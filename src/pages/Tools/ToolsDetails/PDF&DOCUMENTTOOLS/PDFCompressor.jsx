import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Form, Button, Spinner, ProgressBar } from 'react-bootstrap';
import { 
    FaFilePdf, FaCompressArrowsAlt, FaDownload, FaFileUpload, 
    FaCheckCircle, FaArrowRight, FaInfoCircle, FaWeightHanging 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const PDFCompressor = () => {
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultPdf, setResultPdf] = useState(null);
    const [compressionLevel, setCompressionLevel] = useState('recommended');

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            toast.error('Only PDF files are allowed.');
            return;
        }

        setFile(selectedFile);
        setResultPdf(null);
        toast.success('PDF uploaded successfully!');
    };

    const compressPdf = async () => {
        if (!file) return;

        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            
            // Basic optimization: Re-saving with object streams
            // For a more advanced version, we would downsample images, but that requires
            // deep manipulation of the PDF structure.
            
            // Optimization steps:
            // 1. Remove metadata (Optional, based on level)
            if (compressionLevel === 'extreme') {
                pdfDoc.setTitle('');
                pdfDoc.setAuthor('');
                pdfDoc.setSubject('');
                pdfDoc.setKeywords([]);
                pdfDoc.setProducer('');
                pdfDoc.setCreator('');
            }

            // 2. Save with object streams which compresses the PDF structure
            const compressedPdfBytes = await pdfDoc.save({
                useObjectStreams: true,
                addDefaultPage: false
            });

            const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            
            // Calculate saving percentage
            const originalSize = file.size;
            const compressedSize = compressedPdfBytes.length;
            const saving = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

            setResultPdf({
                url,
                size: (compressedSize / 1024 / 1024).toFixed(2) + ' MB',
                saving: saving > 0 ? saving : 0
            });

            toast.success('PDF optimized successfully!');
        } catch (error) {
            console.error('Compression Error:', error);
            toast.error('An error occurred during optimization.');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadCompressedPdf = () => {
        if (!resultPdf) return;
        const link = document.createElement('a');
        link.href = resultPdf.url;
        link.download = `optimized_${file.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatSize = (bytes) => (bytes / 1024 / 1024).toFixed(2) + ' MB';

    return (
        <div className="pdf-compressor-container py-4">
            <style>{`
                .pdf-compressor-container {
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
                    border-color: #38a169;
                    background: #f0fff4;
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
                .level-selector {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                    margin-bottom: 2rem;
                }
                .level-card {
                    padding: 1.2rem;
                    border: 2px solid #edf2f7;
                    border-radius: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: center;
                }
                .level-card.active {
                    border-color: #38a169;
                    background: #f0fff4;
                }
                .level-card h6 {
                    font-weight: 800;
                    margin-bottom: 5px;
                    color: #2d3748;
                }
                .level-card p {
                    font-size: 0.75rem;
                    color: #718096;
                    margin-bottom: 0;
                }
                .btn-compress {
                    background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
                    border: none;
                    padding: 1rem 2.5rem;
                    font-weight: 700;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(56, 161, 105, 0.3);
                    transition: all 0.3s;
                }
                .btn-compress:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(56, 161, 105, 0.4);
                }
                .comparison-card {
                    background: #f8fafc;
                    border: 1px solid #edf2f7;
                    border-radius: 20px;
                    padding: 1.5rem;
                    margin-top: 2rem;
                }
                .size-box {
                    flex: 1;
                    padding: 1rem;
                    background: white;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    text-align: center;
                }
                .saving-badge {
                    background: #c6f6d5;
                    color: #22543d;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-weight: 800;
                    font-size: 0.85rem;
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
                    <div className="p-3 rounded-4" style={{ background: '#f0fff4' }}>
                        <FaCompressArrowsAlt size={28} style={{ color: '#38a169' }} />
                    </div>
                    <div>
                        <h2 className="h4 fw-bold mb-1" style={{ color: '#1a202c' }}>PDF Compressor</h2>
                        <p className="text-muted mb-0 small">Reduce PDF file size without significant quality loss.</p>
                    </div>
                </div>

                {!file ? (
                    <div className="upload-zone">
                        <input type="file" accept=".pdf" onChange={onFileChange} />
                        <FaFileUpload size={48} className="mb-3" style={{ color: '#38a169' }} />
                        <h5 className="fw-bold mb-2">Upload PDF to Compress</h5>
                        <p className="text-muted small mb-0">Select a large PDF file to optimize</p>
                    </div>
                ) : (
                    <div className="file-info fade-in p-3 border rounded-4 mb-4 d-flex align-items-center justify-content-between bg-light">
                        <div className="d-flex align-items-center gap-3">
                            <FaFilePdf size={32} color="#e53e3e" />
                            <div>
                                <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '300px' }}>{file.name}</div>
                                <div className="text-muted small">{formatSize(file.size)}</div>
                            </div>
                        </div>
                        <Button variant="link" className="text-danger p-0 fw-bold" onClick={() => { setFile(null); setResultPdf(null); }}>
                            Change
                        </Button>
                    </div>
                )}

                {file && !resultPdf && (
                    <>
                        <h6 className="fw-bold mb-3">Select Compression Level</h6>
                        <div className="level-selector">
                            <div 
                                className={`level-card ${compressionLevel === 'basic' ? 'active' : ''}`}
                                onClick={() => setCompressionLevel('basic')}
                            >
                                <h6>Basic</h6>
                                <p>Standard optimization</p>
                            </div>
                            <div 
                                className={`level-card ${compressionLevel === 'recommended' ? 'active' : ''}`}
                                onClick={() => setCompressionLevel('recommended')}
                            >
                                <h6>Recommended</h6>
                                <p>Best balance</p>
                            </div>
                            <div 
                                className={`level-card ${compressionLevel === 'extreme' ? 'active' : ''}`}
                                onClick={() => setCompressionLevel('extreme')}
                            >
                                <h6>Extreme</h6>
                                <p>Highest compression</p>
                            </div>
                        </div>

                        <Button 
                            className="btn-compress w-100 text-white d-flex align-items-center justify-content-center gap-2"
                            onClick={compressPdf}
                            disabled={isProcessing}
                        >
                            {isProcessing ? <Spinner animation="border" size="sm" /> : <FaCompressArrowsAlt />}
                            {isProcessing ? 'Optimizing PDF Structure...' : 'Compress PDF Now'}
                        </Button>
                    </>
                )}

                {resultPdf && (
                    <div className="comparison-card fade-in">
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <h5 className="fw-bold mb-0">Compression Complete!</h5>
                            <span className="saving-badge">Saved {resultPdf.saving}%</span>
                        </div>
                        
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div className="size-box">
                                <div className="text-muted small mb-1">Original Size</div>
                                <div className="fw-bold text-danger">{formatSize(file.size)}</div>
                            </div>
                            <FaArrowRight className="text-muted" />
                            <div className="size-box">
                                <div className="text-muted small mb-1">Optimized Size</div>
                                <div className="fw-bold text-success">{resultPdf.size}</div>
                            </div>
                        </div>

                        <div className="d-flex gap-3">
                            <Button 
                                variant="outline-success" 
                                className="flex-grow-1"
                                style={{ borderRadius: '12px', padding: '1rem' }}
                                onClick={() => { setResultPdf(null); }}
                            >
                                Compress Another
                            </Button>
                            <Button 
                                className="btn-compress flex-grow-1 text-white d-flex align-items-center justify-content-center gap-2"
                                onClick={downloadCompressedPdf}
                            >
                                <FaDownload /> Download Compressed PDF
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="how-it-works main-card fade-in">
                <h4 className="fw-bold mb-4">Why use our PDF Compressor?</h4>
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="p-3">
                            <div className="h6 fw-bold mb-2 d-flex align-items-center gap-2">
                                <FaWeightHanging color="#38a169" /> Structure Optimization
                            </div>
                            <p className="text-muted small">We reorganize the internal structure of your PDF to remove redundant data without losing content.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3">
                            <div className="h6 fw-bold mb-2 d-flex align-items-center gap-2">
                                <FaInfoCircle color="#38a169" /> Privacy First
                            </div>
                            <p className="text-muted small">All processing is done 100% locally in your browser. Your documents never touch our servers.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3">
                            <div className="h6 fw-bold mb-2 d-flex align-items-center gap-2">
                                <FaCheckCircle color="#38a169" /> Email Ready
                            </div>
                            <p className="text-muted small">Optimized PDFs are perfect for email attachments and faster web loading.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFCompressor;
