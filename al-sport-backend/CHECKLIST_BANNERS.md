# ✅ Checklist: Banners Aparecendo no Site

## Verificações Necessárias

### 1. ✅ Permissões Configuradas
- [x] Settings → Users & Permissions Plugin → Roles → Public
- [x] Banner → find (habilitado)
- [x] Banner → findOne (habilitado)

### 2. ⚠️ Verificar Banners no Strapi

Para cada banner cadastrado, verifique:

#### A. Status de Publicação
- [ ] Banner está com badge verde **"Published"** (não "Draft")
- [ ] Se estiver como "Draft", clique em **"Publish"**

#### B. Campo Local
- [ ] Campo `Local` está preenchido
- [ ] Valor é exatamente um dos seguintes (case-sensitive):
  - `Topo-Home` (para banners no topo)
  - `Rodape` (para banners no rodapé)
  - `Promocional` (para banners promocionais)

#### C. Imagem Desktop
- [ ] Campo `ImagemDesktop` tem uma imagem cadastrada
- [ ] A imagem foi enviada e salva corretamente
- [ ] A imagem não está corrompida

### 3. 🧪 Testar

#### Teste 1: API Direta do Strapi
Acesse no navegador:
```
http://localhost:1337/api/banners?populate=*
```

**O que verificar:**
- Deve retornar um JSON com `data: [...]`
- Cada banner deve ter `publishedAt` preenchido (não null)
- Cada banner deve ter `Local` preenchido
- Cada banner deve ter `ImagemDesktop` com dados da imagem

#### Teste 2: Endpoint de Diagnóstico
Acesse:
```
http://localhost:3000/api/test-banners
```

**O que verificar:**
- `summary.status` deve ser `"ok"` (não `"has_issues"`)
- `summary.topHomeCount` deve ser > 0 se houver banners "Topo-Home"
- `summary.bottomCount` deve ser > 0 se houver banners "Rodape" ou "Promocional"
- `issues` deve estar vazio `[]`

#### Teste 3: Página Inicial
Acesse:
```
http://localhost:3000
```

**O que verificar:**
- Banners aparecem no carrossel do topo (se Local="Topo-Home")
- Banners aparecem no rodapé (se Local="Rodape" ou "Promocional")
- Imagens dos banners estão carregando

### 4. 📋 Logs do Servidor

Verifique os logs do servidor Next.js ao acessar a página inicial. Procure por:

**Logs esperados:**
```
🎨 getBanners - Iniciando busca de banners
🎨 getBanners - Banners normalizados: X
🏠 HomePage - Banners recebidos do Strapi: { total: X }
🏠 HomePage - Filtro Topo-Home - Banner: { passa: true }
✅ transformStrapiBannerToAppBanner - Banner transformado: { hasImage: true }
```

**Logs de problema:**
```
⚠️ getBanners - Banners não publicados encontrados
⚠️ HomePage - Banner filtrado por falta de imagem
⚠️ transformStrapiBannerToAppBanner - Banner não tem ImagemDesktop
```

## Estrutura Esperada do Banner no Strapi

```json
{
  "ImagemDesktop": {
    "id": 1,
    "url": "/uploads/banner.jpg",
    ...
  },
  "Local": "Topo-Home",
  "publishedAt": "2025-11-14T...",
  ...
}
```

## Problemas Comuns

### ❌ Banners não aparecem mesmo estando publicados

**Causa:** Campo `Local` não preenchido ou valor incorreto
**Solução:** 
1. Abra o banner no Strapi
2. Preencha `Local` com: `Topo-Home`, `Rodape` ou `Promocional`
3. Salve e publique novamente

### ❌ Banner aparece nos logs mas não no site

**Causa:** Banner não tem imagem ou imagem inválida
**Solução:**
1. Verifique se `ImagemDesktop` está preenchido
2. Faça upload da imagem novamente se necessário
3. Verifique se a imagem não está corrompida

### ❌ Erro 403 ao buscar banners

**Causa:** Permissões não configuradas corretamente
**Solução:**
1. Verifique as permissões (item 1 acima)
2. Reinicie o servidor Strapi após configurar permissões

## Próximos Passos

1. ✅ Permissões configuradas
2. ⏳ Verificar se banners estão publicados
3. ⏳ Verificar se campo Local está preenchido
4. ⏳ Verificar se ImagemDesktop está cadastrada
5. ⏳ Testar endpoints de diagnóstico
6. ⏳ Verificar se banners aparecem no site

