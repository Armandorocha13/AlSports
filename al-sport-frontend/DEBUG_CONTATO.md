# 🔍 Debug: Informações de Contato Não Aparecem

## ✅ Correções Aplicadas

1. ✅ Endpoint corrigido para tentar `/api/conteudos-do-sites` (plural) primeiro
2. ✅ Filtro adicionado para retornar apenas conteúdos publicados
3. ✅ Logs de debug adicionados em todas as etapas
4. ✅ Verificação melhorada no Footer para exibir informações

## 🔍 Como Verificar

### 1. Verificar Console do Navegador
1. Abra o site em `http://localhost:3000`
2. Pressione **F12** para abrir DevTools
3. Vá para a aba **"Console"**
4. Recarregue a página (F5)
5. Procure por logs:
   - `getConteudosDoSite - Resposta do Strapi:`
   - `getConteudosDoSite - Conteúdo normalizado:`
   - `Footer - Conteúdos recebidos:`

### 2. Verificar no Strapi
1. Acesse `http://localhost:1337/admin`
2. Vá em **Content Manager** → **ConteudosDoSite**
3. Verifique se o registro está:
   - ✅ **PUBLICADO** (não apenas salvo como rascunho)
   - ✅ Campos preenchidos:
     - TelefoneWhatsapp
     - EmailContato
     - EnderecoFisico

### 3. Testar API Diretamente
Abra no navegador:
```
http://localhost:1337/api/conteudos-do-sites?populate=*
```

Ou:
```
http://localhost:1337/api/conteudos-do-site?populate=*
```

Deve retornar um JSON com os dados de contato.

## 🐛 Problemas Comuns

### Problema 1: "Informações de contato não disponíveis"
**Causa:** Conteúdo não está publicado ou não foi encontrado

**Solução:**
1. No Strapi, abra o registro de ConteudosDoSite
2. Certifique-se de que está na aba **"PUBLISHED"** (não "DRAFT")
3. Se estiver em DRAFT, clique em **"Publish"**

### Problema 2: Campos vazios
**Causa:** Campos não foram preenchidos no Strapi

**Solução:**
1. No Strapi, edite o registro
2. Preencha os campos:
   - TelefoneWhatsapp (ex: "21990708854")
   - EmailContato (ex: "teste@teste.com")
   - EnderecoFisico (ex: "Rua Exemplo, 123")
3. Clique em **"Save"** → **"Publish"**

### Problema 3: Endpoint incorreto
**Causa:** O endpoint pode estar diferente

**Solução:**
- O código agora tenta ambos os endpoints automaticamente
- Verifique os logs no console para ver qual está funcionando

## 📋 Checklist de Verificação

- [ ] Strapi está rodando em `localhost:1337`
- [ ] Frontend está rodando em `localhost:3000`
- [ ] Registro existe no Strapi (Content Manager → ConteudosDoSite)
- [ ] Registro está **PUBLICADO** (badge verde "Published")
- [ ] Campos TelefoneWhatsapp, EmailContato e/ou EnderecoFisico estão preenchidos
- [ ] Página foi recarregada após publicar
- [ ] Console do navegador não mostra erros

## 🔄 Após Corrigir no Strapi

1. **Aguarde alguns segundos** (cache atualiza a cada 60 segundos)
2. **Recarregue a página** do site (F5)
3. **Verifique o console** para ver os logs de debug
4. As informações devem aparecer no rodapé!

## 📝 Exemplo de Dados Esperados

No console, você deve ver algo como:

```
getConteudosDoSite - Conteúdo normalizado: {
  id: 1,
  documentId: "21990708854",
  publishedAt: "2025-11-08T...",
  hasAttributes: true,
  telefone: "21990708854",
  email: "teste@teste.com",
  endereco: "testre, teste - testes, 2"
}
```

Se você ver isso, mas as informações ainda não aparecem, o problema está na renderização do Footer.



