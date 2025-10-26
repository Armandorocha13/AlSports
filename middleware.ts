import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Criar resposta inicial do Next.js
  let response = NextResponse.next({
    request,
  })

  // Adicionar headers de segurança básicos
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')

  return response
}

// Configuração do middleware
export const config = {
  matcher: [
    /*
     * Corresponder a todos os caminhos de requisição exceto os que começam com:
     * - _next/static (arquivos estáticos)
     * - _next/image (arquivos de otimização de imagem)
     * - favicon.ico (arquivo de favicon)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
