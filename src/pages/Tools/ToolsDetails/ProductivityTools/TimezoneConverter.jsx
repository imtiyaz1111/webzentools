import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Button, Form, Card, Badge, InputGroup, ListGroup } from 'react-bootstrap';
import { 
    FaGlobeAmericas, FaPlus, FaTrash, FaSync, FaClock, FaCalendarAlt,
    FaSun, FaMoon, FaSearch, FaHistory, FaMapMarkerAlt, FaRegClock
} from 'react-icons/fa';

const TimezoneConverter = () => {
    // State
    const [baseTime, setBaseTime] = useState(new Date());
    const [selectedTimezones, setSelectedTimezones] = useState(() => {
        const saved = localStorage.getItem('webzen_timezones');
        return saved ? JSON.parse(saved) : [Intl.DateTimeFormat().resolvedOptions().timeZone];
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [is24Hour, setIs24Hour] = useState(false);

    // List of all timezones
    const allTimezones = useMemo(() => {
        try {
            return Intl.supportedValuesOf('timeZone');
        } catch (e) {
            // Fallback for older browsers
            return ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Kolkata', 'Australia/Sydney'];
        }
    }, []);

    const filteredTimezones = useMemo(() => {
        if (!searchQuery) return [];
        return allTimezones
            .filter(tz => tz.toLowerCase().includes(searchQuery.toLowerCase()))
            .slice(0, 10);
    }, [searchQuery, allTimezones]);

    // Update base time every minute if it's currently "now"
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            // Only auto-update if the user hasn't manually adjusted the time much (within 5 seconds of real now)
            if (Math.abs(now - baseTime) < 5000) {
                setBaseTime(now);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [baseTime]);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('webzen_timezones', JSON.stringify(selectedTimezones));
    }, [selectedTimezones]);

    // Helpers
    const formatTime = (date, timezone) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: !is24Hour,
            timeZone: timezone
        }).format(date);
    };

    const formatDate = (date, timezone) => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            timeZone: timezone
        }).format(date);
    };

    const getDayNightIcon = (date, timezone) => {
        const hour = parseInt(new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            hour12: false,
            timeZone: timezone
        }).format(date));
        
        if (hour >= 6 && hour < 18) return <FaSun className="text-warning" />;
        return <FaMoon className="text-primary" />;
    };

    const handleAddTimezone = (tz) => {
        if (!selectedTimezones.includes(tz)) {
            setSelectedTimezones([...selectedTimezones, tz]);
        }
        setSearchQuery('');
    };

    const handleRemoveTimezone = (tz) => {
        setSelectedTimezones(selectedTimezones.filter(item => item !== tz));
    };

    const handleTimeChange = (e) => {
        const [hours, minutes] = e.target.value.split(':');
        const newDate = new Date(baseTime);
        newDate.setHours(parseInt(hours));
        newDate.setMinutes(parseInt(minutes));
        setBaseTime(newDate);
    };

    const resetToNow = () => setBaseTime(new Date());

    return (
        <div className="timezone-container py-4">
            <style>
                {`
                .timezone-container {
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
                    padding: 30px;
                    margin-bottom: 30px;
                }

                .base-time-card {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                    border: none;
                    border-radius: 24px;
                    padding: 40px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(99, 102, 241, 0.2);
                }

                .base-time-card::before {
                    content: '';
                    position: absolute;
                    top: -50%; left: -50%; width: 200%; height: 200%;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                }

                .base-clock {
                    font-size: 5rem;
                    font-weight: 800;
                    font-family: 'Inter', sans-serif;
                    letter-spacing: -2px;
                    line-height: 1;
                    margin-bottom: 10px;
                }

                .timezone-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 30px;
                }

                .tz-card {
                    background: #ffffff;
                    border: 1px solid #f1f5f9;
                    border-radius: 20px;
                    padding: 20px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .tz-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                    border-color: #6366f1;
                }

                .tz-info h6 {
                    font-weight: 700;
                    margin-bottom: 4px;
                    color: #0f172a;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .tz-time {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #6366f1;
                }

                .tz-date {
                    font-size: 0.8rem;
                    color: #94a3b8;
                    font-weight: 500;
                }

                .search-container {
                    position: relative;
                    max-width: 500px;
                    margin: 0 auto 40px;
                }

                .search-results {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    margin-top: 10px;
                    max-height: 300px;
                    overflow-y: auto;
                    border: 1px solid #f1f5f9;
                }

                .search-item {
                    padding: 12px 20px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border-bottom: 1px solid #f1f5f9;
                }

                .search-item:hover {
                    background: #f8fafc;
                    color: #6366f1;
                }

                .control-bar {
                    background: #f8fafc;
                    border-radius: 100px;
                    padding: 10px 25px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 30px;
                    border: 1px solid #f1f5f9;
                }

                .time-input {
                    background: transparent;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 5px 12px;
                    font-weight: 600;
                    color: #1e293b;
                    outline: none;
                }

                @media (max-width: 768px) {
                    .base-clock { font-size: 3.5rem; }
                    .timezone-grid { grid-template-columns: 1fr; }
                }
                `}
            </style>

            {/* Main Base Time Display */}
            <div className="base-time-card mb-5">
                <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                    <Badge bg="white" text="primary" className="rounded-pill px-3 py-2">
                        <FaMapMarkerAlt className="me-2" /> Current Reference Time
                    </Badge>
                </div>
                <div className="base-clock">
                    {formatTime(baseTime, Intl.DateTimeFormat().resolvedOptions().timeZone)}
                </div>
                <div className="fs-5 opacity-75 fw-medium">
                    {formatDate(baseTime, Intl.DateTimeFormat().resolvedOptions().timeZone)}
                </div>
                <div className="mt-4 d-flex justify-content-center gap-3">
                    <Button variant="light" className="rounded-pill px-4 fw-bold shadow-sm" onClick={resetToNow}>
                        <FaSync className="me-2" /> Reset to Now
                    </Button>
                </div>
            </div>

            {/* Controls and Search */}
            <div className="search-container">
                <InputGroup className="shadow-sm rounded-pill overflow-hidden border-0">
                    <InputGroup.Text className="bg-white border-0 ps-4">
                        <FaSearch className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control 
                        placeholder="Search for a city or timezone (e.g. New York, Tokyo)..." 
                        className="border-0 py-3"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </InputGroup>
                {filteredTimezones.length > 0 && (
                    <div className="search-results">
                        {filteredTimezones.map(tz => (
                            <div key={tz} className="search-item" onClick={() => handleAddTimezone(tz)}>
                                <FaGlobeAmericas className="me-3 opacity-50" /> {tz}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="control-bar shadow-sm">
                <div className="d-flex align-items-center gap-3">
                    <span className="small fw-bold text-muted text-uppercase">Adjust Time:</span>
                    <input 
                        type="time" 
                        className="time-input"
                        value={`${baseTime.getHours().toString().padStart(2, '0')}:${baseTime.getMinutes().toString().padStart(2, '0')}`}
                        onChange={handleTimeChange}
                    />
                </div>
                <div className="d-flex align-items-center gap-4">
                    <Form.Check 
                        type="switch"
                        id="format-switch"
                        label="24-Hour Format"
                        className="small fw-bold text-muted"
                        checked={is24Hour}
                        onChange={(e) => setIs24Hour(e.target.checked)}
                    />
                </div>
            </div>

            {/* Timezone Cards */}
            <h5 className="fw-bold mb-4 d-flex align-items-center">
                <FaClock className="text-primary me-2" /> Comparison List
            </h5>
            <div className="timezone-grid">
                {selectedTimezones.map((tz, index) => (
                    <div key={index} className="tz-card shadow-sm">
                        <div className="tz-info">
                            <h6>
                                {getDayNightIcon(baseTime, tz)}
                                {tz.split('/').pop().replace('_', ' ')}
                            </h6>
                            <div className="tz-date">{formatDate(baseTime, tz)}</div>
                            <div className="extra-small text-muted mt-1">{tz}</div>
                        </div>
                        <div className="text-end">
                            <div className="tz-time">{formatTime(baseTime, tz).split(' ')[0]} <small className="fs-6 opacity-50">{formatTime(baseTime, tz).split(' ')[1]}</small></div>
                            <Button 
                                variant="link" 
                                className="p-0 text-danger small mt-1 opacity-50 hover-opacity-100"
                                onClick={() => handleRemoveTimezone(tz)}
                                disabled={selectedTimezones.length === 1}
                            >
                                <FaTrash size={12} /> Remove
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Comparison Info */}
            <Card className="mt-5 border-0 rounded-4 bg-light p-4">
                <Row className="align-items-center g-4">
                    <Col md={1}>
                        <div className="text-center">
                            <FaHistory size={40} className="text-primary opacity-25" />
                        </div>
                    </Col>
                    <Col md={11}>
                        <h6 className="fw-bold mb-2">Global Time Synchronization</h6>
                        <p className="small text-muted mb-0">
                            Use this tool to plan international meetings or track times across different continents. 
                            The tool automatically accounts for Daylight Saving Time (DST) changes based on the selected region. 
                            Select any city to add it to your tracking list and adjust the reference clock to see how time shifts globally.
                        </p>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default TimezoneConverter;
