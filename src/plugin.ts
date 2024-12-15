penpot.ui.open("AI Chat Assistant", `?theme=${penpot.theme}`);

let currentModel = 'ollama';
const OLLAMA_ENDPOINT = 'http://localhost:11434/api/generate';

async function handleAIMessage(message: string) {
    try {
        let response;
        if (currentModel === 'ollama') {
            response = await fetch(OLLAMA_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama2',
                    prompt: message
                })
            });
        } else {
            // Handle other AI models here
        }

        const data = await response?.json();
        return data.response;
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
        currentModel = message.model;
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
