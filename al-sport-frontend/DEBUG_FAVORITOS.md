# 🔍 Debug: Botão de Favorito Não Funciona

## ✅ Correções Aplicadas

1. ✅ Tratamento assíncrono correto com `async/await`
2. ✅ Logs de debug adicionados
3. ✅ Estado de loading para evitar cliques múltiplos
4. ✅ Tratamento de erros com feedback ao usuário

## 🔍 Como Diagnosticar

### 1. Verificar Console do Navegador

1. Abra o site e pressione **F12**
2. Vá para a aba **"Console"**
3. Clique no botão de favorito
4. Procure por logs:
   - `Adicionando produto aos favoritos:`
   - `Estado local atualizado. Total de favoritos:`
   - `Usuário logado, salvando no banco. User ID:`
   - `Favorito adicionado com sucesso no banco:`
   - OU `Usuário não logado, favorito salvo apenas no localStorage`

### 2. Verificar se a Tabela Foi Criada

**IMPORTANTE:** A tabela `favorites` precisa existir no Supabase!

1. Acesse o Supabase Dashboard
2. Vá em **Table Editor**
3. Verifique se existe a tabela `favorites`
4. Se não existir, execute a migration:
   - Arquivo: `database/migrations/015_create_favorites_table.sql`
   - Execute no SQL Editor do Supabase

### 3. Verificar Erros no Console

Se aparecer algum erro, pode ser:

**Erro: "relation 'favorites' does not exist"**
- **Solução:** Execute a migration `015_create_favorites_table.sql`

**Erro: "permission denied for table favorites"**
- **Solução:** Verifique se as políticas RLS estão corretas na migration

**Erro: "new row violates row-level security policy"**
- **Solução:** Verifique se o usuário está autenticado corretamente

### 4. Verificar Autenticação

1. Verifique se está logado:
   - Vá em **Minha Conta**
   - Se não estiver logado, faça login primeiro

2. Se não estiver logado:
   - Os favoritos serão salvos apenas no localStorage
   - Ao fazer login, serão sincronizados com o banco

### 5. Verificar localStorage

1. No console do navegador, digite:
   ```javascript
   JSON.parse(localStorage.getItem('al-sports-favorites') || '[]')
   ```
2. Deve mostrar os favoritos salvos localmente

## 🐛 Problemas Comuns

### Problema 1: Botão não muda de cor
**Causa:** Estado não está sendo atualizado

**Solução:**
- Verifique os logs no console
- Verifique se `isFavorite(product.id)` retorna `true` após clicar
- Recarregue a página e tente novamente

### Problema 2: Favorito não aparece na página de favoritos
**Causa:** Pode não estar sendo salvo corretamente

**Solução:**
- Verifique os logs no console
- Se estiver logado, verifique se foi salvo no banco
- Se não estiver logado, verifique o localStorage

### Problema 3: Erro ao salvar no banco
**Causa:** Tabela não existe ou políticas RLS incorretas

**Solução:**
1. Execute a migration `015_create_favorites_table.sql`
2. Verifique se as políticas RLS estão ativas
3. Verifique se o usuário está autenticado

## 📋 Checklist de Verificação

- [ ] Tabela `favorites` existe no Supabase
- [ ] Políticas RLS estão ativas na tabela
- [ ] Usuário está autenticado (ou favoritos serão salvos no localStorage)
- [ ] Console não mostra erros
- [ ] Logs aparecem ao clicar no botão
- [ ] Estado local é atualizado (verificar logs)

## 🔄 Teste Rápido

1. **Abra o console do navegador (F12)**
2. **Clique no botão de favorito**
3. **Verifique os logs:**
   ```
   Adicionando produto aos favoritos: [ID] [Nome]
   Estado local atualizado. Total de favoritos: [Número]
   ```
4. **Se estiver logado, deve aparecer:**
   ```
   Usuário logado, salvando no banco. User ID: [UUID]
   Favorito adicionado com sucesso no banco: [Dados]
   ```
5. **O botão deve mudar de cor (vermelho)**
6. **O ícone Heart deve ficar preenchido**

## 🚨 Se Ainda Não Funcionar

1. **Copie todos os logs do console**
2. **Verifique se a migration foi executada**
3. **Teste sem estar logado** (deve funcionar com localStorage)
4. **Teste estando logado** (deve salvar no banco)



