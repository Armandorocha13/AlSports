# 📖 Guia de Execução - Passo a Passo

Este guia detalha como executar as migrações e corrigir problemas no banco de dados.

## 🎯 Cenários

### Cenário 1: Primeira Instalação (Banco Vazio)

Se você está criando o banco do zero:

1. **Execute o schema completo:**
   - Abra `database/schema.sql`
   - Copie todo o conteúdo
   - Cole no Supabase SQL Editor
   - Execute

2. **Pronto!** Todo o banco será criado de uma vez.

---

### Cenário 2: Banco Existente sem Estrutura

Se o banco já existe mas não tem as tabelas:

**Opção A - Migrações Sequenciais (Recomendado):**

1. Execute `migrations/000_create_enums_first.sql`
2. Execute `migrations/001_ensure_orders_structure.sql`
3. Execute `migrations/002_fix_related_tables.sql`

**Opção B - Script Único (Rápido):**

1. Execute `scripts/emergency/execute_now.sql`
   - Este script faz tudo de uma vez

---

### Cenário 3: Erro Específico

#### Erro: "invalid input value for enum order_status"

**Solução:**
1. Execute `scripts/emergency/execute_now.sql`
   - Este script detecta e corrige problemas com ENUMs automaticamente

#### Erro: "Could not find column 'X' in table 'Y'"

**Solução:**
1. Execute `migrations/001_ensure_orders_structure.sql` (para tabela orders)
2. Execute `migrations/002_fix_related_tables.sql` (para tabelas relacionadas)

#### Erro: Tabela não existe

**Solução:**
1. Execute `migrations/002_fix_related_tables.sql`
   - Cria todas as tabelas relacionadas

---

## 🔧 Scripts Disponíveis

### Migrações Oficiais

| Arquivo | Quando Usar |
|---------|-------------|
| `000_create_enums_first.sql` | Sempre execute primeiro |
| `001_ensure_orders_structure.sql` | Para criar/atualizar tabela orders |
| `002_fix_related_tables.sql` | Para criar tabelas relacionadas |

### Scripts de Correção

| Arquivo | Quando Usar |
|---------|-------------|
| `scripts/fix/fix_enums.sql` | Problemas específicos com ENUMs |
| `scripts/emergency/execute_now.sql` | **Quando nada mais funciona** - resolve tudo |

### Scripts de Emergência

| Arquivo | Quando Usar |
|---------|-------------|
| `scripts/emergency/drop_and_recreate_enum.sql` | **Último recurso** - recria ENUMs completamente |

---

## 📋 Checklist de Execução

Use este checklist para garantir que tudo está correto:

### Antes de Começar

- [ ] Fiz backup do banco de dados (se tiver dados importantes)
- [ ] Tenho acesso ao Supabase SQL Editor
- [ ] Sei qual cenário se aplica ao meu caso

### Durante a Execução

- [ ] Executei as migrações na ordem numérica
- [ ] Verifiquei os logs para mensagens de sucesso (✅)
- [ ] Não ignorei erros (⚠️ podem ser importantes)

### Após a Execução

- [ ] Executei queries de verificação (consulte `docs/testing.md`)
- [ ] Testei criar um pedido na aplicação
- [ ] Verifiquei que o pedido foi salvo no banco

---

## 🆘 Resolução de Problemas

### Problema: Script falha no meio

**Causa comum:** Dependências faltando ou ordem errada

**Solução:**
1. Verifique qual parte falhou
2. Execute apenas a parte que falhou
3. Consulte os logs do Supabase para detalhes

### Problema: "ENUM já existe mas não funciona"

**Causa comum:** ENUM foi criado com valores diferentes

**Solução:**
1. Execute `scripts/emergency/execute_now.sql`
   - Ele detecta e recria automaticamente

### Problema: "Coluna não pode ser NULL mas tem valores NULL"

**Causa comum:** Tabela já tinha dados antes da migração

**Solução:**
1. O script deve preencher valores NULL automaticamente
2. Se não funcionar, preencha manualmente:
   ```sql
   UPDATE orders SET shipping_address = '{}'::jsonb WHERE shipping_address IS NULL;
   ```

---

## 📞 Ainda com Problemas?

Se nenhuma das soluções acima funcionou:

1. **Verifique os logs detalhados:**
   - Abra o console do navegador (F12)
   - Execute a operação que falha
   - Copie a mensagem de erro completa

2. **Execute diagnóstico:**
   ```sql
   -- Verificar estrutura atual
   SELECT 
     table_name,
     column_name,
     data_type,
     is_nullable
   FROM information_schema.columns
   WHERE table_schema = 'public'
   AND table_name IN ('orders', 'order_items', 'order_status_history')
   ORDER BY table_name, ordinal_position;
   ```

3. **Consulte a documentação:**
   - `README.md` - Visão geral
   - `migrations/README.md` - Detalhes das migrações
   - `docs/testing.md` - Como testar

---

## ✅ Sucesso!

Se você chegou até aqui e tudo funcionou:

🎉 **Parabéns!** Seu banco de dados está configurado corretamente.

Agora você pode:
- ✅ Criar pedidos na aplicação
- ✅ Ver pedidos no painel admin
- ✅ Gerenciar status de pedidos
- ✅ Ver histórico de pedidos
