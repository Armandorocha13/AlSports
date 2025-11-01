# ⚠️ MIGRAÇÃO CRÍTICA: Criar Tabela Settings

## Problema
A tabela `settings` não existe no seu banco de dados Supabase, por isso:
- ❌ Não é possível salvar o número do WhatsApp
- ❌ As configurações não persistem
- ❌ O número sempre volta ao padrão ao recarregar

## Solução
Aplique a migração `003_create_settings_table.sql` no Supabase.

## 📋 Passo a Passo

### 1. Acesse o Supabase Dashboard
1. Vá para https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** (no menu lateral)

### 2. Execute a Migração
1. Clique em **New Query**
2. Abra o arquivo: `database/migrations/003_create_settings_table.sql`
3. **Copie TODO o conteúdo** do arquivo
4. Cole no SQL Editor do Supabase
5. Clique em **Run** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)

### 3. Verifique se Funcionou
Execute esta query no SQL Editor:

```sql
-- Verificar se a tabela foi criada
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'settings';

-- Verificar se as configurações foram inseridas
SELECT key, value, description 
FROM public.settings 
ORDER BY key;
```

Você deve ver a tabela `settings` na lista e várias configurações, incluindo `whatsapp_number`.

### 4. Teste
1. Vá em `/admin/configuracoes` → aba "Contato"
2. Altere o número do WhatsApp
3. Clique em "Salvar"
4. Faça um novo pedido
5. Verifique se o número correto está sendo usado

## ✅ O que esta migração faz:

- ✅ Cria a tabela `settings` no banco
- ✅ Configura Row Level Security (RLS)
  - Todos podem ler configurações (necessário para funcionar)
  - Apenas admins podem modificar
- ✅ Cria trigger para atualizar `updated_at` automaticamente
- ✅ Insere configurações padrão (incluindo o número do WhatsApp)

## 🆘 Se der erro:

### Erro: "relation already exists"
A tabela já existe. Execute apenas a parte de inserir dados:

```sql
INSERT INTO public.settings (key, value, description) 
VALUES
  ('whatsapp_number', '"5521994595532"', 'Número do WhatsApp para recebimento de pedidos')
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value, 
    updated_at = NOW();
```

### Erro: "permission denied"
Verifique se você está logado como admin no Supabase Dashboard.

### Outros erros
Envie o erro completo que apareceu no SQL Editor.
