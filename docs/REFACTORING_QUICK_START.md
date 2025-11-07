# 🚀 Guia Rápido de Refatoração

Este é um guia rápido para começar a refatoração. Para detalhes completos, consulte `REFACTORING_CHECKLIST.md`.

## 📋 Resumo Executivo

### Objetivo
Transformar o projeto Next.js de uma aplicação com dados estáticos e lógica de admin para uma arquitetura headless que consome 100% da API do Strapi.

### Principais Mudanças
1. ❌ Remover todos os dados hardcoded de produtos e categorias
2. ❌ Remover toda a funcionalidade de admin (painel, serviços, rotas)
3. ✅ Criar serviços para consumir API do Strapi
4. ✅ Atualizar todas as páginas e componentes para usar novos serviços

---

## 🎯 Ordem de Execução Recomendada

### 1️⃣ Preparação (30 min)
- [ ] Ler `REFACTORING_CHECKLIST.md` completo
- [ ] Ler `STRAPI_DATA_MAPPING.md` para entender estrutura de dados
- [ ] Criar branch: `git checkout -b refactor/headless-strapi`
- [ ] Fazer backup do código atual

### 2️⃣ Criar Serviços Strapi (2-3 horas)
- [ ] Criar `lib/config/strapi.ts` com configuração base
- [ ] Criar `lib/services/api-client.ts` (cliente HTTP genérico)
- [ ] Criar `lib/services/products-service.ts`
- [ ] Criar `lib/services/categories-service.ts`
- [ ] Criar `lib/utils/strapi-transformers.ts`
- [ ] Criar tipos em `lib/types/strapi.ts`

### 3️⃣ Atualizar Componentes (2-3 horas)
- [ ] Atualizar `app/page.tsx` para usar `productsService`
- [ ] Atualizar `app/produto/[id]/page.tsx`
- [ ] Atualizar páginas de categoria
- [ ] Atualizar `app/busca/page.tsx`
- [ ] Atualizar `components/Header.tsx`

### 4️⃣ Remover Dados Estáticos (30 min)
- [ ] Deletar `lib/data/` (todos os arquivos)
- [ ] Remover imports de `@/lib/data` em todos os arquivos
- [ ] Verificar que não há mais referências

### 5️⃣ Remover Admin (1 hora)
- [ ] Deletar `app/admin/` (diretório completo)
- [ ] Deletar `lib/admin-service.ts`
- [ ] Deletar `tests/admin/`
- [ ] Remover scripts de admin do `package.json`

### 6️⃣ Limpeza Final (1 hora)
- [ ] Executar `npm run lint:fix`
- [ ] Executar `npm run type-check`
- [ ] Executar `npm run build`
- [ ] Atualizar documentação

---

## 🔧 Configuração Inicial

### Variáveis de Ambiente
Adicionar ao `.env.local`:
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_api_token_here
```

### Estrutura de Pastas Criada
```
lib/
  ├── config/
  │   └── strapi.ts
  ├── services/
  │   ├── api-client.ts
  │   ├── products-service.ts
  │   └── categories-service.ts
  ├── utils/
  │   └── strapi-transformers.ts
  └── types/
      ├── strapi.ts
      └── api.ts
```

---

## ✅ Checklist Rápido de Validação

Após a refatoração, verificar:

- [ ] `npm run build` executa sem erros
- [ ] `npm run lint` não mostra erros
- [ ] `npm run type-check` passa
- [ ] Página inicial carrega produtos do Strapi
- [ ] Página de produto funciona
- [ ] Páginas de categoria funcionam
- [ ] Busca funciona
- [ ] Nenhum import de `@/lib/data` restante
- [ ] Nenhuma rota `/admin/*` acessível

---

## 🆘 Troubleshooting

### Erro: "Cannot find module '@/lib/data'"
- **Solução**: Remover todos os imports de `@/lib/data` e substituir por chamadas de API

### Erro: "Type error: Property 'X' does not exist"
- **Solução**: Verificar transformação de dados do Strapi em `strapi-transformers.ts`

### Erro: "Failed to fetch from Strapi"
- **Solução**: 
  - Verificar `NEXT_PUBLIC_STRAPI_URL` está correto
  - Verificar `STRAPI_API_TOKEN` está configurado
  - Verificar CORS no Strapi

### Página não carrega dados
- **Solução**: 
  - Verificar console do navegador para erros
  - Verificar Network tab para chamadas de API
  - Verificar se Strapi está rodando e acessível

---

## 📚 Documentação Relacionada

- `REFACTORING_CHECKLIST.md` - Checklist completo e detalhado
- `STRAPI_DATA_MAPPING.md` - Mapeamento de estruturas de dados
- `README.md` - Documentação geral do projeto

---

## 🎯 Próximos Passos Após Refatoração

1. Configurar Strapi com Content Types
2. Migrar dados existentes para Strapi
3. Configurar autenticação (se necessário)
4. Implementar cache (React Query/SWR)
5. Otimizar performance
6. Adicionar testes de integração

---

**Dica**: Trabalhe em pequenos incrementos, testando cada mudança antes de prosseguir!

