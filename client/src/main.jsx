import React from 'react'
import ReactDOM from 'react-dom/client'

const App = () => (
  <div>
    <h1>Career Development Platform</h1>
  </div>
)

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)