import config from '../config';

const ChatService = {
    sendMessage: async (message, aiConfig) => {
        console.log('Sending message:', message);
        console.log('Using AI config:', aiConfig);

        try {
            let response;
            if (aiConfig.model === 'ollama') {
                const ollamaPayload = {
                    model: aiConfig.ollamaModel,
                    prompt: message,
                    stream: false
                };
                console.log('Ollama request payload:', ollamaPayload);
                
                response = await fetch(aiConfig.endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(ollamaPayload)
                });
                
                const data = await response.json();
                console.log('Ollama raw response:', data);
                return data.response;
            } else {
                // Handle other AI services
                response = await fetch(aiConfig.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${aiConfig.apiKey}`
                    },
                    body: JSON.stringify({ message })
                });
                const data = await response.json();
                console.log('API response:', data);
                return data.reply;
            }
        } catch (error) {
            console.error('ChatService error:', error);
            throw error;
        }
    }
};

export default ChatService;
