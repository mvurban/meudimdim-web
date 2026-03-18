import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 16,
        background: 'var(--bg-page)',
        color: 'var(--text-primary)',
        fontFamily: 'sans-serif',
      }}
    >
      <h1 style={{ fontSize: 48, fontWeight: 700, margin: 0 }}>404</h1>
      <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0 }}>Página não encontrada.</p>
      <Link
        href="/"
        style={{
          marginTop: 8,
          padding: '10px 20px',
          borderRadius: 8,
          background: '#22c55e',
          color: '#0d1117',
          fontWeight: 600,
          fontSize: 14,
          textDecoration: 'none',
        }}
      >
        Voltar ao início
      </Link>
    </div>
  )
}
