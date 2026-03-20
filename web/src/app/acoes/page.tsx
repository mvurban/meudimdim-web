'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AppShell } from '@/components/layout/AppShell'
import { getAcoes, setAcoes, getInstitutions, mockPrecos, getStockDividends, setStockDividends } from '@/lib/mock-store'
import type { AcaoItem } from '@/lib/mock-store'
import type { Institution, StockDividend } from '@/types'
import { AcaoDividendModal } from '@/components/acoes/AcaoDividendModal'

type FormState = {
  ticker: string
  institutionId: string
  quantidade: string
  precoMedio: string
}

const EMPTY: FormState = { ticker: '', institutionId: '', quantidade: '', precoMedio: '' }

function fmt(value: number) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function parseBRL(value: string): number {
  return parseFloat(value.replace(',', '.')) || 0
}

function initials(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return name.slice(0, 2).toUpperCase()
  return words.map(w => w[0]).join('').slice(0, 3).toUpperCase()
}

export default function AcoesPage() {
  const { data: session } = useSession()
  const [items, setItemsState] = useState<AcaoItem[]>([])
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [dividendAcao, setDividendAcao] = useState<string | null>(null)
  const [stockDividends, setStockDividendsState] = useState<StockDividend[]>([])

  const email = session?.user?.email ?? null

  useEffect(() => {
    if (!email) return
    setItemsState(getAcoes(email))
    setInstitutions(getInstitutions(email))
    setStockDividendsState(getStockDividends(email))
  }, [email])

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
    setForm({ ...EMPTY, institutionId: institutions[0]?.id ?? '' })
    setAdding(true)
  }

  function startEdit(item: AcaoItem) {
    setAdding(false)
    setForm({
      ticker: item.ticker,
      institutionId: item.institutionId,
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
    if (!ticker || !form.institutionId || quantidade <= 0 || precoMedio <= 0) return

    const existente = items.find(a => a.id === editing)
    const precos = existente
      ? { precoFechamento: existente.precoFechamento, precoAtual: existente.precoAtual }
      : mockPrecos(precoMedio)

    const item: AcaoItem = {
      id: editing ?? `a${Date.now()}`,
      ticker,
      institutionId: form.institutionId,
      quantidade,
      precoMedio,
      ...precos,
    }

    if (adding) {
      setItems(prev => [...prev, item])
    } else {
      setItems(prev => prev.map(a => a.id === editing ? item : a))
    }
    cancel()
  }

  function remove(id: string) {
    setItems(prev => prev.filter(a => a.id !== id))
  }

  const totalInvestido = items.reduce((s, a) => s + a.quantidade * a.precoMedio, 0)
  const totalAtual = items.reduce((s, a) => s + a.quantidade * (a.precoAtual || a.precoMedio), 0)
  const rendimentoTotal = totalInvestido > 0 ? ((totalAtual / totalInvestido) - 1) * 100 : 0

  return (
    <AppShell>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Ações</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
            Carteira de ações · preços em tempo real via Yahoo Finance em breve
          </p>
        </div>
        <button onClick={startAdd} style={btnStyle('#22c55e')}>+ Adicionar</button>
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
            {items.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '32px 0', fontSize: 13, color: 'var(--text-muted)' }}>
                  Nenhuma ação cadastrada
                </td>
              </tr>
            )}
            {items.map(item => {
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
                    <button onClick={() => remove(item.id)} style={{ ...actionBtn, color: 'var(--danger)' }} title="Excluir"><IconTrash /></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
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
