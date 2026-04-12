import React, { useRef, useState, useEffect } from "react";
import "./BackgroundRemover.css";
import bannerImg1 from "../../../../../assets/img/adsbanner1.png";
import bannerImg2 from "../../../../../assets/img/adsbanner2.png"
import bannerImg3 from "../../../../../assets/img/adsbanner3.png"
import squreImg1 from "../../../../../assets/img/squareads1.png"


import toast from "react-hot-toast";
import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs";
import { MdCampaign, MdDownload, MdOutlineHighQuality } from "react-icons/md";
import { AiOutlineThunderbolt, AiOutlineUserDelete } from "react-icons/ai";
import { FiChevronDown, FiInstagram, FiShield, FiSmartphone, FiUploadCloud, FiZap } from "react-icons/fi";
import { FaCheckCircle, FaShoppingBag, FaUserCircle } from "react-icons/fa";
import RelatedTools from "../../../../../components/RelatedTools";
const faqData = [
  {
    question: "Is this background remover free to use?",
    answer:
      "Yes, our AI background remover is 100% free to use with no hidden charges or subscriptions.",
  },
  {
    question: "Does removing background reduce image quality?",
    answer:
      "No, our tool maintains high-quality output and preserves image resolution while removing the background.",
  },
  {
    question: "Is my data safe and secure?",
    answer:
      "Yes, your images are processed securely and are not stored on our servers, ensuring complete privacy.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "We support popular formats like JPG, PNG, and JPEG for seamless background removal.",
  },
  {
    question: "Can I use this tool on mobile devices?",
    answer:
      "Yes, our tool is fully mobile-friendly and works on smartphones, tablets, and desktops.",
  },
  {
    question: "Does it work for all types of images?",
    answer:
      "Our AI works best with human images. For products or complex objects, results may vary.",
  },
];


const BackgroundRemover = () => {
   const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const fileInputRef = useRef();
  const canvasRef = useRef();

  const [imageURL, setImageURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(null);

  // ✅ Load AI model once (IMPORTANT)
  useEffect(() => {
    const loadModel = async () => {
      try {
        const net = await bodyPix.load({
          architecture: "MobileNetV1",
          outputStride: 16,
          multiplier: 0.75,
          quantBytes: 2,
        });
        setModel(net);
      } catch (err) {
        toast.error("Failed to load AI model");
        console.error(err);
      }
    };

    loadModel();
  }, []);

  // ✅ Handle file upload
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageURL(url);
    }
  };

  // ✅ Remove background
  const removeBackground = async () => {
    if (!imageURL) return toast.error("Upload image first");
    if (!model) return toast.error("Model still loading...");

    setLoading(true);

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageURL;

      img.onload = async () => {
        const segmentation = await model.segmentPerson(img);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        for (let i = 0; i < segmentation.data.length; i++) {
          if (segmentation.data[i] === 0) {
            pixels[i * 4 + 3] = 0; // remove background
          }
        }

        ctx.putImageData(imageData, 0, 0);
        setLoading(false);
      };

    } catch (err) {
      console.error(err);
      toast.error("Error processing image");
      setLoading(false);
    }
  };

  // ✅ Download image
  const downloadImage = () => {
    if (!canvasRef.current) return;

    const link = document.createElement("a");
    link.download = "removed-bg.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <>
      {/* ================= HERO ================= */} <section className="hero-section bg-remover-hero"> <div className="container text-center"> <div className="breadcrumb-pill"> <span>🏠 Home</span> <span className="separator">›</span> <span className="active">Background Remover</span> </div> <h1 className="hero-title"> Remove Image Background <span>Instantly</span> </h1> <p className="hero-subtitle"> Automatically remove backgrounds from images in seconds. 100% free, no signup required, and high-quality results. </p> <div className="hero-trust"> ⚡ AI Powered • 🔒 Secure • 🎯 High Accuracy • 📱 Mobile Friendly </div> </div> </section>
      {/* AD */}
      <div className="glass-card p-2 mb-4 text-center banner-ad">
        <p className="ad-title">Advertisement</p>
        <img src={bannerImg1} alt="Ad Banner" className="img-fluid rounded" />
      </div>

      <div className="container py-5">

        {/* ===== TOP SECTION ===== */}
        <div className="row g-4 align-items-stretch">

          {/* LEFT - UPLOAD */}
          <div className="col-lg-8">
            <div className="glass-card p-4 h-100 text-center">

              <h3 className="mb-3">AI Background Remover</h3>

              {/* Upload Box */}
              <div
                onClick={() => fileInputRef.current.click()}
                className="upload-box-premium mb-3"
              >
                <p className="mb-1 fw-semibold">
                  {imageURL ? "✅ Image Selected" : "📁 Click to Upload Image"}
                </p>
                <small className="text-muted">
                  PNG, JPG supported • Max 5MB
                </small>

                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleFile}
                  accept="image/*"
                />
              </div>

              {/* Button */}
              <button
                onClick={removeBackground}
                disabled={loading}
                className="btn-premium"
              >
                {loading ? "Processing..." : "🚀 Remove Background"}
              </button>

            </div>
          </div>

          {/* RIGHT - ADS */}
          <div className="col-lg-4">
            <div className="glass-card p-3 ad-section h-100">
              <p className="text-center small text-muted mb-2">Advertisement</p>
              <img
                src={squreImg1}
                alt="Ad"
                className="img-fluid rounded"
              />
            </div>
          </div>

        </div>

        {/* ===== RESULT SECTION ===== */}
        <div className="row mt-5 g-4">

          {/* ORIGINAL */}
          <div className="col-md-6">
            <div className="glass-card p-3 text-center h-100">
              <h5 className="mb-3">Original Image</h5>

              {imageURL ? (
                <img
                  src={imageURL}
                  alt="original"
                  className="result-img"
                />
              ) : (
                <p className="text-muted">No image uploaded</p>
              )}
            </div>
          </div>

          {/* RESULT */}
          <div className="col-md-6">
            <div className="glass-card p-3 text-center h-100">
              <h5 className="mb-3">Background Removed</h5>

              <canvas
                ref={canvasRef}
                className="result-img"
              />

              <button
                onClick={downloadImage}
                className="btn-premium mt-3"
                disabled={!imageURL}
              >
                ⬇ Download Image
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


      <section className="how-it-works-section py-5">
        <div className="container">

          {/* Heading */}
          <div className="text-center mb-5">
            <h2 className="section-title">
              How to Remove Background from Image Online
            </h2>
            <p className="section-subtitle">
              Remove image backgrounds instantly with our AI-powered tool.
              Upload your image, let AI do the magic, and download your result in seconds.
            </p>
          </div>

          {/* Steps */}
          <div className="row g-4">

            {/* Step 1 */}
            <div className="col-md-4">
              <div className="step-card text-center h-100">
                <div className="step-icon gradient-icon">
                  <FiUploadCloud />
                </div>
                <h5 className="step-title">Upload Your Image</h5>
                <p className="step-desc">
                  Upload any JPG or PNG image from your device.
                  Fast, secure, and no signup required.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="col-md-4">
              <div className="step-card text-center h-100">
                <div className="step-icon gradient-icon">
                  <AiOutlineThunderbolt />
                </div>
                <h5 className="step-title">AI Removes Background</h5>
                <p className="step-desc">
                  Our AI automatically detects the subject and removes
                  the background with high accuracy in seconds.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="col-md-4">
              <div className="step-card text-center h-100">
                <div className="step-icon gradient-icon">
                  <MdDownload />
                </div>
                <h5 className="step-title">Download Image</h5>
                <p className="step-desc">
                  Download your transparent background image instantly
                  in high quality without watermark.
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
            <h2 className="section-title">
              Why Choose Our AI Background Remover
            </h2>
            <p className="section-subtitle">
              Experience fast, secure, and high-quality background removal with our powerful AI tool — built for everyone.
            </p>
          </div>

          {/* Features Grid */}
          <div className="row g-4">

            {/* Feature 1 */}
            <div className="col-md-4">
              <div className="feature-card">
                <FaCheckCircle className="feature-icon" />
                <h5>100% Free</h5>
                <p>Use our background remover completely free with no hidden charges.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-md-4">
              <div className="feature-card">
                <AiOutlineUserDelete className="feature-icon" />
                <h5>No Signup Required</h5>
                <p>No registration needed. Upload and remove background instantly.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="col-md-4">
              <div className="feature-card">
                <FiZap className="feature-icon" />
                <h5>Fast Processing</h5>
                <p>Our AI processes images in seconds for quick and efficient results.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="col-md-4">
              <div className="feature-card">
                <MdOutlineHighQuality className="feature-icon" />
                <h5>High Quality Output</h5>
                <p>Get clean, sharp edges and high-resolution transparent images.</p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="col-md-4">
              <div className="feature-card">
                <FiShield className="feature-icon" />
                <h5>Secure & Private</h5>
                <p>Your images are never stored. 100% safe and private processing.</p>
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
      <section className="usecases-section py-5">
        <div className="container">

          {/* Heading */}
          <div className="text-center mb-5">
            <h2 className="section-title">
              Where You Can Use Background Remover
            </h2>
            <p className="section-subtitle">
              Our AI background remover is perfect for multiple use cases — from e-commerce to social media and marketing.
            </p>
          </div>

          {/* Grid */}
          <div className="row g-4">

            {/* E-commerce */}
            <div className="col-md-3 col-sm-6">
              <div className="usecase-card">
                <FaShoppingBag className="usecase-icon" />
                <h6>E-commerce Products</h6>
                <p>Create clean product images for Amazon, Flipkart, Shopify & more.</p>
              </div>
            </div>

            {/* Profile */}
            <div className="col-md-3 col-sm-6">
              <div className="usecase-card">
                <FaUserCircle className="usecase-icon" />
                <h6>Profile Pictures</h6>
                <p>Make professional profile photos for LinkedIn, resumes, and portfolios.</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="col-md-3 col-sm-6">
              <div className="usecase-card">
                <FiInstagram className="usecase-icon" />
                <h6>Social Media Posts</h6>
                <p>Create engaging Instagram, Facebook, and YouTube thumbnails.</p>
              </div>
            </div>

            {/* Marketing */}
            <div className="col-md-3 col-sm-6">
              <div className="usecase-card">
                <MdCampaign className="usecase-icon" />
                <h6>Marketing Creatives</h6>
                <p>Design ads, banners, and promotional graphics easily.</p>
              </div>
            </div>

          </div>

        </div>
      </section>
      <section className="faq-section py-5">
      <div className="container">

        {/* Heading */}
        <div className="text-center mb-5">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Find answers to common questions about our AI background remover tool.
          </p>
        </div>

        {/* FAQ List */}
        <div className="faq-wrapper mx-auto">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
            >
              <div
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <h6>{item.question}</h6>
                <FiChevronDown className="faq-icon" />
              </div>

              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>

    <RelatedTools/>
    </>
  );
};

export default BackgroundRemover;