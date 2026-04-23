import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Button, Form, Card, Badge, ProgressBar } from 'react-bootstrap';
import { 
    FaCalendarAlt, FaBirthdayCake, FaClock, FaHourglassHalf, 
    FaStar, FaBaby, FaArrowRight, FaHistory, FaInfoCircle, FaShareAlt
} from 'react-icons/fa';

const AgeCalculator = () => {
    // State
    const [dob, setDob] = useState('2000-01-01');
    const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
    const [results, setResults] = useState(null);

    // Calculate Age
    const calculateAge = () => {
        const birthDate = new Date(dob);
        const today = new Date(targetDate);

        if (birthDate > today) {
            setResults(null);
            return;
        }

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += lastMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        // Total Statistics
        const diffTime = Math.abs(today - birthDate);
        const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = (years * 12) + months;
        const totalHours = totalDays * 24;
        const totalMinutes = totalHours * 60;

        // Next Birthday
        const nextBdayYear = today.getMonth() > birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate()) 
                            ? today.getFullYear() + 1 
                            : today.getFullYear();
        const nextBday = new Date(nextBdayYear, birthDate.getMonth(), birthDate.getDate());
        const daysToNextBday = Math.ceil((nextBday - today) / (1000 * 60 * 60 * 24));

        // Zodiac (Simplified)
        const getZodiac = (d, m) => {
            const signs = ["Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"];
            const last_days = [19, 18, 20, 19, 20, 20, 22, 22, 22, 22, 21, 21];
            return (d > last_days[m]) ? signs[(m + 1) % 12] : signs[m];
        };
        const zodiac = getZodiac(birthDate.getDate(), birthDate.getMonth());

        setResults({
            years, months, days,
            totalDays, totalWeeks, totalMonths, totalHours, totalMinutes,
            daysToNextBday,
            zodiac
        });
    };

    useEffect(() => {
        calculateAge();
    }, [dob, targetDate]);

    return (
        <div className="age-calculator-container py-4">
            <style>
                {`
                .age-calculator-container {
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

                .date-input-group {
                    background: #f8fafc;
                    border-radius: 16px;
                    padding: 25px;
                    border: 1px solid #f1f5f9;
                }

                .age-display {
                    text-align: center;
                    padding: 40px 0;
                    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                    border-radius: 24px;
                    margin: 30px 0;
                    border: 1px solid #bae6fd;
                }

                .age-number {
                    font-size: 5rem;
                    font-weight: 800;
                    color: #0369a1;
                    line-height: 1;
                    margin-bottom: 10px;
                }

                .age-label {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #0c4a6e;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }

                .stat-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    gap: 15px;
                    margin-top: 20px;
                }

                .stat-card {
                    background: #ffffff;
                    border: 1px solid #f1f5f9;
                    border-radius: 16px;
                    padding: 20px;
                    text-align: center;
                    transition: all 0.3s;
                }

                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                    border-color: #0369a1;
                }

                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #0369a1;
                    display: block;
                }

                .stat-title {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                }

                .next-bday-card {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                    border-radius: 20px;
                    padding: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    box-shadow: 0 15px 30px rgba(99, 102, 241, 0.2);
                }

                .bday-days {
                    font-size: 2.5rem;
                    font-weight: 800;
                }

                @media (max-width: 768px) {
                    .age-number { font-size: 3.5rem; }
                    .next-bday-card { flex-direction: column; text-align: center; gap: 20px; }
                }
                `}
            </style>

            <div className="premium-card">
                <h5 className="fw-bold mb-4 d-flex align-items-center">
                    <FaBaby className="text-primary me-2" /> Age Calculator
                </h5>

                <Row className="g-4">
                    <Col md={6}>
                        <div className="date-input-group h-100">
                            <label className="small fw-bold text-muted text-uppercase mb-2 d-flex align-items-center">
                                <FaCalendarAlt className="me-2" /> Date of Birth
                            </label>
                            <Form.Control 
                                type="date" 
                                className="bg-white border-0 shadow-sm py-3 px-4 rounded-4"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                            />
                            <p className="extra-small text-muted mt-2 mb-0">Select your birthday to calculate your exact age.</p>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="date-input-group h-100">
                            <label className="small fw-bold text-muted text-uppercase mb-2 d-flex align-items-center">
                                <FaHourglassHalf className="me-2" /> Age at the Date of
                            </label>
                            <Form.Control 
                                type="date" 
                                className="bg-white border-0 shadow-sm py-3 px-4 rounded-4"
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                            />
                            <p className="extra-small text-muted mt-2 mb-0">Defaulted to today. Change to calculate age in the future or past.</p>
                        </div>
                    </Col>
                </Row>

                {results ? (
                    <div className="animate-in">
                        <div className="age-display">
                            <div className="age-number">{results.years}</div>
                            <div className="age-label">Years Old</div>
                            <div className="mt-3 fs-5 fw-bold text-secondary">
                                {results.months} Months | {results.days} Days
                            </div>
                        </div>

                        <Row className="g-4 mb-4">
                            <Col lg={8}>
                                <h6 className="fw-bold mb-3 small text-muted text-uppercase">Cumulative Statistics</h6>
                                <div className="stat-grid">
                                    <div className="stat-card">
                                        <span className="stat-value">{results.totalMonths.toLocaleString()}</span>
                                        <span className="stat-title">Months</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-value">{results.totalWeeks.toLocaleString()}</span>
                                        <span className="stat-title">Weeks</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-value">{results.totalDays.toLocaleString()}</span>
                                        <span className="stat-title">Days</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-value">{results.totalHours.toLocaleString()}</span>
                                        <span className="stat-title">Hours</span>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <h6 className="fw-bold mb-3 small text-muted text-uppercase">Fun Facts</h6>
                                <div className="stat-card h-100 d-flex flex-column justify-content-center">
                                    <FaStar className="text-warning mb-2 fs-4 mx-auto" />
                                    <span className="stat-value fs-4">{results.zodiac}</span>
                                    <span className="stat-title">Zodiac Sign</span>
                                </div>
                            </Col>
                        </Row>

                        <div className="next-bday-card">
                            <div>
                                <h5 className="fw-bold mb-1 d-flex align-items-center">
                                    <FaBirthdayCake className="me-2" /> Next Birthday
                                </h5>
                                <p className="mb-0 opacity-75">Prepare for the celebration!</p>
                            </div>
                            <div className="text-end">
                                <div className="bday-days">{results.daysToNextBday}</div>
                                <div className="fw-bold text-uppercase small opacity-75">Days to go</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <FaInfoCircle size={40} className="text-muted opacity-25 mb-3" />
                        <h6 className="text-muted">Please select a valid Date of Birth.</h6>
                    </div>
                )}
            </div>

            {/* Info Section */}
            <Card className="border-0 rounded-4 bg-light p-4 shadow-sm">
                <Row className="align-items-center g-4">
                    <Col md={1}>
                        <div className="text-center text-primary opacity-25">
                            <FaHistory size={40} />
                        </div>
                    </Col>
                    <Col md={11}>
                        <h6 className="fw-bold mb-2">How is age calculated?</h6>
                        <p className="small text-muted mb-0">
                            Age is calculated by determining the difference between the given date of birth and a target date. 
                            Our tool accounts for leap years and the varying number of days in each month to provide the most 
                            accurate result in years, months, and days. It also calculates cumulative statistics like total 
                            days, weeks, and hours lived.
                        </p>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default AgeCalculator;
