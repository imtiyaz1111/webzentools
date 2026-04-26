import React, { useState, useRef, useCallback } from "react";
import imageCompression from "browser-image-compression";
import { toast } from "react-hot-toast";
import { 
  FaCloudUploadAlt, FaDownload, FaTrash, FaImage, FaUndo,
  FaFileImage, FaExpandArrowsAlt, FaLink, FaUnlink, FaInstagram, 
  FaFacebook, FaYoutube, FaHdd, FaCogs,
  FaArrowRight, FaCheckCircle
} from "react-icons/fa";
import "./ImageResizer.css";

const PRESETS = [
    { name: "Instagram Post", width: 1080, height: 1080, icon: FaInstagram },
    { name: "Instagram Story", width: 1080, height: 1920, icon: FaInstagram },
    { name: "FB Post", width: 1200, height: 630, icon: FaFacebook },
    { name: "YouTube", width: 1280, height: 720, icon: FaYoutube },
];

const KB_PRESETS = [50, 100, 200, 500];

const ImageResizer = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [originalPreview, setOriginalPreview] = useState(null);
    const [resizedFile, setResizedFile] = useState(null);
    const [resizedPreview, setResizedPreview] = useState(null);
    
    // Settings
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
    const [lockAspectRatio, setLockAspectRatio] = useState(true);
    const [aspectRatio, setAspectRatio] = useState(1);
    const [targetKB, setTargetKB] = useState("");
    const [outputFormat, setOutputFormat] = useState("image/jpeg");
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [stats, setStats] = useState({
        originalSize: 0,
        resizedSize: 0,
        reduction: 0
    });

    const fileInputRef = useRef(null);

    const formatSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

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
        setResizedFile(null);
        setResizedPreview(null);
        
        const url = URL.createObjectURL(file);
        setOriginalPreview(url);
        
        const img = new Image();
        img.onload = () => {
            setOriginalDimensions({ width: img.width, height: img.height });
            setDimensions({ width: img.width, height: img.height });
            setAspectRatio(img.width / img.height);
            setStats({ originalSize: file.size, resizedSize: 0, reduction: 0 });
            toast.success("Image uploaded!");
        };
        img.src = url;
    };

    const handleDimensionChange = (e) => {
        const { name, value } = e.target;
        const val = parseInt(value) || 0;

        if (name === "width") {
            const newHeight = lockAspectRatio ? Math.round(val / aspectRatio) : dimensions.height;
            setDimensions({ width: val, height: newHeight });
        } else {
            const newWidth = lockAspectRatio ? Math.round(val * aspectRatio) : dimensions.width;
            setDimensions({ width: newWidth, height: val });
        }
    };

    const applyPreset = (preset) => {
        setDimensions({ width: preset.width, height: preset.height });
        setLockAspectRatio(false);
    };

    const handleProcess = async () => {
        if (!selectedFile) return;
        setIsProcessing(true);

        try {
            const options = {
                maxWidthOrHeight: Math.max(dimensions.width, dimensions.height),
                useWebWorker: true,
                fileType: outputFormat,
            };

            if (targetKB) {
                options.maxSizeMB = parseInt(targetKB) / 1024;
            }

            const compressedBlob = await imageCompression(selectedFile, options);
            
            // If the blob name is missing, use original with new extension
            const fileName = `resized_${selectedFile.name.split('.')[0]}.${outputFormat.split('/')[1]}`;
            const finalFile = new File([compressedBlob], fileName, { type: outputFormat });

            setResizedFile(finalFile);
            setResizedPreview(URL.createObjectURL(finalFile));
            
            setStats(prev => ({
                ...prev,
                resizedSize: finalFile.size,
                reduction: ((prev.originalSize - finalFile.size) / prev.originalSize * 100).toFixed(1)
            }));

            toast.success("Image processed successfully!");
        } catch {
            toast.error("Processing failed. Try adjusting settings.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!resizedPreview) return;
        const link = document.createElement("a");
        link.href = resizedPreview;
        link.download = resizedFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const reset = () => {
        setSelectedFile(null);
        setOriginalPreview(null);
        setResizedFile(null);
        setResizedPreview(null);
        setTargetKB("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="image-resizer-fixed">
            <div className="container py-5">
                <div className="row g-4">
                    {/* LEFT: SETTINGS (Technical UI) */}
                    <div className="col-lg-5">
                        <div className="tech-card p-4">
                            <div className="card-header-gradient mb-4">
                                <h5 className="m-0 fw-bold d-flex align-items-center">
                                    <FaCogs className="me-2 text-primary" /> CONFIGURE PARAMETERS
                                </h5>
                                <p className="x-small text-muted mb-0 mt-1">Adjust dimensions and target file metrics</p>
                            </div>

                            {!selectedFile ? (
                                <div className="tech-upload-zone mb-4" onClick={() => fileInputRef.current.click()}>
                                    <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                                    <FaCloudUploadAlt className="display-4 text-primary mb-3" />
                                    <h6 className="fw-bold">LOAD IMAGE CORE</h6>
                                    <p className="x-small text-muted mb-0">Drag payload or click to select</p>
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
                                        <span className="x-small text-muted">INPUT SIZE:</span>
                                        <span className="x-small fw-bold text-primary">{formatSize(selectedFile.size)}</span>
                                    </div>
                                </div>
                            )}

                            {/* SECTION: DIMENSIONS */}
                            <div className="tech-section mb-4">
                                <div className="tech-label-group">
                                    <FaExpandArrowsAlt className="text-primary" />
                                    <span>RESOLUTION CONTROL</span>
                                </div>
                                <div className="row g-2">
                                    <div className="col-5">
                                        <div className="tech-input-box">
                                            <label>WIDTH</label>
                                            <input type="number" name="width" value={dimensions.width} onChange={handleDimensionChange} disabled={!selectedFile} />
                                        </div>
                                    </div>
                                    <div className="col-2 d-flex align-items-center justify-content-center">
                                        <button 
                                            className={`tech-link-btn ${lockAspectRatio ? 'active' : ''}`}
                                            onClick={() => setLockAspectRatio(!lockAspectRatio)}
                                            disabled={!selectedFile}
                                        >
                                            {lockAspectRatio ? <FaLink /> : <FaUnlink />}
                                        </button>
                                    </div>
                                    <div className="col-5">
                                        <div className="tech-input-box">
                                            <label>HEIGHT</label>
                                            <input type="number" name="height" value={dimensions.height} onChange={handleDimensionChange} disabled={!selectedFile} />
                                        </div>
                                    </div>
                                </div>

                                <div className="tech-presets-grid mt-3">
                                    {PRESETS.map((p, i) => (
                                        <button key={i} className="tech-preset-pill" onClick={() => applyPreset(p)} disabled={!selectedFile}>
                                            <p.icon className="me-1" /> {p.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* SECTION: TARGET SIZE */}
                            <div className="tech-section mb-4">
                                <div className="tech-label-group">
                                    <FaHdd className="text-success" />
                                    <span>TARGET FILE SIZE (KB)</span>
                                </div>
                                <div className="tech-kb-presets mb-3">
                                    {KB_PRESETS.map(kb => (
                                        <button 
                                            key={kb} 
                                            className={`tech-kb-pill ${targetKB === kb ? 'active' : ''}`}
                                            onClick={() => setTargetKB(kb)}
                                            disabled={!selectedFile}
                                        >
                                            {kb}KB
                                        </button>
                                    ))}
                                    <button 
                                        className={`tech-kb-pill ${targetKB && !KB_PRESETS.includes(targetKB) ? 'active' : ''}`}
                                        onClick={() => setTargetKB("")}
                                        disabled={!selectedFile}
                                    >
                                        CUSTOM
                                    </button>
                                </div>
                                <div className="tech-input-box">
                                    <label>MAXIMUM KB (OPTIONAL)</label>
                                    <input 
                                        type="number" 
                                        placeholder="e.g. 150" 
                                        value={targetKB} 
                                        onChange={(e) => setTargetKB(e.target.value)} 
                                        disabled={!selectedFile}
                                    />
                                </div>
                            </div>

                            {/* FORMAT */}
                            <div className="tech-section mb-4">
                                <div className="tech-label-group">
                                    <FaArrowRight className="text-warning" />
                                    <span>OUTPUT ENCODING</span>
                                </div>
                                <div className="tech-radio-group">
                                    {['image/jpeg', 'image/png', 'image/webp'].map(fmt => (
                                        <button 
                                            key={fmt} 
                                            className={`tech-radio-btn ${outputFormat === fmt ? 'active' : ''}`}
                                            onClick={() => setOutputFormat(fmt)}
                                            disabled={!selectedFile}
                                        >
                                            {fmt.split('/')[1].toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button 
                                className="tech-main-btn w-100"
                                onClick={handleProcess}
                                disabled={!selectedFile || isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        COMPILING DATA...
                                    </>
                                ) : (
                                    <>INITIALIZE PROCESSING ENGINE</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: OUTPUT PREVIEW */}
                    <div className="col-lg-7">
                        <div className="tech-card h-100 p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-white border-opacity-10">
                                <h5 className="m-0 fw-bold">SYSTEM OUTPUT</h5>
                                {resizedFile && (
                                    <button className="tech-download-btn" onClick={handleDownload}>
                                        <FaDownload className="me-2" /> EXPORT RESULT
                                    </button>
                                )}
                            </div>

                            {!selectedFile ? (
                                <div className="tech-empty-state">
                                    <FaImage className="opacity-10 display-1 mb-3" />
                                    <p className="text-muted">WAITING FOR CORE PAYLOAD...</p>
                                </div>
                            ) : (
                                <div className="tech-output-container">
                                    <div className="tech-preview-window checkerboard">
                                        <img src={resizedPreview || originalPreview} alt="Preview" className="img-fluid" />
                                        {!resizedFile && isProcessing && (
                                            <div className="tech-overlay-processing">
                                                <div className="spinner-grow text-primary"></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* TERMINAL STATS */}
                                    <div className="tech-stats mt-4">
                                        <div className="stats-row">
                                            <span className="label">ORIGINAL RESOLUTION</span>
                                            <span className="value">{originalDimensions.width}x{originalDimensions.height}</span>
                                        </div>
                                        <div className="stats-row">
                                            <span className="label">OUTPUT RESOLUTION</span>
                                            <span className="value text-primary">{dimensions.width}x{dimensions.height}</span>
                                        </div>
                                        <div className="stats-row highlight">
                                            <span className="label">TARGET MAGNITUDE</span>
                                            <span className="value">{targetKB ? `${targetKB}KB` : 'UNSET'}</span>
                                        </div>
                                        {resizedFile && (
                                            <>
                                                <div className="stats-row success">
                                                    <span className="label">RESULT SIZE</span>
                                                    <span className="value"><FaCheckCircle className="me-1" /> {formatSize(resizedFile.size)}</span>
                                                </div>
                                                <div className="stats-row">
                                                    <span className="label">EFFICIENCY GAIN</span>
                                                    <span className="value text-success">{stats.reduction}% REDUCTION</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageResizer;
