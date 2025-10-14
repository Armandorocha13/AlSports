// Importação do cliente Supabase para navegador
import { createBrowserClient } from '@supabase/ssr'

// Função para criar cliente Supabase no lado do cliente (navegador)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // URL do projeto Supabase
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Chave anônima do Supabase
  )
}
