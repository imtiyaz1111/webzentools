import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";
import { 
  FaCloudUploadAlt, FaDownload, FaTrash, FaImage, FaFont, FaTh,
  FaChevronDown, FaChevronUp, FaCogs, FaCheckCircle, FaUndo,
  FaRedo, FaExpandArrowsAlt, FaAlignLeft, FaAlignCenter, FaAlignRight
} from "react-icons/fa";
import "./WatermarkAdder.css";

const POSITIONS = [
    { id: "top-left", label: "Top Left" },
    { id: "top-center", label: "Top Center" },
    { id: "top-right", label: "Top Right" },
    { id: "middle-left", label: "Middle Left" },
    { id: "center", label: "Center" },
    { id: "middle-right", label: "Middle Right" },
    { id: "bottom-left", label: "Bottom Left" },
    { id: "bottom-center", label: "Bottom Center" },
    { id: "bottom-right", label: "Bottom Right" },
];

const WatermarkAdder = () => {
    const [baseFile, setBaseFile] = useState(null);
    const [baseImg, setBaseImg] = useState(null);
    const [watermarkUrl, setWatermarkUrl] = useState(null);
    
    // Mode: 'text' or 'image'
    const [mode, setMode] = useState("text");
    
    // Text Settings
    const [text, setText] = useState("© WebzenTools");
    const [fontSize, setFontSize] = useState(40);
    const [fontColor, setFontColor] = useState("#ffffff");
    const [textOpacity, setTextOpacity] = useState(0.5);
    const [rotation, setRotation] = useState(0);
    
    // Image Settings
    const [logoFile, setLogoFile] = useState(null);
    const [logoImg, setLogoImg] = useState(null);
    const [logoScale, setLogoScale] = useState(0.2);
    const [logoOpacity, setLogoOpacity] = useState(0.5);
    
    // Shared Settings
    const [position, setPosition] = useState("bottom-right");
    const [offsetX, setOffsetX] = useState(20);
    const [offsetY, setOffsetY] = useState(20);
    
    const [isProcessing, setIsProcessing] = useState(false);
    
    const fileInputRef = useRef(null);
    const logoInputRef = useRef(null);
    const previewCanvasRef = useRef(null);

    const handleBaseFile = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setBaseFile(file);
            const img = new Image();
            img.onload = () => setBaseImg(img);
            img.src = URL.createObjectURL(file);
            toast.success("Base image loaded!");
        }
    };

    const handleLogoFile = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setLogoFile(file);
            const img = new Image();
            img.onload = () => setLogoImg(img);
            img.src = URL.createObjectURL(file);
            toast.success("Logo loaded!");
        }
    };

    const drawWatermark = useCallback(() => {
        if (!baseImg) return;

        const canvas = previewCanvasRef.current;
        const ctx = canvas.getContext("2d");

        // Set high quality dimensions from base image
        canvas.width = baseImg.width;
        canvas.height = baseImg.height;

        // Draw Base
        ctx.drawImage(baseImg, 0, 0);

        if (mode === "text" && text) {
            ctx.save();
            ctx.globalAlpha = textOpacity;
            ctx.fillStyle = fontColor;
            ctx.font = `${fontSize}px Inter, sans-serif`;
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";

            const metrics = ctx.measureText(text);
            const textWidth = metrics.width;
            const textHeight = fontSize;

            const { x, y } = calculatePosition(canvas.width, canvas.height, textWidth, textHeight);
            
            ctx.translate(x, y);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.fillText(text, 0, 0);
            ctx.restore();
        } else if (mode === "image" && logoImg) {
            ctx.save();
            ctx.globalAlpha = logoOpacity;
            
            const logoWidth = logoImg.width * logoScale;
            const logoHeight = logoImg.height * logoScale;
            
            const { x, y } = calculatePosition(canvas.width, canvas.height, logoWidth, logoHeight);
            
            ctx.drawImage(logoImg, x - logoWidth/2, y - logoHeight/2, logoWidth, logoHeight);
            ctx.restore();
        }

        setWatermarkUrl(canvas.toDataURL("image/png"));
    }, [baseImg, mode, text, fontSize, fontColor, textOpacity, rotation, logoImg, logoScale, logoOpacity, position, offsetX, offsetY]);

    const calculatePosition = (canvasW, canvasH, contentW, contentH) => {
        let x, y;
        const padX = offsetX;
        const padY = offsetY;

        switch (position) {
            case "top-left":
                x = contentW / 2 + padX;
                y = contentH / 2 + padY;
                break;
            case "top-center":
                x = canvasW / 2;
                y = contentH / 2 + padY;
                break;
            case "top-right":
                x = canvasW - contentW / 2 - padX;
                y = contentH / 2 + padY;
                break;
            case "middle-left":
                x = contentW / 2 + padX;
                y = canvasH / 2;
                break;
            case "center":
                x = canvasW / 2;
                y = canvasH / 2;
                break;
            case "middle-right":
                x = canvasW - contentW / 2 - padX;
                y = canvasH / 2;
                break;
            case "bottom-left":
                x = contentW / 2 + padX;
                y = canvasH - contentH / 2 - padY;
                break;
            case "bottom-center":
                x = canvasW / 2;
                y = canvasH - contentH / 2 - padY;
                break;
            case "bottom-right":
                x = canvasW - contentW / 2 - padX;
                y = canvasH - contentH / 2 - padY;
                break;
            default:
                x = canvasW / 2; y = canvasH / 2;
        }
        return { x, y };
    };

    useEffect(() => {
        if (baseImg) drawWatermark();
    }, [drawWatermark, baseImg]);

    const handleDownload = () => {
        if (!watermarkUrl) return;
        const link = document.createElement("a");
        link.href = watermarkUrl;
        link.download = `watermarked_${baseFile.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Protected image downloaded!");
    };

    const reset = () => {
        setBaseFile(null);
        setBaseImg(null);
        setLogoFile(null);
        setLogoImg(null);
        setWatermarkUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="watermark-adder-tech">
            <div className="container py-5">
                <div className="row g-4">
                    {/* LEFT: CONTROLS */}
                    <div className="col-lg-5">
                        <div className="tech-card p-4">
                            <div className="card-header-gradient mb-4">
                                <h5 className="m-0 fw-bold d-flex align-items-center">
                                    <FaCogs className="me-2 text-primary" /> WATERMARK ENGINE
                                </h5>
                                <p className="x-small text-muted mb-0 mt-1">Configure asset protection parameters</p>
                            </div>

                            {!baseFile ? (
                                <div className="tech-upload-zone mb-4" onClick={() => fileInputRef.current.click()}>
                                    <input type="file" hidden ref={fileInputRef} onChange={handleBaseFile} accept="image/*" />
                                    <FaCloudUploadAlt className="display-4 text-primary mb-3" />
                                    <h6 className="fw-bold">LOAD MASTER PAYLOAD</h6>
                                    <p className="x-small text-muted mb-0">Drag and drop the image to be protected</p>
                                </div>
                            ) : (
                                <div className="tech-file-info mb-4">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <FaImage className="text-primary me-2" />
                                            <span className="small fw-medium text-truncate" style={{ maxWidth: '180px' }}>{baseFile.name}</span>
                                        </div>
                                        <button className="btn-icon text-danger" onClick={reset}><FaTrash /></button>
                                    </div>
                                    <div className="mt-2 pt-2 border-top border-white border-opacity-10 d-flex justify-content-between">
                                        <span className="x-small text-muted">RESOLUTION:</span>
                                        <span className="x-small fw-bold text-primary">{baseImg?.width}x{baseImg?.height}</span>
                                    </div>
                                </div>
                            )}

                            {/* MODE SELECTOR */}
                            <div className="tech-radio-group mb-4">
                                <button className={`tech-radio-btn ${mode === 'text' ? 'active' : ''}`} onClick={() => setMode('text')}>
                                    <FaFont className="me-2" /> TEXT MODE
                                </button>
                                <button className={`tech-radio-btn ${mode === 'image' ? 'active' : ''}`} onClick={() => setMode('image')}>
                                    <FaImage className="me-2" /> LOGO MODE
                                </button>
                            </div>

                            {/* SECTION: MODE SPECIFIC */}
                            <div className="tech-section mb-4">
                                {mode === 'text' ? (
                                    <>
                                        <div className="tech-label-group"><FaFont className="text-primary" /><span>TEXT MAGNITUDE</span></div>
                                        <div className="tech-input-box mb-3">
                                            <label>WATERMARK CONTENT</label>
                                            <input type="text" value={text} onChange={(e) => setText(e.target.value)} disabled={!baseFile} />
                                        </div>
                                        <div className="row g-2">
                                            <div className="col-6">
                                                <div className="tech-input-box">
                                                    <label>FONT SIZE (PX)</label>
                                                    <input type="number" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} disabled={!baseFile} />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="tech-input-box">
                                                    <label>COLOR</label>
                                                    <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} disabled={!baseFile} style={{ height: '24px' }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <label className="x-small fw-bold text-muted d-block mb-1">OPACITY: {Math.round(textOpacity * 100)}%</label>
                                            <input type="range" className="form-range tech-range" min="0" max="1" step="0.1" value={textOpacity} onChange={(e) => setTextOpacity(parseFloat(e.target.value))} disabled={!baseFile} />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="tech-label-group"><FaImage className="text-primary" /><span>LOGO ASSET</span></div>
                                        {!logoFile ? (
                                            <div className="tech-upload-mini" onClick={() => logoInputRef.current.click()}>
                                                <input type="file" hidden ref={logoInputRef} onChange={handleLogoFile} accept="image/*" />
                                                <FaCloudUploadAlt className="me-2" /> LOAD LOGO
                                            </div>
                                        ) : (
                                            <div className="d-flex align-items-center justify-content-between mb-3 bg-dark bg-opacity-50 p-2 rounded">
                                                <span className="x-small text-truncate me-2">{logoFile.name}</span>
                                                <button className="btn-icon x-small text-danger" onClick={() => { setLogoFile(null); setLogoImg(null); }}><FaTrash /></button>
                                            </div>
                                        )}
                                        <div className="row g-2">
                                            <div className="col-6">
                                                <label className="x-small fw-bold text-muted d-block mb-1">SCALE: {Math.round(logoScale * 100)}%</label>
                                                <input type="range" className="form-range tech-range" min="0.05" max="1" step="0.05" value={logoScale} onChange={(e) => setLogoScale(parseFloat(e.target.value))} disabled={!logoImg} />
                                            </div>
                                            <div className="col-6">
                                                <label className="x-small fw-bold text-muted d-block mb-1">OPACITY: {Math.round(logoOpacity * 100)}%</label>
                                                <input type="range" className="form-range tech-range" min="0" max="1" step="0.1" value={logoOpacity} onChange={(e) => setLogoOpacity(parseFloat(e.target.value))} disabled={!logoImg} />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* SECTION: POSITION */}
                            <div className="tech-section mb-4">
                                <div className="tech-label-group"><FaTh className="text-warning" /><span>SPATIAL ALIGNMENT</span></div>
                                <div className="position-grid-selector mb-3">
                                    {POSITIONS.map(pos => (
                                        <button 
                                            key={pos.id} 
                                            className={`grid-cell ${position === pos.id ? 'active' : ''}`}
                                            onClick={() => setPosition(pos.id)}
                                            title={pos.label}
                                            disabled={!baseFile}
                                        />
                                    ))}
                                </div>
                                <div className="row g-2">
                                    <div className="col-6">
                                        <div className="tech-input-box">
                                            <label>X-OFFSET</label>
                                            <input type="number" value={offsetX} onChange={(e) => setOffsetX(parseInt(e.target.value))} disabled={!baseFile} />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="tech-input-box">
                                            <label>Y-OFFSET</label>
                                            <input type="number" value={offsetY} onChange={(e) => setOffsetY(parseInt(e.target.value))} disabled={!baseFile} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="tech-main-btn w-100" onClick={handleDownload} disabled={!watermarkUrl}>
                                <FaDownload className="me-2" /> EXPORT PROTECTED PAYLOAD
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: PREVIEW */}
                    <div className="col-lg-7">
                        <div className="tech-card h-100 p-4">
                            <h5 className="fw-bold mb-4 pb-3 border-bottom border-white border-opacity-10">REAL-TIME RENDER BUFFER</h5>
                            {!baseFile ? (
                                <div className="tech-empty-state">
                                    <FaImage className="opacity-10 display-1 mb-3" />
                                    <p className="text-muted">WAITING FOR CORE PAYLOAD...</p>
                                </div>
                            ) : (
                                <div className="tech-preview-container">
                                    <div className="tech-preview-window checkerboard">
                                        <canvas ref={previewCanvasRef} style={{ display: 'none' }} />
                                        <img src={watermarkUrl} alt="Watermark Preview" className="img-fluid" />
                                    </div>

                                    {/* TERMINAL OVERLAY */}
                                    <div className="tech-stats mt-4">
                                        <div className="stats-row">
                                            <span className="label">ACTIVE MODE</span>
                                            <span className="value text-primary">{mode.toUpperCase()}</span>
                                        </div>
                                        <div className="stats-row">
                                            <span className="label">ALIGNMENT PROTOCOL</span>
                                            <span className="value text-warning">{position.replace('-', ' ').toUpperCase()}</span>
                                        </div>
                                        <div className="stats-row highlight">
                                            <span className="label">SECURITY STATUS</span>
                                            <span className="value text-success"><FaCheckCircle className="me-1" /> PROTECTED</span>
                                        </div>
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

export default WatermarkAdder;
