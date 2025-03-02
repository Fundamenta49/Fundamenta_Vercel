import { createElement } from 'react'
import { createRoot } from 'react-dom/client'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

const element = createElement('div', null, 'Hello')

createRoot(root).render(element)