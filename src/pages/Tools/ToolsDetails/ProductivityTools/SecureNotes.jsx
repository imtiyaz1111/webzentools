import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Button, Form, Card, Modal, InputGroup, Alert, Badge } from 'react-bootstrap';
import { 
    FaLock, FaUnlock, FaPlus, FaTrash, FaEdit, FaSearch, FaShieldAlt,
    FaEye, FaEyeSlash, FaSave, FaTimes, FaFileAlt, FaKey, FaHistory
} from 'react-icons/fa';
import bcrypt from 'bcryptjs';
import toast from 'react-hot-toast';

const SecureNotes = () => {
    // Auth State
    const [isLocked, setIsLocked] = useState(true);
    const [password, setPassword] = useState('');
    const [masterHash, setMasterHash] = useState(() => localStorage.getItem('webzenSecureNotes_hash') || '');
    
    // Notes State
    const [notes, setNotes] = useState([]);
    const [decryptedNotes, setDecryptedNotes] = useState({}); // id -> {title, content}
    
    // UI State
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentNote, setCurrentNote] = useState({ title: '', content: '', color: '#ffffff' });
    const [showPassword, setShowPassword] = useState(false);

    // Encryption Helpers
    const deriveKey = async (pass, salt) => {
        const enc = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
            'raw',
            enc.encode(pass),
            'PBKDF2',
            false,
            ['deriveKey']
        );
        return window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: enc.encode(salt),
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    };

    const encrypt = async (text, pass) => {
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveKey(pass, salt);
        const enc = new TextEncoder();
        const encrypted = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            enc.encode(text)
        );

        return {
            ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
            salt: btoa(String.fromCharCode(...salt)),
            iv: btoa(String.fromCharCode(...iv))
        };
    };

    const decrypt = async (encryptedData, pass) => {
        try {
            const salt = new Uint8Array(atob(encryptedData.salt).split('').map(c => c.charCodeAt(0)));
            const iv = new Uint8Array(atob(encryptedData.iv).split('').map(c => c.charCodeAt(0)));
            const ciphertext = new Uint8Array(atob(encryptedData.ciphertext).split('').map(c => c.charCodeAt(0)));
            const key = await deriveKey(pass, salt);
            
            const decrypted = await window.crypto.subtle.decrypt(
                { name: 'AES-GCM', iv },
                key,
                ciphertext
            );
            return new TextDecoder().decode(decrypted);
        } catch (e) {
            console.error("Decryption failed:", e);
            return null;
        }
    };

    // Load Notes
    useEffect(() => {
        const savedNotes = localStorage.getItem('webzenSecureNotes_data');
        if (savedNotes) {
            setNotes(JSON.parse(savedNotes));
        }
    }, []);

    // Save Notes
    const saveNotesToStorage = (updatedNotes) => {
        setNotes(updatedNotes);
        localStorage.setItem('webzenSecureNotes_data', JSON.stringify(updatedNotes));
    };

    // Auth Handlers
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!password) return;

        if (!masterHash) {
            // First time setup
            const hash = bcrypt.hashSync(password, 10);
            localStorage.setItem('webzenSecureNotes_hash', hash);
            setMasterHash(hash);
            setIsLocked(false);
            toast.success("Vault Created! Remember your password.");
        } else {
            const isValid = bcrypt.compareSync(password, masterHash);
            if (isValid) {
                setIsLocked(false);
                decryptAllNotes(password);
                toast.success("Vault Unlocked");
            } else {
                toast.error("Incorrect Password");
            }
        }
    };

    const decryptAllNotes = async (pass) => {
        const newDecrypted = {};
        for (const note of notes) {
            const title = await decrypt(note.encryptedTitle, pass);
            const content = await decrypt(note.encryptedContent, pass);
            if (title !== null && content !== null) {
                newDecrypted[note.id] = { title, content };
            }
        }
        setDecryptedNotes(newDecrypted);
    };

    const handleLock = () => {
        setIsLocked(true);
        setPassword('');
        setDecryptedNotes({});
        toast.success("Vault Locked");
    };

    // Note Handlers
    const handleSaveNote = async () => {
        if (!currentNote.title.trim()) return;

        const encryptedTitle = await encrypt(currentNote.title, password);
        const encryptedContent = await encrypt(currentNote.content, password);
        
        let updatedNotes;
        if (editingNote) {
            updatedNotes = notes.map(n => n.id === editingNote.id ? { 
                ...n, encryptedTitle, encryptedContent, color: currentNote.color, lastModified: Date.now() 
            } : n);
        } else {
            updatedNotes = [...notes, {
                id: Date.now(),
                encryptedTitle,
                encryptedContent,
                color: currentNote.color,
                lastModified: Date.now()
            }];
        }

        saveNotesToStorage(updatedNotes);
        setDecryptedNotes({ ...decryptedNotes, [editingNote?.id || updatedNotes[updatedNotes.length-1].id]: { 
            title: currentNote.title, content: currentNote.content 
        }});
        setShowNoteModal(false);
        setCurrentNote({ title: '', content: '', color: '#ffffff' });
        setEditingNote(null);
        toast.success(editingNote ? "Note Updated" : "Note Saved");
    };

    const handleDeleteNote = (id) => {
        if (window.confirm("Delete this note permanently?")) {
            const updated = notes.filter(n => n.id !== id);
            saveNotesToStorage(updated);
            const newDecrypted = { ...decryptedNotes };
            delete newDecrypted[id];
            setDecryptedNotes(newDecrypted);
            toast.success("Note Deleted");
        }
    };

    const handleEditNote = (note) => {
        const decrypted = decryptedNotes[note.id] || { title: '', content: '' };
        setEditingNote(note);
        setCurrentNote({ title: decrypted.title, content: decrypted.content, color: note.color });
        setShowNoteModal(true);
    };

    const filteredNotes = notes.filter(note => {
        const decrypted = decryptedNotes[note.id];
        if (!decrypted) return false;
        return decrypted.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
               decrypted.content.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="secure-notes-container py-4">
            <style>
                {`
                .secure-notes-container {
                    animation: fadeIn 0.6s ease-out;
                    max-width: 1000px;
                    margin: 0 auto;
                    color: #1e293b;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .auth-card {
                    max-width: 450px;
                    margin: 80px auto;
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    border-radius: 32px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
                    padding: 50px 40px;
                    text-align: center;
                }

                .lock-icon-wrapper {
                    width: 80px;
                    height: 80px;
                    background: #f1f5f9;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 30px;
                    color: #6366f1;
                    font-size: 2rem;
                    box-shadow: inset 0 2px 10px rgba(0,0,0,0.05);
                }

                .vault-header {
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    border-radius: 24px;
                    padding: 25px 30px;
                    margin-bottom: 30px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                }

                .search-bar {
                    background: #f1f5f9;
                    border-radius: 100px;
                    padding: 5px 20px;
                    display: flex;
                    align-items: center;
                    border: 1px solid transparent;
                    flex-grow: 1;
                    max-width: 400px;
                    transition: all 0.3s;
                }

                .search-bar:focus-within {
                    background: #ffffff;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                }

                .search-input {
                    background: transparent;
                    border: none;
                    padding: 10px;
                    outline: none;
                    width: 100%;
                    font-weight: 500;
                    color: #1e293b;
                }

                .note-card {
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    border-radius: 20px;
                    padding: 25px;
                    height: 100%;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                }

                .note-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
                    border-color: #6366f1;
                }

                .note-title {
                    font-weight: 700;
                    font-size: 1.1rem;
                    margin-bottom: 12px;
                    color: #0f172a;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .note-excerpt {
                    color: #64748b;
                    font-size: 0.9rem;
                    line-height: 1.6;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    flex-grow: 1;
                }

                .note-footer {
                    margin-top: 20px;
                    padding-top: 15px;
                    border-top: 1px solid #f1f5f9;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.75rem;
                    color: #94a3b8;
                }

                .color-picker {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                }

                .color-btn {
                    width: 25px;
                    height: 25px;
                    border-radius: 50%;
                    border: 2px solid transparent;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .color-btn.active {
                    border-color: #6366f1;
                    transform: scale(1.2);
                }

                .empty-vault {
                    text-align: center;
                    padding: 100px 20px;
                    color: #94a3b8;
                }
                `}
            </style>

            {isLocked ? (
                <div className="auth-card">
                    <div className="lock-icon-wrapper">
                        <FaShieldAlt />
                    </div>
                    <h3 className="fw-bold mb-2">Secure Notes Vault</h3>
                    <p className="text-muted small mb-4">
                        {masterHash ? "Enter your master password to unlock your notes." : "Set a master password to initialize your encrypted vault."}
                    </p>
                    <Form onSubmit={handleLogin}>
                        <InputGroup className="mb-3">
                            <Form.Control 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Master Password" 
                                className="bg-light border-0 py-3 px-4 rounded-start-4"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button 
                                variant="light" 
                                className="border-0 bg-light rounded-end-4 px-3"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </Button>
                        </InputGroup>
                        <Button type="submit" variant="primary" className="w-100 py-3 rounded-4 fw-bold shadow-sm">
                            {masterHash ? "Unlock Vault" : "Create Vault"}
                        </Button>
                    </Form>
                    <div className="mt-4 extra-small text-muted d-flex align-items-center justify-content-center">
                        <FaLock className="me-2" /> End-to-end encrypted locally
                    </div>
                </div>
            ) : (
                <div className="vault-content">
                    <div className="vault-header">
                        <div className="d-flex align-items-center gap-3 flex-grow-1">
                            <div className="search-bar">
                                <FaSearch className="text-muted" />
                                <input 
                                    type="text" 
                                    className="search-input" 
                                    placeholder="Search your notes..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button 
                                variant="primary" 
                                className="rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center"
                                onClick={() => { setEditingNote(null); setCurrentNote({title: '', content: '', color: '#ffffff'}); setShowNoteModal(true); }}
                            >
                                <FaPlus className="me-2" /> New Note
                            </Button>
                        </div>
                        <Button variant="outline-danger" className="rounded-pill px-4 ms-3 fw-bold" onClick={handleLock}>
                            <FaLock className="me-2" /> Lock
                        </Button>
                    </div>

                    {notes.length > 0 ? (
                        <Row className="g-4">
                            {filteredNotes.map(note => (
                                <Col key={note.id} md={6} lg={4}>
                                    <div className="note-card" onClick={() => handleEditNote(note)}>
                                        <div className="note-title">
                                            <FaFileAlt className="text-primary opacity-50" />
                                            {decryptedNotes[note.id]?.title || "Encrypted Note"}
                                        </div>
                                        <div className="note-excerpt">
                                            {decryptedNotes[note.id]?.content || "••••••••••••••••••••••••••••••••••••"}
                                        </div>
                                        <div className="note-footer">
                                            <span><FaHistory className="me-1" /> {new Date(note.lastModified).toLocaleDateString()}</span>
                                            <div className="d-flex gap-2">
                                                <Button 
                                                    variant="link" 
                                                    className="p-0 text-danger" 
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className="empty-vault">
                            <FaKey size={50} className="mb-3 opacity-25" />
                            <h5>Your Vault is Empty</h5>
                            <p className="small">Start creating secure, encrypted notes that stay only in your browser.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Note Editor Modal */}
            <Modal 
                show={showNoteModal} 
                onHide={() => setShowNoteModal(false)} 
                centered 
                size="lg"
                contentClassName="border-0 rounded-4 shadow-lg"
            >
                <Modal.Header closeButton className="border-0 px-4 pt-4">
                    <Modal.Title className="fw-bold fs-5 d-flex align-items-center">
                        <FaEdit className="me-2 text-primary" /> {editingNote ? 'Edit Note' : 'New Note'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 pb-4">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted">Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Note Title" 
                                className="bg-light border-0 py-2 fs-5 fw-bold"
                                value={currentNote.title}
                                onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold text-muted">Content</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={10} 
                                placeholder="Start typing your secret thoughts..." 
                                className="bg-light border-0 py-3"
                                style={{ resize: 'none' }}
                                value={currentNote.content}
                                onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-between align-items-center">
                            <div className="extra-small text-muted d-flex align-items-center">
                                <FaShieldAlt className="me-2 text-success" /> Auto-encrypted on save
                            </div>
                            <div className="d-flex gap-2">
                                <Button variant="light" className="rounded-pill px-4 fw-bold" onClick={() => setShowNoteModal(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" className="rounded-pill px-4 fw-bold shadow-sm" onClick={handleSaveNote}>
                                    <FaSave className="me-2" /> Save Note
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default SecureNotes;
