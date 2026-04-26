import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { 
  FaEdit, FaCopy, FaDownload, FaExclamationTriangle, 
  FaCheck, FaTrash, FaUndo, FaFileImport, 
  FaExchangeAlt, FaLink, FaKeyboard 
} from "react-icons/fa";
import "./Base64EncodeDecode.css";

const Base64EncodeDecode = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("encode"); // 'encode' or 'decode'
  const [urlSafe, setUrlSafe] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const encodeBase64 = useCallback((str, safe) => {
    try {
      // UTF-8 friendly encoding
      const bytes = new TextEncoder().encode(str);
      const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
      let base64 = btoa(binString);
      
      if (safe) {
        base64 = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      }
      return base64;
    } catch (err) {
      throw new Error("Failed to encode: " + err.message);
    }
  }, []);

  const decodeBase64 = useCallback((str, safe) => {
    try {
      let base64 = str;
      if (safe) {
        base64 = base64.replace(/-/g, "+").replace(/_/g, "/");
        while (base64.length % 4) base64 += "=";
      }
      
      const binString = atob(base64);
      const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    } catch (err) {
      throw new Error("Invalid Base64 string");
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
      if (mode === "encode") {
        setOutput(encodeBase64(input, urlSafe));
      } else {
        setOutput(decodeBase64(input, urlSafe));
      }
    } catch (e) {
      setError(e.message);
      setOutput("");
    }
  }, [input, mode, urlSafe, encodeBase64, decodeBase64]);

  useEffect(() => {
    if (autoUpdate) {
      const timer = setTimeout(process, 300);
      return () => clearTimeout(timer);
    }
  }, [input, mode, urlSafe, autoUpdate, process]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      const stripped = base64.split(",")[1] || base64;
      setInput(stripped);
      setMode("decode"); // Usually when you upload a file as base64, you want to decode it or see it. 
      // But wait, if they upload a BINARY file, they want to ENCODE it.
      setInput(base64); // Full data URI
      setMode("decode");
      toast.success("File loaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleAction = () => {
    process();
    if (!error && input.trim()) {
      toast.success(`${mode === "encode" ? "Encoded" : "Decoded"} successfully!`);
    } else if (error) {
      toast.error(error);
    }
  };

  const swap = () => {
    if (output) {
      setInput(output);
      setMode(mode === "encode" ? "decode" : "encode");
      setOutput("");
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    setFileName("");
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
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `base64_${mode}_result.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Result downloaded!");
  };

  const loadSample = () => {
    if (mode === "encode") {
      setInput("WebZenTools - The Ultimate All-in-One Developer Platform! 🚀");
    } else {
      setInput("V2ViWmVuVG9vbHMgLSBUaGUgVWx0aW1hdGUgQWxsLWluLU9uZSBEZXZlbG9wZXIgUGxhdGZvcm0hIA==");
    }
    toast.success("Sample data loaded.");
  };

  return (
    <div className="base64-tool-bg">
      

      <div className="container tool-content">

        <div className="row g-4 justify-content-center">
          {/* CONTROL PANEL */}
          <div className="col-12">
            <div className="premium-card p-3 mb-4 control-strip">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="btn-group premium-toggle" role="group">
                  <button 
                    className={`btn ${mode === "encode" ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setMode("encode")}
                  >
                    <FaEdit className="me-2" /> Encode
                  </button>
                  <button 
                    className={`btn ${mode === "decode" ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setMode("decode")}
                  >
                    <FaCheck className="me-2" /> Decode
                  </button>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="form-check form-switch premium-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="urlSafeSwitch" 
                      checked={urlSafe}
                      onChange={(e) => setUrlSafe(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="urlSafeSwitch">
                      <FaLink className="me-1 opacity-75" /> URL Safe
                    </label>
                  </div>
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
                  <button className="btn btn-action" onClick={loadSample} title="Load Sample Data">
                    <FaKeyboard /> <span className="d-none d-md-inline ms-1">Sample</span>
                  </button>
                  <button className="btn btn-action text-danger" onClick={clearAll} title="Clear All">
                    <FaTrash /> <span className="d-none d-md-inline ms-1">Clear</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* INPUT SECTION */}
          <div className="col-lg-6">
            <div className="premium-card h-100 p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold m-0 d-flex align-items-center">
                  Input {mode === "encode" ? "Text" : "Base64"}
                </h5>
                <div className="file-input-wrapper">
                  <label className="btn btn-sm btn-outline-primary m-0">
                    <FaFileImport className="me-1" /> {fileName ? "Change" : "Upload File"}
                    <input type="file" onChange={handleFileChange} hidden />
                  </label>
                </div>
              </div>
              {fileName && <div className="file-name-badge mb-2">📁 {fileName}</div>}
              <textarea
                className={`form-control premium-input ${error ? 'border-danger' : ''}`}
                rows={12}
                placeholder={mode === "encode" ? "Enter text here..." : "Enter Base64 string here..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              {error && (
                <div className="error-msg mt-2 d-flex align-items-center text-danger">
                  <FaExclamationTriangle className="me-2" /> {error}
                </div>
              )}
              <div className="mt-3 d-flex gap-2">
                {!autoUpdate && (
                  <button className="btn btn-primary w-100" onClick={handleAction}>
                    {mode === "encode" ? "Encode Now" : "Decode Now"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* SWAP ICON (Desktop Only) */}
          <div className="col-12 d-lg-none text-center">
             <button className="btn btn-swap-mobile" onClick={swap}>
                <FaExchangeAlt />
             </button>
          </div>

          {/* OUTPUT SECTION */}
          <div className="col-lg-6">
            <div className="premium-card h-100 p-4 output-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold m-0">Result</h5>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-sm btn-action" 
                    onClick={handleCopy} 
                    disabled={!output}
                    title="Copy Result"
                  >
                    <FaCopy />
                  </button>
                  <button 
                    className="btn btn-sm btn-action" 
                    onClick={handleDownload} 
                    disabled={!output}
                    title="Download Result"
                  >
                    <FaDownload />
                  </button>
                  <button 
                    className="btn btn-sm btn-action" 
                    onClick={swap} 
                    disabled={!output}
                    title="Swap Input/Output"
                  >
                    <FaExchangeAlt />
                  </button>
                </div>
              </div>
              <div className="result-container">
                <pre className="premium-output">
                  {output || "Output will appear here..."}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT TOOL */}
        <section className="about-tool mt-5 pt-4">
          <div className="premium-card p-5">
            <h2 className="section-title">What is Base64?</h2>
            <div className="row mt-4">
              <div className="col-md-8">
                <p className="text-muted leading-relaxed">
                  Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. 
                  It is commonly used to embed image data in HTML/CSS or to transmit binary data over systems that 
                  only handle text properly.
                </p>
                <div className="feature-list mt-4">
                  <div className="feature-item">
                    <FaCheck className="text-success me-2" />
                    <span><strong>Security:</strong> All processing happens in your browser. No data is sent to our servers.</span>
                  </div>
                  <div className="feature-item mt-2">
                    <FaCheck className="text-success me-2" />
                    <span><strong>UTF-8 Support:</strong> Handles emojis and special characters correctly across all languages.</span>
                  </div>
                  <div className="feature-item mt-2">
                    <FaCheck className="text-success me-2" />
                    <span><strong>URL Safe:</strong> Converts +, / to -, _ respectively for safe usage in URL components.</span>
                  </div>
                </div>
              </div>
              <div className="col-md-4 d-none d-md-flex align-items-center justify-content-center">
                <div className="info-icon-box">
                  <FaEdit size={40} className="text-primary mb-3" />
                  <span className="small text-muted text-center d-block">Developer Tool</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Base64EncodeDecode;
