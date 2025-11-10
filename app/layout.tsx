import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Stanley George | Director of Software Engineering',
  description: 'Portfolio of Stanley George - Director of Software Engineering, builder of macrosia.com, and software engineering thought leader.',
  authors: [{ name: 'Stanley George' }],
  keywords: ['software engineering', 'portfolio', 'macrosia', 'director of engineering'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  )
}
