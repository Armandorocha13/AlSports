# Script de Migração de Produtos

Este script migra todos os produtos hardcoded (em código) da pasta `lib/data` para o banco de dados Supabase.

## Pré-requisitos

1. **Arquivo `.env.local`** configurado com:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
   ```

2. **tsx** será usado via `npx` (não precisa instalar)

## Como Executar

### Opção 1: Usando npm script (recomendado)
```bash
npm run migrate:products
```

### Opção 2: Usando tsx diretamente
```bash
npx tsx scripts/migrate-products-to-db.ts
```

### Opção 3: Compilar e executar
```bash
# Compilar TypeScript
npx tsc scripts/migrate-products-to-db.ts --outDir dist --module esnext --target es2020 --moduleResolution node --esModuleInterop

# Executar (ajuste o caminho conforme necessário)
node dist/scripts/migrate-products-to-db.js
```

## O que o script faz?

1. **Lê todos os produtos** dos arquivos em `lib/data/`:
   - `products-futebol.ts`
   - `products-roupas-treino.ts`
   - `products-nba.ts`
   - `products-nfl.ts`
   - `products-infantis.ts`
   - `products-acessorios.ts`

2. **Mapeia categorias e subcategorias**:
   - Busca categorias no banco pelo nome/slug
   - Busca subcategorias no banco pelo nome/slug
   - Associa produtos às categorias/subcategorias corretas

3. **Insere produtos na tabela `products`**:
   - Converte o formato hardcoded para o formato do banco
   - Define valores padrão para campos obrigatórios
   - Cria SKU único para cada produto

4. **Insere imagens na tabela `product_images`**:
   - Associa cada imagem ao produto criado
   - Marca a primeira imagem como primária

5. **Insere faixas de preço na tabela `price_ranges`**:
   - Migra as faixas de preço por quantidade
   - Preserva os descontos por volume

## Mapeamento de Dados

| Hardcoded | Banco de Dados |
|-----------|----------------|
| `id` | `sku` (prefixo: SKU-) |
| `name` | `name` |
| `description` | `description` |
| `price` | `price` (maior preço das faixas) |
| `wholesalePrice` | `wholesale_price` |
| `image` | `product_images.image_url` |
| `sizes` | `sizes[]` |
| `category` | `category_id` (busca pelo nome) |
| `subcategory` | `subcategory_id` (busca pelo slug) |
| `featured` | `is_featured` |
| `onSale` | `is_on_sale` |
| `priceRanges` | `price_ranges[]` |

## Mapeamento de Categorias

O script tenta mapear automaticamente as categorias:

- `futebol` → `FUTEBOL`
- `roupas-de-treino` → `ROUPAS DE TREINO`
- `nba` → `NBA`
- `nfl` → `NFL`
- `infantil` / `infantis` → `INFANTIS`
- `acessorios` / `acessórios` → `ACESSÓRIOS`

## Proteção contra Duplicatas

O script verifica se um produto já existe pelo SKU antes de inserir. Produtos duplicados são pulados automaticamente.

## Valores Padrão

- `stock_quantity`: 100
- `min_stock`: 10
- `is_active`: true
- `short_description`: null
- `cost_price`: null
- `weight`: null
- `dimensions`: null

## Troubleshooting

### Erro: "Categoria não encontrada"
- Verifique se as categorias existem no banco de dados
- Execute as migrations de categorias primeiro
- Verifique o nome da categoria no arquivo hardcoded vs no banco

### Erro: "Subcategoria não encontrada"
- Verifique se as subcategorias existem no banco
- Confirme que as subcategorias estão associadas à categoria correta
- Verifique o slug da subcategoria

### Erro de conexão
- Verifique as variáveis de ambiente no `.env.local`
- Confirme que o Supabase está acessível
- Verifique as políticas RLS do Supabase

## Exemplo de Saída

```
🚀 Iniciando migração de produtos...

📦 Total de produtos encontrados: 150

[1/150] Processando: Camisa Flamengo 2024/25 - Versão Jogador
✅ Produto inserido: Camisa Flamengo 2024/25 - Versão Jogador (ID: 123e4567-e89b-12d3-a456-426614174000)

[2/150] Processando: Camisa Retrô Flamengo 2009
✅ Produto inserido: Camisa Retrô Flamengo 2009 (ID: 123e4567-e89b-12d3-a456-426614174001)

...

============================================================
📊 RESUMO DA MIGRAÇÃO
============================================================
✅ Produtos inseridos com sucesso: 148
⏭️  Produtos pulados (já existentes): 2
❌ Produtos com erro: 0
📦 Total processado: 150
============================================================
```

## Após a Migração

Depois de executar o script, você pode:

1. **Verificar os produtos** no painel admin (`/admin/produtos`)
2. **Ajustar estoques** conforme necessário
3. **Adicionar imagens adicionais** se houver
4. **Ajustar preços** se necessário
5. **Configurar faixas de preço** mais detalhadas

