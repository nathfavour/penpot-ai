import "./style.css";

const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";

let aiConfig = {
    endpoint: 'http://localhost:11434/api/generate',
    apiKey: '',
    model: 'ollama',
    ollamaModel: 'qwen2.5-coder:0.5b'
};

// Initialize chat UI
const chatUI = {
    init() {
        const chatContainer = document.createElement('div');
        chatContainer.className = 'chat-container';
        chatContainer.innerHTML = `
            <div class="chat-messages"></div>
            <div class="chat-input">
                <input type="text" placeholder="Ask AI anything...">
                <button>Send</button>
            </div>
            <div class="ai-config">
                <select id="ai-model">
                    <option value="ollama">Ollama (Local)</option>
                    <option value="openai">OpenAI</option>
                    <option value="other">Other AI Service</option>
                </select>
                <div id="model-specific-inputs">
                    <input type="text" placeholder="Ollama Model ID" id="ollama-model" value="qwen2.5-coder:0.5b">
                    <input type="text" placeholder="Endpoint URL" id="endpoint-url" value="http://localhost:11434/api/generate">
                </div>
            </div>
        `;
        document.getElementById('root')?.appendChild(chatContainer);
        this.bindEvents();
    },

    bindEvents() {
        const input = document.querySelector('.chat-input input');
        const button = document.querySelector('.chat-input button');
        const modelSelect = document.querySelector('#ai-model');
        const apiKeyInput = document.querySelector('#api-key');
        const modelInputs = document.querySelector('#model-specific-inputs');

        button?.addEventListener('click', () => this.sendMessage());
        input?.addEventListener('keydown', (e: Event) => {
            if ((e as KeyboardEvent).key === 'Enter') this.sendMessage();
        });
        modelSelect?.addEventListener('change', (e) => {
            const selectedModel = (e.target as HTMLSelectElement).value;
            aiConfig.model = selectedModel;
            
            // Update UI based on model
            if (selectedModel === 'ollama') {
                modelInputs!.innerHTML = `
                    <input type="text" placeholder="Ollama Model ID" id="ollama-model" value="${aiConfig.ollamaModel}">
                    <input type="text" placeholder="Endpoint URL" id="endpoint-url" value="${aiConfig.endpoint}">
                `;
            } else {
                modelInputs!.innerHTML = `
                    <input type="text" placeholder="API Key" id="api-key">
                `;
            }
            
            parent.postMessage({ 
                type: 'modelChange', 
                model: selectedModel,
                config: aiConfig 
            }, "*");
        });

        modelInputs?.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            switch(target.id) {
                case 'ollama-model':
                    aiConfig.ollamaModel = target.value;
                    break;
                case 'endpoint-url':
                    aiConfig.endpoint = target.value;
                    break;
                case 'api-key':
                    aiConfig.apiKey = target.value;
                    break;
            }
        });
    },

    async sendMessage() {
        const input = document.querySelector('.chat-input input') as HTMLInputElement;
        const message = input.value.trim();
        if (!message) return;

        parent.postMessage({ type: 'chatMessage', message }, "*");
        input.value = '';
    }
};

chatUI.init();

document.querySelector("[data-handler='create-text']")?.addEventListener("click", () => {
  // send message to plugin.ts
  parent.postMessage("create-text", "*");
});

// Listen to plugin.ts messages
window.addEventListener("message", (event) => {
    if (event.data.source === "penpot") {
        if (event.data.type === "themechange") {
            document.body.dataset.theme = event.data.theme;
        } else if (event.data.type === "aiResponse") {
            // Handle AI response
            const messagesDiv = document.querySelector('.chat-messages');
            if (messagesDiv) {
                messagesDiv.innerHTML += `<div class="message ai">${event.data.response}</div>`;
            }
        }
    }
});
