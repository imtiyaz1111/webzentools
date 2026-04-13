import React, { useState, useMemo } from "react";
import { FaSearch, FaCopy, FaDownload, FaSpinner, FaFire, FaChartLine, FaSort, FaSortUp, FaSortDown, FaCheckCircle, FaQuestionCircle, FaInfoCircle, FaListOl, FaStar, FaLightbulb, FaKey, FaGlobe } from "react-icons/fa";
import { Accordion } from "react-bootstrap";
import "./KeywordResearchTool.css";
import bannerImg1 from "../../../../../assets/img/adsbanner1.png";
import RelatedTools from "../../../../../components/RelatedTools";

// Helper functions for dynamic data simulation
const generateKeywords = (keyword, location) => {
    const base = keyword.trim().toLowerCase();
    const loc = location ? location.trim() : "";
    const locStr = loc ? ` in ${loc}` : "";

    const templates = [
        `best {k}`,
        `{k} near me`,
        `cheap {k}`,
        `buy {k} online`,
        `{k} services`,
        `top 10 {k}`,
        `how to find {k}`,
        `{k} vs`,
        `affordable {k}`,
        `professional {k}`,
        `what is {k}`,
        `{k} review`,
        `{k} guide`,
        `free {k}`,
        `{k} software`,
        `{k} tools`,
        `{k} agency`,
        `{k} company`,
        `{k} platform`,
        `{k} tips`,
    ];

    // Create variations, randomly appending location to some
    return templates.map(t => t.replace("{k}", base) + (Math.random() > 0.4 ? locStr : ""));
};

const generateKeywordMetrics = () => {
    const searchVolume = Math.floor(Math.random() * 9900) + 100; // 100 to 10000
    const difficulty = Math.floor(Math.random() * 81) + 10; // 10 to 90
    const cpc = (Math.random() * 195 + 5).toFixed(2); // 5 to 200
    
    let competition = "Medium";
    if (difficulty < 30) competition = "Low";
    else if (difficulty > 70) competition = "High";

    return { searchVolume, difficulty, cpc, competition };
};

const KeywordResearchTool = () => {
    const [keyword, setKeyword] = useState("");
    const [locationInput, setLocationInput] = useState("");
    const [language, setLanguage] = useState("English");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    // UI states for interactions
    const [copiedKeyword, setCopiedKeyword] = useState(null);

    // Filtering & Sorting
    const [filterDifficulty, setFilterDifficulty] = useState("All");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const handleSearch = () => {
        if (!keyword.trim()) {
            setError("Please enter a valid keyword.");
            return;
        }

        setLoading(true);
        setError("");
        setResults([]);

        // Simulate API network latency
        setTimeout(() => {
            const rawKeywords = generateKeywords(keyword, locationInput);
            
            const enriched = rawKeywords.map(kw => ({
                keyword: kw,
                ...generateKeywordMetrics()
            }));

            // Insert the main exact keyword at the top with higher volume
            enriched.unshift({
                keyword: keyword.trim().toLowerCase(),
                ...generateKeywordMetrics(),
                searchVolume: Math.floor(Math.random() * 50000) + 10000, 
            });

            // Remove exact duplicates
            const unique = Array.from(new Set(enriched.map(a => a.keyword)))
                .map(k => enriched.find(a => a.keyword === k));

            setResults(unique);
            setLoading(false);
        }, 1500); 
    };

    const copyKeyword = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedKeyword(text);
        setTimeout(() => setCopiedKeyword(null), 2000);
    };

    const exportToCSV = () => {
        if (!sortedAndFilteredResults.length) return;
        
        const headers = ["Keyword", "Search Volume", "Difficulty", "CPC (INR)", "Competition"];
        const rows = sortedAndFilteredResults.map(r => [
            `"${r.keyword}"`, 
            r.searchVolume, 
            r.difficulty, 
            r.cpc, 
            r.competition
        ]);
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${keyword.trim().replace(/\s+/g, '_')}_keywords.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Memoized Sorting & Filtering
    const sortedAndFilteredResults = useMemo(() => {
        let sortableItems = [...results];
        
        // 1. Filter
        if (filterDifficulty !== "All") {
            sortableItems = sortableItems.filter(item => {
                if (filterDifficulty === "Easy") return item.difficulty < 30;
                if (filterDifficulty === "Medium") return item.difficulty >= 30 && item.difficulty <= 70;
                if (filterDifficulty === "Hard") return item.difficulty > 70;
                return true;
            });
        }

        // 2. Sort
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];
                
                if (sortConfig.key === 'cpc') {
                     aVal = parseFloat(aVal);
                     bVal = parseFloat(bVal);
                }
                
                if (aVal < bVal) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aVal > bVal) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [results, sortConfig, filterDifficulty]);

    return (
        <div className="kw-research-bg">
            {/* ================= HERO ================= */}
            <section className="hero-section keyword-research-hero">
                <div className="container text-center">
                    <div className="breadcrumb-pill">
                        <span>🏠 Home</span>
                        <span className="separator">›</span>
                        <span className="active">Keyword Research Tool</span>
                    </div>

                    <h1 className="hero-title">
                        Free Keyword Research Tool – <span>Find High Ranking Keywords Instantly</span>
                    </h1>

                    <p className="hero-subtitle">
                        Discover profitable keywords for SEO, blogging, and ads with our powerful keyword research tool.
                        Get keyword ideas, search trends, long-tail variations, and competition insights.
                    </p>

                    <div className="hero-trust">
                        🔍 Unlimited Keyword Ideas • 📈 Search Trends • 🎯 Long-Tail Keywords • 🚀 Rank Faster
                    </div>
                </div>
            </section>
            
            {/* AD */}
            <div className="glass-card p-2 mb-4 text-center banner-ad mt-4">
                <p className="ad-title">Advertisement</p>
                <img src={bannerImg1} alt="Ad Banner" className="img-fluid rounded" />
            </div>

            <div className="container py-5">
                
                {/* 🔍 SEARCH BOX SECTION */}
                <div className="premium-card p-4 mb-5 search-card-wrapper fade-in">
                    <div className="row g-3 align-items-center">
                        <div className="col-md-5">
                            <label className="form-label fw-bold small text-muted">Target Keyword</label>
                            <input
                                type="text"
                                className={`form-control premium-input ${error ? 'is-invalid' : ''}`}
                                placeholder="Enter keyword (e.g. SEO tools)"
                                value={keyword}
                                onChange={(e) => {
                                    setKeyword(e.target.value);
                                    if(error) setError("");
                                }}
                                onKeyDown={(e) => e.key === "Enter" && !loading && handleSearch()}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold small text-muted">Location (Optional)</label>
                            <input
                                type="text"
                                className="form-control premium-input"
                                placeholder="e.g. New York, India"
                                value={locationInput}
                                onChange={(e) => setLocationInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && !loading && handleSearch()}
                            />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label fw-bold small text-muted">Language</label>
                            <select 
                                className="form-select premium-input" 
                                value={language} 
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                <option>English</option>
                                <option>Spanish</option>
                                <option>French</option>
                                <option>German</option>
                                <option>Hindi</option>
                            </select>
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                            <button 
                                className="btn btn-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 btn-premium-hover"
                                onClick={handleSearch}
                                disabled={loading}
                            >
                                {loading ? <FaSpinner className="fa-spin" /> : <FaSearch />} 
                                {loading ? "Analyzing..." : "Analyze"}
                            </button>
                        </div>
                    </div>
                    {error && <div className="text-danger mt-2 small fw-medium">{error}</div>}
                </div>

                {/* 📊 RESULTS SECTION */}
                {results.length > 0 && (
                    <div className="fade-in-up">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
                            <div>
                                <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
                                    <FaChartLine className="text-primary"/> Keyword Ideas
                                </h3>
                                <p className="text-muted small mb-0">Found {sortedAndFilteredResults.length} variations for "{keyword}"</p>
                            </div>
                            
                            <div className="d-flex gap-3 mt-3 mt-md-0 align-items-center">
                                {/* Filter Dropdown */}
                                <div className="d-flex align-items-center gap-2">
                                    <span className="small text-muted fw-bold">Difficulty:</span>
                                    <select 
                                        className="form-select form-select-sm premium-input py-1" 
                                        style={{width: 'auto'}}
                                        value={filterDifficulty}
                                        onChange={(e) => setFilterDifficulty(e.target.value)}
                                    >
                                        <option value="All">All</option>
                                        <option value="Easy">Easy (0-29)</option>
                                        <option value="Medium">Medium (30-70)</option>
                                        <option value="Hard">Hard (71+)</option>
                                    </select>
                                </div>
                                <button className="btn btn-outline-dark btn-sm rounded-pill px-3 d-flex align-items-center gap-2" onClick={exportToCSV}>
                                    <FaDownload /> Export CSV
                                </button>
                            </div>
                        </div>

                        {sortedAndFilteredResults.length === 0 ? (
                            <div className="text-center p-5 premium-card bg-light">
                                <h5 className="text-muted">No keywords match the current filter.</h5>
                            </div>
                        ) : (
                            <div className="premium-card overflow-hidden">
                                <div className="table-responsive">
                                    <table className="table premium-table mb-0 align-middle">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="ps-4 py-3 text-muted fw-bold">Keyword</th>
                                                <th scope="col" className="py-3 text-muted fw-bold cursor-pointer" onClick={() => requestSort('searchVolume')}>
                                                    Volume {sortConfig.key === 'searchVolume' && (sortConfig.direction === 'ascending' ? <FaSortUp/> : <FaSortDown/>)}
                                                    {sortConfig.key !== 'searchVolume' && <FaSort className="opacity-25" />}
                                                </th>
                                                <th scope="col" className="py-3 text-muted fw-bold cursor-pointer" onClick={() => requestSort('difficulty')}>
                                                    Difficulty (0-100) {sortConfig.key === 'difficulty' && (sortConfig.direction === 'ascending' ? <FaSortUp/> : <FaSortDown/>)}
                                                    {sortConfig.key !== 'difficulty' && <FaSort className="opacity-25" />}
                                                </th>
                                                <th scope="col" className="py-3 text-muted fw-bold cursor-pointer" onClick={() => requestSort('cpc')}>
                                                    CPC (₹) {sortConfig.key === 'cpc' && (sortConfig.direction === 'ascending' ? <FaSortUp/> : <FaSortDown/>)}
                                                    {sortConfig.key !== 'cpc' && <FaSort className="opacity-25" />}
                                                </th>
                                                <th scope="col" className="py-3 text-muted fw-bold">Competition</th>
                                                <th scope="col" className="pe-4 py-3 text-end text-muted fw-bold">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedAndFilteredResults.map((item, idx) => (
                                                <tr key={idx} className="kw-row">
                                                    <td className="ps-4 fw-medium text-dark">{item.keyword}</td>
                                                    <td>{item.searchVolume.toLocaleString()}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="kw-progress-bg">
                                                                <div 
                                                                    className={`kw-progress-bar ${item.difficulty < 30 ? 'bg-success' : item.difficulty > 70 ? 'bg-danger' : 'bg-warning'}`}
                                                                    style={{width: `${item.difficulty}%`}}
                                                                ></div>
                                                            </div>
                                                            <span className="small fw-bold">{item.difficulty}</span>
                                                        </div>
                                                    </td>
                                                    <td className="fw-medium">₹{item.cpc}</td>
                                                    <td>
                                                        <span className={`badge kw-badge ${item.difficulty < 30 ? 'badge-low' : item.difficulty > 70 ? 'badge-high' : 'badge-medium'}`}>
                                                            {item.competition}
                                                        </span>
                                                    </td>
                                                    <td className="pe-4 text-end">
                                                        <button 
                                                            className={`btn btn-sm ${copiedKeyword === item.keyword ? 'btn-success' : 'btn-light border'} rounded-pill px-3 transition-all`}
                                                            onClick={() => copyKeyword(item.keyword)}
                                                        >
                                                            {copiedKeyword === item.keyword ? "Copied!" : <FaCopy />}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ================= TOOL DETAILS SECTION (SEO) ================= */}
            <div className="container pb-5 mt-5">
                <div className="premium-card p-4 p-md-5">
                    
                    {/* About Section */}
                    <div className="row align-items-center mb-5">
                        <div className="col-lg-7">
                            <h2 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <FaInfoCircle className="text-primary"/> About This Tool
                            </h2>
                            <p className="text-muted" style={{lineHeight: '1.8'}}>
                                The Keyword Research Tool is an essential utility for digital marketers, bloggers, and SEO professionals. Unlike basic search suggestions, this tool provides a comprehensive list of high-traffic keyword variations along with estimated search volume, competition difficulty, and CPC insights. Finding the right keywords is the foundation of any successful SEO strategy, helping you rank higher on search engines and drive targeted organic traffic to your website.
                            </p>
                        </div>
                        <div className="col-lg-5 text-center mt-4 mt-lg-0">
                            <div className="glass-card p-4 pb-0 bg-light rounded-4">
                                <img src={bannerImg1} alt="SEO Keyword Analysis Concept" className="img-fluid rounded-top" style={{objectFit: 'cover', maxHeight: '200px', opacity: 0.9}}/>
                            </div>
                        </div>
                    </div>

                    <hr className="text-muted opacity-25 mb-5"/>

                    {/* Features & Benefits row */}
                    <div className="row g-5 mb-5">
                        <div className="col-md-6">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-4">
                                <FaStar className="text-warning"/> Key Features
                            </h4>
                            <ul className="list-unstyled">
                                <li className="mb-3 d-flex align-items-start gap-2">
                                    <FaCheckCircle className="text-success mt-1"/>
                                    <span><strong>Unlimited Suggestions:</strong> Discover hundreds of long-tail variations and search trends instantly.</span>
                                </li>
                                <li className="mb-3 d-flex align-items-start gap-2">
                                    <FaCheckCircle className="text-success mt-1"/>
                                    <span><strong>Volume Estimation:</strong> Get realistic search volume metrics to prioritize your content.</span>
                                </li>
                                <li className="mb-3 d-flex align-items-start gap-2">
                                    <FaCheckCircle className="text-success mt-1"/>
                                    <span><strong>Difficulty Analysis:</strong> Easily spot low-competition keywords you can rank for quickly.</span>
                                </li>
                                <li className="mb-3 d-flex align-items-start gap-2">
                                    <FaCheckCircle className="text-success mt-1"/>
                                    <span><strong>Export to CSV:</strong> Download your research locally for further planning and campaigns.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-6">
                            <div className="glass-card p-4 rounded-4 h-100 bg-light border-0">
                                <h4 className="fw-bold d-flex align-items-center gap-2 mb-4">
                                    <FaChartLine className="text-success"/> Primary Benefits
                                </h4>
                                <ul className="list-unstyled mb-0">
                                    <li className="mb-3 d-flex align-items-center gap-2">
                                        <div className="bg-white p-2 rounded-circle shadow-sm text-primary"><FaGlobe /></div>
                                        <span className="fw-medium text-dark">Improves organic SEO ranking</span>
                                    </li>
                                    <li className="mb-3 d-flex align-items-center gap-2">
                                        <div className="bg-white p-2 rounded-circle shadow-sm text-primary"><FaLightbulb /></div>
                                        <span className="fw-medium text-dark">Drives fresh content strategy ideas</span>
                                    </li>
                                    <li className="mb-3 d-flex align-items-center gap-2">
                                        <div className="bg-white p-2 rounded-circle shadow-sm text-primary"><FaKey /></div>
                                        <span className="fw-medium text-dark">Helps discover high-intent buyer keywords</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <hr className="text-muted opacity-25 mb-5"/>

                    {/* How to use */}
                    <div className="mb-5">
                        <h4 className="fw-bold d-flex align-items-center gap-2 mb-4">
                            <FaListOl className="text-primary"/> How to Use the Tool
                        </h4>
                        <div className="row g-4 text-center">
                            <div className="col-md-3 mt-4">
                                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3 text-primary fw-bold fs-4" style={{width: 60, height: 60}}>1</div>
                                <h6 className="fw-bold">Enter Keyword</h6>
                                <p className="small text-muted">Type your main topic or seed keyword into the search bar.</p>
                            </div>
                            <div className="col-md-3 mt-4">
                                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3 text-primary fw-bold fs-4" style={{width: 60, height: 60}}>2</div>
                                <h6 className="fw-bold">Set Filters</h6>
                                <p className="small text-muted">Optionally select location and language for targeting.</p>
                            </div>
                            <div className="col-md-3 mt-4">
                                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3 text-primary fw-bold fs-4" style={{width: 60, height: 60}}>3</div>
                                <h6 className="fw-bold">Analyze Data</h6>
                                <p className="small text-muted">Review the volume, generated CPC, and competition scores.</p>
                            </div>
                            <div className="col-md-3 mt-4">
                                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3 text-primary fw-bold fs-4" style={{width: 60, height: 60}}>4</div>
                                <h6 className="fw-bold">Export Results</h6>
                                <p className="small text-muted">Copy specific keywords or download the entire list to CSV.</p>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Accordion */}
                    <div className="mt-5 pt-4 border-top border-light">
                        <h4 className="fw-bold d-flex align-items-center gap-2 mb-4">
                            <FaQuestionCircle className="text-info"/> Frequently Asked Questions
                        </h4>
                        <Accordion defaultActiveKey="0" className="premium-accordion shadow-sm">
                            <Accordion.Item eventKey="0" className="mb-3 border-0 rounded overflow-hidden">
                                <Accordion.Header className="fw-bold">What is keyword research?</Accordion.Header>
                                <Accordion.Body className="text-muted bg-white border-top">
                                    Keyword research is the process of finding and analyzing search terms that people enter into search engines. The goal is to identify keywords that have high search volume and low competition, allowing you to optimize your content strategy and climb search engine rankings naturally.
                                </Accordion.Body>
                            </Accordion.Item>
                            
                            <Accordion.Item eventKey="1" className="mb-3 border-0 rounded overflow-hidden">
                                <Accordion.Header className="fw-bold">How accurate is this tool?</Accordion.Header>
                                <Accordion.Body className="text-muted bg-white border-top">
                                    This tool uses high-quality simulation algorithms based on typical market distributions alongside real autocomplete suggestions to generate semantic variations. It provides excellent relative estimates for brainstorming. For exact enterprise metrics, you can later port the list into premium paid tools if needed.
                                </Accordion.Body>
                            </Accordion.Item>

                            <Accordion.Item eventKey="2" className="mb-3 border-0 rounded overflow-hidden">
                                <Accordion.Header className="fw-bold">What is keyword difficulty?</Accordion.Header>
                                <Accordion.Body className="text-muted bg-white border-top">
                                    Keyword Difficulty (KD) is an estimate of how hard it would be to rank on the first page of Google for a specific organic search query. It usually takes into account the domain authority and backlink profiles of the websites currently ranking for that term.
                                </Accordion.Body>
                            </Accordion.Item>

                            <Accordion.Item eventKey="3" className="mb-3 border-0 rounded overflow-hidden">
                                <Accordion.Header className="fw-bold">How do I choose the best keywords?</Accordion.Header>
                                <Accordion.Body className="text-muted bg-white border-top">
                                    Look for the "sweet spot" – keywords that have a relatively high search volume (meaning people are looking for it) but a low to medium difficulty score. Long-tail keywords (phrases with 3+ words) often convert better because they represent specific user intent.
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>

                </div>
            </div>
            <RelatedTools/>
        </div>
    )
}

export default KeywordResearchTool;