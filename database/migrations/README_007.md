# Migration 007: Criar tabela products adaptada

## Objetivo
Criar a tabela `products` com estrutura adaptada às necessidades reais do banco de dados, incluindo todas as colunas necessárias para a migração de produtos.

## Estrutura da Tabela

### Colunas Principais
- **id**: UUID (chave primária, gerado automaticamente)
- **name**: TEXT (nome do produto, obrigatório)
- **slug**: TEXT (slug único gerado do nome)
- **description**: TEXT (descrição do produto)
- **base_price**: NUMERIC(10,2) (preço base/retail, obrigatório)
- **wholesale_price**: NUMERIC(10,2) (preço atacado, opcional)

### Categorização
- **category_id**: TEXT (ID da tabela `categorias`, armazenado como string)
- **subcategory_id**: TEXT (ID da tabela `subcategorias`, armazenado como string)

**Nota**: As tabelas `categorias` e `subcategorias` usam IDs numéricos (int8), não UUIDs. Por isso armazenamos como TEXT.

### Dimensões Físicas
- **weight**: NUMERIC(8,3) (peso em kg)
- **height**: NUMERIC(8,2) (altura em cm)
- **width**: NUMERIC(8,2) (largura em cm)
- **length**: NUMERIC(8,2) (comprimento em cm)

### Informações Adicionais
- **sku**: TEXT (código SKU único)
- **sizes**: TEXT[] (array de tamanhos disponíveis)
- **colors**: TEXT[] (array de cores disponíveis)
- **materials**: TEXT[] (array de materiais)

### Status e Flags
- **is_active**: BOOLEAN (produto ativo)
- **is_featured**: BOOLEAN (produto em destaque)
- **is_on_sale**: BOOLEAN (produto em promoção)

### Estoque
- **stock_quantity**: INTEGER (quantidade em estoque)
- **min_stock**: INTEGER (estoque mínimo)
- **max_stock**: INTEGER (estoque máximo, opcional)

### Timestamps
- **created_at**: TIMESTAMPTZ (data de criação)
- **updated_at**: TIMESTAMPTZ (data de atualização, atualizado automaticamente)

## Índices
- `idx_products_category`: Para buscar produtos por categoria
- `idx_products_subcategory`: Para buscar produtos por subcategoria
- `idx_products_active`: Para filtrar produtos ativos
- `idx_products_featured`: Para produtos em destaque
- `idx_products_slug`: Para busca por slug
- `idx_products_sku`: Para busca por SKU
- `idx_products_created`: Para ordenação por data de criação

## RLS (Row Level Security)
- **Público**: Pode ver apenas produtos ativos (`is_active = true`)
- **Admin**: Pode visualizar, inserir, atualizar e deletar todos os produtos

## Aplicação

### Antes de Aplicar
⚠️ **ATENÇÃO**: Esta migration cria uma nova tabela. Se já existir uma tabela `products` com dados importantes:

1. **Backup**: Faça backup dos dados existentes antes de aplicar
2. **Opção 1**: Renomeie a tabela antiga antes de aplicar:
   ```sql
   ALTER TABLE public.products RENAME TO products_old;
   ```
3. **Opção 2**: Descomente a linha `DROP TABLE` na migration (CUIDADO: apaga todos os dados!)

### Aplicar no Supabase
1. Acesse o SQL Editor no Supabase Dashboard
2. Execute o arquivo `007_create_products_table.sql`
3. Verifique se a tabela foi criada corretamente

### Após Aplicar
Execute o script de migração de produtos:
```bash
npm run migrate:products
```

## Próximos Passos
1. Aplicar a migration no banco de dados
2. Executar o script de migração de produtos
3. Verificar se os produtos foram inseridos corretamente

