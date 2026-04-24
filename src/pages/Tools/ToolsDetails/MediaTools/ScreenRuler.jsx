import React, { useState, useEffect, useRef } from 'react';
import { FaRulerCombined, FaDesktop, FaMobileAlt, FaTabletAlt, FaExpand, FaMousePointer, FaEye, FaInfoCircle } from 'react-icons/fa';

const ScreenRuler = () => {
    const [metrics, setMetrics] = useState({
        screen: { w: 0, h: 0 },
        viewport: { w: 0, h: 0 },
        dpr: 1,
        colorDepth: 0,
        orientation: ''
    });

    const [isMeasuring, setIsMeasuring] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
    const [measurements, setMeasurements] = useState([]);
    const canvasRef = useRef(null);

    useEffect(() => {
        const updateMetrics = () => {
            setMetrics({
                screen: { w: window.screen.width, h: window.screen.height },
                viewport: { w: window.innerWidth, h: window.innerHeight },
                dpr: window.devicePixelRatio,
                colorDepth: window.screen.colorDepth,
                orientation: window.screen.orientation ? window.screen.orientation.type : 'N/A'
            });
        };

        updateMetrics();
        window.addEventListener('resize', updateMetrics);
        return () => window.removeEventListener('resize', updateMetrics);
    }, []);

    const handleMouseDown = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setIsMeasuring(true);
        setStartPos({ x, y });
        setCurrentPos({ x, y });
    };

    const handleMouseMove = (e) => {
        if (!isMeasuring) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setCurrentPos({ x, y });
    };

    const handleMouseUp = () => {
        if (!isMeasuring) return;
        const width = Math.abs(currentPos.x - startPos.x);
        const height = Math.abs(currentPos.y - startPos.y);
        
        if (width > 5 || height > 5) {
            setMeasurements(prev => [{
                x: Math.min(startPos.x, currentPos.x),
                y: Math.min(startPos.y, currentPos.y),
                w: width,
                h: height,
                id: Date.now()
            }, ...prev.slice(0, 4)]);
        }
        
        setIsMeasuring(false);
    };

    const clearMeasurements = () => setMeasurements([]);

    const commonResolutions = [
        { name: 'iPhone 14 Pro', w: 393, h: 852, icon: <FaMobileAlt /> },
        { name: 'Samsung S22', w: 360, h: 800, icon: <FaMobileAlt /> },
        { name: 'iPad Air', w: 820, h: 1180, icon: <FaTabletAlt /> },
        { name: 'MacBook Air', w: 1280, h: 832, icon: <FaDesktop /> },
        { name: 'Full HD Monitor', w: 1920, h: 1080, icon: <FaDesktop /> },
        { name: '4K Ultra HD', w: 3840, h: 2160, icon: <FaDesktop /> }
    ];

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-12">
                    {/* Hero Header */}
                    <div className="text-center mb-5 p-4 rounded-4 shadow-lg overflow-hidden position-relative" style={{ 
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)'
                        }}>
                            <FaRulerCombined className="text-white fs-3" />
                        </div>
                        <h2 className="fw-bold mb-2">Screen Resolution Ruler</h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                            Analyze your display metrics and measure on-screen elements with pixel-perfect precision. 
                            Essential for UI designers and web developers.
                        </p>
                    </div>

                    <div className="row g-4">
                        {/* Metrics Dashboard */}
                        <div className="col-md-4">
                            <div className="glass-card p-4 rounded-4 h-100 shadow-sm border border-secondary-subtle">
                                <h5 className="fw-bold mb-4 d-flex align-items-center">
                                    <FaDesktop className="text-indigo me-2" /> Live Metrics
                                </h5>
                                
                                <div className="metric-item mb-3 p-3 rounded-3 bg-dark-soft border border-secondary-subtle transition-all">
                                    <div className="small text-muted mb-1">Viewport Size</div>
                                    <div className="fs-4 fw-bold text-indigo font-monospace">{metrics.viewport.w} <span className="text-muted small">x</span> {metrics.viewport.h}</div>
                                </div>

                                <div className="metric-item mb-3 p-3 rounded-3 bg-dark-soft border border-secondary-subtle transition-all">
                                    <div className="small text-muted mb-1">Screen Resolution</div>
                                    <div className="fs-5 fw-bold text-white font-monospace">{metrics.screen.w} <span className="text-muted small">x</span> {metrics.screen.h}</div>
                                </div>

                                <div className="row g-2">
                                    <div className="col-6">
                                        <div className="p-3 rounded-3 bg-dark-soft border border-secondary-subtle">
                                            <div className="small text-muted mb-1">Pixel Ratio</div>
                                            <div className="fw-bold font-monospace">{metrics.dpr}</div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="p-3 rounded-3 bg-dark-soft border border-secondary-subtle">
                                            <div className="small text-muted mb-1">Color Depth</div>
                                            <div className="fw-bold font-monospace">{metrics.colorDepth}-bit</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 p-3 rounded-3 bg-indigo-soft border border-indigo text-indigo small d-flex">
                                    <FaInfoCircle className="mt-1 me-2 flex-shrink-0" />
                                    <span>Resize your browser window to see viewport metrics update in real-time.</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Measurement Area */}
                        <div className="col-md-8">
                            <div className="glass-card p-4 rounded-4 shadow-lg border border-secondary-subtle h-100">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="fw-bold mb-0 d-flex align-items-center">
                                        <FaMousePointer className="text-primary me-2" /> Interactive Ruler
                                    </h5>
                                    <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={clearMeasurements}>
                                        Clear Measurements
                                    </button>
                                </div>

                                <div 
                                    ref={canvasRef}
                                    className="measurement-area rounded-4 border border-dashed border-secondary-subtle position-relative overflow-hidden cursor-crosshair bg-dark-soft shadow-inner"
                                    style={{ height: '350px', cursor: 'crosshair' }}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                >
                                    {/* Grid Background */}
                                    <div className="position-absolute w-100 h-100 opacity-10" style={{ 
                                        backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                                        backgroundSize: '20px 20px'
                                    }}></div>

                                    {/* Active Measurement Box */}
                                    {isMeasuring && (
                                        <div className="position-absolute border border-primary bg-primary-soft shadow-lg" style={{
                                            left: Math.min(startPos.x, currentPos.x),
                                            top: Math.min(startPos.y, currentPos.y),
                                            width: Math.abs(currentPos.x - startPos.x),
                                            height: Math.abs(currentPos.y - startPos.y),
                                            pointerEvents: 'none',
                                            transition: 'none'
                                        }}>
                                            <div className="position-absolute bottom-0 end-0 bg-primary text-white small px-2 py-1 rounded-start-top font-monospace" style={{ transform: 'translate(0, 100%)' }}>
                                                {Math.round(Math.abs(currentPos.x - startPos.x))}x{Math.round(Math.abs(currentPos.y - startPos.y))} px
                                            </div>
                                        </div>
                                    )}

                                    {/* Past Measurements */}
                                    {measurements.map(m => (
                                        <div key={m.id} className="position-absolute border border-secondary bg-white-soft shadow-sm" style={{
                                            left: m.x,
                                            top: m.y,
                                            width: m.w,
                                            height: m.h,
                                            pointerEvents: 'none'
                                        }}>
                                            <div className="position-absolute top-0 left-0 bg-secondary text-white small px-2 py-1 rounded-bottom-end font-monospace" style={{ fontSize: '10px' }}>
                                                {Math.round(m.w)}x{Math.round(m.h)} px
                                            </div>
                                        </div>
                                    ))}

                                    {!isMeasuring && measurements.length === 0 && (
                                        <div className="position-absolute top-50 start-50 translate-middle text-center opacity-50">
                                            <FaRulerCombined className="display-4 mb-3" />
                                            <p className="mb-0 fw-bold">Click and Drag Here</p>
                                            <p className="small">Measure anything on this canvas</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="mt-3 d-flex align-items-center small text-muted">
                                    <FaEye className="me-2" />
                                    <span>The ruler measures internal pixel distance within this area.</span>
                                </div>
                            </div>
                        </div>

                        {/* Reference Guide */}
                        <div className="col-12">
                            <div className="glass-card p-4 rounded-4 shadow-sm border border-secondary-subtle">
                                <h5 className="fw-bold mb-4 d-flex align-items-center">
                                    <FaExpand className="text-success me-2" /> Common Screen Resolutions
                                </h5>
                                <div className="row g-3">
                                    {commonResolutions.map((res, index) => (
                                        <div className="col-lg-2 col-md-4 col-6" key={index}>
                                            <div className="p-3 rounded-4 bg-dark-soft border border-secondary-subtle h-100 transition-all resolution-card text-center">
                                                <div className="mb-2 fs-4 text-muted">{res.icon}</div>
                                                <div className="fw-bold small mb-1">{res.name}</div>
                                                <div className="small font-monospace text-success">{res.w}x{res.h}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .glass-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }
                .bg-dark-soft { background: rgba(0, 0, 0, 0.2); }
                .bg-primary-soft { background: rgba(59, 130, 246, 0.1); }
                .bg-white-soft { background: rgba(255, 255, 255, 0.03); }
                .bg-indigo-soft { background: rgba(99, 102, 241, 0.1); }
                .text-indigo { color: #818cf8; }
                .border-indigo { border-color: rgba(99, 102, 241, 0.3) !important; }
                .cursor-crosshair { cursor: crosshair; }
                .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); }
                .transition-all { transition: all 0.3s ease; }
                .metric-item:hover {
                    transform: translateX(5px);
                    background: rgba(255, 255, 255, 0.08);
                }
                .resolution-card:hover {
                    transform: translateY(-5px);
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(16, 185, 129, 0.3) !important;
                }
                .rounded-start-top {
                    border-top-left-radius: 4px;
                }
            `}} />
        </div>
    );
};

export default ScreenRuler;
