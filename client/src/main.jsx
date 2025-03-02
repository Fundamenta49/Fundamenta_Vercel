import React from 'react'
import ReactDOM from 'react-dom/client'

// Explicitly declare types for better error tracking
window.React = React;

const App = () => {
  return (
    <div>
      <h1>Career Development Platform</h1>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);