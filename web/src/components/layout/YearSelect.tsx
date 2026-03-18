'use client'

import { useState, useRef, useEffect } from 'react'

// ── visual constants ──────────────────────────────────────────────
const SIDEBAR_BG       = '#0d1117'
const PANEL_BG         = '#161b27'
const PANEL_BORDER     = 'rgba(255,255,255,0.1)'
const TRIGGER_BG       = 'rgba(255,255,255,0.05)'
const TEXT_DIM         = 'rgba(255,255,255,0.45)'
const TEXT_ITEM        = 'rgba(255,255,255,0.65)'
const ACCENT           = '#22c55e'
const ACCENT_BG        = 'rgba(34,197,94,0.12)'

interface YearSelectProps {
  value: number
  options: number[]
  onChange: (year: number) => void
}

export function YearSelect({ value, options, onChange }: YearSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '7px 12px',
          borderRadius: 8,
          background: TRIGGER_BG,
          border: 'none',
          color: TEXT_DIM,
          fontSize: 13,
          cursor: 'pointer',
        }}
      >
        <span>{value}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            color: ACCENT,
            flexShrink: 0,
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          background: PANEL_BG,
          border: `1px solid ${PANEL_BORDER}`,
          borderRadius: 8,
          overflow: 'hidden',
          zIndex: 50,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}>
          {options.map(y => (
            <button
              key={y}
              onClick={() => { onChange(y); setOpen(false) }}
              style={{
                width: '100%',
                display: 'block',
                padding: '9px 12px',
                background: y === value ? ACCENT_BG : 'transparent',
                border: 'none',
                color: y === value ? ACCENT : TEXT_ITEM,
                fontSize: 13,
                fontWeight: y === value ? 600 : 400,
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              {y}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
