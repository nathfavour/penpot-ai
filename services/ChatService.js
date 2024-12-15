import config from '../config';

const ChatService = {
    sendMessage: async (message) => {
        const response = await fetch(config.localOllamaEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKeys.openAI}`
            },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        return data.reply;
    }
};

export default ChatService;
