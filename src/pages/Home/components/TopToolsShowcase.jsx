import React, { useState } from 'react';
import { Container, Row, Col, Button, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Code2, Atom, Globe, FileJson, ArrowRight, Zap } from 'lucide-react';

const TOP_TOOLS = [
    {
        id: 'html-editor',
        name: 'HTML Online Editor',
        slug: 'html-editor',
        icon: Code2,
        desc: 'Write and preview HTML, CSS, and JS in real-time. Features live preview, download option, and premium UI.',
        image: '/assets/screenshots/html-editor-demo.png',
        color: '#ff4b2b'
    },
    {
        id: 'react-editor',
        name: 'React JSX Editor',
        slug: 'react-jsx-editor',
        icon: Atom,
        desc: 'Write and preview React components instantly in your browser. Features live rendering and Babel compilation.',
        image: '/assets/screenshots/react-editor-demo.png',
        color: '#61dafb'
    },
    {
        id: 'api-tester',
        name: 'Premium API Tester',
        slug: 'api-tester',
        icon: Globe,
        desc: 'Send HTTP requests and view responses instantly. Supports headers, parameters, and request bodies.',
        image: '/assets/screenshots/api-tester-demo.png',
        color: '#10b981'
    },
    {
        id: 'json-formatter',
        name: 'JSON Formatter',
        slug: 'json-formatter',
        icon: FileJson,
        desc: 'Format and beautify JSON data. Use our free JSON Formatter for fast and secure results.',
        image: '/assets/screenshots/json-formatter-demo.png',
        color: '#3b82f6'
    }
];

const TopToolsShowcase = () => {
    const [activeTool, setActiveTool] = useState(TOP_TOOLS[0]);

    return (
        <section className="showcase-section py-5 my-5 overflow-hidden">
            <Container>
                <div className="text-center mb-5">
                    <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-primary bg-opacity-10 text-primary fw-bold mb-3">
                        <Zap size={18} />
                        <span>Experience the Power</span>
                    </div>
                    <h2 className="display-4 fw-bold mb-3">Premium Tool <span className="text-gradient">Showcase</span></h2>
                    <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                        Explore our high-performance, browser-based tools with real-time feedback and premium glassmorphism interfaces.
                    </p>
                </div>

                <div className="showcase-container glass-card p-4 p-lg-5 rounded-5 border-0 shadow-2xl">
                    <Row className="g-5 align-items-center">
                        <Col lg={5}>
                            <div className="showcase-nav-wrapper mb-4">
                                <Nav variant="pills" className="flex-column gap-3 showcase-nav">
                                    {TOP_TOOLS.map((tool) => (
                                        <Nav.Item key={tool.id}>
                                            <Nav.Link 
                                                active={activeTool.id === tool.id}
                                                onClick={() => setActiveTool(tool)}
                                                className={`showcase-nav-link d-flex align-items-center gap-3 p-3 rounded-4 transition-all ${activeTool.id === tool.id ? 'active' : ''}`}
                                            >
                                                <div 
                                                    className="showcase-icon-box rounded-3 d-flex align-items-center justify-content-center"
                                                    style={{ 
                                                        width: '48px', 
                                                        height: '48px',
                                                        backgroundColor: activeTool.id === tool.id ? tool.color : 'rgba(0,0,0,0.05)',
                                                        color: activeTool.id === tool.id ? 'white' : 'inherit'
                                                    }}
                                                >
                                                    <tool.icon size={24} />
                                                </div>
                                                <div className="text-start">
                                                    <h5 className="mb-0 fw-bold">{tool.name}</h5>
                                                    <small className="text-muted opacity-75">Click to view demo</small>
                                                </div>
                                            </Nav.Link>
                                        </Nav.Item>
                                    ))}
                                </Nav>
                            </div>

                            <div className="active-tool-info mt-4 pt-4 border-top">
                                <h3 className="fw-bold mb-3">{activeTool.name}</h3>
                                <p className="text-muted mb-4 lead" style={{ fontSize: '1rem' }}>{activeTool.desc}</p>
                                <Button 
                                    as={Link} 
                                    to={`/tools/${activeTool.slug}`}
                                    className="hero-btn-primary px-4 py-3 rounded-pill border-0 d-inline-flex align-items-center gap-2"
                                >
                                    Try This Tool Now
                                    <ArrowRight size={20} />
                                </Button>
                            </div>
                        </Col>
                        
                        <Col lg={7}>
                            <div className="showcase-display-wrapper position-relative">
                                {/* Decorative elements */}
                                <div className="display-glow" style={{ backgroundColor: activeTool.color }}></div>
                                
                                <div className="showcase-image-frame rounded-4 overflow-hidden shadow-2xl border border-white border-opacity-10">
                                    <img 
                                        src={activeTool.image} 
                                        alt={activeTool.name} 
                                        className="img-fluid w-100 transition-all duration-500"
                                        style={{ objectFit: 'cover' }}
                                    />
                                    
                                    {/* Overlay for premium look */}
                                    <div className="image-overlay"></div>
                                </div>
                                
                                {/* Floating Badges */}
                                <div className="floating-stat-badge p-3 rounded-4 glass-card shadow-lg d-flex align-items-center gap-3">
                                    <div className="bg-success bg-opacity-20 text-success p-2 rounded-3">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <div className="fw-bold">Fast Execution</div>
                                        <small className="text-muted">Real-time processing</small>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </section>
    );
};

export default TopToolsShowcase;
