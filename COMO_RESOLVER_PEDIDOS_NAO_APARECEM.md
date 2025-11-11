# 🔧 Como Resolver: Pedidos Não Aparecem no Banco

## ⚠️ Problema Identificado

O pedido é criado no frontend (mostra "Pedido Confirmado!"), mas não aparece:
- ❌ Na tabela `pedidos` do Supabase
- ❌ No painel do Strapi

## ✅ Soluções Implementadas

### 1. Integração com Strapi Adicionada

Agora o código tenta criar o pedido no Strapi automaticamente após criar no Supabase.

### 2. Logs Melhorados

Logs mais detalhados foram adicionados para identificar problemas.

## 🔍 Diagnóstico: Verificar o Console

Quando criar um pedido, verifique o console do navegador (F12) e procure por:

### ✅ Logs de Sucesso:
```
📦 Registrando pedido no banco de dados...
✅ Pedido registrado com sucesso no banco
✅ Pedido criado no Strapi com sucesso!
```

### ❌ Logs de Erro:
```
❌ ERRO ao registrar pedido no banco
❌ Código do erro: [código]
⚠️ ERRO DE PERMISSÃO (RLS)
```

## 🛠️ Possíveis Problemas e Soluções

### Problema 1: Erro de RLS (Row Level Security)

**Sintoma:** Erro `42501` ou "permission denied"

**Solução:** Verificar políticas RLS no Supabase:

1. Acesse o Supabase Dashboard
2. Vá em **Authentication** > **Policies**
3. Verifique a tabela `orders`
4. Deve haver uma política permitindo INSERT para usuários autenticados:

```sql
-- Política necessária:
CREATE POLICY "Users can insert their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

### Problema 2: Tabela `orders` vs `pedidos`

**Sintoma:** O código insere em `orders`, mas você está olhando `pedidos`

**Solução:** 
- O código usa a tabela `orders` (correto)
- Verifique a tabela `orders` no Supabase, não `pedidos`
- Se quiser usar `pedidos`, precisamos alterar o código

### Problema 3: Strapi Não Está Rodando

**Sintoma:** Log mostra "⚠️ Aviso: Não foi possível criar pedido no Strapi"

**Solução:**
1. Verifique se o Strapi está rodando: `http://localhost:1337`
2. Configure a variável `STRAPI_API_TOKEN` no `.env.local`:
   ```env
   STRAPI_API_TOKEN=seu_token_aqui
   ```
3. Para obter o token:
   - Acesse o Strapi Admin
   - Vá em **Settings** > **API Tokens**
   - Crie um token com permissão de **Full access**

### Problema 4: Usuário Não Autenticado

**Sintoma:** `user_id` é `null` nos logs

**Solução:**
- O usuário precisa estar logado para criar pedidos
- Verifique se há uma sessão ativa no Supabase

## 📋 Checklist de Verificação

- [ ] Console mostra erro ao criar pedido?
- [ ] Usuário está autenticado? (`user.id` não é null)
- [ ] Tabela `orders` existe no Supabase?
- [ ] Políticas RLS estão configuradas corretamente?
- [ ] Strapi está rodando?
- [ ] `STRAPI_API_TOKEN` está configurado?

## 🔄 Próximos Passos

1. **Criar um pedido de teste**
2. **Abrir o console (F12)**
3. **Copiar todos os logs relacionados ao pedido**
4. **Compartilhar os logs** para diagnóstico preciso

## 📝 Nota Importante

- O pedido **sempre** é criado no Supabase primeiro
- Se falhar no Supabase, o pedido não é criado
- Se falhar no Strapi, o pedido ainda é criado no Supabase (não bloqueia)



