import React from 'react'
import ReactDOM from 'react-dom/client'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

function App() {
  return React.createElement('div', null, 'Hello World')
}

ReactDOM.createRoot(root).render(
  React.createElement(App)
)
