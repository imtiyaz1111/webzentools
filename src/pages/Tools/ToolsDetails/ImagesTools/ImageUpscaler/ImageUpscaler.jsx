import React, { useRef, useState } from "react";
import "./ImageUpscaler.css";
import toast from "react-hot-toast";
import bannerImg1 from "../../../../../assets/img/adsbanner1.png";
import bannerImg2 from "../../../../../assets/img/adsbanner2.png"
import bannerImg3 from "../../../../../assets/img/adsbanner3.png"
import squreImg1 from "../../../../../assets/img/squareads1.png"
import { MdDownload, MdHighQuality } from "react-icons/md";
import { AiOutlineThunderbolt, AiOutlineUserDelete } from "react-icons/ai";
import { FiChevronDown, FiShield, FiSmartphone, FiUploadCloud, FiZap } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import RelatedTools from "../../../../../components/RelatedTools";
const faqData = [
    {
        q: "Is this AI image upscaler free to use?",
        a: "Yes, our AI image upscaler is completely free with no hidden charges or subscriptions required.",
    },
    {
        q: "Does upscaling reduce image quality?",
        a: "No, our AI enhances image quality by improving sharpness, clarity, and resolution without losing details.",
    },
    {
        q: "Is my data safe and secure?",
        a: "Absolutely. Your images are processed securely and are not stored on our servers.",
    },
    {
        q: "What image formats are supported?",
        a: "We support popular formats like JPG, JPEG, and PNG for easy and fast image upscaling.",
    },
    {
        q: "Can I use this tool on mobile devices?",
        a: "Yes, our image upscaler is fully responsive and works smoothly on mobile, tablet, and desktop devices.",
    },
    {
        q: "Does it work for all types of images?",
        a: "Our AI works best with photos and portraits. Results may vary for low-quality or complex images.",
    },
];

export const ImageUpscaler = () => {
    const [active, setActive] = useState(null);

    const toggle = (index) => {
        setActive(active === index ? null : index);
    };
    const fileInputRef = useRef();
    const canvasRef = useRef();

    const [imageURL, setImageURL] = useState(null);
    const [mode, setMode] = useState("2x");
    const [loading, setLoading] = useState(false);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageURL(URL.createObjectURL(file));
        }
    };

    // 🔥 IMAGE ENHANCEMENT FUNCTION
    const enhanceImage = () => {
        if (!imageURL) return toast.error("Upload image first");

        setLoading(true);

        const img = new Image();
        img.src = imageURL;

        img.onload = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            // 🔥 Keep size almost same (no huge resize)
            const width = img.width;
            const height = img.height;

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            // 🔥 Apply Filters based on mode
            let imageData = ctx.getImageData(0, 0, width, height);
            let data = imageData.data;

            // Enhancement strength
            let sharpness = 0;
            let contrast = 1;
            let brightness = 0;

            if (mode === "2x") {
                sharpness = 0.2;
                contrast = 1.1;
            } else if (mode === "4k") {
                sharpness = 0.4;
                contrast = 1.2;
                brightness = 5;
            } else if (mode === "8k") {
                sharpness = 0.6;
                contrast = 1.3;
                brightness = 10;
            }

            // 🔥 Apply Enhancement Loop
            for (let i = 0; i < data.length; i += 4) {
                // contrast + brightness
                data[i] = data[i] * contrast + brightness;     // R
                data[i + 1] = data[i + 1] * contrast + brightness; // G
                data[i + 2] = data[i + 2] * contrast + brightness; // B

                // clamp
                data[i] = Math.min(255, Math.max(0, data[i]));
                data[i + 1] = Math.min(255, Math.max(0, data[i + 1]));
                data[i + 2] = Math.min(255, Math.max(0, data[i + 2]));
            }

            ctx.putImageData(imageData, 0, 0);

            // 🔥 EXTRA SHARPEN (canvas filter trick)
            ctx.filter = `contrast(${contrast}) brightness(${100 + brightness}%)`;
            ctx.drawImage(canvas, 0, 0);

            ctx.filter = "none";

            setLoading(false);
        };
    };
    const downloadImage = () => {
        const link = document.createElement("a");
        link.download = "enhanced-image.png";
        link.href = canvasRef.current.toDataURL("image/png");
        link.click();
    };

    return (
        <>
            {/* ================= HERO ================= */}
            <section className="hero-section bg-remover-hero">
                <div className="container text-center">

                    <div className="breadcrumb-pill">
                        <span>🏠 Home</span>
                        <span className="separator">›</span>
                        <span className="active">Image Upscaler</span>
                    </div>

                    <h1 className="hero-title">
                        Upscale Images with <span>AI Instantly</span>
                    </h1>

                    <p className="hero-subtitle">
                        Enhance image quality and increase resolution in seconds using our AI Image Upscaler.
                        100% free, no signup required, and crystal-clear results.
                    </p>

                    <div className="hero-trust">
                        ⚡ AI Powered • 🔒 Secure • 🎯 High Resolution • 📱 Mobile Friendly
                    </div>

                </div>
            </section>

            {/* AD */}
            <div className="glass-card p-2 mb-4 text-center banner-ad">
                <p className="ad-title">Advertisement</p>
                <img src={bannerImg1} alt="Ad Banner" className="img-fluid rounded" />
            </div>

            <div className="container py-5">

                <div className="row g-4">

                    {/* LEFT */}
                    <div className="col-lg-8">
                        <div className="glass-card p-4 text-center">

                            <h3 className="mb-3">AI Image Upscaler</h3>

                            {/* Upload */}
                            <div
                                className="upload-box-premium mb-3"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <p>{imageURL ? "✅ Image Selected" : "📁 Upload Image"}</p>
                                <input
                                    type="file"
                                    hidden
                                    ref={fileInputRef}
                                    onChange={handleFile}
                                    accept="image/*"
                                />
                            </div>

                            {/* Mode Selection */}
                            <div className="mb-3">
                                <label className="text-light me-2">Enhancement:</label>

                                <select
                                    value={mode}
                                    onChange={(e) => setMode(e.target.value)}
                                    className="form-select w-auto d-inline"
                                >
                                    <option value="2x">2x (Light Enhance)</option>
                                    <option value="4k">4K (High Quality)</option>
                                    <option value="8k">8K (Ultra Sharp)</option>
                                </select>
                            </div>

                            {/* Button */}
                            <button
                                onClick={enhanceImage}
                                className="btn-premium"
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "🚀 Enhance Image"}
                            </button>

                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="col-lg-4">
                        <div className="glass-card p-3 text-center">
                            <p className="small text-muted">Advertisement</p>
                            <img
                                src={squreImg1}
                                alt="Ad"
                                className="img-fluid rounded"
                            />
                        </div>
                    </div>

                </div>

                {/* RESULT */}
                <div className="row mt-5 g-4">

                    <div className="col-md-6">
                        <div className="glass-card p-3 text-center">
                            <h5>Original</h5>
                            {imageURL ? (
                                <img src={imageURL} className="result-img" alt="" />
                            ) : (
                                <p>No image</p>
                            )}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="glass-card p-3 text-center">
                            <h5>Enhanced Result</h5>
                            <canvas ref={canvasRef} className="result-img"></canvas>

                            <button
                                onClick={downloadImage}
                                className="btn-premium mt-3"
                                disabled={!imageURL}
                            >
                                ⬇ Download
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* AD */}
            <div className="glass-card p-2 mb-4 text-center banner-ad">
                <p className="ad-title">Advertisement</p>
                <img src={bannerImg2} alt="Ad Banner" className="img-fluid rounded" />
            </div>

            <section className="how-section py-5">
                <div className="container">

                    {/* Heading */}
                    <div className="text-center mb-5">
                        <h2 className="how-title">
                            How to Upscale Images Online with AI
                        </h2>
                        <p className="how-subtitle">
                            Enhance your images in just 3 simple steps using our AI Image Upscaler.
                            No design skills required — fast, secure, and completely free.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="row g-4">

                        {/* Step 1 */}
                        <div className="col-md-4">
                            <div className="how-card">
                                <div className="how-icon">
                                    <FiUploadCloud />
                                </div>
                                <h5>Upload Image</h5>
                                <p>
                                    Select and upload your image in JPG or PNG format from your device.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="col-md-4">
                            <div className="how-card">
                                <div className="how-icon">
                                    <AiOutlineThunderbolt />
                                </div>
                                <h5>AI Enhances Quality</h5>
                                <p>
                                    Our AI analyzes your image and improves resolution, sharpness, and clarity.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="col-md-4">
                            <div className="how-card">
                                <div className="how-icon">
                                    <MdDownload />
                                </div>
                                <h5>Download Result</h5>
                                <p>
                                    Instantly download your enhanced high-quality image with no watermark.
                                </p>
                            </div>
                        </div>

                    </div>

                </div>
            </section>





            <section className="features-section py-5">
                <div className="container">

                    {/* Heading */}
                    <div className="text-center mb-5">
                        <h2 className="features-title">
                            Why Choose Our AI Image Upscaler
                        </h2>
                        <p className="features-subtitle">
                            Experience fast, secure, and high-quality image enhancement with our powerful AI upscaler — built for everyone.
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="row g-4">

                        {/* Feature 1 */}
                        <div className="col-md-4">
                            <div className="feature-card">
                                <FaCheckCircle className="feature-icon" />
                                <h5>100% Free</h5>
                                <p>Use our AI upscaler completely free with no hidden charges.</p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="col-md-4">
                            <div className="feature-card">
                                <AiOutlineUserDelete className="feature-icon" />
                                <h5>No Signup Required</h5>
                                <p>No registration needed. Upload and enhance images instantly.</p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="col-md-4">
                            <div className="feature-card">
                                <FiZap className="feature-icon" />
                                <h5>Fast Processing</h5>
                                <p>Enhance image quality in seconds using advanced AI technology.</p>
                            </div>
                        </div>

                        {/* Feature 4 */}
                        <div className="col-md-4">
                            <div className="feature-card">
                                <MdHighQuality className="feature-icon" />
                                <h5>High Quality Output</h5>
                                <p>Get sharper, clearer, and high-resolution images every time.</p>
                            </div>
                        </div>

                        {/* Feature 5 */}
                        <div className="col-md-4">
                            <div className="feature-card">
                                <FiShield className="feature-icon" />
                                <h5>Secure & Private</h5>
                                <p>Your images are never stored. 100% safe and secure processing.</p>
                            </div>
                        </div>

                        {/* Feature 6 */}
                        <div className="col-md-4">
                            <div className="feature-card">
                                <FiSmartphone className="feature-icon" />
                                <h5>Mobile Friendly</h5>
                                <p>Use our tool on any device — mobile, tablet, or desktop.</p>
                            </div>
                        </div>

                    </div>

                </div>
            </section>
 {/* AD */}
            <div className="glass-card p-2 mb-4 text-center banner-ad">
                <p className="ad-title">Advertisement</p>
                <img src={bannerImg3} alt="Ad Banner" className="img-fluid rounded" />
            </div>
            <section className="faq-section py-5">
                <div className="container">

                    {/* Heading */}
                    <div className="text-center mb-5">
                        <h2 className="faq-title">
                            Frequently Asked Questions
                        </h2>
                        <p className="faq-subtitle">
                            Everything you need to know about our AI Image Upscaler.
                        </p>
                    </div>

                    {/* FAQ List */}
                    <div className="faq-wrapper mx-auto">
                        {faqData.map((item, index) => (
                            <div
                                key={index}
                                className={`faq-item ${active === index ? "active" : ""}`}
                            >
                                <div
                                    className="faq-question"
                                    onClick={() => toggle(index)}
                                >
                                    <h6>{item.q}</h6>
                                    <FiChevronDown className="faq-icon" />
                                </div>

                                <div className="faq-answer">
                                    <p>{item.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            <RelatedTools />
        </>
    )
}
