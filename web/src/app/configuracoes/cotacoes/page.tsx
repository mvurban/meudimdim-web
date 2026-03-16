import { AppShell } from '@/components/layout/AppShell'

export default function CotacoesPage() {
  return (
    <AppShell>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Cotações</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>Gerencie as cotações de moedas e ativos</p>
      </div>
    </AppShell>
  )
}
