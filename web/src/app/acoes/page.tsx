'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { getAcoes, setAcoes, getInstitutions, getAssetClasses, mockPrecos, getStockDividends, setStockDividends, getUserPrefs, setUserPrefs, upsertAggregatedProducts, getLastRefresh } from '@/lib/mock-store'
import type { AcaoItem, UserPrefs } from '@/lib/mock-store'
import type { Institution, AssetClass, StockDividend } from '@/types'
import { AcaoDividendModal } from '@/components/acoes/AcaoDividendModal'
import { RefreshModal } from '@/components/acoes/RefreshModal'

type FormState = {
  ticker: string
  institutionId: string
  assetClassId: string
  quantidade: string
  precoMedio: string
}

const EMPTY: FormState = { ticker: '', institutionId: '', assetClassId: '', quantidade: '', precoMedio: '' }

function fmt(value: number) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function parseBRL(value: string): number {
  return parseFloat(value.replace(',', '.')) || 0
}

const REFRESH_THRESHOLD_MS = 15 * 60 * 1000 // 15 minutos
const FAKE_ERROR_RATE = 0.18

function shouldAutoRefresh(lastRefresh: string | null): boolean {
  if (!lastRefresh) return true
  return Date.now() - new Date(lastRefresh).getTime() > REFRESH_THRESHOLD_MS
}

function formatRefreshTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'agora mesmo'
  if (diffMin < 60) return `há ${diffMin} min`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `há ${diffH}h`
  return d.toLocaleDateString('pt-BR')
}

function initials(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return name.slice(0, 2).toUpperCase()
  return words.map(w => w[0]).join('').slice(0, 3).toUpperCase()
}

export default function AcoesPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [items, setItemsState] = useState<AcaoItem[]>([])
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [assetClasses, setAssetClassesState] = useState<AssetClass[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [dividendAcao, setDividendAcao] = useState<string | null>(null)
  const [stockDividends, setStockDividendsState] = useState<StockDividend[]>([])
  const [institutionFilter, setInstitutionFilter] = useState(searchParams.get('institution') ?? '')
  const [assetClassFilter, setAssetClassFilter] = useState(searchParams.get('assetClass') ?? '')
  const [tickerSearch, setTickerSearch] = useState('')
  const [removeModal, setRemoveModal] = useState<{ id: string; ticker: string } | null>(null)
  const [pageSize, setPageSizeState] = useState<UserPrefs['acoesPageSize']>(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [showRefreshModal, setShowRefreshModal] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<string | null>(null)
  const [refreshSummary, setRefreshSummary] = useState<{ tickers: number; products: number } | null>(null)
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false)

  const email = session?.user?.email ?? null

  useEffect(() => {
    if (!email) return
    const loadedItems = getAcoes(email)
    setItemsState(loadedItems)
    setInstitutions(getInstitutions(email))
    setAssetClassesState(getAssetClasses(email).filter(ac => ac.isAcao))
    setStockDividendsState(getStockDividends(email))
    setPageSizeState(getUserPrefs(email).acoesPageSize)
    const lr = getLastRefresh(email)
    setLastRefresh(lr)
    // Auto-refresh ao carregar se > 15 min ou nunca atualizado
    if (shouldAutoRefresh(lr) && loadedItems.length > 0) {
      runSilentRefresh(loadedItems, email)
    }
  }, [email]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh ao retornar à aba
  useEffect(() => {
    if (!email) return
    function onVisibility() {
      if (document.visibilityState !== 'visible') return
      const lr = getLastRefresh(email!)
      if (!shouldAutoRefresh(lr)) return
      const current = getAcoes(email!)
      if (current.length > 0) runSilentRefresh(current, email!)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [email]) // eslint-disable-line react-hooks/exhaustive-deps

  function setItems(updater: AcaoItem[] | ((prev: AcaoItem[]) => AcaoItem[])) {
    setItemsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      if (email) setAcoes(email, next)
      return next
    })
  }

  function getInstitution(id: string) {
    return institutions.find(i => i.id === id)
  }

  function saveDividends(acaoId: string, updated: StockDividend[]) {
    const others = stockDividends.filter(d => d.acaoId !== acaoId)
    const next = [...others, ...updated]
    setStockDividendsState(next)
    if (email) setStockDividends(email, next)
  }

  function dividendTotalFor(acaoId: string) {
    return stockDividends
      .filter(d => d.acaoId === acaoId)
      .reduce((s, d) => s + d.dividendo + d.jcp + d.outros, 0)
  }

  function startAdd() {
    setEditing(null)
    setForm({ ...EMPTY, institutionId: institutions[0]?.id ?? '', assetClassId: assetClasses[0]?.id ?? '' })
    setAdding(true)
  }

  function startEdit(item: AcaoItem) {
    setAdding(false)
    setForm({
      ticker: item.ticker,
      institutionId: item.institutionId,
      assetClassId: item.assetClassId,
      quantidade: String(item.quantidade),
      precoMedio: fmt(item.precoMedio),
    })
    setEditing(item.id)
  }

  function cancel() {
    setAdding(false)
    setEditing(null)
    setForm(EMPTY)
  }

  function save() {
    const ticker = form.ticker.trim().toUpperCase()
    const quantidade = parseInt(form.quantidade) || 0
    const precoMedio = parseBRL(form.precoMedio)
    if (!ticker || !form.institutionId || !form.assetClassId || quantidade <= 0 || precoMedio <= 0) return

    const existente = items.find(a => a.id === editing)
    const precos = existente
      ? { precoFechamento: existente.precoFechamento, precoAtual: existente.precoAtual }
      : mockPrecos(precoMedio)

    const item: AcaoItem = {
      id: editing ?? `a${Date.now()}`,
      ticker,
      institutionId: form.institutionId,
      assetClassId: form.assetClassId,
      quantidade,
      precoMedio,
      ...precos,
    }

    const newAcoes = adding
      ? [...items, item]
      : items.map(a => a.id === editing ? item : a)
    saveAcoesAndRecalc(newAcoes)
    cancel()
  }

  function confirmRemove() {
    if (!removeModal) return
    const newAcoes = items.filter(a => a.id !== removeModal.id)
    saveAcoesAndRecalc(newAcoes)
    setRemoveModal(null)
  }

  // Persiste acoes e recalcula agregados com os preços já em cache (sem Yahoo Finance)
  function saveAcoesAndRecalc(newAcoes: AcaoItem[]) {
    if (!email) return
    setAcoes(email, newAcoes)
    setItemsState(newAcoes)
    try {
      const now = new Date()
      upsertAggregatedProducts(email, now.getMonth() + 1, now.getFullYear())
    } catch (e) {
      console.error('Erro ao recalcular agregados:', e)
    }
  }

  function changePageSize(size: UserPrefs['acoesPageSize']) {
    setPageSizeState(size)
    setCurrentPage(1)
    if (email) setUserPrefs(email, { acoesPageSize: size })
  }

  // Aplica novos preços, persiste e cria agregados — compartilhado entre modal e refresh silencioso
  function applyRefreshResults(
    currentAcoes: AcaoItem[],
    updated: { id: string; precoFechamento: number; precoAtual: number }[],
    emailParam: string,
  ): { upserted: number } {
    const updatedAcoes = currentAcoes.map(a => {
      const u = updated.find(r => r.id === a.id)
      return u ? { ...a, precoFechamento: u.precoFechamento, precoAtual: u.precoAtual } : a
    })
    setAcoes(emailParam, updatedAcoes)
    setItemsState(updatedAcoes)
    const nowIso = new Date().toISOString()
    localStorage.setItem(`mdd_${emailParam}_lastRefresh`, nowIso)
    setLastRefresh(nowIso)
    let upserted = 0
    try {
      const now = new Date()
      const result = upsertAggregatedProducts(emailParam, now.getMonth() + 1, now.getFullYear())
      upserted = result.upserted
    } catch (e) {
      console.error('Erro ao criar produtos agregados:', e)
    }
    return { upserted }
  }

  // Callback do modal de cotações (com progresso visual)
  function handleRefreshDone(updated: { id: string; precoFechamento: number; precoAtual: number }[]) {
    if (!email) return
    const { upserted } = applyRefreshResults(items, updated, email)
    setRefreshSummary({ tickers: updated.length, products: upserted })
  }

  // Refresh silencioso — sem modal, sem delay por ticker
  function runSilentRefresh(currentAcoes: AcaoItem[], emailParam: string) {
    setIsAutoRefreshing(true)
    const updated = currentAcoes
      .filter(() => Math.random() >= FAKE_ERROR_RATE)
      .map(a => {
        const { precoFechamento, precoAtual } = mockPrecos(a.precoFechamento || a.precoMedio)
        return { id: a.id, precoFechamento, precoAtual }
      })
    applyRefreshResults(currentAcoes, updated, emailParam)
    setIsAutoRefreshing(false)
  }

  const filteredItems = items.filter(a => {
    if (institutionFilter && a.institutionId !== institutionFilter) return false
    if (assetClassFilter && a.assetClassId !== assetClassFilter) return false
    if (tickerSearch && !a.ticker.startsWith(tickerSearch.toUpperCase())) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const pagedItems = filteredItems.slice((safePage - 1) * pageSize, safePage * pageSize)

  const totalInvestido = filteredItems.reduce((s, a) => s + a.quantidade * a.precoMedio, 0)
  const totalAtual = filteredItems.reduce((s, a) => s + a.quantidade * (a.precoAtual || a.precoMedio), 0)
  const rendimentoTotal = totalInvestido > 0 ? ((totalAtual / totalInvestido) - 1) * 100 : 0

  return (
    <AppShell>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Ações</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
            Carteira de ações e FIIs
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          {/* Botão atualizar com timestamp abaixo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <button
              onClick={() => { setRefreshSummary(null); setShowRefreshModal(true) }}
              disabled={items.length === 0}
              style={{
                ...btnStyle('var(--bg-elevated)'),
                display: 'flex', alignItems: 'center', gap: 6,
                opacity: items.length === 0 ? 0.4 : 1,
                cursor: items.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Atualizar cotações
            </button>
            {(lastRefresh || isAutoRefreshing) && (
              <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                {isAutoRefreshing ? (
                  <>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
                      <polyline points="23 4 23 10 17 10" />
                      <polyline points="1 20 1 14 7 14" />
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                    Atualizando...
                  </>
                ) : (
                  `Última atualização: ${formatRefreshTime(lastRefresh!)}`
                )}
              </span>
            )}
          </div>
          <button onClick={startAdd} style={btnStyle('#22c55e')}>+ Adicionar</button>
        </div>
      </div>

      {/* Totalizadores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <SummaryCard label="Total investido" value={`R$ ${fmt(totalInvestido)}`} />
        <SummaryCard label="Valor atual" value={`R$ ${fmt(totalAtual)}`} />
        <SummaryCard
          label="Rendimento total"
          value={`${rendimentoTotal >= 0 ? '+' : ''}${fmt(rendimentoTotal)}%`}
          color={rendimentoTotal >= 0 ? '#22c55e' : '#ef4444'}
        />
      </div>

      {/* Filtros + busca */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        <select value={institutionFilter} onChange={e => { setInstitutionFilter(e.target.value); setCurrentPage(1) }} style={filterSelectStyle}>
          <option value="">Todas instituições</option>
          {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
        <select value={assetClassFilter} onChange={e => { setAssetClassFilter(e.target.value); setCurrentPage(1) }} style={filterSelectStyle}>
          <option value="">Todos tipos</option>
          {assetClasses.map(ac => <option key={ac.id} value={ac.id}>{ac.name}</option>)}
        </select>
        <div style={{ position: 'relative', marginLeft: 'auto' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={tickerSearch}
            onChange={e => { setTickerSearch(e.target.value); setCurrentPage(1) }}
            placeholder="Buscar ticker..."
            style={{ ...filterSelectStyle, paddingLeft: 28, paddingRight: tickerSearch ? 28 : 10, width: 160 }}
          />
          {tickerSearch && (
            <button
              onClick={() => setTickerSearch('')}
              style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2, display: 'flex', alignItems: 'center' }}
              title="Limpar busca"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Formulário */}
      {(adding || editing) && (
        <div style={cardStyle}>
          <p style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            {adding ? 'Nova Ação' : 'Editar Ação'}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <Field label="Ticker" width={100}>
              <input
                value={form.ticker}
                onChange={e => setForm(f => ({ ...f, ticker: e.target.value.toUpperCase() }))}
                placeholder="PETR4"
                maxLength={8}
                style={{ ...inputStyle, textTransform: 'uppercase', fontWeight: 600 }}
              />
            </Field>
            <Field label="Tipo" width={120}>
              <select
                value={form.assetClassId}
                onChange={e => setForm(f => ({ ...f, assetClassId: e.target.value }))}
                style={inputStyle}
              >
                <option value="">Selecione...</option>
                {assetClasses.map(ac => (
                  <option key={ac.id} value={ac.id}>{ac.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Instituição" width={180}>
              <select
                value={form.institutionId}
                onChange={e => setForm(f => ({ ...f, institutionId: e.target.value }))}
                style={inputStyle}
              >
                <option value="">Selecione...</option>
                {institutions.map(i => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Quantidade" width={110}>
              <input
                type="number"
                value={form.quantidade}
                onChange={e => setForm(f => ({ ...f, quantidade: e.target.value }))}
                placeholder="100"
                min={1}
                style={inputStyle}
              />
            </Field>
            <Field label="Preço Médio de Compra (R$)" width={200}>
              <input
                value={form.precoMedio}
                onChange={e => setForm(f => ({ ...f, precoMedio: e.target.value }))}
                placeholder="26,40"
                style={inputStyle}
              />
            </Field>
            <div style={{ display: 'flex', gap: 8, paddingBottom: 1 }}>
              <button onClick={save} style={btnStyle('#22c55e')}>Salvar</button>
              <button onClick={cancel} style={btnStyle('var(--bg-elevated)')}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal dividendos */}
      {dividendAcao && (() => {
        const acao = items.find(a => a.id === dividendAcao)
        if (!acao) return null
        return (
          <AcaoDividendModal
            acaoId={acao.id}
            ticker={acao.ticker}
            dividends={stockDividends.filter(d => d.acaoId === acao.id)}
            onClose={() => setDividendAcao(null)}
            onSave={updated => saveDividends(acao.id, updated)}
          />
        )
      })()}

      {/* Modal atualizar cotações */}
      {showRefreshModal && (
        <RefreshModal
          acoes={items}
          onDone={handleRefreshDone}
          summary={refreshSummary}
          onClose={() => setShowRefreshModal(false)}
        />
      )}

      {/* Tabela */}
      <div style={cardStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <Th>Ação</Th>
              <Th align="right">Qtd</Th>
              <Th align="right">Preço Médio</Th>
              <Th align="right">P. Fechamento</Th>
              <Th align="right">Preço Atual</Th>
              <Th align="right">Valor Total</Th>
              <Th align="right">Rendimento</Th>
              <Th align="right">Dividendos</Th>
              <Th align="right">Ações</Th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '32px 0', fontSize: 13, color: 'var(--text-muted)' }}>
                  {items.length === 0 ? 'Nenhuma ação cadastrada' : 'Nenhum resultado para os filtros selecionados'}
                </td>
              </tr>
            )}
            {pagedItems.map(item => {
              const inst = getInstitution(item.institutionId)
              const precoRef = item.precoAtual || item.precoMedio
              const valorTotal = item.quantidade * precoRef
              const rendimento = ((precoRef / item.precoMedio) - 1) * 100
              const positivo = rendimento >= 0
              const divTotal = dividendTotalFor(item.id)

              return (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {inst && (
                        <span
                          title={inst.name}
                          style={{
                            display: 'inline-block',
                            padding: '2px 7px',
                            borderRadius: 5,
                            background: 'rgba(255,255,255,0.06)',
                            color: 'var(--text-muted)',
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: '0.5px',
                            flexShrink: 0,
                            cursor: 'default',
                          }}>
                          {initials(inst.name)}
                        </span>
                      )}
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: 6,
                        background: 'rgba(34,197,94,0.1)',
                        color: '#22c55e',
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                      }}>
                        {item.ticker}
                      </span>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    {item.quantidade.toLocaleString('pt-BR')}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    R$ {fmt(item.precoMedio)}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', color: item.precoFechamento > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {item.precoFechamento > 0 ? `R$ ${fmt(item.precoFechamento)}` : '—'}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', color: item.precoAtual > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {item.precoAtual > 0 ? `R$ ${fmt(item.precoAtual)}` : '—'}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 500 }}>
                    R$ {fmt(valorTotal)}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <span style={{ color: positivo ? '#22c55e' : '#ef4444', fontWeight: 600, fontSize: 13 }}>
                      {positivo ? '▲' : '▼'} {Math.abs(rendimento).toFixed(2)}%
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', color: divTotal > 0 ? 'var(--success)' : 'var(--text-muted)', fontWeight: divTotal > 0 ? 600 : 400 }}>
                    {divTotal > 0 ? `R$ ${fmt(divTotal)}` : '—'}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <button onClick={() => setDividendAcao(item.id)} style={actionBtn} title="Dividendos"><IconDividend /></button>
                    <button onClick={() => startEdit(item)} style={actionBtn} title="Editar"><IconEdit /></button>
                    <button onClick={() => setRemoveModal({ id: item.id, ticker: item.ticker })} style={{ ...actionBtn, color: 'var(--danger)' }} title="Excluir"><IconTrash /></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {filteredItems.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {((safePage - 1) * pageSize) + 1}–{Math.min(safePage * pageSize, filteredItems.length)} de {filteredItems.length}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              style={pageBtn(safePage === 1)}
            >‹</button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
              .reduce<(number | '...')[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...')
                acc.push(p)
                return acc
              }, [])
              .map((p, i) => p === '...'
                ? <span key={`ellipsis-${i}`} style={{ fontSize: 13, color: 'var(--text-muted)', padding: '0 4px' }}>…</span>
                : <button key={p} onClick={() => setCurrentPage(p as number)} style={pageBtn(false, p === safePage)}>{p}</button>
              )
            }

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              style={pageBtn(safePage === totalPages)}
            >›</button>

            <div style={{ marginLeft: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Por página:</span>
              <select
                value={pageSize}
                onChange={e => changePageSize(Number(e.target.value) as UserPrefs['acoesPageSize'])}
                style={filterSelectStyle}
              >
                {([10, 20, 50, 100] as UserPrefs['acoesPageSize'][]).map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {removeModal && createPortal(
        <div style={overlayStyle} onClick={() => setRemoveModal(null)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: '#ef444420', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconTrashLg />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Remover ação</p>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>{removeModal.ticker}</p>
              </div>
            </div>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Essa ação é permanente e não pode ser desfeita.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setRemoveModal(null)} style={btnStyle('var(--bg-elevated)')}>Cancelar</button>
              <button onClick={confirmRemove} style={btnStyle('#ef4444')}>Remover</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </AppShell>
  )
}

// ── Sub-componentes ──────────────────────────

function SummaryCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ ...cardStyle, marginBottom: 0, padding: '16px 20px' }}>
      <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: color ?? 'var(--text-primary)' }}>
        {value}
      </p>
    </div>
  )
}

function Field({ label, width, children }: { label: string; width?: number; children: React.ReactNode }) {
  return (
    <div style={{ width: width ?? 'auto' }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, letterSpacing: '0.5px' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function Th({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <th style={{
      textAlign: align,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      padding: '0 0 10px',
      paddingRight: align === 'right' ? 0 : 12,
      paddingLeft: align === 'right' ? 12 : 0,
    }}>
      {children}
    </th>
  )
}

// ── Styles ───────────────────────────────────

const overlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, zIndex: 50,
  background: 'rgba(0,0,0,0.6)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

const modalStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 14,
  padding: 24,
  width: 420,
  maxWidth: 'calc(100vw - 32px)',
}

const cardStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: 20,
  marginBottom: 16,
}

const tdStyle: React.CSSProperties = {
  fontSize: 13.5,
  color: 'var(--text-primary)',
  padding: '10px 0',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: 'var(--bg-elevated)',
  color: 'var(--text-primary)',
  fontSize: 13.5,
  outline: 'none',
  boxSizing: 'border-box',
}

function btnStyle(bg: string): React.CSSProperties {
  return {
    padding: '8px 16px',
    borderRadius: 8,
    border: 'none',
    background: bg,
    color: bg === '#22c55e' ? '#0d1117' : 'var(--text-primary)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  }
}

function pageBtn(disabled: boolean, active = false): React.CSSProperties {
  return {
    minWidth: 30, height: 30, padding: '0 8px',
    borderRadius: 6, border: '1px solid var(--border)',
    background: active ? 'var(--brand)' : 'var(--bg-elevated)',
    color: active ? '#0d1117' : disabled ? 'var(--text-muted)' : 'var(--text-primary)',
    fontSize: 13, fontWeight: active ? 700 : 400,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
  }
}

const filterSelectStyle: React.CSSProperties = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--text-primary)',
  fontSize: 13,
  padding: '6px 10px',
  outline: 'none',
  cursor: 'pointer',
}

const actionBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: 12,
  color: 'var(--text-muted)',
  cursor: 'pointer',
  padding: '2px 8px',
}

function IconDividend() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function IconTrashLg() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}
