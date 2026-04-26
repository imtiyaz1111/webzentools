import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { 
  FaDatabase, FaCopy, FaDownload, FaTrash, 
  FaCheck, FaKeyboard, FaCode, FaExclamationTriangle
} from "react-icons/fa";
import "./SqlFormatter.css";

const SqlFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [error, setError] = useState("");

  const formatSQL = useCallback((sql) => {
    if (!sql.trim()) return "";
    
    try {
      let formatted = sql
        .replace(/\s+/g, " ") // Collapse all whitespace
        .trim();

      const keywords = [
        "SELECT", "FROM", "WHERE", "AND", "OR", "JOIN", "LEFT JOIN", 
        "RIGHT JOIN", "INNER JOIN", "GROUP BY", "ORDER BY", "HAVING", 
        "LIMIT", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE", 
        "CREATE TABLE", "DROP TABLE", "ALTER TABLE", "ON", "UNION"
      ];

      // Replace keywords with capitalized versions and newlines
      keywords.forEach(key => {
        const regex = new RegExp(`\\b${key}\\b`, "gi");
        formatted = formatted.replace(regex, `\n${key.toUpperCase()}`);
      });

      // Basic Indentation
      let lines = formatted.split("\n");
      let result = "";
      let indentLevel = 0;

      lines.forEach(line => {
        line = line.trim();
        if (!line) return;

        // Simple indentation logic
        if (line.match(/^(\)|END)/i)) indentLevel = Math.max(0, indentLevel - 1);
        
        result += "  ".repeat(indentLevel) + line + "\n";
        
        if (line.match(/^(\(|CASE|SELECT|CREATE|UPDATE|DELETE|INSERT)/i)) indentLevel++;
        // Reset or adjust for SQL specific clauses if needed
        if (line.match(/^(FROM|WHERE|JOIN|GROUP|ORDER|LIMIT|SET|VALUES)/i)) {
           // These usually start new lines but don't necessarily increase indent significantly in this simple version
        }
      });

      return result.trim();
    } catch (err) {
      throw new Error("Formatting failed: " + err.message);
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
      setOutput(formatSQL(input));
    } catch (err) {
      setError(err.message);
      setOutput("");
    }
  }, [input, formatSQL]);

  useEffect(() => {
    if (autoUpdate) {
      const timer = setTimeout(process, 300);
      return () => clearTimeout(timer);
    }
  }, [input, autoUpdate, process]);

  const handleAction = () => {
    process();
    if (!error && input.trim()) {
      toast.success("SQL formatted successfully!");
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
    const blob = new Blob([output], { type: "text/x-sql" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "query.sql";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  };

  const loadSample = () => {
    const sample = `select users.id, users.name, orders.total from users left join orders on users.id = orders.user_id where orders.total > 500 and users.status = 'active' order by orders.total desc limit 10;`;
    setInput(sample);
    toast.success("Sample SQL loaded.");
  };

  return (
    <div className="sql-tool-bg">
      <div className="container tool-content py-4">
        
        <div className="row g-4 justify-content-center">
          {/* CONTROL STRIP */}
          <div className="col-12">
            <div className="premium-card p-3 mb-4 control-strip">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-3">
                   <h5 className="m-0 fw-bold d-flex align-items-center text-primary">
                      <FaDatabase className="me-2" /> SQL Beautifier
                   </h5>
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
                Input SQL Query
              </h5>
              <textarea
                className={`form-control premium-input sql-textarea ${error ? 'border-danger' : ''}`}
                rows={16}
                placeholder="Paste your messy SQL query here..."
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
                  Format SQL
                </button>
              )}
            </div>
          </div>

          {/* OUTPUT SECTION */}
          <div className="col-lg-6">
            <div className="premium-card h-100 p-4 output-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold m-0 d-flex align-items-center">
                  <FaCode className="text-primary me-2" /> Pretty SQL
                </h5>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-action" onClick={handleCopy} disabled={!output} title="Copy">
                    <FaCopy />
                  </button>
                  <button className="btn btn-sm btn-action" onClick={handleDownload} disabled={!output} title="Download">
                    <FaDownload />
                  </button>
                </div>
              </div>
              <div className="result-container h-100">
                <pre className="premium-output sql-output">
                  {output || "-- Formatted SQL will appear here..."}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT TOOL */}
        <section className="about-tool mt-5 pt-4">
          <div className="premium-card p-5">
            <h2 className="fw-bold mb-4">Clean Up Your Queries</h2>
            <div className="row g-4">
              <div className="col-md-7">
                <p className="text-muted" style={{lineHeight: '1.8'}}>
                  This SQL Formatter helps you transform messy, one-line database queries into readable, 
                  well-structured code. It standardizes keywords, applies consistent indentation, and 
                  prepares your SQL for documentation or peer review.
                </p>
                <div className="mt-4">
                  <div className="d-flex align-items-center mb-2">
                    <FaCheck className="text-success me-2" /> <span>Standardizes keywords (SELECT, FROM, JOIN).</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <FaCheck className="text-success me-2" /> <span>Consistent indentation for complex clauses.</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaCheck className="text-success me-2" /> <span>Secure local processing in your browser.</span>
                  </div>
                </div>
              </div>
              <div className="col-md-5">
                <div className="glass-card p-4 text-center h-100 d-flex flex-column justify-content-center">
                  <div className="display-4 text-primary mb-3">💾</div>
                  <p className="small text-muted mb-0">Prepare your database scripts for production with ease.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SqlFormatter;
