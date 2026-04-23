import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Row, Col, Button, Table, Badge, Card } from 'react-bootstrap';
import { 
    FaPlay, FaPause, FaStop, FaUndo, FaFlag, FaHistory, 
    FaClock, FaChevronRight, FaTrophy, FaTrash,
    FaInfoCircle
} from 'react-icons/fa';

const Stopwatch = () => {
    // State
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState([]);
    
    const intervalRef = useRef(null);
    const startTimeRef = useRef(0);

    // Timer Logic
    const startTimer = useCallback(() => {
        if (isRunning) return;
        
        setIsRunning(true);
        startTimeRef.current = Date.now() - time;
        
        intervalRef.current = setInterval(() => {
            setTime(Date.now() - startTimeRef.current);
        }, 10);
    }, [isRunning, time]);

    const stopTimer = useCallback(() => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
    }, []);

    const resetTimer = useCallback(() => {
        stopTimer();
        setTime(0);
        setLaps([]);
    }, [stopTimer]);

    const handleLap = useCallback(() => {
        if (!isRunning) return;
        
        const lapTime = time;
        const lastLapTime = laps.length > 0 ? laps[0].totalTime : 0;
        const splitTime = lapTime - lastLapTime;
        
        setLaps([{
            id: Date.now(),
            lap: laps.length + 1,
            splitTime,
            totalTime: lapTime
        }, ...laps]);
    }, [isRunning, time, laps]);

    // Formatting
    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const centiseconds = Math.floor((ms % 1000) / 10);
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    };

    // Cleanup
    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    const getFastestLap = () => {
        if (laps.length === 0) return null;
        return [...laps].sort((a, b) => a.splitTime - b.splitTime)[0].id;
    };

    const getSlowestLap = () => {
        if (laps.length < 2) return null;
        return [...laps].sort((a, b) => b.splitTime - a.splitTime)[0].id;
    };

    return (
        <div className="stopwatch-container py-4">
            <style>
                {`
                .stopwatch-container {
                    animation: fadeIn 0.6s ease-out;
                    max-width: 900px;
                    margin: 0 auto;
                    color: #1e293b;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .timer-card {
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    border-radius: 32px;
                    padding: 60px 40px;
                    text-align: center;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
                    margin-bottom: 30px;
                    position: relative;
                    overflow: hidden;
                }

                .timer-display {
                    font-size: 8rem;
                    font-weight: 800;
                    font-family: 'JetBrains Mono', monospace;
                    color: #1e293b;
                    margin-bottom: 40px;
                    line-height: 1;
                    letter-spacing: -2px;
                }

                .controls {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    align-items: center;
                }

                .btn-circle {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    border: none;
                    background: #f1f5f9;
                    color: #64748b;
                }

                .btn-circle:hover {
                    transform: translateY(-3px);
                    background: #e2e8f0;
                    color: #1e293b;
                }

                .btn-primary-custom {
                    width: 80px;
                    height: 80px;
                    background: #6366f1;
                    color: white;
                    font-size: 1.5rem;
                    box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
                }

                .btn-primary-custom:hover {
                    background: #4f46e5;
                    box-shadow: 0 15px 25px rgba(99, 102, 241, 0.4);
                    color: white;
                }

                .lap-container {
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    border-radius: 24px;
                    padding: 30px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.03);
                }

                .lap-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    border-radius: 12px;
                    margin-bottom: 10px;
                    background: #f8fafc;
                    transition: all 0.2s;
                }

                .lap-item:hover {
                    background: #f1f5f9;
                }

                .fastest { background: #ecfdf5 !important; color: #059669 !important; border: 1px solid #10b981; }
                .slowest { background: #fef2f2 !important; color: #dc2626 !important; border: 1px solid #ef4444; }

                .lap-number { font-weight: 700; width: 60px; }
                .lap-split { font-family: 'JetBrains Mono', monospace; flex-grow: 1; text-align: center; font-weight: 600; }
                .lap-total { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #6366f1; }

                @media (max-width: 768px) {
                    .timer-display { font-size: 4rem; }
                    .timer-card { padding: 40px 20px; }
                }
                `}
            </style>

            <div className="timer-card shadow-lg">
                <div className="d-flex justify-content-center mb-4">
                    <Badge bg="primary" className="rounded-pill px-3 py-2 opacity-75">
                        <FaClock className="me-2" /> Precision Stopwatch
                    </Badge>
                </div>
                
                <div className="timer-display">
                    {formatTime(time)}
                </div>

                <div className="controls">
                    <button className="btn-circle" onClick={resetTimer} title="Reset">
                        <FaUndo />
                    </button>
                    
                    <button 
                        className="btn-circle btn-primary-custom" 
                        onClick={isRunning ? stopTimer : startTimer}
                    >
                        {isRunning ? <FaPause /> : <FaPlay style={{ marginLeft: '4px' }} />}
                    </button>

                    <button className="btn-circle" onClick={handleLap} disabled={!isRunning} title="Lap">
                        <FaFlag />
                    </button>
                </div>
            </div>

            {laps.length > 0 && (
                <div className="lap-container animate-in">
                    <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                        <h6 className="fw-bold m-0 d-flex align-items-center">
                            <FaHistory className="me-2 text-primary" /> Laps Record
                        </h6>
                        <Badge bg="light" text="dark" className="rounded-pill px-3 py-2 border">
                            {laps.length} Laps Recorded
                        </Badge>
                    </div>

                    <div className="lap-list">
                        {laps.map((lap) => (
                            <div 
                                key={lap.id} 
                                className={`lap-item ${lap.id === getFastestLap() ? 'fastest' : ''} ${lap.id === getSlowestLap() ? 'slowest' : ''}`}
                            >
                                <div className="lap-number">Lap {lap.lap}</div>
                                <div className="lap-split">
                                    {lap.id === getFastestLap() && <FaTrophy className="me-2" />}
                                    +{formatTime(lap.splitTime)}
                                </div>
                                <div className="lap-total">{formatTime(lap.totalTime)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Info Section */}
            <Card className="mt-5 border-0 rounded-4 bg-light p-4 shadow-sm">
                <Row className="align-items-center g-4">
                    <Col md={1}>
                        <div className="text-center text-primary opacity-25">
                            <FaInfoCircle size={40} />
                        </div>
                    </Col>
                    <Col md={11}>
                        <h6 className="fw-bold mb-2">High-Precision Stopwatch</h6>
                        <p className="small text-muted mb-0">
                            A highly accurate digital stopwatch designed for measuring time intervals with centisecond precision. 
                            Features a lap tracking system that records split times and total elapsed time, 
                            automatically highlighting your fastest and slowest laps for quick analysis. 
                            Ideal for sports, cooking, study sessions, or any task requiring precise time tracking.
                        </p>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default Stopwatch;
