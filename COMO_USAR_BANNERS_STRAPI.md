# 🎯 Como Usar Banners do Strapi no Carrossel

## ✅ Status Atual

**O sistema já está 100% configurado!** Você não precisa alterar nenhum código. O carrossel já está buscando banners do Strapi automaticamente.

## 📋 O Que Você Precisa Fazer no Strapi

### 1. Cadastrar Banners no Strapi Admin

1. Acesse `http://localhost:1337/admin`
2. Vá em **Content Manager** → **Banner**
3. Clique em **"Create new entry"**

### 2. Preencher os Campos

#### ✅ Campos Obrigatórios:

**ImagemDesktop** ⭐ (OBRIGATÓRIO)
- Faça upload da imagem para desktop
- Tamanho recomendado: 1920x600px ou 1920x800px
- Formatos: JPG, PNG, WebP

**Local** ⭐ (OBRIGATÓRIO)
- Selecione uma opção:
  - **"Topo-Home"** → Aparece no carrossel principal (topo)
  - **"Rodape"** → Aparece no carrossel inferior
  - **"Promocional"** → Aparece no carrossel inferior

#### 📝 Campos Opcionais:

**ImagemMobile** (Opcional)
- Se não preencher, será usada a ImagemDesktop
- Tamanho recomendado: 768x400px

**Link** (Opcional - pode deixar vazio)
- Este campo está configurado como "media" no schema
- Por enquanto, deixe vazio ou ignore

### 3. Publicar o Banner

⚠️ **IMPORTANTE:** Após salvar, clique em **"Publish"** (Publicar)

O banner só aparecerá no site se estiver **PUBLICADO** (não apenas salvo como rascunho).

## 🎨 Como Funciona

### Banners com Local = "Topo-Home"
- Aparecem no **carrossel principal** no topo da página
- Rotação automática a cada 3.5 segundos
- Navegação com setas e dots

### Banners com Local = "Rodape" ou "Promocional"
- Aparecem no **carrossel inferior** da página
- Rotação automática a cada 8 segundos
- Navegação com setas e dots

## 🔄 Após Cadastrar

1. **Aguarde alguns segundos** (cache atualiza a cada 60 segundos)
2. **Recarregue a página** do site (F5)
3. O banner deve aparecer automaticamente!

## ✅ Checklist Rápido

- [ ] Banner criado no Strapi
- [ ] ImagemDesktop cadastrada
- [ ] Campo "Local" preenchido (Topo-Home, Rodape ou Promocional)
- [ ] Banner está **PUBLICADO** (não apenas salvo)
- [ ] Strapi rodando em `localhost:1337`
- [ ] Frontend rodando em `localhost:3000`
- [ ] Página recarregada

## 🐛 Se Não Aparecer

1. **Verifique o console do navegador** (F12 → Console)
   - Procure por logs que começam com `getBanners`, `BannerCarousel`, etc.
   - Isso mostrará onde está o problema

2. **Verifique no Strapi:**
   - Banner está marcado como "Published"?
   - Campo "Local" está correto?
   - ImagemDesktop está cadastrada?

3. **Teste a API diretamente:**
   - Abra: `http://localhost:1337/api/banners?populate=*`
   - Deve retornar um JSON com os banners

4. **Limpe o cache:**
   ```bash
   cd al-sport-frontend
   rm -rf .next
   npm run dev
   ```

## 📝 Exemplo Prático

### Para adicionar um banner no topo:

1. Strapi Admin → Content Manager → Banner → Create new entry
2. Upload da ImagemDesktop (ex: banner-promocao.jpg)
3. Selecione "Topo-Home" no campo Local
4. Clique em "Save" → "Publish"
5. Recarregue o site → Banner aparece no topo! 🎉

### Para adicionar um banner promocional:

1. Strapi Admin → Content Manager → Banner → Create new entry
2. Upload da ImagemDesktop
3. Selecione "Promocional" no campo Local
4. Clique em "Save" → "Publish"
5. Recarregue o site → Banner aparece no rodapé! 🎉

## 💡 Dicas

- **Múltiplos banners:** Você pode cadastrar vários banners com o mesmo "Local" e eles aparecerão em sequência no carrossel
- **Ordem:** A ordem dos banners no carrossel segue a ordem de criação/publicação no Strapi
- **Imagens:** Use imagens otimizadas (máximo 500KB) para melhor performance
- **Responsivo:** Se cadastrar ImagemMobile, ela será usada em dispositivos móveis automaticamente

## 🎯 Resumo

**Você NÃO precisa alterar código!** Apenas:
1. Cadastre os banners no Strapi
2. Preencha ImagemDesktop e Local
3. Publique o banner
4. Pronto! O carrossel já está funcionando! ✨



