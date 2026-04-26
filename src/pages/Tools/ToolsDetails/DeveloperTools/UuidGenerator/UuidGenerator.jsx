import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { 
  FaFingerprint, FaCopy, FaDownload, FaSync, 
  FaTrash, FaCheck, FaSortNumericDown
} from "react-icons/fa";
import "./UuidGenerator.css";

const UuidGenerator = () => {
  const [uuids, setUuids] = useState([]);
  const [quantity, setQuantity] = useState(5);
  const [useHyphens, setUseHyphens] = useState(true);
  const [useUppercase, setUseUppercase] = useState(false);

  const generateSingleUUID = useCallback(() => {
    let uuid = "";
    if (window.crypto && window.crypto.randomUUID) {
      uuid = window.crypto.randomUUID();
    } else {
      // Fallback for older browsers
      uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    if (!useHyphens) uuid = uuid.replace(/-/g, "");
    if (useUppercase) uuid = uuid.toUpperCase();
    return uuid;
  }, [useHyphens, useUppercase]);

  const generateUUIDs = useCallback(() => {
    const newList = [];
    const count = Math.min(Math.max(1, quantity), 100); // Limit 1-100
    for (let i = 0; i < count; i++) {
      newList.push(generateSingleUUID());
    }
    setUuids(newList);
    toast.success(`Generated ${count} UUIDs`);
  }, [quantity, generateSingleUUID]);

  useEffect(() => {
    generateUUIDs();
  }, []); // Generate initial batch

  const handleCopyAll = () => {
    if (uuids.length === 0) return;
    navigator.clipboard.writeText(uuids.join("\n")).then(() => {
      toast.success("All UUIDs copied to clipboard!");
    });
  };

  const handleCopySingle = (uuid) => {
    navigator.clipboard.writeText(uuid).then(() => {
      toast.success("UUID copied!");
    });
  };

  const handleDownload = () => {
    if (uuids.length === 0) return;
    const element = document.createElement("a");
    const file = new Blob([uuids.join("\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "uuids.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Downloaded as uuids.txt");
  };

  const clearAll = () => {
    setUuids([]);
    toast.success("List cleared");
  };

  return (
    <div className="uuid-tool-bg">
      <div className="container tool-content py-4">
        
        <div className="row g-4 justify-content-center">
          {/* CONFIG PANEL */}
          <div className="col-12">
            <div className="premium-card p-4 mb-4">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-4">
                <div className="d-flex align-items-center gap-3 flex-grow-1" style={{ maxWidth: '400px' }}>
                  <div className="input-group premium-input-group">
                    <span className="input-group-text bg-transparent border-0 pe-1">
                      <FaSortNumericDown className="text-primary" />
                    </span>
                    <input 
                      type="number" 
                      className="form-control premium-input border-0 shadow-none ps-2" 
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      min="1"
                      max="100"
                      placeholder="Quantity"
                    />
                  </div>
                  <button className="btn btn-primary d-flex align-items-center gap-2 px-4 whitespace-nowrap" onClick={generateUUIDs}>
                    <FaSync className="sync-icon" /> Generate
                  </button>
                </div>

                <div className="d-flex flex-wrap gap-4 align-items-center">
                  <div className="form-check form-switch premium-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="hyphenSwitch" 
                      checked={useHyphens}
                      onChange={(e) => setUseHyphens(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="hyphenSwitch">Hyphens</label>
                  </div>
                  <div className="form-check form-switch premium-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="upperSwitch" 
                      checked={useUppercase}
                      onChange={(e) => setUseUppercase(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="upperSwitch">Uppercase</label>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-action" onClick={handleCopyAll} title="Copy All">
                    <FaCopy />
                  </button>
                  <button className="btn btn-action" onClick={handleDownload} title="Download All">
                    <FaDownload />
                  </button>
                  <button className="btn btn-action text-danger" onClick={clearAll} title="Clear">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RESULTS LIST */}
          <div className="col-lg-10">
            <div className="premium-card p-4 min-vh-50">
              <h5 className="fw-bold mb-4 d-flex align-items-center">
                <FaFingerprint className="text-primary me-2" /> Generated Identifiers
              </h5>
              
              <div className="uuid-list-container">
                {uuids.length > 0 ? (
                  <div className="uuid-grid">
                    {uuids.map((uuid, index) => (
                      <div key={index} className="uuid-row d-flex align-items-center justify-content-between p-3 mb-2 rounded-4">
                        <code className="uuid-text">{uuid}</code>
                        <button className="btn btn-sm btn-action-small" onClick={() => handleCopySingle(uuid)} title="Copy UUID">
                          <FaCopy size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5 opacity-50">
                    <p>No UUIDs generated yet. Click the button above to start.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <section className="about-tool mt-5">
           <div className="premium-card p-5">
              <h2 className="fw-bold mb-4">Understanding UUIDs</h2>
              <div className="row g-4">
                 <div className="col-md-7">
                    <p className="text-muted" style={{ lineHeight: '1.8' }}>
                      A Universally Unique Identifier (UUID) is a 128-bit label used for information in computer systems. 
                      The term globally unique identifier (GUID) is also used. When generated according to the 
                      standard methods, UUIDs are for practical purposes unique.
                    </p>
                    <div className="mt-4">
                       <div className="d-flex align-items-center mb-3">
                          <FaCheck className="text-success me-2" />
                          <span><strong>Zero Collisions:</strong> For practical purposes, you can assume no two UUIDs will ever be the same.</span>
                       </div>
                       <div className="d-flex align-items-center mb-3">
                          <FaCheck className="text-success me-2" />
                          <span><strong>Privacy First:</strong> Our generator runs entirely on your device. No data is sent to a server.</span>
                       </div>
                       <div className="d-flex align-items-center">
                          <FaCheck className="text-success me-2" />
                          <span><strong>V4 Standard:</strong> We use the Version 4 random-based generation method by default.</span>
                       </div>
                    </div>
                 </div>
                 <div className="col-md-5 d-flex align-items-center justify-content-center">
                    <div className="glass-card p-4 text-center w-100">
                       <FaFingerprint size={60} className="text-primary mb-3 opacity-25" />
                       <p className="small text-muted mb-0">Total UUIDs generated in this session: <span className="fw-bold text-dark">{uuids.length}</span></p>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default UuidGenerator;
