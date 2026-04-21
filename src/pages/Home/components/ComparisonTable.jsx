import React from 'react';
import { Container, Badge } from 'react-bootstrap';
import { Check, X } from 'lucide-react';

/**
 * ComparisonTable component for the landing page.
 * Compares WebzenTools features against generic utility sites.
 */
const ComparisonTable = () => {
    const comparisonData = [
        { feature: "Data Privacy", webzen: "100% Client-Side", other: "Saves Data on Server" },
        { feature: "Processing Speed", webzen: "Instant Local Exec", other: "Slow Server Delays" },
        { feature: "User Experience", webzen: "Clean, Ad-Light UI", other: "Cluttered & Pop-ups" },
        { feature: "Hidden Costs", webzen: "Always Free", other: "Subscription Traps" },
        { feature: "Access Mode", webzen: "No Login Needed", other: "Forced Account Sign-up" }
    ];

    return (
        <section className="comparison-section py-5 bg-dark position-relative">
            <div className="cta-glow cta-glow-blue opacity-10"></div>
            <Container className="position-relative z-2">
                <div className="text-center mb-5">
                    <Badge bg="warning" className="bg-opacity-10 text-warning mb-2 rounded-pill px-3">Feature Showdown</Badge>
                    <h2 className="display-6 fw-bold text-white mb-3">Why Choose <span className="text-gradient">WebzenTools?</span></h2>
                    <p className="text-white-50 mx-auto" style={{ maxWidth: '600px' }}>
                        We've built a platform that removes the friction and privacy risks associated with traditional online utility sites.
                    </p>
                </div>

                <div className="wt-comparison-table mx-auto" style={{ maxWidth: '950px' }}>
                    <div className="comparison-header-row d-flex py-4 px-4 rounded-top-5 align-items-center">
                        <div className="col-4 fw-bold text-white-50 small text-uppercase tracking-widest">Platform Feature</div>
                        <div className="col-4 text-center">
                            <div className="winner-header-box p-2 rounded-4">
                                <div className="fw-black text-primary text-uppercase tracking-widest mb-1 small">WebzenTools</div>
                                <Badge bg="primary" className="bg-opacity-20 text-white border border-primary border-opacity-20 rounded-pill tiny fw-bold">BEST CHOICE</Badge>
                            </div>
                        </div>
                        <div className="col-4 fw-bold text-white-50 text-center small text-uppercase tracking-widest opacity-50">Generic Sites</div>
                    </div>

                    {comparisonData.map((row, index) => (
                        <div key={index} className="comparison-body-row d-flex align-items-center py-4 px-4">
                            <div className="col-4 feature-label text-white fw-medium">{row.feature}</div>
                            <div className="col-4 text-center winner-col-active">
                                <div className="winner-indicator">
                                    <div className="success-glow-icon mb-2">
                                        <Check size={20} className="text-success" strokeWidth={3} />
                                    </div>
                                    <span className="text-white small fw-bold">{row.webzen}</span>
                                </div>
                            </div>
                            <div className="col-4 text-center other-col opacity-50">
                                <div className="d-inline-flex flex-column align-items-center">
                                    <div className="danger-glow-icon mb-2">
                                        <X size={20} className="text-danger" strokeWidth={3} />
                                    </div>
                                    <span className="text-white small">{row.other}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default ComparisonTable;
