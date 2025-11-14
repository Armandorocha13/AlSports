# 🎨 Guia: Criar Content-Type de Banner no Strapi

Este guia mostra como criar o Content-Type de **Banner** no Strapi com todos os campos necessários.

## 📋 Passo a Passo

### 1. Acessar o Content-Type Builder

1. Acesse o painel admin do Strapi: `http://localhost:1337/admin`
2. No menu lateral esquerdo, clique em **Content-Type Builder**
3. Clique no botão **+ Create new collection type** (ou **+ Create new single type** se preferir)

### 2. Configurar o Content-Type

1. **Display name**: `Banner`
2. **API ID (singular)**: `banner`
3. **API ID (plural)**: `banners`
4. Clique em **Continue**

### 3. Adicionar Campos

Adicione os seguintes campos na ordem especificada:

#### Campo 1: ImagemDesktop

- **Tipo**: `Media` (Single media)
- **Nome**: `ImagemDesktop`
- **Campo obrigatório**: Não (opcional)
- **Configurações**:
  - Tipo de mídia: `Images`
  - Clique em **Finish**

#### Campo 2: ImagemMobile

- **Tipo**: `Media` (Single media)
- **Nome**: `ImagemMobile`
- **Campo obrigatório**: Não (opcional)
- **Configurações**:
  - Tipo de mídia: `Images`
  - Clique em **Finish**

#### Campo 3: Link

- **Tipo**: `Text` (Short text)
- **Nome**: `Link`
- **Campo obrigatório**: Não (opcional)
- **Configurações**:
  - Default value: Deixe vazio
  - Clique em **Finish**

#### Campo 4: Local

- **Tipo**: `Enumeration`
- **Nome**: `Local`
- **Campo obrigatório**: Sim (recomendado)
- **Configurações**:
  - **Values** (valores permitidos):
    ```
    Topo-Home
    Rodape
    Promocional
    ```
  - **Default value**: `Topo-Home` (opcional)
  - Clique em **Finish**

### 4. Salvar o Content-Type

1. Clique no botão **Save** no canto superior direito
2. Aguarde o Strapi reiniciar (pode levar alguns segundos)

## ✅ Estrutura Final do Content-Type

O Content-Type de Banner deve ter a seguinte estrutura:

```
Banner
├── ImagemDesktop (Media - Single)
├── ImagemMobile (Media - Single)
├── Link (Text - Short)
└── Local (Enumeration)
    ├── Topo-Home
    ├── Rodape
    └── Promocional
```

## 🔐 Configurar Permissões

Após criar o Content-Type, configure as permissões:

1. Vá em **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
2. Na seção **Banner**, habilite:
   - ✅ **find** (buscar todos)
   - ✅ **findOne** (buscar um específico)
3. Clique em **Save**

## 📝 Criar Banners

1. Vá em **Content Manager** → **Banner**
2. Clique em **+ Create new entry**
3. Preencha os campos:
   - **ImagemDesktop**: Faça upload de uma imagem (recomendado: 1920x600px ou similar)
   - **ImagemMobile**: Faça upload de uma imagem (recomendado: 768x400px ou similar)
   - **Link**: URL para onde o banner deve redirecionar (ex: `/produtos`, `/categoria/futebol`)
   - **Local**: Selecione uma das opções:
     - `Topo-Home`: Banner que aparece no topo da página inicial
     - `Rodape`: Banner que aparece no rodapé da página inicial
     - `Promocional`: Banner promocional
4. Clique em **Save**
5. **IMPORTANTE**: Clique em **Publish** para publicar o banner (sem isso, o banner não aparecerá no site)

## 🎯 Valores do Campo Local

- **Topo-Home**: Banners que aparecem no carrossel principal do topo da página inicial
- **Rodape**: Banners que aparecem no rodapé da página inicial
- **Promocional**: Banners promocionais (podem aparecer em diferentes locais)

## ⚠️ Observações Importantes

1. **Publicação**: Banners só aparecem no site se estiverem **PUBLICADOS** (badge verde "Published")
2. **Imagens**: Pelo menos uma imagem (Desktop ou Mobile) deve ser cadastrada, caso contrário o banner será filtrado
3. **Local**: O campo Local é usado para filtrar onde o banner aparece no site
4. **Link**: Se não preenchido, o banner redireciona para `/` (página inicial)

## 🧪 Testar

Após criar e publicar um banner:

1. Acesse: `http://localhost:3000/api/test-strapi`
2. Verifique se o banner aparece na seção `banners`
3. Acesse a página inicial do site e verifique se o banner aparece

## 🔧 Troubleshooting

### Banner não aparece no site

1. ✅ Verifique se o banner está **PUBLICADO** (não apenas salvo como draft)
2. ✅ Verifique se pelo menos uma imagem foi cadastrada
3. ✅ Verifique se o campo `Local` está preenchido corretamente
4. ✅ Verifique as permissões do role "Public" (find e findOne devem estar habilitados)
5. ✅ Verifique os logs do servidor Next.js para ver se há erros

### Erro 404 ao buscar banners

1. Verifique se o Content-Type foi salvo corretamente
2. Verifique se o nome da API é `banner` (singular) e `banners` (plural)
3. Reinicie o servidor Strapi se necessário

### Imagem não aparece

1. Verifique se a imagem foi enviada corretamente
2. Verifique se o arquivo de imagem não está corrompido
3. Verifique as permissões de acesso aos arquivos no Strapi

