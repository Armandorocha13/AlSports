# 🔧 Troubleshooting - Produtos não aparecem no Frontend

## Checklist de Verificação

### 1. ✅ Verificar se os produtos estão PUBLICADOS no Strapi

**IMPORTANTE:** No Strapi 5, os produtos precisam estar **PUBLICADOS**, não apenas salvos como rascunho.

1. Acesse o painel admin do Strapi: `http://localhost:1337/admin`
2. Vá em **Content Manager** → **Produto**
3. Verifique se os produtos têm o status **"Published"** (Publicado)
4. Se estiverem como **"Draft"** (Rascunho), clique no botão **"Publish"** de cada produto

### 2. ✅ Verificar se o Strapi está rodando

```bash
cd al-sport-backend
npm run develop
```

O Strapi deve estar rodando em `http://localhost:1337`

### 3. ✅ Verificar variáveis de ambiente

No arquivo `al-sport-frontend/.env.local`:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=seu_token_aqui
```

**Importante:** Reinicie o servidor Next.js após alterar variáveis de ambiente.

### 4. ✅ Verificar CORS no Strapi

O Strapi precisa permitir requisições do frontend. Verifique o arquivo `al-sport-backend/config/middlewares.ts`:

```typescript
export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

### 5. ✅ Verificar permissões da API no Strapi

1. Acesse: `http://localhost:1337/admin`
2. Vá em **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
3. Verifique se a permissão **find** e **findOne** estão habilitadas para:
   - **Produto**
   - **Categoria**
   - **Banner**
   - **ConteudosDoSite**

### 6. ✅ Testar a API diretamente

Abra no navegador ou use curl:

```bash
# Testar produtos
curl http://localhost:1337/api/produtos?populate=*

# Com token (se necessário)
curl -H "Authorization: Bearer SEU_TOKEN" http://localhost:1337/api/produtos?populate=*
```

### 7. ✅ Verificar estrutura dos dados

O schema do Strapi mostra que:
- Campo de variações: **"Variacao"** (singular, componente)
- Mas o código espera: **"variacoes"** (plural, relação)

**Solução:** Verifique se o campo no Strapi está configurado como:
- Tipo: **Component** (não Relation)
- Nome do componente: **variacoes.variacoes**
- Repeatable: **true**

### 8. ✅ Verificar console do navegador

Abra o DevTools (F12) e verifique:
- Erros no console
- Requisições na aba Network
- Se as requisições estão sendo feitas para a URL correta

### 9. ✅ Verificar logs do servidor Next.js

No terminal onde o Next.js está rodando, verifique:
- Erros de conexão
- Mensagens de erro ao buscar dados

## Teste Rápido

Execute este comando para testar a conexão:

```bash
cd al-sport-frontend
node scripts/test-strapi-connection.js
```

## Problemas Comuns

### ❌ "Cannot find module" ou erros de importação
**Solução:** Execute `npm install` no diretório do frontend

### ❌ Produtos aparecem no Strapi mas não no frontend
**Causa mais comum:** Produtos não estão publicados
**Solução:** Publique os produtos no painel admin do Strapi

### ❌ Erro 403 Forbidden
**Causa:** Permissões da API não configuradas
**Solução:** Configure as permissões no Strapi (item 5 acima)

### ❌ Erro CORS
**Causa:** CORS não configurado no Strapi
**Solução:** Configure o CORS (item 4 acima)

### ❌ Erro 401 Unauthorized
**Causa:** Token de API inválido ou não configurado
**Solução:** Verifique o token no `.env.local` e gere um novo token no Strapi se necessário




