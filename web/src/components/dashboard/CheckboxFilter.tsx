'use client'

import { Checkbox } from '@/components/ui/checkbox'

interface FilterItem {
  id: string
  name: string
  color?: string
}

interface CheckboxFilterProps {
  label: string
  items: FilterItem[]
  selected: string[]
  onToggle: (id: string) => void
}

export function CheckboxFilter({ label, items, selected, onToggle }: CheckboxFilterProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{
        margin: 0,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
      }}>
        {label}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px' }}>
        {items.map(item => {
          const checked = selected.includes(item.id)
          const isLast = checked && selected.length === 1
          return (
            <label
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: isLast ? 'not-allowed' : 'pointer',
                opacity: isLast ? 0.6 : 1,
                userSelect: 'none',
              }}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={() => onToggle(item.id)}
                disabled={isLast}
              />
              <span style={{
                fontSize: 13,
                color: item.color ?? 'var(--text-primary)',
              }}>
                {item.name}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
