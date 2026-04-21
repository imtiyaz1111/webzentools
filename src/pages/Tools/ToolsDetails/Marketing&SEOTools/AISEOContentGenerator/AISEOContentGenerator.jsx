import { useState } from "react";
import { Row, Col, Card, Container, Accordion } from "react-bootstrap";
import "./AISEOContentGenerator.css";
import { FaCheckCircle, FaGlobe, FaShieldAlt, FaChartLine, FaRobot, FaBolt, FaPen, FaListUl, FaSearch, FaCopy, FaDownload } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import SEO from "../../../../../components/SEO";
import RelatedTools from "../../../../../components/RelatedTools";

import bannerImg1 from "../../../../../assets/img/adsbanner1.png"
import bannerImg2 from "../../../../../assets/img/adsbanner2.png"
import bannerImg3 from "../../../../../assets/img/adsbanner3.png"
import squreImg1 from "../../../../../assets/img/squareads1.png"
import squreImg2 from "../../../../../assets/img/squareads2.png"

export default function AISEOContentGenerator() {
  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic or blog idea.");
      return;
    }
    
    if (!keyword.trim()) {
      toast.error("Entering a target keyword is highly recommended for SEO.", { icon: '⚠️' });
    }

    setLoading(true);
    setResult(null);

    // Mock API simulation for AI logic
    setTimeout(() => {
      const kw = keyword.trim() || topic.trim();
      const title = `Best ${kw} Guide for Beginners in 2025`;
      const meta = `Learn everything about ${kw} including expert tips, proven strategies, and best practices to boost your success today.`;
      const headings = [
        `H1: Complete Guide to ${kw}`,
        `H2: What is ${kw}?`,
        `H2: Key Benefits of ${kw}`,
        `H2: How to Use ${kw} Effectively`,
        `H3: Top Tips & Tricks for 2025`,
        `H2: Conclusion`
      ];

      // Simulated paragraphs based on length
      let contentParas = [];
      const pCount = length === "Short" ? 3 : length === "Medium" ? 5 : 8;
      
      for(let i=0; i<pCount; i++) {
        contentParas.push(`When discussing ${kw}, it is crucial to understand the foundational elements that drive results. The landscape is constantly evolving, but the core principles of using ${kw} remain effective. By integrating these strategies into your daily workflow, you can expect significant improvements in overall performance. Remember perfectly optimizing your approach to ${kw} depends heavily on maintaining a ${tone.toLowerCase()} tone that connects with your audience.`);
      }

      setResult({
        title,
        meta,
        headings,
        content: contentParas.join("\n\n")
      });
      
      setLoading(false);
      toast.success("SEO Content Generated Successfully!");
    }, 2500);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  const downloadContent = () => {
    if (!result) return;
    const fullText = `${result.title}\n\nMeta: ${result.meta}\n\n${result.headings.join("\n")}\n\n${result.content}`;
    const element = document.createElement("a");
    const file = new Blob([fullText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "seo-content.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Content downloaded!");
  };

  return (
    <>
      <SEO
        title="AI SEO Content Generator | Free Blog Writer"
        description="Generate high-quality, SEO-optimized blog content instantly using AI. Input your topic, keywords, and tone, and let our fake-AI do the rest."
        keywords="ai content generator, seo blog writer, ai writing tool, automated blog content"
        url="https://www.webzentools.com/tools/ai-seo-content-generator"
      />
      
      <Toaster position="top-right" />

      <div className="text-center">
        {/* ================= HERO ================= */}
        <section className="hero-section">
          <div className="container text-center">
            <div className="breadcrumb-pill">
              <span>🏠 Home</span>
              <span className="separator">›</span>
              <span className="active">AI SEO Content Generator</span>
            </div>
            <h1 className="hero-title">
              AI SEO Content <span>Generator</span>
            </h1>
            <p className="hero-subtitle">
              Generate high-quality SEO blogs instantly with AI
            </p>
            <div className="hero-trust">
              ⚡ Fast • 🧠 AI Powered • 📈 SEO Optimized
            </div>
          </div>
        </section>
        
        {/* ================= TOP BANNER AD ================= */}
        <div className="glass-card p-2 mb-4 text-center banner-ad">
          <p className="ad-title">Advertisement</p>
          <img src={bannerImg1} alt="Ad Banner" className="img-fluid rounded" />
        </div>

        {/* ================= MAIN TOOL CARD ================= */}
        <div className="row g-4 container mx-auto">
          <div className="col-lg-8">
            <div className="glass-card p-4 upload-section">
              <h5 className="mb-3 text-dark text-start">Draft Settings</h5>
              <div className="upload-box-inner text-center">
                <div className="upload-icon mb-3">📝</div>
                <h6 className="fw-semibold text-dark mb-4">
                  Define your blog topic and targeted SEO parameters
                </h6>
                <div className="row g-3 text-start mb-4">
                  <div className="col-md-6">
                     <label className="form-label text-dark fw-bold small">Topic / Blog Idea <span className="text-danger">*</span></label>
                     <input
                        type="text"
                        className="form-control custom-input"
                        placeholder="e.g. Best SEO Tools for 2025"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                     />
                  </div>
                  <div className="col-md-6">
                     <label className="form-label text-dark fw-bold small">Target Keyword</label>
                     <input
                        type="text"
                        className="form-control custom-input"
                        placeholder="e.g. SEO tools"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                     />
                  </div>
                  <div className="col-md-6">
                     <label className="form-label text-dark fw-bold small">Content Length</label>
                     <select className="form-select custom-input" value={length} onChange={(e) => setLength(e.target.value)}>
                        <option value="Short">Short (~400 words)</option>
                        <option value="Medium">Medium (~800 words)</option>
                        <option value="Long">Long (~1500 words)</option>
                     </select>
                  </div>
                  <div className="col-md-6">
                     <label className="form-label text-dark fw-bold small">Tone of Voice</label>
                     <select className="form-select custom-input" value={tone} onChange={(e) => setTone(e.target.value)}>
                        <option value="Professional">Professional</option>
                        <option value="Casual">Casual</option>
                        <option value="Friendly">Friendly</option>
                        <option value="Marketing">Marketing (Persuasive)</option>
                     </select>
                  </div>
                </div>
                <button 
                  className="btn premium-btn w-100 mt-2" 
                  style={{ maxWidth: '600px' }}
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Generating AI content...</>
                  ) : "🚀 Generate SEO Content"}
                </button>
              </div>
            </div>
          </div>

          {/* SIDEBAR ADS */}
          <div className="col-lg-4">
            <div className="glass-card p-3 ad-section">
              <p className="text-center small text-muted mb-2">Advertisement</p>
              <img src={squreImg1} alt="Ad" className="img-fluid rounded border-0" />
            </div>
          </div>
        </div>

        {/* ================= RESULTS DASHBOARD ================= */}
        {result && (
          <Row className="mt-4 g-4 container mx-auto mb-5">
            <Col lg={8}>
              <Card className="result-card-premium p-4 border-0 text-start">
                <h5 className="text-white mb-4"><FaChartLine className="me-2 text-info" /> Generated SEO Content</h5>
                
                {/* TITLE & META */}
                <Row className="g-3 mb-4">
                  <Col md={12}>
                     <div className="metric-card p-3 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                           <p className="metric-label mb-0 fw-bold">📝 SEO Title</p>
                           <button className="btn btn-premium-copy" onClick={() => copyToClipboard(result.title, 'Title')}><FaCopy/> Copy</button>
                        </div>
                        <h5 className="text-white">{result.title}</h5>
                     </div>
                  </Col>
                  <Col md={12}>
                     <div className="metric-card p-3 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                           <p className="metric-label mb-0 fw-bold">📌 Meta Description (150-160 chars)</p>
                           <button className="btn btn-premium-copy" onClick={() => copyToClipboard(result.meta, 'Meta')}><FaCopy/> Copy</button>
                        </div>
                        <p className="text-light mb-0">{result.meta}</p>
                     </div>
                  </Col>
                </Row>

                {/* HEADINGS & CONTENT */}
                <Row className="g-4 mt-2">
                   <Col md={4}>
                     <div className="metric-card p-3 h-100">
                         <h6 className="text-white mb-3"><FaListUl className="me-2 text-warning"/> Headings</h6>
                         <ul className="text-light small list-unstyled">
                            {result.headings.map((h, i) => (
                               <li key={i} className="mb-2 border-bottom border-secondary pb-1">{h}</li>
                            ))}
                         </ul>
                     </div>
                   </Col>
                   <Col md={8}>
                     <div className="metric-card p-3 h-100">
                         <div className="d-flex justify-content-between align-items-center mb-3">
                             <h6 className="text-white mb-0"><FaPen className="me-2 text-success"/> Full Blog Content</h6>
                             <div>
                               <button className="btn btn-premium-copy me-2" onClick={() => copyToClipboard(result.content, 'Content')}><FaCopy/></button>
                               <button className="btn btn-premium-copy" onClick={downloadContent}><FaDownload/></button>
                             </div>
                         </div>
                         <div className="content-preview-box">
                             {result.content.split('\n\n').map((paragraph, index) => (
                               <p key={index}>{paragraph}</p>
                             ))}
                         </div>
                     </div>
                   </Col>
                </Row>

              </Card>
            </Col>
            
            {/* ===== RIGHT SIDE (ADS) ===== */}
            <Col lg={4}>
              <div className="ad-card-premium text-center pt-3 pb-3 h-100 d-flex flex-column justify-content-center">
                <p className="ad-title">Advertisement</p>
                <img src={squreImg2} className="img-fluid rounded mb-3" alt="ad" />
                <img src="https://via.placeholder.com/300x250" className="img-fluid rounded mt-auto" alt="ad" />
              </div>
            </Col>
          </Row>
        )}
      </div>

      {/* CONTENT QUALITY SECTION (CUSTOM ADDITION) */}
      <section className="features-section" style={{background: '#f8fafc', padding: '60px 0'}}>
        <Container>
           <div className="text-center mb-5">
             <h2 className="section-title">Content Quality Principles</h2>
             <p className="section-subtitle">How our AI ensures your blogs are fully optimized.</p>
           </div>
           <Row className="g-4">
              <Col md={6} lg={3}>
                <div className="feature-card shadow-sm border" style={{background: '#fff'}}>
                   <h6 className="text-dark fw-bold">SEO Friendly Writing</h6>
                   <p className="text-muted small">Our algorithm structures paragraphs and semantic links precisely the way Google loves indexing.</p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="feature-card shadow-sm border" style={{background: '#fff'}}>
                   <h6 className="text-dark fw-bold">Keyword Placement</h6>
                   <p className="text-muted small">Integrates primary keywords naturally into titles, metas, and early paragraphs without stuffing.</p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="feature-card shadow-sm border" style={{background: '#fff'}}>
                   <h6 className="text-dark fw-bold">Content Structure</h6>
                   <p className="text-muted small">We generate properly nested H1, H2, and H3 tags enabling readers and crawlers to digest the page fast.</p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="feature-card shadow-sm border" style={{background: '#fff'}}>
                   <h6 className="text-dark fw-bold">Readability Matrix</h6>
                   <p className="text-muted small">Adheres strictly to the tone you set while maintaining short sentences and engaging storytelling.</p>
                </div>
              </Col>
           </Row>
        </Container>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">Tool Features</h2>
            <p className="section-subtitle">A simple to use article writing machine.</p>
          </div>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="feature-card">
                <div className="feature-icon"><FaRobot /></div>
                <h6>AI-powered generation</h6>
                <p>Output entire blogs in just a few clicks.</p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="feature-card">
                <div className="feature-icon"><FaSearch /></div>
                <h6>SEO optimized</h6>
                <p>Structured perfectly for optimal SERP rankings.</p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="feature-card">
                <div className="feature-icon"><FaChartLine /></div>
                <h6>Keyword integration</h6>
                <p>Your target keyword applied contextually.</p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="feature-card">
                <div className="feature-icon"><FaPen /></div>
                <h6>Multiple tones</h6>
                <p>Change your narrative to suite your audience.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Drafting SEO content has never been easier.</p>
          </div>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="step-card">
                <div className="step-icon">1</div>
                <h6>Enter topic</h6>
                <p>Provide a high-level idea or precise subject.</p>
                <span className="step-number">01</span>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="step-card">
                <div className="step-icon">2</div>
                <h6>Choose keywords</h6>
                <p>Add the target term and specify the tone.</p>
                <span className="step-number">02</span>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="step-card">
                <div className="step-icon">3</div>
                <h6>Generate content</h6>
                <p>Hit the generate button to ping our simulated AI.</p>
                <span className="step-number">03</span>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="step-card">
                <div className="step-icon">4</div>
                <h6>Copy & publish</h6>
                <p>Copy the results or download them straight to your PC.</p>
                <span className="step-number">04</span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* SHOWCASE SECTION */}
      <section className="showcase-section-dark">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title-dark">Generation Showcase</h2>
            <p className="section-subtitle-dark">See what our tool creates in real-time.</p>
          </div>
          <Row className="g-4 justify-content-center">
             <Col md={10}>
               <Card className="showcase-card-dark border-0 p-4 text-start">
                  <span className="badge bg-secondary w-25 mb-3">Input: "SEO Tools"</span>
                  <h5 className="text-white mb-2 pb-2 border-bottom border-secondary">Best SEO Tools Guide for Beginners in 2025</h5>
                  <p className="text-muted small fst-italic">Learn everything about SEO tools including expert tips...</p>
                  <p className="text-light fs-6">When discussing SEO tools, it is crucial to understand the foundational elements that drive results. By integrating these strategies into your daily workflow...</p>
                  <button className="btn btn-outline-info btn-sm mt-2">View Full Demo</button>
               </Card>
             </Col>
          </Row>
        </Container>
      </section>

      {/* ================= BANNER AD ================= */}
      <div className="glass-card p-2 mb-4 text-center banner-ad mt-4">
        <p className="ad-title">Advertisement</p>
        <img src={bannerImg2} alt="Ad Banner" className="img-fluid rounded" />
      </div>

      {/* FAQ SECTION */}
      <section className="faq-section">
        <Container>
          <div className="text-center mb-5">
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <p className="faq-subtitle">Everything you need to know about AI generated blogs.</p>
          </div>
          <Accordion defaultActiveKey="0" className="faq-accordion">
            <Accordion.Item eventKey="0" className="faq-item">
              <Accordion.Header>Is this content unique?</Accordion.Header>
              <Accordion.Body>Yes! The AI produces content dynamically based on your specific prompts and keyword inputs.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1" className="faq-item">
              <Accordion.Header>Can I use it for blogs?</Accordion.Header>
              <Accordion.Body>Absolutely, our content generator is designed specifically for producing blog posts and landing page drafts.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2" className="faq-item">
              <Accordion.Header>Does it improve SEO?</Accordion.Header>
              <Accordion.Body>Our model relies on known SEO structures like properly nested tags and ideal keywords distributions, giving your site an inherent advantage.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3" className="faq-item">
              <Accordion.Header>Is it free?</Accordion.Header>
              <Accordion.Body>Yes, right now this tool is 100% free to use for limitless SEO generation.</Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Container>
      </section>

      {/* ================= BANNER AD ================= */}
      <div className="glass-card p-2 mb-4 text-center banner-ad mt-4">
        <p className="ad-title">Advertisement</p>
        <img src={bannerImg3} alt="Ad Banner" className="img-fluid rounded" />
      </div>

      {/* WHY CHOOSE US */}
      <section className="why-section">
        <Container>
          <div className="text-center mb-5">
            <h2 className="why-title">Why Choose Us</h2>
            <p className="why-subtitle">Built for marketers who demand fast results.</p>
          </div>
          <Row className="g-4 justify-content-center">
            <Col md={6} lg={3}>
              <div className="why-card">
                <div className="why-icon"><FaBolt /></div>
                <h6>Instant AI generation</h6>
                <p>Never wait.</p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="why-card">
                <div className="why-icon"><FaShieldAlt /></div>
                <h6>No login required</h6>
                <p>Zero tracking.</p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="why-card">
                <div className="why-icon"><FaGlobe /></div>
                <h6>Unlimited usage</h6>
                <p>Scale forever.</p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="why-card">
                <div className="why-icon"><FaCheckCircle /></div>
                <h6>Beginner friendly</h6>
                <p>No prompt skills needed.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      <RelatedTools />
    </>
  );
}
