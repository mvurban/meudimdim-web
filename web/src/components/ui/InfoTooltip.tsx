'use client'

import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'

interface InfoTooltipProps {
  text: string
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const ref = useRef<HTMLSpanElement>(null)

  function show() {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setPos({
      top: rect.bottom + 6 + window.scrollY,
      left: rect.left + rect.width / 2 + window.scrollX,
    })
    setVisible(true)
  }

  return (
    <>
      <span
        ref={ref}
        onMouseEnter={show}
        onMouseLeave={() => setVisible(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 13,
          height: 13,
          borderRadius: '50%',
          border: '1px solid var(--text-muted)',
          color: 'var(--text-muted)',
          fontSize: 9,
          fontWeight: 700,
          lineHeight: 1,
          cursor: 'default',
          marginLeft: 4,
          flexShrink: 0,
          verticalAlign: 'middle',
          letterSpacing: 0,
          textTransform: 'none',
          opacity: 0.6,
        }}
      >
        i
      </span>
      {visible && typeof window !== 'undefined' && createPortal(
        <div style={{
          position: 'absolute',
          top: pos.top,
          left: pos.left,
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: 12,
          color: 'var(--text-secondary)',
          maxWidth: 240,
          lineHeight: 1.5,
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          pointerEvents: 'none',
          whiteSpace: 'pre-wrap',
        }}>
          {text}
        </div>,
        document.body
      )}
    </>
  )
}
