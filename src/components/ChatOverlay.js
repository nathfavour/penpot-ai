import React, { useState } from 'react';
import ChatService from '../../services/ChatService';

const ChatOverlay = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        const response = await ChatService.sendMessage(input);
        setMessages([...messages, { user: 'You', text: input }, { user: 'AI', text: response }]);
        setInput('');
    };

    return (
        <div className="chat-overlay">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.user}`}>
                        <strong>{msg.user}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatOverlay;
