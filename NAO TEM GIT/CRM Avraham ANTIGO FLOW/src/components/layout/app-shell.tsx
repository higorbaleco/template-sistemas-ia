import type { PropsWithChildren } from 'react'
import { BottomNav } from './bottom-nav'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <main className="flex-1 p-4 pb-20 md:p-8 md:pb-8">
        <Topbar />
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
