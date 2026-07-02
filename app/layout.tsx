import type { Metadata } from 'next'
import { Manrope, Poppins } from 'next/font/google'
import { cn } from '../lib/utils'
import './globals.css'

// 1. Configure Manrope (Primary font) with swap for instant first paint
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
})

// 2. Configure Poppins (Secondary/Accent font) with swap
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'EcoSmart AI',
  description: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background antialiased',
          poppins.variable,
          manrope.variable
        )}
      >
        {children}
      </body>
    </html>
  )
}