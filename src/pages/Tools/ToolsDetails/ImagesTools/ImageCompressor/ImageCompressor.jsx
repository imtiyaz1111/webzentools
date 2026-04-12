import { useState, useRef, useEffect } from "react";
import { Row, Col, Card, Container, Accordion } from "react-bootstrap";
import imageCompression from "browser-image-compression";
import "./ImageCompressor.css";
import { FaBolt, FaCheckCircle, FaCompressAlt, FaDownload,FaFileImage, FaImage, FaLock, FaShieldAlt, FaSlidersH, FaUpload } from "react-icons/fa";
import bannerImg1 from "../../../../../assets/img/adsbanner1.png"
import bannerImg2 from "../../../../../assets/img/adsbanner2.png"
import bannerImg3 from "../../../../../assets/img/adsbanner3.png"
import squreImg1 from "../../../../../assets/img/squareads1.png"
import squreImg2 from "../../../../../assets/img/squareads2.png"
import SEO from "../../../../../components/SEO";
import RelatedTools from "../../../../../components/RelatedTools";

export default function ImageCompressor() {
  const [file, setFile] = useState(null);
  const [compressed, setCompressed] = useState(null);
  const [targetSize, setTargetSize] = useState(100);
  const [loading, setLoading] = useState(false);

  // URLs for preview
  const [originalUrl, setOriginalUrl] = useState(null);
  const [compressedUrl, setCompressedUrl] = useState(null);

  const fileInputRef = useRef();

  // Cleanup Object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [originalUrl, compressedUrl]);

  // ========= FILE SELECT =========
  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setCompressed(null);
      setCompressedUrl(null);
      setOriginalUrl(URL.createObjectURL(selected));
    }
  };

  // ========= SMART COMPRESSION =========
  const compressToTarget = async (file, targetKB) => {
    let min = 0.1;
    let max = 1.0;
    let quality = 0.8;
    let bestResult = null;

    // Use a maximum of 6 iterations to find the best quality/size balance
    for (let i = 0; i < 6; i++) {
      const options = {
        maxSizeMB: targetKB / 1024,
        useWebWorker: true,
        initialQuality: quality,
        maxWidthOrHeight: 1920, // Prevents extreme resolution downscaling
      };

      const compressedFile = await imageCompression(file, options);
      const sizeKB = compressedFile.size / 1024;

      if (sizeKB <= targetKB) {
        bestResult = compressedFile;
        min = quality;
        quality = (quality + max) / 2;
      } else {
        max = quality;
        quality = (quality + min) / 2;
      }
    }
    return bestResult || file;
  };

  // ========= COMPRESS ACTION =========
  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const output = await compressToTarget(file, targetSize);
      setCompressed(output);

      // Revoke old URL if exists and create new one
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
      setCompressedUrl(URL.createObjectURL(output));
    } catch (err) {
      console.error("Compression failed:", err);
    }
    setLoading(false);
  };

  // ========= DOWNLOAD FUNCTION =========
  const handleDownload = () => {
    if (!compressedUrl) return;
    const link = document.createElement("a");
    link.href = compressedUrl;
    link.download = `compressed_${file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const originalSize = file ? (file.size / 1024).toFixed(1) : 0;
  const compressedSize = compressed ? (compressed.size / 1024).toFixed(1) : 0;
  const reduction = file && compressed
    ? (((file.size - compressed.size) / file.size) * 100).toFixed(1)
    : 0;

  return (
    <>
      <SEO
        title={`Free Image Compressor Online | Reduce Image Size Without Losing Quality`}
        description={`Compress images online for free without losing quality. Reduce JPG, PNG, WebP file size instantly with our fast, secure, and mobile-friendly image compressor tool.`}
        keywords="image compressor, compress image online, reduce image size, jpg compressor, png compressor, webp compressor, image optimizer, free image compression tool"
        url={`https://www.webzentools.com/image-compressor`}
      />
      <div className="text-center">
        {/* ================= HERO ================= */}
        <section className="hero-section">
          <div className="container text-center">
            <div className="breadcrumb-pill">
              <span>🏠 Home</span>
              <span className="separator">›</span>
              <span className="active">Image Compressor</span>
            </div>
            <h1 className="hero-title">
              Compress Images <span>Without Losing Quality</span>
            </h1>
            <p className="hero-subtitle">
              Reduce image file size instantly with our free online image compressor.
            </p>
            <div className="hero-trust">
              ⚡ Fast • 🔒 Secure • 📱 Mobile Friendly
            </div>
          </div>
        </section>
        {/* ================= TOP BANNER AD ================= */}
        <div className="glass-card p-2 mb-4 text-center banner-ad">
          <p className="ad-title">Advertisement</p>
          <img
            src={bannerImg1}
            alt="Ad Banner"
            className="img-fluid rounded"
          />
        </div>

        {/* ================= MAIN ================= */}
        <div className="row g-4 container mx-auto">
          <div className="col-lg-8">
            <div className="glass-card p-4 upload-section">
              <h5 className="mb-3 text-dark">Upload & Compress</h5>
              <div
                className="upload-box-inner text-center"
                onClick={() => fileInputRef.current.click()}
                style={{ cursor: "pointer" }}
              >
                <div className="upload-icon mb-3">📁</div>
                <h6 className="fw-semibold text-dark">
                  {file ? file.name : "Drag & Drop Images Here"}
                </h6>
                <button className="btn btn-primary-custom px-4 mt-2">
                  Browse Files
                </button>
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFile}
                />
              </div>
            </div>
          </div>

          {/* SIDEBAR ADS */}
          <div className="col-lg-4">
            <div className="glass-card p-3 ad-section">
              <p className="text-center small text-muted mb-2">Advertisement</p>
              <img src={squreImg1} alt="Ad" className="img-fluid rounded mb-3" />
            </div>
          </div>
        </div>

        {/* ================= CONTROLS (Only show when file is uploaded) ================= */}
        {file && (
          <div className="glass-card p-4 mb-4 text-start control-card mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0 fw-semibold text-dark">Target File Size</h6>
              <span className="size-badge">{targetSize} KB</span>
            </div>

            <div className="preset-group mb-3">
              {[50, 100, 200, 500].map((size) => (
                <button
                  key={size}
                  className={`preset-btn ${targetSize === size ? "active" : ""}`}
                  onClick={() => setTargetSize(size)}
                >
                  {size}KB
                </button>
              ))}
            </div>

            <div className="slider-wrapper mb-4">
              <input
                type="range"
                min="20"
                max="1000"
                value={targetSize}
                onChange={(e) => setTargetSize(Number(e.target.value))}
                className="custom-slider"
              />
            </div>

            <button
              className="btn-primary-custom w-100 premium-btn"
              onClick={handleCompress}
              disabled={loading}
            >
              {loading ? "🚀 Optimizing Quality..." : "🚀 Compress Image"}
            </button>
          </div>
        )}

        {/* ================= RESULTS ================= */}
        {compressed && (
          <Row className="mt-4 g-4 container mx-auto mb-5">
            <Col lg={8}>
              <Card className="result-card-premium p-3 border-0">
                <div className="compare-wrapper">
                  <div className="compare-box">
                    <span className="label before">Before</span>
                    <img src={originalUrl} alt="original" />
                  </div>
                  <div className="compare-box">
                    <span className="label after">After</span>
                    <img src={compressedUrl} alt="compressed" />
                  </div>
                </div>

                <div className="result-info text-center">
                  <p className="size-text">
                    {originalSize} KB → {compressedSize} KB
                  </p>
                  <p className="save-text">
                    🎉 Saved {reduction}%
                  </p>
                </div>

                <button
                  onClick={handleDownload}
                  className="btn-premium-download"
                >
                  ⬇ Download Image
                </button>
              </Card>
            </Col>
            {/* ===== RIGHT SIDE (ADS) ===== */}
            <Col lg={4}>
              <div className="ad-card-premium">

                <p className="ad-title">Advertisement</p>

                <img
                  src={squreImg2}
                  className="img-fluid rounded mb-3"
                  alt="ad"
                />

                <img
                  src="https://via.placeholder.com/300x600"
                  className="img-fluid rounded"
                  alt="ad"
                />

              </div>
            </Col>
          </Row>
        )}
      </div>

      {/* FEATURES SECTION */}
      <section className="features-section">

        <Container>

          {/* ===== SECTION HEADER ===== */}
          <div className="text-center mb-5">
            <h2 className="section-title">
              Why Choose Our Image Compressor
            </h2>

            <p className="section-subtitle">
              Powerful, fast, and secure image compression designed for modern users.
            </p>
          </div>

          {/* ===== FEATURES GRID ===== */}
          <Row className="g-4">

            {/* ===== FEATURE 1 ===== */}
            <Col md={6} lg={3}>
              <div className="feature-card">

                <div className="feature-icon">
                  <FaBolt />
                </div>

                <h6>Fast Compression</h6>

                <p>
                  Compress images instantly with lightning-fast processing speed.
                </p>

              </div>
            </Col>

            {/* ===== FEATURE 2 ===== */}
            <Col md={6} lg={3}>
              <div className="feature-card">

                <div className="feature-icon">
                  <FaImage />
                </div>

                <h6>No Quality Loss</h6>

                <p>
                  Maintain high image quality while significantly reducing file size.
                </p>

              </div>
            </Col>

            {/* ===== FEATURE 3 ===== */}
            <Col md={6} lg={3}>
              <div className="feature-card">

                <div className="feature-icon">
                  <FaShieldAlt />
                </div>

                <h6>100% Secure</h6>

                <p>
                  Your files are never stored. All processing happens securely.
                </p>

              </div>
            </Col>

            {/* ===== FEATURE 4 ===== */}
            <Col md={6} lg={3}>
              <div className="feature-card">

                <div className="feature-icon">
                  <FaLock />
                </div>

                <h6>Supports All Formats</h6>

                <p>
                  Works with JPG, PNG, WebP, SVG and many more formats.
                </p>

              </div>
            </Col>

          </Row>

        </Container>

      </section>

      {/* how-section */}
      <section className="how-section">

        <Container>

          {/* ===== SECTION HEADER ===== */}
          <div className="text-center mb-5">
            <h2 className="section-title">
              How It Works
            </h2>

            <p className="section-subtitle">
              Compress your images in just a few simple steps.
            </p>
          </div>

          {/* ===== STEPS ===== */}
          <Row className="g-4">

            {/* ===== STEP 1 ===== */}
            <Col md={6} lg={3}>
              <div className="step-card">

                <div className="step-icon">
                  <FaUpload />
                </div>

                <h6>Upload Image</h6>

                <p>
                  Select or drag & drop your image files to get started.
                </p>

                <span className="step-number">01</span>

              </div>
            </Col>

            {/* ===== STEP 2 ===== */}
            <Col md={6} lg={3}>
              <div className="step-card">

                <div className="step-icon">
                  <FaSlidersH />
                </div>

                <h6>Choose Size</h6>

                <p>
                  Adjust compression level or target file size as needed.
                </p>

                <span className="step-number">02</span>

              </div>
            </Col>

            {/* ===== STEP 3 ===== */}
            <Col md={6} lg={3}>
              <div className="step-card">

                <div className="step-icon">
                  <FaCompressAlt />
                </div>

                <h6>Compress</h6>

                <p>
                  Our tool instantly optimizes your images without quality loss.
                </p>

                <span className="step-number">03</span>

              </div>
            </Col>

            {/* ===== STEP 4 ===== */}
            <Col md={6} lg={3}>
              <div className="step-card">

                <div className="step-icon">
                  <FaDownload />
                </div>

                <h6>Download</h6>

                <p>
                  Save your compressed images instantly to your device.
                </p>

                <span className="step-number">04</span>

              </div>
            </Col>

          </Row>

        </Container>

      </section>

      {/* showcase-section */}
      <section className="showcase-section-dark">

        <Container>

          {/* ===== SECTION HEADER ===== */}
          <div className="text-center mb-5">
            <h2 className="section-title-dark">
              See the Difference
            </h2>

            <p className="section-subtitle-dark">
              Real compression results with no visible quality loss.
            </p>
          </div>

          {/* ===== SHOWCASE GRID ===== */}
          <Row className="g-4">

            {/* ===== CARD 1 ===== */}
            <Col md={6} lg={4}>
              <Card className="showcase-card-dark border-0">

                <div className="compare-wrapper">

                  <div className="compare-box">
                    <span className="label before">Before</span>
                    <img src="https://via.placeholder.com/400x300" alt="" />
                  </div>

                  <div className="compare-box">
                    <span className="label after">After</span>
                    <img src="https://via.placeholder.com/400x300" alt="" />
                  </div>

                </div>

                <div className="showcase-info text-center">
                  <p className="size-text">
                    1.2 MB → 120 KB
                  </p>

                  <p className="save-text">
                    🎉 Saved 90%
                  </p>
                </div>

              </Card>
            </Col>

            {/* ===== CARD 2 ===== */}
            <Col md={6} lg={4}>
              <Card className="showcase-card-dark border-0">

                <div className="compare-wrapper">

                  <div className="compare-box">
                    <span className="label before">Before</span>
                    <img src="https://via.placeholder.com/400x300" alt="" />
                  </div>

                  <div className="compare-box">
                    <span className="label after">After</span>
                    <img src="https://via.placeholder.com/400x300" alt="" />
                  </div>

                </div>

                <div className="showcase-info text-center">
                  <p className="size-text">
                    850 KB → 95 KB
                  </p>

                  <p className="save-text">
                    🎉 Saved 88%
                  </p>
                </div>

              </Card>
            </Col>

            {/* ===== CARD 3 ===== */}
            <Col md={6} lg={4}>
              <Card className="showcase-card-dark border-0">

                <div className="compare-wrapper">

                  <div className="compare-box">
                    <span className="label before">Before</span>
                    <img src="https://via.placeholder.com/400x300" alt="" />
                  </div>

                  <div className="compare-box">
                    <span className="label after">After</span>
                    <img src="https://via.placeholder.com/400x300" alt="" />
                  </div>

                </div>

                <div className="showcase-info text-center">
                  <p className="size-text">
                    2.4 MB → 210 KB
                  </p>

                  <p className="save-text">
                    🎉 Saved 91%
                  </p>
                </div>

              </Card>
            </Col>

          </Row>

        </Container>

      </section>

      {/* ================= BANNER AD ================= */}
      <div className="glass-card p-2 mb-4 text-center banner-ad">
        <p className="ad-title">Advertisement</p>
        <img
          src={bannerImg2}
          alt="Ad Banner"
          className="img-fluid rounded"
        />
      </div>

      {/* formats-section */}
      <section className="formats-section">

        <Container>

          {/* ===== SECTION HEADER ===== */}
          <div className="text-center mb-5">
            <h2 className="formats-title">
              Supported Formats
            </h2>

            <p className="formats-subtitle">
              We support all popular image formats for compression.
            </p>
          </div>

          {/* ===== FORMAT GRID ===== */}
          <Row className="g-4 justify-content-center">

            {/* ===== JPG ===== */}
            <Col xs={6} md={3}>
              <div className="format-card">

                <div className="format-icon">
                  <FaFileImage />
                </div>

                <h6>JPG</h6>

              </div>
            </Col>

            {/* ===== PNG ===== */}
            <Col xs={6} md={3}>
              <div className="format-card">

                <div className="format-icon">
                  <FaFileImage />
                </div>

                <h6>PNG</h6>

              </div>
            </Col>

            {/* ===== WEBP ===== */}
            <Col xs={6} md={3}>
              <div className="format-card">

                <div className="format-icon">
                  <FaFileImage />
                </div>

                <h6>WebP</h6>

              </div>
            </Col>

            {/* ===== SVG ===== */}
            <Col xs={6} md={3}>
              <div className="format-card">

                <div className="format-icon">
                  <FaFileImage />
                </div>

                <h6>SVG</h6>

              </div>
            </Col>

          </Row>

        </Container>

      </section>

      {/* faq-section */}
      <section className="faq-section">

        <Container>

          {/* ===== SECTION HEADER ===== */}
          <div className="text-center mb-5">
            <h2 className="faq-title">
              Frequently Asked Questions
            </h2>

            <p className="faq-subtitle">
              Everything you need to know about our image compressor.
            </p>
          </div>

          {/* ===== FAQ ACCORDION ===== */}
          <Accordion defaultActiveKey="0" className="faq-accordion">

            {/* ===== ITEM 1 ===== */}
            <Accordion.Item eventKey="0" className="faq-item">
              <Accordion.Header>Is this tool free to use?</Accordion.Header>
              <Accordion.Body>
                Yes, our image compressor is completely free to use with no hidden charges.
              </Accordion.Body>
            </Accordion.Item>

            {/* ===== ITEM 2 ===== */}
            <Accordion.Item eventKey="1" className="faq-item">
              <Accordion.Header>Does compression reduce image quality?</Accordion.Header>
              <Accordion.Body>
                No, we use advanced optimization techniques to reduce file size while maintaining high visual quality.
              </Accordion.Body>
            </Accordion.Item>

            {/* ===== ITEM 3 ===== */}
            <Accordion.Item eventKey="2" className="faq-item">
              <Accordion.Header>Is my data safe?</Accordion.Header>
              <Accordion.Body>
                Yes, your files are processed securely and are not stored on our servers.
              </Accordion.Body>
            </Accordion.Item>

            {/* ===== ITEM 4 ===== */}
            <Accordion.Item eventKey="3" className="faq-item">
              <Accordion.Header>What is the maximum file size?</Accordion.Header>
              <Accordion.Body>
                You can upload images up to 10MB per file for compression.
              </Accordion.Body>
            </Accordion.Item>

            {/* ===== ITEM 5 ===== */}
            <Accordion.Item eventKey="4" className="faq-item">
              <Accordion.Header>Which formats are supported?</Accordion.Header>
              <Accordion.Body>
                We support JPG, PNG, WebP, SVG and other popular formats.
              </Accordion.Body>
            </Accordion.Item>

          </Accordion>

        </Container>

      </section>
      {/* =================  BANNER AD ================= */}
      <div className="glass-card p-2 mb-4 text-center banner-ad">
        <p className="ad-title">Advertisement</p>
        <img
          src={bannerImg3}
          alt="Ad Banner"
          className="img-fluid rounded"
        />
      </div>
      <section className="why-section">

        <Container>

          {/* ===== SECTION HEADER ===== */}
          <div className="text-center mb-5">
            <h2 className="why-title">
              Why Choose Our Tool
            </h2>

            <p className="why-subtitle">
              Built for performance, simplicity, and reliability.
            </p>
          </div>

          {/* ===== BENEFITS GRID ===== */}
          <Row className="g-4 justify-content-center">

            {/* ===== BENEFIT 1 ===== */}
            <Col md={6} lg={3}>
              <div className="why-card">

                <div className="why-icon">
                  <FaCheckCircle />
                </div>

                <h6>No Watermark</h6>

                <p>
                  Download your images without any watermark or branding.
                </p>

              </div>
            </Col>

            {/* ===== BENEFIT 2 ===== */}
            <Col md={6} lg={3}>
              <div className="why-card">

                <div className="why-icon">
                  <FaCheckCircle />
                </div>

                <h6>Unlimited Use</h6>

                <p>
                  Compress as many images as you want with no limits.
                </p>

              </div>
            </Col>

            {/* ===== BENEFIT 3 ===== */}
            <Col md={6} lg={3}>
              <div className="why-card">

                <div className="why-icon">
                  <FaCheckCircle />
                </div>

                <h6>Fast Processing</h6>

                <p>
                  Get results instantly with optimized performance.
                </p>

              </div>
            </Col>

            {/* ===== BENEFIT 4 ===== */}
            <Col md={6} lg={3}>
              <div className="why-card">

                <div className="why-icon">
                  <FaCheckCircle />
                </div>

                <h6>Mobile Friendly</h6>

                <p>
                  Works perfectly on all devices including mobile and tablets.
                </p>

              </div>
            </Col>

          </Row>

        </Container>

      </section>

      <RelatedTools/>
    </>
  );
}