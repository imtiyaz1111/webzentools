import React from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Home, ChevronRight } from 'lucide-react';
import { Mail, Briefcase, MessageSquare, Send, ArrowRight } from 'lucide-react';

import { FaRocket, FaArrowRight, FaEnvelope } from 'react-icons/fa';

import "./Contact.css";
import SEO from '../../components/SEO';

const Contact = () => {

    const contactChannels = [
        {
            title: "Technical Support",
            desc: "Get help with infrastructure, APIs, and scaling.",
            value: "support@webzentools.com",
            icon: <Mail size={22} className="wt-cyan-accent" />,
            theme: "cyan"
        },
        {
            title: "Enterprise Sales",
            desc: "Custom pricing and dedicated SLAs for large teams.",
            value: "enterprise@webzentools.com",
            icon: <Briefcase size={22} className="text-blue-400" />,
            theme: "blue"
        },
        {
            title: "Developer Community",
            desc: "Chat with our engineers and other developers.",
            value: "Join our Discord Server",
            icon: <MessageSquare size={22} className="wt-cyan-accent" />,
            theme: "cyan",
            isLink: true
        }
    ];



    return (
        <> <SEO
            title={`Our Services | `}
            description={`Explore  services by Webzenyx including modern, scalable, and high-performance solutions.`}
            keywords="web development services, mobile app development, UI UX design, ecommerce solutions"
            url={`https://www.webzenyx.com/contact`}
        />
            <section className="wt-contact-hero position-relative d-flex align-items-center">

                {/* --- Premium Background Layers --- */}
                {/* 1. The Subtle Tech Grid */}
                <div className="wt-grid-overlay"></div>

                {/* 2. Floating Ambient Glows */}
                <div className="wt-glow wt-glow-left"></div>
                <div className="wt-glow wt-glow-right"></div>

                <Container className="position-relative z-3 text-center wt-content-wrapper py-5">

                    {/* --- The Premium Cyan Breadcrumb Pill --- */}
                    <div className="wt-fade-in-1 mb-4">
                        <div className="wt-breadcrumb-pill d-inline-flex align-items-center shadow-lg">
                            <Home size={15} className="wt-cyan-accent me-2" />
                            <a href="/" className="wt-breadcrumb-link text-decoration-none fw-medium">
                                Home
                            </a>
                            <ChevronRight size={14} className="wt-breadcrumb-separator mx-2" />
                            <span className="wt-cyan-accent fw-bold d-flex align-items-center">
                                {/* Pulsing Active Dot */}
                                <span className="wt-active-dot me-2"></span>
                                Contact Us
                            </span>
                        </div>
                    </div>

                    {/* --- Main Headline --- */}
                    <h1 className="display-2 fw-bolder text-white mb-4 wt-tracking-tight wt-fade-in-2">
                        Get in <span className="wt-text-gradient-cyan-blue">Touch</span>
                    </h1>

                    {/* --- Short Description Line --- */}
                    <p className="lead text-white mx-auto wt-fade-in-3" style={{ maxWidth: '650px', lineHeight: '1.8' }}>
                        Have a technical question, need custom enterprise pricing, or want to report an issue? Our engineering team is here to help you scale without friction.
                    </p>

                </Container>
            </section>

            {/* ===================CONTACT AREA SECTION ================= */}

            <section className="wt-contact-core-section py-5 position-relative">

                {/* Subtle Background Elements */}
                <div className="wt-contact-bg-grid"></div>

                <Container className="py-5 position-relative z-3">
                    <Row className="g-5 align-items-start">

                        {/* =========================================
              LEFT COLUMN: DIRECT CHANNELS
              ========================================= */}
                        <Col lg={5} className="wt-fade-in-left">
                            <div className="pe-lg-4">
                                <h3 className="display-6 fw-bolder text-white mb-3 wt-tracking-tight">
                                    Let's build <br />
                                    <span className="wt-text-gradient-cyan-blue">something great.</span>
                                </h3>
                                <p className="text-muted mb-5" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                                    Whether you need technical assistance or want to discuss a custom enterprise deployment, our team is ready to help.
                                </p>

                                {/* Contact Cards */}
                                <div className="d-flex flex-column gap-4">
                                    {contactChannels.map((channel, index) => (
                                        <div key={index} className={`wt-channel-card theme-${channel.theme} p-4 d-flex align-items-start`}>

                                            {/* Glowing Icon Box */}
                                            <div className="wt-channel-icon-box me-4 flex-shrink-0">
                                                {channel.icon}
                                            </div>

                                            {/* Content */}
                                            <div>
                                                <h5 className="text-white fw-bold mb-1">{channel.title}</h5>
                                                <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>{channel.desc}</p>

                                                {channel.isLink ? (
                                                    <a href="#" className="wt-channel-link d-inline-flex align-items-center text-decoration-none fw-semibold">
                                                        {channel.value} <ArrowRight size={16} className="ms-1" />
                                                    </a>
                                                ) : (
                                                    <span className="text-white fw-medium">{channel.value}</span>
                                                )}
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Col>

                        {/* =========================================
                                RIGHT COLUMN: PREMIUM SMART FORM
                            ========================================= */}
                        <Col lg={7} className="wt-fade-in-right">
                            <div className="wt-contact-form-wrapper p-4 p-md-5">

                                <h4 className="text-white fw-bold mb-4">Send us a message</h4>

                                <Form>
                                    <Row className="g-4">

                                        {/* Name Input */}
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="wt-form-label">Full Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="John Doe"
                                                    className="wt-premium-input"
                                                />
                                            </Form.Group>
                                        </Col>

                                        {/* Email Input */}
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="wt-form-label">Work Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="john@company.com"
                                                    className="wt-premium-input"
                                                />
                                            </Form.Group>
                                        </Col>

                                        {/* Subject Dropdown */}
                                        <Col xs={12}>
                                            <Form.Group>
                                                <Form.Label className="wt-form-label">How can we help?</Form.Label>
                                                <Form.Select className="wt-premium-select">
                                                    <option>Technical Support</option>
                                                    <option>Enterprise Sales & Pricing</option>
                                                    <option>Bug Report</option>
                                                    <option>General Inquiry</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        {/* Message Textarea */}
                                        <Col xs={12}>
                                            <Form.Group>
                                                <Form.Label className="wt-form-label">Message</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={5}
                                                    placeholder="Tell us about your project or issue..."
                                                    className="wt-premium-textarea"
                                                />
                                            </Form.Group>
                                        </Col>

                                        {/* Submit Button */}
                                        <Col xs={12} className="mt-5">
                                            <button type="button" className="wt-btn-submit w-100 d-flex justify-content-center align-items-center py-3">
                                                Send Message <Send size={18} className="ms-2 wt-send-icon" />
                                            </button>
                                        </Col>

                                    </Row>
                                </Form>

                            </div>
                        </Col>

                    </Row>
                </Container>
            </section>
            {/* ================SOCIAL MEDIA ICON SECTION ================ */}
            <section className="wt-cta-section py-5 position-relative">
                <Container className="py-5">
                    <Row className="justify-content-center">
                        <Col lg={10}>

                            {/* --- The Floating CTA Island --- */}
                            <div className="wt-cta-card position-relative overflow-hidden text-center py-5 px-4 px-md-5 wt-fade-in-up">

                                {/* Internal Glowing Orbs for that Premium SaaS look */}
                                <div className="wt-cta-orb orb-top-left"></div>
                                <div className="wt-cta-orb orb-bottom-right"></div>

                                <div className="position-relative z-3">

                                    {/* Icon Badge */}
                                    <div className="wt-cta-icon-badge mx-auto mb-4">
                                        <FaRocket size={28} className="text-white" />
                                    </div>

                                    {/* Headline */}
                                    <h2 className="display-5 fw-bolder text-dark-slate wt-tracking-tight mb-3">
                                        Start Using <span className="wt-text-gradient-cyan-blue">WebzenTools</span> Today
                                    </h2>

                                    {/* Subheadline */}
                                    <p className="text-muted mx-auto mb-5" style={{ fontSize: '1.2rem', maxWidth: '600px' }}>
                                        Free, lightning-fast tools engineered to automate your workflows and make your daily work effortlessly simple.
                                    </p>

                                    {/* --- Action Buttons --- */}
                                    <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3 gap-md-4">

                                        {/* Primary Button */}
                                        <a href="/tools" className="wt-btn-cta-primary text-decoration-none d-inline-flex align-items-center justify-content-center">
                                            Explore Tools <FaArrowRight size={16} className="ms-2 wt-arrow-icon" />
                                        </a>

                                    </div>

                                </div>
                            </div>

                        </Col>
                    </Row>
                </Container>
            </section>

        </>
    );
};

export default Contact;