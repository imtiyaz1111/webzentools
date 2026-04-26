import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User, Sparkles } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import aiService from '../../services/aiService';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'model',
            text: 'Hello! I am the WebzenTools AI Assistant. How can I help you navigate our free tools today?'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const messagesEndRef = useRef(null);
    const chatBodyRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading, isOpen]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        
        if (!inputMessage.trim() || isLoading) return;

        const userMsg = { role: 'user', text: inputMessage.trim() };
        
        // Add user message to UI immediately
        const newHistory = [...messages, userMsg];
        setMessages(newHistory);
        setInputMessage('');
        setIsLoading(true);

        try {
            // Call our AI Service
            // We pass the history (excluding the first greeting, or including it - Gemini handles it fine)
            const replyText = await aiService.sendChatMessage(messages, userMsg.text);
            
            setMessages(prev => [...prev, { role: 'model', text: replyText }]);
        } catch (error) {
            setMessages(prev => [...prev, { 
                role: 'model', 
                text: 'Sorry, I encountered an error connecting to my servers. Please try again later.' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to render markdown safely
    const renderMarkdown = (text) => {
        // Parse markdown to HTML
        const rawHtml = marked.parse(text);
        // Sanitize the HTML
        const cleanHtml = DOMPurify.sanitize(rawHtml);
        return { __html: cleanHtml };
    };

    return (
        <div className="wt-chatbot-wrapper">
            
            {/* The Floating Action Button */}
            <button 
                className={`wt-chatbot-fab ${isOpen ? 'open' : ''}`} 
                onClick={toggleChat}
                aria-label="Open AI Assistant"
            >
                <div className="wt-chatbot-fab-pulse"></div>
                <Sparkles size={24} />
            </button>

            {/* The Chat Window */}
            <div className={`wt-chat-window ${isOpen ? 'open' : ''}`}>
                
                {/* Header */}
                <div className="wt-chat-header">
                    <div className="wt-chat-title">
                        <div className="wt-chat-avatar">
                            <Bot size={20} />
                        </div>
                        <div className="wt-chat-title-text">
                            <h4>Webzen AI</h4>
                            <p><span className="wt-chat-status-dot"></span> Online</p>
                        </div>
                    </div>
                    <button className="wt-chat-close-btn" onClick={toggleChat} aria-label="Close Chat">
                        <X size={18} />
                    </button>
                </div>

                {/* Messages Body */}
                <div className="wt-chat-body" ref={chatBodyRef}>
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`wt-chat-message ${msg.role}`}>
                            {msg.role === 'model' ? (
                                <div dangerouslySetInnerHTML={renderMarkdown(msg.text)} />
                            ) : (
                                msg.text
                            )}
                        </div>
                    ))}
                    
                    {isLoading && (
                        <div className="wt-chat-loading">
                            <div className="wt-chat-loading-dot"></div>
                            <div className="wt-chat-loading-dot"></div>
                            <div className="wt-chat-loading-dot"></div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Footer */}
                <form className="wt-chat-footer" onSubmit={handleSendMessage}>
                    <div className="wt-chat-input-wrapper">
                        <input 
                            type="text" 
                            className="wt-chat-input" 
                            placeholder="Ask me anything..." 
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            disabled={isLoading}
                        />
                        <button 
                            type="submit" 
                            className="wt-chat-send-btn"
                            disabled={!inputMessage.trim() || isLoading}
                            aria-label="Send Message"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default Chatbot;
