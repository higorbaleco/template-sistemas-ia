import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { CRMProvider } from './contexts/crm-context'
import { I18nProvider } from './contexts/i18n-context'
import { GlobalFiltersProvider } from './hooks/use-global-filters'
import './index.css'

const queryClient = new QueryClient()

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined)
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <CRMProvider>
          <GlobalFiltersProvider>
            <RouterProvider router={router} />
          </GlobalFiltersProvider>
        </CRMProvider>
      </I18nProvider>
    </QueryClientProvider>
  </StrictMode>,
)
