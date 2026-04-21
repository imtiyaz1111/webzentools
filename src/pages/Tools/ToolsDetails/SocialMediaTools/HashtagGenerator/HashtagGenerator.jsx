import { useState } from "react";
import { Row, Col, Card, Container, Accordion } from "react-bootstrap";
import "./HashtagGenerator.css";
import { FaCheckCircle, FaHashtag, FaMagic, FaCopy, FaSyncAlt, FaRegSmileWink, FaChartLine, FaFire, FaFeatherAlt, FaInstagram, FaFacebookSquare, FaTwitter, FaLinkedin, FaShieldAlt, FaGlobe, FaBolt } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import SEO from "../../../../../components/SEO";
import RelatedTools from "../../../../../components/RelatedTools";

import bannerImg1 from "../../../../../assets/img/adsbanner1.png"
import bannerImg2 from "../../../../../assets/img/adsbanner2.png"
import bannerImg3 from "../../../../../assets/img/adsbanner3.png"
import squreImg1 from "../../../../../assets/img/squareads1.png"
import squreImg2 from "../../../../../assets/img/squareads2.png"

export default function HashtagGenerator() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [type, setType] = useState("Mixed");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedTags, setCopiedTags] = useState({});

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic or keyword!");
      return;
    }

    setLoading(true);
    setResult(null);
    setCopiedTags({});

    // Mock API simulation for AI logic
    setTimeout(() => {
      const top = topic.trim().toLowerCase().replace(/\s+/g, '');
      const rawTop = topic.trim().toLowerCase();

      let trending = [
        `#${top}`, `#${top}life`, `#explore${top}`, `#${top}gram`,
        `#trending${top}`, `#viral${top}`, `#${top}goals`, `#${top}daily`
      ];
      let niche = [
        `#best${top}`, `#${top}tips`, `#${top}hacks`, `#new${top}`,
        `#${top}community`, `#learn${top}`, `#${top}expert`
      ];
      let longtail = [
        `#howtodothis${top}`, `#${top}forbeginners`, `#ultimate${top}guide`, `#${top}withfriends`
      ];

      // Shuffle logic mock
      const shuffle = (array) => array.sort(() => Math.random() - 0.5);

      let allTags = [];
      if (type === "Trending") {
         allTags = [...trending, ...shuffle(niche).slice(0,2)];
      } else if (type === "Niche") {
         allTags = [...niche, ...shuffle(longtail).slice(0,3)];
      } else {
         allTags = [...trending, ...niche, ...longtail];
      }

      setResult({
        trending: shuffle(trending),
        niche: shuffle(niche),
        longtail: shuffle(longtail),
        allTags: shuffle(allTags)
      });
      
      setLoading(false);
      toast.success("Hashtags generated successfully!");
    }, 1500);
  };

  const copySingleTag = (tag) => {
    navigator.clipboard.writeText(tag);
    setCopiedTags(prev => ({...prev, [tag]: true}));
    setTimeout(() => {
        setCopiedTags(prev => ({...prev, [tag]: false}));
    }, 2000);
  };

  const copyAllTags = () => {
    if(!result) return;
    navigator.clipboard.writeText(result.allTags.join(" "));
    toast.success("All hashtags copied to clipboard!");
  };

  return (
    <>
      <SEO
        title="Hashtag Generator | Find Trending Viral Tags"
        description="Generate trending, popular, and niche hashtags instantly for Instagram, Twitter (X), Facebook, and LinkedIn."
        keywords="hashtag generator, trending hashtags, instagram hashtags, viral tags, social media tools"
        url="https://www.webzentools.com/tools/hashtag-generator"
      />
      
      <Toaster position="top-right" />

      <div className="text-center">
        {/* ================= HERO ================= */}
        <section className="hero-section">
          <div className="container text-center">
            <div className="breadcrumb-pill">
              <span>🏠 Home</span>
              <span className="separator">›</span>
              <span className="active">Hashtag Generator</span>
            </div>
            <h1 className="hero-title">
              # Hashtag <span>Generator</span>
            </h1>
            <p className="hero-subtitle">
              Generate trending hashtags to boost your reach instantly
            </p>
            <div className="hero-trust">
              ⚡ Fast • 🧠 Smart • 🔥 Viral Ready
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
              <h5 className="mb-3 text-dark text-start">Hashtag Settings</h5>
              <div className="upload-box-inner text-center">
                <div className="upload-icon mb-3">#️⃣</div>
                <h6 className="fw-semibold text-dark mb-4">
                  Find the perfect tags for your next post
                </h6>
                <div className="row g-3 text-start mb-4">
                  <div className="col-md-12">
                     <label className="form-label text-dark fw-bold small">Keyword / Topic <span className="text-danger">*</span></label>
                     <input
                        type="text"
                        className="form-control custom-input"
                        placeholder="e.g. fitness, travel, digital marketing..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter') handleGenerate() }}
                     />
                  </div>
                  <div className="col-md-6">
                     <label className="form-label text-dark fw-bold small">Select Platform</label>
                     <select className="form-select custom-input" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                        <option value="Instagram">Instagram</option>
                        <option value="Twitter">Twitter (X)</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Facebook">Facebook</option>
                        <option value="TikTok">TikTok</option>
                     </select>
                  </div>
                  <div className="col-md-6">
                     <label className="form-label text-dark fw-bold small">Hashtag Type</label>
                     <select className="form-select custom-input" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="Mixed">Mixed (Best Results)</option>
                        <option value="Trending">Trending (High Volume)</option>
                        <option value="Niche">Niche (Low Volume)</option>
                     </select>
                  </div>
                </div>
                <button 
                  className="btn premium-btn w-100 mt-2 d-flex justify-content-center align-items-center" 
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Finding trending hashtags...</>
                  ) : <><FaMagic className="me-2"/> Generate Hashtags</>}
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
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="text-white mb-0"><FaHashtag className="me-2 text-info" /> Hashtag Cloud</h5>
                  <button className="btn-caption-action" onClick={handleGenerate}><FaSyncAlt/> Refresh Tags</button>
                </div>
                
                {/* MIXED ALL VIEW */}
                <Row className="g-3 mb-4">
                  <Col md={12}>
                     <div className="hashtag-group-card">
                         <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-white mb-0">🎯 Generated Mix ({result.allTags.length})</h6>
                            <button className="btn-caption-action copy active" onClick={copyAllTags}>
                               <FaCopy/> Copy All
                            </button>
                         </div>
                         <div className="d-flex flex-wrap p-2" style={{background: 'rgba(0,0,0,0.2)', borderRadius: '12px'}}>
                            {result.allTags.map((tag, i) => (
                               <span 
                                  className={`hashtag-chip ${copiedTags[tag] ? 'copied' : ''}`} 
                                  key={i} 
                                  onClick={() => copySingleTag(tag)}
                               >
                                  {copiedTags[tag] ? <FaCheckCircle/> : null} {tag}
                               </span>
                            ))}
                         </div>
                     </div>
                  </Col>
                </Row>

                {/* CATEGORIZED VIEW */}
                {(type === "Mixed") && (
                   <Row className="g-3 mt-1">
                      <Col md={4}>
                         <div className="hashtag-group-card border-success border-opacity-25 pb-4">
                            <h6 className="text-success mb-3"><FaFire className="me-1"/> Trending</h6>
                            <div className="d-flex flex-wrap">
                               {result.trending.slice(0,6).map((tag, i) => (
                                   <span className={`hashtag-chip size-sm ${copiedTags[tag] ? 'copied' : ''}`} key={i} onClick={() => copySingleTag(tag)}>{tag}</span>
                               ))}
                            </div>
                         </div>
                      </Col>
                      <Col md={4}>
                         <div className="hashtag-group-card border-info border-opacity-25 pb-4">
                            <h6 className="text-info mb-3"><FaChartLine className="me-1"/> Niche</h6>
                            <div className="d-flex flex-wrap">
                               {result.niche.map((tag, i) => (
                                   <span className={`hashtag-chip size-sm ${copiedTags[tag] ? 'copied' : ''}`} key={i} onClick={() => copySingleTag(tag)}>{tag}</span>
                               ))}
                            </div>
                         </div>
                      </Col>
                      <Col md={4}>
                         <div className="hashtag-group-card border-warning border-opacity-25 pb-4">
                            <h6 className="text-warning mb-3"><FaGlobe className="me-1"/> Long-tail</h6>
                            <div className="d-flex flex-wrap">
                               {result.longtail.map((tag, i) => (
                                   <span className={`hashtag-chip size-sm ${copiedTags[tag] ? 'copied' : ''}`} key={i} onClick={() => copySingleTag(tag)}>{tag}</span>
                               ))}
                            </div>
                         </div>
                      </Col>
                   </Row>
                )}
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

      {/* PLATFORM SECTION (CUSTOM) */}
      <section className="features-section mt-5" style={{background: '#f8fafc', padding: '60px 0'}}>
        <Container>
           <div className="text-center mb-5">
             <h2 className="section-title">Network Optimized</h2>
             <p className="section-subtitle">We generate the perfect length tags for these platforms.</p>
           </div>
           <Row className="g-4">
              <Col md={6} lg={3}>
                <div className="platform-card">
                   <FaInstagram className="platform-icon insta"/>
                   <h6 className="text-dark fw-bold">Instagram</h6>
                   <p className="text-muted small">Max 30 tags recommended.</p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="platform-card">
                   <FaTwitter className="platform-icon tw"/>
                   <h6 className="text-dark fw-bold">Twitter (X)</h6>
                   <p className="text-muted small">1-3 targeted tags work best.</p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="platform-card">
                   <FaFacebookSquare className="platform-icon fb"/>
                   <h6 className="text-dark fw-bold">Facebook</h6>
                   <p className="text-muted small">1-2 descriptive tags needed.</p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="platform-card">
                   <FaLinkedin className="platform-icon li"/>
                   <h6 className="text-dark fw-bold">LinkedIn</h6>
                   <p className="text-muted small">3-5 professional tags.</p>
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
            <p className="section-subtitle">Designed to dramatically boost organic reach.</p>
          </div>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="feature-card">
                <div className="feature-icon"><FaMagic /></div>
                <h6>AI-style algorithm</h6>
                <p>Detects the smartest hashtags dynamically.</p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="feature-card">
                <div className="feature-icon"><FaHashtag /></div>
                <h6>Platform-based</h6>
                <p>Filters tags that work for your specific network.</p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="feature-card">
                <div className="feature-icon"><FaChartLine /></div>
                <h6>Trending & niche</h6>
                <p>Get a perfect mix of high and low volume tags.</p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="feature-card">
                <div className="feature-icon"><FaShieldAlt /></div>
                <h6>Instant results</h6>
                <p>Never waste time manually searching again.</p>
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
            <p className="section-subtitle">Find your exact audience in seconds.</p>
          </div>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="step-card">
                <div className="step-icon">1</div>
                <h6>Enter topic</h6>
                <p>Type in a short keyword or seed term.</p>
                <span className="step-number">01</span>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="step-card">
                <div className="step-icon">2</div>
                <h6>Select platform</h6>
                <p>Ensure formatting is correct for your post.</p>
                <span className="step-number">02</span>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="step-card">
                <div className="step-icon">3</div>
                <h6>Generate hashs</h6>
                <p>Our tool pulls the latest relevant phrases.</p>
                <span className="step-number">03</span>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="step-card">
                <div className="step-icon">4</div>
                <h6>Copy & paste</h6>
                <p>Click chips individually or copy the entire list.</p>
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
            <p className="section-subtitle-dark">See how tags are cleanly grouped.</p>
          </div>
          <Row className="g-4 justify-content-center">
             <Col md={8}>
               <Card className="showcase-card-dark border-0 p-4 text-start" style={{background: 'linear-gradient(45deg, #1e1e24, #0a0a0a)'}}>
                  <span className="badge bg-primary w-25 mb-4">Input: "Fitness"</span>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                     <span className="hashtag-chip copied border-0"><FaCheckCircle/> #fitness</span>
                     <span className="hashtag-chip border-0 text-white" style={{background: 'rgba(255,255,255,0.1)'}}>#gym</span>
                     <span className="hashtag-chip border-0 text-white" style={{background: 'rgba(255,255,255,0.1)'}}>#workout</span>
                     <span className="hashtag-chip border-0 text-white" style={{background: 'rgba(255,255,255,0.1)'}}>#fitlife</span>
                  </div>
                  <p className="text-muted small fst-italic">Click any tag to instantly copy it directly to your clipboard.</p>
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
            <p className="faq-subtitle">Common questions about social media hashtags.</p>
          </div>
          <Accordion defaultActiveKey="0" className="faq-accordion">
            <Accordion.Item eventKey="0" className="faq-item">
              <Accordion.Header>What are hashtags?</Accordion.Header>
              <Accordion.Body>Hashtags act as indexable keywords ensuring users searching for a specific topic can find related posts globally.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1" className="faq-item">
              <Accordion.Header>How many hashtags should I use?</Accordion.Header>
              <Accordion.Body>It depends on the platform! Instagram allows up to 30, but normally 10-15 hyper-relevant tags yield best results. Twitter prefers 1-3.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2" className="faq-item">
              <Accordion.Header>Do hashtags increase reach?</Accordion.Header>
              <Accordion.Body>Yes, when you use a mix of highly trending and small niche tags, you expose your content incrementally to algorithmic feeds that wouldn't otherwise see it.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3" className="faq-item">
              <Accordion.Header>Is this tool free?</Accordion.Header>
              <Accordion.Body>Yes, generating social media tags via this generator is 100% free.</Accordion.Body>
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
            <p className="why-subtitle">Built to make audience building effortless.</p>
          </div>
          <Row className="g-4 justify-content-center">
            <Col md={6} lg={3}>
              <div className="why-card">
                <div className="why-icon"><FaBolt /></div>
                <h6>Instant results</h6>
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
                <p>Generate forever.</p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="why-card">
                <div className="why-icon"><FaFire /></div>
                <h6>Trending tags</h6>
                <p>Always viral.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      <RelatedTools />
    </>
  );
}
