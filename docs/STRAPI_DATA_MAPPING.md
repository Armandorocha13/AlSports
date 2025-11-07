# 🔄 Mapeamento de Dados: Estrutura Atual → Strapi

Este documento mapeia a estrutura de dados atual (hardcoded) para a estrutura esperada do Strapi.

## 📦 Produtos

### Estrutura Atual (Hardcoded)
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  wholesalePrice: number;
  image: string;
  description: string;
  sizes: string[];
  category: string;
  subcategory: string;
  featured: boolean;
  onSale?: boolean;
  priceRanges: Array<{
    min: number;
    max?: number;
    price: number;
  }>;
}
```

### Estrutura Esperada no Strapi
```typescript
// Content Type: Product
{
  id: number; // Strapi ID
  documentId: string; // Strapi documentId
  name: string;
  slug: string; // Novo campo para URLs amigáveis
  price: number;
  wholesalePrice: number;
  images: Media[]; // Array de imagens (Strapi Media)
  description: string;
  sizes: string[]; // Component ou JSON field
  category: Category; // Relation
  subcategory: Subcategory; // Relation
  featured: boolean;
  onSale: boolean;
  priceRanges: JSON; // Array de objetos
  stock: number; // Novo campo
  active: boolean; // Novo campo para status
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
```

### Campos a Criar no Strapi
- [ ] **Product** Content Type
  - `name` (Text, required)
  - `slug` (UID, required, unique)
  - `price` (Number, required)
  - `wholesalePrice` (Number)
  - `description` (Rich Text ou Long Text)
  - `sizes` (JSON ou Component)
  - `featured` (Boolean, default: false)
  - `onSale` (Boolean, default: false)
  - `priceRanges` (JSON)
  - `stock` (Number, default: 0)
  - `active` (Boolean, default: true)
  - `images` (Media, multiple)
  - `category` (Relation: Category, many-to-one)
  - `subcategory` (Relation: Subcategory, many-to-one)

### Transformação Necessária
```typescript
// lib/utils/strapi-transformers.ts
export function transformStrapiProduct(strapiProduct: any): Product {
  return {
    id: strapiProduct.documentId || strapiProduct.id.toString(),
    name: strapiProduct.name,
    price: strapiProduct.price,
    wholesalePrice: strapiProduct.wholesalePrice || strapiProduct.price,
    image: strapiProduct.images?.[0]?.url || '/images/placeholder.jpg',
    description: strapiProduct.description,
    sizes: Array.isArray(strapiProduct.sizes) 
      ? strapiProduct.sizes 
      : JSON.parse(strapiProduct.sizes || '[]'),
    category: strapiProduct.category?.slug || strapiProduct.category,
    subcategory: strapiProduct.subcategory?.slug || strapiProduct.subcategory,
    featured: strapiProduct.featured || false,
    onSale: strapiProduct.onSale || false,
    priceRanges: typeof strapiProduct.priceRanges === 'string'
      ? JSON.parse(strapiProduct.priceRanges)
      : strapiProduct.priceRanges || []
  };
}
```

---

## 📁 Categorias

### Estrutura Atual (Hardcoded)
```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  subcategories: Array<{
    id: string;
    name: string;
    slug: string;
    image: string;
  }>;
}
```

### Estrutura Esperada no Strapi
```typescript
// Content Type: Category
{
  id: number;
  documentId: string;
  name: string;
  slug: string; // UID, unique
  image: Media; // Strapi Media
  description: string;
  subcategories: Subcategory[]; // Relation, one-to-many
  active: boolean;
  order: number; // Para ordenação
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Content Type: Subcategory
{
  id: number;
  documentId: string;
  name: string;
  slug: string; // UID, unique
  image: Media;
  category: Category; // Relation, many-to-one
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
```

### Campos a Criar no Strapi
- [ ] **Category** Content Type
  - `name` (Text, required)
  - `slug` (UID, required, unique)
  - `image` (Media, single)
  - `description` (Text)
  - `active` (Boolean, default: true)
  - `order` (Number, default: 0)
  - `subcategories` (Relation: Subcategory, one-to-many)

- [ ] **Subcategory** Content Type
  - `name` (Text, required)
  - `slug` (UID, required, unique)
  - `image` (Media, single)
  - `category` (Relation: Category, many-to-one)
  - `active` (Boolean, default: true)
  - `order` (Number, default: 0)

### Transformação Necessária
```typescript
export function transformStrapiCategory(strapiCategory: any): Category {
  return {
    id: strapiCategory.documentId || strapiCategory.id.toString(),
    name: strapiCategory.name,
    slug: strapiCategory.slug,
    image: strapiCategory.image?.url || '/images/placeholder.jpg',
    description: strapiCategory.description || '',
    subcategories: (strapiCategory.subcategories || []).map((sub: any) => ({
      id: sub.documentId || sub.id.toString(),
      name: sub.name,
      slug: sub.slug,
      image: sub.image?.url || '/images/placeholder.jpg'
    }))
  };
}
```

---

## 🔍 Queries Strapi Necessárias

### Buscar Todos os Produtos
```typescript
GET /api/products?populate=*
// ou com filtros
GET /api/products?populate[category]=*&populate[subcategory]=*&populate[images]=*
```

### Buscar Produto por ID/Slug
```typescript
GET /api/products/{id}?populate=*
// ou por slug
GET /api/products?filters[slug][$eq]={slug}&populate=*
```

### Buscar Produtos por Categoria
```typescript
GET /api/products?filters[category][slug][$eq]={categorySlug}&populate=*
```

### Buscar Produtos em Destaque
```typescript
GET /api/products?filters[featured][$eq]=true&populate=*
```

### Buscar Todas as Categorias
```typescript
GET /api/categories?populate[subcategories]=*&populate[image]=*
```

### Buscar Categoria por Slug
```typescript
GET /api/categories?filters[slug][$eq]={slug}&populate[subcategories]=*&populate[image]=*
```

### Buscar Produtos (Search)
```typescript
GET /api/products?filters[$or][0][name][$containsi]={query}&filters[$or][1][description][$containsi]={query}&populate=*
```

---

## 🎨 Imagens e Media

### Estrutura Atual
- Imagens armazenadas em `/public/images/`
- Caminhos hardcoded: `/images/Categoria/Subcategoria/arquivo.jpg`

### Estrutura Esperada no Strapi
- Imagens gerenciadas via Strapi Media Library
- URLs retornadas pela API: `http://strapi-url/uploads/image.jpg`
- Ou usar CDN se configurado

### Considerações
- [ ] Configurar upload de imagens no Strapi
- [ ] Configurar CDN (opcional, mas recomendado)
- [ ] Implementar fallback para imagens quebradas
- [ ] Otimizar imagens (Next.js Image component)

---

## 📊 Dados de Exemplo para Migração

### Categorias Principais
1. **futebol** - Futebol
2. **nba** - NBA
3. **nfl** - NFL
4. **roupas-treino** - Roupas de Treino
5. **conjuntos-infantis** - Conjuntos Infantis
6. **acessorios** - Acessórios
7. **tabela-medidas** - Tabela de Medidas

### Subcategorias de Futebol
- versao-jogador
- versao-feminina
- regatas
- retro
- shorts-masculino
- shorts-feminino
- temporada-25-26
- temporada-23-24
- temporada-24-25

---

## ⚠️ Pontos de Atenção

1. **IDs**: Strapi usa números, mas o frontend espera strings. Transformar adequadamente.
2. **Slugs**: Garantir que todos os produtos e categorias tenham slugs únicos.
3. **Relacionamentos**: Popular (populate) relacionamentos nas queries.
4. **Imagens**: Mapear estrutura de Media do Strapi para URLs simples.
5. **Price Ranges**: Armazenar como JSON no Strapi.
6. **Publicação**: Garantir que apenas itens `publishedAt !== null` sejam retornados.
7. **Ordenação**: Usar campo `order` para ordenar categorias e subcategorias.

---

## 🔄 Checklist de Migração de Dados

- [ ] Criar Content Types no Strapi (Product, Category, Subcategory)
- [ ] Configurar campos e relacionamentos
- [ ] Migrar dados de categorias
- [ ] Migrar dados de subcategorias
- [ ] Migrar dados de produtos
- [ ] Fazer upload de imagens para Strapi Media Library
- [ ] Atualizar referências de imagens nos produtos
- [ ] Testar queries da API
- [ ] Validar transformações de dados
- [ ] Testar integração completa

---

**Última atualização**: Criado em [data atual]  
**Versão**: 1.0

