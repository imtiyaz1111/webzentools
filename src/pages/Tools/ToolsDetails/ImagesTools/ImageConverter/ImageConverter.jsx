import React, { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { 
  FaCloudUploadAlt, FaDownload, FaTrash, FaImage, FaExchangeAlt,
  FaFileImage, FaCheckCircle, FaCogs, FaInfoCircle
} from "react-icons/fa";
import "./ImageConverter.css";

const FORMATS = [
    { id: "image/jpeg", label: "JPEG", ext: "jpg" },
    { id: "image/png", label: "PNG", ext: "png" },
    { id: "image/webp", label: "WebP", ext: "webp" },
];

const ImageConverter = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [originalPreview, setOriginalPreview] = useState(null);
    const [convertedPreview, setConvertedPreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Settings
    const [targetFormat, setTargetFormat] = useState("image/png");
    const [quality, setQuality] = useState(0.9);
    const [bgColor, setBgColor] = useState("#ffffff");
    const [isTransparent, setIsTransparent] = useState(true);

    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) processUpload(file);
    };

    const processUpload = (file) => {
        if (!file.type.startsWith('image/')) {
            toast.error("Please select a valid image file");
            return;
        }

        setSelectedFile(file);
        setConvertedPreview(null);
        
        const url = URL.createObjectURL(file);
        setOriginalPreview(url);
        
        // Auto-select a different target format than source
        const otherFormat = FORMATS.find(f => f.id !== file.type);
        if (otherFormat) setTargetFormat(otherFormat.id);

        toast.success("Image uploaded!");
    };

    const handleConvert = async () => {
        if (!selectedFile) return;
        setIsProcessing(true);

        const img = new Image();
        img.src = originalPreview;

        img.onload = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;

            // Handle background for formats that don't support transparency (JPEG)
            if (targetFormat === "image/jpeg" || !isTransparent) {
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0);

            const resultUrl = canvas.toDataURL(targetFormat, quality);
            setConvertedPreview(resultUrl);
            setIsProcessing(false);
            toast.success("Conversion complete!");
        };

        img.onerror = () => {
            toast.error("Failed to process image");
            setIsProcessing(false);
        };
    };

    const handleDownload = () => {
        if (!convertedPreview) return;
        const link = document.createElement("a");
        const format = FORMATS.find(f => f.id === targetFormat);
        link.href = convertedPreview;
        link.download = `converted_${selectedFile.name.split('.')[0]}.${format.ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const reset = () => {
        setSelectedFile(null);
        setOriginalPreview(null);
        setConvertedPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div className="image-converter-tech">
            <div className="container py-5">
                <div className="row g-4">
                    {/* LEFT: CONFIGURE */}
                    <div className="col-lg-5">
                        <div className="tech-card p-4">
                            <div className="card-header-gradient mb-4">
                                <h5 className="m-0 fw-bold d-flex align-items-center">
                                    <FaCogs className="me-2 text-primary" /> CONVERSION PARAMS
                                </h5>
                                <p className="x-small text-muted mb-0 mt-1">Configure output encoding and substrate</p>
                            </div>

                            {!selectedFile ? (
                                <div className="tech-upload-zone mb-4" onClick={() => fileInputRef.current.click()}>
                                    <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                                    <FaCloudUploadAlt className="display-4 text-primary mb-3" />
                                    <h6 className="fw-bold">INITIALIZE SOURCE</h6>
                                    <p className="x-small text-muted mb-0">Direct image payload injection</p>
                                </div>
                            ) : (
                                <div className="tech-file-info mb-4">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <FaFileImage className="text-primary me-2" />
                                            <span className="small fw-medium text-truncate" style={{ maxWidth: '180px' }}>{selectedFile.name}</span>
                                        </div>
                                        <button className="btn-icon text-danger" onClick={reset}><FaTrash /></button>
                                    </div>
                                    <div className="mt-2 pt-2 border-top border-white border-opacity-10 d-flex justify-content-between">
                                        <span className="x-small text-muted">SOURCE FORMAT:</span>
                                        <span className="x-small fw-bold text-primary">{selectedFile.type.split('/')[1].toUpperCase()}</span>
                                    </div>
                                </div>
                            )}

                            {/* TARGET FORMAT */}
                            <div className="tech-section mb-4">
                                <div className="tech-label-group">
                                    <FaExchangeAlt className="text-primary" />
                                    <span>TARGET ENCODING</span>
                                </div>
                                <div className="tech-radio-group">
                                    {FORMATS.map(f => (
                                        <button 
                                            key={f.id} 
                                            className={`tech-radio-btn ${targetFormat === f.id ? 'active' : ''}`}
                                            onClick={() => setTargetFormat(f.id)}
                                            disabled={!selectedFile}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* QUALITY (If applicable) */}
                            {targetFormat !== "image/png" && (
                                <div className="tech-section mb-4">
                                    <div className="tech-label-group">
                                        <FaInfoCircle className="text-warning" />
                                        <span>ENCODING QUALITY: {Math.round(quality * 100)}%</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        className="form-range tech-range"
                                        min="0.1" max="1" step="0.05"
                                        value={quality}
                                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                                        disabled={!selectedFile}
                                    />
                                </div>
                            )}

                            {/* TRANSPARENCY HANDLING */}
                            {targetFormat === "image/jpeg" && (
                                <div className="tech-section mb-4">
                                    <div className="tech-label-group">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="color-preview" style={{ backgroundColor: bgColor }}></div>
                                            <span>BACKGROUND FILL</span>
                                        </div>
                                    </div>
                                    <input 
                                        type="color" 
                                        className="form-control form-control-color w-100 tech-color-input"
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        disabled={!selectedFile}
                                    />
                                    <p className="x-small text-muted mt-2 mb-0">Used to fill transparent areas in JPEG output</p>
                                </div>
                            )}

                            <button 
                                className="tech-main-btn w-100 mt-2"
                                onClick={handleConvert}
                                disabled={!selectedFile || isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        TRANSMUTING DATA...
                                    </>
                                ) : (
                                    <>START CONVERSION PROCESS</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: PREVIEW */}
                    <div className="col-lg-7">
                        <div className="tech-card h-100 p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-white border-opacity-10">
                                <h5 className="m-0 fw-bold">ENCODED BUFFER PREVIEW</h5>
                                {convertedPreview && (
                                    <button className="tech-download-btn" onClick={handleDownload}>
                                        <FaDownload className="me-2" /> DOWNLOAD RESULT
                                    </button>
                                )}
                            </div>

                            {!selectedFile ? (
                                <div className="tech-empty-state">
                                    <FaImage className="opacity-10 display-1 mb-3" />
                                    <p className="text-muted">SOURCE RECEPTACLE EMPTY</p>
                                </div>
                            ) : (
                                <div className="tech-output-container">
                                    <div className="tech-preview-window checkerboard">
                                        <img src={convertedPreview || originalPreview} alt="Converter Preview" className="img-fluid" />
                                        {isProcessing && (
                                            <div className="tech-overlay-processing">
                                                <div className="spinner-grow text-primary"></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* CONVERSION STATS */}
                                    <div className="tech-stats mt-4">
                                        <div className="stats-row">
                                            <span className="label">SOURCE MAGNITUDE</span>
                                            <span className="value">{formatSize(selectedFile.size)}</span>
                                        </div>
                                        <div className="stats-row highlight">
                                            <span className="label">TARGET PROTOCOL</span>
                                            <span className="value">{targetFormat.split('/')[1].toUpperCase()}</span>
                                        </div>
                                        {convertedPreview && (
                                            <div className="stats-row success">
                                                <span className="label">STATUS</span>
                                                <span className="value"><FaCheckCircle className="me-1" /> OPTIMIZED & READY</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {/* INFO SECTION */}
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="tech-card p-5">
                            <div className="row g-4 align-items-center">
                                <div className="col-md-8">
                                    <h3 className="fw-bold mb-4">Technical Image Transmutation</h3>
                                    <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
                                        Our converter uses the browser's low-level canvas rendering engine to re-encode image data between different mime-types. 
                                        By processing everything locally, we eliminate data latency and ensure absolute privacy.
                                    </p>
                                    <div className="row g-3">
                                        <div className="col-sm-6">
                                            <div className="tech-spec-item">
                                                <div className="dot"></div>
                                                <span><strong>Format Support:</strong> JPG, PNG, WEBP, and more.</span>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="tech-spec-item">
                                                <div className="dot"></div>
                                                <span><strong>Privacy:</strong> Zero-server data exposure logic.</span>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="tech-spec-item">
                                                <div className="dot"></div>
                                                <span><strong>Alpha Channel:</strong> Intelligent transparency preservation.</span>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="tech-spec-item">
                                                <div className="dot"></div>
                                                <span><strong>Interpolation:</strong> High-fidelity pixel resampling.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="tech-info-box p-4 text-center">
                                        <div className="display-4 text-primary mb-3">⚡</div>
                                        <h5 className="fw-bold">No Limits</h5>
                                        <p className="x-small text-muted">Free, infinite conversions with no watermarks or registrations needed.</p>
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

export default ImageConverter;
