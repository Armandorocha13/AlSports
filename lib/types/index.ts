// ========================================================================
// TIPOS CENTRALIZADOS DO PROJETO
// ========================================================================

export interface Product {
  id: string;
  name: string;
  price: number;
  wholesalePrice: number;
  image: string;
  description: string;
  sizes: string[];
  category: string;
  subcategory: string;
  featured: boolean;
  onSale?: boolean;
  priceRanges: Array<{
    min: number;
    price: number;
  }>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  subcategories: Array<{
    id: string;
    name: string;
    slug: string;
    image: string;
  }>;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor?: string;
  addedAt: Date;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  status: 'aguardando_pagamento' | 'pagamento_confirmado' | 'preparando_pedido' | 'enviado' | 'em_transito' | 'entregue' | 'cancelado' | 'devolvido';
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total_amount: number;
  shipping_address: any;
  billing_address: any;
  notes: string | null;
  tracking_code: string | null;
  estimated_delivery: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  items_count?: number;
  method?: string;
  source?: string;
}
