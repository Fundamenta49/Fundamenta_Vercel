import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  return React.createElement('h1', null, 'App');
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));