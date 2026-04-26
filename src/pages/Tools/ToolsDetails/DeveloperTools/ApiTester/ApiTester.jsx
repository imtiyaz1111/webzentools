import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
    FaPlay, FaPlus, FaTrash, FaCopy, FaHistory, 
    FaClock, FaDatabase, FaTerminal
} from "react-icons/fa";
import { HiLightningBolt } from "react-icons/hi";
import "./ApiTester.css";

const ApiTester = () => {
    // Request State
    const [method, setMethod] = useState("GET");
    const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
    const [activeTab, setActiveTab] = useState("params");
    
    // Config State
    const [headers, setHeaders] = useState([{ key: "", value: "", active: true }]);
    const [params, setParams] = useState([{ key: "", value: "", active: true }]);
    const [auth, setAuth] = useState({ type: "none", username: "", password: "", token: "" });
    const [bodyType, setBodyType] = useState("none");
    const [bodyRaw, setBodyRaw] = useState("");
    const [bodyFormData, setBodyFormData] = useState([{ key: "", value: "", active: true }]);
    const [bodyUrlEncoded, setBodyUrlEncoded] = useState([{ key: "", value: "", active: true }]);

    // Response State
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [responseTab, setResponseTab] = useState("body");
    const [history, setHistory] = useState([]);

    // Load history from localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem("api_tester_history_v2");
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    const saveToHistory = (requestData) => {
        const entry = {
            ...requestData,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };
        const newHistory = [entry, ...history.filter(h => h.url !== entry.url || h.method !== entry.method).slice(0, 19)];
        setHistory(newHistory);
        localStorage.setItem("api_tester_history_v2", JSON.stringify(newHistory));
    };

    const handleSend = async () => {
        if (!url) {
            toast.error("Please enter a valid URL");
            return;
        }

        setLoading(true);
        setResponse(null);
        const startTime = new Date().getTime();

        try {
            // Prepare headers
            const requestHeaders = {};
            headers.forEach(h => {
                if (h.active && h.key) requestHeaders[h.key] = h.value;
            });

            // Auth
            if (auth.type === "bearer" && auth.token) {
                requestHeaders["Authorization"] = `Bearer ${auth.token}`;
            } else if (auth.type === "basic" && auth.username) {
                const credentials = btoa(`${auth.username}:${auth.password}`);
                requestHeaders["Authorization"] = `Basic ${credentials}`;
            }

            // Prepare params
            const requestParams = {};
            params.forEach(p => {
                if (p.active && p.key) requestParams[p.key] = p.value;
            });

            // Prepare body
            let requestData = null;
            if (method !== "GET") {
                if (bodyType === "raw" && bodyRaw) {
                    try {
                        requestData = JSON.parse(bodyRaw);
                        requestHeaders["Content-Type"] = "application/json";
                    } catch {
                        requestData = bodyRaw;
                    }
                } else if (bodyType === "form-data") {
                    const fd = new FormData();
                    bodyFormData.forEach(b => {
                        if (b.active && b.key) fd.append(b.key, b.value);
                    });
                    requestData = fd;
                } else if (bodyType === "url-encoded") {
                    const data = new URLSearchParams();
                    bodyUrlEncoded.forEach(b => {
                        if (b.active && b.key) data.append(b.key, b.value);
                    });
                    requestData = data;
                    requestHeaders["Content-Type"] = "application/x-www-form-urlencoded";
                }
            }

            const config = {
                method,
                url,
                headers: requestHeaders,
                params: requestParams,
                data: requestData,
                timeout: 15000,
            };

            const res = await axios(config);
            const endTime = new Date().getTime();

            const responseData = {
                status: res.status,
                statusText: res.statusText,
                time: endTime - startTime,
                size: JSON.stringify(res.data).length,
                data: res.data,
                headers: res.headers,
            };

            setResponse(responseData);
            saveToHistory({ 
                method, url, auth, bodyType, bodyRaw, 
                headers: headers.filter(h => h.key), 
                params: params.filter(p => p.key) 
            });
            toast.success("Request completed!");
        } catch (err) {
            const endTime = new Date().getTime();
            setResponse({
                status: err.response?.status || "Error",
                statusText: err.response?.statusText || err.message,
                time: endTime - startTime,
                size: 0,
                data: err.response?.data || { error: err.message },
                headers: err.response?.headers || {},
                isError: true
            });
            toast.error(err.response ? `Error: ${err.response.status}` : "Request failed");
        } finally {
            setLoading(false);
        }
    };

    const generateCurl = () => {
        let curl = `curl --location --request ${method} '${url}'`;
        
        // Params
        const activeParams = params.filter(p => p.active && p.key);
        if (activeParams.length > 0) {
            const q = activeParams.map(p => `${p.key}=${p.value}`).join('&');
            curl = curl.includes('?') ? `${curl}&${q}` : `${curl}?${q}`;
        }

        // Headers
        headers.forEach(h => {
            if (h.active && h.key) curl += ` \\\n--header '${h.key}: ${h.value}'`;
        });

        // Auth
        if (auth.type === 'bearer' && auth.token) curl += ` \\\n--header 'Authorization: Bearer ${auth.token}'`;
        if (auth.type === 'basic') curl += ` \\\n--header 'Authorization: Basic ${btoa(auth.username + ":" + auth.password)}'`;

        // Body
        if (method !== 'GET') {
            if (bodyType === 'raw' && bodyRaw) curl += ` \\\n--data-raw '${bodyRaw}'`;
            else if (bodyType === 'url-encoded') {
                const d = bodyUrlEncoded.filter(b => b.active && b.key).map(b => `${b.key}=${b.value}`).join('&');
                curl += ` \\\n--data-urlencode '${d}'`;
            }
        }

        copyToClipboard(curl);
        toast.success("cURL command copied!");
    };

    const addKV = (setter, state) => setter([...state, { key: "", value: "", active: true }]);
    const removeKV = (setter, state, index) => {
        const newState = [...state];
        newState.splice(index, 1);
        setter(newState.length ? newState : [{ key: "", value: "", active: true }]);
    };
    const updateKV = (setter, state, index, field, value) => {
        const newState = [...state];
        newState[index][field] = value;
        setter(newState);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2));
        toast.success("Copied to clipboard!");
    };

    const loadFromHistory = (item) => {
        setMethod(item.method);
        setUrl(item.url);
        if (item.auth) setAuth(item.auth);
        if (item.headers) setHeaders(item.headers.length ? item.headers : [{ key: "", value: "", active: true }]);
        if (item.params) setParams(item.params.length ? item.params : [{ key: "", value: "", active: true }]);
        if (item.bodyType) setBodyType(item.bodyType);
        if (item.bodyRaw) setBodyRaw(item.bodyRaw);
        toast.info("Request details loaded");
    };

    return (
        <div className="api-tester-container pb-5">
            <div className="api-tester-card">
                {/* REQUEST SECTION */}
                <div className="api-tester-header">
                    <div className="api-url-bar mb-4">
                        <select 
                            className="method-select" 
                            value={method} 
                            onChange={(e) => setMethod(e.target.value)}
                        >
                            {["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"].map(m => <option key={m}>{m}</option>)}
                        </select>
                        <input 
                            type="text" 
                            className="url-input" 
                            placeholder="https://api.example.com/v1/resource"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <button className="btn btn-link text-muted p-2" onClick={generateCurl} title="Copy as cURL">
                            <FaTerminal />
                        </button>
                        <button 
                            className="send-btn" 
                            onClick={handleSend}
                            disabled={loading}
                        >
                            {loading ? <span className="spinner-border spinner-border-sm"></span> : <HiLightningBolt />}
                            Send
                        </button>
                    </div>

                    <div className="api-tabs">
                        {["params", "auth", "headers", "body"].map(tab => (
                            <div 
                                key={tab} 
                                className={`api-tab ${activeTab === tab ? 'active' : ''}`} 
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </div>
                        ))}
                    </div>

                    <div className="tab-content mt-3" style={{ minHeight: '200px' }}>
                        {activeTab === 'params' && (
                            <div className="kv-editor">
                                {params.map((p, i) => (
                                    <div key={i} className="kv-row">
                                        <input type="checkbox" checked={p.active} onChange={(e) => updateKV(setParams, params, i, 'active', e.target.checked)} />
                                        <input type="text" className="kv-input" placeholder="Key" value={p.key} onChange={(e) => updateKV(setParams, params, i, 'key', e.target.value)} />
                                        <input type="text" className="kv-input" placeholder="Value" value={p.value} onChange={(e) => updateKV(setParams, params, i, 'value', e.target.value)} />
                                        <button className="remove-kv-btn" onClick={() => removeKV(setParams, params, i)}><FaTrash size={12} /></button>
                                    </div>
                                ))}
                                <button className="add-kv-btn" onClick={() => addKV(setParams, params)}><FaPlus className="me-2" /> Add Param</button>
                            </div>
                        )}

                        {activeTab === 'auth' && (
                            <div className="auth-container">
                                <select className="form-select auth-type-select mb-3" value={auth.type} onChange={(e) => setAuth({...auth, type: e.target.value})}>
                                    <option value="none">No Auth</option>
                                    <option value="bearer">Bearer Token</option>
                                    <option value="basic">Basic Auth</option>
                                </select>
                                {auth.type === 'bearer' && (
                                    <div className="mb-3">
                                        <label className="small text-muted mb-1">Token</label>
                                        <input type="text" className="form-control premium-input" placeholder="Enter token" value={auth.token} onChange={(e) => setAuth({...auth, token: e.target.value})} />
                                    </div>
                                )}
                                {auth.type === 'basic' && (
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="small text-muted mb-1">Username</label>
                                            <input type="text" className="form-control premium-input" value={auth.username} onChange={(e) => setAuth({...auth, username: e.target.value})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="small text-muted mb-1">Password</label>
                                            <input type="password" className="form-control premium-input" value={auth.password} onChange={(e) => setAuth({...auth, password: e.target.value})} />
                                        </div>
                                    </div>
                                )}
                                {auth.type === 'none' && <p className="text-muted small">This request does not use any authorization.</p>}
                            </div>
                        )}

                        {activeTab === 'headers' && (
                            <div className="kv-editor">
                                {headers.map((h, i) => (
                                    <div key={i} className="kv-row">
                                        <input type="checkbox" checked={h.active} onChange={(e) => updateKV(setHeaders, headers, i, 'active', e.target.checked)} />
                                        <input type="text" className="kv-input" placeholder="Header" value={h.key} onChange={(e) => updateKV(setHeaders, headers, i, 'key', e.target.value)} />
                                        <input type="text" className="kv-input" placeholder="Value" value={h.value} onChange={(e) => updateKV(setHeaders, headers, i, 'value', e.target.value)} />
                                        <button className="remove-kv-btn" onClick={() => removeKV(setHeaders, headers, i)}><FaTrash size={12} /></button>
                                    </div>
                                ))}
                                <button className="add-kv-btn" onClick={() => addKV(setHeaders, headers)}><FaPlus className="me-2" /> Add Header</button>
                            </div>
                        )}

                        {activeTab === 'body' && (
                            <div className="body-editor">
                                <div className="body-type-selector">
                                    {["none", "form-data", "url-encoded", "raw"].map(t => (
                                        <label key={t} className={`body-type-option ${bodyType === t ? 'active' : ''}`}>
                                            <input type="radio" name="bodyType" checked={bodyType === t} onChange={() => setBodyType(t)} />
                                            {t}
                                        </label>
                                    ))}
                                </div>
                                {bodyType === 'raw' && (
                                    <textarea className="body-textarea" placeholder='{ "key": "value" }' value={bodyRaw} onChange={(e) => setBodyRaw(e.target.value)}></textarea>
                                )}
                                {bodyType === 'form-data' && (
                                    <div className="kv-editor">
                                        {bodyFormData.map((b, i) => (
                                            <div key={i} className="kv-row">
                                                <input type="checkbox" checked={b.active} onChange={(e) => updateKV(setBodyFormData, bodyFormData, i, 'active', e.target.checked)} />
                                                <input type="text" className="kv-input" placeholder="Key" value={b.key} onChange={(e) => updateKV(setBodyFormData, bodyFormData, i, 'key', e.target.value)} />
                                                <input type="text" className="kv-input" placeholder="Value" value={b.value} onChange={(e) => updateKV(setBodyFormData, bodyFormData, i, 'value', e.target.value)} />
                                                <button className="remove-kv-btn" onClick={() => removeKV(setBodyFormData, bodyFormData, i)}><FaTrash size={12} /></button>
                                            </div>
                                        ))}
                                        <button className="add-kv-btn" onClick={() => addKV(setBodyFormData, bodyFormData)}><FaPlus className="me-2" /> Add Field</button>
                                    </div>
                                )}
                                {bodyType === 'url-encoded' && (
                                    <div className="kv-editor">
                                        {bodyUrlEncoded.map((b, i) => (
                                            <div key={i} className="kv-row">
                                                <input type="checkbox" checked={b.active} onChange={(e) => updateKV(setBodyUrlEncoded, bodyUrlEncoded, i, 'active', e.target.checked)} />
                                                <input type="text" className="kv-input" placeholder="Key" value={b.key} onChange={(e) => updateKV(setBodyUrlEncoded, bodyUrlEncoded, i, 'key', e.target.value)} />
                                                <input type="text" className="kv-input" placeholder="Value" value={b.value} onChange={(e) => updateKV(setBodyUrlEncoded, bodyUrlEncoded, i, 'value', e.target.value)} />
                                                <button className="remove-kv-btn" onClick={() => removeKV(setBodyUrlEncoded, bodyUrlEncoded, i)}><FaTrash size={12} /></button>
                                            </div>
                                        ))}
                                        <button className="add-kv-btn" onClick={() => addKV(setBodyUrlEncoded, bodyUrlEncoded)}><FaPlus className="me-2" /> Add Field</button>
                                    </div>
                                )}
                                {bodyType === 'none' && <div className="p-4 text-center text-muted border rounded-4">This request does not have a body.</div>}
                            </div>
                        )}
                    </div>
                </div>

                {/* RESPONSE SECTION */}
                <div className="response-container">
                    {response ? (
                        <>
                            <div className="response-header">
                                <div className="response-meta">
                                    <div className={`status-badge ${response.isError ? 'status-error' : 'status-success'}`}>
                                        {response.status} {response.statusText}
                                    </div>
                                    <div className="meta-item"><FaClock className="me-1" /> <span className="meta-value">{response.time} ms</span></div>
                                    <div className="meta-item"><FaDatabase className="me-1" /> <span className="meta-value">{(response.size / 1024).toFixed(2)} KB</span></div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={() => copyToClipboard(response.data)}>
                                        <FaCopy className="me-1" /> Copy
                                    </button>
                                </div>
                            </div>
                            
                            <div className="response-tabs mb-2">
                                <div className={`api-tab ${responseTab === 'body' ? 'active' : ''}`} onClick={() => setResponseTab('body')}>Body</div>
                                <div className={`api-tab ${responseTab === 'headers' ? 'active' : ''}`} onClick={() => setResponseTab('headers')}>Headers</div>
                            </div>

                            <div className="response-body-wrapper">
                                <pre className="response-pre">
                                    {responseTab === 'body' 
                                        ? JSON.stringify(response.data, null, 2) 
                                        : JSON.stringify(response.headers, null, 2)}
                                </pre>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-5 text-muted">
                            <HiLightningBolt size={48} className="mb-3 opacity-20" />
                            <p>Hit "Send" to execute the request and see the response here.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* HISTORY SECTION */}
            <div className="mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-2">
                        <FaHistory className="text-primary" />
                        <h3 className="fw-bold m-0 h4">Request History</h3>
                    </div>
                    {history.length > 0 && (
                        <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => { setHistory([]); localStorage.removeItem("api_tester_history_v2"); }}>
                            Clear History
                        </button>
                    )}
                </div>
                {history.length > 0 ? (
                    <div className="row g-3">
                        {history.map((item) => (
                            <div key={item.id} className="col-md-6">
                                <div className="history-item" onClick={() => loadFromHistory(item)}>
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="d-flex align-items-center gap-2 overflow-hidden">
                                            <span className={`badge ${
                                                item.method === 'GET' ? 'bg-success' : 
                                                item.method === 'POST' ? 'bg-primary' : 
                                                'bg-warning'
                                            }`} style={{ fontSize: '0.65rem', minWidth: '45px' }}>{item.method}</span>
                                            <span className="history-url text-truncate">{item.url}</span>
                                        </div>
                                        <span className="text-muted" style={{ fontSize: '0.65rem' }}>{new Date(item.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 rounded-4 border border-dashed text-center text-muted">
                        No history found. Try sending a request!
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApiTester;
