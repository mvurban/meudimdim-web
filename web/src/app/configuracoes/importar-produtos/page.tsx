'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { ImportModal } from '@/components/produtos/ImportModal'
import type { ImportResult } from '@/lib/csv-import'
import {
  mockCategories,
  mockAssetClasses,
  mockInstitutions,
  mockRegions,
  mockLiquidityOptions,
} from '@/lib/mock-data'
import type { Category, AssetClass, Institution, Region, LiquidityOption } from '@/types'

export default function ImportarProdutosPage() {
  const router = useRouter()
  const [categories]       = useState<Category[]>(mockCategories)
  const [assetClasses]     = useState<AssetClass[]>(mockAssetClasses)
  const [institutions]     = useState<Institution[]>(mockInstitutions)
  const [regions]          = useState<Region[]>(mockRegions)
  const [liquidityOptions] = useState<LiquidityOption[]>(mockLiquidityOptions)
  const [modalOpen, setModalOpen] = useState(false)

  function handleImport(result: ImportResult) {
    setModalOpen(false)
    // navigate to produtos so the user sees the imported data
    router.push('/produtos')
  }

  return (
    <AppShell>
      <div className="space-y-6" style={{ maxWidth: 680 }}>

        {/* Header */}
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Importar Produtos
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Importe vários produtos de uma vez a partir de um arquivo .csv
          </p>
        </div>

        {/* Info card */}
        <div className="card space-y-4">
          <div className="flex items-start gap-4">
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
              style={{ background: 'var(--brand-subtle)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="space-y-1">
              <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Importação via arquivo CSV
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Prepare um arquivo <strong style={{ color: 'var(--text-primary)' }}>.csv</strong> com os dados dos seus produtos.
                O sistema valida o arquivo antes de importar, informa qualquer problema encontrado e cria automaticamente
                categorias, classes de ativo e instituições que ainda não existirem.
              </p>
            </div>
          </div>

          <div
            className="rounded-lg p-4 space-y-2 text-sm"
            style={{ background: 'var(--bg-elevated)' }}
          >
            <div className="font-medium" style={{ color: 'var(--text-primary)' }}>O que acontece durante a importação:</div>
            <ul className="space-y-1" style={{ color: 'var(--text-secondary)' }}>
              <li>· O arquivo é validado — erros são listados antes de qualquer alteração</li>
              <li>· Categorias, classes de ativo e instituições novas são criadas automaticamente</li>
              <li>· Produtos e entradas mensais são adicionados à sua carteira</li>
              <li>· Após confirmar, você é redirecionado para a tela de Produtos</li>
            </ul>
          </div>

          <button className="btn-brand" onClick={() => setModalOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Importar Produtos
          </button>
        </div>

      </div>

      {modalOpen && (
        <ImportModal
          categories={categories}
          assetClasses={assetClasses}
          institutions={institutions}
          regions={regions}
          liquidityOptions={liquidityOptions}
          onCancel={() => setModalOpen(false)}
          onImport={handleImport}
        />
      )}
    </AppShell>
  )
}
