interface SectionCardProps {
  title?: string
  children: React.ReactNode
  style?: React.CSSProperties
}

export function SectionCard({ title, children, style }: SectionCardProps) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      ...style,
    }}>
      {title && (
        <p style={{
          margin: '0 0 16px',
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--text-primary)',
        }}>
          {title}
        </p>
      )}
      {children}
    </div>
  )
}
