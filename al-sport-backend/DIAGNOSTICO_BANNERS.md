# 🔍 Diagnóstico: Banners não aparecem no site

## Checklist de Verificação

### 1. ✅ Verificar se os banners estão PUBLICADOS

**CRÍTICO:** Banners só aparecem se estiverem **PUBLICADOS**, não apenas salvos como draft.

1. Acesse: `http://localhost:1337/admin`
2. Vá em **Content Manager** → **Banner**
3. Verifique se os banners têm o badge verde **"Published"**
4. Se estiverem como **"Draft"**, clique em **"Publish"** em cada banner

### 2. ✅ Verificar campo Local

O campo `Local` é **OBRIGATÓRIO** e deve ter um dos seguintes valores:
- `Topo-Home` - Para banners no topo da página inicial
- `Rodape` - Para banners no rodapé
- `Promocional` - Para banners promocionais

**Verificar:**
1. Abra cada banner no Strapi
2. Confirme que o campo `Local` está preenchido
3. Confirme que o valor está exatamente como acima (case-sensitive)

### 3. ✅ Verificar ImagemDesktop

Pelo menos a imagem desktop deve estar cadastrada:
1. Abra cada banner no Strapi
2. Verifique se o campo `ImagemDesktop` tem uma imagem
3. A imagem deve estar **enviada e salva** (não apenas selecionada)

### 4. ✅ Verificar Permissões da API

1. Acesse: `http://localhost:1337/admin`
2. Vá em **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
3. Na seção **Banner**, verifique se estão habilitados:
   - ✅ **find** (buscar todos)
   - ✅ **findOne** (buscar um específico)
4. Clique em **Save** se fez alterações

### 5. ✅ Testar API diretamente

Teste se a API está retornando os banners:

**No navegador:**
```
http://localhost:1337/api/banners?populate=*
```

**Ou via curl:**
```bash
curl http://localhost:1337/api/banners?populate=*
```

**O que verificar na resposta:**
- Deve retornar um array `data` com os banners
- Cada banner deve ter `publishedAt` preenchido (não null)
- Cada banner deve ter `Local` preenchido
- Cada banner deve ter `ImagemDesktop` com dados da imagem

### 6. ✅ Verificar logs do Next.js

Acesse a página inicial e verifique os logs do servidor Next.js. Procure por:

- `🎨 getBanners - Iniciando busca de banners`
- `🎨 getBanners - Banners normalizados: X` (onde X deve ser > 0)
- `🏠 HomePage - Banners recebidos do Strapi`
- `🏠 HomePage - Filtro Topo-Home - Banner`

**Se aparecer:**
- `⚠️ getBanners - Banners não publicados encontrados` → Publique os banners
- `⚠️ HomePage - Banner filtrado por falta de imagem` → Adicione imagem ao banner
- `passa: false` → Verifique o campo `Local` e `publishedAt`

### 7. ✅ Testar endpoint de diagnóstico

Acesse: `http://localhost:3000/api/test-strapi`

Verifique a seção `banners`:
- `success: true`
- `count: X` (onde X deve ser > 0 se houver banners)
- `data: [...]` (deve mostrar os banners)

## Problemas Comuns e Soluções

### ❌ Banner não aparece mesmo estando publicado

**Causa:** Campo `Local` não preenchido ou valor incorreto
**Solução:** 
1. Abra o banner no Strapi
2. Preencha o campo `Local` com um dos valores: `Topo-Home`, `Rodape`, ou `Promocional`
3. Salve e publique novamente

### ❌ Banner aparece nos logs mas não no site

**Causa:** Banner não tem imagem ou imagem inválida
**Solução:**
1. Verifique se `ImagemDesktop` está preenchido
2. Verifique se a imagem foi enviada corretamente
3. Tente fazer upload da imagem novamente

### ❌ Erro 403 ao buscar banners

**Causa:** Permissões não configuradas
**Solução:**
1. Configure as permissões (item 4 acima)
2. Reinicie o servidor Strapi

### ❌ Erro 404 ao buscar banners

**Causa:** Content-Type não existe ou nome incorreto
**Solução:**
1. Verifique se o Content-Type `banner` existe no Strapi
2. Verifique se o nome da API é `banners` (plural)
3. Reinicie o servidor Strapi

## Estrutura Esperada do Banner

```json
{
  "data": [
    {
      "id": 1,
      "documentId": "xxx",
      "ImagemDesktop": {
        "id": 1,
        "url": "/uploads/..."
      },
      "Local": "Topo-Home",
      "publishedAt": "2025-11-14T...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

## Teste Rápido

Execute este comando para testar:

```bash
# Testar se a API retorna banners
curl http://localhost:1337/api/banners?populate=* | jq '.data | length'

# Deve retornar um número > 0 se houver banners publicados
```

