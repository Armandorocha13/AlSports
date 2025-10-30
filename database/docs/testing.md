# 🧪 Guia de Testes e Verificação

Este guia mostra como verificar se o banco de dados está configurado corretamente após executar as migrações.

## ✅ Verificações Básicas

### 1. Verificar ENUMs

```sql
-- Listar todos os ENUMs e seus valores
SELECT 
  typname as enum_name,
  (SELECT string_agg(enumlabel, ', ' ORDER BY enumsortorder) 
   FROM pg_enum 
   WHERE enumtypid = t.oid) as valores
FROM pg_type t
WHERE typname IN ('order_status', 'payment_method', 'payment_status', 'user_types')
ORDER BY typname;
```

**Resultado esperado:**
- ✅ `order_status`: deve conter `aguardando_pagamento, pagamento_confirmado, preparando_pedido, enviado, em_transito, entregue, cancelado, devolvido`
- ✅ `payment_method`: deve conter `pix, cartao_credito, cartao_debito, boleto, transferencia`
- ✅ `payment_status`: deve conter `pendente, processando, aprovado, rejeitado, cancelado`
- ✅ `user_types`: deve conter `cliente, admin, vendedor`

---

### 2. Verificar Tabelas Principais

```sql
-- Verificar se todas as tabelas existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('orders', 'order_items', 'order_status_history', 'payments')
ORDER BY table_name;
```

**Resultado esperado:**
```
table_name
-------------------
order_items
order_status_history
orders
payments
```

---

### 3. Verificar Estrutura da Tabela `orders`

```sql
-- Verificar todas as colunas da tabela orders
SELECT 
  column_name, 
  data_type, 
  udt_name,
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'orders'
ORDER BY ordinal_position;
```

**Colunas obrigatórias que devem existir:**
- ✅ `id` (uuid)
- ✅ `order_number` (text, NOT NULL, UNIQUE)
- ✅ `status` (order_status, NOT NULL)
- ✅ `subtotal` (decimal, NOT NULL)
- ✅ `shipping_cost` (decimal)
- ✅ `discount_amount` (decimal)
- ✅ `total_amount` (decimal, NOT NULL)
- ✅ `shipping_address` (jsonb, NOT NULL)
- ✅ `created_at`, `updated_at` (timestamptz)

---

### 4. Verificar Estrutura da Tabela `order_items`

```sql
-- Verificar colunas da tabela order_items
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'order_items'
ORDER BY ordinal_position;
```

**Colunas obrigatórias que devem existir:**
- ✅ `order_id` (uuid, referência para orders)
- ✅ `product_id` (uuid)
- ✅ `product_name` (text, NOT NULL)
- ✅ `product_sku` (text)
- ✅ `product_image_url` (text) ⚠️ **Importante: esta coluna costuma estar faltando**
- ✅ `size` (text)
- ✅ `color` (text) ⚠️ **Importante: esta coluna costuma estar faltando**
- ✅ `quantity` (integer, NOT NULL)
- ✅ `unit_price` (decimal, NOT NULL)
- ✅ `total_price` (decimal, NOT NULL)

---

### 5. Verificar Estrutura da Tabela `order_status_history`

```sql
-- Verificar colunas da tabela order_status_history
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'order_status_history'
ORDER BY ordinal_position;
```

**Colunas obrigatórias:**
- ✅ `order_id` (uuid, referência para orders)
- ✅ `status` (order_status, NOT NULL) ⚠️ **Importante: esta coluna costuma estar faltando**
- ✅ `notes` (text)
- ✅ `updated_by` (uuid)
- ✅ `created_at` (timestamptz)

---

## 🧪 Teste de Inserção

### Teste 1: Criar um Pedido de Teste

```sql
-- Inserir pedido de teste
INSERT INTO public.orders (
  order_number,
  status,
  subtotal,
  shipping_cost,
  total_amount,
  shipping_address
) VALUES (
  'TEST-' || TO_CHAR(NOW(), 'YYYYMMDDHH24MISS'),
  'aguardando_pagamento',
  100.00,
  15.00,
  115.00,
  '{"test": true, "street": "Rua Teste", "number": "123"}'::jsonb
) RETURNING id, order_number, status, total_amount;
```

**Resultado esperado:**
- ✅ Inserção bem-sucedida
- ✅ Retorna `id`, `order_number`, `status` e `total_amount`

### Teste 2: Inserir Item do Pedido

```sql
-- Substitua <ORDER_ID> pelo ID retornado no teste anterior
INSERT INTO public.order_items (
  order_id,
  product_name,
  quantity,
  unit_price,
  total_price,
  color,
  size,
  product_image_url
) VALUES (
  '<ORDER_ID>'::uuid,
  'Produto Teste',
  2,
  50.00,
  100.00,
  'Vermelho',
  'M',
  'https://exemplo.com/imagem.jpg'
) RETURNING id, product_name, quantity;
```

**Resultado esperado:**
- ✅ Inserção bem-sucedida
- ✅ Retorna `id`, `product_name` e `quantity`

### Teste 3: Registrar Histórico de Status

```sql
-- Substitua <ORDER_ID> pelo ID do pedido de teste
INSERT INTO public.order_status_history (
  order_id,
  status,
  notes
) VALUES (
  '<ORDER_ID>'::uuid,
  'aguardando_pagamento',
  'Pedido de teste criado'
) RETURNING id, status, notes;
```

**Resultado esperado:**
- ✅ Inserção bem-sucedida
- ✅ Retorna `id`, `status` e `notes`

---

## ✅ Verificação Completa (Query Única)

Execute esta query para verificar tudo de uma vez:

```sql
WITH enum_check AS (
  SELECT COUNT(*) as enum_count
  FROM pg_type 
  WHERE typname IN ('order_status', 'payment_method', 'payment_status', 'user_types')
),
table_check AS (
  SELECT COUNT(*) as table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name IN ('orders', 'order_items', 'order_status_history', 'payments')
),
columns_check AS (
  SELECT 
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'status'
      ) THEN 1 ELSE 0
    END +
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' 
        AND table_name = 'order_items' 
        AND column_name = 'color'
      ) THEN 1 ELSE 0
    END +
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' 
        AND table_name = 'order_items' 
        AND column_name = 'product_image_url'
      ) THEN 1 ELSE 0
    END +
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' 
        AND table_name = 'order_status_history' 
        AND column_name = 'status'
      ) THEN 1 ELSE 0
    END as critical_columns
)
SELECT 
  'ENUMs: ' || enum_count || '/4' as enums_status,
  'Tabelas: ' || table_count || '/4' as tables_status,
  'Colunas críticas: ' || critical_columns || '/4' as columns_status,
  CASE 
    WHEN enum_count = 4 AND table_count = 4 AND critical_columns = 4 
    THEN '✅✅✅ TUDO OK!' 
    ELSE '⚠️ Verifique os itens marcados'
  END as resultado_final
FROM enum_check, table_check, columns_check;
```

**Resultado esperado:**
```
enums_status      | tables_status      | columns_status          | resultado_final
------------------|--------------------|--------------------------|------------------
ENUMs: 4/4        | Tabelas: 4/4       | Colunas críticas: 4/4   | ✅✅✅ TUDO OK!
```

---

## 🎯 Teste na Aplicação

Após verificar no banco, teste na aplicação:

1. **Adicione produtos ao carrinho**
2. **Vá até o checkout**
3. **Preencha dados do endereço**
4. **Selecione método de entrega**
5. **Finalize o pedido**

**Verifique:**
- ✅ Pedido é criado sem erros
- ✅ Itens do pedido são salvos
- ✅ Histórico de status é criado
- ✅ Pedido aparece no painel admin

---

## ❌ Problemas Comuns

### Problema: Query de verificação mostra valores < 4/4

**Solução:**
1. Execute a migração correspondente que está faltando
2. Re-execute a query de verificação
3. Se persistir, execute `scripts/emergency/execute_now.sql`

### Problema: Teste de inserção falha

**Solução:**
1. Verifique qual coluna está faltando na mensagem de erro
2. Execute `migrations/002_fix_related_tables.sql` novamente
3. Ou execute `scripts/emergency/execute_now.sql`

---

## 📊 Relatório de Status

Para gerar um relatório completo, execute:

```sql
SELECT 
  'Banco de Dados - Status Geral' as titulo,
  '---' as separador,
  (SELECT COUNT(*) FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('orders', 'order_items', 'order_status_history', 'payments')) 
   as tabelas_criadas,
  (SELECT COUNT(*) FROM pg_type 
   WHERE typname IN ('order_status', 'payment_method', 'payment_status', 'user_types')) 
   as enums_criados,
  (SELECT COUNT(*) FROM public.orders) as pedidos_existentes;
```
