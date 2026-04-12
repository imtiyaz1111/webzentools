import React, { useRef, useState } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Play, ShieldCheck, Zap, ArrowLeft, Rocket } from 'lucide-react';
import {
    Type,
    Image as ImageIcon,
    Calculator,
    Code,
    Scissors,
    Wand2,
    ArrowRight
} from 'lucide-react';
import { FaLaptopCode, FaBullhorn, FaPaintBrush, FaChartLine, FaVideo, FaRobot, FaStar } from 'react-icons/fa';
import { FiCommand, FiCpu, FiLayers, FiPenTool, FiArrowRight } from 'react-icons/fi';
import { Globe2, HeartHandshake, Mail, Send } from 'lucide-react';
import { FaTimesCircle, FaCheckCircle, FaTerminal, FaShieldAlt, FaBolt, FaArrowRight, FaLock } from 'react-icons/fa';
import "./Home.css"


// Swiper core and required modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const Home = () => {

    // Array of tool data to make rendering clean and easy to update
    const tools = [
        {
            id: 1,
            title: "AI Text Rewriter",
            description: "Instantly rewrite and enhance your paragraphs with human-like flow and perfect grammar.",
            icon: <Type size={24} />,
            colorClass: "icon-blue"
        },
        {
            id: 2,
            title: "Background Remover",
            description: "Remove the background from any image in seconds with pixel-perfect edge detection.",
            icon: <Scissors size={24} />,
            colorClass: "icon-purple"
        },
        {
            id: 3,
            title: "Smart Calculator",
            description: "Advanced financial and scientific calculators designed for complex equations.",
            icon: <Calculator size={24} />,
            colorClass: "icon-green"
        },
        {
            id: 4,
            title: "Code Formatter",
            description: "Beautify and format JSON, HTML, CSS, and JavaScript code instantly.",
            icon: <Code size={24} />,
            colorClass: "icon-orange"
        },
        {
            id: 5,
            title: "Image Upscaler",
            description: "Enhance low-resolution images up to 4x quality without losing any fine details.",
            icon: <ImageIcon size={24} />,
            colorClass: "icon-pink"
        },
        {
            id: 6,
            title: "Magic SVG Generator",
            description: "Convert text prompts into beautiful, scalable vector graphics for your projects.",
            icon: <Wand2 size={24} />,
            colorClass: "icon-indigo"
        }
    ];


    const sliderRef = useRef(null);

    // Smooth scrolling functions
    const scrollLeft = () => {
        sliderRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    };

    const scrollRight = () => {
        sliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    };

    const categories = [
        {
            id: 1,
            name: "Development",
            tools: "120+ Tools",
            icon: <FaLaptopCode size={24} />,
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop"
        },
        {
            id: 2,
            name: "Marketing",
            tools: "85+ Tools",
            icon: <FaBullhorn size={24} />,
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop"
        },
        {
            id: 3,
            name: "Design",
            tools: "94+ Tools",
            icon: <FaPaintBrush size={24} />,
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&auto=format&fit=crop"
        },
        {
            id: 4,
            name: "Finance",
            tools: "45+ Tools",
            icon: <FaChartLine size={24} />,
            image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop"
        },
        {
            id: 5,
            name: "Video Editing",
            tools: "32+ Tools",
            icon: <FaVideo size={24} />,
            image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=600&auto=format&fit=crop"
        },
        {
            id: 6,
            name: "AI & Machine Learning",
            tools: "60+ Tools",
            icon: <FaRobot size={24} />,
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop"
        }
    ];



    // On desktop, we rely purely on CSS :hover for better performance.
    const [activeId, setActiveId] = useState(1);

    const featured = [
        {
            id: 1,
            title: "AI Code Assistant",
            subtitle: "Write code 10x faster.",
            description: "Harness the power of machine learning to auto-complete entire functions, refactor legacy code, and catch bugs before they deploy.",
            icon: <FiCommand size={28} />,
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
            color: "from-blue-600 to-indigo-900"
        },
        {
            id: 2,
            title: "Neural Engine API",
            subtitle: "Integrate AI anywhere.",
            description: "Access our ultra-low latency inference engine. Process text, images, and video streams in real-time with zero infrastructure setup.",
            icon: <FiCpu size={28} />,
            image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop",
            color: "from-purple-600 to-fuchsia-900"
        },
        {
            id: 3,
            title: "Canvas Pro",
            subtitle: "Infinite workspace.",
            description: "A collaborative, infinite whiteboard designed for product teams. Wireframe, flowchart, and design architectures together in real-time.",
            icon: <FiLayers size={28} />,
            image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=1000&auto=format&fit=crop",
            color: "from-emerald-500 to-teal-900"
        },
        {
            id: 4,
            title: "Vector Studio",
            subtitle: "Pixel-perfect graphics.",
            description: "Create stunning scalable vector graphics directly in your browser. Export to SVG, PNG, or React components with a single click.",
            icon: <FiPenTool size={28} />,
            image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000&auto=format&fit=crop",
            color: "from-rose-500 to-orange-900"
        }
    ];



    // Mock data for the first row (Scrolling Left)
    const row1 = [
        { id: 1, name: "Sarah Jenkins", role: "CTO @ TechFlow", text: "This platform completely revolutionized how our engineering team ships code. We've cut deployment times in half.", avatar: "https://i.pravatar.cc/150?img=1" },
        { id: 2, name: "Marcus Chen", role: "Lead Designer", text: "The UI is breathtaking. It's rare to find a tool that is this powerful but still feels like a piece of art to use.", avatar: "https://i.pravatar.cc/150?img=11" },
        { id: 3, name: "Elena Rodriguez", role: "VP of Product", text: "We migrated our entire enterprise stack over the weekend. The support team was incredible and the uptime is flawless.", avatar: "https://i.pravatar.cc/150?img=5" },
        { id: 4, name: "David Kim", role: "Founder @ StartupX", text: "Worth every single penny. It pays for itself within the first week of using the automated workflows.", avatar: "https://i.pravatar.cc/150?img=14" },
    ];

    // Mock data for the second row (Scrolling Right)
    const row2 = [
        { id: 5, name: "Emily Watson", role: "Marketing Dir.", text: "The analytics dashboard gives us insights we didn't even know we were missing. Absolutely game-changing.", avatar: "https://i.pravatar.cc/150?img=9" },
        { id: 6, name: "James Cooper", role: "Freelance Dev", text: "I've tried every competitor on the market. Nothing comes close to the speed and reliability of this ecosystem.", avatar: "https://i.pravatar.cc/150?img=12" },
        { id: 7, name: "Anita Patel", role: "Operations Head", text: "Setup took less than 10 minutes. The documentation is pristine and the API is a joy to work with.", avatar: "https://i.pravatar.cc/150?img=20" },
        { id: 8, name: "Michael Chang", role: "CEO @ Innovate", text: "If you are scaling a modern tech company, this is the infrastructure you need to be building on.", avatar: "https://i.pravatar.cc/150?img=33" },
    ];

    // Helper function to render 5 gold stars
    const renderStars = () => (
        <div className="d-flex gap-1 mb-3 text-warning">
            {[...Array(5)].map((_, i) => <FaStar key={i} size={14} />)}
        </div>
    );

    return (
        <>
        
            <section className="premium-hero-section">
                {/* Background decorative elements */}
                <div className="hero-glow glow-left"></div>
                <div className="hero-glow glow-right"></div>

                <Container className="position-relative">
                    <Row className="align-items-center min-vh-80 py-5">

                        {/* Left Column: Text Content */}
                        <Col lg={6} className="pe-lg-5 mb-5 mb-lg-0 z-index-2">

                            {/* Small premium badge */}
                            <div className="hero-badge mb-4 d-inline-flex align-items-center">
                                <span className="badge-pulse"></span>
                                <span className="fw-medium">Introducing Version 2.0</span>
                            </div>

                            <h1 className="hero-headline display-4 fw-bold mb-4">
                                Build the future with <br className="d-none d-lg-block" />
                                <span className="text-gradient">premium tools.</span>
                            </h1>

                            <p className="hero-subheadline mb-5 text-muted lead">
                                Elevate your digital experience with our state-of-the-art platform.
                                Designed for visionaries who refuse to compromise on quality, speed, or aesthetics.
                            </p>

                            {/* Buttons / CTAs */}
                            <div className="hero-ctas d-flex flex-wrap gap-3 mb-5">
                                <Button variant="primary" size="lg" className="hero-btn-primary d-flex align-items-center gap-2">
                                    Get Started Free <ArrowRight size={20} />
                                </Button>
                                <Button variant="outline-dark" size="lg" className="hero-btn-secondary d-flex align-items-center gap-2">
                                    <Play size={20} fill="currentColor" /> Watch Demo
                                </Button>
                            </div>

                            {/* Mini Trust Indicators */}
                            <div className="hero-trust-indicators d-flex gap-4">
                                <div className="d-flex align-items-center gap-2 text-muted small fw-medium">
                                    <ShieldCheck size={18} className="text-success" /> No credit card required
                                </div>
                                <div className="d-flex align-items-center gap-2 text-muted small fw-medium">
                                    <Zap size={18} className="text-warning" /> Lightning fast setup
                                </div>
                            </div>
                        </Col>

                        {/* Right Column: Visual / Image */}
                        <Col lg={6} className="z-index-2">
                            <div className="hero-image-wrapper">
                                {/* Replace the src with your actual dashboard/product image */}
                                <img
                                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop"
                                    alt="Premium Dashboard Interface"
                                    className="hero-main-image img-fluid"
                                />
                                {/* Floating UI Card effect */}
                                <div className="hero-floating-card">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="card-icon-box">
                                            <Zap size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h6 className="mb-0 fw-bold">Performance Optimized</h6>
                                            <small className="text-muted">+98% faster load times</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>

                    </Row>
                </Container>
            </section>

            {/* ==================POPULAR TOOLS SECTION =============== */}
            <section className="popular-tools-section">
                <Container>
                    {/* Section Header */}
                    <div className="text-center section-header mb-5">
                        <Badge bg="light" text="primary" className="premium-badge mb-3">
                            Most Used
                        </Badge>
                        <h2 className="display-6 fw-bold mb-3">
                            Popular <span className="text-gradient">Tools</span>
                        </h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '1.1rem' }}>
                            Discover our most loved features. Designed to save you time and elevate your daily workflow to the next level.
                        </p>
                    </div>

                    {/* Tools Grid */}
                    <Row className="g-4">
                        {tools.map((tool) => (
                            <Col lg={4} md={6} key={tool.id}>
                                <div className="premium-tool-card h-100">

                                    {/* Dynamic Icon Wrapper */}
                                    <div className={`tool-icon-wrapper ${tool.colorClass} mb-4`}>
                                        {tool.icon}
                                    </div>

                                    <h4 className="fw-bold mb-2 fs-5">{tool.title}</h4>
                                    <p className="text-muted mb-4 fs-6">
                                        {tool.description}
                                    </p>

                                    {/* Interactive Link */}
                                    <div className="tool-link mt-auto d-flex align-items-center font-weight-bold">
                                        <span>Try it out</span>
                                        <ArrowRight size={18} className="tool-arrow ms-2" />
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>

                    {/* Bottom Call to Action */}
                    <div className="text-center mt-5">
                        <button className="btn btn-outline-dark rounded-pill px-4 py-2 fw-medium d-inline-flex align-items-center gap-2 view-all-btn">
                            View all 50+ tools <ArrowRight size={18} />
                        </button>
                    </div>
                </Container>
            </section>

            {/* ===================category section =================== */}
            <section className="categories-slider-section py-5">
                <Container>
                    {/* Section Header & Custom Navigation */}
                    <div className="d-flex justify-content-between align-items-end mb-4">
                        <div>
                            <span className="premium-badge mb-2 d-inline-block">Explore</span>
                            <h2 className="display-6 fw-bold mb-0 text-dark">
                                Browse by <span className="text-gradient">Category</span>
                            </h2>
                        </div>

                        {/* Custom Slider Arrows (Linked to Swiper via class names) */}
                        <div className="slider-nav-buttons d-none d-md-flex gap-2">
                            <button className="slider-btn custom-prev" aria-label="Previous Slide">
                                <ArrowLeft size={20} />
                            </button>
                            <button className="slider-btn custom-next" aria-label="Next Slide">
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Swiper Implementation */}
                    <div className="swiper-wrapper-container">
                        <Swiper
                            modules={[Navigation, Autoplay]}
                            spaceBetween={24}
                            loop={true}
                            slidesPerView={1}
                            grabCursor={true}
                            autoplay={{
                                delay: 3500,
                                disableOnInteraction: false,
                            }}
                            navigation={{
                                prevEl: '.custom-prev',
                                nextEl: '.custom-next',
                            }}
                            breakpoints={{
                                576: { slidesPerView: 2 },
                                768: { slidesPerView: 3 },
                                1024: { slidesPerView: 4 },
                            }}
                            className="premium-swiper"
                        >
                            {categories.map((cat) => (
                                <SwiperSlide key={cat.id}>
                                    <div className="category-card">
                                        {/* Background Image */}
                                        <div
                                            className="category-bg"
                                            style={{ backgroundImage: `url(${cat.image})` }}
                                        ></div>

                                        {/* Dark Gradient Overlay */}
                                        <div className="category-overlay"></div>

                                        {/* Card Content */}
                                        <div className="category-content">
                                            <div className="category-icon-wrapper mb-3">
                                                {cat.icon}
                                            </div>
                                            <h4 className="category-title text-white fw-bold mb-1">{cat.name}</h4>
                                            <p className="category-count text-white-50 mb-0">{cat.tools}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </Container>
            </section>

            {/* =================FEATURED TOOLS SECTION =============== */}

            <section className="featured-tools-section py-5">
                <Container>
                    <div className="mb-5 text-center">
                        <span className="premium-badge mb-3 d-inline-block">Elite Arsenal</span>
                        <h2 className="display-5 fw-bold mb-3 text-dark">
                            Featured <span className="text-gradient">Innovations</span>
                        </h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                            Our flagship products, engineered from the ground up to give you an unfair advantage in the digital landscape.
                        </p>
                    </div>

                    {/* The Dynamic Expanding Grid */}
                    <div className="flex-accordion-container">
                        {featured.map((item) => (
                            <div
                                key={item.id}
                                className={`flex-panel ${activeId === item.id ? 'active' : ''}`}
                                onMouseEnter={() => setActiveId(item.id)}
                                style={{ backgroundImage: `url(${item.image})` }}
                            >
                                {/* Dark gradient overlay that matches the theme color */}
                                <div className={`panel-overlay overlay-${item.id}`}></div>

                                <div className="panel-content">
                                    {/* The icon that stays visible at the bottom when collapsed */}
                                    <div className="panel-icon-wrapper">
                                        {item.icon}
                                    </div>

                                    {/* The content that appears when expanded */}
                                    <div className="panel-details">
                                        <h6 className="panel-subtitle text-uppercase tracking-widest text-white-50 mb-1">
                                            {item.subtitle}
                                        </h6>
                                        <h3 className="panel-title text-white fw-bold mb-3">
                                            {item.title}
                                        </h3>
                                        <p className="panel-description text-light mb-4">
                                            {item.description}
                                        </p>

                                        <button className="panel-btn">
                                            Launch Tool <FiArrowRight className="ms-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ================WHY CHOOSE US SECTION ================ */}

            <section className="why-choose-us-section py-5">
                <Container className="py-5">
                    {/* Section Header */}
                    <div className="text-center mb-5 pb-3">
                        <span className="premium-badge-dark mb-3 d-inline-block">The Advantage</span>
                        <h2 className="display-5 fw-bold text-white mb-3">
                            Why industry leaders <br className="d-none d-md-block" />
                            <span className="text-gradient-gold">choose our platform.</span>
                        </h2>
                        <p className="text-white mx-auto" style={{ maxWidth: '600px', fontSize: '1.1rem' }}>
                            We don't just provide tools; we provide an unfair advantage. Built on enterprise-grade infrastructure with an obsessive focus on design.
                        </p>
                    </div>

                    {/* The Bento Box Grid */}
                    <div className="bento-grid">
                        <Row className="g-4">

                            {/* Box 1: Wide (Performance) */}
                            <Col lg={8} md={12}>
                                <div className="bento-card dark-card h-100 p-5 position-relative overflow-hidden">
                                    <div className="bento-glow-blue"></div>
                                    <div className="position-relative z-2">
                                        <div className="bento-icon-wrapper mb-4">
                                            <Zap size={28} className="text-blue-400" />
                                        </div>
                                        <h3 className="text-white fw-bold mb-3 display-6">Uncompromising Speed</h3>
                                        <p className="text-white text-lg mb-0" style={{ maxWidth: '500px' }}>
                                            Engineered from the ground up for microsecond latency. Our globally distributed architecture ensures your workflow never skips a beat, no matter where you are.
                                        </p>
                                    </div>
                                </div>
                            </Col>

                            {/* Box 2: Square (Security) */}
                            <Col lg={4} md={6}>
                                <div className="bento-card dark-card h-100 p-5 position-relative overflow-hidden">
                                    <div className="bento-glow-purple"></div>
                                    <div className="position-relative z-2 d-flex flex-column h-100">
                                        <div className="bento-icon-wrapper mb-4">
                                            <ShieldCheck size={28} className="text-purple-400" />
                                        </div>
                                        <h4 className="text-white fw-bold mb-3">Bank-Grade Security</h4>
                                        <p className="text-white mb-0 mt-auto">
                                            End-to-end encryption, SOC2 compliance, and automated threat detection keep your data locked down tight.
                                        </p>
                                    </div>
                                </div>
                            </Col>

                            {/* Box 3: Square (Global) */}
                            <Col lg={4} md={6}>
                                <div className="bento-card dark-card h-100 p-5 position-relative overflow-hidden">
                                    <div className="bento-glow-emerald"></div>
                                    <div className="position-relative z-2 d-flex flex-column h-100">
                                        <div className="bento-icon-wrapper mb-4">
                                            <Globe2 size={28} className="text-emerald-400" />
                                        </div>
                                        <h4 className="text-white fw-bold mb-3">Global Edge Network</h4>
                                        <p className="text-white mb-0 mt-auto">
                                            Deployed across 150+ edge nodes worldwide. Your tools load instantly for your team across the globe.
                                        </p>
                                    </div>
                                </div>
                            </Col>

                            {/* Box 4: Wide (Support) */}
                            <Col lg={8} md={12}>
                                <div className="bento-card dark-card h-100 p-5 position-relative overflow-hidden">
                                    <div className="bento-glow-gold"></div>
                                    <div className="position-relative z-2">
                                        <div className="bento-icon-wrapper mb-4">
                                            <HeartHandshake size={28} className="text-gold-400" />
                                        </div>
                                        <h3 className="text-white fw-bold mb-3 display-6">White-Glove Support</h3>
                                        <p className="text-white text-lg mb-0" style={{ maxWidth: '500px' }}>
                                            Skip the chatbots. Get direct access to our dedicated engineering team within 15 minutes, 24 hours a day, 7 days a week. We are your technical partners.
                                        </p>
                                    </div>
                                </div>
                            </Col>

                        </Row>
                    </div>
                </Container>
            </section>

            {/* ======================COMPARISON SECTION ================ */}
            <section className="wt-compare-section py-5 position-relative">

                {/* Background Grid */}
                <div className="wt-compare-grid"></div>

                <Container className="position-relative z-3 py-5">

                    <div className="text-center mb-5">
                        <h2 className="display-5 fw-bold text-white mb-3">Stop switching tabs.</h2>
                        <p className="text-white-50 lead mx-auto" style={{ maxWidth: '600px' }}>
                            Compare the traditional, fragmented workflow against the unified WebzenTools ecosystem.
                        </p>
                    </div>

                    <div className="wt-compare-wrapper">

                        {/* =========================================
              LEFT CARD: Fragmented Tools (The Problem)
              ========================================= */}
                        <div className="wt-compare-card wt-card-bad">
                            <h3 className="h5 fw-bold text-white mb-2">Fragmented Web Tools</h3>
                            <div className="wt-bad-price mb-4">
                                <span className="text-danger fw-bold fs-4">High Friction</span>
                                <p className="text-white-50 small mb-0">What you're dealing with now</p>
                            </div>

                            <ul className="wt-compare-list list-unstyled mb-4 pb-2 border-bottom border-secondary border-opacity-25">
                                <li className="d-flex justify-content-between mb-3 text-white-50">
                                    <span>Random JSON formatters</span>
                                    <span>Ad-heavy</span>
                                </li>
                                <li className="d-flex justify-content-between mb-3 text-white-50">
                                    <span>Base64 decoders</span>
                                    <span>Privacy risks</span>
                                </li>
                                <li className="d-flex justify-content-between mb-3 text-white-50">
                                    <span>SQL beautifiers</span>
                                    <span>Slow loading</span>
                                </li>
                                <li className="d-flex justify-content-between text-white-50">
                                    <span>Image converters</span>
                                    <span>File limits</span>
                                </li>
                            </ul>

                            <ul className="wt-compare-list list-unstyled">
                                <li className="d-flex align-items-center mb-3 text-danger opacity-75">
                                    <FaTimesCircle className="me-3" /> Constant tab switching
                                </li>
                                <li className="d-flex align-items-center mb-3 text-danger opacity-75">
                                    <FaTimesCircle className="me-3" /> Inconsistent, messy UIs
                                </li>
                                <li className="d-flex align-items-center text-danger opacity-75">
                                    <FaTimesCircle className="me-3" /> Data sent to unknown servers
                                </li>
                            </ul>
                        </div>

                        {/* =========================================
              VS BADGE
              ========================================= */}
                        <div className="wt-vs-badge">
                            VS
                        </div>

                        {/* =========================================
              RIGHT CARD: WebzenTools (The Solution)
              ========================================= */}
                        <div className="wt-compare-card wt-card-premium">
                            {/* Top glowing accent line */}
                            <div className="wt-premium-glow-line"></div>

                            <div className="d-flex align-items-center mb-4">
                                <div className="wt-brand-icon me-3"><FaTerminal size={20} /></div>
                                <h3 className="h4 fw-bold text-white mb-0">WebzenTools Suite</h3>
                            </div>

                            {/* Pricing / Value Box */}
                            <div className="wt-premium-value-box position-relative mb-4 p-3 rounded-4 d-flex justify-content-between align-items-center border border-info border-opacity-25">
                                <div className="position-absolute top-0 start-50 translate-middle badge bg-white text-dark rounded-pill px-3 py-1 shadow fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
                                    THE ULTIMATE ECOSYSTEM
                                </div>
                                <div>
                                    <span className="fs-2 fw-bold text-white">100% Free</span>
                                    <span className="text-white-50 ms-2">/ Forever</span>
                                </div>
                                <FaCheckCircle className="text-info fs-4" />
                            </div>

                            <ul className="wt-compare-list list-unstyled mb-5">
                                <li className="d-flex align-items-center mb-4 text-white">
                                    <FaCheckCircle className="me-3 text-info fs-5" />
                                    <span>All 12+ premium developer tools in one dashboard</span>
                                </li>
                                <li className="d-flex align-items-center mb-4 text-white">
                                    <FaShieldAlt className="me-3 text-info fs-5" />
                                    <span>Zero-Trust: 100% Client-side local processing</span>
                                </li>
                                <li className="d-flex align-items-center mb-4 text-white">
                                    <FaBolt className="me-3 text-info fs-5" />
                                    <span>Instant tool access via ⌘K Command Center</span>
                                </li>
                                <li className="d-flex align-items-center mb-4 text-white">
                                    <FaCheckCircle className="me-3 text-info fs-5" />
                                    <span>Unified, distraction-free premium UI</span>
                                </li>
                                <li className="d-flex align-items-center text-white">
                                    <FaCheckCircle className="me-3 text-info fs-5" />
                                    <span>No ads, no paywalls, zero data tracking</span>
                                </li>
                            </ul>

                            <button className="wt-premium-btn w-100 py-3 rounded-pill fw-bold border-0 d-flex justify-content-center align-items-center mb-3">
                                Explore the Ecosystem <FaArrowRight className="ms-2" />
                            </button>

                            <div className="text-center text-white-50" style={{ fontSize: '0.75rem' }}>
                                <FaLock className="me-1 text-warning" /> No sign-up required. Your data never leaves your device.
                            </div>
                        </div>

                    </div>
                </Container>
            </section>

            {/* =================STATUS SECTION =================== */}
            <section className="premium-testimonials-section py-5">
                <Container className="pt-5 mb-5 text-center">
                    <span className="premium-badge-dark mb-3 d-inline-block">Wall of Love</span>
                    <h2 className="display-5 fw-bold text-white mb-3">
                        Trusted by <span className="text-gradient-purple">innovators</span> worldwide.
                    </h2>
                    <p className="text-white mx-auto" style={{ maxWidth: '600px' }}>
                        Don't just take our word for it. Read what the industry's top professionals are saying about our platform.
                    </p>
                </Container>

                {/* The Infinite Marquee Wrapper */}
                <div className="marquee-wrapper">

                    {/* Row 1: Scrolls Normal (Left) */}
                    <div className="marquee-track">
                        {[...row1, ...row1].map((testimonial, index) => (
                            <div className="testimonial-card" key={`r1-${index}`}>
                                {renderStars()}
                                <p className="testimonial-text">"{testimonial.text}"</p>
                                <div className="d-flex align-items-center mt-4">
                                    <img src={testimonial.avatar} alt={testimonial.name} className="testimonial-avatar" />
                                    <div className="ms-3">
                                        <h6 className="text-white mb-0 fw-bold">{testimonial.name}</h6>
                                        <small className="text-muted">{testimonial.role}</small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Row 2: Scrolls Reverse (Right) */}
                    <div className="marquee-track reverse-track mt-4">
                        {[...row2, ...row2].map((testimonial, index) => (
                            <div className="testimonial-card" key={`r2-${index}`}>
                                {renderStars()}
                                <p className="testimonial-text">"{testimonial.text}"</p>
                                <div className="d-flex align-items-center mt-4">
                                    <img src={testimonial.avatar} alt={testimonial.name} className="testimonial-avatar" />
                                    <div className="ms-3">
                                        <h6 className="text-white mb-0 fw-bold">{testimonial.name}</h6>
                                        <small className="text-muted">{testimonial.role}</small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* ====================CTA SECTION ==================== */}
            <section className="premium-cta-section position-relative">

                {/* --- Animated Background Elements --- */}
                {/* The glowing orbs */}
                <div className="cta-glow cta-glow-blue"></div>
                <div className="cta-glow cta-glow-purple"></div>
                {/* The subtle tech grid */}
                <div className="cta-grid-overlay"></div>

                <Container className="position-relative z-2 py-5">
                    {/* --- The Glassmorphism Container --- */}
                    <div className="cta-glass-wrapper text-center px-4 py-5 p-md-5 mx-auto">

                        {/* Top Pill Badge */}
                        <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill cta-badge mb-4">
                            <Mail size={16} className="text-accent-blue" />
                            <span className="text-white fw-medium" style={{ fontSize: '0.85rem' }}>
                                Stay ahead of the curve
                            </span>
                        </div>

                        {/* Headline */}
                        <h2 className="display-4 fw-bold text-white mb-4" style={{ letterSpacing: '-1px' }}>
                            Get exclusive insights <br className="d-none d-md-block" />
                            <span className="text-gradient-primary">delivered to your inbox.</span>
                        </h2>

                        {/* Subtitle */}
                        <p className="lead text-white-50 mb-5 mx-auto" style={{ maxWidth: '600px' }}>
                            Join 10,000+ forward-thinking developers and founders. We share weekly tips, industry trends, and early access to new features.
                        </p>

                        {/* Newsletter Input Form */}
                        <form
                            className="newsletter-form-group d-flex flex-column flex-sm-row gap-3 mx-auto"
                            style={{ maxWidth: '550px' }}
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <input
                                type="email"
                                className="form-control premium-input"
                                placeholder="Enter your email address..."
                                required
                            />
                            <button className="btn-premium-primary flex-shrink-0" type="submit">
                                Subscribe <Send size={18} className="ms-2" />
                            </button>
                        </form>

                        {/* Subtle bottom text */}
                        <p className="text-white-50 mt-4 mb-0" style={{ fontSize: '0.8rem' }}>
                            We care about your data. No spam, unsubscribe at any time.
                        </p>

                    </div>
                </Container>
            </section>
        </>
    );
};

export default Home;