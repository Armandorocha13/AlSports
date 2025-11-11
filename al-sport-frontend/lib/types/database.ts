export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          cpf: string | null
          birth_date: string | null
          user_types: 'cliente' | 'admin' | 'vendedor'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          cpf?: string | null
          birth_date?: string | null
          user_types?: 'cliente' | 'admin' | 'vendedor'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          cpf?: string | null
          birth_date?: string | null
          user_types?: 'cliente' | 'admin' | 'vendedor'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          name: string
          street: string
          number: string
          complement: string | null
          neighborhood: string
          city: string
          state: string
          zip_code: string
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          street: string
          number: string
          complement?: string | null
          neighborhood: string
          city: string
          state: string
          zip_code: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          street?: string
          number?: string
          complement?: string | null
          neighborhood?: string
          city?: string
          state?: string
          zip_code?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          banner_url: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          banner_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          banner_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      subcategories: {
        Row: {
          id: string
          category_id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          short_description: string | null
          category_id: string | null
          subcategory_id: string | null
          price: number
          wholesale_price: number
          cost_price: number | null
          sku: string | null
          barcode: string | null
          weight: number | null
          dimensions: Json | null
          sizes: string[]
          colors: string[]
          materials: string[]
          is_active: boolean
          is_featured: boolean
          is_on_sale: boolean
          stock_quantity: number
          min_stock: number
          max_stock: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          short_description?: string | null
          category_id?: string | null
          subcategory_id?: string | null
          price: number
          wholesale_price: number
          cost_price?: number | null
          sku?: string | null
          barcode?: string | null
          weight?: number | null
          dimensions?: Json | null
          sizes?: string[]
          colors?: string[]
          materials?: string[]
          is_active?: boolean
          is_featured?: boolean
          is_on_sale?: boolean
          stock_quantity?: number
          min_stock?: number
          max_stock?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          short_description?: string | null
          category_id?: string | null
          subcategory_id?: string | null
          price?: number
          wholesale_price?: number
          cost_price?: number | null
          sku?: string | null
          barcode?: string | null
          weight?: number | null
          dimensions?: Json | null
          sizes?: string[]
          colors?: string[]
          materials?: string[]
          is_active?: boolean
          is_featured?: boolean
          is_on_sale?: boolean
          stock_quantity?: number
          min_stock?: number
          max_stock?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          alt_text: string | null
          sort_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          image_url: string
          alt_text?: string | null
          sort_order?: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          image_url?: string
          alt_text?: string | null
          sort_order?: number
          is_primary?: boolean
          created_at?: string
        }
      }
      price_ranges: {
        Row: {
          id: string
          product_id: string
          min_quantity: number
          max_quantity: number | null
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          min_quantity: number
          max_quantity?: number | null
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          min_quantity?: number
          max_quantity?: number | null
          price?: number
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          status: 'aguardando_pagamento' | 'pagamento_confirmado' | 'preparando_pedido' | 'enviado' | 'em_transito' | 'entregue' | 'cancelado' | 'devolvido'
          subtotal: number
          shipping_cost: number
          discount_amount: number
          total_amount: number
          shipping_address: Json
          billing_address: Json | null
          notes: string | null
          tracking_code: string | null
          estimated_delivery: string | null
          delivered_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: string
          user_id?: string | null
          status?: 'aguardando_pagamento' | 'pagamento_confirmado' | 'preparando_pedido' | 'enviado' | 'em_transito' | 'entregue' | 'cancelado' | 'devolvido'
          subtotal: number
          shipping_cost?: number
          discount_amount?: number
          total_amount: number
          shipping_address: Json
          billing_address?: Json | null
          notes?: string | null
          tracking_code?: string | null
          estimated_delivery?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string | null
          status?: 'aguardando_pagamento' | 'pagamento_confirmado' | 'preparando_pedido' | 'enviado' | 'em_transito' | 'entregue' | 'cancelado' | 'devolvido'
          subtotal?: number
          shipping_cost?: number
          discount_amount?: number
          total_amount?: number
          shipping_address?: Json
          billing_address?: Json | null
          notes?: string | null
          tracking_code?: string | null
          estimated_delivery?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_sku: string | null
          product_image_url: string | null
          size: string | null
          color: string | null
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          product_sku?: string | null
          product_image_url?: string | null
          size?: string | null
          color?: string | null
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_sku?: string | null
          product_image_url?: string | null
          size?: string | null
          color?: string | null
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      order_status_history: {
        Row: {
          id: string
          order_id: string
          status: 'aguardando_pagamento' | 'pagamento_confirmado' | 'preparando_pedido' | 'enviado' | 'em_transito' | 'entregue' | 'cancelado' | 'devolvido'
          notes: string | null
          updated_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          status: 'aguardando_pagamento' | 'pagamento_confirmado' | 'preparando_pedido' | 'enviado' | 'em_transito' | 'entregue' | 'cancelado' | 'devolvido'
          notes?: string | null
          updated_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          status?: 'aguardando_pagamento' | 'pagamento_confirmado' | 'preparando_pedido' | 'enviado' | 'em_transito' | 'entregue' | 'cancelado' | 'devolvido'
          notes?: string | null
          updated_by?: string | null
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          order_id: string
          method: 'pix' | 'cartao_credito' | 'cartao_debito' | 'boleto' | 'transferencia'
          status: 'pendente' | 'processando' | 'aprovado' | 'rejeitado' | 'cancelado'
          amount: number
          transaction_id: string | null
          gateway_response: Json | null
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          method: 'pix' | 'cartao_credito' | 'cartao_debito' | 'boleto' | 'transferencia'
          status?: 'pendente' | 'processando' | 'aprovado' | 'rejeitado' | 'cancelado'
          amount: number
          transaction_id?: string | null
          gateway_response?: Json | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          method?: 'pix' | 'cartao_credito' | 'cartao_debito' | 'boleto' | 'transferencia'
          status?: 'pendente' | 'processando' | 'aprovado' | 'rejeitado' | 'cancelado'
          amount?: number
          transaction_id?: string | null
          gateway_response?: Json | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      products_with_details: {
        Row: {
          id: string
          name: string
          description: string | null
          short_description: string | null
          category_id: string | null
          subcategory_id: string | null
          price: number
          wholesale_price: number
          cost_price: number | null
          sku: string | null
          barcode: string | null
          weight: number | null
          dimensions: Json | null
          sizes: string[]
          colors: string[]
          materials: string[]
          is_active: boolean
          is_featured: boolean
          is_on_sale: boolean
          stock_quantity: number
          min_stock: number
          max_stock: number | null
          created_at: string
          updated_at: string
          category_name: string | null
          category_slug: string | null
          subcategory_name: string | null
          subcategory_slug: string | null
          primary_image: string | null
        }
      }
      orders_with_customer: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          status: 'aguardando_pagamento' | 'pagamento_confirmado' | 'preparando_pedido' | 'enviado' | 'em_transito' | 'entregue' | 'cancelado' | 'devolvido'
          subtotal: number
          shipping_cost: number
          discount_amount: number
          total_amount: number
          shipping_address: Json
          billing_address: Json | null
          notes: string | null
          tracking_code: string | null
          estimated_delivery: string | null
          delivered_at: string | null
          created_at: string
          updated_at: string
          customer_name: string | null
          customer_email: string | null
          customer_phone: string | null
        }
      }
      order_tracking: {
        Row: {
          id: string
          order_number: string
          status: 'aguardando_pagamento' | 'pagamento_confirmado' | 'preparando_pedido' | 'enviado' | 'em_transito' | 'entregue' | 'cancelado' | 'devolvido'
          total_amount: number
          created_at: string
          estimated_delivery: string | null
          tracking_code: string | null
          customer_name: string | null
          customer_email: string | null
          customer_phone: string | null
          shipping_address: Json
          last_status_update: Json | null
          status_history: Json | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      order_status: 'aguardando_pagamento' | 'pagamento_confirmado' | 'preparando_pedido' | 'enviado' | 'em_transito' | 'entregue' | 'cancelado' | 'devolvido'
      user_types: 'cliente' | 'admin' | 'vendedor'
      payment_method: 'pix' | 'cartao_credito' | 'cartao_debito' | 'boleto' | 'transferencia'
      payment_status: 'pendente' | 'processando' | 'aprovado' | 'rejeitado' | 'cancelado'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Tipos auxiliares para facilitar o uso
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Tipos específicos
export type Profile = Tables<'profiles'>
export type Address = Tables<'addresses'>
export type Category = Tables<'categories'>
export type Subcategory = Tables<'subcategories'>
export type Product = Tables<'products'>
export type ProductImage = Tables<'product_images'>
export type PriceRange = Tables<'price_ranges'>
export type Order = Tables<'orders'>
export type OrderItem = Tables<'order_items'>
export type OrderStatusHistory = Tables<'order_status_history'>
export type Payment = Tables<'payments'>
export type Setting = Tables<'settings'>

// Views
export type ProductWithDetails = Database['public']['Views']['products_with_details']['Row']
export type OrderWithCustomer = Database['public']['Views']['orders_with_customer']['Row']
export type OrderTracking = Database['public']['Views']['order_tracking']['Row']

// Enums
export type OrderStatus = Enums<'order_status'>
export type UserType = Enums<'user_types'>
export type PaymentMethod = Enums<'payment_method'>
export type PaymentStatus = Enums<'payment_status'>

// Tipos para inserção
export type NewProfile = Database['public']['Tables']['profiles']['Insert']
export type NewAddress = Database['public']['Tables']['addresses']['Insert']
export type NewProduct = Database['public']['Tables']['products']['Insert']
export type NewOrder = Database['public']['Tables']['orders']['Insert']
export type NewOrderItem = Database['public']['Tables']['order_items']['Insert']
export type NewPayment = Database['public']['Tables']['payments']['Insert']

// Tipos para atualização
export type UpdateProfile = Database['public']['Tables']['profiles']['Update']
export type UpdateAddress = Database['public']['Tables']['addresses']['Update']
export type UpdateProduct = Database['public']['Tables']['products']['Update']
export type UpdateOrder = Database['public']['Tables']['orders']['Update']
export type UpdatePayment = Database['public']['Tables']['payments']['Update']
