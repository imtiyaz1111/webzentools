import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Home, ChevronRight } from 'lucide-react';
import { Sparkles, CheckCircle2, ArrowRight, Shield, Zap, Activity } from 'lucide-react';
import { Rocket, Globe2, Target } from 'lucide-react';

import { ShieldCheck, Smartphone, Gift, UserX } from 'lucide-react';
import { Plug, Sliders } from 'lucide-react';
import { Mail, Send } from 'lucide-react';
import { MessageCircleQuestion, Plus } from 'lucide-react';

import "./About.css";
import SEO from '../../components/SEO';

const About = () => {

    // Hardcoded premium features
    const features = [
        { text: "AI-Powered Automation", icon: <Zap size={18} className="wt-cyan-accent" /> },
        { text: "Real-Time Data Analytics", icon: <Activity size={18} className="wt-cyan-accent" /> },
        { text: "Bank-Grade Infrastructure", icon: <Shield size={18} className="wt-cyan-accent" /> }
    ];


    // The exact concepts from your image, elevated for the premium design
    const whyChooseUs = [
        {
            title: "Lightning Fast",
            desc: "All tools process instantly in your browser with zero server delays.",
            icon: <Zap size={24} className="text-white" />
        },
        {
            title: "100% Secure",
            desc: "Your data never leaves your device. Everything runs client-side.",
            icon: <ShieldCheck size={24} className="text-white" />
        },
        {
            title: "Mobile Friendly",
            desc: "Perfectly optimized for every screen size from phones to desktops.",
            icon: <Smartphone size={24} className="text-white" />
        },
        {
            title: "Free Forever",
            desc: "No premium plans, no paywalls. Every tool is completely free.",
            icon: <Gift size={24} className="text-white" />
        },
        {
            title: "No Sign-up",
            desc: "Jump right in. No accounts, no emails, no registration needed.",
            icon: <UserX size={24} className="text-white" />
        }
    ];


    const steps = [
        {
            id: "01",
            title: "Connect Infrastructure",
            desc: "Integrate your existing repositories or databases in seconds. We automatically detect your framework and configure the optimal build settings.",
            icon: <Plug size={28} className="wt-step-icon" />,
            theme: "cyan"
        },
        {
            id: "02",
            title: "Automate & Configure",
            desc: "Set your custom rules, define your scaling parameters, and let our engine handle the heavy lifting. Zero manual server configuration required.",
            icon: <Sliders size={28} className="wt-step-icon" />,
            theme: "blue"
        },
        {
            id: "03",
            title: "Deploy & Scale",
            desc: "Push to global edge networks instantly. Monitor your performance with real-time telemetry as your application scales infinitely on demand.",
            icon: <Rocket size={28} className="wt-step-icon" />,
            theme: "purple" // Adds a nice color progression
        }
    ];


    // State to track which accordion is open (null means all closed)
    const [activeId, setActiveId] = useState(0); // Opens the first one by default

    const faqs = [
        {
            id: 0,
            question: "Do I need to install any software to use WebzenTools?",
            answer: "Not at all. Our entire ecosystem is entirely browser-based and runs securely on the client side. There are no extensions to install and no background applications draining your CPU."
        },
        {
            id: 1,
            question: "Are these tools genuinely free forever?",
            answer: "Yes. Our core suite of developer and productivity tools is 100% free with no hidden paywalls, no 'premium tiers,' and absolutely no credit card required."
        },
        {
            id: 2,
            question: "How do you ensure my data remains secure?",
            answer: "We employ a Zero-Trust architecture. Because our tools process your data locally within your browser, your files and inputs never hit our servers. What happens on your device, stays on your device."
        },
        {
            id: 3,
            question: "Can I use these tools on my mobile device?",
            answer: "Absolutely. Every tool is meticulously engineered with responsive design, ensuring you get the exact same powerful experience whether you are on a 4K desktop monitor or a smartphone."
        },
        {
            id: 4,
            question: "Do you offer API access for these tools?",
            answer: "We are currently beta testing our GraphQL API for enterprise users who want to programmatically integrate our workflows. Subscribe to our newsletter to be notified when it goes public."
        }
    ];

    const toggleFAQ = (id) => {
        setActiveId(activeId === id ? null : id);
    };

    return (
        <>

         <SEO
            title={`Our Services | `}
            description={`Explore  services by Webzenyx including modern, scalable, and high-performance solutions.`}
            keywords="web development services, mobile app development, UI UX design, ecommerce solutions"
            url={`https://www.webzenyx.com/contact`}
        />
            <section className="wt-about-hero position-relative d-flex align-items-center">

                {/* --- Premium Background Layers --- */}
                {/* 1. The Subtle Tech Grid */}
                <div className="wt-grid-overlay"></div>

                {/* 2. Floating Ambient Glows */}
                <div className="wt-glow wt-glow-left"></div>
                <div className="wt-glow wt-glow-right"></div>

                <Container className="position-relative z-3 text-center wt-content-wrapper">

                    {/* --- The Premium Cyan Breadcrumb Pill --- */}
                    <div className="wt-fade-in-1 mb-4">
                        <div className="wt-breadcrumb-pill d-inline-flex align-items-center shadow-lg">
                            <Home size={15} className="wt-cyan-accent me-2" />
                            <a href="/" className="wt-breadcrumb-link text-decoration-none fw-medium">
                                Home
                            </a>
                            <ChevronRight size={14} className="wt-breadcrumb-separator mx-2" />
                            <span className="wt-cyan-accent fw-bold d-flex align-items-center">
                                <span className="wt-active-dot me-2"></span>
                                About Us
                            </span>
                        </div>
                    </div>

                    {/* --- Main Headline --- */}
                    <h1 className="display-2 fw-bolder text-white mb-4 wt-tracking-tight wt-fade-in-2">
                        About <span className="wt-text-gradient-cyan-blue">WebzenTools</span>
                    </h1>

                    {/* --- Short Description Line --- */}
                    <p className="lead text-white mx-auto wt-fade-in-3" style={{ maxWidth: '650px', lineHeight: '1.8' }}>
                        We engineer high-performance, intuitive software infrastructure designed to automate your workflows and help your team ship products faster than ever before.
                    </p>

                </Container>
            </section>

            {/* ====================WHO ARE YOU SECTION =================== */}

            <section className="wt-about-content-section py-5 position-relative">
                <Container className="py-5 z-3 position-relative">
                    <Row className="align-items-center g-5">

                        {/* --- LEFT COLUMN: TEXT CONTENT --- */}
                        <Col lg={6}>
                            <div className="pe-lg-5">

                                {/* 1. Pre-heading Badge (Who We Are) */}
                                <div className="wt-fade-in-1 mb-4">
                                    <div className="d-inline-flex align-items-center gap-2 px-3 py-1 wt-glass-badge">
                                        <Sparkles size={14} className="wt-cyan-accent" />
                                        <span className="text-black-50 fw-semibold text-uppercase tracking-wider" style={{ fontSize: '0.75rem' }}>
                                            Who We Are
                                        </span>
                                    </div>
                                </div>

                                {/* 2. Main Heading (About WebzenTools) */}
                                <h2 className="display-4 fw-bolder text-black mb-4 wt-tracking-tight wt-fade-in-2">
                                    We build the tools <br className="d-none d-xl-block" />
                                    for <span className="wt-text-gradient-cyan-blue">tomorrow.</span>
                                </h2>

                                {/* 3. Description */}
                                <p className="lead text-muted mb-5 wt-fade-in-3" style={{ lineHeight: '1.8' }}>
                                    WebzenTools was founded on a simple principle: software should adapt to you, not the other way around. We design sophisticated, browser-based ecosystems that eliminate friction and empower developers to do their best work.
                                </p>

                                {/* 4. Features List */}
                                <div className="wt-features-list mb-5 wt-fade-in-4">
                                    {features.map((feature, index) => (
                                        <div key={index} className="d-flex align-items-center mb-3 wt-feature-item">
                                            <div className="wt-feature-icon-wrapper me-3">
                                                {feature.icon}
                                            </div>
                                            <span className="text-black fw-medium">{feature.text}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* 5. Button */}
                                <div className="wt-fade-in-5">
                                    <button className="wt-btn-premium">
                                        Explore Our Platform <ArrowRight size={18} className="ms-2 transition-transform" />
                                    </button>
                                </div>

                            </div>
                        </Col>

                        {/* --- RIGHT COLUMN: IMAGE & ILLUSTRATION --- */}
                        <Col lg={6}>
                            <div className="wt-image-showcase wt-fade-in-6 position-relative mt-5 mt-lg-0">

                                {/* Backlight Glow */}
                                <div className="wt-image-backglow"></div>

                                {/* Main Image */}
                                <img
                                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop"
                                    alt="WebzenTools Infrastructure"
                                    className="img-fluid rounded-4 wt-glass-border shadow-lg position-relative z-2 main-illustration"
                                />

                                {/* Floating Stat Card (Adds incredible depth) */}
                                <div className="wt-floating-stat-card z-3 d-none d-md-flex align-items-center gap-3 p-3">
                                    <div className="wt-stat-icon-box">
                                        <CheckCircle2 size={24} className="wt-cyan-accent" />
                                    </div>
                                    <div>
                                        <h5 className="text-white fw-bold mb-0">99.99%</h5>
                                        <small className="text-white text-uppercase tracking-wider" style={{ fontSize: '0.7rem' }}>System Uptime</small>
                                    </div>
                                </div>

                            </div>
                        </Col>

                    </Row>
                </Container>
            </section>

            {/* ====================MISSION AND VISSION SECTION ================ */}
            <section className="wt-mv-section py-5 position-relative">

                {/* --- Ambient Background Glow --- */}
                <div className="wt-mv-bg-glow"></div>

                <Container className="py-5 position-relative z-3">

                    {/* --- Section Header --- */}
                    <div className="text-center mb-5 pb-3 wt-fade-in-1">
                        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 wt-glass-badge mb-3">
                            <Target size={14} className="wt-cyan-accent" />
                            <span className="text-black-50 fw-semibold text-uppercase tracking-wider" style={{ fontSize: '0.75rem' }}>
                                Our Philosophy
                            </span>
                        </div>
                        <h2 className="display-5 fw-bolder text-white wt-tracking-tight">
                            Mission & <span className="wt-text-gradient-cyan-blue">Vision</span>
                        </h2>
                    </div>

                    {/* --- Cards Layout --- */}
                    <Row className="g-4 g-lg-5">

                        {/* 1. MISSION CARD */}
                        <Col md={6} className="wt-fade-in-2">
                            <div className="wt-mv-card h-100 p-4 p-lg-5 position-relative overflow-hidden">

                                {/* Internal Cyan Glow */}
                                <div className="wt-card-inner-glow glow-cyan"></div>

                                <div className="position-relative z-2">
                                    <div className="wt-mv-icon-box cyan-box mb-4">
                                        <Rocket size={28} className="text-cyan-accent" />
                                    </div>

                                    <h3 className="text-white fw-bold mb-3 tracking-wide">Our Mission</h3>

                                    <p className="text-white mb-0" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
                                        To engineer the most reliable, high-performance software infrastructure on the market. We strive to automate the mundane, secure the critical, and empower developers to ship their best work without friction.
                                    </p>
                                </div>

                            </div>
                        </Col>

                        {/* 2. VISION CARD */}
                        <Col md={6} className="wt-fade-in-3">
                            <div className="wt-mv-card h-100 p-4 p-lg-5 position-relative overflow-hidden">

                                {/* Internal Blue Glow */}
                                <div className="wt-card-inner-glow glow-blue"></div>

                                <div className="position-relative z-2">
                                    <div className="wt-mv-icon-box blue-box mb-4">
                                        <Globe2 size={28} className="text-blue-accent" />
                                    </div>

                                    <h3 className="text-white fw-bold mb-3 tracking-wide">Our Vision</h3>

                                    <p className="text-white mb-0" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
                                        To become the foundational operating system for the modern web. We envision a global ecosystem where complex technical scaling is invisible, leaving teams entirely free to focus on pure creative innovation.
                                    </p>
                                </div>

                            </div>
                        </Col>

                    </Row>
                </Container>
            </section>

            {/* ==================WHY CHOOSE US SECTION ================= */}

            <section className="wt-why-choose-section py-5 position-relative">
                <Container className="py-5 position-relative z-3">

                    {/* --- Section Header (From your image concept) --- */}
                    <div className="text-center mb-5 pb-3 wt-fade-in-header">
                        <h2 className="display-5 fw-bolder text-white wt-tracking-tight mb-3">
                            Why Choose <span className="wt-text-gradient-cyan-blue">Our Tools?</span>
                        </h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '650px', fontSize: '1.1rem' }}>
                            Built for speed, security, and simplicity — everything you need, nothing you don't.
                        </p>
                    </div>

                    {/* --- 5-Column Premium Grid --- */}
                    <div className="wt-5-col-grid">
                        {whyChooseUs.map((feature, index) => (
                            <div
                                className={`wt-why-card theme-hover-cyan wt-stagger-in`}
                                style={{ animationDelay: `${0.1 * index}s` }}
                                key={index}
                            >

                                {/* Premium Gradient Icon Box */}
                                <div className="wt-why-icon-wrapper mb-4 mx-auto">
                                    <div className="wt-why-icon-gradient"></div>
                                    <div className="position-relative z-2">
                                        {feature.icon}
                                    </div>
                                </div>

                                {/* Content */}
                                <h4 className="text-white fw-bold mb-3 tracking-wide text-center" style={{ fontSize: '1.15rem' }}>
                                    {feature.title}
                                </h4>
                                <p className="text-muted mb-0 text-center" style={{ lineHeight: '1.6', fontSize: '0.85rem' }}>
                                    {feature.desc}
                                </p>

                            </div>
                        ))}
                    </div>

                </Container>
            </section>

            {/* ===================HOW TO WORKS SECTION ================== */}

            <section className="wt-how-it-works-section py-5 position-relative">

                {/* Background Ambient Glows */}
                <div className="wt-hiw-bg-glow glow-left"></div>
                <div className="wt-hiw-bg-glow glow-right"></div>

                <Container className="py-5 position-relative z-3">

                    {/* --- Section Header --- */}
                    <div className="text-center mb-5 pb-5 wt-fade-in-header">
                        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 wt-glass-badge mb-3">
                            <Activity size={14} className="wt-cyan-accent" />
                            <span className="text-black-50 fw-semibold text-uppercase tracking-wider" style={{ fontSize: '0.75rem' }}>
                                The Pipeline
                            </span>
                        </div>
                        <h2 className="display-5 fw-bolder text-white wt-tracking-tight">
                            How It <span className="wt-text-gradient-cyan-blue">Works</span>
                        </h2>
                    </div>

                    {/* --- The Process Pathway --- */}
                    <Row className="position-relative">
                        {steps.map((step, index) => (
                            <Col lg={4} className="mb-5 mb-lg-0" key={index}>

                                <div
                                    className={`wt-step-wrapper text-center theme-${step.theme} wt-stagger-in`}
                                    style={{ animationDelay: `${0.2 * index}s` }}
                                >

                                    {/* 1. The Connector Line (Draws a line to the NEXT item on desktop) */}
                                    {index < steps.length - 1 && (
                                        <div className="wt-connector-line d-none d-lg-block">
                                            <div className="wt-connector-pulse"></div>
                                        </div>
                                    )}

                                    {/* 2. The Glowing Node & Watermark Number */}
                                    <div className="wt-step-node-container mx-auto mb-4 position-relative">
                                        {/* Huge translucent number sitting behind the node */}
                                        <span className="wt-step-watermark">{step.id}</span>

                                        {/* The Glass Node */}
                                        <div className="wt-step-node shadow-lg">
                                            {step.icon}
                                        </div>
                                    </div>

                                    {/* 3. Text Content */}
                                    <h4 className="text-white fw-bold mb-3 tracking-wide" style={{ fontSize: '1.3rem' }}>
                                        {step.title}
                                    </h4>
                                    <p className="text-white mx-auto" style={{ maxWidth: '300px', lineHeight: '1.7', fontSize: '0.95rem' }}>
                                        {step.desc}
                                    </p>

                                </div>

                            </Col>
                        ))}
                    </Row>

                </Container>
            </section>

            {/* =================FAQ SECTION ========================= */}
            <section className="wt-faq-section py-5 position-relative">
                <Container className="py-5">
                    <Row className="justify-content-center">
                        <Col lg={8}>

                            {/* --- Section Header --- */}
                            <div className="text-center mb-5 pb-2 wt-fade-in-header">
                                <div className="d-inline-flex align-items-center gap-2 px-3 py-1 wt-glass-badge mb-4">
                                    <MessageCircleQuestion size={14} className="wt-cyan-accent" />
                                    <span className="text-muted fw-semibold text-uppercase tracking-wider" style={{ fontSize: '0.75rem' }}>
                                        Support & Answers
                                    </span>
                                </div>

                                <h2 className="display-5 fw-bolder text-dark-slate wt-tracking-tight mb-3">
                                    Frequently Asked <span className="wt-text-gradient-cyan-blue">Questions</span>
                                </h2>
                                <p className="text-muted mx-auto" style={{ fontSize: '1.1rem' }}>
                                    Everything you need to know about the product and billing.
                                </p>
                            </div>

                            {/* --- The FAQ Accordion List --- */}
                            <div className="wt-faq-list">
                                {faqs.map((faq, index) => {
                                    const isActive = activeId === faq.id;

                                    return (
                                        <div
                                            key={faq.id}
                                            className={`wt-faq-item ${isActive ? 'active' : ''} wt-stagger-in`}
                                            style={{ animationDelay: `${0.1 * index}s` }}
                                        >

                                            {/* The Clickable Header */}
                                            <button
                                                className="wt-faq-header d-flex align-items-center justify-content-between w-100 border-0 bg-transparent"
                                                onClick={() => toggleFAQ(faq.id)}
                                                aria-expanded={isActive}
                                            >
                                                <h4 className="wt-faq-question m-0 fw-semibold text-start">
                                                    {faq.question}
                                                </h4>
                                                <div className="wt-faq-icon-wrapper ms-3 flex-shrink-0">
                                                    {/* Plus icon smoothly rotates into an 'X' when active */}
                                                    <Plus size={20} className="wt-faq-icon" />
                                                </div>
                                            </button>

                                            {/* The Fluid Expanding Answer Wrapper */}
                                            <div className="wt-faq-answer-wrapper">
                                                <div className="wt-faq-answer-inner">
                                                    <p className="wt-faq-answer text-muted m-0">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>

                        </Col>
                    </Row>
                </Container>
            </section>

            {/* ==================NEWSLETTER SECTION ================== */}
            <section className="wt-newsletter-section py-5 position-relative">

                {/* Background Ambient Orbs */}
                <div className="wt-newsletter-orb orb-left"></div>
                <div className="wt-newsletter-orb orb-right"></div>

                <Container className="py-5 position-relative z-3">
                    <Row className="justify-content-center">
                        <Col lg={8} md={10}>

                            <div className="wt-newsletter-card text-center wt-fade-in-up">

                                {/* Badge */}
                                <div className="d-inline-flex align-items-center gap-2 px-3 py-1 wt-glass-badge mb-4">
                                    <Sparkles size={14} className="wt-cyan-accent" />
                                    <span className="text-muted fw-semibold text-uppercase tracking-wider" style={{ fontSize: '0.75rem' }}>
                                        Stay Updated
                                    </span>
                                </div>

                                {/* Headlines */}
                                <h2 className="display-6 fw-bolder text-dark-slate wt-tracking-tight mb-3">
                                    Subscribe to Our <span className="wt-text-gradient-cyan-blue">Newsletter</span>
                                </h2>
                                <p className="text-muted mb-5" style={{ fontSize: '1.15rem' }}>
                                    Get updates, beta access, & new tools delivered straight to your inbox. 🚀
                                </p>

                                {/* Unified Input Form */}
                                <div className="wt-subscribe-wrapper mx-auto mb-4">
                                    <div className="wt-subscribe-inner d-flex align-items-center p-1">

                                        <Mail size={20} className="text-muted ms-3 me-2" />

                                        <input
                                            type="email"
                                            className="wt-subscribe-input flex-grow-1"
                                            placeholder="Enter your email address..."
                                            aria-label="Email address"
                                        />

                                        <button className="wt-btn-subscribe d-flex align-items-center">
                                            Subscribe <Send size={16} className="ms-2 wt-send-icon" />
                                        </button>

                                    </div>
                                </div>

                                {/* Disclaimer */}
                                <div className="d-flex align-items-center justify-content-center text-muted gap-2 mt-4" style={{ fontSize: '0.85rem' }}>
                                    <ShieldCheck size={16} className="wt-cyan-accent opacity-75" />
                                    <span>No spam. Unsubscribe anytime.</span>
                                </div>

                            </div>

                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default About;