import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'

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
