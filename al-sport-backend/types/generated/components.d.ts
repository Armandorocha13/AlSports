import type { Schema, Struct } from '@strapi/strapi';

export interface ItensItens extends Struct.ComponentSchema {
  collectionName: 'components_itens_itens';
  info: {
    displayName: 'Itens';
  };
  attributes: {
    NomeProduto: Schema.Attribute.String;
    PrecoUnitario: Schema.Attribute.Decimal;
    Quantidade: Schema.Attribute.Integer;
    Tamanho: Schema.Attribute.String;
  };
}

export interface VariacoesVariacoes extends Struct.ComponentSchema {
  collectionName: 'components_variacoes_variacoes';
  info: {
    description: 'Varia\u00E7\u00F5es do produto (tamanhos, c\u00F3digos e estoque)';
    displayName: 'variacoes';
  };
  attributes: {
    Estoque: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    Tamanho: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'itens.itens': ItensItens;
      'variacoes.variacoes': VariacoesVariacoes;
    }
  }
}
