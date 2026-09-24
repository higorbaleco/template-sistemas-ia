import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './styles/tailwind.css'

// Theme initialization - run before React renders
{
  const savedTheme = localStorage.getItem('theme-preference')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const theme = savedTheme || (prefersDark ? 'dark' : 'light')

  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme-preference')) {
      if (e.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  })
}

// Register service worker for PWA offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })
      console.log('✓ Service Worker registered:', registration.scope)

      // Check for updates periodically
      setInterval(() => {
        registration.update()
      }, 1000 * 60 * 60) // Check every hour
    } catch (error) {
      console.warn('✗ Service Worker registration failed:', error)
    }
  })

  // Listen for controller change (new SW activated)
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('✓ Service Worker updated and activated')
  })
}

// Log PWA capabilities
if ('caches' in window) {
  console.log('✓ Cache API available - offline support enabled')
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
