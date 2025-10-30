# 🔄 Migrações do Banco de Dados

Este diretório contém as migrações oficiais do banco de dados. Execute-as **na ordem numérica**.

## ⚠️ IMPORTANTE: Ordem de Execução

**SEMPRE execute as migrações na ordem numérica!**

| Ordem | Arquivo | Descrição |
|-------|---------|-----------|
| **1** | `000_create_enums_first.sql` | Cria todos os ENUMs necessários |
| **2** | `001_ensure_orders_structure.sql` | Cria/atualiza tabela `orders` e colunas |
| **3** | `002_fix_related_tables.sql` | Cria tabelas relacionadas (order_items, order_status_history, payments) |
| **4** | `003_fix_orders_view.sql` | Corrige view orders_with_customer e verifica permissões |

## 🚀 Como Executar

### Via Supabase Dashboard (Recomendado)

1. Acesse [Supabase Dashboard](https://app.supabase.com) → **SQL Editor**
2. Execute **uma por vez, na ordem**:
   - Execute `000_create_enums_first.sql`
   - Execute `001_ensure_orders_structure.sql`
   - Execute `002_fix_related_tables.sql`
   - Execute `003_fix_orders_view.sql`
3. Verifique mensagens de sucesso nos logs

### Via CLI

```bash
psql -h <host> -U <user> -d <database> -f database/migrations/000_create_enums_first.sql
psql -h <host> -U <user> -d <database> -f database/migrations/001_ensure_orders_structure.sql
psql -h <host> -U <user> -d <database> -f database/migrations/002_fix_related_tables.sql
psql -h <host> -U <user> -d <database> -f database/migrations/003_fix_orders_view.sql
```

## 📋 Detalhes das Migrações

### 000_create_enums_first.sql
- Cria ENUM `order_status` (aguardando_pagamento, pagamento_confirmado, etc.)
- Cria ENUM `payment_method` (pix, cartao_credito, etc.)
- Cria ENUM `payment_status` (pendente, aprovado, etc.)
- Cria ENUM `user_types` (cliente, admin, vendedor)
- **Idempotente**: Pode ser executado múltiplas vezes

### 001_ensure_orders_structure.sql
- Cria tabela `orders` se não existir
- Adiciona/verifica todas as colunas necessárias:
  - `order_number` (TEXT, UNIQUE, NOT NULL)
  - `status` (order_status, NOT NULL)
  - `subtotal`, `shipping_cost`, `total_amount` (DECIMAL)
  - `shipping_address` (JSONB, NOT NULL)
  - `discount_amount`, `notes`, timestamps, etc.
- Cria índices para performance
- **Idempotente**: Verifica antes de criar/adicionar

### 002_fix_related_tables.sql
- Cria tabela `order_status_history` com coluna `status`
- Cria tabela `order_items` com todas as colunas (incluindo `color`, `product_image_url`, etc.)
- Cria tabela `payments`
- Cria índices para todas as tabelas
- **Idempotente**: Verifica antes de criar/adicionar

### 003_fix_orders_view.sql
- Recria a view `orders_with_customer` para garantir funcionamento
- Verifica estatísticas do banco (pedidos e usuários)
- Testa permissões RLS
- Valida estrutura da tabela `orders`
- **Idempotente**: Pode ser executado múltiplas vezes

## ✅ Verificação Pós-Migração

Após executar todas as migrações, execute:

```sql
-- Verificar ENUMs
SELECT typname, 
  (SELECT string_agg(enumlabel, ', ' ORDER BY enumsortorder) 
   FROM pg_enum WHERE enumtypid = t.oid) as valores
FROM pg_type t
WHERE typname IN ('order_status', 'payment_method', 'payment_status', 'user_types');

-- Verificar tabelas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('orders', 'order_items', 'order_status_history', 'payments');

-- Verificar colunas importantes
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name IN ('orders', 'order_items', 'order_status_history')
AND column_name IN ('status', 'color', 'product_image_url')
ORDER BY table_name, column_name;
```

## O que cada migração faz

### 001_ensure_orders_structure.sql

Esta migração:
- Verifica e cria o ENUM `order_status` se necessário
- Cria a tabela `orders` se não existir
- Adiciona colunas faltantes na tabela `orders`:
  - `discount_amount` (DECIMAL, DEFAULT 0)
  - `shipping_address` (JSONB NOT NULL)
  - `billing_address` (JSONB, opcional)
  - `tracking_code`, `estimated_delivery`, `delivered_at` (opcionais)
- Garante que `shipping_address` seja NOT NULL (preenche valores nulos e adiciona constraint)
- Cria índices necessários para performance
- Cria tabelas relacionadas se não existirem:
  - `order_items`
  - `order_status_history`
  - `payments`

**Importante**: Esta migração é **idempotente**, ou seja, pode ser executada múltiplas vezes sem causar erros. Ela verifica se cada elemento já existe antes de criar/modificar.

## Verificação da Estrutura

Para verificar se a estrutura está correta após aplicar a migração, execute:

```sql
-- Verificar colunas da tabela orders
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'orders'
ORDER BY ordinal_position;
```

Você deve ver:
- `shipping_address` com `is_nullable = 'NO'` (NOT NULL)
- `discount_amount` com `column_default = '0'`
- Todas as outras colunas conforme o schema

## 🧪 Scripts de Teste

### TESTE_SIMPLES.sql (Recomendado)
- **Uso**: Verificação básica sem inserir dados
- **Quando usar**: Para diagnosticar problemas de estrutura
- **Execução**: Execute no Supabase SQL Editor
- **Resultado**: Mostra status das tabelas, views e permissões

### TESTE_PEDIDOS.sql (Avançado)
- **Uso**: Teste completo com inserção de dados de exemplo
- **Quando usar**: Para testar o fluxo completo de criação de pedidos
- **Execução**: Execute no Supabase SQL Editor
- **Resultado**: Cria um pedido de teste e verifica se aparece na view

## Resolução de Problemas

Se você receber erros sobre colunas não encontradas:

1. Execute a migração `001_ensure_orders_structure.sql`
2. Verifique se a migração foi executada com sucesso (procure por mensagens `RAISE NOTICE`)
3. Se ainda houver problemas, execute `TESTE_SIMPLES.sql` para diagnosticar
4. Se ainda houver problemas, verifique se você tem permissões adequadas no banco de dados
