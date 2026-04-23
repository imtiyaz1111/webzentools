import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, Card, Badge, InputGroup } from 'react-bootstrap';
import { 
    FaCalendarAlt, FaArrowRight, FaClock, FaHistory, FaInfoCircle, 
    FaCalendarCheck, FaRegCalendarAlt, FaExchangeAlt, FaHourglassEnd, FaClipboardList
} from 'react-icons/fa';

const DaysBetweenDates = () => {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // State
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(nextWeek);
    const [includeEndDate, setIncludeEndDate] = useState(false);
    const [results, setResults] = useState(null);

    // Calculate Difference
    const calculateDifference = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Always calculate positive difference
        const isReversed = start > end;
        const first = isReversed ? end : start;
        const second = isReversed ? start : end;

        const diffTime = Math.abs(second - first);
        let totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (includeEndDate) {
            totalDays += 1;
        }

        // Years, Months, Days breakdown
        let years = second.getFullYear() - first.getFullYear();
        let months = second.getMonth() - first.getMonth();
        let days = second.getDate() - first.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(second.getFullYear(), second.getMonth(), 0);
            days += lastMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        // Other Stats
        const weeks = Math.floor(totalDays / 7);
        const remainingDays = totalDays % 7;
        const totalHours = totalDays * 24;
        const totalMinutes = totalHours * 60;
        const totalSeconds = totalMinutes * 60;

        setResults({
            totalDays,
            years, months, days,
            weeks, remainingDays,
            totalHours, totalMinutes, totalSeconds,
            isReversed
        });
    };

    useEffect(() => {
        calculateDifference();
    }, [startDate, endDate, includeEndDate]);

    const swapDates = () => {
        const temp = startDate;
        setStartDate(endDate);
        setEndDate(temp);
    };

    return (
        <div className="days-between-container py-4">
            <style>
                {`
                .days-between-container {
                    animation: fadeIn 0.6s ease-out;
                    max-width: 1000px;
                    margin: 0 auto;
                    color: #1e293b;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .premium-card {
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    border-radius: 24px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.05);
                    padding: 40px;
                    margin-bottom: 30px;
                }

                .date-picker-card {
                    background: #f8fafc;
                    border-radius: 20px;
                    padding: 25px;
                    border: 1px solid #f1f5f9;
                    position: relative;
                }

                .swap-divider {
                    width: 40px;
                    height: 40px;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #6366f1;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 2;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                }

                .swap-divider:hover {
                    background: #6366f1;
                    color: white;
                    transform: translate(-50%, -50%) rotate(180deg);
                }

                .result-hero {
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                    color: white;
                    border-radius: 24px;
                    padding: 50px;
                    text-align: center;
                    margin: 40px 0;
                    box-shadow: 0 20px 40px rgba(79, 70, 229, 0.2);
                }

                .result-number {
                    font-size: 6rem;
                    font-weight: 800;
                    line-height: 1;
                    margin-bottom: 5px;
                    letter-spacing: -2px;
                }

                .result-label {
                    font-size: 1.2rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    opacity: 0.9;
                }

                .stat-box {
                    background: #ffffff;
                    border: 1px solid #f1f5f9;
                    border-radius: 16px;
                    padding: 20px;
                    text-align: center;
                    transition: all 0.3s;
                }

                .stat-box:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                    border-color: #6366f1;
                }

                .stat-val {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #1e293b;
                    display: block;
                }

                .stat-lab {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                }

                .breakdown-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 15px;
                    margin-top: 20px;
                }

                @media (max-width: 768px) {
                    .result-number { font-size: 4rem; }
                    .swap-divider { top: auto; left: 50%; transform: translateX(-50%) rotate(90deg); margin: 15px 0; position: static; }
                    .date-picker-card { flex-direction: column; }
                }
                `}
            </style>

            <div className="premium-card">
                <h5 className="fw-bold mb-4 d-flex align-items-center">
                    <FaCalendarCheck className="text-primary me-2" /> Duration Calculator
                </h5>

                <div className="date-picker-card">
                    <Row className="g-4 align-items-center position-relative">
                        <Col md={5}>
                            <Form.Group>
                                <label className="small fw-bold text-muted text-uppercase mb-2 d-flex align-items-center">
                                    <FaRegCalendarAlt className="me-2 text-primary" /> Start Date
                                </label>
                                <Form.Control 
                                    type="date" 
                                    className="bg-white border-0 shadow-sm py-3 px-4 rounded-4"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2} className="text-center d-none d-md-block">
                            <div className="swap-divider" onClick={swapDates} title="Swap Dates">
                                <FaExchangeAlt />
                            </div>
                        </Col>
                        <Col md={5}>
                            <Form.Group>
                                <label className="small fw-bold text-muted text-uppercase mb-2 d-flex align-items-center">
                                    <FaHourglassEnd className="me-2 text-primary" /> End Date
                                </label>
                                <Form.Control 
                                    type="date" 
                                    className="bg-white border-0 shadow-sm py-3 px-4 rounded-4"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="mt-4 d-flex justify-content-center">
                        <Form.Check 
                            type="switch"
                            id="include-end-date"
                            label="Include end date (add 1 day)"
                            className="small fw-bold text-muted"
                            checked={includeEndDate}
                            onChange={(e) => setIncludeEndDate(e.target.checked)}
                        />
                    </div>
                </div>

                {results && (
                    <div className="animate-in">
                        <div className="result-hero">
                            <div className="result-number">{results.totalDays.toLocaleString()}</div>
                            <div className="result-label">Total Days</div>
                            {results.isReversed && (
                                <Badge bg="warning" text="dark" className="mt-3 rounded-pill px-3">
                                    Reverse Chronological Order
                                </Badge>
                            )}
                        </div>

                        <h6 className="fw-bold mb-3 small text-muted text-uppercase">Time Breakdown</h6>
                        <div className="breakdown-row">
                            <div className="stat-box">
                                <span className="stat-val">{results.years}</span>
                                <span className="stat-lab">Years</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-val">{results.months}</span>
                                <span className="stat-lab">Months</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-val">{results.days}</span>
                                <span className="stat-lab">Days</span>
                            </div>
                            <div className="stat-box" style={{ background: '#f0f9ff' }}>
                                <span className="stat-val text-primary">{results.weeks}</span>
                                <span className="stat-lab text-primary">Full Weeks</span>
                            </div>
                        </div>

                        <div className="mt-5">
                            <h6 className="fw-bold mb-3 small text-muted text-uppercase">Alternate Units</h6>
                            <Row className="g-3">
                                <Col sm={4}>
                                    <div className="stat-box py-3 bg-light border-0">
                                        <span className="fw-bold text-dark d-block mb-1">{results.totalHours.toLocaleString()}</span>
                                        <span className="extra-small text-muted text-uppercase fw-bold">Hours</span>
                                    </div>
                                </Col>
                                <Col sm={4}>
                                    <div className="stat-box py-3 bg-light border-0">
                                        <span className="fw-bold text-dark d-block mb-1">{results.totalMinutes.toLocaleString()}</span>
                                        <span className="extra-small text-muted text-uppercase fw-bold">Minutes</span>
                                    </div>
                                </Col>
                                <Col sm={4}>
                                    <div className="stat-box py-3 bg-light border-0">
                                        <span className="fw-bold text-dark d-block mb-1">{results.totalSeconds.toLocaleString()}</span>
                                        <span className="extra-small text-muted text-uppercase fw-bold">Seconds</span>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                )}
            </div>

            {/* Info Section */}
            <Card className="border-0 rounded-4 bg-light p-4 shadow-sm">
                <Row className="align-items-center g-4">
                    <Col md={1}>
                        <div className="text-center text-primary opacity-25">
                            <FaInfoCircle size={40} />
                        </div>
                    </Col>
                    <Col md={11}>
                        <h6 className="fw-bold mb-2">Precision Date Comparison</h6>
                        <p className="small text-muted mb-0">
                            This tool provides an exact count of the time elapsed between two specific dates. 
                            It is useful for project management, tracking milestones, or simply calculating how much 
                            time has passed since a significant event. You can choose to include the end date in the 
                            calculation if you want to count the entire duration of a span.
                        </p>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default DaysBetweenDates;
