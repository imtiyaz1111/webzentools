import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import { toast } from "react-hot-toast";
import { 
  FaCloudUploadAlt, FaDownload, FaTrash, FaImage, FaUndo,
  FaFileImage, FaShieldAlt, FaMagic, FaSpinner
} from "react-icons/fa";
import "./BackgroundRemover.css";

const BackgroundRemover = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [originalPreview, setOriginalPreview] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isModelLoading, setIsModelLoading] = useState(true);
    const [model, setModel] = useState(null);
    const [progress, setProgress] = useState(0);

    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);

    const isMounted = useRef(false);

    // Load Model on Mount
    useEffect(() => {
        if (isMounted.current) return;
        isMounted.current = true;

        const loadModel = async () => {
            try {
                // Initialize TFJS
                await tf.ready();
                // Load BodyPix model
                const loadedModel = await bodyPix.load({
                    architecture: 'MobileNetV1',
                    outputStride: 16,
                    multiplier: 0.75,
                    quantBytes: 2
                });
                setModel(loadedModel);
                setIsModelLoading(false);
                toast.success("AI Model loaded successfully!");
            } catch (error) {
                console.error("Model load error:", error);
                toast.error("Failed to load AI model. Please refresh.");
                setIsModelLoading(false);
            }
        };
        loadModel();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            processUpload(file);
        }
    };

    const processUpload = (file) => {
        if (!file.type.startsWith('image/')) {
            toast.error("Please select a valid image file");
            return;
        }

        setSelectedFile(file);
        setProcessedImage(null);
        setProgress(0);
        
        const previewUrl = URL.createObjectURL(file);
        setOriginalPreview(previewUrl);
        toast.success("Image uploaded!");
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            processUpload(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const removeBackground = async () => {
        if (!model || !selectedFile) return;

        setIsProcessing(true);
        setProgress(10);

        try {
            const img = new Image();
            img.src = originalPreview;
            
            await new Promise((resolve) => {
                img.onload = resolve;
            });

            setProgress(30);

            // Set canvas dimensions
            const canvas = canvasRef.current;
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            // Perform segmentation
            const segmentation = await model.segmentPerson(img, {
                flipHorizontal: false,
                internalResolution: 'high',
                segmentationThreshold: 0.7
            });

            setProgress(70);

            // Create image data for the mask
            const imageData = ctx.createImageData(img.width, img.height);
            const { data } = imageData;

            // Draw original image to get pixels
            ctx.drawImage(img, 0, 0);
            const originalData = ctx.getImageData(0, 0, img.width, img.height).data;

            // Apply mask: if pixel is background (segmentation.data[i] == 0), set alpha to 0
            for (let i = 0; i < segmentation.data.length; i++) {
                const n = i * 4;
                data[n] = originalData[n];     // R
                data[n + 1] = originalData[n + 1]; // G
                data[n + 2] = originalData[n + 2]; // B
                data[n + 3] = segmentation.data[i] ? 255 : 0; // A (1 for person, 0 for background)
            }

            ctx.putImageData(imageData, 0, 0);
            
            const resultUrl = canvas.toDataURL('image/png');
            setProcessedImage(resultUrl);
            setProgress(100);
            toast.success("Background removed!");
        } catch (error) {
            console.error("Processing error:", error);
            toast.error("Processing failed. Please try a different image.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!processedImage) return;
        const link = document.createElement("a");
        link.href = processedImage;
        link.download = `no-bg_${selectedFile.name.split('.')[0]}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const reset = () => {
        setSelectedFile(null);
        setOriginalPreview(null);
        setProcessedImage(null);
        setProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="background-remover-container">
            <div className="container py-4">
                <div className="row g-4">
                    {/* LEFT PANEL: UPLOAD & SETTINGS */}
                    <div className="col-lg-4">
                        <div className="premium-card p-4 h-100">
                            <h5 className="fw-bold mb-4 d-flex align-items-center">
                                <FaFileImage className="text-primary me-2" /> Upload Image
                            </h5>

                            {!selectedFile ? (
                                <div 
                                    className={`upload-zone text-center p-5 mb-4 ${isModelLoading ? 'disabled' : ''}`}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onClick={() => !isModelLoading && fileInputRef.current.click()}
                                >
                                    <input 
                                        type="file" 
                                        hidden 
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        disabled={isModelLoading}
                                    />
                                    <div className="upload-icon-wrapper mb-3">
                                        {isModelLoading ? (
                                            <FaSpinner className="display-4 text-primary spin" />
                                        ) : (
                                            <FaCloudUploadAlt className="display-4 text-primary" />
                                        )}
                                    </div>
                                    <p className="mb-0 fw-medium">
                                        {isModelLoading ? "AI Model Loading..." : "Drag & drop image"}
                                    </p>
                                    <p className="small text-muted text-center px-4">
                                        {isModelLoading ? "Please wait while we prepare the tools..." : "Best results with clear foreground subjects"}
                                    </p>
                                </div>
                            ) : (
                                <div className="selected-info p-3 mb-4 glass-card border-primary">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <span className="small text-muted text-truncate me-2">{selectedFile.name}</span>
                                        <button className="btn btn-sm btn-link text-danger p-0" onClick={reset} disabled={isProcessing}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                    <div className="fw-bold">READY TO PROCESS</div>
                                </div>
                            )}

                            <div className="settings-info mb-4">
                                <div className="d-flex align-items-center gap-3 p-3 glass-card mb-3">
                                    <div className="icon-circle bg-primary-soft">
                                        <FaShieldAlt className="text-primary" />
                                    </div>
                                    <div>
                                        <div className="fw-bold small">Privacy Guaranteed</div>
                                        <div className="x-small text-muted">Processing happens on your device</div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-3 p-3 glass-card">
                                    <div className="icon-circle bg-success-soft">
                                        <FaMagic className="text-success" />
                                    </div>
                                    <div>
                                        <div className="fw-bold small">AI Powered</div>
                                        <div className="x-small text-muted">Neural engine detection</div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                className="btn btn-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                                onClick={removeBackground}
                                disabled={!selectedFile || isProcessing || isModelLoading}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Processing {progress}%
                                    </>
                                ) : (
                                    <>
                                        <FaMagic className="small" /> Remove Background
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* RIGHT PANEL: PREVIEW */}
                    <div className="col-lg-8">
                        <div className="premium-card p-4 h-100">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-bold m-0 d-flex align-items-center">
                                    <FaImage className="text-primary me-2" /> Result Preview
                                </h5>
                                {processedImage && (
                                    <button className="btn btn-sm btn-success d-flex align-items-center gap-2 px-3" onClick={handleDownload}>
                                        <FaDownload /> Download PNG
                                    </button>
                                )}
                            </div>

                            {!selectedFile ? (
                                <div className="empty-preview h-100 min-vh-50 d-flex flex-column align-items-center justify-content-center text-center p-5">
                                    <div className="preview-placeholder mb-3">
                                        <FaImage className="display-1 text-muted opacity-25" />
                                    </div>
                                    <h5 className="text-muted">No Image Selected</h5>
                                    <p className="small text-muted">Upload an image to start the magic</p>
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
                                            </div>
                                        </div>

                                        {/* Result */}
                                        <div className="col-md-6">
                                            <div className="preview-box result-box">
                                                <div className="preview-label text-success">Result</div>
                                                {processedImage ? (
                                                    <div className="preview-image-wrapper checkerboard">
                                                        <img src={processedImage} alt="Result" className="img-fluid rounded" />
                                                    </div>
                                                ) : (
                                                    <div className="preview-image-wrapper d-flex align-items-center justify-content-center text-center p-4 bg-dark bg-opacity-25 rounded mt-0">
                                                        <div className="opacity-50">
                                                            {isProcessing ? (
                                                                <>
                                                                    <div className="spinner-border text-primary mb-3" role="status"></div>
                                                                    <p className="small text-muted mb-0">AI is segmenting image...</p>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FaMagic className="mb-2 display-6" />
                                                                    <p className="small text-muted mb-0">Hit 'Remove Background'</p>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* HIDDEN CANVAS FOR PROCESSING */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {/* INFO SECTION */}
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="premium-card p-5">
                            <div className="row g-4 align-items-center">
                                <div className="col-md-7">
                                    <h2 className="fw-bold mb-4">AI Background Removal</h2>
                                    <p className="text-muted" style={{ lineHeight: '1.8' }}>
                                        Our background remover uses state-of-the-art BodyPix neural networks to detect human subjects and separate them from the background with high precision. 
                                        The best part? Everything happens directly in your browser.
                                    </p>
                                    <div className="mt-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="check-icon text-success me-3">✓</div>
                                            <span><strong>Browser Based:</strong> No images are ever uploaded to our servers. Your data stays yours.</span>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="check-icon text-success me-3">✓</div>
                                            <span><strong>High Resolution:</strong> Supports processing at original image dimensions for clear cutouts.</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div className="check-icon text-success me-3">✓</div>
                                            <span><strong>Transparent PNG:</strong> Instant export to PNG format with alpha channel transparency.</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="glass-card p-4 text-center border-primary border-opacity-25">
                                        <div className="display-4 text-primary mb-3">🧠</div>
                                        <h4 className="fw-bold mb-2">Neural Engine</h4>
                                        <p className="small text-muted mb-0">Optimized for people, portraits, and clear subjects.</p>
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

export default BackgroundRemover;
