// Importações necessárias para o middleware
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Middleware para autenticação e proteção de rotas
export async function middleware(request: NextRequest) {
  // Criar resposta inicial do Next.js
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Criar cliente Supabase para o servidor
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // URL do projeto Supabase
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Chave anônima do Supabase
    {
      cookies: {
        // Função para obter todos os cookies
        getAll() {
          return request.cookies.getAll()
        },
        // Função para definir cookies
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: Evitar escrever lógica entre createServerClient e
  // supabase.auth.getUser(). Um erro simples pode tornar muito difícil debugar
  // problemas com usuários sendo deslogados aleatoriamente.

  // Obter usuário atual da sessão
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Proteger rotas administrativas
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      // Redirecionar para login se não estiver autenticado
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      url.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // Verificação de admin será feita no layout do admin
    // para evitar consultas desnecessárias no middleware
  }

  // Proteger área do cliente
  if (request.nextUrl.pathname.startsWith('/minha-conta')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      url.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  // IMPORTANTE: Você *deve* retornar o objeto supabaseResponse como está. Se você está
  // criando um novo objeto de resposta com NextResponse.next() certifique-se de:
  // 1. Passar a requisição nele, assim:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copiar os cookies, assim:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Alterar o objeto myNewResponse em vez do objeto supabaseResponse

  return supabaseResponse
}

// Configuração do middleware
export const config = {
  matcher: [
    /*
     * Corresponder a todos os caminhos de requisição exceto os que começam com:
     * - _next/static (arquivos estáticos)
     * - _next/image (arquivos de otimização de imagem)
     * - favicon.ico (arquivo de favicon)
     * Sinta-se livre para modificar este padrão para incluir mais caminhos.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
