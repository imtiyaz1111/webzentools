import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { FaCheck, FaCopy, FaDownload, FaEdit, FaExclamationTriangle } from "react-icons/fa";
import "./JSONFormatterValidator.css";

const JSONFormatterValidator = () => {
  const [rawJson, setRawJson] = useState("");
  const [formattedJson, setFormattedJson] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFormat = () => {
    setErrorMsg("");
    try {
      const parsed = JSON.parse(rawJson);
      const pretty = JSON.stringify(parsed, null, 2);
      setFormattedJson(pretty);
      toast.success("JSON formatted successfully!");
    } catch (e) {
      setErrorMsg(e.message);
      toast.error(`Invalid JSON: ${e.message}`);
    }
  };

  const handleCopy = () => {
    if (!formattedJson) return;
    navigator.clipboard.writeText(formattedJson).then(() => {
      toast.success("Copied to clipboard!");
    });
  };

  const handleDownload = () => {
    if (!formattedJson) return;
    const blob = new Blob([formattedJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "formatted.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  };

  return (
    <div className="json-tool-container">
      {/* TOOL PANELS */}
      <div className="row g-4">
        {/* Input Panel */}
        <div className="col-md-12">
          <div className="premium-card p-4 glass-card border-0 mb-4 rounded-4">
            <h4 className="mb-3 fw-bold">Raw JSON</h4>
            <textarea
              className="form-control premium-input json-textarea border-0 bg-light p-3"
              rows={10}
              placeholder="Paste your JSON here..."
              value={rawJson}
              onChange={(e) => setRawJson(e.target.value)}
              aria-label="Raw JSON input"
              style={{ fontFamily: 'monospace', resize: 'vertical', borderRadius: '12px' }}
            />
            {errorMsg && (
              <div className="mt-2 text-danger small d-flex align-items-center">
                <FaExclamationTriangle className="me-1" /> {errorMsg}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="col-md-12 mb-4">
            <div className="d-flex gap-3 justify-content-center flex-wrap">
                <button
                    className="btn btn-primary rounded-pill px-4 py-2 fw-bold"
                    onClick={handleFormat}
                    disabled={loading}
                >
                    <FaEdit className="me-2" /> Format / Validate
                </button>
                <button
                    className="btn btn-outline-success rounded-pill px-4 py-2 fw-bold"
                    onClick={handleCopy}
                    disabled={!formattedJson}
                >
                    <FaCopy className="me-2" /> Copy
                </button>
                <button
                    className="btn btn-outline-primary rounded-pill px-4 py-2 fw-bold"
                    onClick={handleDownload}
                    disabled={!formattedJson}
                >
                    <FaDownload className="me-2" /> Download
                </button>
            </div>
        </div>

        {/* Output Panel */}
        <div className="col-md-12">
          <div className="premium-card p-4 glass-card border-0 rounded-4">
            <h4 className="mb-3 fw-bold">Formatted JSON</h4>
            <div className="json-output-wrapper bg-dark rounded-4 p-4 text-light overflow-auto" style={{ maxHeight: '400px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <pre className="m-0" style={{ fontSize: '0.9rem', color: '#8be9fd' }}>
                    {formattedJson || "// Formatted JSON will appear here..."}
                </pre>
            </div>
          </div>
        </div>
      </div>

      {/* TOOL DETAILS SECTION */}
      <div className="mt-5 pt-5 border-top border-secondary border-opacity-10">
        <h2 className="fw-bold mb-4">About This Tool</h2>
        <p className="text-muted" style={{ lineHeight: "1.8" }}>
          The JSON Formatter &amp; Validator helps developers quickly clean up and verify JSON payloads. It provides instant syntax checking, pretty‑printing with proper indentation, and easy copy/download options, all wrapped in a sleek, responsive UI.
        </p>
        <h3 className="fw-bold mt-4 h5">Key Features</h3>
        <ul className="list-unstyled row g-3 mt-3">
          <li className="col-md-6 d-flex align-items-center text-muted">
            <FaCheck className="text-success me-3" /> Real‑time syntax validation
          </li>
          <li className="col-md-6 d-flex align-items-center text-muted">
            <FaCheck className="text-success me-3" /> 2‑space pretty-printing
          </li>
          <li className="col-md-6 d-flex align-items-center text-muted">
            <FaCheck className="text-success me-3" /> Copy to clipboard
          </li>
          <li className="col-md-6 d-flex align-items-center text-muted">
            <FaCheck className="text-success me-3" /> Download as .json file
          </li>
        </ul>
      </div>
    </div>
  );
};

export default JSONFormatterValidator;
