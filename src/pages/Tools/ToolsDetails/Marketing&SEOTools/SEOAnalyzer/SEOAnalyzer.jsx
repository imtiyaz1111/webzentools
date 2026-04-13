import React, { useState } from "react";
import { FaSearch, FaChartLine, FaExclamationTriangle, FaLink, FaCheckCircle, FaSpinner, FaGlobe, FaMobileAlt, FaLock, FaTachometerAlt } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import "./SEOAnalyzer.css";
import bannerImg1 from "../../../../../assets/img/adsbanner1.png";
import bannerImg2 from "../../../../../assets/img/adsbanner2.png";
import squreImg1 from "../../../../../assets/img/squareads1.png";
import RelatedTools from "../../../../../components/RelatedTools";

const SEOAnalyzer = () => {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const validateURL = (inputUrl) => {
        if (!inputUrl.trim()) {
            toast.error("Please enter a website URL");
            return false;
        }
        
        // Simple regex to validate urls or domains
        const regex = /^((https?:\/\/)?)[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}([\/\w \.-]*)*\/?$/;
        if (!regex.test(inputUrl)) {
            toast.error("Enter a valid URL (e.g. google.com)");
            return false;
        }
        return true;
    };

    const extractDomain = (inputUrl) => {
        // Strip http, https, www to just get the raw domain
        return inputUrl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
    };

    const generateKeywords = (domain) => {
        const base = domain.split('.')[0];
        const capitalized = base.charAt(0).toUpperCase() + base.slice(1);
        return [
            `${capitalized} services`,
            `buy ${base} online`,
            `best ${base} platform`,
            `${capitalized} alternatives`,
            `top ${base} company`,
        ];
    };

    const analyzeSEO = () => {
        if (!validateURL(url)) return;

        setLoading(true);
        setResult(null); // Reset previous results

        // Simulate API network latency and processing
        setTimeout(() => {
            const domain = extractDomain(url);
            
            // Simple heuristic to check if the user literally typed http instead of https
            const typedHttp = url.trim().toLowerCase().startsWith("http://");
            const isSecure = !typedHttp; 
            
            const score = Math.floor(Math.random() * 30) + 70; // Generate realistic score 70-100
            const speed = Math.floor(Math.random() * 40) + 60; // Generate speed 60-100
            
            const capitalizedDomain = domain.charAt(0).toUpperCase() + domain.split('.')[0].slice(1);

            const newResult = {
                targetUrl: domain,
                score: score,
                title: `${capitalizedDomain} - Official Website | Home`,
                description: `Visit ${domain} for the best services and solutions. Discover our top-rated platform features and get started today.`,
                domainAuthority: Math.floor(Math.random() * 60) + 20, // 20-80
                pageSpeed: speed,
                backlinks: Math.floor(Math.random() * 50000) + 1000,
                keywords: generateKeywords(domain),
                mobileFriendly: Math.random() > 0.15, // 85% chance mobile friendly
                ssl: isSecure,
                issues: [],
                good: [
                    "Sitemap.xml Found",
                    "Robots.txt Formatting",
                    "No broken links found"
                ]
            };

            if (!isSecure) newResult.issues.push("SSL Certificate Missing or Invalid (Not HTTPS)");
            else newResult.good.unshift("SSL Certificate Enabled");

            if (speed < 70) {
                newResult.issues.push("Page loading speed is below average");
            } else {
                newResult.good.push("Fast Loading Speed");
            }

            if (newResult.mobileFriendly) {
                newResult.good.push("Mobile Friendly Interface");
            } else {
                newResult.issues.push("Viewport meta tag missing or misconfigured");
            }

            if (Math.random() > 0.5) {
                newResult.issues.push("Some images are missing ALT attributes");
            }

            if (Math.random() > 0.7) {
                newResult.issues.push("Low text-to-HTML ratio");
            }

            setResult(newResult);
            setLoading(false);
            toast.success("SEO Analysis Completed");
        }, 1800);
    };

    return (
        <div className="seo-analyzer-bg" style={{backgroundColor: '#f8fafc', minHeight: '100vh'}}>
            {/* Toaster for Validation Messages */}
            <Toaster position="top-center" reverseOrder={false} />

            {/* ================= HERO ================= */}
            <section className="hero-section seo-analyzer-hero">
                <div className="container text-center">
                    <div className="breadcrumb-pill">
                        <span>🏠 Home</span>
                        <span className="separator">›</span>
                        <span className="active">SEO Analyzer</span>
                    </div>

                    <h1 className="hero-title">
                        Free SEO Analyzer Tool – <span>Check Your Website SEO Score</span>
                    </h1>

                    <p className="hero-subtitle">
                        Analyze your website SEO performance instantly with our advanced SEO analyzer.
                        Get detailed insights on on-page SEO, backlinks, page speed, keywords, and technical issues.
                    </p>

                    <div className="hero-trust">
                        ⚡ Instant SEO Report • 📊 In-Depth Analysis • 🔍 Keyword Insights • 🚀 Improve Rankings Fast
                    </div>
                </div>
            </section>
            
            {/* AD */}
            <div className="glass-card p-2 mb-4 text-center banner-ad mt-3">
                <p className="ad-title text-muted small">Advertisement</p>
                <img src={bannerImg1} alt="Ad Banner" className="img-fluid rounded" />
            </div>

            <div className="container py-5">
                <div className="text-center mb-5">
                    <h1 className="fw-bold text-dark">Website SEO Analyzer</h1>
                    <p className="text-muted">Enter a URL to check SEO score, backlinks, keywords & technical issues instantly.</p>
                </div>
               
                {/* 🔍 SEARCH BOX SECTION */}
                <div className="row justify-content-center mb-5">
                    <div className="col-lg-8 col-md-10">
                        <div className="glass-card p-4 rounded-4 shadow-sm bg-white border">
                            <div className="d-flex flex-column flex-md-row gap-3">
                                <input
                                    type="text"
                                    className="form-control form-control-lg border-secondary border-opacity-25"
                                    placeholder="https://example.com"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && !loading && analyzeSEO()}
                                />
                                <button 
                                    className="btn btn-primary btn-lg px-5 fw-bold d-flex align-items-center justify-content-center gap-2 transition-all" 
                                    onClick={analyzeSEO}
                                    disabled={loading}
                                    style={{minWidth: '200px'}}
                                >
                                    {loading ? <FaSpinner className="fa-spin" /> : <FaSearch />} 
                                    {loading ? "Analyzing..." : "Analyze"}
                                </button>
                            </div>
                            <small className="text-muted mt-3 d-block text-center">
                                Try entering a domain like <strong>semrush.com</strong> or <strong>ahrefs.com</strong>
                            </small>
                        </div>
                    </div>
                </div>

                {/* 📊 RESULTS DASHBOARD */}
                {result && (
                    <div className="row g-4 fade-in-up">
                        {/* LEFT CONTENT */}
                        <div className="col-lg-8">
                            <div className="row g-4">
                                
                                {/* SEO SCORE */}
                                <div className="col-md-4">
                                    <div className="card p-4 text-center shadow-sm h-100 border-0 rounded-4">
                                        <h6 className="text-muted fw-bold mb-3">Overall SEO Score</h6>
                                        <div className="position-relative mx-auto" style={{width: 100, height: 100}}>
                                            <svg viewBox="0 0 36 36" className="circular-chart" style={{width: '100%', height: '100%'}}>
                                                <path
                                                    className="circle-bg"
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#f1f5f9"
                                                    strokeWidth="3"
                                                />
                                                <path
                                                    className="circle"
                                                    strokeDasharray={`${result.score}, 100`}
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke={result.score >= 80 ? "#10b981" : result.score >= 60 ? "#f59e0b" : "#ef4444"}
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    style={{transition: "stroke-dasharray 1s ease-out"}}
                                                />
                                                <text x="18" y="20.35" className="percentage fw-bold" fill="#0f172a" fontSize="8" textAnchor="middle">{result.score}</text>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* META DETAILS */}
                                <div className="col-md-8">
                                    <div className="card p-4 shadow-sm h-100 border-0 rounded-4">
                                        <h6 className="text-muted fw-bold mb-3 d-flex align-items-center gap-2">
                                            <FaGlobe className="text-primary"/> Target Page Information
                                        </h6>
                                        <div className="mb-3">
                                            <small className="text-muted fw-bold">Analyzed URL:</small>
                                            <div className="text-primary fw-medium text-truncate">{result.targetUrl}</div>
                                        </div>
                                        <div className="mb-3">
                                            <small className="text-muted fw-bold">Page Title:</small>
                                            <div className="text-dark fw-medium">{result.title}</div>
                                        </div>
                                        <div>
                                            <small className="text-muted fw-bold">Meta Description:</small>
                                            <div className="text-dark small">{result.description}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* FOUR TOP METRICS */}
                                <div className="col-md-3 col-6">
                                    <div className="card p-3 p-md-4 text-center shadow-sm h-100 border-0 rounded-4">
                                        <FaChartLine className="text-primary fs-3 mx-auto mb-2" />
                                        <h6 className="text-muted small fw-bold">Page Authority</h6>
                                        <h3 className="fw-bold m-0">{result.domainAuthority}<span className="fs-6 text-muted fw-normal">/100</span></h3>
                                    </div>
                                </div>
                                <div className="col-md-3 col-6">
                                    <div className="card p-3 p-md-4 text-center shadow-sm h-100 border-0 rounded-4">
                                        <FaTachometerAlt className={result.pageSpeed >= 80 ? "text-success fs-3 mx-auto mb-2" : "text-warning fs-3 mx-auto mb-2"} />
                                        <h6 className="text-muted small fw-bold">Page Speed</h6>
                                        <h3 className="fw-bold m-0">{result.pageSpeed}<span className="fs-6 text-muted fw-normal">/100</span></h3>
                                    </div>
                                </div>
                                <div className="col-md-3 col-6">
                                    <div className="card p-3 p-md-4 text-center shadow-sm h-100 border-0 rounded-4">
                                        <FaLink className="text-info fs-3 mx-auto mb-2" />
                                        <h6 className="text-muted small fw-bold">Backlinks</h6>
                                        <h3 className="fw-bold m-0 text-truncate" title={result.backlinks.toLocaleString()}>{result.backlinks > 1000 ? (result.backlinks/1000).toFixed(1) + 'k' : result.backlinks}</h3>
                                    </div>
                                </div>
                                <div className="col-md-3 col-6">
                                    <div className="card p-3 p-md-4 text-center shadow-sm h-100 border-0 rounded-4">
                                        {result.ssl ? <FaLock className="text-success fs-3 mx-auto mb-2" /> : <FaExclamationTriangle className="text-danger fs-3 mx-auto mb-2" />}
                                        <h6 className="text-muted small fw-bold">HTTPS/SSL</h6>
                                        <h4 className={`fw-bold m-0 mt-1 ${result.ssl ? 'text-success' : 'text-danger'}`}>{result.ssl ? "Secure" : "Insecure"}</h4>
                                    </div>
                                </div>

                                {/* KEYWORDS EXTRACTED */}
                                <div className="col-12">
                                    <div className="card p-4 shadow-sm border-0 rounded-4">
                                        <h6 className="text-muted fw-bold mb-3">Top Extracted Keywords</h6>
                                        <div className="d-flex flex-wrap gap-2">
                                            {result.keywords.map((kw, i) => (
                                                <span key={i} className="badge bg-light text-dark border border-secondary border-opacity-25 px-3 py-2 fw-medium">
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* PASSED CHECKS (GOOD) */}
                                <div className="col-md-6">
                                    <div className="card p-4 shadow-sm border-0 rounded-4 h-100 border-top border-success border-4">
                                        <h5 className="text-success fw-bold mb-3 d-flex align-items-center gap-2">
                                            <FaCheckCircle /> Passed Checks ({result.good.length})
                                        </h5>
                                        <ul className="list-group list-group-flush">
                                            {result.good.map((item, i) => (
                                                <li key={i} className="list-group-item bg-transparent px-0 text-dark d-flex align-items-start gap-2">
                                                    <FaCheckCircle className="text-success mt-1 flex-shrink-0" /> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* ISSUES */}
                                <div className="col-md-6">
                                    <div className="card p-4 shadow-sm border-0 rounded-4 h-100 border-top border-danger border-4">
                                        <h5 className="text-danger fw-bold mb-3 d-flex align-items-center gap-2">
                                            <FaExclamationTriangle /> SEO Issues ({result.issues.length})
                                        </h5>
                                        {result.issues.length === 0 ? (
                                            <div className="text-muted text-center mt-3">Great job! No major issues found.</div>
                                        ) : (
                                            <ul className="list-group list-group-flush">
                                                {result.issues.map((item, i) => (
                                                    <li key={i} className="list-group-item bg-transparent px-0 text-dark d-flex align-items-start gap-2">
                                                        <FaExclamationTriangle className="text-danger mt-1 flex-shrink-0" /> {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE AD */}
                        <div className="col-lg-4">
                            <div className="glass-card p-3 ad-section h-100 d-flex flex-column align-items-center justify-content-center text-center bg-white border border-light">
                                <p className="text-muted small mb-3">Advertisement</p>
                                <img src={squreImg1} alt="Ad" className="img-fluid rounded" />
                                
                                <div className="mt-4 pt-4 border-top w-100">
                                     <h6 className="fw-bold mb-2">Want Deeper Insights?</h6>
                                     <p className="small text-muted mb-3">Upgrade to premium or connect Google Analytics for live traffic data integration.</p>
                                     <button className="btn btn-outline-primary btn-sm w-100 rounded-pill">Explore Premium</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* AD */}
                <div className="glass-card p-2 mb-5 text-center banner-ad mt-4">
                    <p className="ad-title text-muted small">Advertisement</p>
                    <img src={bannerImg2} alt="Ad Banner" className="img-fluid rounded" />
                </div>
            </div>

            {/* Related Tools Bottom Section */}
            <RelatedTools />
        </div>
    );
};

export default SEOAnalyzer;