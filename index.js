import React from 'react';
import ReactDOM from 'react-dom';
import ChatOverlay from './components/ChatOverlay';

const App = () => (
    <div className="app">
        <ChatOverlay />
    </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
