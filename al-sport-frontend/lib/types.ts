/**
 * Tipos TypeScript para o projeto AL Sports
 * Interfaces para Strapi CMS e modelos de dados
 */

// ========================================================================
// INTERFACES GENÉRICAS DO STRAPI
// ========================================================================

/**
 * Estrutura de resposta padrão do Strapi
 */
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Item de dados do Strapi com estrutura completa
 */
export interface StrapiDataItem<T> {
  id: number;
  documentId: string;
  attributes: T;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

/**
 * Media/Imagem do Strapi
 */
export interface StrapiMedia {
  id: number;
  documentId: string;
  attributes: {
    name: string;
    alternativeText?: string | null;
    caption?: string | null;
    width: number;
    height: number;
    formats?: {
      thumbnail?: StrapiMediaFormat;
      small?: StrapiMediaFormat;
      medium?: StrapiMediaFormat;
      large?: StrapiMediaFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: string | null;
    provider: string;
    provider_metadata?: any;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Formato de imagem do Strapi
 */
export interface StrapiMediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path?: string | null;
  url: string;
}

// ========================================================================
// MODELOS DE DADOS
// ========================================================================

/**
 * Variação de produto (tamanho, estoque, código)
 */
export interface Variacao {
  id?: number;
  documentId?: string;
  Tamanho: string;
  Estoque: number;
  Codigo: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

/**
 * Atributos de Variação no formato Strapi
 */
export interface VariacaoAttributes {
  Tamanho: string;
  Estoque: number;
  Codigo: string;
}

export type StrapiVariacao = StrapiDataItem<VariacaoAttributes>;

/**
 * Categoria de produto
 */
export interface Categoria {
  id?: number;
  documentId?: string;
  Nome: string;
  ImagemDaCategoria?: StrapiMedia | null;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

/**
 * Atributos de Categoria no formato Strapi
 */
export interface CategoriaAttributes {
  Nome: string;
  slug?: string;
  ImagemDaCategoria?: {
    data: StrapiMedia | null;
  };
}

export type StrapiCategoria = StrapiDataItem<CategoriaAttributes>;

/**
 * Subcategoria completa
 */
export interface Subcategoria {
  id?: number;
  documentId?: string;
  Nome: string;
  categoria?: Categoria | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

/**
 * Atributos de Subcategoria no formato Strapi
 */
export interface SubcategoriaAttributes {
  Nome: string;
  categoria?: {
    data: StrapiCategoria | null;
  } | StrapiCategoria | null;
}

export type StrapiSubcategoria = StrapiDataItem<SubcategoriaAttributes>;

/**
 * Produto completo
 */
export interface Produto {
  id?: number;
  documentId?: string;
  Nome: string;
  Descricao: string;
  Preco: number;
  Imagem1?: StrapiMedia | null;
  Imagem2?: StrapiMedia | null;
  variacoes?: Variacao[];
  categoria?: Categoria | null;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

/**
 * Atributos de Produto no formato Strapi
 */
export interface ProdutoAttributes {
  Nome: string;
  Descricao: string;
  Preco: number;
  slug?: string;
  Imagem1?: {
    data: StrapiMedia | null;
  };
  Imagem2?: {
    data: StrapiMedia | null;
  };
  // O schema do Strapi usa "Variacao" (singular) como componente repeatable
  Variacao?: StrapiVariacao[] | VariacaoAttributes[];
  variacoes?: {
    data: StrapiVariacao[];
  };
  categoria?: {
    data: StrapiCategoria | null;
  };
}

export type StrapiProduto = StrapiDataItem<ProdutoAttributes>;

/**
 * Banner do site
 */
export interface Banner {
  id?: number;
  documentId?: string;
  ImagemDesktop?: StrapiMedia | null;
  ImagemMobile?: StrapiMedia | null;
  Link?: string | null;
  Local?: string | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

/**
 * Atributos de Banner no formato Strapi
 */
export interface BannerAttributes {
  ImagemDesktop?: {
    data: StrapiMedia | null;
  };
  ImagemMobile?: {
    data: StrapiMedia | null;
  };
  Link?: string | null;
  Local?: string | null;
}

export type StrapiBanner = StrapiDataItem<BannerAttributes>;

/**
 * Conteúdos do site (informações de contato)
 */
export interface ConteudosDoSite {
  id?: number;
  documentId?: string;
  TelefoneWhatsapp?: string | null;
  EmailContato?: string | null;
  EnderecoFisico?: string | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

/**
 * Atributos de ConteudosDoSite no formato Strapi
 */
export interface ConteudosDoSiteAttributes {
  TelefoneWhatsapp?: string | null;
  EmailContato?: string | null;
  EnderecoFisico?: string | null;
}

export type StrapiConteudosDoSite = StrapiDataItem<ConteudosDoSiteAttributes>;

/**
 * Status do pedido
 */
export type PedidoStatus =
  | 'aguardando_pagamento'
  | 'pagamento_confirmado'
  | 'preparando_pedido'
  | 'enviado'
  | 'em_transito'
  | 'entregue'
  | 'cancelado'
  | 'devolvido';

/**
 * Item do pedido
 */
export interface PedidoItem {
  id?: number;
  produto_id: string;
  produto_nome: string;
  variacao_tamanho: string;
  variacao_codigo: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
}

/**
 * Endereço de entrega/cobrança
 */
export interface Endereco {
  cep: string;
  rua: string;
  numero: string;
  complemento?: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  referencia?: string | null;
}

/**
 * Dados do cliente no pedido
 */
export interface ClientePedido {
  nome: string;
  email: string;
  telefone: string;
  cpf?: string | null;
  data_nascimento?: string | null;
}

/**
 * Pedido completo
 */
export interface Pedido {
  id?: number;
  documentId?: string;
  // Dados do cliente
  cliente: ClientePedido;
  // Dados do pedido
  numero_pedido?: string;
  status: PedidoStatus;
  // Itens do pedido
  itens: PedidoItem[];
  // Valores
  subtotal: number;
  desconto: number;
  frete: number;
  total: number;
  // Endereços
  endereco_entrega: Endereco;
  endereco_cobranca?: Endereco | null;
  // Informações adicionais
  metodo_pagamento?: string | null;
  codigo_rastreamento?: string | null;
  observacoes?: string | null;
  // Datas
  data_entrega_estimada?: string | null;
  data_entrega_real?: string | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

/**
 * Atributos de Pedido no formato Strapi
 */
export interface PedidoAttributes {
  // Dados do cliente (JSON ou campos separados)
  cliente_nome: string;
  cliente_email: string;
  cliente_telefone: string;
  cliente_cpf?: string | null;
  cliente_data_nascimento?: string | null;
  // Dados do pedido
  numero_pedido?: string;
  status: PedidoStatus;
  // Itens do pedido (JSON)
  itens: string | PedidoItem[]; // JSON string ou array
  // Valores
  subtotal: number;
  desconto: number;
  frete: number;
  total: number;
  // Endereços (JSON)
  endereco_entrega: string | Endereco; // JSON string ou objeto
  endereco_cobranca?: string | Endereco | null; // JSON string ou objeto
  // Informações adicionais
  metodo_pagamento?: string | null;
  codigo_rastreamento?: string | null;
  observacoes?: string | null;
  // Datas
  data_entrega_estimada?: string | null;
  data_entrega_real?: string | null;
}

export type StrapiPedido = StrapiDataItem<PedidoAttributes>;

// ========================================================================
// TIPOS AUXILIARES
// ========================================================================

/**
 * Tipo para respostas de lista do Strapi
 */
export type StrapiListResponse<T> = StrapiResponse<T[]>;

/**
 * Tipo para respostas de item único do Strapi
 */
export type StrapiSingleResponse<T> = StrapiResponse<T>;

/**
 * Tipo genérico para entidades Strapi
 */
export type StrapiEntity<T> = StrapiDataItem<T>;

