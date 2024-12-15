import "./style.css";

const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";

let aiConfig = {
    endpoint: '',
    apiKey: '',
    model: 'default'
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
                </select>
                <input type="text" placeholder="API Key (if needed)" id="api-key">
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

        button?.addEventListener('click', () => this.sendMessage());
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        modelSelect?.addEventListener('change', (e) => {
            aiConfig.model = (e.target as HTMLSelectElement).value;
            parent.postMessage({ type: 'modelChange', model: aiConfig.model }, "*");
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
