'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { AcoesImportModal } from '@/components/acoes/AcoesImportModal'
import { DividendosImportModal } from '@/components/acoes/DividendosImportModal'
import { api } from '@/lib/api'
import type { Institution, AssetClass } from '@/types'

interface AcaoItem { id: string; ticker: string }

export default function ImportarAcoesPage() {
  const router = useRouter()
  const [institutions, setInstitutions]   = useState<Institution[]>([])
  const [assetClasses, setAssetClasses]   = useState<AssetClass[]>([])
  const [acoes, setAcoes]                 = useState<AcaoItem[]>([])
  const [modal, setModal]                 = useState<'acoes' | 'dividendos' | null>(null)

  useEffect(() => {
    Promise.all([
      api.get<Institution[]>('/api/institutions'),
      api.get<AssetClass[]>('/api/assetclasses'),
      api.get<AcaoItem[]>('/api/acoes'),
    ]).then(([insts, acs, ac]) => {
      setInstitutions(insts)
      setAssetClasses(acs.filter(a => a.isAcao))
      setAcoes(ac)
    }).catch(() => {})
  }, [])

  function handleImport() {
    setModal(null)
    router.push('/acoes')
  }

  return (
    <AppShell>
      <div className="space-y-6" style={{ maxWidth: 760 }}>

        {/* Header */}
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Importar Ações
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Escolha o que deseja importar via arquivo .csv
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Card Ações */}
          <div className="card space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: 'var(--brand-subtle)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <div className="space-y-1">
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>Importar Ações</div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Cadastre vários tickers de uma vez com ticker, instituição, tipo, quantidade e preço médio.
                  Instituições e classes de ativo novas são criadas automaticamente.
                </p>
              </div>
            </div>
            <div className="rounded-lg p-3 text-xs space-y-1" style={{ background: 'var(--bg-elevated)' }}>
              <div className="font-medium" style={{ color: 'var(--text-primary)' }}>Colunas obrigatórias:</div>
              <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono, monospace)' }}>
                ticker, instituicao, tipo_acao, quantidade, preco_medio
              </div>
            </div>
            <button className="btn-brand" onClick={() => setModal('acoes')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Importar Ações
            </button>
          </div>

          {/* Card Dividendos */}
          <div className="card space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: 'var(--brand-subtle)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="space-y-1">
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>Importar Dividendos</div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Importe o histórico de dividendos de ações já cadastradas. Os registros são adicionados aos existentes.
                </p>
              </div>
            </div>
            <div className="rounded-lg p-3 text-xs space-y-1" style={{ background: 'var(--bg-elevated)' }}>
              <div className="font-medium" style={{ color: 'var(--text-primary)' }}>Colunas obrigatórias:</div>
              <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono, monospace)' }}>
                ticker, data, dividendo
              </div>
              <div className="font-medium mt-1" style={{ color: 'var(--text-primary)' }}>Opcionais:</div>
              <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono, monospace)' }}>
                jcp, outros
              </div>
            </div>
            <button
              className="btn-brand"
              onClick={() => setModal('dividendos')}
              disabled={acoes.length === 0}
              title={acoes.length === 0 ? 'Cadastre ações primeiro' : undefined}
              style={{ opacity: acoes.length === 0 ? 0.5 : 1 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Importar Dividendos
            </button>
          </div>

        </div>
      </div>

      {modal === 'acoes' && (
        <AcoesImportModal
          institutions={institutions}
          assetClasses={assetClasses}
          acoes={acoes}
          onCancel={() => setModal(null)}
          onImport={handleImport}
        />
      )}

      {modal === 'dividendos' && (
        <DividendosImportModal
          acoes={acoes}
          onCancel={() => setModal(null)}
          onImport={handleImport}
        />
      )}
    </AppShell>
  )
}
