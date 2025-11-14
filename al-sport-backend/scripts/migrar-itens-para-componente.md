# 🔄 Script de Migração: JSON → Componente Repetível

## Passo a Passo para Migrar ItensComprados

### 1. Criar o Componente no Strapi

1. Acesse o admin: `http://localhost:1337/admin`
2. Vá em **Content-Type Builder** → **Components**
3. Clique em **Create new component**
4. Configure:
   - **Category**: `Pedido` (ou criar nova categoria)
   - **Display name**: `Item do Pedido`
   - **Name**: `item-pedido`

5. Adicione os campos:
   ```
   NomeProduto (Text, required)
   Tamanho (Text, optional)
   Quantidade (Number, required, default: 1)
   PrecoUnitario (Decimal, required)
   Imagem (Media, optional)
   ```

6. Salve o componente

### 2. Atualizar o Schema do Pedido

1. No **Content-Type Builder**, abra **Pedido**
2. Remova o campo `ItensComprados` (JSON)
3. Adicione novo campo:
   - **Name**: `ItensComprados`
   - **Type**: Component → `item-pedido`
   - **Repeatable**: ✅ Sim
4. Salve o Content-Type

### 3. Migrar Dados Existentes

Execute este script no console do Strapi ou crie uma rota temporária:

```typescript
// scripts/migrar-itens-pedido.ts
import strapi from '../src/index';

async function migrarItensPedido() {
  const pedidos = await strapi.entityService.findMany('api::pedido.pedido', {
    populate: '*',
  });

  for (const pedido of pedidos) {
    if (pedido.ItensComprados && typeof pedido.ItensComprados === 'string') {
      try {
        const itens = JSON.parse(pedido.ItensComprados);
        
        const itensFormatados = itens.map((item: any) => ({
          NomeProduto: item.name || item.nome || 'Produto sem nome',
          Tamanho: item.size || item.tamanho || '',
          Quantidade: item.quantity || item.quantidade || 1,
          PrecoUnitario: item.price || item.preco || 0,
          Imagem: item.image || item.imagem || null,
        }));

        await strapi.entityService.update('api::pedido.pedido', pedido.id, {
          data: {
            ItensComprados: itensFormatados,
          },
        });

        console.log(`✅ Pedido ${pedido.NumeroPedido} migrado`);
      } catch (error) {
        console.error(`❌ Erro ao migrar pedido ${pedido.NumeroPedido}:`, error);
      }
    }
  }
}

migrarItensPedido();
```

### 4. Atualizar o Controller

Atualize `src/api/pedido/controllers/pedido.ts`:

```typescript
// Linha 60, substituir:
ItensComprados: orderData.items || [],

// Por:
ItensComprados: (orderData.items || []).map((item: any) => ({
  NomeProduto: item.name || item.nome || 'Produto sem nome',
  Tamanho: item.size || item.tamanho || '',
  Quantidade: item.quantity || item.quantidade || 1,
  PrecoUnitario: item.price || item.preco || 0,
  Imagem: item.image || item.imagem || null,
})),
```

## Resultado

Após a migração, os itens comprados aparecerão como uma lista formatada no admin, com cada item editável individualmente.

