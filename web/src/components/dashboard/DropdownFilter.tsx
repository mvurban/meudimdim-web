'use client'

import { useState, useRef, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'

interface FilterItem {
  id: string
  name: string
  color?: string
}

interface DropdownFilterProps {
  label: string
  items: FilterItem[]
  selected: string[]
  onToggle: (id: string) => void
  onSelectAll: () => void
}

export function DropdownFilter({ label, items, selected, onToggle, onSelectAll }: DropdownFilterProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const allSelected = selected.length === items.length
  const badge = selected.length === 0 ? 'Nenhum' : allSelected ? 'Todos' : `${selected.length} selecionados`

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '7px 12px',
          borderRadius: 8,
          border: '1px solid var(--border)',
          background: open ? 'rgba(34,197,94,0.08)' : 'var(--bg-card)',
          color: 'var(--text-primary)',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'background 0.15s, border-color 0.15s',
          borderColor: open ? '#22c55e' : undefined,
        }}
      >
        <span>{label}</span>
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          padding: '2px 7px',
          borderRadius: 99,
          background: 'rgba(34,197,94,0.15)',
          color: '#22c55e',
        }}>
          {badge}
        </span>
        <span style={{
          fontSize: 10,
          color: 'var(--text-muted)',
          transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
          transition: 'transform 0.2s',
          display: 'inline-block',
        }}>
          ▾
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          zIndex: 50,
          minWidth: 220,
          maxHeight: 320,
          overflowY: 'auto',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '8px 0',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        }}>
          {/* Todos */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 14px',
              cursor: 'pointer',
              borderBottom: '1px solid var(--border)',
              marginBottom: 4,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <Checkbox
              checked={allSelected}
              onCheckedChange={onSelectAll}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
              Todos
            </span>
          </label>

          {/* Individual items */}
          {items.map(item => {
            const checked = selected.includes(item.id)
            return (
              <label
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 14px',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => onToggle(item.id)}
                />
                <span style={{
                  fontSize: 13,
                  color: item.color ?? 'var(--text-primary)',
                  flex: 1,
                }}>
                  {item.name}
                </span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}
