import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { 
  FaLink, FaCopy, FaTrash, FaExclamationTriangle, 
  FaCheck, FaCode, FaKeyboard, FaGlobe, FaSearch,
  FaLevelDownAlt, FaPuzzlePiece, FaInfoCircle
} from "react-icons/fa";
import "./UrlParser.css";

const UrlParser = () => {
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState("");

  const parseURL = useCallback((urlStr) => {
    if (!urlStr.trim()) return null;
    
    try {
      // Basic validation: ensure protocol is present for URL constructor
      let processedStr = urlStr.trim();
      if (!processedStr.match(/^[a-zA-Z]+:\/\//)) {
        processedStr = "https://" + processedStr;
      }

      const url = new URL(processedStr);
      const params = [];
      url.searchParams.forEach((value, key) => {
        params.push({ key, value });
      });

      return {
        protocol: url.protocol.replace(":", ""),
        hostname: url.hostname,
        port: url.port || (url.protocol === "https:" ? "443" : "80"),
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        origin: url.origin,
        host: url.host,
        params: params,
        pathSegments: url.pathname.split("/").filter(s => s)
      };
    } catch (e) {
      throw new Error("Invalid URL format");
    }
  }, []);

  useEffect(() => {
    if (!input.trim()) {
      setParsed(null);
      setError("");
      return;
    }

    try {
      const data = parseURL(input);
      setParsed(data);
      setError("");
    } catch (e) {
      setError(e.message);
      setParsed(null);
    }
  }, [input, parseURL]);

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!");
    });
  };

  const clearAll = () => {
    setInput("");
    setParsed(null);
    setError("");
    toast.success("Cleared!");
  };

  const loadSample = () => {
    const sample = "https://webzentools.com:8080/tools/developer/url-parser?user_id=4521&theme=dark&ref=github#preview";
    setInput(sample);
    toast.success("Sample URL loaded.");
  };

  return (
    <div className="url-tool-bg">
      <div className="container tool-content py-4">
        
        <div className="row g-4 justify-content-center">
          {/* INPUT PANEL */}
          <div className="col-12">
            <div className="premium-card p-4 mb-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center">
                <FaLink className="text-primary me-2" /> Enter URL
              </h5>
              <div className="d-flex gap-3">
                <input 
                  type="text" 
                  className={`form-control premium-input url-input-field ${error ? 'border-danger' : ''}`}
                  placeholder="https://example.com/path?name=value#anchor"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button className="btn btn-action" onClick={loadSample} title="Sample Data">
                  <FaKeyboard /> <span className="d-none d-md-inline ms-1">Sample</span>
                </button>
                <button className="btn btn-action text-danger" onClick={clearAll} title="Clear">
                  <FaTrash />
                </button>
              </div>
              {error && (
                <div className="error-msg mt-2 text-danger small d-flex align-items-center">
                  <FaExclamationTriangle className="me-2" /> {error}
                </div>
              )}
            </div>
          </div>

          {parsed && (
            <>
              {/* CORE COMPONENTS GRID */}
              <div className="col-12">
                <div className="row g-4">
                  {[
                    { label: "Protocol", value: parsed.protocol, icon: <FaGlobe />, color: "text-primary" },
                    { label: "Hostname", value: parsed.hostname, icon: <FaGlobe />, color: "text-success" },
                    { label: "Port", value: parsed.port, icon: <FaPuzzlePiece />, color: "text-warning" },
                    { label: "Hash", value: parsed.hash || "none", icon: <FaLevelDownAlt />, color: "text-info" },
                  ].map((item, idx) => (
                    <div key={idx} className="col-md-6 col-lg-3">
                      <div className="premium-card p-3 h-100 component-card">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                           <span className="small text-muted">{item.label}</span>
                           <span className={item.color}>{item.icon}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-end">
                           <div className="fw-bold truncate-text pe-2">{item.value}</div>
                           <button className="btn-copy-small" onClick={() => handleCopy(item.value)}><FaCopy /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MAIN CONTENT AREA */}
              <div className="col-lg-7">
                {/* PATH Breakdown */}
                <div className="premium-card p-4 mb-4">
                  <h6 className="fw-bold mb-3 d-flex align-items-center">
                    <FaLevelDownAlt className="text-primary me-2" /> Path Segments
                  </h6>
                  <div className="path-segment-list d-flex flex-wrap gap-2">
                     <span className="path-slash">/</span>
                     {parsed.pathSegments.length > 0 ? (
                       parsed.pathSegments.map((seg, i) => (
                         <React.Fragment key={i}>
                            <div className="segment-pill">{seg}</div>
                            {i < parsed.pathSegments.length - 1 && <span className="path-slash">/</span>}
                         </React.Fragment>
                       ))
                     ) : (
                       <span className="text-muted small">root</span>
                     )}
                  </div>
                  <div className="mt-4 pt-3 border-top border-light-subtle d-flex justify-content-between align-items-center">
                     <code className="text-muted small">{parsed.pathname}</code>
                     <button className="btn-copy-small" onClick={() => handleCopy(parsed.pathname)}><FaCopy /></button>
                  </div>
                </div>

                {/* QUERY PARAMETERS */}
                <div className="premium-card p-4">
                  <h6 className="fw-bold mb-3 d-flex align-items-center">
                    <FaSearch className="text-primary me-2" /> Query Parameters ({parsed.params.length})
                  </h6>
                  <div className="param-container">
                    {parsed.params.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-borderless custom-table m-0">
                          <thead>
                            <tr>
                              <th className="small text-muted">Key</th>
                              <th className="small text-muted">Value</th>
                              <th className="text-end"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {parsed.params.map((p, idx) => (
                              <tr key={idx}>
                                <td className="fw-bold text-primary">{p.key}</td>
                                <td className="text-muted">{p.value}</td>
                                <td className="text-end">
                                   <button className="btn-copy-small" onClick={() => handleCopy(p.value)}><FaCopy /></button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted small">
                         No query parameters found in this URL.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SIDEBAR JSON BREAKDOWN */}
              <div className="col-lg-5">
                <div className="premium-card p-4 h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold m-0 d-flex align-items-center">
                      <FaCode className="text-primary me-2" /> JSON Structure
                    </h6>
                    <button className="btn btn-sm btn-action" onClick={() => handleCopy(JSON.stringify(parsed, null, 2))}>
                      <FaCopy />
                    </button>
                  </div>
                  <pre className="url-json-output">
                    {JSON.stringify(parsed, null, 2)}
                  </pre>
                </div>
              </div>
            </>
          )}

          {!parsed && !error && (
            <div className="col-12 text-center py-5 opacity-50">
               <FaInfoCircle size={40} className="mb-3" />
               <p>Paste a URL above to see its detailed decomposition and query parameters.</p>
            </div>
          )}
        </div>

        {/* ABOUT TOOL */}
        <section className="about-tool mt-5 pt-4">
           <div className="premium-card p-5">
              <h2 className="fw-bold mb-4">Deconstruct Any Link</h2>
              <div className="row g-4">
                 <div className="col-md-7">
                    <p className="text-muted" style={{lineHeight: '1.8'}}>
                       The URL Parser tool allows you to break down a Uniform Resource Locator into its 
                       base components. This is essential for debugging web applications, analyzing 
                       tracking parameters, and understanding how data is being passed between pages.
                    </p>
                    <div className="mt-4">
                       <div className="d-flex align-items-center mb-2">
                          <FaCheck className="text-success me-2" /> <span>Identify protocol, port, and subdomains instantly.</span>
                       </div>
                       <div className="d-flex align-items-center mb-2">
                          <FaCheck className="text-success me-2" /> <span>Inspect complex query strings in a structured table.</span>
                       </div>
                       <div className="d-flex align-items-center">
                          <FaCheck className="text-success me-2" /> <span>Verify path segments and fragment identifiers.</span>
                       </div>
                    </div>
                 </div>
                 <div className="col-md-5">
                    <div className="glass-card p-4 text-center h-100 d-flex flex-column justify-content-center">
                       <div className="display-4 text-primary mb-3">🔗</div>
                       <p className="small text-muted mb-0">Built using native browser APIs for maximum accuracy and security.</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default UrlParser;
