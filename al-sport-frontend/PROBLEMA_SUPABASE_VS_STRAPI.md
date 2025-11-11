# ⚠️ PROBLEMA IDENTIFICADO: Código usando Supabase ao invés de Strapi

## 🔴 Arquivos que ainda usam SUPABASE:

### 1. `lib/services/productsService.ts` (com 's' minúsculo)
- ❌ Usa `createClient()` do Supabase
- ❌ Busca de `produtos` no Supabase
- ❌ Busca de `images` e `product_image_relations` no Supabase

### 2. `lib/services/categoriesService.ts` (com 's' minúsculo)
- ❌ Usa `createClient()` do Supabase
- ❌ Busca de `categorias` no Supabase
- ❌ Busca de `subcategorias` no Supabase

### 3. `hooks/useProducts.ts`
- ⚠️ Usa `publicApiService.getProducts()`
- ⚠️ Precisa verificar se `publicApiService` usa Strapi ou Supabase

### 4. `hooks/useCategories.ts`
- ⚠️ Usa `publicApiService.getCategories()`
- ⚠️ Precisa verificar se `publicApiService` usa Strapi ou Supabase

### 5. `app/page.tsx` (Página inicial)
- ❌ Importa `productsService` (com 's' minúsculo - Supabase)
- ❌ Importa `categoriesService` (com 's' minúsculo - Supabase)
- ❌ Usa `productsService.getFeaturedProductsLimited()`
- ❌ Usa `categoriesService.getAllCategories()`

## ✅ Arquivos que usam STRAPI (corretos):

### 1. `lib/api.ts`
- ✅ Usa Strapi diretamente
- ✅ Funções: `getProdutos()`, `getProdutoById()`, `getBanners()`, `getConteudosDoSite()`

### 2. `lib/services/products-service.ts` (com hífen)
- ✅ Usa Strapi via `apiClient`
- ✅ Endpoint: `/products`

### 3. `lib/services/categories-service.ts` (com hífen)
- ✅ Usa Strapi via `apiClient`
- ✅ Endpoint: `/categories`

### 4. `app/produtos/page.tsx`
- ✅ Usa `getProdutos()` de `lib/api.ts` (Strapi)

### 5. `app/produtos/[id]/page.tsx`
- ✅ Usa `getProdutoById()` de `lib/api.ts` (Strapi)

## 🔧 SOLUÇÃO:

### Opção 1: Atualizar a página inicial para usar Strapi

Atualizar `app/page.tsx` para usar os serviços corretos:

```typescript
// ❌ REMOVER:
import { productsService } from '@/lib/services/products-service'
import { categoriesService } from '@/lib/services/categories-service'

// ✅ ADICIONAR:
import { getProdutos } from '@/lib/api'
import { getBanners } from '@/lib/api'
// E criar função getCategorias() no lib/api.ts
```

### Opção 2: Verificar publicApiService

Verificar se `lib/services/publicApiService.ts` está usando Strapi ou Supabase.

## 📋 Checklist de Migração:

- [ ] Atualizar `app/page.tsx` para usar Strapi
- [ ] Verificar `lib/services/publicApiService.ts`
- [ ] Atualizar `hooks/useProducts.ts` se necessário
- [ ] Atualizar `hooks/useCategories.ts` se necessário
- [ ] Criar função `getCategorias()` em `lib/api.ts`
- [ ] Testar página inicial
- [ ] Remover ou marcar como deprecated os serviços antigos do Supabase

## 🎯 Ação Imediata:

A página `/produtos` está usando Strapi corretamente, mas a página inicial (`/`) ainda está usando Supabase. Por isso os produtos não aparecem na página inicial, mas podem aparecer em `/produtos`.




