# 📚 Database - Estrutura e Documentação

Este diretório contém todo o código SQL e documentação relacionada ao banco de dados do projeto AlSports.

## 📁 Estrutura de Diretórios

```
database/
├── schema.sql                    # Schema completo do banco de dados
├── README.md                     # Este arquivo
│
├── migrations/                   # Migrações oficiais (executar em ordem)
│   ├── README.md                # Guia de migrações
│   ├── 000_create_enums_first.sql
│   ├── 001_ensure_orders_structure.sql
│   └── 002_fix_related_tables.sql
│
├── scripts/                      # Scripts auxiliares
│   ├── fix/                      # Scripts de correção
│   │   └── fix_enums.sql
│   └── emergency/                # Scripts de emergência
│       ├── execute_now.sql       # Script único para resolver tudo
│       └── drop_and_recreate_enum.sql
│
└── docs/                         # Documentação
    ├── execution_guide.md        # Guia de execução passo a passo
    └── testing.md                # Guia de testes e verificação
```

## 🚀 Início Rápido

### Para primeira instalação:

1. **Execute o schema completo:**
   ```sql
   -- Execute database/schema.sql no Supabase SQL Editor
   ```

2. **Ou execute as migrações em ordem:**
   - `migrations/000_create_enums_first.sql`
   - `migrations/001_ensure_orders_structure.sql`
   - `migrations/002_fix_related_tables.sql`

### Se você está com problemas:

1. **Solução rápida (recomendada):**
   - Execute `scripts/emergency/execute_now.sql`

2. **Scripts de correção específicos:**
   - Problemas com ENUMs? → `scripts/fix/fix_enums.sql`
   - Problemas com tabelas? → Consulte `docs/execution_guide.md`

## 📖 Documentação

- **[Guia de Execução](docs/execution_guide.md)** - Instruções detalhadas passo a passo
- **[Guia de Testes](docs/testing.md)** - Como verificar se tudo está funcionando
- **[Guia de Migrações](migrations/README.md)** - Documentação das migrações

## 🔧 Migrações

As migrações devem ser executadas **na ordem numérica**:

| Número | Arquivo | Descrição |
|--------|---------|-----------|
| 000 | `create_enums_first.sql` | Cria todos os ENUMs necessários |
| 001 | `ensure_orders_structure.sql` | Cria/atualiza a tabela `orders` |
| 002 | `fix_related_tables.sql` | Cria tabelas relacionadas (order_items, order_status_history, payments) |

## 🆘 Scripts de Emergência

Se você está enfrentando erros imediatos:

- **`scripts/emergency/execute_now.sql`** - Resolve tudo de uma vez (recomendado)
- **`scripts/emergency/drop_and_recreate_enum.sql`** - Último recurso para problemas com ENUMs

## ✅ Verificação

Após executar as migrações, verifique:

```sql
-- Verificar ENUMs
SELECT typname FROM pg_type WHERE typname IN ('order_status', 'payment_method', 'payment_status', 'user_types');

-- Verificar tabelas principais
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('orders', 'order_items', 'order_status_history', 'payments');
```

## 📝 Notas Importantes

- ⚠️ **Sempre faça backup** antes de executar scripts de emergência
- ✅ As migrações são **idempotentes** (podem ser executadas múltiplas vezes)
- 🔄 Execute migrações na **ordem numérica**
- 📋 Consulte os logs do Supabase para ver mensagens de sucesso

## 🤝 Contribuindo

Ao adicionar novas migrações:

1. Use numeração sequencial: `003_description.sql`
2. Inclua comentários explicativos
3. Torne o script idempotente (use `IF NOT EXISTS`)
4. Atualize este README se necessário

