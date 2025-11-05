# Guia de Integração da API de Produtos

## 📋 Visão Geral

O sistema agora possui uma arquitetura completa de APIs REST para gerenciamento de produtos, com atualização automática no front-end.

## 🏗️ Arquitetura

```
┌─────────────────┐
│  Front-end Site │
│  (React/Next.js)│
└────────┬────────┘
         │
         │ HTTP Requests
         ▼
┌─────────────────┐
│   API Routes    │
│  /api/produtos  │
└────────┬────────┘
         │
         │ Service Layer
         ▼
┌─────────────────┐
│  Services Layer │
│ (productsService)│
└────────┬────────┘
         │
         │ Supabase Client
         ▼
┌─────────────────┐
│    Supabase     │
│  (PostgreSQL +  │
│    Storage)     │
└─────────────────┘
```

## 🔌 Endpoints da API

### GET /api/produtos
Lista todos os produtos com filtros opcionais.

**Query Parameters:**
- `category_id` (string): Filtrar por categoria
- `subcategory_id` (string): Filtrar por subcategoria
- `is_active` (boolean): Filtrar por status ativo/inativo
- `is_featured` (boolean): Filtrar produtos em destaque
- `limit` (number): Limitar número de resultados

**Exemplo:**
```bash
GET /api/produtos?is_active=true&is_featured=true&limit=8
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Nome do Produto",
      "description": "Descrição...",
      "base_price": 99.90,
      "stock_quantity": 10,
      "sizes": ["P", "M", "G"],
      "images": ["url1", "url2"],
      "is_active": true,
      "is_featured": true
    }
  ],
  "count": 1
}
```

### GET /api/produtos/[id]
Retorna um produto específico.

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Nome do Produto",
    ...
  }
}
```

### POST /api/produtos
Cria um novo produto.

**Body:**
```json
{
  "name": "Nome do Produto",
  "description": "Descrição",
  "price": 99.90,
  "stock_quantity": 10,
  "category_id": "uuid",
  "subcategory_id": "uuid",
  "sizes": ["P", "M", "G"],
  "is_active": true,
  "is_featured": false
}
```

### PUT /api/produtos/[id]
Atualiza um produto existente.

**Body:** (campos opcionais)
```json
{
  "name": "Novo Nome",
  "price": 89.90,
  "stock_quantity": 15
}
```

### DELETE /api/produtos/[id]
Remove um produto.

## 🎣 Uso no Front-end

### Hook useProducts

```typescript
import { useProducts } from '@/hooks/useProducts'

function MyComponent() {
  const { products, loading, error } = useProducts({
    is_featured: true,
    is_active: true,
    limit: 8
  })

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### Hook useProduct

```typescript
import { useProduct } from '@/hooks/useProducts'

function ProductPage({ id }) {
  const { product, loading, error } = useProduct(id)

  if (loading) return <div>Carregando...</div>
  if (!product) return <div>Produto não encontrado</div>

  return <div>{product.name}</div>
}
```

### Serviço Direto (publicApiService)

```typescript
import { publicApiService } from '@/lib/services/publicApiService'

// Buscar produtos
const products = await publicApiService.getProducts({
  is_active: true,
  limit: 10
})

// Buscar produto específico
const product = await publicApiService.getProductById('uuid')

// Criar produto (admin)
const newProduct = await publicApiService.createProduct({
  name: 'Produto',
  price: 99.90
})

// Atualizar produto (admin)
const updated = await publicApiService.updateProduct('uuid', {
  price: 89.90
})

// Excluir produto (admin)
await publicApiService.deleteProduct('uuid')
```

## 🔄 Atualização Automática

O sistema possui cache leve com revalidação automática:

1. **Cache de 30 segundos**: Os dados são cacheados por 30 segundos
2. **Revalidação automática**: O hook `useProducts` revalida automaticamente a cada 30 segundos
3. **Invalidação de cache**: Após operações de criação/atualização/exclusão, o cache é limpo automaticamente

## 🎨 Exemplo de Integração Completa

### Página de Produtos

```typescript
'use client'

import { useProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/ProductCard'

export default function ProductsPage() {
  const { products, loading } = useProducts({
    is_active: true
  })

  if (loading) {
    return <div>Carregando produtos...</div>
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={{
            ...product,
            image: product.images?.[0] || '/placeholder.jpg',
            price: product.base_price
          }} 
        />
      ))}
    </div>
  )
}
```

## 🔐 Segurança

- As APIs são públicas por padrão
- Para operações de criação/atualização/exclusão, considere adicionar autenticação
- Use middleware ou verificação de sessão para proteger endpoints de admin

## 📊 Performance

- Cache de 30 segundos reduz chamadas desnecessárias
- Revalidação automática mantém dados atualizados
- Limpeza automática de cache após mudanças

## 🚀 Próximos Passos

1. Adicionar autenticação nas rotas de admin
2. Implementar paginação nas listagens
3. Adicionar filtros avançados na API
4. Implementar busca full-text na API

