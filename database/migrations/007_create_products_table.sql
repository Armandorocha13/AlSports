-- =====================================================
-- MIGRATION: Criar tabela products com estrutura adaptada
-- =====================================================
-- Esta migration cria a tabela products com todas as colunas
-- necessárias baseadas na estrutura real do banco de dados
-- =====================================================

-- =====================================================
-- PARTE 1: Criar tabela se não existir
-- =====================================================

-- Criar tabela products com estrutura completa
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Informações básicas
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  
  -- Preços
  base_price NUMERIC(10,2) NOT NULL,
  wholesale_price NUMERIC(10,2),
  
  -- Categorização
  -- Nota: categorias e subcategorias usam IDs numéricos (int8), não UUIDs
  -- Armazenamos como TEXT para compatibilidade
  category_id TEXT, -- ID da tabela categorias (int8 como string)
  subcategory_id TEXT, -- ID da tabela subcategorias (int8 como string)
  
  -- Dimensões físicas
  weight NUMERIC(8,3), -- em kg
  height NUMERIC(8,2), -- em cm
  width NUMERIC(8,2), -- em cm
  length NUMERIC(8,2), -- em cm
  
  -- Informações adicionais
  sku TEXT UNIQUE,
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  materials TEXT[] DEFAULT '{}',
  
  -- Status e flags
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE NOT NULL,
  is_on_sale BOOLEAN DEFAULT FALSE NOT NULL,
  
  -- Estoque
  stock_quantity INTEGER DEFAULT 0 NOT NULL,
  min_stock INTEGER DEFAULT 0 NOT NULL,
  max_stock INTEGER,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT products_base_price_positive CHECK (base_price >= 0),
  CONSTRAINT products_wholesale_price_positive CHECK (wholesale_price IS NULL OR wholesale_price >= 0),
  CONSTRAINT products_weight_positive CHECK (weight IS NULL OR weight > 0),
  CONSTRAINT products_height_positive CHECK (height IS NULL OR height > 0),
  CONSTRAINT products_width_positive CHECK (width IS NULL OR width > 0),
  CONSTRAINT products_length_positive CHECK (length IS NULL OR length > 0),
  CONSTRAINT products_stock_quantity_non_negative CHECK (stock_quantity >= 0),
  CONSTRAINT products_min_stock_non_negative CHECK (min_stock >= 0),
  CONSTRAINT products_max_stock_valid CHECK (max_stock IS NULL OR max_stock >= min_stock),
  CONSTRAINT products_wholesale_vs_base CHECK (wholesale_price IS NULL OR wholesale_price <= base_price)
);

-- =====================================================
-- PARTE 2: Adicionar colunas faltantes se a tabela já existir
-- =====================================================

-- Verificar e adicionar colunas que podem não existir
DO $$ 
BEGIN
  -- Adicionar slug se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'slug'
  ) THEN
    ALTER TABLE public.products ADD COLUMN slug TEXT;
    ALTER TABLE public.products ADD CONSTRAINT products_slug_unique UNIQUE(slug);
  END IF;
  
  -- Adicionar base_price se não existir (e renomear price se existir)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'base_price'
  ) THEN
    -- Se price existe, renomear para base_price
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'products' 
      AND column_name = 'price'
    ) THEN
      ALTER TABLE public.products RENAME COLUMN price TO base_price;
    ELSE
      ALTER TABLE public.products ADD COLUMN base_price NUMERIC(10,2) NOT NULL DEFAULT 0;
    END IF;
  END IF;
  
  -- Adicionar category_id como TEXT se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'category_id'
  ) THEN
    ALTER TABLE public.products ADD COLUMN category_id TEXT;
  END IF;
  
  -- Adicionar subcategory_id se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'subcategory_id'
  ) THEN
    ALTER TABLE public.products ADD COLUMN subcategory_id TEXT;
  END IF;
  
  -- Adicionar colunas de dimensões se não existirem
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'weight'
  ) THEN
    ALTER TABLE public.products ADD COLUMN weight NUMERIC(8,3);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'height'
  ) THEN
    ALTER TABLE public.products ADD COLUMN height NUMERIC(8,2);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'width'
  ) THEN
    ALTER TABLE public.products ADD COLUMN width NUMERIC(8,2);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'length'
  ) THEN
    ALTER TABLE public.products ADD COLUMN length NUMERIC(8,2);
  END IF;
  
  -- Adicionar outras colunas opcionais
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'wholesale_price'
  ) THEN
    ALTER TABLE public.products ADD COLUMN wholesale_price NUMERIC(10,2);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'colors'
  ) THEN
    ALTER TABLE public.products ADD COLUMN colors TEXT[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'materials'
  ) THEN
    ALTER TABLE public.products ADD COLUMN materials TEXT[] DEFAULT '{}';
  END IF;
  
  -- Adicionar colunas de status/flags
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE public.products ADD COLUMN is_featured BOOLEAN DEFAULT FALSE NOT NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'is_on_sale'
  ) THEN
    ALTER TABLE public.products ADD COLUMN is_on_sale BOOLEAN DEFAULT FALSE NOT NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'is_active'
  ) THEN
    ALTER TABLE public.products ADD COLUMN is_active BOOLEAN DEFAULT TRUE NOT NULL;
  END IF;
  
  -- Adicionar colunas de estoque
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'stock_quantity'
  ) THEN
    ALTER TABLE public.products ADD COLUMN stock_quantity INTEGER DEFAULT 0 NOT NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'min_stock'
  ) THEN
    ALTER TABLE public.products ADD COLUMN min_stock INTEGER DEFAULT 0 NOT NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'max_stock'
  ) THEN
    ALTER TABLE public.products ADD COLUMN max_stock INTEGER;
  END IF;
  
  -- Adicionar SKU se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'sku'
  ) THEN
    ALTER TABLE public.products ADD COLUMN sku TEXT;
    -- Criar constraint única para SKU se não existir
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'products_sku_key'
    ) THEN
      ALTER TABLE public.products ADD CONSTRAINT products_sku_key UNIQUE(sku);
    END IF;
  END IF;
  
  -- Adicionar sizes se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'sizes'
  ) THEN
    ALTER TABLE public.products ADD COLUMN sizes TEXT[] DEFAULT '{}';
  END IF;
  
  -- Adicionar timestamps se não existirem
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'created_at'
  ) THEN
    ALTER TABLE public.products ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.products ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;
  END IF;
END $$;

-- =====================================================
-- PARTE 3: Criar índices para performance
-- =====================================================

-- Usando TEXT para category_id e subcategory_id já que referenciam tabelas com IDs numéricos
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id) WHERE category_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON public.products(subcategory_id) WHERE subcategory_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_created ON public.products(created_at);

-- Criar trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Política RLS: Qualquer um pode ver produtos ativos
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT
  USING (is_active = true);

-- Política RLS: Admins podem ver todos os produtos
DROP POLICY IF EXISTS "Admin can view all products" ON public.products;
CREATE POLICY "Admin can view all products" ON public.products
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.user_types = 'admin' OR LOWER(profiles.email) = 'almundodabola@gmail.com')
    )
  );

-- Política RLS: Admins podem inserir produtos
DROP POLICY IF EXISTS "Admin can insert products" ON public.products;
CREATE POLICY "Admin can insert products" ON public.products
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.user_types = 'admin' OR LOWER(profiles.email) = 'almundodabola@gmail.com')
    )
  );

-- Política RLS: Admins podem atualizar produtos
DROP POLICY IF EXISTS "Admin can update products" ON public.products;
CREATE POLICY "Admin can update products" ON public.products
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.user_types = 'admin' OR LOWER(profiles.email) = 'almundodabola@gmail.com')
    )
  );

-- Política RLS: Admins podem deletar produtos
DROP POLICY IF EXISTS "Admin can delete products" ON public.products;
CREATE POLICY "Admin can delete products" ON public.products
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.user_types = 'admin' OR LOWER(profiles.email) = 'almundodabola@gmail.com')
    )
  );

-- Comentários nas colunas para documentação
COMMENT ON TABLE public.products IS 'Tabela de produtos do e-commerce';
COMMENT ON COLUMN public.products.base_price IS 'Preço base do produto (preço de varejo)';
COMMENT ON COLUMN public.products.wholesale_price IS 'Preço para atacado (opcional)';
COMMENT ON COLUMN public.products.weight IS 'Peso do produto em kg';
COMMENT ON COLUMN public.products.height IS 'Altura do produto em cm';
COMMENT ON COLUMN public.products.width IS 'Largura do produto em cm';
COMMENT ON COLUMN public.products.length IS 'Comprimento do produto em cm';

-- Mensagem de confirmação
DO $$ 
BEGIN
  RAISE NOTICE '✅ Tabela products criada com sucesso!';
  RAISE NOTICE '📋 Estrutura adaptada com todas as colunas necessárias';
  RAISE NOTICE '🔒 RLS habilitado para segurança';
END $$;

