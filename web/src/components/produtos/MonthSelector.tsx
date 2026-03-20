'use client'

const MONTHS_ABBR = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ']

interface MonthSelectorProps {
  selectedMonth: number
  selectedYear: number
  onMonthChange: (month: number) => void
}

export function MonthSelector({ selectedMonth, selectedYear, onMonthChange }: MonthSelectorProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {MONTHS_ABBR.map((m, i) => {
        const active = selectedMonth === i + 1
        return (
          <button
            key={i}
            onClick={() => onMonthChange(i + 1)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={
              active
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
