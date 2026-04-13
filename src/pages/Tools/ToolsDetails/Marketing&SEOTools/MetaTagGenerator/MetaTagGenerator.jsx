import React, { useState, useEffect, useRef } from "react";
import { FaCopy, FaDownload, FaRedo, FaMagic, FaEye, FaCode, FaCheckCircle } from "react-icons/fa";
import "./MetaTagGenerator.css";
import bannerImg1 from "../../../../../assets/img/adsbanner1.png";
import bannerImg2 from "../../../../../assets/img/adsbanner2.png";
import squreImg1 from "../../../../../assets/img/squareads1.png";

const MetaTagGenerator = () => {
    // State for the meta form
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        keywords: "",
        author: "",
        viewport: true,
        robotsIndex: "index",
        robotsFollow: "follow",
        charset: "UTF-8",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        ogUrl: "",
    });

    const [generatedCode, setGeneratedCode] = useState("");
    const [copied, setCopied] = useState(false);

    // Limit variables
    const maxTitle = 60;
    const maxDesc = 160;

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Auto-fill from Title
    const autoFill = () => {
        setFormData((prev) => ({
            ...prev,
            ogTitle: prev.title,
            ogDescription: prev.description,
        }));
    };

    // Reset Form
    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            keywords: "",
            author: "",
            viewport: true,
            robotsIndex: "index",
            robotsFollow: "follow",
            charset: "UTF-8",
            ogTitle: "",
            ogDescription: "",
            ogImage: "",
            ogUrl: "",
        });
        setCopied(false);
    };

    // Generate Code automatically when form changes
    useEffect(() => {
        let code = `<!-- Standard Meta Tags -->\n`;
        code += `<meta charset="${formData.charset}">\n`;

        if (formData.viewport) {
            code += `<meta name="viewport" content="width=device-width, initial-scale=1.0">\n`;
        }

        if (formData.title) {
            code += `<title>${formData.title}</title>\n`;
            code += `<meta name="title" content="${formData.title}">\n`;
        }

        if (formData.description) {
            code += `<meta name="description" content="${formData.description}">\n`;
        }

        if (formData.keywords) {
            code += `<meta name="keywords" content="${formData.keywords}">\n`;
        }

        if (formData.robotsIndex || formData.robotsFollow) {
            code += `<meta name="robots" content="${formData.robotsIndex}, ${formData.robotsFollow}">\n`;
        }

        if (formData.author) {
            code += `<meta name="author" content="${formData.author}">\n`;
        }

        // Open Graph / Facebook
        if (formData.ogTitle || formData.ogDescription || formData.ogImage || formData.ogUrl) {
            code += `\n<!-- Open Graph / Facebook -->\n`;
            code += `<meta property="og:type" content="website">\n`;
            if (formData.ogTitle) code += `<meta property="og:title" content="${formData.ogTitle}">\n`;
            if (formData.ogDescription) code += `<meta property="og:description" content="${formData.ogDescription}">\n`;
            if (formData.ogImage) code += `<meta property="og:image" content="${formData.ogImage}">\n`;
            if (formData.ogUrl) code += `<meta property="og:url" content="${formData.ogUrl}">\n`;
        }

        // Twitter
        if (formData.ogTitle || formData.ogDescription || formData.ogImage) {
            code += `\n<!-- Twitter -->\n`;
            code += `<meta property="twitter:card" content="summary_large_image">\n`;
            if (formData.ogUrl) code += `<meta property="twitter:url" content="${formData.ogUrl}">\n`;
            if (formData.ogTitle) code += `<meta property="twitter:title" content="${formData.ogTitle}">\n`;
            if (formData.ogDescription) code += `<meta property="twitter:description" content="${formData.ogDescription}">\n`;
            if (formData.ogImage) code += `<meta property="twitter:image" content="${formData.ogImage}">\n`;
        }

        setGeneratedCode(code);
        setCopied(false);
    }, [formData]);

    // Copy to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Download as txt
    const downloadAsTxt = () => {
        const element = document.createElement("a");
        const file = new Blob([generatedCode], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "meta-tags.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    };

    return (
        <div className="meta-tag-bg">
            {/* ================= HERO ================= */}
            <section className="hero-section seo-analyzer-hero">
                <div className="container text-center">
                    <div className="breadcrumb-pill">
                        <span>🏠 Home</span>
                        <span className="separator">›</span>
                        <span className="active">Meta Tag Generator</span>
                    </div>

                    <h1 className="hero-title">
                        Free Meta Tag Generator – <span>Boost Your SEO Rankings</span>
                    </h1>

                    <p className="hero-subtitle">
                        Create perfect meta tags for your website in seconds. Optimize your title, description, and keywords to rank higher on Google.
                    </p>

                    <div className="hero-trust">
                        ⚡ Instant Generation • 📊 Live Google Preview • 🔍 Open Graph Support • 🚀 SEO Optimized
                    </div>
                </div>
            </section>

            {/* AD */}
            <div className="glass-card p-2 mb-4 text-center banner-ad mt-4">
                <p className="ad-title">Advertisement</p>
                <img src={bannerImg1} alt="Ad Banner" className="img-fluid rounded" />
            </div>

            <div className="container py-5">
                <div className="row g-4">
                    {/* LEFT COLUMN: Input Form */}
                    <div className="col-lg-8">
                        <div className="premium-card p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                                    <FaCode className="text-primary" /> Meta details
                                </h3>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-primary btn-sm rounded-pill" onClick={autoFill} title="Auto-fill Open Graph from basic details">
                                        <FaMagic className="me-1" /> Auto-Fill OG
                                    </button>
                                    <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={resetForm} title="Reset all fields">
                                        <FaRedo className="me-1" /> Reset
                                    </button>
                                </div>
                            </div>

                            <div className="row g-4">
                                {/* Basic Meta Tags */}
                                <div className="col-12">
                                    <label className="form-label fw-bold">Page Title <span className="text-danger">*</span></label>
                                    <div className="input-with-counter">
                                        <input
                                            type="text"
                                            className={`form-control premium-input ${formData.title.length > maxTitle ? 'is-invalid' : ''}`}
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Enter your page title (e.g. Best SEO Tools Online)"
                                        />
                                        <small className={`counter ${formData.title.length > maxTitle ? 'text-danger' : 'text-muted'}`}>
                                            {formData.title.length}/{maxTitle} chars recommended
                                        </small>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold">Meta Description <span className="text-danger">*</span></label>
                                    <div className="input-with-counter">
                                        <textarea
                                            className={`form-control premium-input ${formData.description.length > maxDesc ? 'is-invalid' : ''}`}
                                            name="description"
                                            rows="3"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Briefly summarize your page content..."
                                        />
                                        <small className={`counter ${formData.description.length > maxDesc ? 'text-danger' : 'text-muted'}`}>
                                            {formData.description.length}/{maxDesc} chars recommended
                                        </small>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold">Keywords (Comma separated)</label>
                                    <input
                                        type="text"
                                        className="form-control premium-input"
                                        name="keywords"
                                        value={formData.keywords}
                                        onChange={handleChange}
                                        placeholder="seo tools, meta tag generator, rank higher"
                                    />
                                    <small className="text-muted d-block mt-1">Note: Google ignores meta keywords, but some other search engines might use them.</small>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Author Name</label>
                                    <input
                                        type="text"
                                        className="form-control premium-input"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Charset</label>
                                    <select className="form-select premium-input" name="charset" value={formData.charset} onChange={handleChange}>
                                        <option value="UTF-8">UTF-8</option>
                                        <option value="ISO-8859-1">ISO-8859-1</option>
                                    </select>
                                </div>

                                {/* Advanced Robots Options */}
                                <div className="col-12 mt-4 pt-4 border-top">
                                    <h5 className="fw-bold mb-3">Crawling & Indexing</h5>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Allow Search Engines to Index?</label>
                                            <select className="form-select premium-input" name="robotsIndex" value={formData.robotsIndex} onChange={handleChange}>
                                                <option value="index">Yes (Index)</option>
                                                <option value="noindex">No (Noindex)</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Allow Links to be Followed?</label>
                                            <select className="form-select premium-input" name="robotsFollow" value={formData.robotsFollow} onChange={handleChange}>
                                                <option value="follow">Yes (Follow)</option>
                                                <option value="nofollow">No (Nofollow)</option>
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-check custom-checkbox mt-2">
                                                <input className="form-check-input" type="checkbox" name="viewport" id="viewportCheck" checked={formData.viewport} onChange={handleChange} />
                                                <label className="form-check-label fw-medium" htmlFor="viewportCheck">
                                                    Ensure site is mobile-friendly (Viewport Meta Tag)
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Open Graph Options */}
                                <div className="col-12 mt-4 pt-4 border-top">
                                    <h5 className="fw-bold mb-3 d-flex align-items-center justify-content-between">
                                        Open Graph / Social Media
                                        <button className="btn btn-sm btn-light border text-primary" onClick={autoFill}>Auto-fill from basic info</button>
                                    </h5>
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">OG Title</label>
                                            <input type="text" className="form-control premium-input" name="ogTitle" value={formData.ogTitle} onChange={handleChange} placeholder="Social media title" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">OG URL</label>
                                            <input type="url" className="form-control premium-input" name="ogUrl" value={formData.ogUrl} onChange={handleChange} placeholder="https://example.com/page" />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label fw-bold">OG Description</label>
                                            <textarea className="form-control premium-input" name="ogDescription" rows="2" value={formData.ogDescription} onChange={handleChange} placeholder="Social media description"></textarea>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label fw-bold">OG Image URL</label>
                                            <input type="url" className="form-control premium-input" name="ogImage" value={formData.ogImage} onChange={handleChange} placeholder="https://example.com/image.jpg" />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Output & Preview */}
                    <div className="col-lg-4">
                        <div className="sticky-sidebar">

                            {/* Live Google Search Preview */}
                            <div className="premium-card p-4 mb-4">
                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                    <FaEye className="text-success" /> Google Search Preview
                                </h5>
                                <div className="google-preview-box">
                                    <div className="google-url text-truncate">
                                        <span>https://yoursite.com</span> › {formData.title ? "..." : "page"}
                                    </div>
                                    <div className="google-title">
                                        {formData.title || "Your Page Title Will Appear Here"}
                                    </div>
                                    <div className="google-desc">
                                        {formData.description || "Your meta description will appear here as a snippet below the title in search engine results."}
                                    </div>
                                </div>
                            </div>

                            {/* Generated Code Output */}
                            <div className="premium-card overflow-hidden">
                                <div className="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
                                    <h5 className="fw-bold mb-0">Generated Meta Tags</h5>
                                    <div>
                                        <button className="btn btn-light btn-sm me-2 btn-icon-hover" onClick={downloadAsTxt} title="Download .txt">
                                            <FaDownload />
                                        </button>
                                        <button className={`btn btn-sm text-white ${copied ? 'btn-success' : 'btn-primary'} btn-icon-hover`} onClick={copyToClipboard}>
                                            {copied ? <><FaCheckCircle /> Copied!</> : <><FaCopy /> Copy Code</>}
                                        </button>
                                    </div>
                                </div>
                                <div className="code-output-container">
                                    <pre className="m-0 p-3 code-scroll"><code className="language-html">{generatedCode}</code></pre>
                                </div>
                            </div>

                            {/* RIGHT SIDE AD */}
                            <div className="glass-card p-3 ad-section mt-4 h-auto text-center">
                                <p className="text-center small text-muted mb-2">Advertisement</p>
                                <img src={squreImg1} alt="Ad" className="img-fluid rounded" />
                            </div>

                        </div>
                    </div>
                </div>

                {/* AD */}
                <div className="glass-card p-2 text-center banner-ad mt-4">
                    <p className="ad-title">Advertisement</p>
                    <img src={bannerImg2} alt="Ad Banner" className="img-fluid rounded" />
                </div>
            </div>
        </div>
    );
};

export default MetaTagGenerator;
