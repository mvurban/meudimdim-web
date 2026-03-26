'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { AppShell } from '@/components/layout/AppShell'
import { SectionCard } from '@/components/dashboard/SectionCard'
import { DropdownFilter } from '@/components/dashboard/DropdownFilter'
import {
  getDividends,
  getStockDividends,
  getProducts,
  getInstitutions,
  getAcoes,
} from '@/lib/mock-store'
import { monthLabel, formatBRL } from '@/lib/utils'
import { useYear, CURRENT_YEAR, CURRENT_MONTH } from '@/lib/year-context'
import type { Dividend, StockDividend, Product, Institution } from '@/types'
import type { AcaoItem } from '@/lib/mock-store'

// ── Tipos ─────────────────────────────────────────────────────────────
interface DetailItem {
  productId: string
  name: string
  institutionId: string
  total: number
  isAggregated: boolean
}

interface MonthRow {
  month: number
  year: number
  label: string
  total: number
  prev: number | null
}

export default function DividendosPage() {
  const { data: session } = useSession()
  const email = session?.user?.email ?? ''
  const { selectedYear } = useYear()

  const [dividends,      setDividendsState]     = useState<Dividend[]>([])
  const [stockDividends, setStockDividendsState] = useState<StockDividend[]>([])
  const [products,       setProductsState]       = useState<Product[]>([])
  const [institutions,   setInstitutionsState]   = useState<Institution[]>([])
  const [acoes,          setAcoesState]          = useState<AcaoItem[]>([])

  const [selInstitutions, setSelInstitutions] = useState<string[]>([])

  // Popup nível 1: detalhe do mês
  const [detailMonth, setDetailMonth] = useState<{ month: number; year: number } | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  // Popup nível 2: drill-down de um produto agregado
  const [drillDown, setDrillDown] = useState<{ productId: string; name: string } | null>(null)
  const drillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!email) return
    const insts = getInstitutions(email)
    setInstitutionsState(insts)
    setSelInstitutions(insts.map(i => i.id))
    setDividendsState(getDividends(email))
    setStockDividendsState(getStockDividends(email))
    setProductsState(getProducts(email))
    setAcoesState(getAcoes(email))
  }, [email])

  // Fechar popup nível 1 ao clicar fora (só se drill-down não estiver aberto)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (drillDown) return
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setDetailMonth(null)
      }
    }
    if (detailMonth) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [detailMonth, drillDown])

  // Fechar drill-down ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (drillRef.current && !drillRef.current.contains(e.target as Node)) {
        setDrillDown(null)
      }
    }
    if (drillDown) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [drillDown])

  // ── Total de dividendos de um mês ─────────────────────────────────
  function totalForMonth(month: number, year: number): number {
    let total = 0
    for (const d of dividends) {
      const [y, m] = d.date.split('-').map(Number)
      if (m !== month || y !== year) continue
      const p = products.find(pr => pr.id === d.productId)
      if (!p) continue
      if (!selInstitutions.includes(p.institutionId)) continue
      total += d.dividendo + d.jcp + d.outros
    }
    // StockDividends sem produto agregado com dividend (evita dupla contagem)
    for (const sd of stockDividends) {
      const [y, m] = sd.date.split('-').map(Number)
      if (m !== month || y !== year) continue
      const acao = acoes.find(a => a.id === sd.acaoId)
      if (!acao) continue
      if (!selInstitutions.includes(acao.institutionId)) continue
      const aggProduct = products.find(
        p => p.isAggregated && p.assetClassId === acao.assetClassId && p.institutionId === acao.institutionId
      )
      const aggHasDividend = aggProduct
        ? dividends.some(d => d.productId === aggProduct.id && d.date.startsWith(`${year}-${String(month).padStart(2, '0')}`))
        : false
      if (!aggHasDividend) total += sd.dividendo + sd.jcp + sd.outros
    }
    return total
  }

  // ── Meses a exibir ────────────────────────────────────────────────
  const months = useMemo<{ month: number; year: number }[]>(() => {
    if (selectedYear === CURRENT_YEAR) {
      const result: { month: number; year: number }[] = []
      for (let i = 0; i < 12; i++) {
        let m = CURRENT_MONTH - i
        let y = CURRENT_YEAR
        if (m <= 0) { m += 12; y -= 1 }
        result.push({ month: m, year: y })
      }
      return result
    }
    return Array.from({ length: 12 }, (_, i) => ({ month: 12 - i, year: selectedYear }))
  }, [selectedYear])

  const rows = useMemo<MonthRow[]>(() => {
    return months.map(({ month, year }) => {
      const total = totalForMonth(month, year)
      let prevM = month - 1, prevY = year
      if (prevM === 0) { prevM = 12; prevY -= 1 }
      const prevTotal = totalForMonth(prevM, prevY)
      return {
        month, year,
        label: monthLabel(month, year, true),
        total,
        prev: prevTotal > 0 ? prevTotal : null,
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [months, dividends, stockDividends, selInstitutions, products, acoes])

  // ── Itens do popup nível 1 ────────────────────────────────────────
  // Mostra produtos (normais e agregados) com dividendos no mês
  const detailItems = useMemo<DetailItem[]>(() => {
    if (!detailMonth) return []
    const { month, year } = detailMonth
    const items: DetailItem[] = []

    for (const d of dividends) {
      const [y, m] = d.date.split('-').map(Number)
      if (m !== month || y !== year) continue
      const p = products.find(pr => pr.id === d.productId)
      if (!p) continue
      if (!selInstitutions.includes(p.institutionId)) continue
      items.push({
        productId: p.id,
        name: p.name,
        institutionId: p.institutionId,
        total: d.dividendo + d.jcp + d.outros,
        isAggregated: !!p.isAggregated,
      })
    }

    // StockDividends sem produto agregado com dividend
    const handled = new Set(items.map(i => i.productId))
    for (const sd of stockDividends) {
      const [y, m] = sd.date.split('-').map(Number)
      if (m !== month || y !== year) continue
      const acao = acoes.find(a => a.id === sd.acaoId)
      if (!acao) continue
      if (!selInstitutions.includes(acao.institutionId)) continue
      const aggProduct = products.find(
        p => p.isAggregated && p.assetClassId === acao.assetClassId && p.institutionId === acao.institutionId
      )
      if (aggProduct && handled.has(aggProduct.id)) continue
      // Agrupa sob o produto agregado (mesmo sem dividend record) ou mostra como ticker avulso
      if (aggProduct) {
        const existing = items.find(i => i.productId === aggProduct.id)
        if (existing) {
          existing.total += sd.dividendo + sd.jcp + sd.outros
        } else {
          items.push({
            productId: aggProduct.id,
            name: aggProduct.name,
            institutionId: aggProduct.institutionId,
            total: sd.dividendo + sd.jcp + sd.outros,
            isAggregated: true,
          })
        }
      } else {
        items.push({
          productId: sd.acaoId,
          name: acao.ticker,
          institutionId: acao.institutionId,
          total: sd.dividendo + sd.jcp + sd.outros,
          isAggregated: false,
        })
      }
    }

    items.sort((a, b) => b.total - a.total)
    return items
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailMonth, dividends, stockDividends, selInstitutions, products, acoes])

  const detailByInstitution = useMemo(() => {
    const map = new Map<string, DetailItem[]>()
    for (const item of detailItems) {
      const list = map.get(item.institutionId) ?? []
      list.push(item)
      map.set(item.institutionId, list)
    }
    return Array.from(map.entries())
      .map(([instId, items]) => ({
        institution: institutions.find(i => i.id === instId),
        items,
        total: items.reduce((s, i) => s + i.total, 0),
      }))
      .sort((a, b) => b.total - a.total)
  }, [detailItems, institutions])

  // ── Itens do drill-down (produto agregado) ────────────────────────
  const drillItems = useMemo(() => {
    if (!drillDown || !detailMonth) return []
    const { month, year } = detailMonth
    const aggProduct = products.find(p => p.id === drillDown.productId)
    if (!aggProduct) return []

    return stockDividends
      .filter(sd => {
        const [y, m] = sd.date.split('-').map(Number)
        if (m !== month || y !== year) return false
        const acao = acoes.find(a => a.id === sd.acaoId)
        return acao && acao.assetClassId === aggProduct.assetClassId && acao.institutionId === aggProduct.institutionId
      })
      .map(sd => {
        const acao = acoes.find(a => a.id === sd.acaoId)!
        return { ticker: acao.ticker, total: sd.dividendo + sd.jcp + sd.outros }
      })
      .sort((a, b) => b.total - a.total)
  }, [drillDown, detailMonth, stockDividends, acoes, products])

  // ── Render ────────────────────────────────────────────────────────
  const thStyle: React.CSSProperties = {
    padding: '10px 14px',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    textAlign: 'left',
    borderBottom: '1px solid var(--border)',
    whiteSpace: 'nowrap',
  }

  const popupShell: React.CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    width: '100%',
    maxWidth: 540,
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  }

  return (
    <AppShell>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
          Dividendos
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
          Consolidado de dividendos, JCP e outros proventos recebidos
        </p>
      </div>

      {/* Filtros */}
      <SectionCard title="Filtros">
        <DropdownFilter
          label="Instituições"
          items={institutions.map(i => ({ id: i.id, name: i.name }))}
          selected={selInstitutions}
          onToggle={id => setSelInstitutions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
          onSelectAll={() => setSelInstitutions(
            selInstitutions.length === institutions.length ? [] : institutions.map(i => i.id)
          )}
        />
      </SectionCard>

      {/* Tabela */}
      <SectionCard>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={thStyle}>Mês/Ano</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Evolução</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Total Dividendos</th>
              </tr>
            </thead>
            <tbody>
              {rows.every(r => r.total === 0) ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: 13 }}>
                    Nenhum dividendo registrado no período
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => {
                  const evolucao = row.prev !== null && row.prev > 0
                    ? ((row.total / row.prev) - 1) * 100
                    : null
                  const positivo = evolucao !== null && evolucao >= 0
                  return (
                    <tr
                      key={idx}
                      onClick={() => row.total > 0 && setDetailMonth({ month: row.month, year: row.year })}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        cursor: row.total > 0 ? 'pointer' : 'default',
                        transition: 'background 0.12s',
                      }}
                      onMouseEnter={e => { if (row.total > 0) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                    >
                      <td style={{ padding: '12px 14px', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {row.label}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        {evolucao === null ? (
                          <span style={{ color: 'var(--text-muted)' }}>—</span>
                        ) : (
                          <span style={{ color: positivo ? '#22c55e' : '#ef4444', fontWeight: 500 }}>
                            {positivo ? '+' : ''}{evolucao.toFixed(1)}%
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 600, color: row.total > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {row.total > 0 ? formatBRL(row.total) : '—'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Popup nível 1: detalhe do mês */}
      {detailMonth && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }}>
          <div ref={popupRef} style={popupShell}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {monthLabel(detailMonth.month, detailMonth.year, true)}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
                  Dividendos recebidos no mês
                </p>
              </div>
              <button
                onClick={() => setDetailMonth(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18, lineHeight: 1, padding: '4px 8px', borderRadius: 6 }}
              >
                ✕
              </button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, padding: '12px 0' }}>
              {detailByInstitution.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: '24px 0' }}>
                  Nenhum detalhe disponível
                </p>
              ) : (
                detailByInstitution.map(({ institution, items, total: instTotal }) => (
                  <div key={institution?.id ?? 'unknown'} style={{ marginBottom: 8 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '6px 20px',
                      background: 'rgba(255,255,255,0.03)',
                      borderTop: '1px solid var(--border)',
                      borderBottom: '1px solid var(--border)',
                    }}>
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                        {institution?.name ?? 'Desconhecida'}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {formatBRL(instTotal)}
                      </span>
                    </div>
                    {items.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => item.isAggregated && setDrillDown({ productId: item.productId, name: item.name })}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '10px 20px',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          cursor: item.isAggregated ? 'pointer' : 'default',
                          transition: 'background 0.12s',
                        }}
                        onMouseEnter={e => { if (item.isAggregated) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                      >
                        <span style={{ fontSize: 13, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {item.name}
                          {item.isAggregated && (
                            <span style={{ fontSize: 10, color: 'var(--text-muted)', opacity: 0.7 }}>▸</span>
                          )}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#22c55e' }}>{formatBRL(item.total)}</span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>Total</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#22c55e' }}>
                {formatBRL(detailItems.reduce((s, i) => s + i.total, 0))}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Popup nível 2: drill-down do produto agregado */}
      {drillDown && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 110,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }}>
          <div ref={drillRef} style={{ ...popupShell, maxWidth: 420 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {drillDown.name}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
                  Ações/FIIs com dividendos no mês
                </p>
              </div>
              <button
                onClick={() => setDrillDown(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18, lineHeight: 1, padding: '4px 8px', borderRadius: 6 }}
              >
                ✕
              </button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, padding: '8px 0' }}>
              {drillItems.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: '24px 0' }}>
                  Nenhum dividendo individual registrado
                </p>
              ) : (
                drillItems.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{item.ticker}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#22c55e' }}>{formatBRL(item.total)}</span>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>Total</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#22c55e' }}>
                {formatBRL(drillItems.reduce((s, i) => s + i.total, 0))}
              </span>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
