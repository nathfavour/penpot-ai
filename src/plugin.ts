penpot.ui.open("AI Chat Assistant", `?theme=${penpot.theme}`);

let currentConfig = {
    model: 'ollama',
    endpoint: 'http://localhost:11434/api/generate',
    ollamaModel: 'qwen2.5-coder:0.5b'
};

async function handleAIMessage(message: string) {
    try {
        console.log('Processing message with config:', currentConfig);
        let response;
        
        if (currentConfig.model === 'ollama') {
            response = await fetch(currentConfig.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: currentConfig.ollamaModel,
                    prompt: message,
                    stream: false
                })
            });
            const data = await response.json();
            console.log('Ollama response:', data);
            return data.response;
        }
        // Handle other AI models here
    } catch (error) {
        console.error('AI Chat Error:', error);
        return 'Sorry, there was an error processing your request.';
    }
}

penpot.ui.onMessage(async (message) => {
    if (message.type === 'chatMessage') {
        const response = await handleAIMessage(message.message);
        penpot.ui.sendMessage({
            source: 'penpot',
            type: 'aiResponse',
            response
        });
    } else if (message.type === 'modelChange') {
        currentConfig = { ...currentConfig, ...message.config };
        console.log('Model configuration updated:', currentConfig);
    } else if (message === "create-text") {
        const text = penpot.createText("Hello world!");

        if (text) {
            text.x = penpot.viewport.center.x;
            text.y = penpot.viewport.center.y;

            penpot.selection = [text];
        }
    }
});

// Update the theme in the iframe
penpot.on("themechange", (theme) => {
  penpot.ui.sendMessage({
    source: "penpot",
    type: "themechange",
    theme,
  });
});
