import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

interface AppShellProps {
  children: React.ReactNode
  topbarAction?: React.ReactNode
}

export function AppShell({ children, topbarAction }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-page)' }}>
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden" style={{ marginLeft: '220px' }}>
        <Topbar action={topbarAction} />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1400px] p-6 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
