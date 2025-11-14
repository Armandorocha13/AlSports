/**
 * Rotas customizadas para pedido
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/pedidos/sync',
      handler: 'pedido.sync',
      config: {
        auth: false, // Permitir sem autenticação (frontend público)
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/pedidos/:id/tracking',
      handler: 'pedido.updateTracking',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};



