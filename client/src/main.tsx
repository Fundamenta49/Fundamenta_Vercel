import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import ErrorBoundary from './ErrorBoundary'

try {
  const container = document.getElementById('root')
  if (!container) {
    throw new Error('Root element not found')
  }

  const root = createRoot(container)
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  )
} catch (error) {
  console.error('Failed to render app:', error)
  document.body.innerHTML = `<div style="color: red; padding: 20px;">
    <h1>Failed to start application</h1>
    <pre>${error instanceof Error ? error.message : String(error)}</pre>
  </div>`
}