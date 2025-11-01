# 🚀 Guia de Aplicação no Supabase

Este guia mostra como aplicar as migrações no Supabase de forma segura.

## ⚠️ IMPORTANTE: Backup Primeiro!

Antes de aplicar qualquer migração, faça backup do seu banco:

1. No Supabase Dashboard, vá em **Database** > **Backups**
2. Crie um backup manual antes de prosseguir

## 📋 Ordem de Execução

### Passo 1: Aplicar o Schema Principal

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Abra o arquivo `database/schema.sql`
4. Copie **todo o conteúdo**
5. Cole no SQL Editor do Supabase
6. Clique em **Run** ou pressione `Ctrl+Enter`

**O que este script faz:**
- Cria todos os ENUMs (se não existirem)
- Cria todas as tabelas com propriedades ACID
- Adiciona CHECK constraints para validação
- Cria funções e triggers
- Configura Row Level Security (RLS)
- Cria stored procedures

**Tempo estimado:** 2-5 minutos

### Passo 2: Restringir Acesso Administrativo

1. No **SQL Editor** do Supabase
2. Abra o arquivo `database/migrations/002_restrict_admin_access.sql`
3. Copie **todo o conteúdo**
4. Cole no SQL Editor
5. Clique em **Run**

**O que este script faz:**
- Cria função para verificar admin autorizado
- Previne criação de novos admins (exceto email autorizado)
- Garante que `almundodabola@gmail.com` seja admin
- Atualiza políticas RLS para usar verificação de admin

**Tempo estimado:** 1-2 minutos

### Passo 3: Criar Tabela Settings (OBRIGATÓRIO)

1. No **SQL Editor** do Supabase
2. Abra o arquivo `database/migrations/003_create_settings_table.sql`
3. Copie **todo o conteúdo**
4. Cole no SQL Editor
5. Clique em **Run**

**O que este script faz:**
- Cria a tabela `settings` se não existir
- Cria políticas RLS (todos podem ler, apenas admins podem modificar)
- Insere configurações padrão
- Cria trigger para atualizar `updated_at` automaticamente

**Tempo estimado:** 1 minuto

**⚠️ IMPORTANTE:** Esta tabela é necessária para salvar o número do WhatsApp!

## ✅ Verificação

Após aplicar os scripts, execute estas queries para verificar:

### Verificar Estrutura

```sql
-- Verificar se tabelas foram criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### Verificar Políticas RLS

```sql
-- Verificar políticas ativas
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Verificar Admin Autorizado

```sql
-- Verificar se email autorizado é admin
SELECT email, user_types 
FROM public.profiles 
WHERE LOWER(email) = 'almundodabola@gmail.com';
```

### Verificar Funções

```sql
-- Verificar funções criadas
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;
```

## 🔧 Se Algo Der Errado

### Erro: "relation already exists"

Isso significa que algumas estruturas já existem. O script usa `IF NOT EXISTS`, então deve funcionar. Se não funcionar:

1. Execute apenas as partes que falharam
2. Ou delete as estruturas antigas manualmente (cuidado!)

### Erro: "constraint already exists"

Algumas constraints já existem. Pule as partes que deram erro ou use `DROP CONSTRAINT IF EXISTS` antes.

### Erro: "policy already exists"

Remova políticas antigas manualmente ou pule essa parte.

### Rollback

Se precisar reverter:

1. Use o backup criado no início
2. Ou execute:
   ```sql
   DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
   -- Repita para outras políticas
   ```

## 📊 Próximos Passos

Após aplicar com sucesso:

1. ✅ Teste fazer login com o email autorizado
2. ✅ Verifique se pode acessar o painel admin
3. ✅ Teste criar um novo usuário (deve ser criado como cliente)
4. ✅ Teste criar pedidos como usuário comum
5. ✅ Verifique isolamento de dados (usuário comum não vê pedidos de outros)

## 🆘 Suporte

Se tiver problemas:

1. Verifique os logs no Supabase Dashboard > Logs
2. Verifique as mensagens NOTICE no SQL Editor
3. Execute as queries de verificação acima
4. Verifique se o RLS está habilitado nas tabelas

## 📝 Notas Importantes

- **user_id é NOT NULL**: Todos os pedidos devem ter um usuário
- **RLS sempre ativo**: Não desabilite em produção
- **Email autorizado**: Apenas `almundodabola@gmail.com` pode ser admin
- **Novos usuários**: Serão sempre criados como 'cliente'

