import React from 'react';
import ReactDOM from 'react-dom/client';

const App: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">
        Career Development Platform
      </h1>
    </div>
  );
};

export default App;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));