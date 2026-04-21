import { useState } from "react";
import { Row, Col, Card, Container, Accordion } from "react-bootstrap";
import "./CaptionGenerator.css";
import { FaCheckCircle, FaHashtag, FaMagic, FaCopy, FaSyncAlt, FaRegSmileWink, FaRegBuilding, FaFire, FaFeatherAlt, FaInstagram, FaFacebookSquare, FaTwitter, FaLinkedin, FaShieldAlt, FaGlobe } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import SEO from "../../../../../components/SEO";
import RelatedTools from "../../../../../components/RelatedTools";

import bannerImg1 from "../../../../../assets/img/adsbanner1.png"
import bannerImg2 from "../../../../../assets/img/adsbanner2.png"
import bannerImg3 from "../../../../../assets/img/adsbanner3.png"
import squreImg1 from "../../../../../assets/img/squareads1.png"
import squreImg2 from "../../../../../assets/img/squareads2.png"

export default function CaptionGenerator() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [tone, setTone] = useState("Casual");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic for your caption!");
      return;
    }

    setLoading(true);
    setResult(null);

    // Mock API simulation for AI logic
    setTimeout(() => {
      const top = topic.trim();
      let captions = [];
      let hashtags = [`#${top.replace(/\s+/g,'')}`, "#trending", "#viral", "#foryou"];

      if (tone === "Funny") {
        captions = [
          `Life is better with ${top} 😂🔥 Who agrees?`,
          `Me trying to explain my obsession with ${top} 🤦‍♂️💀`,
          `They said I couldn't do it... so I bought more ${top} 🤷‍♂️💸`
        ];
        hashtags.push("#funny", "#humor", "#relatable");
      } else if (tone === "Inspirational") {
        captions = [
          `Dream big. Start with ${top} 💫 never give up on your journey.`,
          `Every master was once a beginner. Keep focused on ${top} ✨`,
          `Embrace the chaos of ${top} and let it shape your future 🌟`
        ];
        hashtags.push("#inspiration", "#mindset", "#growth");
      } else if (tone === "Professional") {
        captions = [
          `Exploring the power of ${top} in modern business landscapes. 📈`,
          `Strategic insights into ${top} can elevate your brand equity. Let's connect! 🤝`,
          `Reflecting on recent developments in ${top}. What are your thoughts? 👇`
        ];
        hashtags.push("#business", "#networking", "#leadership");
      } else if (tone === "Attitude") {
        captions = [
          `I don't follow trends, I set them with ${top} 💅🔥`,
          `Too busy focusing on ${top} to care about your opinions 💁‍♀️✨`,
          `Built different. Powered by ${top} 🔥👑`
        ];
        hashtags.push("#attitude", "#boss", "#unbothered");
      } else {
        // Casual / Default
        captions = [
          `Enjoying the vibes of ${top} ✌️🌍`,
          `Just another day loving ${top} 🌴✨`,
          `Casual reminder that ${top} makes everything better 🌻💖`
        ];
        hashtags.push("#lifestyle", "#goodvibes", "#daily");
      }

      // Add platform specific twists
      if (platform === "Twitter") {
         captions = captions.map(c => c + " " + hashtags.slice(0,3).join(" "));
      }

      setResult({
        captions,
        hashtags
      });
      
      setLoading(false);
      toast.success("Viral captions generated!");
    }, 1800);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Caption copied! Ready to post.");
  };

  return (
    <>
      <SEO
        title="Social Media Caption Generator | Free AI Tool"
        description="Create viral, engaging captions for Instagram, Facebook, Twitter, and LinkedIn instantly using our AI-style generator tool."
        keywords="caption generator, instagram captions, social media captions, hashtag generator, viral captions"
        url="https://www.webzentools.com/tools/caption-generator"
      />
      
      <Toaster position="top-right" />

      <div className="text-center">
        {/* ================= HERO ================= */}
        <section className="hero-section">
          <div className="container text-center">
            <div className="breadcrumb-pill">
              <span>🏠 Home</span>
              <span className="separator">›</span>
              <span className="active">Caption Generator</span>
            </div>
            <h1 className="hero-title">
              🔥 Caption <span>Generator</span>
            </h1>
            <p className="hero-subtitle">
              Create viral captions for your social media posts instantly
            </p>
            <div className="hero-trust">
              ⚡ Fast • 🎨 Creative • 🤖 AI Style
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
              <h5 className="mb-3 text-dark text-start">Caption Preferences</h5>
              <div className="upload-box-inner text-center">
                <div className="upload-icon mb-3">✨</div>
                <h6 className="fw-semibold text-dark mb-4">
                  Tell us what your post is about
                </h6>
                <div className="row g-3 text-start mb-4">
                  <div className="col-md-12">
                     <label className="form-label text-dark fw-bold small">What is the topic? <span className="text-danger">*</span></label>
                     <input
                        type="text"
                        className="form-control custom-input"
                        placeholder="e.g. A sunny day at the beach, My new startup..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                     />
                  </div>
                  <div className="col-md-6">
                     <label className="form-label text-dark fw-bold small">Select Platform</label>
                     <select className="form-select custom-input" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                        <option value="Instagram">Instagram</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Twitter">Twitter (X)</option>
                        <option value="LinkedIn">LinkedIn</option>
                     </select>
                  </div>
                  <div className="col-md-6">
                     <label className="form-label text-dark fw-bold small">Select Tone</label>
                     <select className="form-select custom-input" value={tone} onChange={(e) => setTone(e.target.value)}>
                        <option value="Casual">Casual & Chill</option>
                        <option value="Funny">Funny & Witty</option>
                        <option value="Inspirational">Inspirational</option>
                        <option value="Professional">Professional</option>
                        <option value="Attitude">Attitude & Sassy</option>
                     </select>
                  </div>
                </div>
                <button 
                  className="btn premium-btn w-100 mt-2 d-flex justify-content-center align-items-center" 
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Creating captions...</>
                  ) : <><FaMagic className="me-2"/> Generate Captions</>}
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
                  <h5 className="text-white mb-0"><FaFire className="me-2 text-danger" /> Viral Captions for {platform}</h5>
                  <button className="btn-caption-action" onClick={handleGenerate}><FaSyncAlt/> Regenerate</button>
                </div>
                
                <Row className="g-3 mb-4">
                  {result.captions.map((cap, i) => (
                    <Col md={12} key={i}>
                       <div className="caption-card">
                          <p className="caption-text mb-3">{cap}</p>
                          <div className="d-flex justify-content-end">
                             <button className="btn-caption-action copy" onClick={() => copyToClipboard(cap)}>
                               <FaCopy/> Copy Text
                             </button>
                          </div>
                       </div>
                    </Col>
                  ))}
                </Row>

                {/* HASHTAGS */}
                <Row className="g-4 mt-1">
                   <Col md={12}>
                     <h6 className="text-white mb-3"><FaHashtag className="me-2 text-info"/> Recommended Hashtags</h6>
                     <div className="d-flex flex-wrap">
                        {result.hashtags.map((tag, i) => (
                           <span className="hashtag-bubble" key={i}>{tag}</span>
                        ))}
                     </div>
                     <div className="mt-3">
                         <button className="btn-caption-action copy" onClick={() => copyToClipboard(result.hashtags.join(" "))}>
                            <FaCopy/> Copy All Hashtags
                         </button>
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

      {/* PLATFORM SECTION (CUSTOM) */}
      <section className="features-section mt-5" style={{background: '#f8fafc', padding: '60px 0'}}>
        <Container>
           <div className="text-center mb-5">
             <h2 className="section-title">Supported Platforms</h2>
             <p className="section-subtitle">Optimized lengths and styles for every major network.</p>
           </div>
           <Row className="g-4">
              <Col md={6} lg={3}>
                <div className="platform-card">
                   <FaInstagram className="platform-icon insta"/>
                   <h6 className="text-dark fw-bold">Instagram</h6>
                   <p className="text-muted small">Emoji-heavy & engaging.</p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="platform-card">
                   <FaFacebookSquare className="platform-icon fb"/>
                   <h6 className="text-dark fw-bold">Facebook</h6>
                   <p className="text-muted small">Conversational & friendly.</p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="platform-card">
                   <FaTwitter className="platform-icon tw"/>
                   <h6 className="text-dark fw-bold">Twitter (X)</h6>
                   <p className="text-muted small">Short, punchy & direct.</p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="platform-card">
                   <FaLinkedin className="platform-icon li"/>
                   <h6 className="text-dark fw-bold">LinkedIn</h6>
                   <p className="text-muted small">Professional & insightful.</p>
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
            <p className="section-subtitle">Everything you need to write the perfect post.</p>
          </div>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="feature-card">
                <div className="feature-icon"><FaMagic /></div>
                <h6>AI-style generation</h6>
                <p>Output creative captions in just a few clicks.</p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="feature-card">
                <div className="feature-icon"><FaHashtag /></div>
                <h6>Hashtags included</h6>
                <p>Automatically pairs relevant hashtags for maximum reach.</p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="feature-card">
                <div className="feature-icon"><FaRegSmileWink /></div>
                <h6>Multiple tone options</h6>
                <p>From strictly professional to hilariously funny.</p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="feature-card">
                <div className="feature-icon"><FaFeatherAlt /></div>
                <h6>Platform specific</h6>
                <p>Tailored formatting for whichever platform you select.</p>
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
            <p className="section-subtitle">Four steps to a viral social media post.</p>
          </div>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="step-card">
                <div className="step-icon">1</div>
                <h6>Enter topic</h6>
                <p>Provide a word or phrase.</p>
                <span className="step-number">01</span>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="step-card">
                <div className="step-icon">2</div>
                <h6>Select platform</h6>
                <p>Choose where you are posting.</p>
                <span className="step-number">02</span>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="step-card">
                <div className="step-icon">3</div>
                <h6>Generate captions</h6>
                <p>Pick your tone and let us write.</p>
                <span className="step-number">03</span>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="step-card">
                <div className="step-icon">4</div>
                <h6>Copy & post</h6>
                <p>Hit copy and publish your post.</p>
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
            <p className="section-subtitle-dark">See how fun our captions can be.</p>
          </div>
          <Row className="g-4 justify-content-center">
             <Col md={8}>
               <Card className="showcase-card-dark border-0 p-4 text-start" style={{background: 'linear-gradient(45deg, #1e1e24, #0a0a0a)'}}>
                  <span className="badge bg-danger w-25 mb-4">Input: "Travel"</span>
                  <div className="d-flex gap-3 align-items-center mb-3">
                     <FaInstagram className="text-white fs-3"/>
                     <p className="text-white mb-0 fw-bold">Instagram | Casual Tone</p>
                  </div>
                  <div className="caption-card m-0 border-0" style={{background: 'rgba(255,255,255,0.05)'}}>
                      <p className="text-light fs-5 mb-2 fst-italic">Enjoying the vibe of travel ✈️🌍</p>
                      <p className="text-info small mb-0">#travel #wanderlust #explore</p>
                  </div>
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
            <p className="faq-subtitle">Common questions about generating captions.</p>
          </div>
          <Accordion defaultActiveKey="0" className="faq-accordion">
            <Accordion.Item eventKey="0" className="faq-item">
              <Accordion.Header>Are captions unique?</Accordion.Header>
              <Accordion.Body>Yes, the tool merges your specific topic inputs with various structural templates to ensure unique output.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1" className="faq-item">
              <Accordion.Header>Can I use them commercially?</Accordion.Header>
              <Accordion.Body>Absolutely! You are free to use these captions for both personal and brand/business accounts.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2" className="faq-item">
              <Accordion.Header>Do hashtags help reach?</Accordion.Header>
              <Accordion.Body>Yes, using the right mix of hashtags (which we provide automatically) helps platforms categorize and distribute your posts to wider audiences.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3" className="faq-item">
              <Accordion.Header>Is this tool free?</Accordion.Header>
              <Accordion.Body>Yes, our caption generator is 100% free with unlimited usages.</Accordion.Body>
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
            <p className="why-subtitle">Built for creators who want fast growth.</p>
          </div>
          <Row className="g-4 justify-content-center">
            <Col md={6} lg={3}>
              <div className="why-card">
                <div className="why-icon"><FaMagic /></div>
                <h6>Instant caption ideas</h6>
                <p>Never get stuck.</p>
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
                <h6>Trend-based</h6>
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
