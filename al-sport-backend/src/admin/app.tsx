import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    // Configuração de idiomas disponíveis
    locales: [
      'pt-BR', // Português do Brasil (padrão)
      // Descomente para adicionar mais idiomas:
      // 'en',
      // 'es',
      // 'fr',
    ],
    
    // Configuração do logo personalizado
    // O Strapi procura o logo na pasta src/admin/extensions/ ou public/admin-assets/
    head: {
      favicon: '/admin-assets/favicon.ico', // Favicon personalizado
    },
    auth: {
      logo: '/admin-assets/Monograma2.png', // Logo na tela de login
    },
    menu: {
      logo: '/admin-assets/Monograma2.png', // Logo no menu lateral
    },
    
    // 🎨 PERSONALIZAÇÃO DE TEMA E CORES - PALETA BLACK ALL (TUDO PRETO)
    theme: {
      // 🖤⚪💛 Tema claro - TAMBÉM PRETO (Black All)
      light: {
        colors: {
          // 💛 Cor primária - AMARELO VIBRANTE
          primary100: '#422006', // Amarelo muito escuro
          primary200: '#713f12', // Amarelo escuro
          primary500: '#fbbf24', // AMARELO PRINCIPAL ⭐
          primary600: '#fcd34d', // Amarelo claro
          primary700: '#fde68a', // Amarelo muito claro
          
          // Cor secundária - Amarelo âmbar
          secondary100: '#451a03',
          secondary200: '#78350f',
          secondary500: '#f59e0b', // Amarelo âmbar
          secondary600: '#fbbf24',
          secondary700: '#fcd34d',
          
          // Cor de sucesso - Amarelo esverdeado
          success100: '#365314',
          success200: '#3f6212',
          success500: '#a3e635', // Amarelo-verde brilhante
          success600: '#bef264',
          success700: '#d9f99d',
          
          // Cor de perigo/erro - Laranja/Vermelho
          danger100: '#7c2d12',
          danger200: '#9a3412',
          danger500: '#f97316', // Laranja
          danger600: '#fb923c',
          danger700: '#fdba74',
          
          // Cor de aviso - Amarelo
          warning100: '#422006',
          warning200: '#713f12',
          warning500: '#fbbf24', // Amarelo
          warning600: '#fcd34d',
          warning700: '#fde68a',
          
          // 🖤⚪ Cores neutras - PRETO com LETRAS BRANCAS (igual ao tema escuro)
          neutral0: '#000000',        // Preto puro (fundo principal)
          neutral100: '#0a0a0a',      // Preto muito escuro
          neutral150: '#141414',      // Preto escuro (cards, painéis)
          neutral200: '#1f1f1f',      // Preto médio (bordas)
          neutral300: '#2e2e2e',      // Cinza muito escuro
          neutral400: '#525252',      // Cinza escuro
          neutral500: '#a3a3a3',      // Cinza médio
          neutral600: '#d4d4d4',      // Cinza claro
          neutral700: '#e5e5e5',      // Quase branco
          neutral800: '#f5f5f5',      // Branco suave
          neutral900: '#ffffff',      // ⚪ BRANCO (texto principal)
        },
      },
      
      // 🖤💛 Tema escuro - PALETA PRETA/AMARELA/BRANCA (PRINCIPAL)
      dark: {
        colors: {
          // 💛 Cor primária - AMARELO VIBRANTE
          primary100: '#422006', // Amarelo muito escuro
          primary200: '#713f12', // Amarelo escuro
          primary500: '#fbbf24', // AMARELO PRINCIPAL ⭐
          primary600: '#fcd34d', // Amarelo claro
          primary700: '#fde68a', // Amarelo muito claro
          
          // Cor secundária - Amarelo âmbar
          secondary100: '#451a03',
          secondary200: '#78350f',
          secondary500: '#f59e0b', // Amarelo âmbar
          secondary600: '#fbbf24',
          secondary700: '#fcd34d',
          
          // Cor de sucesso - Amarelo esverdeado
          success100: '#365314',
          success200: '#3f6212',
          success500: '#a3e635', // Amarelo-verde brilhante
          success600: '#bef264',
          success700: '#d9f99d',
          
          // Cor de perigo/erro - Laranja/Vermelho
          danger100: '#7c2d12',
          danger200: '#9a3412',
          danger500: '#f97316', // Laranja
          danger600: '#fb923c',
          danger700: '#fdba74',
          
          // Cor de aviso - Amarelo
          warning100: '#422006',
          warning200: '#713f12',
          warning500: '#fbbf24', // Amarelo
          warning600: '#fcd34d',
          warning700: '#fde68a',
          
          // 🖤 Cores neutras - PRETO com LETRAS BRANCAS
          neutral0: '#000000',        // Preto puro (fundo principal)
          neutral100: '#0a0a0a',      // Preto muito escuro
          neutral150: '#141414',      // Preto escuro (cards, painéis)
          neutral200: '#1f1f1f',      // Preto médio (bordas)
          neutral300: '#2e2e2e',      // Cinza muito escuro
          neutral400: '#525252',      // Cinza escuro
          neutral500: '#a3a3a3',      // Cinza médio
          neutral600: '#d4d4d4',      // Cinza claro
          neutral700: '#e5e5e5',      // Quase branco
          neutral800: '#f5f5f5',      // Branco suave
          neutral900: '#ffffff',      // ⚪ BRANCO (texto principal)
        },
      },
    },
    
    // Customizações adicionais
    tutorials: false, // Desabilitar tutoriais
    notifications: {
      releases: false, // Desabilitar notificações de novas versões
    },
  },
  
  bootstrap(app: StrapiApp) {
    // Personalizações customizadas podem ser adicionadas aqui
    console.log('🚀 AL Sports - Painel Administrativo Personalizado');
    
    // A extensão de logo em src/admin/extensions/logo/index.tsx
    // será carregada automaticamente pelo Strapi
    
    // Exemplo: Adicionar menu customizado
    // app.addMenuLink({
    //   to: '/custom-page',
    //   icon: 'star',
    //   intlLabel: {
    //     id: 'custom.page',
    //     defaultMessage: 'Página Customizada',
    //   },
    // });
  },
};

