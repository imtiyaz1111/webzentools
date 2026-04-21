import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { 
  FaCss3Alt, FaCopy, FaDownload, FaExclamationTriangle, 
  FaCheck, FaTrash, FaMagic, FaCompressArrowsAlt,
  FaKeyboard, FaExchangeAlt, FaCode
} from "react-icons/fa";
import "./CSSMinifierBeautifier.css";

const CSSMinifierBeautifier = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("beautify"); // 'minify' or 'beautify'
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [error, setError] = useState("");

  const minifyCSS = useCallback((css) => {
    try {
      return css
        .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
        .replace(/\s*([{} :;,])\s*/g, "$1") // Remove whitespace around symbols
        .replace(/\s+/g, " ") // Collapse multiple spaces
        .replace(/;\}/g, "}") // Remove trailing semicolon
        .trim();
    } catch (e) {
      throw new Error("Minification failed: " + e.message);
    }
  }, []);

  const beautifyCSS = useCallback((css) => {
    try {
      let formatted = "";
      let indent = 0;
      const step = "  "; // 2 spaces indent

      // Basic cleanup
      let clean = css
        .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/\s+/g, " ")) // Normalize comment whitespace
        .replace(/\s*([{} :;,])\s*/g, "$1")
        .replace(/\s+/g, " ");

      // Tokenize and space out
      let tokens = clean
        .replace(/\{/g, " {\n")
        .replace(/\}/g, "\n}\n")
        .replace(/;/g, ";\n")
        .replace(/,/g, ", ")
        .split("\n");

      for (let line of tokens) {
        line = line.trim();
        if (line.includes("}")) indent--;
        if (line) {
          formatted += step.repeat(Math.max(0, indent)) + line + "\n";
        }
        if (line.includes("{")) indent++;
      }

      return formatted.trim();
    } catch (e) {
      throw new Error("Beautification failed: " + e.message);
    }
  }, []);

  const process = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError("");
      return;
    }

    try {
      setError("");
      if (mode === "minify") {
        setOutput(minifyCSS(input));
      } else {
        setOutput(beautifyCSS(input));
      }
    } catch (e) {
      setError(e.message);
      setOutput("");
    }
  }, [input, mode, minifyCSS, beautifyCSS]);

  useEffect(() => {
    if (autoUpdate) {
      const timer = setTimeout(process, 300);
      return () => clearTimeout(timer);
    }
  }, [input, mode, autoUpdate, process]);

  const handleAction = () => {
    process();
    if (!error && input.trim()) {
      toast.success(`CSS ${mode === "minify" ? "minified" : "beautified"} successfully!`);
    } else if (error) {
      toast.error(error);
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    toast.success("Cleared everything!");
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      toast.success("Copied to clipboard!");
    });
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = mode === "minify" ? "style.min.css" : "style.css";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  };

  const loadSample = () => {
    const sample = `/* Sample CSS */
.hero-section { background: #f0f0f0; padding: 20px; border: 1px solid #ccc; }
.hero-title { font-size: 2rem; color: #333; margin-bottom: 10px; }
@media (max-width: 768px) { .hero-section { padding: 10px; } }`;
    setInput(sample);
    toast.success("Sample CSS loaded.");
  };

  const swap = () => {
    if (output) {
      setInput(output);
      setMode(mode === "minify" ? "beautify" : "minify");
      setOutput("");
    }
  };

  return (
    <div className="css-tool-bg">
      <div className="container tool-content">
        
        <div className="row g-4 justify-content-center">
          {/* CONTROL STRIP */}
          <div className="col-12">
            <div className="premium-card p-3 mb-4 control-strip">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="btn-group premium-toggle" role="group">
                  <button 
                    className={`btn ${mode === "beautify" ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setMode("beautify")}
                  >
                    <FaMagic className="me-2" /> Beautify
                  </button>
                  <button 
                    className={`btn ${mode === "minify" ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setMode("minify")}
                  >
                    <FaCompressArrowsAlt className="me-2" /> Minify
                  </button>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="form-check form-switch premium-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="autoUpdateSwitch" 
                      checked={autoUpdate}
                      onChange={(e) => setAutoUpdate(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="autoUpdateSwitch">Auto-Update</label>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-action" onClick={loadSample} title="Sample Data">
                    <FaKeyboard /> <span className="d-none d-md-inline ms-1">Sample</span>
                  </button>
                  <button className="btn btn-action text-danger" onClick={clearAll} title="Clear">
                    <FaTrash /> <span className="d-none d-md-inline ms-1">Clear</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* INPUT SECTION */}
          <div className="col-lg-6">
            <div className="premium-card h-100 p-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center">
                <FaCss3Alt className="text-primary me-2" /> Input CSS
              </h5>
              <textarea
                className={`form-control premium-input css-textarea ${error ? 'border-danger' : ''}`}
                rows={16}
                placeholder="Paste your messy or minified CSS here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              {error && (
                <div className="error-msg mt-2 text-danger small d-flex align-items-center">
                  <FaExclamationTriangle className="me-2" /> {error}
                </div>
              )}
              {!autoUpdate && (
                <button className="btn btn-primary w-100 mt-3" onClick={handleAction}>
                  {mode === "minify" ? "Minify CSS" : "Beautify CSS"}
                </button>
              )}
            </div>
          </div>

          {/* OUTPUT SECTION */}
          <div className="col-lg-6">
            <div className="premium-card h-100 p-4 output-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold m-0 d-flex align-items-center">
                  <FaCode className="text-success me-2" /> Result
                </h5>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-action" onClick={handleCopy} disabled={!output} title="Copy">
                    <FaCopy />
                  </button>
                  <button className="btn btn-sm btn-action" onClick={handleDownload} disabled={!output} title="Download">
                    <FaDownload />
                  </button>
                  <button className="btn btn-sm btn-action" onClick={swap} disabled={!output} title="Swap">
                    <FaExchangeAlt />
                  </button>
                </div>
              </div>
              <div className="result-container h-100">
                <pre className="premium-output css-output">
                  {output || "Formatted CSS will appear here..."}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT TOOL */}
        <section className="about-tool mt-5 pt-4">
          <div className="premium-card p-5">
            <h2 className="fw-bold mb-4">About CSS Minifier & Beautifier</h2>
            <div className="row g-4">
              <div className="col-md-7">
                <p className="text-muted" style={{lineHeight: '1.8'}}>
                  This tool helps you optimize and format your CSS code instantly. Use the **Minifier** to remove 
                  unnecessary whitespace and comments, reducing file size for production. Use the **Beautifier** 
                  to make minified code readable and well-indented.
                </p>
                <div className="mt-4">
                  <div className="d-flex align-items-center mb-2">
                    <FaCheck className="text-success me-2" /> <span>Removes comments and redundant semicolons.</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <FaCheck className="text-success me-2" /> <span>Standardizes indentation (2 spaces).</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaCheck className="text-success me-2" /> <span>Optimized for performance and browser-side security.</span>
                  </div>
                </div>
              </div>
              <div className="col-md-5">
                <div className="glass-card p-4 text-center h-100 d-flex flex-column justify-content-center">
                  <div className="display-4 text-primary mb-3">🎨</div>
                  <p className="small text-muted mb-0">Clean, valid, and optimized CSS in seconds.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CSSMinifierBeautifier;
