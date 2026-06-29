import { StrictMode, createElement as h } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './app/App'
import { AppErrorBoundary } from '@/shared/ui'

createRoot(document.getElementById('root')).render(
  h(
    StrictMode,
    null,
    h(BrowserRouter, null, h(AppErrorBoundary, null, h(App))),
  ),
)