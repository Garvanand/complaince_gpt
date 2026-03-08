import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './styles/globals.css'
import './index.css'
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
              background: 'var(--white)',
              color: 'var(--slate-800)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '14px',
              boxShadow: 'var(--shadow-lg)',
            },
            success: { iconTheme: { primary: '#16A34A', secondary: '#FFFFFF' } },
            error: { iconTheme: { primary: '#DC2626', secondary: '#FFFFFF' } },
          }}
        />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
