'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/lib/theme-context'
import { YearProvider } from '@/lib/year-context'
import { NotificationProvider } from '@/lib/notification-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <YearProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </YearProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
