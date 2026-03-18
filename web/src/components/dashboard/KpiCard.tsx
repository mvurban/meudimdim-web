interface KpiCardProps {
  label: string
  value: string
  color?: string
}

export function KpiCard({ label, value, color }: KpiCardProps) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '16px 20px',
    }}>
      <p style={{
        margin: '0 0 4px',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '1px',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
      }}>
        {label}
      </p>
      <p style={{
        margin: 0,
        fontSize: 18,
        fontWeight: 700,
        color: color ?? 'var(--text-primary)',
      }}>
        {value}
      </p>
    </div>
  )
}
