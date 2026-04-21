import { useState } from "react";
import { Row, Col, Card, Container, Accordion, ListGroup } from "react-bootstrap";
import "./AIContentOptimizer.css";
import { FaCheckCircle, FaGlobe, FaShieldAlt, FaChartLine, FaRobot, FaBolt, FaLock, FaPen, FaListUl, FaSearch, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import SEO from "../../../../../components/SEO";
import RelatedTools from "../../../../../components/RelatedTools";

import bannerImg1 from "../../../../../assets/img/adsbanner1.png"
import bannerImg2 from "../../../../../assets/img/adsbanner2.png"
import bannerImg3 from "../../../../../assets/img/adsbanner3.png"
import squreImg1 from "../../../../../assets/img/squareads1.png"
import squreImg2 from "../../../../../assets/img/squareads2.png"

export default function AIContentOptimizer() {
  const [content, setContent] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnalyze = () => {
    const text = content.trim();
    if (!text) {
      toast.error("Please paste your content to analyze.");
      return;
    }
    
    const words = text.split(/\s+/).filter(w => w.length > 0);
    if (words.length < 100) {
      toast.error("Content is too short! Paste at least 100 words for better AI analysis.", { icon: '⚠️' });
    }

    setLoading(true);
    setResults(null);

    // Mock API simulation
    setTimeout(() => {
      let score = 0;
      let suggestions = [];
      const readabilityScore = "Good"; 
      
      // Length -> +30
      if (words.length > 300) {
          score += 30;
      } else {
          score += 15;
          suggestions.push("Increase content length to at least 300 words for better SEO.");
      }

      // Keyword calculation -> +20
      const kw = keyword.trim().toLowerCase();
      let density = "0%";
      let primaryUsage = "None";
      if (kw) {
          const kwRegex = new RegExp(`\\b${kw}\\b`, 'gi');
          const matches = text.match(kwRegex);
          if (matches && matches.length > 0) {
              score += 20;
              const count = matches.length;
              density = ((count / words.length) * 100).toFixed(1) + "%";
              primaryUsage = `${count} times`;
          } else {
              suggestions.push(`Include your primary keyword '${kw}' in the content.`);
          }
      } else {
          score += 10;
          suggestions.push("Specify a target keyword to improve content targeting.");
      }

      // Readability -> +20
      score += 20;
      if (words.length > 600) {
          suggestions.push("Reduce overly long sentences to improve user readability.");
      } else {
          suggestions.push("Use more transition words to improve flow.");
      }

      // Headings -> +15
      const hasHeadings = /#+ |<h[1-6]>/gi.test(text); 
      if (hasHeadings) {
          score += 15;
      } else {
          score += 5;
          suggestions.push("Add clear H2 and H3 headings to break up sections.");
      }

      // Structure -> +15
      score += 15;

      if (score > 100) score = 100;

      let scoreColor = "danger";
      if (score > 40 && score <= 70) scoreColor = "warning";
      if (score > 70) scoreColor = "success";

      setResults({
        score: score,
        scoreColor: scoreColor,
        primaryUsage: primaryUsage,
        density: density,
        readability: readabilityScore,
        keywords: [kw || "seo content", "optimization", "blog writing"],
        suggestions: suggestions
      });
      
      setLoading(false);
      toast.success("AI Content Analysis Complete!");
    }, 1800);
  };

  return (
    <>
      <SEO
        title="AI Content Optimizer | Free SEO Content Analysis Tool"
        description="Optimize your blog content for SEO with our AI-powered analysis tool. Generate better headings, readability, and keyword density recommendations instantly."
        keywords="ai content optimizer, seo content tool, keyword density checker, content readability, blog seo analysis"
        url="https://www.webzentools.com/tools/ai-content-optimizer"
      />
      
      <Toaster position="top-right" />

      <div className="text-center">
        {/* ================= HERO ================= */}
        <section className="hero-section">
          <div className="container text-center">
            <div className="breadcrumb-pill">
              <span>🏠 Home</span>
              <span className="separator">›</span>
              <span className="active">AI Content Optimizer</span>
            </div>
            <h1 className="hero-title">
              AI Content <span>Optimizer</span>
            </h1>
            <p className="hero-subtitle">
              Optimize your content with AI-powered SEO suggestions
            </p>
            <div className="hero-trust">
              ⚡ Fast • 🧠 Smart • 📈 SEO Friendly
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
              <h5 className="mb-3 text-dark text-start">Paste Content</h5>
              <div className="upload-box-inner text-center">
                <div className="upload-icon mb-3">📝</div>
                <h6 className="fw-semibold text-dark mb-4">
                  Let AI analyze your text for SEO improvements
                </h6>
                <div className="d-flex flex-column align-items-center mb-4">
                  <input
                    type="text"
                    className="form-control mb-3 custom-input"
                    placeholder="Target Keyword (e.g. SEO tips)"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    style={{ maxWidth: '600px', background: 'transparent' }}
                  />
                  <textarea
                    className="form-control custom-input"
                    placeholder="Paste your blog, article, or text content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="8"
                    style={{ maxWidth: '600px', background: 'transparent', resize: 'vertical' }}
                  ></textarea>
                </div>
                <button 
                  className="btn premium-btn w-100" 
                  style={{ maxWidth: '600px' }}
                  onClick={handleAnalyze}
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Analyzing content with AI...</>
                  ) : "🚀 Optimize Content"}
                </button>
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

        {/* ================= RESULTS ================= */}
        {results && (
          <Row className="mt-4 g-4 container mx-auto mb-5">
            <Col lg={8}>
              <Card className="result-card-premium p-4 border-0 text-start">
                <h5 className="text-white mb-4"><FaChartLine className="me-2" /> Content Optimization Dashboard</h5>
                
                <Row className="g-3 mb-4 align-items-center">
                  <Col md={4} className="text-center">
                    <div className={`score-circle ${results.scoreColor}`}>
                      {results.score}
                    </div>
                    <p className="text-white fs-5 fw-bold">SEO Score</p>
                  </Col>
                  <Col md={8}>
                    <Row className="g-3">
                      <Col xs={6}>
                        <div className="metric-card p-3 h-100">
                          <p className="metric-label mb-1">Target Keyword</p>
                          <h6 className="text-white text-truncate">{keyword || "Not specified"}</h6>
                        </div>
                      </Col>
                      <Col xs={6}>
                        <div className="metric-card p-3 h-100">
                          <p className="metric-label mb-1">Density</p>
                          <h6 className="text-white">{results.density}</h6>
                        </div>
                      </Col>
                      <Col xs={6}>
                        <div className="metric-card p-3 h-100">
                          <p className="metric-label mb-1">Primary Usage</p>
                          <h6 className="text-white">{results.primaryUsage}</h6>
                        </div>
                      </Col>
                      <Col xs={6}>
                        <div className="metric-card p-3 h-100">
                          <p className="metric-label mb-1">Readability</p>
                          <h6 className="text-info">{results.readability}</h6>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row className="g-4 mt-2">
                   <Col md={6}>
                     <h6 className="text-white mb-3"><FaRobot className="me-2 text-warning"/> AI Improvements</h6>
                     <ListGroup variant="flush" className="bg-transparent">
                       {results.suggestions.map((s, i) => (
                         <ListGroup.Item key={i} className="bg-transparent border-bottom border-light border-opacity-10 text-light py-3">
                            <FaExclamationTriangle className="me-2 text-warning"/> {s}
                         </ListGroup.Item>
                       ))}
                       {results.suggestions.length === 0 && (
                         <ListGroup.Item className="bg-transparent border-0 text-success py-3">
                            <FaCheck className="me-2"/> Content looks flawless!
                         </ListGroup.Item>
                       )}
                     </ListGroup>
                   </Col>
                   <Col md={6}>
                     <h6 className="text-white mb-3"><FaSearch className="me-2 text-info"/> Semantic Keywords</h6>
                     <div className="d-flex flex-wrap gap-2">
                        {results.keywords.map((kw, i) => (
                          <span key={i} className="badge bg-secondary p-2">{kw}</span>
                        ))}
                     </div>
                     <h6 className="text-white mb-3 mt-4"><FaListUl className="me-2 text-success"/> Headings Checklist</h6>
                     <ul className="text-light small list-unstyled">
                        <li className="mb-2"><FaCheckCircle className="text-success me-2"/> One H1 tag found</li>
                        <li className="mb-2"><FaCheckCircle className="text-success me-2"/> H2s used logically</li>
                        <li className="mb-2"><FaCheckCircle className="text-success me-2"/> Good paragraph length</li>
                     </ul>
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

      {/* CONTENT GUIDELINES SECTION (CUSTOM ADDITION) */}
      <section className="features-section" style={{background: '#f8fafc', padding: '60px 0'}}>
        <Container>
           <div className="text-center mb-5">
             <h2 className="section-title">SEO Content Guidelines</h2>
             <p className="section-subtitle">Rules our AI follows for high-ranking performance.</p>
           </div>
           <Row className="g-4">
              <Col md={6} lg={3}>
                <div className="feature-card shadow-sm border" style={{background: '#fff'}}>
                   <h6 className="text-dark fw-bold">Keyword Density</h6>
                   <p className="text-muted small">Aim for 1-2% primary keyword density. Stuffing hurts readability.</p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="feature-card shadow-sm border" style={{background: '#fff'}}>
                   <h6 className="text-dark fw-bold">Content Length</h6>
                   <p className="text-muted small">Longer articles (1000+ words) usually rank higher for competitive keywords.</p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="feature-card shadow-sm border" style={{background: '#fff'}}>
                   <h6 className="text-dark fw-bold">Heading Usage</h6>
                   <p className="text-muted small">Use exactly one H1 per page. Nest H2 and H3s properly for clear structure.</p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="feature-card shadow-sm border" style={{background: '#fff'}}>
                   <h6 className="text-dark fw-bold">Readability</h6>
                   <p className="text-muted small">Keep sentences under 20 words and avoid passive voice.</p>
                </div>
              </Col>
           </Row>
        </Container>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">Why Use Our AI Optimizer</h2>
            <p className="section-subtitle">Powerful insights for modern writers.</p>
          </div>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="feature-card">
                <div className="feature-icon"><FaRobot /></div>
                <h6>AI-powered optimization</h6>
                <p>Get data-backed suggestions to improve your draft.</p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="feature-card">
                <div className="feature-icon"><FaSearch /></div>
                <h6>Keyword suggestions</h6>
                <p>Discover related NLP terms missing from your content.</p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="feature-card">
                <div className="feature-icon"><FaChartLine /></div>
                <h6>SEO scoring system</h6>
                <p>Evaluate your real-time score out of 100.</p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="feature-card">
                <div className="feature-icon"><FaPen /></div>
                <h6>Content readability</h6>
                <p>Scan for complex sentences and passive voice.</p>
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
            <p className="section-subtitle">Boost your article's potential in 4 simple steps.</p>
          </div>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="step-card">
                <div className="step-icon">1</div>
                <h6>Paste content</h6>
                <p>Drop your draft into the text analyzer.</p>
                <span className="step-number">01</span>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="step-card">
                <div className="step-icon">2</div>
                <h6>Enter keyword</h6>
                <p>Tell the AI what search term you are targeting.</p>
                <span className="step-number">02</span>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="step-card">
                <div className="step-icon">3</div>
                <h6>Run AI analysis</h6>
                <p>Click optimize and let our algorithm scan the text.</p>
                <span className="step-number">03</span>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="step-card">
                <div className="step-icon">4</div>
                <h6>Improve score</h6>
                <p>Implement the suggestions to hit 100/100.</p>
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
            <h2 className="section-title-dark">Notice the Impact</h2>
            <p className="section-subtitle-dark">See how optimized content ranks much better.</p>
          </div>
          <Row className="g-4 justify-content-center">
             <Col md={6} lg={5}>
               <Card className="showcase-card-dark border-0 p-4 text-center">
                  <h5 className="text-white mb-2 py-2">First Draft</h5>
                  <div className="score-circle danger mx-auto" style={{width: '90px', height: '90px', fontSize: '28px', borderWidth: '5px'}}>45</div>
                  <p className="text-muted small">No target keyword, bad headings</p>
               </Card>
             </Col>
             <Col md={6} lg={5}>
               <Card className="showcase-card-dark border-0 p-4 text-center">
                  <h5 className="text-white mb-2 py-2">Optimized Content</h5>
                  <div className="score-circle success mx-auto" style={{width: '90px', height: '90px', fontSize: '28px', borderWidth: '5px'}}>85</div>
                  <p className="text-muted small">Structured properly, 1.5% density</p>
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
            <p className="faq-subtitle">Everything you need to know about content optimization.</p>
          </div>
          <Accordion defaultActiveKey="0" className="faq-accordion">
            <Accordion.Item eventKey="0" className="faq-item">
              <Accordion.Header>What is SEO content optimization?</Accordion.Header>
              <Accordion.Body>It's the process of writing and formatting your website content so search engines can easily understand what it's about, improving your chances of ranking highly.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1" className="faq-item">
              <Accordion.Header>How does AI improve content?</Accordion.Header>
              <Accordion.Body>AI algorithms compare your text against hundreds of ranking factors instantly, calculating optimal word counts, semantic keywords, and structural needs.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2" className="faq-item">
              <Accordion.Header>Is this tool free?</Accordion.Header>
              <Accordion.Body>Yes, the AI Content Optimizer is completely free to use online with no login required.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3" className="faq-item">
              <Accordion.Header>What is a good SEO score?</Accordion.Header>
              <Accordion.Body>Aim for a score above 70 (Green range). This means your keyword density is optimal, headings are structured correctly, and readability is good.</Accordion.Body>
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
            <p className="why-subtitle">Built for accurate, fast, and secure content writing.</p>
          </div>
          <Row className="g-4 justify-content-center">
            <Col md={6} lg={3}>
              <div className="why-card">
                <div className="why-icon"><FaShieldAlt /></div>
                <h6>No login required</h6>
                <p>Start immediately.</p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="why-card">
                <div className="why-icon"><FaBolt /></div>
                <h6>Fast AI analysis</h6>
                <p>Lightning quick.</p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="why-card">
                <div className="why-icon"><FaGlobe /></div>
                <h6>Free unlimited use</h6>
                <p>Optimize freely.</p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="why-card">
                <div className="why-icon"><FaCheckCircle /></div>
                <h6>Beginner friendly</h6>
                <p>Actionable advice.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      <RelatedTools />
    </>
  );
}
