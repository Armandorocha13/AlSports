# 🎨 Guia Completo: Personalizar Painel de Administração do Strapi

## ✅ Pré-requisitos Concluídos

Seguindo a [documentação oficial do Strapi](https://docs.strapi.io/dev-docs/admin-panel-customization):

1. ✅ **Arquivo `app.tsx` criado** em `src/admin/app.tsx`
2. ✅ **Pasta `extensions` criada** em `src/admin/extensions/`
3. ✅ **Configuração básica** implementada

## 📁 Estrutura de Arquivos

```
al-sport-backend/
├── src/
│   ├── admin/
│   │   ├── app.tsx              # ✅ Configuração principal (renomeado de app.example.tsx)
│   │   ├── vite.config.ts       # ✅ Configuração do Vite
│   │   ├── tsconfig.json        # Configuração TypeScript
│   │   └── extensions/          # ✅ Pasta para extensões customizadas
│   │       └── README.md
│   └── extensions/              # Extensões do Strapi (plugins)
└── public/
    └── admin-assets/            # Assets do admin (logo, favicon)
        ├── logo.svg
        ├── favicon.ico
        └── README.md
```

## 🚀 Como Aplicar Personalizações

### Passo 1: Iniciar Servidor em Modo Desenvolvimento

**IMPORTANTE:** Para ver alterações em tempo real, o servidor do painel de administração deve estar rodando:

```bash
cd al-sport-backend
npm run develop
# ou
yarn develop
```

O servidor estará disponível em:
- **URL:** `http://localhost:1337/admin`
- **Host:** `localhost` (ou o configurado)
- **Porta:** `1337` (ou a configurada)

### Passo 2: Personalizar Logo

#### Opção A: Usando Extensão (Recomendado)

1. **Crie o arquivo de extensão:**
   ```
   src/admin/extensions/logo/index.tsx
   ```

2. **Código da extensão:**
   ```typescript
   import type { StrapiApp } from '@strapi/strapi/admin';

   export default {
     register(app: StrapiApp) {
       // Registrar logo
     },
     bootstrap(app: StrapiApp) {
       // Aplicar logo customizado
       const logo = document.querySelector('[data-testid="logo"]');
       if (logo) {
         logo.innerHTML = '<img src="/admin-assets/logo.svg" alt="AL Sports" />';
       }
     },
   };
   ```

#### Opção B: Usando Config no app.tsx

Edite `src/admin/app.tsx`:

```typescript
export default {
  config: {
    locales: ['pt-BR'],
    menu: {
      logo: '/admin-assets/logo.svg',
    },
  },
  bootstrap(app: StrapiApp) {
    // Personalizações
  },
};
```

3. **Coloque seu logo:**
   ```
   public/admin-assets/logo.svg
   ```

### Passo 3: Personalizar Favicon

1. **Coloque o favicon:**
   ```
   public/admin-assets/favicon.ico
   ```

2. **O Strapi usa automaticamente** o favicon da pasta `public`

### Passo 4: Personalizar Tema

Edite `src/admin/app.tsx`:

```typescript
export default {
  config: {
    locales: ['pt-BR'],
    theme: {
      light: {
        primary: {
          main: '#FFD700', // Amarelo/dourado
        },
        secondary: {
          main: '#000000', // Preto
        },
      },
      dark: {
        primary: {
          main: '#FFD700',
        },
        secondary: {
          main: '#FFFFFF',
        },
      },
    },
  },
  bootstrap(app: StrapiApp) {
    // Personalizações
  },
};
```

### Passo 5: Personalizar Traduções

1. **Crie a estrutura:**
   ```
   src/admin/extensions/translations/
   └── pt-BR.json
   ```

2. **Conteúdo do arquivo `pt-BR.json`:**
   ```json
   {
     "app.name": "AL Sports - Painel Administrativo",
     "content-manager.components.LeftMenu.Search.placeholder": "Buscar conteúdo...",
     "app.components.HomePage.welcome": "Bem-vindo ao AL Sports!"
   }
   ```

3. **Importe no `app.tsx`:**
   ```typescript
   import translations from './extensions/translations/pt-BR.json';

   export default {
     config: {
       locales: ['pt-BR'],
       translations: {
         'pt-BR': translations,
       },
     },
   };
   ```

## 🎯 Personalizações Disponíveis

### 1. Logo
- **Localização:** `public/admin-assets/logo.svg`
- **Formato:** SVG (recomendado) ou PNG
- **Tamanho:** 200x50px

### 2. Favicon
- **Localização:** `public/admin-assets/favicon.ico`
- **Tamanho:** 32x32px ou 16x16px

### 3. Tema
- **Cores:** Configurar em `app.tsx`
- **Tema claro/escuro:** Suportado

### 4. Idioma
- **Padrão:** `pt-BR` (já configurado)
- **Traduções:** Criar em `extensions/translations/`

### 5. Menu Customizado
- **Links customizados:** Adicionar em `bootstrap()`

## 📝 Exemplos Práticos

### Exemplo 1: Logo Simples

1. Coloque `logo.svg` em `public/admin-assets/`
2. O Strapi usará automaticamente se configurado em `app.tsx`

### Exemplo 2: Tema Completo

```typescript
export default {
  config: {
    locales: ['pt-BR'],
    theme: {
      light: {
        primary: { main: '#FFD700' },
        secondary: { main: '#000000' },
        success: { main: '#4CAF50' },
        warning: { main: '#FF9800' },
        danger: { main: '#F44336' },
      },
    },
  },
};
```

### Exemplo 3: Menu Customizado

```typescript
bootstrap(app: StrapiApp) {
  app.addMenuLink({
    to: '/custom-page',
    icon: 'star',
    intlLabel: {
      id: 'custom.page',
      defaultMessage: 'Página Customizada',
    },
  });
}
```

## 🔧 Configurações Avançadas

### Customizar Vite

O arquivo `src/admin/vite.config.ts` já está configurado:

```typescript
import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  return mergeConfig(config, {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  });
};
```

### Customizar TypeScript

Edite `src/admin/tsconfig.json` conforme necessário.

## ⚠️ Importante

1. **Sempre use `npm run develop`** para ver alterações em tempo real
2. **Não delete `app.example.tsx`** - mantenha como backup
3. **Alterações em `app.tsx`** são aplicadas automaticamente em desenvolvimento
4. **Rebuild necessário** apenas para produção (`npm run build`)

## 📚 Documentação Oficial

- [Strapi Admin Panel Customization](https://docs.strapi.io/dev-docs/admin-panel-customization)
- [Strapi Admin Panel API](https://docs.strapi.io/dev-docs/admin-panel-api)
- [Strapi Plugin Development](https://docs.strapi.io/dev-docs/plugins-development)

## ✅ Checklist

- [x] Arquivo `app.tsx` criado
- [x] Pasta `extensions` criada em `/src/admin/extensions/`
- [x] Pasta `admin-assets` criada
- [x] Configuração básica implementada
- [ ] Logo adicionado (próximo passo)
- [ ] Favicon adicionado (próximo passo)
- [ ] Tema personalizado (opcional)
- [ ] Traduções customizadas (opcional)

## 🚀 Próximos Passos

1. **Adicione seu logo** em `public/admin-assets/logo.svg`
2. **Adicione seu favicon** em `public/admin-assets/favicon.ico`
3. **Inicie o servidor:** `npm run develop`
4. **Acesse:** `http://localhost:1337/admin`
5. **Veja as personalizações** aplicadas em tempo real!



