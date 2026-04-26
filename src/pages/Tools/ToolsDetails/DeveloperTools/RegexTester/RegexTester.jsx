import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { 
  FaSearch, FaCopy, FaTrash, FaExclamationTriangle, 
  FaKeyboard, FaInfoCircle
} from "react-icons/fa";
import "./RegexTester.css";

const RegexTester = () => {
  const [pattern, setPattern] = useState("\\w+");
  const [text, setText] = useState("Hello WebZenTools! Test your Regex here.");
  const [flags, setFlags] = useState({
    g: true,
    i: false,
    m: false,
    s: false,
    u: false
  });
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const [highlightedHtml, setHighlightedHtml] = useState("");

  const toggleFlag = (flag) => {
    setFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
  };

  const getFlagsString = useCallback(() => {
    return Object.keys(flags).filter(f => flags[f]).join("");
  }, [flags]);

  const testRegex = useCallback(() => {
    if (!pattern) {
      setMatches([]);
      setHighlightedHtml(text);
      setError("");
      return;
    }

    try {
      const regex = new RegExp(pattern, getFlagsString());
      setError("");

      const foundMatches = [];
      let match;
      
      // Use a local copy to avoid infinite loops with global flag
      const tempText = text;

      if (flags.g) {
        while ((match = regex.exec(tempText)) !== null) {
          if (match.index === regex.lastIndex) regex.lastIndex++; // Avoid infinite loops for zero-width matches
          foundMatches.push({
            index: match.index,
            value: match[0],
            groups: match.slice(1)
          });
        }
      } else {
        match = regex.exec(tempText);
        if (match) {
          foundMatches.push({
            index: match.index,
            value: match[0],
            groups: match.slice(1)
          });
        }
      }

      setMatches(foundMatches);

      // Generate Highlighted HTML
      let lastIndex = 0;
      let html = "";
      foundMatches.forEach((m, i) => {
        html += escapeHtml(tempText.substring(lastIndex, m.index));
        html += `<span class="match-highlight" title="Match ${i+1}">${escapeHtml(m.value)}</span>`;
        lastIndex = m.index + m.value.length;
      });
      html += escapeHtml(tempText.substring(lastIndex));
      setHighlightedHtml(html);

    } catch (err) {
      setError(err.message);
      setMatches([]);
      setHighlightedHtml(escapeHtml(text));
    }
  }, [pattern, text, flags, getFlagsString]);

  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  useEffect(() => {
    testRegex();
  }, [testRegex]);

  const clearAll = () => {
    setPattern("");
    setText("");
    setMatches([]);
    toast.success("Cleared everything!");
  };

  const handleCopyPattern = () => {
    if (!pattern) return;
    navigator.clipboard.writeText(`/${pattern}/${getFlagsString()}`).then(() => {
      toast.success("Regex pattern copied!");
    });
  };

  const loadSample = () => {
    setPattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
    setText("Contact us at support@webzentools.com or admin@example.org for help.");
    toast.success("Sample Email Regex loaded.");
  };

  return (
    <div className="regex-tool-bg">
      <div className="container tool-content py-4">
        
        <div className="row g-4">
          {/* REGEX INPUT PANEL */}
          <div className="col-12">
            <div className="premium-card p-4 mb-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center">
                <FaSearch className="text-primary me-2" /> Regex Pattern
              </h5>
              <div className="d-flex flex-wrap align-items-center gap-3">
                <div className="regex-input-group flex-grow-1">
                  <span className="regex-slash">/</span>
                  <input 
                    type="text" 
                    className={`form-control premium-input regex-pattern-input ${error ? 'border-danger' : ''}`}
                    placeholder="Enter regex pattern here..."
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                  />
                  <span className="regex-slash">/</span>
                  <span className="regex-flags-preview">{getFlagsString()}</span>
                </div>

                <div className="flags-group d-flex gap-2">
                  {Object.keys(flags).map(f => (
                    <button 
                      key={f}
                      className={`btn btn-sm flag-btn ${flags[f] ? 'active' : ''}`}
                      onClick={() => toggleFlag(f)}
                      title={`Flag: ${f}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-action" onClick={loadSample} title="Sample Data">
                    <FaKeyboard /> <span className="d-none d-md-inline ms-1">Sample</span>
                  </button>
                  <button className="btn btn-action" onClick={handleCopyPattern} title="Copy Full Regex">
                    <FaCopy />
                  </button>
                  <button className="btn btn-action text-danger" onClick={clearAll} title="Clear">
                    <FaTrash />
                  </button>
                </div>
              </div>
              {error && (
                <div className="error-msg mt-2 text-danger small d-flex align-items-center">
                  <FaExclamationTriangle className="me-2" /> {error}
                </div>
              )}
            </div>
          </div>

          {/* MAIN WORKSPACE */}
          <div className="col-lg-8">
            <div className="premium-card h-100 p-4">
              <h5 className="fw-bold mb-3">Test String</h5>
              <div className="regex-workspace">
                {/* Overlay for highlighting */}
                <div 
                  className="highlights-layer premium-input"
                  dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                ></div>
                <textarea
                  className="form-control premium-input regex-textarea"
                  rows={12}
                  placeholder="Paste text to test the regex against..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* RESULTS SIDEBAR */}
          <div className="col-lg-4">
            <div className="premium-card h-100 p-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center justify-content-between">
                <span>Match Results</span>
                <span className="badge bg-primary rounded-pill">{matches.length}</span>
              </h5>
              
              <div className="match-list-container">
                {matches.length > 0 ? (
                  <div className="match-list">
                    {matches.map((m, i) => (
                      <div key={i} className="match-item p-2 mb-2 rounded border border-light">
                        <div className="d-flex justify-content-between small text-muted mb-1">
                          <span>Match {i + 1}</span>
                          <span>Index: {m.index}</span>
                        </div>
                        <div className="match-value fw-bold text-primary">{m.value}</div>
                        {m.groups.length > 0 && (
                          <div className="match-groups mt-1 pt-1 border-top border-light-subtle">
                            {m.groups.map((g, gi) => (
                              <div key={gi} className="small text-muted">Group {gi+1}: {g || 'null'}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5 text-muted">
                    <FaInfoCircle className="d-block mx-auto mb-2 opacity-50" size={30} />
                    {pattern ? "No matches found." : "Enter a pattern to see matches."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* REGEX CHEATSHEET / ABOUT */}
        <section className="about-tool mt-5">
           <div className="premium-card p-4 p-md-5">
              <h2 className="fw-bold mb-4">Regex Quick Reference</h2>
              <div className="row g-4">
                 <div className="col-md-4">
                    <h6 className="fw-bold text-primary mb-3">Character Classes</h6>
                    <ul className="list-unstyled small text-muted">
                       <li className="mb-2"><code>.</code> - Any character except newline</li>
                       <li className="mb-2"><code>\w</code> - Word character (a-z, A-Z, 0-9, _)</li>
                       <li className="mb-2"><code>\d</code> - Digit (0-9)</li>
                       <li className="mb-2"><code>\s</code> - Whitespace (space, tab, newline)</li>
                    </ul>
                 </div>
                 <div className="col-md-4">
                    <h6 className="fw-bold text-primary mb-3">Quantifiers</h6>
                    <ul className="list-unstyled small text-muted">
                       <li className="mb-2"><code>*</code> - 0 or more</li>
                       <li className="mb-2"><code>+</code> - 1 or more</li>
                       <li className="mb-2"><code>?</code> - 0 or 1</li>
                       <li className="mb-2"><code>{`{n}`}</code> - Exactly n times</li>
                    </ul>
                 </div>
                 <div className="col-md-4">
                    <h6 className="fw-bold text-primary mb-3">Anchors & Logic</h6>
                    <ul className="list-unstyled small text-muted">
                       <li className="mb-2"><code>^</code> - Start of string</li>
                       <li className="mb-2"><code>$</code> - End of string</li>
                       <li className="mb-2"><code>|</code> - Alternation (OR)</li>
                       <li className="mb-2"><code>( )</code> - Capturing group</li>
                    </ul>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default RegexTester;
