import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { FaDownload, FaUpload, FaCode, FaCheck, FaPercentage, FaHistory, FaBolt, FaMagic } from "react-icons/fa";
import "./SVGOptimizer.css";

const SVGOptimizer = () => {
  const [inputCode, setInputCode] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [optimizedSize, setOptimizedSize] = useState(0);
  const [settings, setSettings] = useState({
    precision: 2,
    removeComments: true,
    removeMetadata: true,
    removeEditorData: true,
    minifyColors: true,
    removeEmptyGroups: true,
    collapseWhitespace: true
  });

  const fileInputRef = useRef(null);

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "image/svg+xml" && !file.name.endsWith(".svg")) {
        toast.error("Please upload a valid SVG file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const code = event.target.result;
        setInputCode(code);
        setOriginalSize(new Blob([code]).size);
        toast.success("SVG uploaded!");
      };
      reader.readAsText(file);
    }
  };

  const optimizeSVG = () => {
    if (!inputCode) return;
    
    let svg = inputCode;

    // 1. Remove Comments
    if (settings.removeComments) {
      svg = svg.replace(/<!--[\s\S]*?-->/g, "");
    }

    // 2. Remove Metadata / XML / Doctype
    if (settings.removeMetadata) {
      svg = svg.replace(/<\?xml[\s\S]*?\?>/gi, "");
      svg = svg.replace(/<!DOCTYPE[\s\S]*?>/gi, "");
      svg = svg.replace(/<metadata[\s\S]*?>[\s\S]*?<\/metadata>/gi, "");
    }

    // 3. Remove Editor Data (Inkscape, Adobe, etc.)
    if (settings.removeEditorData) {
      svg = svg.replace(/xmlns:[\w-]+="[^"]*"/g, "");
      svg = svg.replace(/[\w-]+:[\w-]+="[^"]*"/g, (match) => {
        // Keep standard attributes, remove prefixed ones like inkscape:connector-curvature
        return match.includes(":") ? "" : match;
      });
    }

    // 4. Numeric Precision
    const precision = settings.precision;
    svg = svg.replace(/(\d+\.\d+)/g, (match) => {
      return parseFloat(parseFloat(match).toFixed(precision)).toString();
    });

    // 5. Minify Colors
    if (settings.minifyColors) {
      svg = svg.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3(?![0-9a-f])/gi, "#$1$2$3");
    }

    // 6. Remove Empty Groups
    if (settings.removeEmptyGroups) {
      let prev;
      do {
        prev = svg;
        svg = svg.replace(/<g[^>]*>\s*<\/g>/gi, "");
      } while (svg !== prev);
    }

    // 7. Collapse Whitespace
    if (settings.collapseWhitespace) {
      svg = svg.replace(/\s+/g, " ");
      svg = svg.replace(/>\s+</g, "><");
      svg = svg.trim();
    }

    setOutputCode(svg);
    setOptimizedSize(new Blob([svg]).size);
  };

  useEffect(() => {
    if (inputCode) {
      optimizeSVG();
    }
  }, [inputCode, settings]);

  const handleDownload = () => {
    if (!outputCode) return;
    const blob = new Blob([outputCode], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "optimized-webzentools.svg";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Optimized SVG downloaded!");
  };

  const savings = originalSize > 0 ? ((originalSize - optimizedSize) / originalSize * 100).toFixed(1) : 0;

  return (
    <div className="svg-optimizer-container">
      <div className="row g-4">
        {/* Main Interface */}
        <div className="col-lg-8">
          <div className="premium-card p-4 h-100">
            {/* Stats Bar */}
            <div className="stats-bar d-flex flex-wrap align-items-center">
              <div className="stat-item">
                <span className="stat-label">Original Size</span>
                <span className="stat-value">{formatSize(originalSize)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Optimized Size</span>
                <span className="stat-value">{formatSize(optimizedSize)}</span>
              </div>
              {originalSize > 0 && (
                <div className="stat-item ms-auto">
                  <span className="stat-label">Savings</span>
                  <div className="d-flex align-items-center">
                    <span className="stat-value text-success">{savings}%</span>
                    <span className="savings-badge">Saved</span>
                  </div>
                </div>
              )}
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="fw-bold mb-3 d-flex align-items-center text-dark">
                  <FaCode className="me-2 text-primary" /> SVG Source
                </h6>
                <div className="code-area-wrapper">
                  <textarea
                    className="svg-textarea"
                    placeholder="Paste your SVG code here or upload a file..."
                    value={inputCode}
                    onChange={(e) => {
                      setInputCode(e.target.value);
                      setOriginalSize(new Blob([e.target.value]).size);
                    }}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fw-bold mb-3 d-flex align-items-center text-dark">
                  <FaMagic className="me-2 text-success" /> Live Preview
                </h6>
                <div className="preview-container">
                  {outputCode ? (
                    <div dangerouslySetInnerHTML={{ __html: outputCode }} />
                  ) : (
                    <div className="text-muted small text-center px-4">
                      <FaUpload size={30} className="mb-2 opacity-50" /><br/>
                      Preview will appear here
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="d-flex gap-3 mt-4">
              <button 
                className="btn btn-optimize action-btn flex-grow-1"
                onClick={() => fileInputRef.current.click()}
              >
                <FaUpload className="me-2" /> Upload SVG
              </button>
              <button 
                className="btn btn-download action-btn flex-grow-1"
                onClick={handleDownload}
                disabled={!outputCode}
              >
                <FaDownload className="me-2" /> Download Optimized
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="d-none" 
                accept=".svg" 
                onChange={handleFileUpload} 
              />
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="col-lg-4">
          <div className="premium-card control-panel h-100 glass-card">
            <h4 className="fw-bold mb-4 d-flex align-items-center text-dark">
              <FaBolt className="me-2 text-warning" /> Settings
            </h4>

            <div className="mb-4">
              <label className="stat-label mb-2 d-block">Numeric Precision ({settings.precision})</label>
              <input
                type="range"
                className="precision-slider"
                min="0"
                max="5"
                value={settings.precision}
                onChange={(e) => setSettings({...settings, precision: parseInt(e.target.value)})}
              />
              <div className="d-flex justify-content-between text-muted small mt-1">
                <span>Fast</span>
                <span>Precise</span>
              </div>
            </div>

            <div className="options-list">
              {[
                { key: 'removeComments', label: 'Remove Comments' },
                { key: 'removeMetadata', label: 'Remove Metadata & XML' },
                { key: 'removeEditorData', label: 'Cleanup Editor Data' },
                { key: 'minifyColors', label: 'Minify Colors' },
                { key: 'removeEmptyGroups', label: 'Remove Empty Groups' },
                { key: 'collapseWhitespace', label: 'Minify SVG Code' }
              ].map((opt) => (
                <label key={opt.key} className="option-check">
                  <input
                    type="checkbox"
                    checked={settings[opt.key]}
                    onChange={(e) => setSettings({...settings, [opt.key]: e.target.checked})}
                  />
                  <span className="option-label">{opt.label}</span>
                </label>
              ))}
            </div>

            <div className="mt-4 pt-4 border-top border-secondary border-opacity-10 text-muted small">
              <p className="mb-0">
                <FaCheck className="text-success me-2" /> 
                Optimizations are applied in real-time as you toggle settings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="mt-5 pt-5 border-top border-secondary border-opacity-10">
        <h2 className="fw-bold mb-4 text-dark">Why Optimize Your SVGs?</h2>
        <p className="text-muted" style={{ lineHeight: "1.8" }}>
          SVGs often contain a lot of redundant information that isn't needed for display in a browser. This includes editor metadata, comments, and overly precise coordinates. By optimizing your SVGs, you can significantly reduce their file size, leading to faster page load times and better performance for your web applications.
        </p>

        <div className="row g-4 mt-4">
          <div className="col-md-4">
            <div className="feature-item">
              <div className="icon-wrapper mb-3 text-primary">
                <FaBolt size={24} />
              </div>
              <h5 className="fw-bold text-dark">Ultra Fast</h5>
              <p className="text-muted small mb-0">Instant browser-side optimization with no server delays. See results as you type.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-item">
              <div className="icon-wrapper mb-3 text-success">
                <FaPercentage size={24} />
              </div>
              <h5 className="fw-bold text-dark">High Compression</h5>
              <p className="text-muted small mb-0">Reduce file sizes by up to 80% by stripping away non-essential XML components.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-item">
              <div className="icon-wrapper mb-3 text-info">
                <FaHistory size={24} />
              </div>
              <h5 className="fw-bold text-dark">Zero Loss</h5>
              <p className="text-muted small mb-0">Visually identical results with cleaner code. Perfect for production assets.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SVGOptimizer;
