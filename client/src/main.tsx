import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './styles/globals.css'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--color-primary-700)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#00C389', secondary: '#0A0E1A' } },
            error: { iconTheme: { primary: '#FF4757', secondary: '#0A0E1A' } },
          }}
        />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
