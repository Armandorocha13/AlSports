import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: ['pt-BR'],
  },
  bootstrap(app: StrapiApp) {
    // Customização do campo ItensComprados para exibir produtos formatados
    // Isso será feito através de um custom field component
    console.log('Admin customizado carregado');
  },
};

