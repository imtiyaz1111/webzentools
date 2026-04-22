import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FaUpload, FaCopy, FaEyeDropper, FaPalette, FaHistory, FaCheck, FaMousePointer } from "react-icons/fa";
import "./ColorPicker.css";

const ColorPicker = () => {
  const [image, setImage] = useState(null);
  const [pickedColor, setPickedColor] = useState({ hex: "#38bdf8", rgb: "56, 189, 248", hsl: "199, 95%, 59%" });
  const [palette, setPalette] = useState([]);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0, visible: false });
  
  const canvasRef = useRef(null);
  const displayCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const rgbToHex = (r, g, b) => "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) h = s = 0;
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: break;
      }
      h /= 6;
    }
    return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setupCanvas(img);
          extractPalette(img);
          toast.success("Image loaded!");
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const setupCanvas = (img) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };

  const pickColor = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext("2d");
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
    const rgb = `${pixel[0]}, ${pixel[1]}, ${pixel[2]}`;
    const hsl = rgbToHsl(pixel[0], pixel[1], pixel[2]);

    setPickedColor({ hex, rgb, hsl });
  };

  const handleMouseMove = (e) => {
    if (!image) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
      setMagnifierPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        visible: true
      });
      pickColor(e); // Real-time update while moving
    } else {
      setMagnifierPos(prev => ({ ...prev, visible: false }));
    }
  };

  const extractPalette = (img) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 50;
    canvas.height = 50;
    ctx.drawImage(img, 0, 0, 50, 50);
    const data = ctx.getImageData(0, 0, 50, 50).data;
    
    const colors = {};
    for (let i = 0; i < data.length; i += 4) {
      const hex = rgbToHex(data[i], data[i+1], data[i+2]);
      colors[hex] = (colors[hex] || 0) + 1;
    }
    
    const sorted = Object.keys(colors).sort((a, b) => colors[b] - colors[a]);
    setPalette(sorted.slice(0, 6));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="color-picker-container">
      <div className="row g-4">
        {/* Workspace */}
        <div className="col-lg-8">
          <div className="premium-card p-4 h-100">
            <h5 className="fw-bold mb-4 d-flex align-items-center text-dark">
              <FaEyeDropper className="me-2 text-primary" /> Image Workspace
            </h5>

            <div 
              className="picker-workspace"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setMagnifierPos(prev => ({ ...prev, visible: false }))}
              onClick={pickColor}
            >
              {!image ? (
                <div 
                  className="upload-area w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                  onClick={() => fileInputRef.current.click()}
                >
                  <FaUpload size={40} className="text-primary mb-3" />
                  <h5 className="fw-bold text-dark">Upload Image to Pick Colors</h5>
                  <p className="text-muted small">Drag and drop or click to browse</p>
                </div>
              ) : (
                <>
                  <canvas ref={canvasRef} className="picker-canvas" />
                  {magnifierPos.visible && (
                    <div 
                      className="magnifier"
                      style={{
                        left: magnifierPos.x - 60,
                        top: magnifierPos.y - 60,
                        backgroundColor: pickedColor.hex,
                        backgroundImage: `url(${image.src})`,
                        backgroundSize: `${canvasRef.current.offsetWidth * 5}px ${canvasRef.current.offsetHeight * 5}px`,
                        backgroundPosition: `-${magnifierPos.x * 5 - 60}px -${magnifierPos.y * 5 - 60}px`
                      }}
                    />
                  )}
                </>
              )}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="d-none" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
            
            {image && (
              <div className="mt-3 text-center text-muted small">
                <FaMousePointer className="me-1" /> Click anywhere on the image to pick a color
              </div>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <div className="col-lg-4">
          <div className="premium-card p-4 h-100 glass-card">
            <h5 className="fw-bold mb-4 text-dark">Color Details</h5>
            
            <div className="d-flex align-items-center gap-4 mb-4 pb-4 border-bottom border-secondary border-opacity-10">
              <div 
                className="current-color-preview" 
                style={{ backgroundColor: pickedColor.hex }} 
              />
              <div>
                <h6 className="fw-bold mb-1 text-dark">Picked Color</h6>
                <span className="text-muted small">Pixel-perfect extraction</span>
              </div>
            </div>

            <div className="color-values mb-5">
              {[
                { label: "HEX", value: pickedColor.hex },
                { label: "RGB", value: `rgb(${pickedColor.rgb})` },
                { label: "HSL", value: `hsl(${pickedColor.hsl})` }
              ].map((item) => (
                <div key={item.label} className="color-value-field" onClick={() => copyToClipboard(item.value)}>
                  <span className="value-label">{item.label}</span>
                  <span className="value-text">{item.value}</span>
                  <FaCopy className="text-muted small" />
                </div>
              ))}
            </div>

            <h6 className="fw-bold mb-3 d-flex align-items-center text-dark">
              <FaPalette className="me-2 text-success" /> Dominant Palette
            </h6>
            <div className="palette-grid">
              {palette.length > 0 ? palette.map((color) => (
                <div 
                  key={color}
                  className="palette-chip"
                  style={{ backgroundColor: color }}
                  data-hex={color}
                  onClick={() => copyToClipboard(color)}
                />
              )) : (
                <div className="text-muted small col-span-3">Upload image to see palette</div>
              )}
            </div>

            <div className="mt-auto pt-4">
              <button 
                className="btn btn-primary w-100 rounded-pill fw-bold"
                onClick={() => fileInputRef.current.click()}
              >
                {image ? "Change Image" : "Select Image"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="mt-5 pt-5 border-top border-secondary border-opacity-10">
        <h2 className="fw-bold mb-4 text-dark">Precision Color Picker</h2>
        <p className="text-muted" style={{ lineHeight: "1.8" }}>
          Our Image Color Picker is a high-performance developer tool designed for designers and front-end engineers. Easily extract hex codes, RGB values, and HSL strings from any visual asset. Whether you're matching a brand color or building a new theme, our pixel-perfect magnifier ensures you get the exact value every time.
        </p>

        <div className="row g-4 mt-4">
          <div className="col-md-4">
            <div className="feature-item">
              <div className="icon-wrapper mb-3 text-primary">
                <FaEyeDropper size={24} />
              </div>
              <h5 className="fw-bold text-dark">Pixel Precision</h5>
              <p className="text-muted small mb-0">Use the built-in magnifier to zoom in and pick individual pixels from high-res images.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-item">
              <div className="icon-wrapper mb-3 text-success">
                <FaHistory size={24} />
              </div>
              <h5 className="fw-bold text-dark">Auto Palette</h5>
              <p className="text-muted small mb-0">Instantly generate a dominant color palette from your uploaded images for faster prototyping.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-item">
              <div className="icon-wrapper mb-3 text-info">
                <FaCheck size={24} />
              </div>
              <h5 className="fw-bold text-dark">Copy-Paste Ready</h5>
              <p className="text-muted small mb-0">All color formats are formatted for direct use in CSS, SCSS, or design tools like Figma.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
