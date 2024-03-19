import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import '../css/style.css'

const nunito = Nunito({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Web問診票',
  description: 'WEB問診くんです。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${nunito.className}`}>
        {children}
      </body>
    </html>
  )
}
