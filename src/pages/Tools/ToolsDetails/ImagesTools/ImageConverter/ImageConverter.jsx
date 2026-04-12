import { useState, useRef } from "react";
import "./ImageConverter.css"
import bannerImg1 from "../../../../../assets/img/adsbanner1.png"
import bannerImg2 from "../../../../../assets/img/adsbanner2.png"
import squreImg1 from "../../../../../assets/img/squareads1.png"
import squreImg2 from "../../../../../assets/img/squareads2.png"
import bannerImg3 from "../../../../../assets/img/adsbanner3.png"
import { FaUpload, FaExchangeAlt, FaCog, FaDownload, FaBolt, FaImage, FaShieldAlt, FaLayerGroup, FaUserSlash, FaMobileAlt, FaUnlock, FaCheckCircle } from "react-icons/fa";
import { Accordion} from "react-bootstrap";
import RelatedTools from "../../../../../components/RelatedTools";


export const ImageConverter = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [convertedUrl, setConvertedUrl] = useState(null);
  const [toFormat, setToFormat] = useState("image/jpeg");
  const [loading, setLoading] = useState(false);

  const fileRef = useRef();

  // HANDLE FILE
  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setConvertedUrl(null);
    }
  };

  // DRAG DROP
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setConvertedUrl(null);
    }
  };

  // CONVERT FUNCTION (CANVAS)
  const handleConvert = () => {
    if (!file) return;

    setLoading(true);

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const output = canvas.toDataURL(toFormat, 0.9);

      setConvertedUrl(output);
      setLoading(false);
    };
  };

  // DOWNLOAD
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = convertedUrl;
    link.download = `converted.${toFormat.split("/")[1]}`;
    link.click();
  };
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="hero-section">
        <div className="container text-center">

          <div className="breadcrumb-pill">
            <span>🏠 Home</span>
            <span className="separator">›</span>
            <span className="active">Image Converter</span>
          </div>

          <h1 className="hero-title">
            Convert Images <span>In Any Format Instantly</span>
          </h1>

          <p className="hero-subtitle">
            Convert JPG, PNG, WebP, SVG and more formats online for free. Fast, secure, and high-quality image conversion in seconds.
          </p>

          <div className="hero-trust">
            ⚡ Fast • 🔄 Multi Format • 🔒 Secure • 📱 Mobile Friendly
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

      {/* converter-wrapper */}
      <section className="converter-wrapper">
        <div className="container">

          <div className="row g-4 align-items-center">

            {/* LEFT SIDE */}
            <div className="col-lg-8">

              <div className="converter-card">

                <h5 className="converter-title text-center mb-4">
                  Upload & Convert Image
                </h5>

                {/* UPLOAD BOX */}
                <div
                  className="converter-upload-box text-center"
                  onClick={() => fileRef.current.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="upload-icon">📁</div>

                  <h6>
                    {file ? file.name : "Drag & Drop Images Here"}
                  </h6>

                  <p className="text-muted">
                    or browse files from your device
                  </p>

                  <button className="btn btn-primary-custom mt-2">
                    Browse Files
                  </button>

                  <input
                    type="file"
                    hidden
                    ref={fileRef}
                    accept="image/*"
                    onChange={handleFile}
                  />
                </div>

                {/* PREVIEW */}
                {preview && (
                  <div className="preview-box text-center mt-4">
                    <img src={preview} alt="preview" />
                  </div>
                )}

                {/* FORMAT SELECT */}
                {file && (
                  <div className="converter-options mt-4">

                    <div className="row g-3">

                      <div className="col-md-6">
                        <label>From</label>
                        <input
                          className="form-control premium-select"
                          value={file.type || "Auto Detect"}
                          disabled
                        />
                      </div>

                      <div className="col-md-6">
                        <label>To</label>
                        <select
                          className="form-select premium-select"
                          value={toFormat}
                          onChange={(e) => setToFormat(e.target.value)}
                        >
                          <option value="image/jpeg">JPG</option>
                          <option value="image/png">PNG</option>
                          <option value="image/webp">WEBP</option>
                        </select>
                      </div>

                    </div>

                  </div>
                )}

                {/* CONVERT BUTTON */}
                {file && (
                  <button
                    className="btn-convert mt-4 w-100"
                    onClick={handleConvert}
                  >
                    {loading ? "⚡ Converting..." : "🔄 Convert Image"}
                  </button>
                )}

                {/* RESULT */}
                {convertedUrl && (
                  <div className="result-box text-center mt-4">
                    <img src={convertedUrl} alt="converted" />

                    <button
                      className="btn-premium-download mt-3"
                      onClick={handleDownload}
                    >
                      ⬇ Download Converted Image
                    </button>
                  </div>
                )}

              </div>

            </div>

            {/* RIGHT SIDE AD */}
            <div className="col-lg-4">
              <div className="converter-ad-sticky">

                {/* ALWAYS SHOW FIRST AD */}
                <div className="converter-ad-card mb-3">
                  <p className="ad-title">Advertisement</p>
                  <img src={squreImg1} className="img-fluid rounded" alt="ad" />
                </div>

                {/* SHOW AFTER UPLOAD */}
                {file && (
                  <div className="converter-ad-card mb-3">
                    <img src={squreImg2} className="img-fluid rounded" alt="ad" />
                  </div>
                )}

                {/* SHOW AFTER CONVERT */}
                {convertedUrl && (
                  <div className="converter-ad-card">
                    <img src={squreImg1} className="img-fluid rounded" alt="ad" />
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>
      {/* ================= TOP BANNER AD ================= */}
      <div className="glass-card p-2 mb-4 text-center banner-ad">
        <p className="ad-title">Advertisement</p>
        <img
          src={bannerImg2}
          alt="Ad Banner"
          className="img-fluid rounded"
        />
      </div>

      <section className="how-section-premium">
        <div className="container">

          {/* HEADER */}
          <div className="text-center mb-5">
            <h2 className="how-title">How It Works</h2>
            <p className="how-subtitle">
              Convert your images in just a few simple steps.
            </p>
          </div>

          {/* STEPS */}
          <div className="row g-4">

            {/* STEP 1 */}
            <div className="col-md-6 col-lg-3">
              <div className="how-card">
                <div className="how-icon">
                  <FaUpload />
                </div>
                <h6>Upload Image</h6>
                <p>Select or drag & drop your image file.</p>
                <span className="step-badge">01</span>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="col-md-6 col-lg-3">
              <div className="how-card">
                <div className="how-icon">
                  <FaCog />
                </div>
                <h6>Select Format</h6>
                <p>Choose your desired output format.</p>
                <span className="step-badge">02</span>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="col-md-6 col-lg-3">
              <div className="how-card">
                <div className="how-icon">
                  <FaExchangeAlt />
                </div>
                <h6>Convert</h6>
                <p>Click convert and process instantly.</p>
                <span className="step-badge">03</span>
              </div>
            </div>

            {/* STEP 4 */}
            <div className="col-md-6 col-lg-3">
              <div className="how-card">
                <div className="how-icon">
                  <FaDownload />
                </div>
                <h6>Download</h6>
                <p>Save your converted image instantly.</p>
                <span className="step-badge">04</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      <section className="features-section-white">
        <div className="container">

          {/* HEADER */}
          <div className="text-center mb-5">
            <h2 className="features-title">
              Powerful Features
            </h2>
            <p className="features-subtitle">
              Everything you need for fast and high-quality image conversion.
            </p>
          </div>

          {/* GRID */}
          <div className="row g-4">

            {/* FEATURE 1 */}
            <div className="col-md-6 col-lg-3">
              <div className="feature-card-white">
                <div className="feature-icon-white">
                  <FaBolt />
                </div>
                <h6>Fast Conversion</h6>
                <p>Convert images instantly with high-speed processing.</p>
              </div>
            </div>

            {/* FEATURE 2 */}
            <div className="col-md-6 col-lg-3">
              <div className="feature-card-white">
                <div className="feature-icon-white">
                  <FaImage />
                </div>
                <h6>No Quality Loss</h6>
                <p>Maintain original image clarity after conversion.</p>
              </div>
            </div>

            {/* FEATURE 3 */}
            <div className="col-md-6 col-lg-3">
              <div className="feature-card-white">
                <div className="feature-icon-white">
                  <FaShieldAlt />
                </div>
                <h6>Secure Processing</h6>
                <p>Your images are processed safely and never stored.</p>
              </div>
            </div>

            {/* FEATURE 4 */}
            <div className="col-md-6 col-lg-3">
              <div className="feature-card-white">
                <div className="feature-icon-white">
                  <FaLayerGroup />
                </div>
                <h6>Multiple Formats</h6>
                <p>Supports JPG, PNG, WebP and more formats.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      <section className="formats-section-premium">
        <div className="container">

          {/* HEADER */}
          <div className="text-center mb-5">
            <h2 className="formats-title-premium">
              Supported Format Conversions
            </h2>
            <p className="formats-subtitle-premium">
              Convert images between popular formats instantly with high quality.
            </p>
          </div>

          {/* GRID */}
          <div className="row g-4 justify-content-center">

            {/* ITEM 1 */}
            <div className="col-md-6 col-lg-4">
              <div className="format-card-premium">
                <div className="format-icons">
                  <span className="format-badge">JPG</span>
                  <FaExchangeAlt className="arrow-icon" />
                  <span className="format-badge active">PNG</span>
                </div>
                <p>Convert JPG images to PNG format without quality loss.</p>
              </div>
            </div>

            {/* ITEM 2 */}
            <div className="col-md-6 col-lg-4">
              <div className="format-card-premium">
                <div className="format-icons">
                  <span className="format-badge">PNG</span>
                  <FaExchangeAlt className="arrow-icon" />
                  <span className="format-badge active">WEBP</span>
                </div>
                <p>Optimize PNG images by converting them to WebP format.</p>
              </div>
            </div>

            {/* ITEM 3 */}
            <div className="col-md-6 col-lg-4">
              <div className="format-card-premium">
                <div className="format-icons">
                  <span className="format-badge">WEBP</span>
                  <FaExchangeAlt className="arrow-icon" />
                  <span className="format-badge active">JPG</span>
                </div>
                <p>Convert WebP images back to JPG for better compatibility.</p>
              </div>
            </div>

            {/* ITEM 4 */}
            <div className="col-md-6 col-lg-4">
              <div className="format-card-premium">
                <div className="format-icons">
                  <span className="format-badge">JPG</span>
                  <FaExchangeAlt className="arrow-icon" />
                  <span className="format-badge active">WEBP</span>
                </div>
                <p>Reduce image size by converting JPG to WebP format.</p>
              </div>
            </div>

            {/* ITEM 5 */}
            <div className="col-md-6 col-lg-4">
              <div className="format-card-premium">
                <div className="format-icons">
                  <span className="format-badge">PNG</span>
                  <FaExchangeAlt className="arrow-icon" />
                  <span className="format-badge active">JPG</span>
                </div>
                <p>Convert PNG images into lightweight JPG format easily.</p>
              </div>
            </div>

          </div>

        </div>
      </section>
        {/* ================= TOP BANNER AD ================= */}
      <div className="glass-card p-2 mb-4 text-center banner-ad">
        <p className="ad-title">Advertisement</p>
        <img
          src={bannerImg3}
          alt="Ad Banner"
          className="img-fluid rounded"
        />
      </div>

      <section className="why-section-premium">
        <div className="container">

          {/* HEADER */}
          <div className="text-center mb-5">
            <h2 className="why-title-premium">
              Why Choose Our Tool
            </h2>
            <p className="why-subtitle-premium">
              Built for speed, simplicity, and complete user freedom.
            </p>
          </div>

          {/* GRID */}
          <div className="row g-4 justify-content-center">

            {/* ITEM 1 */}
            <div className="col-md-6 col-lg-3">
              <div className="why-card-premium">
                <div className="why-icon-premium">
                  <FaCheckCircle />
                </div>
                <h6>No Watermark</h6>
                <p>Download images without any branding or watermark.</p>
              </div>
            </div>

            {/* ITEM 2 */}
            <div className="col-md-6 col-lg-3">
              <div className="why-card-premium">
                <div className="why-icon-premium">
                  <FaUnlock />
                </div>
                <h6>Free Forever</h6>
                <p>Use all features without paying anything, anytime.</p>
              </div>
            </div>

            {/* ITEM 3 */}
            <div className="col-md-6 col-lg-3">
              <div className="why-card-premium">
                <div className="why-icon-premium">
                  <FaMobileAlt />
                </div>
                <h6>Mobile Friendly</h6>
                <p>Works perfectly on mobile, tablet, and desktop.</p>
              </div>
            </div>

            {/* ITEM 4 */}
            <div className="col-md-6 col-lg-3">
              <div className="why-card-premium">
                <div className="why-icon-premium">
                  <FaUserSlash />
                </div>
                <h6>No Signup Required</h6>
                <p>Start converting instantly without creating an account.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      <section className="faq-section-premium">
        <div className="container">

          {/* HEADER */}
          <div className="text-center mb-5">
            <h2 className="faq-title-premium">
              Frequently Asked Questions
            </h2>
            <p className="faq-subtitle-premium">
              Everything you need to know about our image converter.
            </p>
          </div>

          {/* ACCORDION */}
          <Accordion defaultActiveKey="0" className="faq-accordion-premium">

            <Accordion.Item eventKey="0" className="faq-item-premium">
              <Accordion.Header>Is this tool free to use?</Accordion.Header>
              <Accordion.Body>
                Yes, our image converter is completely free to use with no hidden charges.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1" className="faq-item-premium">
              <Accordion.Header>Does conversion reduce image quality?</Accordion.Header>
              <Accordion.Body>
                No, our tool ensures high-quality conversion while maintaining image clarity.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2" className="faq-item-premium">
              <Accordion.Header>Is my data safe?</Accordion.Header>
              <Accordion.Body>
                Yes, your images are processed securely and are never stored on our servers.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3" className="faq-item-premium">
              <Accordion.Header>Which formats are supported?</Accordion.Header>
              <Accordion.Body>
                We support JPG, PNG, WebP and other popular image formats.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4" className="faq-item-premium">
              <Accordion.Header>Can I use this tool on mobile?</Accordion.Header>
              <Accordion.Body>
                Yes, our tool is fully mobile-friendly and works on all devices.
              </Accordion.Body>
            </Accordion.Item>

          </Accordion>

        </div>
      </section>

      {/* realtedrools */}
      <RelatedTools/>
    </>
  )
}
