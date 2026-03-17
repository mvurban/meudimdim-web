'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { AppShell } from '@/components/layout/AppShell'
import { deleteUserData } from '@/lib/mock-store'

export default function ExcluirContaPage() {
  const { data: session } = useSession()
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    const email = session?.user?.email
    if (!email) return
    setLoading(true)
    deleteUserData(email)
    await signOut({ callbackUrl: '/' })
  }

  return (
    <AppShell>
      <div style={{ maxWidth: 560 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
          Excluir conta
        </h1>
        <p style={{ margin: '0 0 28px', fontSize: 13, color: 'var(--text-muted)' }}>
          Zona de perigo — leia com atenção antes de continuar
        </p>

        <div style={{
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#ef4444' }}>
              Esta ação é permanente e irreversível
            </p>
          </div>

          <p style={{ margin: '0 0 12px', fontSize: 13.5, color: 'var(--text-primary)', lineHeight: 1.6 }}>
            Ao confirmar, os seguintes dados serão <strong>excluídos permanentemente</strong> e não poderão ser recuperados:
          </p>

          <ul style={{ margin: '0 0 16px', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Todos os seus produtos e lançamentos mensais',
              'Suas categorias e classes de ativo personalizadas',
              'Suas instituições financeiras cadastradas',
              'Seu histórico de dividendos e rentabilidade',
            ].map(item => (
              <li key={item} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {item}
              </li>
            ))}
          </ul>

          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Você poderá fazer login novamente, mas começará com uma conta limpa com os dados padrão.
          </p>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
        }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={e => setConfirmed(e.target.checked)}
              style={{ marginTop: 2, width: 16, height: 16, cursor: 'pointer', accentColor: '#ef4444' }}
            />
            <span style={{ fontSize: 13.5, color: 'var(--text-primary)', lineHeight: 1.5 }}>
              Entendo que esta ação é definitiva e que todos os meus dados serão excluídos permanentemente.
            </span>
          </label>
        </div>

        <button
          onClick={handleDelete}
          disabled={!confirmed || loading}
          style={{
            padding: '10px 24px',
            borderRadius: 8,
            border: 'none',
            background: confirmed && !loading ? '#ef4444' : 'rgba(239,68,68,0.3)',
            color: confirmed && !loading ? '#fff' : 'rgba(255,255,255,0.4)',
            fontSize: 14,
            fontWeight: 600,
            cursor: confirmed && !loading ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s',
          }}
        >
          {loading ? 'Excluindo...' : 'Excluir minha conta'}
        </button>
      </div>
    </AppShell>
  )
}
