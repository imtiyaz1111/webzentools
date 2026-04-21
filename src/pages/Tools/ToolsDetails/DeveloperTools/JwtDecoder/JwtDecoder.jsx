import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { 
  FaShieldAlt, FaCopy, FaTrash, FaExclamationTriangle, 
  FaCheck, FaUnlockAlt, FaInfoCircle, FaCalendarAlt,
  FaKey, FaGlobe, FaClock 
} from "react-icons/fa";
import "./JwtDecoder.css";

const JwtDecoder = () => {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState(null);
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState("");

  const decodeTokenPart = (part) => {
    try {
      const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  };

  const processToken = useCallback(() => {
    if (!token.trim()) {
      setHeader(null);
      setPayload(null);
      setError("");
      return;
    }

    const parts = token.trim().split(".");
    if (parts.length !== 3) {
      setError("Invalid JWT format. A token must have 3 parts separated by dots.");
      setHeader(null);
      setPayload(null);
      return;
    }

    const decodedHeader = decodeTokenPart(parts[0]);
    const decodedPayload = decodeTokenPart(parts[1]);

    if (!decodedHeader || !decodedPayload) {
      setError("Failed to decode token parts. Please ensure the token is a valid Base64Url encoded string.");
      setHeader(null);
      setPayload(null);
    } else {
      setHeader(decodedHeader);
      setPayload(decodedPayload);
      setError("");
    }
  }, [token]);

  useEffect(() => {
    processToken();
  }, [token, processToken]);

  const clearAll = () => {
    setToken("");
    setHeader(null);
    setPayload(null);
    setError("");
    toast.success("Cleared!");
  };

  const handleCopy = (data) => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
      toast.success("Copied to clipboard!");
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const loadSample = () => {
    // Standard HS256 sample token
    const sample = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    setToken(sample);
    toast.success("Sample token loaded.");
  };

  return (
    <div className="jwt-tool-bg">
      <div className="container tool-content py-4">
        
        <div className="row g-4 justify-content-center">
          {/* INPUT PANEL */}
          <div className="col-12">
            <div className="premium-card p-4 mb-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center">
                <FaUnlockAlt className="text-primary me-2" /> Encoded Token
              </h5>
              <textarea
                className={`form-control premium-input token-input ${error ? 'border-danger' : ''}`}
                rows={6}
                placeholder="Paste your JWT token here..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="d-flex gap-2">
                  <button className="btn btn-action" onClick={loadSample}>
                    <FaInfoCircle className="me-1" /> Sample
                  </button>
                  <button className="btn btn-action text-danger" onClick={clearAll}>
                    <FaTrash />
                  </button>
                </div>
                <div className="security-tag small text-muted">
                   <FaShieldAlt className="me-1" /> Decoded locally in browser
                </div>
              </div>
              {error && (
                <div className="error-msg mt-3 text-danger small d-flex align-items-center">
                  <FaExclamationTriangle className="me-2" /> {error}
                </div>
              )}
            </div>
          </div>

          {/* DECODED PANELS */}
          <div className="col-lg-7">
            <div className="row g-4">
              {/* HEADER */}
              <div className="col-12">
                <div className="premium-card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold m-0 text-header">HEADER: <small className="opacity-50">ALGORITHM & TOKEN TYPE</small></h5>
                    <button className="btn btn-sm btn-action" onClick={() => handleCopy(header)} disabled={!header}>
                      <FaCopy />
                    </button>
                  </div>
                  <pre className="premium-output header-output">
                    {header ? JSON.stringify(header, null, 2) : "// Header content..."}
                  </pre>
                </div>
              </div>

              {/* PAYLOAD */}
              <div className="col-12">
                <div className="premium-card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold m-0 text-payload">PAYLOAD: <small className="opacity-50">DATA</small></h5>
                    <button className="btn btn-sm btn-action" onClick={() => handleCopy(payload)} disabled={!payload}>
                      <FaCopy />
                    </button>
                  </div>
                  <pre className="premium-output payload-output">
                    {payload ? JSON.stringify(payload, null, 2) : "// Payload content..."}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR METADATA */}
          <div className="col-lg-5">
            <div className="premium-card p-4 h-100">
               <h5 className="fw-bold mb-4">Token Insights</h5>
               {payload ? (
                 <div className="insight-list">
                    <div className="insight-item mb-4">
                       <label className="small text-muted d-flex align-items-center mb-2">
                          <FaKey className="me-2" /> ALGORITHM
                       </label>
                       <div className="fw-bold text-primary">{header?.alg || "N/A"}</div>
                    </div>

                    <div className="insight-item mb-4">
                       <label className="small text-muted d-flex align-items-center mb-2">
                          <FaCalendarAlt className="me-2" /> EXPIRATION TIME
                       </label>
                       <div className={`fw-bold ${payload.exp && payload.exp < Date.now()/1000 ? 'text-danger' : 'text-success'}`}>
                          {formatDate(payload.exp)}
                       </div>
                       {payload.exp && payload.exp < Date.now()/1000 && (
                          <div className="small text-danger mt-1">Token has expired</div>
                       )}
                    </div>

                    <div className="insight-item mb-4">
                       <label className="small text-muted d-flex align-items-center mb-2">
                          <FaClock className="me-2" /> ISSUED AT
                       </label>
                       <div className="fw-bold">{formatDate(payload.iat)}</div>
                    </div>

                    {payload.iss && (
                      <div className="insight-item mb-4">
                        <label className="small text-muted d-flex align-items-center mb-2">
                            <FaGlobe className="me-2" /> ISSUER
                        </label>
                        <div className="fw-bold">{payload.iss}</div>
                      </div>
                    )}

                    <div className="insight-item">
                       <label className="small text-muted d-flex align-items-center mb-2">
                          <FaInfoCircle className="me-2" /> STRUCTURE
                       </label>
                       <div className="token-visualizer d-flex gap-1 mt-2">
                          <div className="v-part header">Header</div>
                          <div className="v-part payload">Payload</div>
                          <div className="v-part signature">Signature</div>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="text-center py-5 opacity-50">
                    <FaShieldAlt size={50} className="mb-3" />
                    <p>Paste a token to see advanced insights and claims breakdown.</p>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* EDUCATIONAL SECTION */}
        <section className="about-tool mt-5 pt-4">
           <div className="premium-card p-5">
              <h2 className="fw-bold mb-4">About JSON Web Tokens</h2>
              <div className="row g-4">
                 <div className="col-md-7">
                    <p className="text-muted" style={{lineHeight: '1.8'}}>
                       JSON Web Token (JWT) is an open standard that defines a compact and self-contained 
                       way for securely transmitting information between parties as a JSON object. This 
                       information can be verified and trusted because it is digitally signed.
                    </p>
                    <div className="mt-4">
                       <div className="d-flex align-items-center mb-2">
                          <FaCheck className="text-success me-2" /> <span><strong>Stateless:</strong> Everything needed is inside the token.</span>
                       </div>
                       <div className="d-flex align-items-center mb-2">
                          <FaCheck className="text-success me-2" /> <span><strong>Portable:</strong> Can be used in URLs, HTTP headers, etc.</span>
                       </div>
                       <div className="d-flex align-items-center">
                          <FaCheck className="text-success me-2" /> <span><strong>Safe:</strong> Decoding happens locally; your token never reaches our servers.</span>
                       </div>
                    </div>
                 </div>
                 <div className="col-md-5">
                    <div className="glass-card p-4 text-center h-100 d-flex flex-column justify-content-center">
                       <div className="display-4 text-primary mb-3">🛡️</div>
                       <p className="small text-muted mb-0">Our tool only decodes your token. It does not store or share your data.</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default JwtDecoder;
