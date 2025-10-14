# Estrutura de Dados Organizada

Esta pasta contém todos os dados do site organizados por categoria para facilitar a manutenção.

## Estrutura de Arquivos

```
lib/data/
├── README.md                    # Este arquivo
├── index.ts                     # Arquivo principal que combina tudo
├── categories.ts                 # Categorias e subcategorias
├── products-futebol.ts          # Produtos de futebol
├── products-roupas-treino.ts    # Produtos de roupas de treino
├── products-nba.ts              # Produtos da NBA
├── products-nfl.ts              # Produtos da NFL
├── products-infantis.ts         # Produtos infantis
└── products-acessorios.ts       # Produtos de acessórios
```

## Como Adicionar Novos Produtos

### 1. Para produtos de futebol:
Edite o arquivo `products-futebol.ts` e adicione o novo produto no array `futebolProducts`.

### 2. Para produtos de outras categorias:
Edite o arquivo correspondente (ex: `products-nba.ts` para produtos da NBA).

### 3. Para uma nova categoria:
1. Crie um novo arquivo `products-[nome-categoria].ts`
2. Adicione a categoria em `categories.ts`
3. Importe e adicione os produtos em `index.ts`

## Vantagens desta Estrutura

- ✅ **Organização**: Cada categoria tem seu próprio arquivo
- ✅ **Manutenção**: Fácil de encontrar e editar produtos específicos
- ✅ **Escalabilidade**: Fácil de adicionar novas categorias
- ✅ **Performance**: Importações otimizadas
- ✅ **Colaboração**: Múltiplas pessoas podem trabalhar em categorias diferentes

## Exemplo de Uso

```typescript
// Importar todos os produtos
import { allProducts } from './lib/data';

// Importar produtos de uma categoria específica
import { futebolProducts } from './lib/data/products-futebol';

// Usar funções utilitárias
import { getProductsByCategory, getFeaturedProducts } from './lib/data';
```

## Manutenção

- Para adicionar produtos: Edite o arquivo da categoria correspondente
- Para modificar categorias: Edite `categories.ts`
- Para adicionar funcionalidades: Edite `index.ts`
