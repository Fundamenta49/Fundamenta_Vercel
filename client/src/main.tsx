import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import ErrorBoundary from './ErrorBoundary'

const domNode = document.getElementById('root')
if (!domNode) {
  throw new Error('Failed to find root element')
}

ReactDOM.createRoot(domNode).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)