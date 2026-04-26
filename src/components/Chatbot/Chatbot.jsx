import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import aiService from '../../services/aiService';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'model',
            text: 'Hello! I am the WebzenTools AI Assistant. I can help you with all 100+ tools we offer. How can I assist you today?',
            suggestions: ["What tools do you have?", "Are these tools free?", "Tell me about Developer Tools"]
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

    const handleSendMessage = async (e, msgText = null) => {
        e?.preventDefault();
        
        const textToSend = msgText || inputMessage;
        
        if (!textToSend.trim() || isLoading) return;

        const userMsg = { role: 'user', text: textToSend.trim() };
        
        // Add user message to UI immediately
        const newHistory = [...messages, userMsg];
        setMessages(newHistory);
        if (!msgText) setInputMessage('');
        setIsLoading(true);

        try {
            // Strip out suggestions from history before sending to keep payload clean
            const cleanHistory = messages.map(m => ({ role: m.role, text: m.text }));
            
            const responseData = await aiService.sendChatMessage(cleanHistory, userMsg.text);
            
            setMessages(prev => [...prev, { 
                role: 'model', 
                text: responseData.reply,
                suggestions: responseData.suggestions || []
            }]);
        } catch (error) {
            setMessages(prev => [...prev, { 
                role: 'model', 
                text: 'Sorry, I encountered an error connecting to my servers. Please try again later.',
                suggestions: ["Try again"]
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to render markdown safely
    const renderMarkdown = (text) => {
        const rawHtml = marked.parse(text);
        const cleanHtml = DOMPurify.sanitize(rawHtml, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'code', 'pre', 'ul', 'ol', 'li'], ALLOWED_ATTR: ['href', 'target'] });
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
                                <>
                                    <div dangerouslySetInnerHTML={renderMarkdown(msg.text)} />
                                    {msg.suggestions && msg.suggestions.length > 0 && idx === messages.length - 1 && (
                                        <div className="wt-chat-suggestions">
                                            {msg.suggestions.map((sug, sIdx) => (
                                                <button 
                                                    key={sIdx} 
                                                    className="wt-chat-suggestion-btn"
                                                    onClick={() => handleSendMessage(null, sug)}
                                                    disabled={isLoading}
                                                >
                                                    {sug}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
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
                <form className="wt-chat-footer" onSubmit={(e) => handleSendMessage(e)}>
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
