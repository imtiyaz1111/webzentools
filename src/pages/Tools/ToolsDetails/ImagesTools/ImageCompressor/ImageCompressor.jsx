import React, { useState, useEffect, useCallback, useRef } from "react";
import imageCompression from "browser-image-compression";
import { toast } from "react-hot-toast";
import { 
  FaCloudUploadAlt, FaDownload, FaTrash, 
  FaCheckCircle, FaExclamationTriangle, FaImage, FaUndo,
  FaFileImage, FaArrowRight, FaPercent
} from "react-icons/fa";
import "./ImageCompressor.css";

const ImageCompressor = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [compressedFile, setCompressedFile] = useState(null);
    const [originalPreview, setOriginalPreview] = useState(null);
    const [compressedPreview, setCompressedPreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [quality, setQuality] = useState(0.8);
    const [maxWidth, setMaxWidth] = useState(1920);
    const [stats, setStats] = useState({
        originalSize: 0,
        compressedSize: 0,
        reduction: 0,
        qualityUsed: 0.8
    });

    const fileInputRef = useRef(null);

    const formatSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file) => {
        if (!file.type.startsWith('image/')) {
            toast.error("Please select a valid image file (JPG, PNG, WebP)");
            return;
        }

        setSelectedFile(file);
        setCompressedFile(null);
        setCompressedPreview(null);
        
        const previewUrl = URL.createObjectURL(file);
        setOriginalPreview(previewUrl);
        
        setStats({
            originalSize: file.size,
            compressedSize: 0,
            reduction: 0,
            qualityUsed: quality
        });

        toast.success("Image uploaded!");
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const compressImage = async () => {
        if (!selectedFile) return;

        setIsProcessing(true);
        const options = {
            maxSizeMB: (selectedFile.size / (1024 * 1024)) * quality,
            maxWidthOrHeight: maxWidth,
            useWebWorker: true,
            initialQuality: quality
        };

        try {
            const compressed = await imageCompression(selectedFile, options);
            setCompressedFile(compressed);
            
            const compressedUrl = URL.createObjectURL(compressed);
            setCompressedPreview(compressedUrl);

            const reduction = ((selectedFile.size - compressed.size) / selectedFile.size) * 100;
            
            setStats(prev => ({
                ...prev,
                compressedSize: compressed.size,
                reduction: reduction.toFixed(1),
                qualityUsed: quality
            }));

            toast.success("Image compressed successfully!");
        } catch {
            toast.error("Compression failed. Try adjusting the settings.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!compressedFile) return;
        const link = document.createElement("a");
        link.href = compressedPreview;
        link.download = `compressed_${selectedFile.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Downloading compressed image...");
    };

    const reset = () => {
        setSelectedFile(null);
        setCompressedFile(null);
        setOriginalPreview(null);
        setCompressedPreview(null);
        setStats({
            originalSize: 0,
            compressedSize: 0,
            reduction: 0,
            qualityUsed: 0.8
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        toast.success("Reset successfully!");
    };

    return (
        <div className="image-compressor-container">
            <div className="container py-4">
                <div className="row g-4">
                    {/* LEFT PANEL: UPLOAD & SETTINGS */}
                    <div className="col-lg-4">
                        <div className="premium-card p-4 h-100">
                            <h5 className="fw-bold mb-4 d-flex align-items-center">
                                <FaFileImage className="text-primary me-2" /> Upload & Settings
                            </h5>

                            {!selectedFile ? (
                                <div 
                                    className="upload-zone text-center p-5 mb-4"
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <input 
                                        type="file" 
                                        hidden 
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                    />
                                    <div className="upload-icon-wrapper mb-3">
                                        <FaCloudUploadAlt className="display-4 text-primary" />
                                    </div>
                                    <p className="mb-0 fw-medium">Drag & drop image</p>
                                    <p className="small text-muted">or click to browse</p>
                                </div>
                            ) : (
                                <div className="selected-info p-3 mb-4 glass-card border-primary">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <span className="small text-muted text-truncate me-2">{selectedFile.name}</span>
                                        <button className="btn btn-sm btn-link text-danger p-0" onClick={reset}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                    <div className="fw-bold">{formatSize(selectedFile.size)}</div>
                                </div>
                            )}

                            <div className="settings-group mb-4">
                                <label className="form-label d-flex justify-content-between">
                                    <span className="small fw-bold">Quality</span>
                                    <span className="text-primary small fw-bold">{Math.round(quality * 100)}%</span>
                                </label>
                                <input 
                                    type="range" 
                                    className="form-range premium-range" 
                                    min="0.1" 
                                    max="1.0" 
                                    step="0.05"
                                    value={quality}
                                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                                />
                                <div className="d-flex justify-content-between mt-1">
                                    <span className="x-small text-muted">Faster / Smaller</span>
                                    <span className="x-small text-muted">High Quality</span>
                                </div>
                            </div>

                            <div className="settings-group mb-4">
                                <label className="form-label small fw-bold">Max Dimension (Pixels)</label>
                                <select 
                                    className="form-select premium-select"
                                    value={maxWidth}
                                    onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                                >
                                    <option value="800">800px (Web Optimized)</option>
                                    <option value="1200">1200px (HD)</option>
                                    <option value="1920">1920px (Full HD)</option>
                                    <option value="3840">3840px (4K)</option>
                                    <option value="9999">Original</option>
                                </select>
                            </div>

                            <button 
                                className="btn btn-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                                onClick={compressImage}
                                disabled={!selectedFile || isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Compressing...
                                    </>
                                ) : (
                                    <>
                                        <FaUndo className="small" /> Compress Now
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* RIGHT PANEL: PREVIEW & STATS */}
                    <div className="col-lg-8">
                        <div className="premium-card p-4 h-100">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-bold m-0 d-flex align-items-center">
                                    <FaImage className="text-primary me-2" /> Live Comparison
                                </h5>
                                {compressedFile && (
                                    <button className="btn btn-sm btn-success d-flex align-items-center gap-2" onClick={handleDownload}>
                                        <FaDownload /> Download
                                    </button>
                                )}
                            </div>

                            {!selectedFile ? (
                                <div className="empty-preview h-100 min-vh-50 d-flex flex-column align-items-center justify-content-center text-center p-5">
                                    <div className="preview-placeholder mb-3">
                                        <FaImage className="display-1 text-muted opacity-25" />
                                    </div>
                                    <h5 className="text-muted">No Image Selected</h5>
                                    <p className="small text-muted">Upload an image to see the compression results</p>
                                </div>
                            ) : (
                                <div className="comparison-content h-100">
                                    <div className="row g-4 mb-4">
                                        {/* Original */}
                                        <div className="col-md-6">
                                            <div className="preview-box">
                                                <div className="preview-label">Original</div>
                                                <div className="preview-image-wrapper">
                                                    <img src={originalPreview} alt="Original" className="img-fluid rounded" />
                                                </div>
                                                <div className="preview-footer px-3 py-2 d-flex justify-content-between align-items-center">
                                                    <span className="small">{formatSize(selectedFile.size)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Compressed */}
                                        <div className="col-md-6">
                                            <div className="preview-box">
                                                <div className="preview-label text-success">Compressed</div>
                                                {compressedPreview ? (
                                                    <>
                                                        <div className="preview-image-wrapper">
                                                            <img src={compressedPreview} alt="Compressed" className="img-fluid rounded border-success" />
                                                        </div>
                                                        <div className="preview-footer px-3 py-2 d-flex justify-content-between align-items-center bg-success bg-opacity-10">
                                                            <span className="small fw-bold">{formatSize(compressedFile.size)}</span>
                                                            <span className="badge bg-success">-{stats.reduction}%</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="preview-image-wrapper d-flex align-items-center justify-content-center text-center p-4 bg-dark bg-opacity-25 rounded mt-0">
                                                        <div>
                                                            <FaArrowRight className="mb-2 opacity-50 display-6" />
                                                            <p className="small text-muted mb-0">Hit 'Compress Now' to see result</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* STATS STRIP */}
                                    {compressedFile && (
                                        <div className="stats-strip glass-card p-4 mt-auto">
                                            <div className="row text-center">
                                                <div className="col-4 border-end border-white border-opacity-10">
                                                    <div className="small text-muted mb-1">Old Size</div>
                                                    <div className="h5 fw-bold mb-0">{formatSize(selectedFile.size)}</div>
                                                </div>
                                                <div className="col-4 border-end border-white border-opacity-10">
                                                    <div className="small text-muted mb-1">New Size</div>
                                                    <div className="h5 fw-bold mb-0 text-success">{formatSize(compressedFile.size)}</div>
                                                </div>
                                                <div className="col-4">
                                                    <div className="small text-muted mb-1 d-flex align-items-center justify-content-center gap-1">
                                                        <FaPercent className="x-small" /> Saving
                                                    </div>
                                                    <div className="h5 fw-bold mb-0 text-primary">{stats.reduction}%</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* INFO SECTION */}
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="premium-card p-5">
                            <div className="row g-4 align-items-center">
                                <div className="col-md-7">
                                    <h2 className="fw-bold mb-4">Why Compress Your Images?</h2>
                                    <p className="text-muted" style={{ lineHeight: '1.8' }}>
                                        High-resolution images can be massive, slowing down website load times and consuming unnecessary storage space. 
                                        Our AI-powered image compressor reduces file size while maintaining visual fidelity, so your images look great and load fast.
                                    </p>
                                    <div className="mt-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <FaCheckCircle className="text-success me-3" />
                                            <span><strong>Zero Data Upload:</strong> Everything happens on your device. Your privacy is 100% guaranteed.</span>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                            <FaCheckCircle className="text-success me-3" />
                                            <span><strong>SEO Friendly:</strong> Faster images improve your Google Search rankings.</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <FaCheckCircle className="text-success me-3" />
                                            <span><strong>Smart Resizing:</strong> Automatically scale down massive photos for web use.</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="glass-card p-4 text-center">
                                        <div className="display-1 text-primary mb-3">🚀</div>
                                        <h4 className="fw-bold mb-2">Boost Performance</h4>
                                        <p className="small text-muted mb-0">Ideal for developers, bloggers, and social media managers.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCompressor;
