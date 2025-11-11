# 🎨 Guia: Personalizar Painel de Administração do Strapi

## ✅ Pré-requisitos Concluídos

1. ✅ **Arquivo `app.tsx` criado** (renomeado de `app.example.tsx`)
2. ✅ **Pasta `extensions` criada** em `/src/admin/extensions/`
3. ✅ **Configuração básica** implementada

## 📋 Estrutura de Arquivos

```
al-sport-backend/
├── src/
│   ├── admin/
│   │   ├── app.tsx              # ✅ Configuração principal do admin
│   │   ├── vite.config.ts       # ✅ Configuração do Vite
│   │   ├── tsconfig.json        # Configuração TypeScript
│   │   └── extensions/          # ✅ Pasta para extensões
│   │       └── README.md
│   └── extensions/              # Extensões do Strapi (plugins)
└── public/
    └── admin-assets/            # Assets do admin (logo, favicon)
        ├── logo.svg
        ├── favicon.ico
        └── README.md
```

## 🚀 Como Aplicar Personalizações

### Passo 1: Verificar Estrutura

Certifique-se de que:
- ✅ `src/admin/app.tsx` existe (não `app.example.tsx`)
- ✅ `src/admin/extensions/` existe
- ✅ `public/admin-assets/` existe

### Passo 2: Iniciar Servidor em Modo Desenvolvimento

Para ver alterações em tempo real:

```bash
cd al-sport-backend
npm run develop
# ou
yarn develop
```

O servidor do painel de administração estará rodando em:
- **URL padrão:** `http://localhost:1337/admin`
- **Host:** `localhost` (ou o configurado)
- **Porta:** `1337` (ou a configurada)

### Passo 3: Personalizar Logo

1. **Coloque seu logo:**
   ```
   public/admin-assets/logo.svg
   ```
   Ou PNG:
   ```
   public/admin-assets/logo.png
   ```

2. **Crie extensão de logo** (`src/admin/extensions/logo/index.tsx`):
   ```typescript
   import type { StrapiApp } from '@strapi/strapi/admin';

   export default {
     register(app: StrapiApp) {
       // Configurar logo
     },
     bootstrap(app: StrapiApp) {
       // Aplicar logo
     },
   };
   ```

### Passo 4: Personalizar Favicon

1. **Coloque o favicon:**
   ```
   public/admin-assets/favicon.ico
   ```

2. **O Strapi usa automaticamente** o favicon da pasta `public`

### Passo 5: Personalizar Tema

Edite `src/admin/app.tsx` para adicionar configurações de tema:

```typescript
export default {
  config: {
    locales: ['pt-BR'],
    // Adicione configurações de tema aqui
  },
  bootstrap(app: StrapiApp) {
    // Personalizações
  },
};
```

## 🎯 Personalizações Disponíveis

### 1. Logo e Favicon

- **Logo:** `public/admin-assets/logo.svg` ou `.png`
- **Favicon:** `public/admin-assets/favicon.ico`

### 2. Idioma e Traduções

- **Idioma padrão:** `pt-BR` (já configurado)
- **Traduções:** Criar em `src/admin/extensions/translations/`

### 3. Tema e Cores 🎨

O Strapi suporta personalização completa de cores para temas claro e escuro:

#### Cores Principais:
- **Primary (Primária):** Cor principal do sistema (botões, links, destaques)
- **Secondary (Secundária):** Cor secundária/complementar
- **Success (Sucesso):** Verde para ações bem-sucedidas
- **Danger (Perigo):** Vermelho para erros e exclusões
- **Warning (Aviso):** Amarelo para avisos
- **Neutral (Neutro):** Tons de cinza para backgrounds e textos

#### Variações de Cor:
- **100-200:** Tons mais claros (backgrounds, hovers)
- **500:** Cor principal
- **600-700:** Tons mais escuros (estados ativos, pressed)

#### Como personalizar:
Edite `src/admin/app.tsx` na seção `theme.light.colors` ou `theme.dark.colors`

**Cores já configuradas:**
- ✅ Azul principal (`primary500: '#0ea5e9'`)
- ✅ Laranja/Amarelo secundário (`secondary500: '#f59e0b'`)
- ✅ Verde sucesso (`success500: '#22c55e'`)
- ✅ Vermelho erro (`danger500: '#ef4444'`)
- ✅ Tema escuro completo

### 4. Extensões Customizadas

- **Plugins:** Criar em `src/admin/extensions/plugins/`
- **Componentes:** Criar em `src/admin/extensions/components/`

## 📝 Exemplo Completo de Personalização

### Exemplo 1: Logo Personalizado

1. **Coloque o logo:**
   ```
   public/admin-assets/logo.svg
   ```

2. **Crie extensão** (`src/admin/extensions/logo/index.tsx`):
   ```typescript
   import type { StrapiApp } from '@strapi/strapi/admin';

   export default {
     register(app: StrapiApp) {
       app.customFields.register({
         name: 'custom-logo',
         pluginId: 'logo',
         type: 'string',
       });
     },
     bootstrap(app: StrapiApp) {
       // Aplicar logo
     },
   };
   ```

### Exemplo 2: Tema Personalizado com Cores

Edite `src/admin/app.tsx` - **Já configurado com as cores AL Sports!**

```typescript
export default {
  config: {
    locales: ['pt-BR'],
    theme: {
      light: {
        colors: {
          // Cor primária - Azul
          primary500: '#0ea5e9',
          primary600: '#0284c7',
          
          // Cor secundária - Laranja
          secondary500: '#f59e0b',
          secondary600: '#d97706',
          
          // Cor de sucesso - Verde
          success500: '#22c55e',
          
          // Cor de erro - Vermelho
          danger500: '#ef4444',
        },
      },
    },
  },
  bootstrap(app: StrapiApp) {
    console.log('🚀 AL Sports Admin');
  },
};
```

### Exemplo 3: Personalizar Apenas a Cor Primária

Se quiser mudar apenas a cor primária (azul para vermelho, por exemplo):

```typescript
theme: {
  light: {
    colors: {
      primary100: '#fee2e2',
      primary200: '#fecaca',
      primary500: '#ef4444', // Vermelho
      primary600: '#dc2626',
      primary700: '#b91c1c',
    },
  },
}
```

### Exemplo 4: Paleta de Cores Customizada

Use seu próprio esquema de cores:

```typescript
theme: {
  light: {
    colors: {
      // Sua marca - Ex: Roxo
      primary500: '#8b5cf6',
      primary600: '#7c3aed',
      
      // Complementar - Ex: Rosa
      secondary500: '#ec4899',
      secondary600: '#db2777',
    },
  },
}
```

## 🔧 Configurações Avançadas

### Customizar Vite Config

O arquivo `src/admin/vite.config.ts` já está configurado para:
- Aliases (`@` para `/src`)
- Merge com configuração padrão do Strapi

### Customizar TypeScript

Edite `src/admin/tsconfig.json` para:
- Adicionar paths
- Configurar strict mode
- Adicionar tipos customizados

## ⚠️ Importante

1. **Sempre use `npm run develop`** para ver alterações em tempo real
2. **Não delete `app.example.tsx`** - mantenha como backup
3. **Teste em desenvolvimento** antes de fazer deploy
4. **Rebuild necessário** apenas para produção (`npm run build`)

## 📚 Recursos

- [Documentação Oficial - Admin Customization](https://docs.strapi.io/dev-docs/admin-panel-customization)
- [Strapi Admin Panel API](https://docs.strapi.io/dev-docs/admin-panel-api)
- [Strapi Plugin Development](https://docs.strapi.io/dev-docs/plugins-development)

## ✅ Checklist

- [x] Arquivo `app.tsx` criado (renomeado de `app.example.tsx`)
- [x] Pasta `extensions` criada em `/src/admin/extensions/`
- [x] Pasta `admin-assets` criada em `/public/admin-assets/`
- [x] Configuração básica implementada
- [x] **Cores personalizadas configuradas!** 🎨
  - [x] Tema claro com cores AL Sports
  - [x] Tema escuro com cores AL Sports
  - [x] Cor primária: Azul (`#0ea5e9`)
  - [x] Cor secundária: Laranja (`#f59e0b`)
  - [x] Todas as variações de cores (100-900)
- [x] Logo adicionado (`Monograma2.png`)
- [ ] Favicon adicionado (próximo passo)
- [ ] Traduções customizadas (opcional)

## 🚀 Como Aplicar as Cores

### Passo 1: Reinicie o Servidor

```bash
cd al-sport-backend
npm run develop
```

### Passo 2: Acesse o Painel Admin

Abra no navegador:
```
http://localhost:1337/admin
```

### Passo 3: Veja as Cores Aplicadas!

Você verá:
- ✅ **Botões azuis** (cor primária)
- ✅ **Links e destaques** em azul
- ✅ **Elementos secundários** em laranja
- ✅ **Botões de sucesso** em verde
- ✅ **Botões de exclusão** em vermelho
- ✅ **Modo escuro** disponível (troque no menu do usuário)

## 🎨 Dicas de Personalização de Cores

### Como Escolher Cores

1. **Use um gerador de paleta:**
   - [Coolors.co](https://coolors.co/)
   - [Adobe Color](https://color.adobe.com/)
   - [Tailwind Color Palette](https://tailwindcss.com/docs/customizing-colors)

2. **Teste contraste:**
   - Certifique-se de que textos são legíveis
   - Use tons claros para backgrounds
   - Use tons escuros para textos

3. **Mantenha consistência:**
   - Use a mesma paleta no frontend e admin
   - Mantenha a identidade visual da marca

### Cores Recomendadas para E-commerce

```typescript
// Opção 1: Azul confiável (padrão AL Sports)
primary500: '#0ea5e9' // Azul

// Opção 2: Verde crescimento
primary500: '#22c55e' // Verde

// Opção 3: Roxo premium
primary500: '#8b5cf6' // Roxo

// Opção 4: Vermelho ousado
primary500: '#ef4444' // Vermelho
```

## 🔄 Aplicar Mudanças

### Desenvolvimento
As cores são aplicadas **automaticamente** ao salvar o arquivo:
```bash
npm run develop
# Salve app.tsx e recarregue o navegador
```

### Produção
Para aplicar em produção, faça rebuild do admin:
```bash
npm run build
npm run start
```

## 🚀 Próximos Passos

1. ✅ **Cores personalizadas** - CONCLUÍDO!
2. ✅ **Logo adicionado** - CONCLUÍDO!
3. [ ] **Adicione seu favicon** em `public/admin-assets/favicon.ico`
4. [ ] **Teste o tema escuro** (botão no canto superior direito)
5. [ ] **Customize mais** (opcional):
   - Adicione traduções personalizadas
   - Crie plugins customizados
   - Adicione páginas customizadas
