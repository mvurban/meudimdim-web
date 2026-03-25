'use client'

import { CURRENT_YEAR, CURRENT_MONTH } from '@/lib/year-context'

const MONTHS_ABBR = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ']

function isMonthDisabled(year: number, month: number): boolean {
  return year * 12 + month > CURRENT_YEAR * 12 + CURRENT_MONTH + 1
}

interface MonthSelectorProps {
  selectedMonth: number
  selectedYear: number
  onMonthChange: (month: number) => void
}

export function MonthSelector({ selectedMonth, selectedYear, onMonthChange }: MonthSelectorProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {MONTHS_ABBR.map((m, i) => {
        const month = i + 1
        const active = selectedMonth === month
        const disabled = isMonthDisabled(selectedYear, month)
        return (
          <button
            key={i}
            onClick={() => !disabled && onMonthChange(month)}
            disabled={disabled}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={
              disabled
                ? { color: 'var(--text-muted)', opacity: 0.3, cursor: 'not-allowed' }
                : active
                  ? { background: 'var(--brand)', color: '#fff' }
                  : { color: 'var(--text-secondary)' }
            }
          >
            {m}
          </button>
        )
      })}
    </div>
  )
}
