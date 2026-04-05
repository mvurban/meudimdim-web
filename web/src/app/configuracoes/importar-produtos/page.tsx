'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { ImportModal } from '@/components/produtos/ImportModal'
import { ColumnMappingModal } from '@/components/produtos/ColumnMappingModal'
import type { ImportResult } from '@/lib/csv-import'
import { api } from '@/lib/api'
import type { Category, AssetClass, Institution, Region, LiquidityOption, Product } from '@/types'

interface SaveProgress {
  step: string
}

export default function ImportarProdutosPage() {
  const router = useRouter()
  const mountedRef = useRef(true)
  const [categories, setCategories]             = useState<Category[]>([])
  const [assetClasses, setAssetClasses]         = useState<AssetClass[]>([])
  const [institutions, setInstitutions]         = useState<Institution[]>([])
  const [regions, setRegions]                   = useState<Region[]>([])
  const [liquidityOptions, setLiquidityOptions] = useState<LiquidityOption[]>([])
  const [existingProducts, setExistingProducts] = useState<Product[]>([])
  const [modal, setModal]                       = useState<'csv' | 'mapping' | null>(null)
  const [saveProgress, setSaveProgress]         = useState<SaveProgress | null>(null)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  // Avisa ao fechar/recarregar a aba enquanto salva
  useEffect(() => {
    if (!saveProgress) return
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [!!saveProgress])

  useEffect(() => {
    Promise.all([
      api.get<Category[]>('/api/categories'),
      api.get<AssetClass[]>('/api/assetclasses'),
      api.get<Institution[]>('/api/institutions'),
      api.get<Region[]>('/api/regions'),
      api.get<LiquidityOption[]>('/api/liquidity'),
      api.get<Product[]>('/api/products'),
    ]).then(([cats, acs, insts, regs, liqs, prods]) => {
      setCategories(cats)
      setAssetClasses(acs)
      setInstitutions(insts)
      setRegions(regs)
      setLiquidityOptions(liqs)
      setExistingProducts(prods)
    }).catch(() => {})
  }, [])

  async function handleImport(result: ImportResult) {
    setModal(null)

    const step = (s: string) => { if (mountedRef.current) setSaveProgress({ step: s }) }

    step('Criando tabelas auxiliares…')
    try {
      // 1. Novas categorias (paralelo)
      const catMap: Record<string, string> = {}
      await Promise.all(result.newCategories.map(async cat => {
        const created = await api.post<Category>('/api/categories', { name: cat.name, color: cat.color })
        catMap[cat.id] = created.id
      }))

      // 2. Novas classes de ativo (paralelo, depende de catMap)
      const acMap: Record<string, string> = {}
      await Promise.all(result.newAssetClasses.map(async ac => {
        const created = await api.post<AssetClass>('/api/assetclasses', {
          name: ac.name,
          categoryId: catMap[ac.categoryId] ?? ac.categoryId,
        })
        acMap[ac.id] = created.id
      }))

      // 3. Instituições, regiões e liquidez (paralelo entre si)
      const instMap: Record<string, string> = {}
      const regionMap: Record<string, string> = {}
      const liqMap: Record<string, string> = {}
      await Promise.all([
        ...result.newInstitutions.map(async inst => {
          const created = await api.post<Institution>('/api/institutions', { name: inst.name })
          instMap[inst.id] = created.id
        }),
        ...result.newRegions.map(async region => {
          const created = await api.post<Region>('/api/regions', { name: region.name })
          regionMap[region.id] = created.id
        }),
        ...result.newLiquidityOptions.map(async liq => {
          const created = await api.post<LiquidityOption>('/api/liquidity', { name: liq.name })
          liqMap[liq.id] = created.id
        }),
      ])

      // 4. Produtos em bulk — reutiliza ID se nome + instituição já existirem
      step(`Salvando ${result.products.length} produto${result.products.length !== 1 ? 's' : ''}…`)
      const productMap: Record<string, string> = {}
      const newProducts: typeof result.products = []

      for (const p of result.products) {
        const resolvedInstId = instMap[p.institutionId] ?? p.institutionId
        const found = existingProducts.find(ep =>
          ep.name.toLowerCase() === p.name.toLowerCase() &&
          ep.institutionId === resolvedInstId
        )
        if (found) {
          productMap[p.id] = found.id
        } else {
          newProducts.push(p)
        }
      }

      if (newProducts.length > 0) {
        const created = await api.post<Product[]>('/api/products/bulk', {
          products: newProducts.map(p => ({
            name:          p.name,
            cnpj:          p.cnpj,
            categoryId:    catMap[p.categoryId]             ?? p.categoryId,
            assetClassId:  acMap[p.assetClassId]            ?? p.assetClassId,
            institutionId: instMap[p.institutionId]         ?? p.institutionId,
            regionId:      regionMap[p.regionId]            ?? p.regionId,
            liquidityId:   liqMap[p.liquidityId]            ?? p.liquidityId,
            currency:      p.currency,
            details:       p.details,
          })),
        })
        newProducts.forEach((p, i) => { productMap[p.id] = created[i].id })
      }

      // 5. Entradas em bulk — a API ordena cronologicamente e calcula returnPct
      step(`Salvando ${result.entries.length} entrada${result.entries.length !== 1 ? 's' : ''}…`)
      await api.post('/api/entries/bulk', {
        entries: result.entries.map(e => ({
          productId:     productMap[e.productId] ?? e.productId,
          month:         e.month,
          year:          e.year,
          contribution:  e.contribution,
          withdrawal:    e.withdrawal,
          valueOriginal: e.valueOriginal,
          valueBrl:      e.valueBrl,
          valueUsd:      e.valueUsd,
          exchangeRate:  e.exchangeRate,
        })),
      })

      if (mountedRef.current) {
        router.push('/produtos')
      }
    } catch {
      if (mountedRef.current) setSaveProgress(null)
    }
  }

  const sharedProps = { categories, assetClasses, institutions, regions, liquidityOptions }

  return (
    <AppShell>
      <div className="space-y-6" style={{ maxWidth: 760 }}>

        {/* Header */}
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Importar Produtos
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Escolha como deseja importar seus produtos via arquivo .csv
          </p>
        </div>

        {saveProgress && (
          <div className="rounded-lg p-4 space-y-2" style={{ background: 'var(--brand-subtle)', border: '1px solid var(--brand-border)' }}>
            <div className="flex items-center gap-3">
              <svg className="animate-spin flex-shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {saveProgress.step}
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Não feche esta aba. Se sair agora, o salvamento continuará em segundo plano, mas você pode ser redirecionado inesperadamente ao concluir.
            </p>
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Card CSV Padrão */}
          <div className="card flex flex-col">
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
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>CSV Padrão</div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Use o modelo pronto do sistema. Baixe o arquivo de exemplo, preencha com seus dados e faça o upload.
                  Categorias e instituições novas são criadas automaticamente.
                </p>
              </div>
            </div>
            <div className="rounded-lg p-3 text-xs space-y-1 mt-4 flex-1" style={{ background: 'var(--bg-elevated)' }}>
              <div className="font-medium" style={{ color: 'var(--text-primary)' }}>Colunas obrigatórias:</div>
              <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono, monospace)' }}>
                nome, categoria, classe_ativo, instituicao, mes, ano, valor_brl
              </div>
            </div>
            <button className="btn-brand mt-4" disabled={!!saveProgress} onClick={() => setModal('csv')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Importar via CSV
            </button>
          </div>

          {/* Card Relacionar Colunas */}
          <div className="card flex flex-col">
            <div className="flex items-start gap-4">
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                style={{ background: 'var(--brand-subtle)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
              </div>
              <div className="space-y-1">
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>Relacionar Colunas</div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Funciona com qualquer planilha. Faça upload do seu arquivo e escolha quais colunas
                  correspondem a cada campo do sistema.
                </p>
              </div>
            </div>
            <div className="rounded-lg p-3 text-xs space-y-1 mt-4 flex-1" style={{ background: 'var(--bg-elevated)' }}>
              <div className="font-medium" style={{ color: 'var(--text-primary)' }}>Como funciona:</div>
              <div style={{ color: 'var(--text-secondary)' }}>
                Suba qualquer CSV → o sistema detecta as colunas → você relaciona cada campo → importação concluída.
              </div>
            </div>
            <button className="btn-brand mt-4" disabled={!!saveProgress} onClick={() => setModal('mapping')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              Selecionar arquivo
            </button>
          </div>

        </div>
      </div>

      {modal === 'csv' && (
        <ImportModal
          {...sharedProps}
          onCancel={() => setModal(null)}
          onImport={handleImport}
        />
      )}

      {modal === 'mapping' && (
        <ColumnMappingModal
          {...sharedProps}
          onCancel={() => setModal(null)}
          onImport={handleImport}
        />
      )}
    </AppShell>
  )
}
