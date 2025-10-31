# Banco de Dados - AlSports E-commerce

## Visão Geral

Este banco de dados foi redesenhado com foco em **propriedades ACID** e **isolamento de usuários**, garantindo integridade e segurança dos dados.

## Características Principais

### Propriedades ACID

- **Atomicidade**: Operações transacionais através de stored procedures (`create_order_complete`)
- **Consistência**: CHECK constraints em todas as tabelas críticas
- **Isolamento**: Row Level Security (RLS) e locks adequados
- **Durabilidade**: Garantida pelo PostgreSQL

### Isolamento de Usuários

- Cada usuário pode ver **apenas seus próprios pedidos**
- `user_id` é **NOT NULL** em `orders` - garantindo que todo pedido pertence a um usuário
- Políticas RLS implementadas para todas as tabelas sensíveis
- Admins têm acesso completo através de políticas específicas

## Estrutura

### Arquivos

- `schema.sql` - Schema completo do banco de dados com todas as propriedades ACID

### Tabelas Principais

1. **profiles** - Perfis de usuários
2. **addresses** - Endereços dos usuários
3. **categories** - Categorias de produtos
4. **subcategories** - Subcategorias
5. **products** - Produtos
6. **product_images** - Imagens dos produtos
7. **orders** - Pedidos (com `user_id` NOT NULL)
8. **order_items** - Itens dos pedidos
9. **order_status_history** - Histórico de status
10. **payments** - Pagamentos
11. **whatsapp_orders** - Pedidos via WhatsApp
12. **settings** - Configurações do sistema

## Constraints e Validações

### CHECK Constraints Implementadas

- **orders**: Validação de valores positivos e consistência de total_amount
- **order_items**: Validação de quantidade > 0 e consistência de total_price
- **products**: Validação de preços, estoque e limites
- **addresses**: Validação de formato de CEP
- **profiles**: Validação de formato de email

### Foreign Keys

Todas as relações possuem FOREIGN KEY constraints com ações apropriadas:
- `ON DELETE CASCADE` para dados dependentes
- `ON DELETE RESTRICT` para proteger pedidos
- `ON DELETE SET NULL` para referências opcionais

## Funcionalidades Especiais

### Stored Procedure Transacional

```sql
create_order_complete(
  p_user_id UUID,
  p_subtotal DECIMAL(10,2),
  p_shipping_cost DECIMAL(10,2),
  p_discount_amount DECIMAL(10,2),
  p_shipping_address JSONB,
  p_items JSONB,
  ...
)
```

Esta função cria um pedido completo (pedido + itens + histórico + pagamento) em uma única transação, garantindo atomicidade.

### Geração de Número de Pedido

A função `generate_order_number()` utiliza locks para evitar race conditions na geração de números de pedido únicos.

### Triggers Automáticos

- **updated_at**: Atualiza automaticamente em todas as tabelas
- **validate_order_totals**: Valida e corrige total_amount
- **validate_order_item_totals**: Valida e corrige total_price
- **log_order_status_change**: Registra mudanças de status automaticamente

## Row Level Security (RLS)

### Políticas Implementadas

#### Para Usuários Comuns
- Podem ver/editar apenas seus próprios dados
- Podem criar pedidos apenas para si mesmos
- **NÃO podem ver pedidos de outros usuários**

#### Para Admins
- Acesso completo a todas as tabelas
- Podem gerenciar pedidos de todos os usuários
- Políticas específicas para cada operação (SELECT, INSERT, UPDATE, DELETE)

## Como Usar

### Aplicar o Schema

Execute o arquivo `schema.sql` no seu banco de dados PostgreSQL/Supabase:

```bash
# No Supabase SQL Editor ou psql
\i database/schema.sql
```

Ou copie e cole o conteúdo no Supabase SQL Editor.

### Verificar RLS

Para verificar se o RLS está funcionando:

```sql
-- Verificar políticas ativas
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Testar isolamento (execute como usuário comum)
SELECT * FROM orders; -- Deve retornar apenas pedidos do usuário atual
```

### Criar Pedido Usando Stored Procedure

```sql
SELECT create_order_complete(
  'user-uuid-here'::UUID,
  NULL, -- order_number (gerado automaticamente)
  100.00, -- subtotal
  15.00, -- shipping_cost
  0.00, -- discount_amount
  '{"street": "Rua Exemplo", "city": "São Paulo"}'::JSONB, -- shipping_address
  NULL, -- billing_address
  NULL, -- notes
  '[
    {
      "product_id": "uuid",
      "product_name": "Produto",
      "quantity": 2,
      "unit_price": 50.00
    }
  ]'::JSONB, -- items
  'pix'::payment_method
);
```

## Manutenção

### Backup

Sempre faça backup antes de aplicar mudanças:

```bash
pg_dump -h host -U user -d database > backup.sql
```

### Verificar Integridade

```sql
-- Verificar constraints
SELECT conname, contype, conrelid::regclass
FROM pg_constraint
WHERE connamespace = 'public'::regnamespace;

-- Verificar índices
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public';
```

## Notas Importantes

1. **user_id é NOT NULL**: Todos os pedidos devem pertencer a um usuário
2. **RLS está sempre ativo**: Não desabilite RLS em produção
3. **Stored procedures são transacionais**: Use-as para operações críticas
4. **CHECK constraints validam dados**: Erros de validação serão retornados automaticamente

## Suporte

Em caso de problemas:
1. Verifique os logs do PostgreSQL
2. Verifique as políticas RLS
3. Verifique as constraints
4. Consulte a documentação do PostgreSQL
