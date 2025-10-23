// Importações necessárias para o layout principal da aplicação
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import AdminRedirect from '@/components/AdminRedirect'

// Configuração da fonte Montserrat para toda a aplicação
const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700', '800', '900']
})

// Metadados da aplicação para SEO
export const metadata: Metadata = {
  title: 'AL Sports - Mundo da Bola | Loja de Atacado de Roupas Esportivas',
  description: 'Especializada na venda por atacado de roupas esportivas. Futebol, NBA, Roupas de Treino, Conjuntos Infantis, Acessórios e muito mais.',
  keywords: 'roupas esportivas, atacado, futebol, NBA, treino, infantil, acessórios, AL Sports, mundo da bola',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

// Componente principal do layout da aplicação
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={montserrat.className}>
        {/* Provedor de autenticação para gerenciar estado do usuário */}
        <AuthProvider>
          {/* Provedor do carrinho para gerenciar produtos no carrinho */}
          <CartProvider>
            {/* Provedor de favoritos para gerenciar produtos favoritados */}
            <FavoritesProvider>
            {/* Redirecionamento automático para admin */}
            <AdminRedirect />
            {/* Container principal com layout flexível */}
            <div className="min-h-screen flex flex-col">
              {/* Cabeçalho da aplicação */}
              <Header />
              {/* Área principal onde o conteúdo das páginas será renderizado */}
              <main className="flex-1">
                {children}
              </main>
              {/* Rodapé da aplicação */}
              <Footer />
            </div>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
