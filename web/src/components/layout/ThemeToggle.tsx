'use client'

import { useTheme } from '@/lib/theme-context'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[6px] transition-colors"
      style={{ color: 'rgba(255,255,255,0.35)' }}
      title="Alternar tema"
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  )
}
