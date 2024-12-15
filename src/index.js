import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import ChatOverlay from './components/ChatOverlay';


const App = () => (
    <BrowserRouter basename="/penpot-ai-ollama">
        <div className="app">
            <ChatOverlay />
        </div>
    </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById('root'));
