# 📁 Extensions - Personalizações do Admin

Esta pasta contém extensões customizadas para o painel de administração do Strapi.

## 📋 Estrutura Recomendada

```
src/admin/extensions/
├── logo/              # Personalização de logo
├── favicon/           # Personalização de favicon
├── theme/             # Personalização de tema
├── translations/      # Traduções customizadas
└── plugins/           # Plugins customizados
```

## 🎨 Exemplos de Personalização

### Logo Personalizado

Crie `src/admin/extensions/logo/index.tsx`:

```typescript
import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  register(app: StrapiApp) {
    // Registrar logo customizado
  },
  bootstrap(app: StrapiApp) {
    // Aplicar logo
  },
};
```

### Tema Personalizado

Crie `src/admin/extensions/theme/index.tsx`:

```typescript
import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  register(app: StrapiApp) {
    // Registrar tema customizado
  },
  bootstrap(app: StrapiApp) {
    // Aplicar tema
  },
};
```

## 📚 Documentação

Para mais informações, consulte:
- [Strapi Admin Panel Customization](https://docs.strapi.io/dev-docs/admin-panel-customization)
- [Strapi Admin Panel API](https://docs.strapi.io/dev-docs/admin-panel-api)



