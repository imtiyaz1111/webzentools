import React, { useState } from "react";
import { FaSearch, FaChartLine, FaExclamationTriangle, FaLink, FaCheckCircle } from "react-icons/fa";
import "./SEOAnalyzer"
import bannerImg1 from "../../../../../assets/img/adsbanner1.png";
import bannerImg2 from "../../../../../assets/img/adsbanner2.png"
// import bannerImg3 from "../../../../../assets/img/adsbanner3.png"
import squreImg1 from "../../../../../assets/img/squareads1.png"


const SEOAnalyzer = () => {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const analyzeSEO = () => {
        if (!url) return alert("Enter a valid URL");
        setLoading(true);

        setTimeout(() => {
            setResult({
                score: 78,
                domainAuthority: 45,
                pageSpeed: 82,
                backlinks: 2340,
                keywords: 120,
                mobileFriendly: true,
                ssl: true,
                issues: [
                    "Missing meta description",
                    "Images not optimized",
                    "Low keyword density"
                ],
                good: [
                    "SSL Certificate Enabled",
                    "Mobile Friendly",
                    "Fast Loading Speed"
                ]
            });
            setLoading(false);
        }, 2000);
    };
    return (
        <>
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
            <div className="glass-card p-2 mb-4 text-center banner-ad">
                <p className="ad-title">Advertisement</p>
                <img src={bannerImg1} alt="Ad Banner" className="img-fluid rounded" />
            </div>

            <div className="container py-5">
                <div className="text-center mb-5">
                    <h1 className="fw-bold">SEO Analyzer Tool</h1>
                    <p className="text-muted">Check SEO score, backlinks, keywords & technical issues</p>
                </div>

               
                <div className="row justify-content-center mb-4">
                    <div className="col-md-8 d-flex gap-2">
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Enter website URL"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <button className="btn btn-primary btn-lg" onClick={analyzeSEO}>
                            <FaSearch /> {loading ? "Analyzing..." : "Analyze"}
                        </button>
                    </div>
                </div>
                {result && (
                    <div className="row g-4">
                        {/* LEFT CONTENT */}
                        <div className="col-lg-8">

                            <div className="row g-4">
                                <div className="col-md-4">
                                    <div className="card p-4 text-center shadow-sm">
                                        <h6>SEO Score</h6>
                                        <h2 className="text-success">{result.score}</h2>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="card p-4 text-center shadow-sm">
                                        <h6>Domain Authority</h6>
                                        <h2>{result.domainAuthority}</h2>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="card p-4 text-center shadow-sm">
                                        <h6>Page Speed</h6>
                                        <h2>{result.pageSpeed}</h2>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="card p-4 shadow-sm">
                                        <h6><FaLink /> Backlinks</h6>
                                        <h4>{result.backlinks}</h4>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="card p-4 shadow-sm">
                                        <h6>Keywords Ranking</h6>
                                        <h4>{result.keywords}</h4>
                                    </div>
                                </div>

                                {/* GOOD */}
                                <div className="col-12">
                                    <div className="card p-4 shadow-sm">
                                        <h5 className="text-success mb-3"><FaCheckCircle /> Passed Checks</h5>
                                        <ul className="list-group">
                                            {result.good.map((item, i) => (
                                                <li key={i} className="list-group-item text-success">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* ISSUES */}
                                <div className="col-12">
                                    <div className="card p-4 shadow-sm">
                                        <h5 className="text-danger mb-3"><FaExclamationTriangle /> Issues</h5>
                                        <ul className="list-group">
                                            {result.issues.map((item, i) => (
                                                <li key={i} className="list-group-item">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE AD */}
                        <div className="col-lg-4">
                            <div className="glass-card p-3 ad-section h-100">
                                <p className="text-center small text-muted mb-2">Advertisement</p>
                                <img src={squreImg1} alt="Ad" className="img-fluid rounded" />
                            </div>
                        </div>
                    </div>
                    
                )}
                   {/* AD */}
            <div className="glass-card p-2 mb-4 text-center banner-ad mt-3">
                <p className="ad-title">Advertisement</p>
                <img src={bannerImg2} alt="Ad Banner" className="img-fluid rounded" />
            </div>
            </div>

        </>
    )
}

export default SEOAnalyzer