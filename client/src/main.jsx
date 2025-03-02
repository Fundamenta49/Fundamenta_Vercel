import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  )
}

const domNode = document.getElementById('root')
const root = ReactDOM.createRoot(domNode)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)