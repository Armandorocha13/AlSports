# 🎯 Como Adicionar Campo "Destaque" no Strapi

## ⚠️ Problema Identificado

O schema do produto no Strapi não tem um campo para marcar produtos como "em destaque". Por isso, nenhum produto aparece na seção "Produtos em Destaque".

## ✅ Solução: Adicionar Campo "Destaque" no Strapi

### Passo 1: Acessar o Content-Type Builder

1. Acesse o Strapi Admin: `http://localhost:1337/admin`
2. No menu lateral, clique em **"Content-Type Builder"**

### Passo 2: Editar o Content Type "Produto"

1. Na lista de **Collection Types**, encontre **"Produto"**
2. Clique no botão de editar (ícone de lápis) ao lado de "Produto"

### Passo 3: Adicionar Campo "Destaque"

1. Clique no botão **"+ Add another field"** (ou "+ Adicionar outro campo")
2. Selecione o tipo **"Boolean"**
3. Configure o campo:
   - **Name**: `Destaque` (ou `Featured` se preferir inglês)
   - **Type**: image.png
   - **Default value**: `false` (opcional)
4. Clique em **"Finish"**

### Passo 4: Salvar as Alterações

1. Clique no botão **"Save"** no topo da página
2. Aguarde a mensagem de sucesso
3. O Strapi vai reiniciar automaticamente

### Passo 5: Marcar Produtos como Destaque

1. Vá em **"Content Manager"** no menu lateral
2. Clique em **"Produto"**
3. Abra um produto que você quer destacar
4. Marque a checkbox **"Destaque"** como `true`
5. Clique em **"Save"** e depois em **"Publish"**

## 📋 Verificação

Após adicionar o campo e marcar produtos como destaque:

1. **Recarregue a página inicial** do site (F5)
2. **Verifique o console** (F12) - deve aparecer logs como:
   ```
   Produto em destaque encontrado: { id: '...', nome: '...', isFeatured: true }
   ```
3. **Os produtos marcados como destaque** devem aparecer na seção "Produtos em Destaque"

## 🔍 Nomes Alternativos de Campo

O código está preparado para aceitar os seguintes nomes de campo:
- `Destaque` (recomendado)
- `Featured`
- `EmDestaque`
- `is_featured`
- `featured`

**Recomendação:** Use `Destaque` para manter consistência com os outros campos em português.

## ⚠️ Importante

- O campo deve ser do tipo **Boolean** (true/false)
- Produtos só aparecerão em destaque se:
  1. O campo `Destaque` estiver marcado como `true`
  2. O produto estiver **publicado** (Published)
- Máximo de 8 produtos em destaque serão exibidos na página inicial



