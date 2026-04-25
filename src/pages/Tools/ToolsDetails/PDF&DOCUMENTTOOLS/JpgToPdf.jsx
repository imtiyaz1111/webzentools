import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Form, Button, Spinner, Table } from 'react-bootstrap';
import { 
    FaImage, FaFilePdf, FaDownload, FaFileUpload, 
    FaCheckCircle, FaTrash, FaArrowUp, FaArrowDown, FaPlus 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const JpgToPdf = () => {
    const [images, setImages] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultPdfUrl, setResultPdfUrl] = useState(null);

    const onFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.filter(file => 
            file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
        ).map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: URL.createObjectURL(file),
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB'
        }));

        if (newImages.length < files.length) {
            toast.error('Some files were skipped. Only JPG and PNG are supported.');
        }

        setImages(prev => [...prev, ...newImages]);
        setResultPdfUrl(null);
    };

    const removeImage = (id) => {
        setImages(prev => prev.filter(img => img.id !== id));
        setResultPdfUrl(null);
    };

    const moveImage = (index, direction) => {
        const newImages = [...images];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= newImages.length) return;
        
        [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
        setImages(newImages);
        setResultPdfUrl(null);
    };

    const generatePdf = async () => {
        if (images.length === 0) return;

        setIsProcessing(true);
        try {
            const pdfDoc = await PDFDocument.create();
            
            for (const imgObj of images) {
                const arrayBuffer = await imgObj.file.arrayBuffer();
                let embeddedImg;
                
                if (imgObj.file.type === 'image/png') {
                    embeddedImg = await pdfDoc.embedPng(arrayBuffer);
                } else {
                    embeddedImg = await pdfDoc.embedJpg(arrayBuffer);
                }

                const { width, height } = embeddedImg.scale(1);
                const page = pdfDoc.addPage([width, height]);
                page.drawImage(embeddedImg, {
                    x: 0,
                    y: 0,
                    width,
                    height,
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            
            setResultPdfUrl(url);
            toast.success('PDF generated successfully!');
        } catch (error) {
            console.error('PDF Generation Error:', error);
            toast.error('An error occurred during PDF generation.');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadPdf = () => {
        if (!resultPdfUrl) return;
        const link = document.createElement('a');
        link.href = resultPdfUrl;
        link.download = `images_to_pdf_${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="jpg-to-pdf-container py-4">
            <style>{`
                .jpg-to-pdf-container {
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
                    border-color: #4299e1;
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
                .image-table {
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid #edf2f7;
                    margin-bottom: 2rem;
                }
                .image-preview-small {
                    width: 50px;
                    height: 50px;
                    object-fit: cover;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                }
                .btn-generate {
                    background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
                    border: none;
                    padding: 1rem 2.5rem;
                    font-weight: 700;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(66, 153, 225, 0.3);
                    transition: all 0.3s;
                }
                .btn-generate:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(66, 153, 225, 0.4);
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
                        <FaImage size={28} style={{ color: '#4299e1' }} />
                    </div>
                    <div>
                        <h2 className="h4 fw-bold mb-1" style={{ color: '#1a202c' }}>JPG to PDF Converter</h2>
                        <p className="text-muted mb-0 small">Convert multiple images into a single professional PDF document.</p>
                    </div>
                </div>

                <div className="upload-zone">
                    <input type="file" multiple accept="image/jpeg,image/png" onChange={onFileChange} />
                    <FaFileUpload size={48} className="mb-3" style={{ color: '#4299e1' }} />
                    <h5 className="fw-bold mb-2">Upload Images</h5>
                    <p className="text-muted small mb-0">Select JPG or PNG files (Drag & Drop supported)</p>
                </div>

                {images.length > 0 && (
                    <div className="image-table fade-in">
                        <Table responsive hover className="mb-0 align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Preview</th>
                                    <th>File Name</th>
                                    <th>Size</th>
                                    <th className="text-center">Order</th>
                                    <th className="text-end pe-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {images.map((img, index) => (
                                    <tr key={img.id}>
                                        <td className="ps-4">
                                            <img src={img.preview} alt="preview" className="image-preview-small" />
                                        </td>
                                        <td className="fw-medium text-dark">{img.name}</td>
                                        <td className="text-muted small">{img.size}</td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button variant="light" size="sm" onClick={() => moveImage(index, -1)} disabled={index === 0}>
                                                    <FaArrowUp size={12} />
                                                </Button>
                                                <Button variant="light" size="sm" onClick={() => moveImage(index, 1)} disabled={index === images.length - 1}>
                                                    <FaArrowDown size={12} />
                                                </Button>
                                            </div>
                                        </td>
                                        <td className="text-end pe-4">
                                            <Button variant="link" className="text-danger p-0" onClick={() => removeImage(img.id)}>
                                                <FaTrash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}

                <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                    {!resultPdfUrl ? (
                        <Button 
                            className="btn-generate text-white d-flex align-items-center justify-content-center gap-2"
                            onClick={generatePdf}
                            disabled={images.length === 0 || isProcessing}
                        >
                            {isProcessing ? <Spinner animation="border" size="sm" /> : <FaFilePdf />}
                            {isProcessing ? 'Generating PDF...' : 'Convert to PDF Now'}
                        </Button>
                    ) : (
                        <>
                            <Button 
                                variant="outline-primary" 
                                style={{ borderRadius: '12px', padding: '1rem 2rem' }}
                                onClick={() => { setImages([]); setResultPdfUrl(null); }}
                            >
                                Start New
                            </Button>
                            <Button 
                                className="btn-generate text-white d-flex align-items-center justify-content-center gap-2"
                                onClick={downloadPdf}
                            >
                                <FaDownload /> Download PDF
                            </Button>
                        </>
                    )}
                </div>

                {resultPdfUrl && (
                    <div className="mt-4 p-3 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-4 d-flex align-items-center gap-3 fade-in">
                        <FaCheckCircle className="text-success" size={20} />
                        <span className="text-success fw-bold">Your images have been converted to PDF!</span>
                    </div>
                )}
            </div>

            <div className="how-it-works main-card fade-in">
                <h4 className="fw-bold mb-4">How to Convert JPG to PDF</h4>
                <div className="row g-4 text-center">
                    <div className="col-md-4">
                        <div className="p-3">
                            <div className="step-number mb-2 fw-bold text-primary h4">1</div>
                            <h6 className="fw-bold">Upload Images</h6>
                            <p className="text-muted small">Select one or more JPG/PNG images from your device.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3">
                            <div className="step-number mb-2 fw-bold text-primary h4">2</div>
                            <h6 className="fw-bold">Arrange Order</h6>
                            <p className="text-muted small">Use the up/down arrows to set the order of pages in your PDF.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3">
                            <div className="step-number mb-2 fw-bold text-primary h4">3</div>
                            <h6 className="fw-bold">Download PDF</h6>
                            <p className="text-muted small">Click convert and download your perfectly formatted PDF document.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JpgToPdf;
