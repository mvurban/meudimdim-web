'use client'

import type { Category, Institution } from '@/types'

interface FilterBarProps {
  categories: Category[]
  institutions: Institution[]
  categoryFilter: string
  institutionFilter: string
  onCategoryChange: (val: string) => void
  onInstitutionChange: (val: string) => void
}

export function FilterBar({
  categories,
  institutions,
  categoryFilter,
  institutionFilter,
  onCategoryChange,
  onInstitutionChange,
}: FilterBarProps) {
  const selectStyle: React.CSSProperties = {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: '13px',
    padding: '6px 10px',
    outline: 'none',
    cursor: 'pointer',
  }

  return (
    <div className="flex items-center gap-3">
      {/* Funnel icon */}
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: 'var(--text-muted)', flexShrink: 0 }}
      >
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>

      <select
        value={categoryFilter}
        onChange={e => onCategoryChange(e.target.value)}
        style={selectStyle}
      >
        <option value="">Todas categorias</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select
        value={institutionFilter}
        onChange={e => onInstitutionChange(e.target.value)}
        style={selectStyle}
      >
        <option value="">Todas instituições</option>
        {institutions.map(i => (
          <option key={i.id} value={i.id}>{i.name}</option>
        ))}
      </select>
    </div>
  )
}
