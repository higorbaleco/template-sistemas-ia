import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../components/layout/app-shell'
import { ActivitiesPage } from '../pages/activities-page'
import { CadencesPage } from '../pages/cadences-page'
import { ContactsPage } from '../pages/contacts-page'
import { DashboardPage } from '../pages/dashboard-page'
import { PipelinePage } from '../pages/pipeline-page'
import { PlaceholderPage } from '../pages/placeholder-page'
import { ProductsPage } from '../pages/products-page'
import { TvPage } from '../pages/tv-page'

function wrap(element: React.ReactNode) {
  return <AppShell>{element}</AppShell>
}

export const router = createBrowserRouter([
  { path: '/', element: wrap(<DashboardPage />) },
  { path: '/pipeline', element: wrap(<PipelinePage />) },
  { path: '/contatos', element: wrap(<ContactsPage />) },
  { path: '/produtos', element: wrap(<ProductsPage />) },
  { path: '/atividades', element: wrap(<ActivitiesPage />) },
  { path: '/cadencias', element: wrap(<CadencesPage />) },
  { path: '/metas', element: wrap(<PlaceholderPage title="Metas" />) },
  { path: '/tv', element: wrap(<TvPage />) },
])
