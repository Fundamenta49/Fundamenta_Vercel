import React from 'react';
import ReactDOM from 'react-dom/client';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

const App = () => React.createElement('div', null, 'Hello from React');

ReactDOM.createRoot(root).render(React.createElement(App));