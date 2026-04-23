import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Col, Button, Form, ProgressBar, Modal, Tab, Nav, Badge, Card } from 'react-bootstrap';
import { 
    FaPlay, FaPause, FaUndo, FaStepForward, FaCog, FaHistory, 
    FaKeyboard, FaVolumeUp, FaVolumeMute, FaBell, FaInfoCircle,
    FaCheckCircle, FaLaptopCode, FaCoffee, FaBed
} from 'react-icons/fa';

const PomodoroTimer = () => {
    // Timer Settings
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('pomodoroSettings');
        return saved ? JSON.parse(saved) : {
            pomodoro: 25,
            shortBreak: 5,
            longBreak: 15,
            autoStartBreaks: false,
            autoStartPomodoros: false,
            soundEnabled: true,
            volume: 0.5
        };
    });

    // Timer State
    const [timeLeft, setTimeLeft] = useState(settings.pomodoro * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('pomodoro'); // 'pomodoro', 'shortBreak', 'longBreak'
    const [sessions, setSessions] = useState(0);
    const [task, setTask] = useState('');
    const [showSettings, setShowSettings] = useState(false);

    const timerRef = useRef(null);
    const audioRef = useRef(null);

    // Audio context for notification
    useEffect(() => {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audioRef.current.volume = settings.volume;
    }, [settings.volume]);

    // Save settings to localStorage
    useEffect(() => {
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    }, [settings]);

    // Handle Timer Countdown
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleTimerComplete();
        }

        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft]);

    // Update Document Title
    useEffect(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const status = mode === 'pomodoro' ? 'Focus' : 'Break';
        document.title = `${timeStr} - ${status} | WebzenTools`;
        
        return () => {
            document.title = 'WebzenTools - All in One Online Tools';
        };
    }, [timeLeft, mode]);

    const handleTimerComplete = useCallback(() => {
        setIsActive(false);
        if (settings.soundEnabled && audioRef.current) {
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }

        if (mode === 'pomodoro') {
            setSessions(prev => prev + 1);
            if (sessions > 0 && (sessions + 1) % 4 === 0) {
                switchMode('longBreak');
            } else {
                switchMode('shortBreak');
            }
            if (settings.autoStartBreaks) setIsActive(true);
        } else {
            switchMode('pomodoro');
            if (settings.autoStartPomodoros) setIsActive(true);
        }
    }, [mode, sessions, settings]);

    const switchMode = (newMode) => {
        setIsActive(false);
        setMode(newMode);
        const durations = {
            pomodoro: settings.pomodoro,
            shortBreak: settings.shortBreak,
            longBreak: settings.longBreak
        };
        setTimeLeft(durations[newMode] * 60);
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        const durations = {
            pomodoro: settings.pomodoro,
            shortBreak: settings.shortBreak,
            longBreak: settings.longBreak
        };
        setTimeLeft(durations[mode] * 60);
    };

    const skipSession = () => {
        handleTimerComplete();
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const getProgress = () => {
        const total = {
            pomodoro: settings.pomodoro,
            shortBreak: settings.shortBreak,
            longBreak: settings.longBreak
        }[mode] * 60;
        return ((total - timeLeft) / total) * 100;
    };

    const getThemeColor = () => {
        switch (mode) {
            case 'pomodoro': return '#ff4d4d';
            case 'shortBreak': return '#4db8ff';
            case 'longBreak': return '#4dff88';
            default: return '#6366f1';
        }
    };

    return (
        <div className="pomodoro-container py-4">
            <style>
                {`
                .pomodoro-container {
                    animation: fadeIn 0.6s ease-out;
                    max-width: 900px;
                    margin: 0 auto;
                    color: #1e293b;
                }

                .timer-card {
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    border-radius: 32px;
                    padding: 40px;
                    text-align: center;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .timer-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; height: 6px;
                    background: ${getThemeColor()};
                    transition: background 0.5s;
                }

                .mode-nav {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-bottom: 40px;
                    background: #f1f5f9;
                    padding: 6px;
                    border-radius: 100px;
                    width: fit-content;
                    margin-left: auto;
                    margin-right: auto;
                }

                .mode-btn {
                    padding: 8px 20px;
                    border-radius: 100px;
                    border: none;
                    background: transparent;
                    color: #64748b;
                    font-weight: 600;
                    transition: all 0.3s;
                    font-size: 0.9rem;
                }

                .mode-btn.active {
                    background: ${getThemeColor()};
                    color: white;
                    box-shadow: 0 4px 12px ${getThemeColor()}33;
                }

                .timer-display {
                    font-size: 8rem;
                    font-weight: 800;
                    font-family: 'Inter', system-ui, sans-serif;
                    color: #1e293b;
                    margin: 20px 0;
                    line-height: 1;
                    letter-spacing: -4px;
                }

                .timer-controls {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 20px;
                    margin-top: 30px;
                }

                .play-btn {
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.3rem;
                    background: ${getThemeColor()};
                    color: white;
                    border: none;
                    box-shadow: 0 8px 20px ${getThemeColor()}33;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .play-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 12px 25px ${getThemeColor()}44;
                }

                .secondary-btn {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: #f1f5f9;
                    color: #64748b;
                    border: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }

                .secondary-btn:hover {
                    background: #e2e8f0;
                    color: #1e293b;
                    transform: translateY(-2px);
                }

                .task-input-container {
                    margin-top: 20px;
                    max-width: 350px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .task-input {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    color: #1e293b;
                    text-align: center;
                    padding: 10px;
                    transition: all 0.3s;
                    font-weight: 500;
                }

                .task-input:focus {
                    background: #ffffff;
                    border-color: ${getThemeColor()};
                    box-shadow: 0 0 0 3px ${getThemeColor()}11;
                }

                .stats-pill {
                    background: #f1f5f9;
                    padding: 10px 20px;
                    border-radius: 100px;
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 30px;
                    color: #64748b;
                    font-weight: 500;
                    border: 1px solid #e2e8f0;
                    font-size: 0.9rem;
                }

                .progress-ring {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-90deg);
                    width: 440px;
                    height: 440px;
                    pointer-events: none;
                    opacity: 0.05;
                }

                .progress-ring circle {
                    fill: transparent;
                    stroke: #000;
                    stroke-width: 8;
                    stroke-dasharray: 1256;
                    stroke-dashoffset: ${1256 - (1256 * getProgress()) / 100};
                    transition: stroke-dashoffset 1s linear;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 768px) {
                    .timer-display { font-size: 5rem; }
                    .timer-card { padding: 30px 20px; }
                    .progress-ring { width: 300px; height: 300px; }
                }
                `}
            </style>

            <div className="timer-card mb-4">
                <svg className="progress-ring d-none d-md-block">
                    <circle cx="210" cy="210" r="200" />
                </svg>

                <div className="mode-nav shadow-sm">
                    <button 
                        className={`mode-btn ${mode === 'pomodoro' ? 'active' : ''}`}
                        onClick={() => switchMode('pomodoro')}
                    >
                        <FaLaptopCode className="me-2" /> Pomodoro
                    </button>
                    <button 
                        className={`mode-btn ${mode === 'shortBreak' ? 'active' : ''}`}
                        onClick={() => switchMode('shortBreak')}
                    >
                        <FaCoffee className="me-2" /> Short Break
                    </button>
                    <button 
                        className={`mode-btn ${mode === 'longBreak' ? 'active' : ''}`}
                        onClick={() => switchMode('longBreak')}
                    >
                        <FaBed className="me-2" /> Long Break
                    </button>
                </div>

                <div className="timer-display">
                    {formatTime(timeLeft)}
                </div>

                <div className="task-input-container">
                    <Form.Control 
                        type="text" 
                        className="task-input" 
                        placeholder={isActive ? "Keep going!" : "What are you working on?"}
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                    />
                </div>

                <div className="timer-controls">
                    <button className="secondary-btn" onClick={() => setShowSettings(true)} title="Settings">
                        <FaCog />
                    </button>
                    
                    <button className="play-btn" onClick={toggleTimer}>
                        {isActive ? <FaPause /> : <FaPlay style={{ marginLeft: '4px' }} />}
                    </button>

                    <button className="secondary-btn" onClick={resetTimer} title="Reset">
                        <FaUndo />
                    </button>
                    
                    <button className="secondary-btn" onClick={skipSession} title="Skip">
                        <FaStepForward />
                    </button>
                </div>

                <div className="stats-pill">
                    <FaHistory className="text-muted" />
                    <span>Sessions completed: <strong className="text-white">{sessions}</strong></span>
                </div>
            </div>

            {/* Info Section */}
            <Row className="g-4 mt-2">
                <Col md={6}>
                    <Card className="h-100 bg-white border border-light-subtle rounded-4 shadow-sm p-4">
                        <h5 className="fw-bold mb-3 d-flex align-items-center text-dark">
                            <FaInfoCircle className="me-2 text-info" /> The Pomodoro Technique
                        </h5>
                        <p className="small text-muted mb-0">
                            A time management method developed by Francesco Cirillo in the late 1980s. 
                            It uses a timer to break work into intervals, traditionally 25 minutes in length, 
                            separated by short breaks. This helps improve focus and mental agility.
                        </p>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="h-100 bg-white border border-light-subtle rounded-4 shadow-sm p-4">
                        <h5 className="fw-bold mb-3 d-flex align-items-center text-dark">
                            <FaCheckCircle className="me-2 text-success" /> How to use?
                        </h5>
                        <ol className="small text-muted ps-3 mb-0">
                            <li>Choose a task you want to get done.</li>
                            <li>Set the Pomodoro timer (default 25 min).</li>
                            <li>Work on the task until the timer rings.</li>
                            <li>Take a short break (5 min).</li>
                            <li>Every 4 pomodoros, take a longer break.</li>
                        </ol>
                    </Card>
                </Col>
            </Row>

            {/* Settings Modal */}
            <Modal 
                show={showSettings} 
                onHide={() => setShowSettings(false)} 
                centered 
                contentClassName="bg-white text-dark border-0 rounded-4 shadow-lg"
            >
                <Modal.Header closeButton className="border-0 px-4 pt-4">
                    <Modal.Title className="fw-bold fs-5 d-flex align-items-center">
                        <FaCog className="me-2 text-primary" /> Timer Settings
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form>
                        <h6 className="small fw-bold text-uppercase text-muted mb-3">Time (Minutes)</h6>
                        <Row className="mb-4">
                            <Col xs={4}>
                                <Form.Label className="extra-small text-muted">Pomodoro</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    size="sm" 
                                    className="bg-light border-0"
                                    value={settings.pomodoro}
                                    onChange={(e) => setSettings({...settings, pomodoro: parseInt(e.target.value) || 1})}
                                />
                            </Col>
                            <Col xs={4}>
                                <Form.Label className="extra-small text-muted">Short Break</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    size="sm" 
                                    className="bg-light border-0"
                                    value={settings.shortBreak}
                                    onChange={(e) => setSettings({...settings, shortBreak: parseInt(e.target.value) || 1})}
                                />
                            </Col>
                            <Col xs={4}>
                                <Form.Label className="extra-small text-muted">Long Break</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    size="sm" 
                                    className="bg-light border-0"
                                    value={settings.longBreak}
                                    onChange={(e) => setSettings({...settings, longBreak: parseInt(e.target.value) || 1})}
                                />
                            </Col>
                        </Row>

                        <h6 className="small fw-bold text-uppercase text-muted mb-3">Automation</h6>
                        <Form.Check 
                            type="switch"
                            label="Auto-start Breaks"
                            className="mb-2 small"
                            checked={settings.autoStartBreaks}
                            onChange={(e) => setSettings({...settings, autoStartBreaks: e.target.checked})}
                        />
                        <Form.Check 
                            type="switch"
                            label="Auto-start Pomodoros"
                            className="mb-4 small"
                            checked={settings.autoStartPomodoros}
                            onChange={(e) => setSettings({...settings, autoStartPomodoros: e.target.checked})}
                        />

                        <h6 className="small fw-bold text-uppercase text-muted mb-3">Sound</h6>
                        <div className="d-flex align-items-center gap-3">
                            {settings.soundEnabled ? <FaVolumeUp className="text-primary" /> : <FaVolumeMute className="text-muted" />}
                            <Form.Range 
                                value={settings.volume * 100} 
                                onChange={(e) => setSettings({...settings, volume: e.target.value / 100})}
                                className="flex-grow-1"
                            />
                            <Form.Check 
                                type="switch"
                                checked={settings.soundEnabled}
                                onChange={(e) => setSettings({...settings, soundEnabled: e.target.checked})}
                            />
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0 px-4 pb-4 pt-0">
                    <Button variant="primary" className="rounded-pill px-4 w-100 py-2 fw-bold" onClick={() => {
                        setShowSettings(false);
                        resetTimer();
                    }}>
                        Apply Settings
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PomodoroTimer;
