import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Card, Button, Form, Badge, ProgressBar, Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { 
    FaPlus, FaCheck, FaFire, FaTrash, 
    FaChartLine, FaHistory, FaInfoCircle,
    FaDumbbell, FaBook, FaCode, FaCoffee, FaGlassWhiskey
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const HabitTracker = () => {
    // State
    const [habits, setHabits] = useState(() => {
        const saved = localStorage.getItem('webzen_habits');
        return saved ? JSON.parse(saved) : [];
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [newHabit, setNewHabit] = useState({ name: '', icon: 'FaDumbbell', color: '#6366f1' });

    // Icons Mapping
    const icons = {
        FaDumbbell: <FaDumbbell />,
        FaBook: <FaBook />,
        FaMeditation: <FaCode />, // Using FaCode as placeholder for meditation/focus
        FaCode: <FaCode />,
        FaCoffee: <FaCoffee />,
        FaGlassWhiskey: <FaGlassWhiskey />
    };

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('webzen_habits', JSON.stringify(habits));
    }, [habits]);

    // Helpers
    const getTodayStr = () => new Date().toISOString().split('T')[0];

    const toggleHabit = (id) => {
        const today = getTodayStr();
        setHabits(habits.map(h => {
            if (h.id === id) {
                const newHistory = { ...h.history };
                if (newHistory[today]) {
                    delete newHistory[today];
                } else {
                    newHistory[today] = true;
                }
                return { ...h, history: newHistory };
            }
            return h;
        }));
    };

    const deleteHabit = (id) => {
        if (window.confirm('Delete this habit and all its history?')) {
            setHabits(habits.filter(h => h.id !== id));
            toast.success('Habit deleted');
        }
    };

    const calculateStreak = (history) => {
        let streak = 0;
        let checkDate = new Date();
        
        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0];
            if (history[dateStr]) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                // If not today, maybe they just haven't checked it yet
                if (dateStr === getTodayStr()) {
                    checkDate.setDate(checkDate.getDate() - 1);
                    continue;
                }
                break;
            }
        }
        return streak;
    };

    const getCompletionRate = (history, createdAt) => {
        const start = new Date(createdAt);
        const today = new Date();
        const diffDays = Math.ceil((today - start) / (1000 * 60 * 60 * 24)) + 1;
        const completedCount = Object.keys(history).length;
        return Math.min(100, Math.round((completedCount / diffDays) * 100));
    };

    const handleAddHabit = () => {
        if (!newHabit.name.trim()) return;
        const habit = {
            id: Date.now(),
            ...newHabit,
            createdAt: new Date().toISOString(),
            history: {}
        };
        setHabits([...habits, habit]);
        setNewHabit({ name: '', icon: 'FaDumbbell', color: '#6366f1' });
        setShowAddModal(false);
        toast.success('Habit added!');
    };

    // Last 7 days view
    const last7Days = useMemo(() => {
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push({
                full: d.toISOString().split('T')[0],
                short: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
                day: d.getDate()
            });
        }
        return dates;
    }, []);

    return (
        <div className="habit-tracker-container py-4">
            <style>
                {`
                .habit-tracker-container {
                    animation: fadeIn 0.6s ease-out;
                    max-width: 1000px;
                    margin: 0 auto;
                    color: #1e293b;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .habit-card {
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    border-radius: 24px;
                    padding: 25px;
                    margin-bottom: 20px;
                    transition: all 0.3s;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.03);
                }

                .habit-card:hover {
                    box-shadow: 0 15px 35px rgba(0,0,0,0.06);
                    border-color: #6366f1;
                }

                .habit-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    color: white;
                    margin-right: 15px;
                }

                .day-circle {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: 2px solid #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.7rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .day-circle.completed {
                    background: #6366f1;
                    border-color: #6366f1;
                    color: white;
                }

                .day-circle.today {
                    border-color: #6366f1;
                    color: #6366f1;
                }

                .day-label {
                    font-size: 0.65rem;
                    font-weight: 700;
                    color: #94a3b8;
                    text-transform: uppercase;
                    margin-bottom: 5px;
                    text-align: center;
                }

                .streak-badge {
                    background: #fff7ed;
                    color: #f97316;
                    padding: 5px 12px;
                    border-radius: 100px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .icon-selector {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 10px;
                    margin-top: 10px;
                }

                .icon-option {
                    padding: 10px;
                    border: 2px solid #f1f5f9;
                    border-radius: 10px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: #64748b;
                }

                .icon-option.active {
                    border-color: #6366f1;
                    color: #6366f1;
                    background: #f5f3ff;
                }

                .progress-sm {
                    height: 6px;
                    border-radius: 100px;
                    margin-top: 15px;
                }

                .empty-state {
                    text-align: center;
                    padding: 80px 20px;
                    background: white;
                    border-radius: 32px;
                    border: 2px dashed #e2e8f0;
                }
                `}
            </style>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-0">Habit Tracker</h4>
                    <p className="text-muted small">Build consistency and track your streaks.</p>
                </div>
                <Button 
                    variant="primary" 
                    className="rounded-pill px-4 py-2 fw-bold shadow-sm"
                    onClick={() => setShowAddModal(true)}
                >
                    <FaPlus className="me-2" /> New Habit
                </Button>
            </div>

            {habits.length > 0 ? (
                <Row>
                    {habits.map(habit => {
                        const streak = calculateStreak(habit.history);
                        const rate = getCompletionRate(habit.history, habit.createdAt);
                        
                        return (
                            <Col key={habit.id} lg={12}>
                                <div className="habit-card">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="d-flex align-items-center">
                                            <div className="habit-icon" style={{ backgroundColor: habit.color }}>
                                                {icons[habit.icon]}
                                            </div>
                                            <div>
                                                <h6 className="fw-bold mb-1">{habit.name}</h6>
                                                <div className="d-flex gap-3">
                                                    <span className="streak-badge">
                                                        <FaFire /> {streak} Day Streak
                                                    </span>
                                                    <span className="small text-muted d-flex align-items-center">
                                                        <FaChartLine className="me-1" /> {rate}% Success
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex gap-4">
                                            <div className="d-flex gap-2">
                                                {last7Days.map(date => (
                                                    <div key={date.full} className="d-flex flex-column align-items-center">
                                                        <span className="day-label">{date.short}</span>
                                                        <div 
                                                            className={`day-circle ${habit.history[date.full] ? 'completed' : ''} ${date.full === getTodayStr() ? 'today' : ''}`}
                                                            onClick={() => date.full === getTodayStr() && toggleHabit(habit.id)}
                                                        >
                                                            {habit.history[date.full] ? <FaCheck size={10} /> : date.day}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <Button variant="link" className="p-0 text-danger ms-2" onClick={() => deleteHabit(habit.id)}>
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </div>
                                    <ProgressBar now={rate} variant="primary" className="progress-sm" />
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            ) : (
                <div className="empty-state">
                    <FaHistory size={50} className="text-muted opacity-25 mb-3" />
                    <h5 className="fw-bold">No Habits Yet</h5>
                    <p className="text-muted small mb-4">Start your journey by adding a habit you want to track daily.</p>
                    <Button variant="outline-primary" className="rounded-pill px-4" onClick={() => setShowAddModal(true)}>
                        <FaPlus className="me-2" /> Add My First Habit
                    </Button>
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
                        <h6 className="fw-bold mb-2">Building Better Habits</h6>
                        <p className="small text-muted mb-0">
                            Consistency is the key to mastering any new skill or routine. 
                            Use this tracker to visualize your progress, maintain your streaks, and celebrate your success rate. 
                            Your data is stored locally, ensuring your personal growth journey remains private and accessible only to you.
                        </p>
                    </Col>
                </Row>
            </Card>

            {/* Add Habit Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered contentClassName="border-0 rounded-4 shadow-lg">
                <Modal.Header closeButton className="border-0 px-4 pt-4">
                    <Modal.Title className="fw-bold fs-5">Create New Habit</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 pb-4">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted">Habit Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="e.g. Morning Meditation" 
                                className="bg-light border-0 py-2"
                                value={newHabit.name}
                                onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                            />
                        </Form.Group>

                        <Form.Label className="small fw-bold text-muted mb-2">Choose Icon</Form.Label>
                        <div className="icon-selector mb-3">
                            {Object.keys(icons).map(key => (
                                <div 
                                    key={key} 
                                    className={`icon-option ${newHabit.icon === key ? 'active' : ''}`}
                                    onClick={() => setNewHabit({...newHabit, icon: key})}
                                >
                                    {icons[key]}
                                </div>
                            ))}
                        </div>

                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold text-muted">Pick a Color</Form.Label>
                            <div className="d-flex gap-2">
                                {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'].map(c => (
                                    <div 
                                        key={c}
                                        onClick={() => setNewHabit({...newHabit, color: c})}
                                        style={{ 
                                            width: '30px', height: '30px', borderRadius: '50%', backgroundColor: c, 
                                            cursor: 'pointer', border: newHabit.color === c ? '3px solid #e2e8f0' : 'none'
                                        }}
                                    />
                                ))}
                            </div>
                        </Form.Group>

                        <Button variant="primary" className="w-100 rounded-pill py-2 fw-bold" onClick={handleAddHabit}>
                            Create Habit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default HabitTracker;
