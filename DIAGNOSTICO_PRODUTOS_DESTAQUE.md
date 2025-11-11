# 🔍 Diagnóstico: Produtos em Destaque Não Aparecem

## ✅ O Que Foi Feito

1. **Logs detalhados adicionados** em todos os pontos do fluxo
2. **Endpoint de teste criado** para verificar diretamente o que o Strapi retorna
3. **Cache do Next.js** precisa ser limpo

## 🔧 Passos para Diagnosticar

### Passo 1: Limpar Cache do Next.js

**No terminal, execute:**
```bash
# Pare o servidor (Ctrl + C)
# Depois execute:
rm -rf .next
# Ou no Windows PowerShell:
Remove-Item -Recurse -Force .next
```

**Ou delete manualmente:**
- Feche o servidor Next.js
- Delete a pasta `.next` dentro de `al-sport-frontend`
- Reinicie o servidor: `npm run dev`

### Passo 2: Verificar Endpoint de Teste

1. **Acesse no navegador:**
   ```
   http://localhost:3000/api/test-produtos-destaque
   ```

2. **Você verá um JSON com:**
   - Total de produtos
   - Total de produtos em destaque
   - Lista de todos os produtos e seus valores de `featured`
   - Dados brutos do Strapi (incluindo o campo `Destaque`)

3. **Verifique:**
   - O campo `Destaque` está presente nos dados brutos?
   - O valor de `Destaque` é `true`?
   - O produto está `publicado: true`?

### Passo 3: Verificar Console do Navegador

1. **Abra a página inicial:** `http://localhost:3000`
2. **Abra o console (F12)**
3. **Procure pelos logs:**
   ```
   📦 getProdutos - Produtos retornados do Strapi: X
   🔍 Verificando produto em destaque: ...
   ⭐ Total de produtos em destaque encontrados: X
   ```

### Passo 4: Verificar no Strapi

1. **Acesse:** `http://localhost:1337/admin`
2. **Vá em:** Content Manager > Produto
3. **Abra o produto que está marcado como destaque**
4. **Verifique:**
   - ✅ Campo "Destaque" está marcado como `TRUE`?
   - ✅ Produto está **PUBLICADO** (não apenas salvo)?
   - ✅ Status mostra "Published" (não "Draft")?

## 🐛 Possíveis Problemas

### Problema 1: Produto Não Está Publicado

**Sintoma:** `publicado: false` no endpoint de teste

**Solução:**
1. No Strapi, abra o produto
2. Clique em **"Publish"** (não apenas "Save")
3. Aguarde a confirmação
4. Recarregue a página do site

### Problema 2: Campo Destaque Não Está Sendo Retornado

**Sintoma:** `destaque: undefined` ou `temDestaque: false` no endpoint de teste

**Solução:**
1. **Reinicie o Strapi:**
   ```bash
   cd al-sport-backend
   # Pare o servidor (Ctrl + C)
   npm run develop
   ```

2. **Verifique se o campo existe no schema:**
   - Vá em Content-Type Builder
   - Verifique se o campo "Destaque" está no schema do Produto

### Problema 3: Cache do Next.js

**Sintoma:** Logs não aparecem ou mostram dados antigos

**Solução:**
1. Delete a pasta `.next`
2. Reinicie o servidor Next.js
3. Recarregue a página com `Ctrl + Shift + R`

### Problema 4: Valor do Campo Está Errado

**Sintoma:** `destaque: false` mesmo estando marcado como `true` no Strapi

**Solução:**
1. No Strapi, desmarque e marque novamente o campo "Destaque"
2. Salve e publique o produto novamente
3. Recarregue a página do site

## 📋 Checklist

- [ ] Cache do Next.js foi limpo (pasta `.next` deletada)
- [ ] Strapi foi reiniciado
- [ ] Produto está **PUBLICADO** (não apenas salvo)
- [ ] Campo "Destaque" está marcado como `TRUE`
- [ ] Endpoint de teste mostra `destaque: true` nos dados brutos
- [ ] Console mostra produtos em destaque encontrados

## 🆘 Se Nada Funcionar

1. **Compartilhe o resultado do endpoint de teste:**
   - Acesse: `http://localhost:3000/api/test-produtos-destaque`
   - Copie todo o JSON retornado
   - Compartilhe comigo

2. **Compartilhe os logs do console:**
   - Abra o console (F12)
   - Copie todos os logs relacionados a produtos
   - Compartilhe comigo

Com essas informações, posso identificar exatamente onde está o problema!



