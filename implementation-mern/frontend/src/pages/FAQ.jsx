import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Send, Plus, ChevronRight, HelpCircle } from 'lucide-react';
import axios from 'axios';

const FAQ = () => {
    const { user } = useAuth();
    const [queries, setQueries] = useState([
        { id: 1, text: "Welcome to EduPortal Support! How can I help you today?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [queries]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
        setQueries(prev => [...prev, userMsg]);
        setInputValue('');
        setLoading(true);

        try {
            const { data } = await axios.post('http://localhost:5000/api/faq/chat', { query: inputValue });
            const botMsg = { id: Date.now() + 1, text: data.answer, sender: 'bot', category: data.category };
            setQueries(prev => [...prev, botMsg]);
        } catch (err) {
            const errorMsg = { id: Date.now() + 1, text: "I'm having some trouble connecting. Please try again later.", sender: 'bot' };
            setQueries(prev => [...prev, errorMsg]);
        }
        setLoading(false);
    };

    const suggestedQuestions = [
        "What is the attendance threshold?",
        "How to download records?",
        "Where can I give feedback?",
        "I missed a lecture, what should I do?"
    ];

    return (
        <div className="faq-page">
            <div className="header-action">
                <h1>Academic FAQ & Support</h1>
                <p>Have a question? Our support bot is here to help.</p>
            </div>

            <div className="grid-2">
                {/* Chatbox Section */}
                <div className="card chat-card-full">
                    <div className="chat-header">
                        <MessageCircle size={20} className="text-primary" />
                        <span>EduAssistant Bot</span>
                    </div>
                    
                    <div className="chat-messages">
                        {queries.map(msg => (
                            <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                                <div className="message-bubble">
                                    {msg.text}
                                    {msg.category && <span className="category-tag">{msg.category}</span>}
                                </div>
                            </div>
                        ))}
                        {loading && <div className="message-wrapper bot"><div className="message-bubble typing">...</div></div>}
                        <div ref={chatEndRef} />
                    </div>

                    <form className="chat-input-area" onSubmit={handleSend}>
                        <input 
                            type="text" 
                            placeholder="Type your academic question..." 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary btn-round" disabled={loading}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>

                {/* FAQ List & Suggested Questions */}
                <div className="faq-sidebar-content">
                    <div className="card">
                        <h3>Quick Questions</h3>
                        <div className="suggested-list mt-4">
                            {suggestedQuestions.map((q, idx) => (
                                <button key={idx} className="suggested-item" onClick={() => setInputValue(q)}>
                                    <HelpCircle size={14} />
                                    <span>{q}</span>
                                    <ChevronRight size={14} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="card mt-4 bg-primary-light">
                        <div className="info-block">
                            <h3>Contact Coordinator</h3>
                            <p className="small text-muted mt-2">If you have technical issues that the bot cannot resolve, please email coordinations@university.edu</p>
                            <button className="btn btn-primary mt-4 btn-sm">Email Support</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
