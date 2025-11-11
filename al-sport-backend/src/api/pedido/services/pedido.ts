/**
 * pedido service
 */

import { factories } from '@strapi/strapi';

// Mantém o service padrão; a sincronização será feita via lifecycles
export default factories.createCoreService('api::pedido.pedido');
