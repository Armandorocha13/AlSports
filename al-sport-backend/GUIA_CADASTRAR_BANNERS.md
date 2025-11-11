# 📋 Guia: Como Cadastrar Banners no Strapi

## 🎯 Visão Geral

O sistema de banners está configurado para buscar banners diretamente do Strapi e exibi-los no carrossel do site. Você não precisa alterar código, apenas cadastrar os banners no painel administrativo.

## 📝 Como Cadastrar um Banner

### 1. Acesse o Strapi Admin
- Abra `http://localhost:1337/admin`
- Faça login no painel administrativo

### 2. Navegue até Banners
- No menu lateral, clique em **"Content Manager"**
- Em **"COLLECTION TYPES"**, clique em **"Banner"**

### 3. Criar Novo Banner
- Clique no botão **"Create new entry"** (ou **"Criar nova entrada"**)
- Preencha os campos:

#### Campos Obrigatórios:

**ImagemDesktop** (Obrigatório)
- Clique em "Click to add an asset or drag and drop"
- Faça upload da imagem para desktop
- Recomendado: largura mínima de 1920px
- Formatos: JPG, PNG, WebP

**Local** (Obrigatório)
- Selecione uma das opções:
  - **"Topo-Home"** → Aparece no carrossel principal (topo da página)
  - **"Rodape"** → Aparece no carrossel inferior
  - **"Promocional"** → Aparece no carrossel inferior

#### Campos Opcionais:

**ImagemMobile** (Opcional)
- Clique em "Click to add an asset or drag and drop"
- Faça upload da imagem para mobile
- Se não preencher, será usada a ImagemDesktop
- Recomendado: largura mínima de 768px

**Link** (Opcional - ⚠️ ATENÇÃO)
- **IMPORTANTE:** Este campo está configurado como "media" no schema, mas deveria ser uma URL
- Por enquanto, deixe vazio ou use o campo para outra finalidade
- O link do botão será gerado automaticamente baseado no "Local"

### 4. Publicar o Banner
- Após preencher os campos, clique em **"Save"** (Salvar)
- Depois clique em **"Publish"** (Publicar)
- ⚠️ **IMPORTANTE:** O banner só aparecerá no site se estiver **PUBLICADO**

## 🎨 Dicas de Imagens

### Para ImagemDesktop:
- **Tamanho recomendado:** 1920x600px ou 1920x800px
- **Formato:** JPG (melhor compressão) ou PNG (transparência)
- **Peso:** Máximo 500KB para melhor performance
- **Conteúdo:** Deixe espaço para texto se necessário

### Para ImagemMobile:
- **Tamanho recomendado:** 768x400px ou 768x500px
- **Formato:** JPG ou PNG
- **Peso:** Máximo 300KB

## 📍 Onde Cada Banner Aparece

### Local: "Topo-Home"
- Aparece no **carrossel principal** no topo da página inicial
- É o primeiro elemento visual que o usuário vê
- Use para banners principais e campanhas importantes

### Local: "Rodape" ou "Promocional"
- Aparece no **carrossel inferior** da página inicial
- Aparece após a seção de produtos em destaque
- Use para ofertas especiais e banners promocionais

## ✅ Checklist de Verificação

Antes de verificar se o banner apareceu no site, confirme:

- [ ] Banner está **PUBLICADO** (não apenas salvo como rascunho)
- [ ] Campo **"Local"** está preenchido corretamente
- [ ] **ImagemDesktop** está cadastrada e visível
- [ ] Imagem não está corrompida ou muito pesada
- [ ] Strapi está rodando em `http://localhost:1337`
- [ ] Frontend está rodando em `http://localhost:3000`

## 🔄 Após Cadastrar

1. **Aguarde alguns segundos** (o cache é atualizado a cada 60 segundos)
2. **Recarregue a página** do site (F5)
3. **Verifique o console** do navegador (F12) para ver logs de debug
4. Se não aparecer, verifique os logs no console para identificar o problema

## 🐛 Problemas Comuns

### Banner não aparece
- Verifique se está **PUBLICADO**
- Confirme que o **"Local"** está correto
- Verifique se a **ImagemDesktop** está cadastrada
- Limpe o cache do Next.js: `rm -rf .next` e reinicie o servidor

### Imagem não carrega
- Verifique se a imagem foi enviada corretamente
- Confirme que o Strapi está acessível
- Verifique a URL da imagem no console do navegador

### Banner aparece no lugar errado
- Verifique o campo **"Local"** no Strapi
- "Topo-Home" → carrossel superior
- "Rodape" ou "Promocional" → carrossel inferior

## 📝 Exemplo de Uso

### Banner Principal (Topo-Home)
1. Crie um novo banner
2. Faça upload da ImagemDesktop (ex: banner-promocao-verao.jpg)
3. Selecione **"Topo-Home"** no campo Local
4. Clique em **"Publish"**
5. O banner aparecerá no topo da página inicial

### Banner Promocional (Rodapé)
1. Crie um novo banner
2. Faça upload da ImagemDesktop
3. Selecione **"Promocional"** no campo Local
4. Clique em **"Publish"**
5. O banner aparecerá no rodapé da página inicial

## 🔧 Melhorias Futuras (Opcional)

Se quiser adicionar mais funcionalidades, você pode:

1. **Alterar o campo "Link"** no schema para aceitar URL (string) em vez de media
2. **Adicionar campo "Título"** para personalizar o texto do banner
3. **Adicionar campo "Descrição"** para texto adicional
4. **Adicionar campo "Ordem"** para controlar a sequência dos banners



