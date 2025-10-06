import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AL Sports - Loja de Atacado de Roupas Esportivas',
  description: 'Especializada na venda por atacado de roupas esportivas. Futebol, NBA, Roupas de Treino, Conjuntos Infantis, Acessórios e muito mais.',
  keywords: 'roupas esportivas, atacado, futebol, NBA, treino, infantil, acessórios, AL Sports',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
