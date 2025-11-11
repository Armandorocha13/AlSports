# 🚀 Como Executar a Migration de Favoritos

## ⚠️ ERRO ATUAL

O erro no console mostra:
```
Could not find the table 'public.favorites' in the schema cache
```

Isso significa que a tabela `favorites` ainda não foi criada no Supabase.

## ✅ SOLUÇÃO: Executar a Migration

### Passo 1: Acessar o Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto do AL Sports

### Passo 2: Abrir o SQL Editor

1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"** (Nova consulta)

### Passo 3: Copiar e Colar a Migration

1. Abra o arquivo: `database/migrations/015_create_favorites_table.sql`
2. **Copie TODO o conteúdo** do arquivo
3. **Cole no SQL Editor** do Supabase

### Passo 4: Executar a Migration

1. Clique no botão **"Run"** (ou pressione Ctrl+Enter)
2. Aguarde a execução
3. Deve aparecer uma mensagem de sucesso: **"Success. No rows returned"**

### Passo 5: Verificar se a Tabela Foi Criada

1. No menu lateral, clique em **"Table Editor"**
2. Procure pela tabela **"favorites"**
3. Se aparecer, a migration foi executada com sucesso! ✅

## 📋 Conteúdo da Migration

A migration cria:
- ✅ Tabela `favorites` com todas as colunas necessárias
- ✅ Referência direta a `auth.users` (não `profiles`)
- ✅ Índices para performance
- ✅ Políticas RLS (Row Level Security) para segurança
- ✅ Trigger para atualizar `updated_at` automaticamente

## ⚠️ IMPORTANTE: Correção Aplicada

A migration foi atualizada para usar `auth.users(id)` diretamente em vez de `profiles(id)`, pois o código usa `user.id` do AuthContext, que vem de `auth.users`.

## 🔄 Após Executar a Migration

1. **Recarregue a página** do site (F5)
2. **Tente adicionar um favorito novamente**
3. **Verifique o console** - não deve mais aparecer o erro `PGRST205`
4. O favorito deve ser salvo corretamente no banco! ✅

## 🐛 Se Ainda Der Erro

Se após executar a migration ainda der erro:

1. **Verifique se a tabela existe:**
   - No SQL Editor, execute:
   ```sql
   SELECT * FROM public.favorites LIMIT 1;
   ```
   - Se der erro, a tabela não foi criada

2. **Verifique as políticas RLS:**
   - No SQL Editor, execute:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'favorites';
   ```
   - Deve retornar 3 políticas (SELECT, INSERT, DELETE)

3. **Verifique se o usuário está autenticado:**
   - No console do navegador, verifique se há um `user.id`
   - Se não estiver logado, os favoritos serão salvos apenas no localStorage

## 📝 Nota Importante

- A migration é **idempotente** (pode ser executada múltiplas vezes sem problemas)
- Se a tabela já existir, os comandos `CREATE TABLE IF NOT EXISTS` não vão causar erro
- As políticas RLS também são criadas com verificação de existência

