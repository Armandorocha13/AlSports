# ✅ Checklist - Produtos não aparecem no Frontend

## 🔴 Problema Mais Comum: Produtos não estão PUBLICADOS

No Strapi 5, produtos salvos como **"Draft"** (Rascunho) **NÃO aparecem** na API pública.

### Como Publicar Produtos:

1. Acesse: `http://localhost:1337/admin`
2. Vá em **Content Manager** → **Produto**
3. Para cada produto:
   - Clique no produto
   - Clique no botão **"Publish"** (Publicar) no topo da página
   - Ou use o botão de ação rápida na lista

## ✅ Verificações Necessárias

### 1. Strapi está rodando?
```bash
cd al-sport-backend
npm run develop
```
Deve estar em: `http://localhost:1337`

### 2. Frontend está rodando?
```bash
cd al-sport-frontend
npm run dev
```
Deve estar em: `http://localhost:3000`

### 3. Variáveis de ambiente configuradas?
Arquivo: `al-sport-frontend/.env.local`
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=seu_token_aqui
```

**⚠️ IMPORTANTE:** Reinicie o servidor Next.js após alterar `.env.local`

### 4. Permissões da API configuradas no Strapi?

1. Acesse: `http://localhost:1337/admin`
2. Vá em **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
3. Em **Permissions**, encontre **Produto** e marque:
   - ✅ **find** (listar produtos)
   - ✅ **findOne** (ver produto individual)

### 5. CORS configurado?

Já atualizei o arquivo `al-sport-backend/config/middlewares.ts` para permitir requisições do frontend.

**Reinicie o Strapi** após essa alteração.

### 6. Testar a API diretamente

Abra no navegador:
```
http://localhost:1337/api/produtos?populate=*
```

Se aparecer um JSON com os produtos, a API está funcionando.
Se aparecer erro 403, configure as permissões (item 4).
Se aparecer erro 404, verifique se o Content Type está correto.

## 🔍 Debug

### Ver logs do Next.js
No terminal onde o Next.js está rodando, procure por:
- Erros de conexão
- Mensagens sobre produtos não encontrados

### Ver logs do Strapi
No terminal onde o Strapi está rodando, procure por:
- Requisições recebidas
- Erros de permissão

### Testar no navegador
1. Abra: `http://localhost:3000/produtos`
2. Abra o DevTools (F12)
3. Vá na aba **Network**
4. Recarregue a página
5. Procure por requisições para `/api/produtos`
6. Clique na requisição e veja a resposta

## ⚠️ Diferença entre Schema e Código

O schema do Strapi mostra:
- Campo: **"Variacao"** (singular, componente)

O código atual espera:
- Campo: **"variacoes"** (plural, relação)

**Isso pode causar problemas.** Se os produtos não aparecerem, pode ser necessário ajustar o código para usar "Variacao" ao invés de "variacoes".




