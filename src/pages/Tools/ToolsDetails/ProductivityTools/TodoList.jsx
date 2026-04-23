import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Button, Form, Card, Badge, Modal, ProgressBar, InputGroup, Dropdown } from 'react-bootstrap';
import { 
    FaPlus, FaTrash, FaEdit, FaCheck, FaTimes, FaSearch, FaFilter,
    FaCalendarAlt, FaFlag, FaTags, FaEllipsisV, FaCheckCircle,
    FaRegCircle, FaExclamationTriangle, FaListUl, FaBriefcase, FaHome, FaShoppingCart
} from 'react-icons/fa';

const TodoList = () => {
    // Tasks State
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('webzenTodoTasks');
        return saved ? JSON.parse(saved) : [];
    });

    // UI State
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, pending, completed
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');

    // New Task State
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        category: 'Work',
        priority: 'Medium',
        dueDate: new Date().toISOString().split('T')[0],
        completed: false
    });

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('webzenTodoTasks', JSON.stringify(tasks));
    }, [tasks]);

    // Categories and Priorities
    const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Others'];
    const priorities = ['Low', 'Medium', 'High'];

    const getCategoryIcon = (cat) => {
        switch (cat) {
            case 'Work': return <FaBriefcase />;
            case 'Personal': return <FaHome />;
            case 'Shopping': return <FaShoppingCart />;
            case 'Health': return <FaCheckCircle />;
            default: return <FaTags />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return '#ef4444';
            case 'Medium': return '#f59e0b';
            case 'Low': return '#10b981';
            default: return '#64748b';
        }
    };

    // Filtered Tasks
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 task.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === 'all' ? true : 
                                 (filterStatus === 'completed' ? task.completed : !task.completed);
            const matchesCategory = filterCategory === 'all' ? true : task.category === filterCategory;
            const matchesPriority = filterPriority === 'all' ? true : task.priority === filterPriority;
            
            return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
        }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }, [tasks, searchQuery, filterStatus, filterCategory, filterPriority]);

    // Handlers
    const handleAddTask = () => {
        if (!newTask.title.trim()) return;
        
        if (editingTask) {
            setTasks(tasks.map(t => t.id === editingTask.id ? { ...newTask, id: t.id } : t));
            setEditingTask(null);
        } else {
            setTasks([...tasks, { ...newTask, id: Date.now() }]);
        }
        
        resetNewTask();
        setShowAddModal(false);
    };

    const resetNewTask = () => {
        setNewTask({
            title: '',
            description: '',
            category: 'Work',
            priority: 'Medium',
            dueDate: new Date().toISOString().split('T')[0],
            completed: false
        });
    };

    const toggleComplete = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            setTasks(tasks.filter(t => t.id !== id));
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setNewTask(task);
        setShowAddModal(true);
    };

    const completedCount = tasks.filter(t => t.completed).length;
    const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

    return (
        <div className="todo-container py-4">
            <style>
                {`
                .todo-container {
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

                .search-group {
                    background: #f1f5f9;
                    border-radius: 100px;
                    padding: 5px 15px;
                    display: flex;
                    align-items: center;
                    border: 1px solid transparent;
                    transition: all 0.3s;
                }

                .search-group:focus-within {
                    background: #ffffff;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                }

                .search-input {
                    background: transparent;
                    border: none;
                    padding: 8px 10px;
                    outline: none;
                    width: 100%;
                    font-weight: 500;
                    color: #1e293b;
                }

                .task-item {
                    background: #ffffff;
                    border: 1px solid #f1f5f9;
                    border-radius: 16px;
                    padding: 15px 20px;
                    margin-bottom: 12px;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .task-item:hover {
                    transform: translateX(5px);
                    border-color: #e2e8f0;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.03);
                }

                .task-item.completed {
                    opacity: 0.6;
                }

                .task-item.completed .task-title {
                    text-decoration: line-through;
                }

                .check-btn {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    border: 2px solid #cbd5e1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }

                .check-btn.active {
                    background: #10b981;
                    border-color: #10b981;
                    color: white;
                }

                .task-content {
                    flex-grow: 1;
                }

                .task-title {
                    font-weight: 700;
                    margin-bottom: 2px;
                    color: #1e293b;
                }

                .task-meta {
                    font-size: 0.8rem;
                    color: #64748b;
                    display: flex;
                    gap: 15px;
                    flex-wrap: wrap;
                }

                .priority-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    display: inline-block;
                    margin-right: 6px;
                }

                .filter-pill {
                    padding: 6px 16px;
                    border-radius: 100px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    background: #f1f5f9;
                    color: #64748b;
                    border: 1px solid transparent;
                    white-space: nowrap;
                }

                .filter-pill.active {
                    background: #1e293b;
                    color: white;
                }

                .stat-box {
                    text-align: center;
                    padding: 20px;
                    border-radius: 20px;
                    background: #f8fafc;
                    border: 1px solid #f1f5f9;
                }

                .progress-custom {
                    height: 8px;
                    border-radius: 100px;
                    background: #f1f5f9;
                }

                .progress-custom .progress-bar {
                    background: linear-gradient(90deg, #6366f1, #a855f7);
                    border-radius: 100px;
                }

                .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                    color: #94a3b8;
                }
                `}
            </style>

            <Row className="g-4">
                {/* Sidebar Stats & Filters */}
                <Col lg={3}>
                    <div className="premium-card sticky-top" style={{ top: '20px' }}>
                        <h5 className="fw-bold mb-4 d-flex align-items-center">
                            <FaListUl className="me-2 text-primary" /> Overview
                        </h5>
                        
                        <div className="stat-box mb-4">
                            <h2 className="fw-bold mb-0 text-primary">{progress.toFixed(0)}%</h2>
                            <p className="extra-small text-muted text-uppercase fw-bold mb-3">Tasks Completed</p>
                            <ProgressBar className="progress-custom" now={progress} />
                            <div className="d-flex justify-content-between mt-2 extra-small text-muted fw-bold">
                                <span>{completedCount} DONE</span>
                                <span>{tasks.length} TOTAL</span>
                            </div>
                        </div>

                        <h6 className="extra-small fw-bold text-muted text-uppercase mb-3">Status Filter</h6>
                        <div className="d-flex flex-column gap-2 mb-4">
                            <div className={`filter-pill ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>All Tasks</div>
                            <div className={`filter-pill ${filterStatus === 'pending' ? 'active' : ''}`} onClick={() => setFilterStatus('pending')}>Pending</div>
                            <div className={`filter-pill ${filterStatus === 'completed' ? 'active' : ''}`} onClick={() => setFilterStatus('completed')}>Completed</div>
                        </div>

                        <h6 className="extra-small fw-bold text-muted text-uppercase mb-3">Priority Filter</h6>
                        <div className="d-flex flex-column gap-2 mb-4">
                            <div className={`filter-pill ${filterPriority === 'all' ? 'active' : ''}`} onClick={() => setFilterPriority('all')}>Any Priority</div>
                            {priorities.map(p => (
                                <div key={p} className={`filter-pill ${filterPriority === p ? 'active' : ''}`} onClick={() => setFilterPriority(p)}>
                                    <span className="priority-indicator" style={{ background: getPriorityColor(p) }}></span> {p}
                                </div>
                            ))}
                        </div>

                        <h6 className="extra-small fw-bold text-muted text-uppercase mb-3">Categories</h6>
                        <div className="d-flex flex-column gap-2">
                            <div className={`filter-pill ${filterCategory === 'all' ? 'active' : ''}`} onClick={() => setFilterCategory('all')}>All Categories</div>
                            {categories.map(c => (
                                <div key={c} className={`filter-pill ${filterCategory === c ? 'active' : ''}`} onClick={() => setFilterCategory(c)}>
                                    <span className="me-2 opacity-75">{getCategoryIcon(c)}</span> {c}
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>

                {/* Main Content */}
                <Col lg={9}>
                    <div className="premium-card">
                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                            <div className="search-group flex-grow-1" style={{ maxWidth: '400px' }}>
                                <FaSearch className="text-muted" />
                                <input 
                                    type="text" 
                                    className="search-input" 
                                    placeholder="Search tasks..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button 
                                variant="primary" 
                                className="rounded-pill px-4 py-2 d-flex align-items-center fw-bold shadow-sm"
                                onClick={() => { resetNewTask(); setEditingTask(null); setShowAddModal(true); }}
                            >
                                <FaPlus className="me-2" /> Add New Task
                            </Button>
                        </div>

                        <div className="task-list">
                            {filteredTasks.length > 0 ? (
                                filteredTasks.map(task => (
                                    <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                                        <div 
                                            className={`check-btn ${task.completed ? 'active' : ''}`}
                                            onClick={() => toggleComplete(task.id)}
                                        >
                                            {task.completed && <FaCheck size={12} />}
                                        </div>
                                        <div className="task-content">
                                            <div className="task-title">{task.title}</div>
                                            {task.description && <div className="extra-small text-muted mb-1">{task.description}</div>}
                                            <div className="task-meta">
                                                <span className="d-flex align-items-center">
                                                    <span className="priority-indicator" style={{ background: getPriorityColor(task.priority) }}></span>
                                                    {task.priority}
                                                </span>
                                                <span className="d-flex align-items-center">
                                                    <FaCalendarAlt className="me-1 opacity-50" /> {task.dueDate}
                                                </span>
                                                <span className="d-flex align-items-center">
                                                    <span className="me-1 opacity-50">{getCategoryIcon(task.category)}</span> {task.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <Button variant="light" size="sm" className="rounded-circle" onClick={() => handleEdit(task)}>
                                                <FaEdit className="text-primary" />
                                            </Button>
                                            <Button variant="light" size="sm" className="rounded-circle" onClick={() => deleteTask(task.id)}>
                                                <FaTrash className="text-danger" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <FaRegCircle size={50} className="mb-3 opacity-25" />
                                    <h5>No tasks found</h5>
                                    <p className="small">Try adjusting your filters or add a new task to get started.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Add/Edit Modal */}
            <Modal 
                show={showAddModal} 
                onHide={() => setShowAddModal(false)} 
                centered 
                contentClassName="border-0 rounded-4 shadow-lg"
            >
                <Modal.Header closeButton className="border-0 px-4 pt-4">
                    <Modal.Title className="fw-bold fs-5">
                        {editingTask ? 'Edit Task' : 'Create New Task'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 pb-4">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted">Task Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="e.g. Design homepage mockup" 
                                className="bg-light border-0 py-2"
                                value={newTask.title}
                                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted">Description (Optional)</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={2} 
                                placeholder="Add some details..." 
                                className="bg-light border-0 py-2"
                                value={newTask.description}
                                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                            />
                        </Form.Group>

                        <Row className="g-3 mb-3">
                            <Col md={6}>
                                <Form.Label className="small fw-bold text-muted">Category</Form.Label>
                                <Form.Select 
                                    className="bg-light border-0 py-2"
                                    value={newTask.category}
                                    onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </Form.Select>
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold text-muted">Priority</Form.Label>
                                <Form.Select 
                                    className="bg-light border-0 py-2"
                                    value={newTask.priority}
                                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                                >
                                    {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                                </Form.Select>
                            </Col>
                        </Row>

                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold text-muted">Due Date</Form.Label>
                            <Form.Control 
                                type="date" 
                                className="bg-light border-0 py-2"
                                value={newTask.dueDate}
                                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                            />
                        </Form.Group>

                        <Button 
                            variant="primary" 
                            className="w-100 rounded-pill py-2 fw-bold shadow-sm"
                            onClick={handleAddTask}
                        >
                            {editingTask ? 'Update Task' : 'Create Task'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default TodoList;
