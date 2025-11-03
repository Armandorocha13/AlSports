# Migration 009: Relacionamento Produtos -> Subcategorias

## Objetivo
Garantir que a coluna `subcategory_id` existe e está configurada corretamente na tabela `products` para vincular produtos às subcategorias.

## O que esta migration faz

1. **Verifica e cria a coluna `subcategory_id`**:
   - Se não existir, cria como TEXT
   - Se existir mas for de outro tipo (UUID), converte para TEXT
   - A coluna armazena o ID numérico (int8) da tabela `subcategorias` como string

2. **Cria índice para performance**:
   - `idx_products_subcategory` para otimizar buscas por subcategoria

3. **Adiciona documentação**:
   - Comentário na coluna explicando seu propósito

## Estrutura do Relacionamento

```
products
├── category_id (TEXT) → categorias.id (int8)
└── subcategory_id (TEXT) → subcategorias.id (int8)
```

**Nota**: As tabelas `categorias` e `subcategorias` usam IDs numéricos (int8), não UUIDs. Por isso armazenamos como TEXT na tabela `products`.

## Como funciona

1. Um produto pode estar vinculado a uma categoria através de `category_id`
2. Um produto pode estar vinculado a uma subcategoria através de `subcategory_id`
3. A subcategoria deve pertencer à categoria especificada em `category_id`
4. Ambos os campos podem ser NULL (produto sem categoria/subcategoria)

## Aplicação

Execute no SQL Editor do Supabase:
```sql
-- Arquivo: database/migrations/009_add_subcategory_relation.sql
```

## Status dos Produtos no SQL 008

O arquivo `008_insert_products.sql` já inclui `subcategory_id` nos INSERTs. Alguns produtos podem ter `NULL` se:
- A subcategoria não foi encontrada durante o mapeamento
- O produto não tem subcategoria definida no código hardcoded

Para atualizar produtos existentes com subcategorias:
```sql
UPDATE public.products 
SET subcategory_id = 'ID_DA_SUBCATEGORIA'
WHERE category_id = 'ID_DA_CATEGORIA' 
  AND subcategory_id IS NULL;
```

## Próximos Passos

1. Execute a migration `009_add_subcategory_relation.sql`
2. Verifique os produtos que têm `subcategory_id = NULL`
3. Se necessário, execute UPDATEs para vincular produtos às subcategorias corretas

