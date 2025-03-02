import React from 'react'
import ReactDOM from 'react-dom/client'

// Explicitly declare types for better error tracking
declare global {
  interface Window {
    React: typeof React;
  }
}

window.React = React;

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

const App: React.FC = () => {
  return (
    <div>
      <h1>Basic React App</h1>
    </div>
  );
};

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);