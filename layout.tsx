import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './app/globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Shopping Optimizer',
  description: 'Оптимизируйте свои покупки с помощью AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
