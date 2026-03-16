'use client'

import { signIn } from 'next-auth/react'
import { useTheme } from '@/lib/theme-context'

const FEATURES = [
  { icon: '◈', text: 'Snapshots mensais de cada produto financeiro' },
  { icon: '◉', text: 'Cotações de ações em tempo real via Yahoo Finance' },
  { icon: '▣', text: 'Dashboard consolidado por categoria e instituição' },
  { icon: '◐', text: 'Conversão BRL ↔ USD com histórico de câmbio' },
]

export default function LoginPage() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── LEFT PANEL (always dark) ── */}
      <div
        className="relative hidden w-[58%] flex-col justify-between overflow-hidden p-12 lg:flex"
        style={{ background: '#0d1117' }}
      >
        {/* Grid texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '56px 56px',
          }}
        />

        {/* Glow */}
        <div
          className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 65%)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-24 h-[400px] w-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 65%)' }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px]" style={{ background: '#22c55e' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#0d1117"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#0d1117" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
              Meu<span style={{ color: '#22c55e' }}>DimDim</span>
            </span>
          </div>

          {/* Hero */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#22c55e', marginBottom: 20 }}>
              Controle financeiro pessoal
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 3vw, 3.2rem)',
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-1.5px',
                color: '#fff',
                marginBottom: 20,
              }}
            >
              Seu patrimônio,<br />
              sob <span style={{ color: '#22c55e' }}>controle total.</span>
            </h1>
            <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 420 }}>
              Registre e acompanhe cada investimento, mês a mês. Snapshots manuais, visão consolidada e sem complicação.
            </p>

            {/* Asset class pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 28 }}>
              {['Renda Fixa', 'Renda Variável', 'FIIs', 'Internacional', 'Ações', 'Câmbio USD'].map(tag => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '5px 12px', borderRadius: 99,
                    border: '1px solid rgba(34,197,94,0.22)',
                    background: 'rgba(34,197,94,0.06)',
                    fontSize: 12, color: 'rgba(255,255,255,0.65)',
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                  {tag}
                </span>
              ))}
            </div>

            {/* Preview card */}
            <div
              style={{
                marginTop: 28,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: '16px 20px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: 'linear-gradient(90deg, #22c55e, transparent)',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 1, textTransform: 'uppercase' }}>
                  Patrimônio total — Mar/2026
                </span>
                <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 99, background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                  +1,23% este mês
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
                R$ 397.575
              </p>
              <p style={{ fontSize: 13, color: '#22c55e', marginTop: 3 }}>▲ R$ 4.175 em março</p>

              {/* Mini bar chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 40, marginTop: 14 }}>
                {[30, 45, 40, 60, 55, 70, 65, 80, 78, 90, 85, 100].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1, height: `${h}%`, borderRadius: '3px 3px 0 0',
                      background: i === 11 ? '#22c55e' : 'rgba(34,197,94,0.2)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 28, paddingTop: 8 }}>
            {[
              { v: '12+',      l: 'tipos de produto' },
              { v: 'BRL/USD',  l: 'multi-moeda' },
              { v: '100%',     l: 'seus dados' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff' }}>{s.v}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 0.4 }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        className="flex flex-1 flex-col items-center justify-center px-8 py-12 relative"
        style={{ background: 'var(--bg-surface)' }}
      >
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-[9px] text-sm transition-all"
          style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          title="Alternar tema"
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>

        <div style={{ width: '100%', maxWidth: 360 }}>

          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-[9px]" style={{ background: '#22c55e' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#fff"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
              Meu<span style={{ color: '#22c55e' }}>DimDim</span>
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: '-0.5px',
              color: 'var(--text-primary)',
              marginBottom: 6,
            }}
          >
            Boas-vindas
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
            Entre com sua conta Google para acessar seu painel financeiro.
          </p>

          {/* Feature list */}
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
            {FEATURES.map(f => (
              <li key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                <span
                  style={{
                    width: 18, height: 18, borderRadius: '50%',
                    border: '1.5px solid #22c55e',
                    background: 'rgba(34,197,94,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="9" height="9" viewBox="0 0 12 12">
                    <polyline points="2,6 5,9 10,3" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                {f.text}
              </li>
            ))}
          </ul>

          {/* Google button */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex w-full items-center justify-center gap-3 transition-all"
            style={{
              padding: '13px 20px',
              borderRadius: 12,
              border: '1.5px solid var(--border)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: 15,
              fontWeight: 500,
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.borderColor = '#22c55e'
              el.style.boxShadow = '0 4px 16px rgba(34,197,94,0.15)'
              el.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.borderColor = 'var(--border)'
              el.style.boxShadow = 'none'
              el.style.transform = 'translateY(0)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Entrar com Google
          </button>

          <p style={{ marginTop: 20, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
            Ao entrar, você concorda com os{' '}
            <a href="#" style={{ color: '#22c55e', textDecoration: 'none' }}>Termos de uso</a>
            {' '}e{' '}
            <a href="#" style={{ color: '#22c55e', textDecoration: 'none' }}>Política de privacidade</a>.
          </p>
        </div>

        <p style={{ position: 'absolute', bottom: 20, fontSize: 12, color: 'var(--text-muted)' }}>
          MeuDimDim © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
