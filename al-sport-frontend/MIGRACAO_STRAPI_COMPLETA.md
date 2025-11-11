# ✅ Migração Completa para Strapi

## Resumo das Alterações

A aplicação foi completamente migrada para buscar dados do **Strapi** ao invés do **Supabase**.

## Arquivos Atualizados

### ✅ Funções de API Criadas/Atualizadas (`lib/api.ts`)

- ✅ `getProdutos()` - Busca produtos do Strapi
- ✅ `getProdutoById()` - Busca produto específico do Strapi
- ✅ `getCategorias()` - Busca categorias do Strapi (NOVO)
- ✅ `getBanners()` - Busca banners do Strapi
- ✅ `getConteudosDoSite()` - Busca conteúdos do site do Strapi
- ✅ `getStrapiMediaUrl()` - Helper para URLs de mídia

### ✅ Páginas Atualizadas

1. **`app/page.tsx`** (Página Inicial)
   - ❌ Antes: Client Component usando Supabase
   - ✅ Agora: Server Component usando Strapi
   - Usa `getCategorias()` e `getProdutos()` do Strapi

2. **`app/produtos/page.tsx`**
   - ✅ Já estava usando Strapi (criada anteriormente)

3. **`app/produtos/[id]/page.tsx`**
   - ✅ Já estava usando Strapi (criada anteriormente)

4. **`components/Footer.tsx`**
   - ✅ Já estava usando Strapi (criada anteriormente)

### ✅ Rotas da API Atualizadas

1. **`app/api/produtos/route.ts`**
   - ❌ Antes: Usava `productsService` (Supabase)
   - ✅ Agora: Usa `getProdutos()` do Strapi

2. **`app/api/categorias/route.ts`**
   - ❌ Antes: Usava `categoriesService` (Supabase)
   - ✅ Agora: Usa `getCategorias()` do Strapi

### ✅ Utilitários Criados

1. **`lib/utils/strapi-to-app-types.ts`** (NOVO)
   - Funções para transformar dados do Strapi para os tipos da aplicação
   - `transformStrapiProdutoToProduct()`
   - `transformStrapiCategoriaToCategory()`
   - `transformStrapiProdutosToProducts()`
   - `transformStrapiCategoriasToCategories()`

2. **`components/CategoriesCarouselClient.tsx`** (NOVO)
   - Componente Client para o carrossel de categorias na página inicial

### ✅ Tipos Atualizados (`lib/types.ts`)

- ✅ Adicionado suporte para `Variacao` (componente do Strapi)
- ✅ Tipos completos para todos os modelos do Strapi

## ⚠️ Arquivos que AINDA usam Supabase (não críticos)

Estes arquivos ainda usam Supabase, mas não são usados nas páginas principais:

- `lib/services/productsService.ts` (com 's' minúsculo) - **DEPRECATED**
- `lib/services/categoriesService.ts` (com 's' minúsculo) - **DEPRECATED**
- `hooks/useProducts.ts` - Usa `publicApiService` (que agora usa Strapi via API routes)
- `hooks/useCategories.ts` - Usa `publicApiService` (que agora usa Strapi via API routes)

**Nota:** Os hooks ainda funcionam porque as rotas da API (`/api/produtos` e `/api/categorias`) agora usam Strapi.

## 🔧 Configuração Necessária

### 1. Variáveis de Ambiente

Certifique-se de que `al-sport-frontend/.env.local` contém:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=seu_token_aqui
```

### 2. CORS no Strapi

O arquivo `al-sport-backend/config/middlewares.ts` foi atualizado para permitir requisições do frontend.

**Reinicie o Strapi** após essa alteração.

### 3. Permissões no Strapi

Configure as permissões no Strapi:
- Settings → Users & Permissions Plugin → Roles → Public
- Habilite `find` e `findOne` para:
  - Produto
  - Categoria
  - Banner
  - ConteudosDoSite

### 4. Publicar Conteúdo no Strapi

**IMPORTANTE:** No Strapi 5, os produtos e categorias precisam estar **PUBLICADOS**, não apenas salvos como rascunho.

1. Acesse: `http://localhost:1337/admin`
2. Vá em Content Manager
3. Para cada produto/categoria, clique em **"Publish"**

## 🧪 Testar

1. Reinicie o Strapi:
   ```bash
   cd al-sport-backend
   npm run develop
   ```

2. Reinicie o Next.js:
   ```bash
   cd al-sport-frontend
   npm run dev
   ```

3. Acesse:
   - `http://localhost:3000` - Página inicial (deve mostrar produtos do Strapi)
   - `http://localhost:3000/produtos` - Lista de produtos (deve mostrar produtos do Strapi)
   - `http://localhost:3000/produtos/[id]` - Detalhes do produto (deve mostrar produto do Strapi)

## 📝 Notas Importantes

1. **Campo de Variações:** O Strapi usa `Variacao` (singular) como componente, não `variacoes` (plural) como relação. O código foi ajustado para suportar ambos os formatos.

2. **Descrição:** O campo `Descricao` no Strapi é do tipo "blocks" (Rich Text). Por enquanto, está sendo renderizado como texto simples. Se precisar de formatação, considere usar `react-markdown` ou similar.

3. **Campos Opcionais:** Alguns campos como `featured`, `onSale`, `priceRanges` não estão no schema atual do Strapi. Adicione esses campos no Strapi se necessário.

## ✅ Status da Migração

- ✅ Página inicial usando Strapi
- ✅ Página de produtos usando Strapi
- ✅ Página de detalhes do produto usando Strapi
- ✅ Footer usando Strapi
- ✅ Rotas da API usando Strapi
- ✅ Funções de transformação criadas
- ✅ Tipos atualizados

**A aplicação agora busca TODOS os dados do Strapi!** 🎉




