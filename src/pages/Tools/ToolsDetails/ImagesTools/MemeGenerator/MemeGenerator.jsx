import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FaDownload, FaUpload, FaTrash, FaImage, FaFont, FaPalette } from "react-icons/fa";
import "./MemeGenerator.css";

const MemeGenerator = () => {
  const [image, setImage] = useState(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [fontSize, setFontSize] = useState(40);
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontFamily, setFontFamily] = useState("Impact");
  const [isBold, setIsBold] = useState(true);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File is too large! Please upload an image under 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          toast.success("Image uploaded!");
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const drawMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    
    // Set canvas dimensions to match image aspect ratio while maintaining a reasonable size
    const maxWidth = 800;
    const scale = Math.min(1, maxWidth / image.width);
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;

    // Draw background image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Text styling
    const calculatedFontSize = (fontSize * (canvas.width / 500));
    ctx.fillStyle = textColor;
    ctx.strokeStyle = "black";
    ctx.lineWidth = calculatedFontSize / 8;
    ctx.textAlign = "center";
    ctx.font = `${isBold ? 'bold' : ''} ${calculatedFontSize}px ${fontFamily}`;
    ctx.textBaseline = "top";

    // Draw top text
    if (topText) {
      const x = canvas.width / 2;
      const y = 20;
      ctx.strokeText(topText.toUpperCase(), x, y);
      ctx.fillText(topText.toUpperCase(), x, y);
    }

    // Draw bottom text
    if (bottomText) {
      ctx.textBaseline = "bottom";
      const x = canvas.width / 2;
      const y = canvas.height - 20;
      ctx.strokeText(bottomText.toUpperCase(), x, y);
      ctx.fillText(bottomText.toUpperCase(), x, y);
    }
  };

  useEffect(() => {
    drawMeme();
  }, [image, topText, bottomText, fontSize, textColor, fontFamily, isBold]);

  const handleDownload = () => {
    if (!image) {
      toast.error("Please upload an image first!");
      return;
    }
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "meme-webzentools.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Meme downloaded successfully!");
  };

  const resetTool = () => {
    setImage(null);
    setTopText("");
    setBottomText("");
    setFontSize(40);
    setTextColor("#ffffff");
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success("Tool reset!");
  };

  return (
    <div className="meme-generator-container">
      <div className="row g-4">
        {/* Left Side: Preview */}
        <div className="col-lg-7">
          <div className="premium-card meme-preview-card p-4 h-100">
            {!image ? (
              <div 
                className="upload-area d-flex flex-column align-items-center justify-content-center"
                onClick={() => fileInputRef.current.click()}
              >
                <div className="upload-icon-wrapper mb-3">
                  <FaUpload size={40} className="text-primary" />
                </div>
                <h5 className="fw-bold text-white">Upload Base Image</h5>
                <p className="text-muted small">Drag and drop or click to browse (Max 10MB)</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="d-none" 
                />
              </div>
            ) : (
              <canvas ref={canvasRef} className="meme-canvas" />
            )}
          </div>
        </div>

        {/* Right Side: Controls */}
        <div className="col-lg-5">
          <div className="premium-card p-4 h-100 glass-card">
            <h4 className="fw-bold mb-4 d-flex align-items-center text-dark">
              <FaFont className="me-2 text-primary" /> Customize Meme
            </h4>

            <div className="mb-3">
              <label className="control-label text-dark">Top Text</label>
              <input
                type="text"
                className="form-control premium-input"
                placeholder="Enter top text..."
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="control-label">Bottom Text</label>
              <input
                type="text"
                className="form-control premium-input"
                placeholder="Enter bottom text..."
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="control-label d-flex justify-content-between">
                Font Size <span>{fontSize}px</span>
              </label>
              <input
                type="range"
                className="font-size-slider"
                min="10"
                max="100"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
              />
            </div>

            <div className="mb-4">
              <label className="control-label">Text Color</label>
              <div className="color-picker-wrapper">
                {["#ffffff", "#000000", "#ff0000", "#ffff00", "#00ff00", "#0000ff"].map((color) => (
                  <div
                    key={color}
                    className={`color-option ${textColor === color ? "active" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setTextColor(color)}
                  />
                ))}
                <input 
                  type="color" 
                  value={textColor} 
                  onChange={(e) => setTextColor(e.target.value)}
                  className="ms-2"
                  style={{ width: '32px', height: '32px', border: 'none', padding: '0', borderRadius: '50%', background: 'none' }}
                />
              </div>
            </div>

            <div className="d-flex gap-2 mt-auto">
              <button 
                className="btn btn-download action-btn flex-grow-1"
                onClick={handleDownload}
                disabled={!image}
              >
                <FaDownload className="me-2" /> Download Meme
              </button>
              <button 
                className="btn btn-reset action-btn"
                onClick={resetTool}
                title="Reset"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="mt-5 pt-5 border-top border-secondary border-opacity-10">
        <h2 className="fw-bold mb-4 text-dark">Meme Generator Tool</h2>
        <p className="text-muted" style={{ lineHeight: "1.8" }}>
          Create hilarious memes instantly with our premium Meme Generator. Whether you're making a viral hit or a private joke, our tool provides all the essential features to craft the perfect meme right in your browser. No registration required, 100% private processing.
        </p>

        <div className="row g-4 mt-4">
          <div className="col-md-4">
            <div className="feature-item">
              <div className="icon-wrapper mb-3 text-primary">
                <FaImage size={24} />
              </div>
              <h5 className="fw-bold text-dark">Custom Uploads</h5>
              <p className="text-muted small mb-0">Upload any image from your device and turn it into a meme in seconds.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-item">
              <div className="icon-wrapper mb-3 text-success">
                <FaFont size={24} />
              </div>
              <h5 className="fw-bold text-dark">Dynamic Text</h5>
              <p className="text-muted small mb-0">Add top and bottom text with adjustable font sizes and real-time preview.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-item">
              <div className="icon-wrapper mb-3 text-info">
                <FaPalette size={24} />
              </div>
              <h5 className="fw-bold text-dark">Privacy First</h5>
              <p className="text-muted small mb-0">All processing happens locally in your browser. Your images are never uploaded to our servers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeGenerator;
