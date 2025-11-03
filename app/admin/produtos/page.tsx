'use client'

import { createClient } from '@/lib/supabase-client'
import { 
  Edit, 
    Image as ImageIcon,
    List,
    Package2,
    Plus,
  Save,
    Search,
    Tag,
    Trash2,
    X
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

// Types
interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  banner_url: string | null
  is_active: boolean
  sort_order: number
  productCount?: number
  subcategoryCount?: number
}

interface Subcategory {
  id: string
  category_id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  is_active: boolean
  sort_order: number
  category?: Category
  productCount?: number
}

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  category_id: string | null
  subcategory_id: string | null
  base_price: number  // Campo real na tabela
  price?: number  // Mantido para compatibilidade (será base_price)
  wholesale_price: number | null
  cost_price: number | null
  sku: string | null
  barcode: string | null
  weight: number | null
  height: number | null
  width: number | null
  length: number | null
  dimensions: any
  sizes: string[]
  colors: string[]
  materials: string[]
  is_active: boolean
  is_featured: boolean
  is_on_sale: boolean
  stock_quantity: number
  min_stock: number
  max_stock: number | null
  category?: Category
  subcategory?: Subcategory
  images?: string[]
}

type ViewMode = 'products' | 'categories'

export default function ProdutosPage() {
  const supabase = createClient()
  
  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('products')
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  // Data state
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [products, setProducts] = useState<Product[]>([])
  
  // Selection state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null)

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    short_description: '',
    category_id: '',
    subcategory_id: '',
    price: '',
    wholesale_price: '',
    cost_price: '',
    sku: '',
    barcode: '',
    weight: '',
    stock_quantity: '',
    min_stock: '',
    max_stock: '',
    sizes: [] as string[],
    colors: [] as string[],
    materials: [] as string[],
    is_active: true,
    is_featured: false,
    is_on_sale: false,
    images: [] as string[]
  })

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    image_url: '',
    banner_url: '',
    is_active: true
  })

  const [subcategoryForm, setSubcategoryForm] = useState({
    name: '',
    slug: '',
    category_id: '',
    image_url: '',
    is_active: true,
    sort_order: 0
  })

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // Load data
  useEffect(() => {
    loadAllData()
  }, [])

  // Reload data when switching views
  useEffect(() => {
    if (viewMode === 'categories') {
      loadCategories()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode])
  
  // Carregar subcategorias quando uma categoria for selecionada
  useEffect(() => {
    if (selectedCategory && selectedCategory.id) {
      const timer = setTimeout(() => {
        loadSubcategoriesForCategory(selectedCategory.id)
          .catch(err => {
            console.error('Erro ao carregar subcategorias:', err)
          })
      }, 100)
      
      return () => clearTimeout(timer)
    } else {
      setSubcategories([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory?.id])

  const loadAllData = async () => {
      try {
        setLoading(true)
      await Promise.all([
        loadCategories(),
        loadSubcategories(),
        loadProducts()
      ])
      } catch (error) {
      console.error('Erro ao carregar dados:', error)
      alert('Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

  const loadCategories = async () => {
    try {
      let { data, error } = await supabase
        .from('categorias')
        .select('id, nome, data_criacao')
        .order('id', { ascending: true })

      if (error && (error.code === 'PGRST301' || error.message?.includes('permission'))) {
        const retry = await supabase
          .from('categorias')
          .select('id, nome, data_criacao')
        
        if (!retry.error) {
          data = retry.data
          error = null
        }
      }

      if (error) {
        if (error.code === 'PGRST301' || error.message?.includes('permission denied')) {
          alert(`Erro de permissão: A tabela 'categorias' pode ter RLS habilitado sem políticas adequadas. Erro: ${error.message}`)
        } else if (error.code === '42P01' || error.message?.includes('does not exist')) {
          alert(`Tabela 'categorias' não encontrada. Verifique o nome da tabela. Erro: ${error.message}`)
        } else {
          alert(`Erro ao carregar categorias: ${error.message} (Código: ${error.code})`)
        }
        
        setCategories([])
        return
      }

      if (!data || data.length === 0) {
        setCategories([])
        return
      }

      // Mapear categorias da estrutura real: {id, nome, data_criacao}
      const categoriesWithCount = await Promise.all(data.map(async (cat: any) => {
        const categoryName = cat.nome || ''
        const categoryId = typeof cat.id === 'number' ? cat.id.toString() : String(cat.id)
        const categoryIdNum = typeof cat.id === 'number' ? cat.id : parseInt(cat.id)
        
        // Contar subcategorias desta categoria
        const { count: subcategoryCount } = await supabase
          .from('subcategorias')
          .select('*', { count: 'exact', head: true })
          .eq('id_categoria', categoryIdNum)
        
        // Contar produtos desta categoria
        // Tentar com category_id como string (UUID) e como número
        let productCountByCategory = 0
        
        // Primeiro tentar como string
        const { count: countByCategoryStr } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', categoryId)
        
        // Se não encontrou, tentar como número (caso category_id seja int8)
        if (!countByCategoryStr || countByCategoryStr === 0) {
          const { count: countByCategoryNum } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', categoryIdNum)
          
          productCountByCategory = countByCategoryNum || 0
        } else {
          productCountByCategory = countByCategoryStr
        }
        
        // Contar produtos das subcategorias desta categoria
        let productCountBySubcategory = 0
        if (subcategoryCount && subcategoryCount > 0) {
          const { data: subcategories } = await supabase
            .from('subcategorias')
            .select('id')
            .eq('id_categoria', categoryIdNum)
          
          if (subcategories && subcategories.length > 0) {
            // Tentar com IDs como string e como número
            const subcategoryIdsStr = subcategories.map((sub: any) => sub.id.toString())
            const subcategoryIdsNum = subcategories.map((sub: any) => 
              typeof sub.id === 'number' ? sub.id : parseInt(sub.id)
            ).filter(id => !isNaN(id))
            
            // Tentar com strings primeiro
            const { count: countBySubStr } = await supabase
              .from('products')
              .select('*', { count: 'exact', head: true })
              .in('subcategory_id', subcategoryIdsStr)
            
            if (countBySubStr && countBySubStr > 0) {
              productCountBySubcategory = countBySubStr
            } else if (subcategoryIdsNum.length > 0) {
              // Tentar com números
              const { count: countBySubNum } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .in('subcategory_id', subcategoryIdsNum)
              
              productCountBySubcategory = countBySubNum || 0
            }
          }
        }
        
        const totalProductCount = (productCountByCategory || 0) + productCountBySubcategory
        
        const mapped: Category = {
          id: categoryId,
          name: categoryName,
          slug: categoryName.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, ''),
          description: null,
          image_url: null,
          banner_url: null,
          is_active: true,
          sort_order: 0,
          productCount: totalProductCount,
          subcategoryCount: subcategoryCount || 0
        }
        return mapped
      }))

      setCategories(categoriesWithCount)
    } catch (error: any) {
      console.error('Erro ao carregar categorias:', error)
      alert(`Erro ao carregar categorias: ${error.message}`)
      setCategories([])
    }
  }

  // Carregar subcategorias de uma categoria específica
  const loadSubcategoriesForCategory = async (categoryId: string) => {
    try {
      const categoryIdNum = parseInt(categoryId)
      
      if (isNaN(categoryIdNum)) {
        setSubcategories([])
        return
      }
      
      const { data, error } = await supabase
        .from('subcategorias')
        .select('id, nome, id_categoria, data_criacao')
        .eq('id_categoria', categoryIdNum)
        .order('id', { ascending: true })

      if (error) {
        console.error('Erro ao buscar subcategorias:', error)
        alert(`Erro ao buscar subcategorias: ${error.message}`)
        setSubcategories([])
        return
      }

      if (!data || data.length === 0) {
        setSubcategories([])
        return
      }

      // Mapear subcategorias para o formato esperado
      const mappedSubcategories = data.map((sub: any) => ({
        id: sub.id.toString(),
        category_id: categoryId,
        name: sub.nome,
        slug: generateSlug(sub.nome),
        description: null,
        image_url: null,
        is_active: true,
        sort_order: 0,
        category: selectedCategory ? {
          id: selectedCategory.id,
          name: selectedCategory.name,
          slug: selectedCategory.slug,
          description: selectedCategory.description,
          image_url: selectedCategory.image_url,
          banner_url: selectedCategory.banner_url,
          is_active: selectedCategory.is_active,
          sort_order: selectedCategory.sort_order
        } : undefined,
        productCount: 0
      }))

      // Atualizar subcategorias, mantendo as existentes de outras categorias ou substituindo
      setSubcategories(prev => {
        // Remover subcategorias da categoria anterior e adicionar as novas
        const otherCategories = prev.filter(sub => {
          const subCatId = typeof sub.category_id === 'string' ? sub.category_id : String(sub.category_id)
          return subCatId !== categoryId
        })
        return [...otherCategories, ...mappedSubcategories]
      })
    } catch (error: any) {
      console.error('Erro ao carregar subcategorias:', error)
      alert(`Erro ao carregar subcategorias: ${error.message}`)
      setSubcategories([])
    }
  }

  const loadSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from('subcategorias')
        .select('id, nome, id_categoria, data_criacao')
        .order('id', { ascending: true })

      if (error) {
        if (error.code === 'PGRST301' || error.message?.includes('permission')) {
          alert(`Erro de permissão ao carregar subcategorias. Verifique as políticas RLS.\n\nErro: ${error.message}\nCódigo: ${error.code}`)
        } else {
          alert(`Erro ao carregar subcategorias:\n\n${error.message}\nCódigo: ${error.code}`)
        }
        setSubcategories([])
        return
      }

      if (!data || data.length === 0) {
        setSubcategories([])
        return
      }

      const categoryIds = [...new Set(data.map((sub: any) => {
        const catId = sub.id_categoria
        return typeof catId === 'number' ? catId.toString() : String(catId)
      }).filter(Boolean))]
      
      let categoriesMap = new Map()
      
      if (categoryIds.length > 0) {
        const categoryIdsNumeric = categoryIds.map(id => parseInt(id)).filter(id => !isNaN(id))
        
        const { data: categoriesData } = await supabase
          .from('categorias')
          .select('id, nome')
          .in('id', categoryIdsNumeric)
        
        if (categoriesData) {
          categoriesData.forEach((cat: any) => {
            const catId = typeof cat.id === 'number' ? cat.id.toString() : String(cat.id)
            categoriesMap.set(catId, { 
              id: catId, 
              name: cat.nome 
            })
          })
        }
      }

      const subcategoriesWithCount = data.map((sub: any) => {
        const subName = sub.nome || sub.name || ''
        const subId = typeof sub.id === 'number' ? sub.id.toString() : String(sub.id)
        const catId = sub.id_categoria
        const catIdStr = typeof catId === 'number' ? catId.toString() : String(catId)
        const category = categoriesMap.get(catIdStr) || null

        return {
          id: subId,
          category_id: catIdStr,
          name: subName,
          slug: generateSlug(subName),
          description: null,
          image_url: null,
          is_active: true,
          sort_order: 0,
          category: category ? {
            id: category.id,
            name: category.name,
            slug: generateSlug(category.name),
            description: null,
            image_url: null,
            banner_url: null,
            is_active: true,
            sort_order: 0
          } : undefined,
          productCount: 0
        } as Subcategory
      })

      setSubcategories(subcategoriesWithCount)
    } catch (error: any) {
      console.error('Erro ao carregar subcategorias:', error)
      alert(`Erro ao carregar subcategorias: ${error.message}`)
      setSubcategories([])
    }
  }

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao carregar produtos:', error)
      return
    }

    if (!data || data.length === 0) {
      setProducts([])
      return
    }

    // Mapear produtos e adicionar compatibilidade com price
    // Buscar imagens e categorias para cada produto
    const productsWithDetails = await Promise.all(
      data.map(async (product: any) => {
        // Buscar imagens do produto usando a nova estrutura (images + product_image_relations)
        let images = []
        try {
          // Buscar relações produto-imagem
          const { data: relationsData, error: relationsError } = await supabase
            .from('product_image_relations')
            .select('image_id, is_primary')
            .eq('product_id', product.id)
            .order('is_primary', { ascending: false })
          
          if (!relationsError && relationsData && relationsData.length > 0) {
            // Buscar as URLs das imagens
            const imageIds = relationsData.map((rel: any) => rel.image_id)
            const { data: imagesData, error: imagesError } = await supabase
              .from('images')
              .select('id, image_url')
              .in('id', imageIds)
            
            if (!imagesError && imagesData && imagesData.length > 0) {
              // Ordenar: primária primeiro
              const sortedImages = relationsData.map((rel: any) => {
                const img = imagesData.find((i: any) => i.id === rel.image_id)
                return img ? { image_url: img.image_url, is_primary: rel.is_primary } : null
              }).filter(Boolean)
              
              images = sortedImages
            }
          }
          
          // Fallback: tentar buscar da tabela antiga product_images se a nova estrutura não funcionar
          if (images.length === 0) {
            const { data: oldImagesData, error: oldImagesError } = await supabase
              .from('product_images')
              .select('image_url')
              .eq('product_id', product.id)
              .order('is_primary', { ascending: false })
            
            if (!oldImagesError && oldImagesData) {
              images = oldImagesData
            }
          }
        } catch (error: any) {
          // Capturar qualquer outro erro e continuar sem imagens
          console.warn(`Erro ao buscar imagens do produto ${product.id}:`, error.message)
          images = []
        }

        // Buscar categoria se category_id existir
        // category_id é TEXT que armazena o ID numérico (int8) da tabela categorias
        let category = null
        if (product.category_id) {
          const categoryIdNum = parseInt(product.category_id)
          if (!isNaN(categoryIdNum)) {
            const { data: catData } = await supabase
              .from('categorias')
              .select('id, nome')
              .eq('id', categoryIdNum)
              .maybeSingle()
            
            if (catData) {
              category = {
                id: catData.id.toString(),
                name: catData.nome,
                slug: '',
                description: null,
                image_url: null,
                banner_url: null,
                is_active: true,
                sort_order: 0
              }
            }
          }
        }

        // Buscar subcategoria se subcategory_id existir
        // subcategory_id é TEXT que armazena o ID numérico (int8) da tabela subcategorias
        let subcategory = null
        if (product.subcategory_id) {
          const subcategoryIdNum = parseInt(product.subcategory_id)
          if (!isNaN(subcategoryIdNum)) {
            const { data: subData } = await supabase
              .from('subcategorias')
              .select('id, nome, id_categoria')
              .eq('id', subcategoryIdNum)
              .maybeSingle()
            
            if (subData) {
              subcategory = {
                id: subData.id.toString(),
                name: subData.nome,
                slug: '',
                category_id: subData.id_categoria.toString(),
                description: null,
                image_url: null,
                is_active: true,
                sort_order: 0
              }
            }
          }
        }

        // Mapear produto com compatibilidade
        return {
          ...product,
          price: product.base_price || product.price || 0, // Compatibilidade
          images: images && Array.isArray(images) ? images.map((img: any) => {
            // Se é objeto com image_url, pegar a URL
            if (typeof img === 'object' && img.image_url) return img.image_url
            // Se já é string, retornar direto
            if (typeof img === 'string') return img
            return null
          }).filter((url: string | null) => url) : [],
          category,
          subcategory
        }
      })
    )

    setProducts(productsWithDetails as Product[])
  }

  // PRODUCT CRUD
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsEditing(false)
    setProductForm({
      name: product.name,
      description: product.description || '',
      short_description: '', // Campo não existe na tabela, manter para compatibilidade do formulário
      category_id: product.category_id || '',
      subcategory_id: product.subcategory_id || '',
      price: (product.base_price || product.price || 0).toString(),
      wholesale_price: product.wholesale_price?.toString() || '',
      cost_price: '', // Campo não existe na tabela, manter para compatibilidade
      sku: product.sku || '',
      barcode: '', // Campo não existe na tabela, manter para compatibilidade
      weight: product.weight?.toString() || '',
      stock_quantity: product.stock_quantity.toString(),
      min_stock: product.min_stock.toString(),
      max_stock: product.max_stock?.toString() || '',
      sizes: product.sizes || [],
      colors: product.colors || [],
      materials: product.materials || [],
      is_active: product.is_active,
      is_featured: product.is_featured,
      is_on_sale: product.is_on_sale,
      images: product.images || []
    })
  }

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsEditing(true)
    setProductForm({
      name: '',
      description: '',
      short_description: '',
      category_id: '',
      subcategory_id: '',
      price: '',
      wholesale_price: '',
      cost_price: '',
      sku: '',
      barcode: '',
      weight: '',
      stock_quantity: '0',
      min_stock: '0',
      max_stock: '',
      sizes: [],
      colors: [],
      materials: [],
      is_active: true,
      is_featured: false,
      is_on_sale: false,
      images: []
    })
  }

  const handleSaveProduct = async () => {
      // Validar campos obrigatórios antes de iniciar salvamento
    if (!productForm.name || !productForm.name.trim()) {
      alert('O nome do produto é obrigatório!')
      return
    }

    if (!productForm.price || isNaN(parseFloat(productForm.price))) {
      alert('O preço de venda é obrigatório e deve ser um número válido!')
      return
    }

    try {
      setSaving(true)

      // Gerar slug automaticamente a partir do nome
      const slug = generateSlug(productForm.name)

      // Preparar dados do produto com campos corretos da tabela
      // Campos obrigatórios sempre presentes
      const productData: any = {
        name: productForm.name.trim(),
        slug: slug,
        base_price: parseFloat(productForm.price), // Preço de venda (obrigatório)
        stock_quantity: parseInt(productForm.stock_quantity) || 0,
        min_stock: 0, // Valor padrão obrigatório
        is_active: true,
        is_featured: false,
        is_on_sale: false
      }

      // Campos opcionais - apenas adicionar se tiverem valor, senão NULL
      productData.description = productForm.description?.trim() || null
      productData.category_id = productForm.category_id || null
      productData.subcategory_id = productForm.subcategory_id || null
      
      // Preço atacado - sempre NULL (campo removido do formulário)
      productData.wholesale_price = null

      // Arrays - apenas se tiverem valores, senão array vazio
      productData.sizes = productForm.sizes && productForm.sizes.length > 0 
        ? productForm.sizes.filter(s => s && s.trim()).map(s => s.trim())
        : []
      productData.colors = [] // Sempre vazio por enquanto
      productData.materials = [] // Sempre vazio por enquanto

      // Remover campos que NÃO existem na tabela products antes de enviar
      // Esses campos não existem na estrutura atual da tabela
      const fieldsToRemove = ['barcode', 'cost_price', 'short_description']
      fieldsToRemove.forEach(field => {
        delete productData[field]
      })

      if (selectedProduct) {
        // Update - adicionar updated_at
        productData.updated_at = new Date().toISOString()
        
        const { data: updatedData, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', selectedProduct.id)
          .select()

        if (error) {
          console.error('Erro detalhado no UPDATE:', error)
          throw error
        }
        
        if (!updatedData || updatedData.length === 0) {
          throw new Error('Produto não foi atualizado. Verifique se o produto ainda existe.')
        }
        
        alert('Produto atualizado com sucesso!')
      } else {
        // Create - slug deve ser único, verificar se já existe
        const { data: existing } = await supabase
          .from('products')
          .select('id')
          .eq('slug', slug)
          .maybeSingle()

        if (existing) {
          // Se slug já existe, adicionar sufixo numérico
          let finalSlug = slug
          let counter = 1
          let slugExists = true

          while (slugExists) {
            finalSlug = `${slug}-${counter}`
            const { data: check } = await supabase
              .from('products')
              .select('id')
              .eq('slug', finalSlug)
              .maybeSingle()
            
            if (!check) {
              slugExists = false
            } else {
              counter++
            }
          }
          productData.slug = finalSlug
        }

        const { data: newData, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single()

        if (error) {
          console.error('Erro detalhado no INSERT:', error)
          console.error('Dados enviados:', productData)
          throw error
        }
        
        if (!newData) {
          throw new Error('Produto não foi criado. Verifique os dados enviados.')
        }
        
        alert('Produto criado com sucesso!')
      }

      // Recarregar dados (sem bloquear se der erro)
      try {
        await loadAllData()
      } catch (loadError) {
        console.error('Erro ao recarregar dados:', loadError)
        // Não bloquear o processo se apenas o reload falhar
      }

      setIsEditing(false)
      setSelectedProduct(null)
      
      // Resetar formulário após salvar
      setProductForm({
        name: '',
        description: '',
        short_description: '',
        category_id: '',
        subcategory_id: '',
        price: '',
        wholesale_price: '',
        cost_price: '',
        sku: '',
        barcode: '',
        weight: '',
        stock_quantity: '',
        min_stock: '',
        max_stock: '',
        sizes: [],
        colors: [],
        materials: [],
        is_active: true,
        is_featured: false,
        is_on_sale: false,
        images: []
      })
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error)
      
      // Mensagem de erro mais detalhada
      let errorMessage = 'Erro desconhecido ao salvar produto'
      
      if (error.message) {
        errorMessage = error.message
      } else if (error.code) {
        errorMessage = `Erro ${error.code}: ${error.message || 'Erro ao salvar produto'}`
      }
      
      // Verificar se é erro de coluna não encontrada
      if (error.message?.includes('column') && error.message?.includes('does not exist')) {
        errorMessage = `Coluna não encontrada na tabela. Verifique se a estrutura da tabela 'products' está correta. ${error.message}`
      }
      
      // Verificar se é erro de constraint
      if (error.message?.includes('violates') || error.message?.includes('constraint')) {
        errorMessage = `Erro de validação: ${error.message}`
      }
      
      alert(`Erro ao salvar produto: ${errorMessage}`)
    } finally {
      // Sempre resetar o estado de salvamento
      setSaving(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!selectedProduct) {
      alert('Nenhum produto selecionado para excluir!')
      return
    }

    // Confirmação simples (removendo confirmação dupla que pode estar causando problema)
    const productName = selectedProduct.name || 'este produto'
    const confirmMessage = `Tem certeza que deseja excluir "${productName}"?\n\nEsta ação não pode ser desfeita!`
    
    if (!confirm(confirmMessage)) {
      return
    }

    try {
      setSaving(true)
      console.log('Iniciando exclusão do produto:', selectedProduct.id)

      // Tentar excluir o produto
      const { error, data } = await supabase
        .from('products')
        .delete()
        .eq('id', selectedProduct.id)
        .select()

      console.log('Resultado da exclusão:', { error, data })

      if (error) {
        console.error('Erro detalhado ao excluir:', error)
        throw error
      }

      // A exclusão pode não retornar dados em algumas configurações do Supabase
      // Vamos verificar se realmente foi excluído tentando buscar o produto
      const { data: checkData, error: checkError } = await supabase
        .from('products')
        .select('id')
        .eq('id', selectedProduct.id)
        .maybeSingle()

      console.log('Verificação pós-exclusão:', { checkData, checkError })

      // Se ainda existe, houve um problema
      if (checkData) {
        throw new Error('O produto não foi excluído. Verifique as permissões ou se há dependências.')
      }

      alert(`Produto "${productName}" excluído com sucesso!`)
      
      // Limpar seleção e formulário ANTES de recarregar
    setSelectedProduct(null)
      setIsEditing(false)
      setProductForm({
      name: '',
      description: '',
        short_description: '',
        category_id: '',
        subcategory_id: '',
      price: '',
        wholesale_price: '',
        cost_price: '',
        sku: '',
        barcode: '',
        weight: '',
        stock_quantity: '',
        min_stock: '',
        max_stock: '',
      sizes: [],
        colors: [],
        materials: [],
        is_active: true,
        is_featured: false,
        is_on_sale: false,
      images: []
    })

      // Recarregar lista de produtos (sem bloquear se der erro)
      try {
        await loadAllData()
      } catch (loadError) {
        console.error('Erro ao recarregar dados após exclusão:', loadError)
        // Não bloquear o processo se apenas o reload falhar
      }

    } catch (error: any) {
      console.error('Erro completo ao excluir produto:', error)
      
      let errorMessage = 'Erro desconhecido ao excluir produto'
      
      if (error.message) {
        errorMessage = error.message
      } else if (error.code) {
        errorMessage = `Erro ${error.code}: ${error.message || 'Erro ao excluir produto'}`
      }

      // Verificar se é erro de constraint (produto pode estar sendo usado em pedidos)
      if (error.message?.includes('violates') || error.message?.includes('constraint') || error.message?.includes('foreign key')) {
        errorMessage = `Não é possível excluir este produto porque ele está sendo usado em pedidos ou outras referências. ${error.message}`
      }

      // Verificar se é erro de permissão
      if (error.message?.includes('permission') || error.code === 'PGRST301' || error.message?.includes('RLS')) {
        errorMessage = `Erro de permissão: Você não tem permissão para excluir produtos. Verifique as políticas RLS (Row Level Security) no Supabase. ${error.message}`
      }

      // Verificar se é erro de coluna
      if (error.message?.includes('column') && error.message?.includes('does not exist')) {
        errorMessage = `Erro na estrutura da tabela: ${error.message}`
      }

      alert(`Erro ao excluir produto: ${errorMessage}`)
    } finally {
      // SEMPRE resetar o estado, mesmo se houver erro
      console.log('Resetando estado de salvamento')
      setSaving(false)
    }
  }

  // CATEGORY CRUD
  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsEditing(false)
    setCategoryForm({
      name: category.name,
      slug: category.slug || generateSlug(category.name),
      image_url: category.image_url || '',
      banner_url: category.banner_url || '',
      is_active: category.is_active !== undefined ? category.is_active : true
    })
    loadSubcategoriesForCategory(category.id).catch(err => {
      console.error('Erro ao carregar subcategorias:', err)
    })
  }

  const handleAddCategory = () => {
    setSelectedCategory(null)
    setIsEditing(true)
    setCategoryForm({
      name: '',
      slug: '',
      image_url: '',
      banner_url: '',
      is_active: true
    })
  }

  const handleSaveCategory = async () => {
    try {
      // Validação
      if (!categoryForm.name || categoryForm.name.trim() === '') {
        alert('Por favor, preencha o nome da categoria!')
        return
      }

      setSaving(true)

      if (selectedCategory) {
        // Atualizar categoria existente
        
        const categoryData: any = {
          nome: categoryForm.name.trim()
        }

        const { data: updatedData, error } = await supabase
          .from('categorias')
          .update(categoryData)
          .eq('id', parseInt(selectedCategory.id))
          .select()
          .single()

        if (error) {
          throw error
        }

        alert('Categoria atualizada com sucesso!')
        
        // Recarregar categorias
        await loadCategories()
        
        // Atualizar categoria selecionada com dados atualizados
        if (updatedData) {
          const mapped: Category = {
            id: updatedData.id.toString(),
            name: updatedData.nome,
            slug: generateSlug(updatedData.nome),
            description: null,
            image_url: null,
            banner_url: null,
            is_active: true,
            sort_order: 0,
            productCount: 0
          }
          setSelectedCategory(mapped)
        }
      } else {
        // Criar nova categoria
        const categoryData: any = {
          nome: categoryForm.name.trim()
        }

        const { data: newCategory, error } = await supabase
          .from('categorias')
          .insert(categoryData)
          .select('id, nome, data_criacao')
          .single()

        if (error) {
          throw error
        }

        alert('Categoria criada com sucesso!')
        
        // Recarregar categorias para atualizar a lista
        await loadCategories()
        
        // Selecionar a categoria recém-criada
        if (newCategory) {
          const mappedCategory: Category = {
            id: newCategory.id.toString(),
            name: newCategory.nome,
            slug: generateSlug(newCategory.nome),
            description: null,
            image_url: null,
            banner_url: null,
            is_active: true,
            sort_order: 0,
            productCount: 0
          }
          
          // Aguardar um pouco para garantir que a lista foi atualizada
          setTimeout(() => {
            handleSelectCategory(mappedCategory)
            setIsEditing(false) // Sair do modo de edição após selecionar
          }, 500)
          return // Retornar antes de setIsEditing(false) abaixo
        }
      }

      setIsEditing(false)
      if (!selectedCategory) {
        setSelectedCategory(null)
      }
    } catch (error: any) {
      console.error('❌ Erro ao salvar categoria:', error)
      console.error('Detalhes do erro:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      
      let errorMessage = 'Erro ao salvar categoria'
      if (error.code === '23505') {
        errorMessage = 'Já existe uma categoria com este nome!'
      } else if (error.code === 'PGRST301') {
        errorMessage = 'Erro de permissão. Verifique se você tem permissão para criar/editar categorias.'
      } else {
        errorMessage = `Erro ao salvar categoria: ${error.message}`
      }
      
      alert(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return

    const categoryName = selectedCategory.name
    if (!confirm(`Tem certeza que deseja excluir a categoria "${categoryName}"? Esta ação não pode ser desfeita.`)) {
      return
    }

    try {
      const categoryId = parseInt(selectedCategory.id)

      const { error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', categoryId)

      if (error) {
        throw error
      }

      alert(`Categoria "${categoryName}" excluída com sucesso!`)
      
      // Limpar seleção e recarregar lista
      setSelectedCategory(null)
      setIsEditing(false)
      await loadCategories()
    } catch (error: any) {
      console.error('❌ Erro completo ao excluir categoria:', error)
      
      let errorMessage = 'Erro ao excluir categoria'
      if (error.code === '23503') {
        errorMessage = 'Não é possível excluir esta categoria porque ela possui produtos ou subcategorias associados. Remova-os primeiro.'
      } else if (error.code === 'PGRST301') {
        errorMessage = 'Erro de permissão. Verifique se você tem permissão para excluir categorias.'
      } else if (error.code === '42P01') {
        errorMessage = 'Tabela não encontrada. Verifique se a tabela "categorias" existe.'
      } else {
        errorMessage = `Erro ao excluir categoria: ${error.message || 'Erro desconhecido'}`
      }
      
      alert(errorMessage)
    }
  }

  // SUBCATEGORY CRUD
  const handleSelectSubcategory = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory)
    setIsEditing(true)
    setSubcategoryForm({
      name: subcategory.name,
      slug: subcategory.slug,
      category_id: subcategory.category_id,
      image_url: subcategory.image_url || '',
      is_active: subcategory.is_active
    })
  }

  const handleAddSubcategory = () => {
    if (!selectedCategory) {
      alert('Selecione uma categoria primeiro para adicionar uma subcategoria')
      return
    }
    setSelectedSubcategory(null)
    setIsEditing(true)
    setSubcategoryForm({
      name: '',
      slug: '',
      category_id: selectedCategory.id,
      image_url: '',
      is_active: true,
      sort_order: 0
    })
  }

  const handleSaveSubcategory = async () => {
    try {
      // Validação
      if (!subcategoryForm.name || subcategoryForm.name.trim() === '') {
        alert('Por favor, preencha o nome da subcategoria!')
        return
      }

      if (!subcategoryForm.category_id) {
        alert('Selecione uma categoria pai!')
        return
      }

      setSaving(true)

      const categoryIdNum = parseInt(subcategoryForm.category_id)

      if (selectedSubcategory) {
        // Atualizar subcategoria existente
        const subcategoryData: any = {
          nome: subcategoryForm.name.trim(),
          id_categoria: categoryIdNum
        }

        const { data: updatedData, error } = await supabase
          .from('subcategorias')
          .update(subcategoryData)
          .eq('id', parseInt(selectedSubcategory.id))
          .select()
          .single()

        if (error) {
          throw error
        }

        alert('Subcategoria atualizada com sucesso!')
        
        // Recarregar subcategorias
        if (selectedCategory) {
          await loadSubcategoriesForCategory(selectedCategory.id)
        } else {
          await loadSubcategories()
        }
        
        // Atualizar subcategoria selecionada
        if (updatedData) {
          // Estrutura real: id, id_categoria, nome, data_criacao
          const catIdStr = (updatedData.id_categoria || updatedData.categoria_id)?.toString() || ''
          const subName = updatedData.nome || updatedData.name || ''
          const categoryInfo = categories.find(c => c.id === catIdStr)
          
          const mapped: Subcategory = {
            id: updatedData.id.toString(),
            category_id: catIdStr,
            name: subName,
            slug: generateSlug(subName),
            description: null,
            image_url: null,
            is_active: true,
            sort_order: 0,
            category: categoryInfo ? {
              id: categoryInfo.id,
              name: categoryInfo.name,
              slug: categoryInfo.slug,
              description: categoryInfo.description,
              image_url: categoryInfo.image_url,
              banner_url: categoryInfo.banner_url,
              is_active: categoryInfo.is_active,
              sort_order: categoryInfo.sort_order
            } : undefined,
            productCount: 0
          }
          setSelectedSubcategory(mapped)
        }
      } else {
        // Criar nova subcategoria
        const subcategoryData: any = {
          nome: subcategoryForm.name.trim(),
          id_categoria: categoryIdNum,
          data_criacao: new Date().toISOString()
        }

        // Buscar todas as colunas disponíveis para o select
        const { data: newSubcategory, error } = await supabase
          .from('subcategorias')
          .insert(subcategoryData)
          .select('*')
          .single()

        if (error) {
          throw error
        }

        alert('Subcategoria criada com sucesso!')
        
        // Recarregar subcategorias para atualizar a lista
        if (selectedCategory) {
          await loadSubcategoriesForCategory(selectedCategory.id)
        } else {
          await loadSubcategories()
        }
        
        // Selecionar a subcategoria recém-criada
        if (newSubcategory) {
          // Estrutura real: id, id_categoria, nome, data_criacao
          const catIdStr = (newSubcategory.id_categoria || newSubcategory.categoria_id)?.toString() || ''
          const subName = newSubcategory.nome || newSubcategory.name || ''
          const categoryInfo = categories.find(c => c.id === catIdStr)
          
          const mappedSubcategory: Subcategory = {
            id: newSubcategory.id.toString(),
            category_id: catIdStr,
            name: subName,
            slug: generateSlug(subName),
            description: null,
            image_url: null,
            is_active: true,
            sort_order: 0,
            category: categoryInfo ? {
              id: categoryInfo.id,
              name: categoryInfo.name,
              slug: categoryInfo.slug,
              description: categoryInfo.description,
              image_url: categoryInfo.image_url,
              banner_url: categoryInfo.banner_url,
              is_active: categoryInfo.is_active,
              sort_order: categoryInfo.sort_order
            } : undefined,
            productCount: 0
          }
          
          // Aguardar um pouco para garantir que a lista foi atualizada
          setTimeout(() => {
            handleSelectSubcategory(mappedSubcategory)
            setIsEditing(false) // Sair do modo de edição após selecionar
          }, 500)
          return // Retornar antes de setIsEditing(false) abaixo
        }
      }

      setIsEditing(false)
    } catch (error: any) {
      console.error('❌ Erro ao salvar subcategoria:', error)
      console.error('Detalhes do erro:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      
      let errorMessage = 'Erro ao salvar subcategoria'
      if (error.code === '23505') {
        errorMessage = 'Já existe uma subcategoria com este nome nesta categoria!'
      } else if (error.code === '23503') {
        errorMessage = 'A categoria selecionada não existe ou foi removida!'
      } else if (error.code === 'PGRST301') {
        errorMessage = 'Erro de permissão. Verifique se você tem permissão para criar/editar subcategorias.'
      } else {
        errorMessage = `Erro ao salvar subcategoria: ${error.message}`
      }
      
      alert(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSubcategory = async () => {
    if (!selectedSubcategory) return

    const subcategoryName = selectedSubcategory.name
    if (!confirm(`Tem certeza que deseja excluir a subcategoria "${subcategoryName}"? Esta ação não pode ser desfeita.`)) {
      return
    }

    try {
      const subcategoryId = parseInt(selectedSubcategory.id)

      const { error } = await supabase
        .from('subcategorias')
        .delete()
        .eq('id', subcategoryId)

      if (error) {
        throw error
      }

      alert(`Subcategoria "${subcategoryName}" excluída com sucesso!`)
      
      // Limpar seleção e recarregar lista
      setSelectedSubcategory(null)
      setIsEditing(false)
      if (selectedCategory) {
        await loadSubcategoriesForCategory(selectedCategory.id)
      } else {
        await loadSubcategories()
      }
    } catch (error: any) {
      console.error('❌ Erro completo ao excluir subcategoria:', error)
      
      let errorMessage = 'Erro ao excluir subcategoria'
      if (error.code === '23503') {
        errorMessage = 'Não é possível excluir esta subcategoria porque ela possui produtos associados. Remova-os primeiro.'
      } else if (error.code === 'PGRST301') {
        errorMessage = 'Erro de permissão. Verifique se você tem permissão para excluir subcategorias.'
      } else if (error.code === '42P01') {
        errorMessage = 'Tabela não encontrada. Verifique se a tabela "subcategorias" existe.'
      } else {
        errorMessage = `Erro ao excluir subcategoria: ${error.message || 'Erro desconhecido'}`
      }
      
      alert(errorMessage)
    }
  }

  // Helper functions
  const addSize = (size: string) => {
    if (size && !productForm.sizes.includes(size.toUpperCase())) {
      setProductForm(prev => ({
        ...prev,
        sizes: [...prev.sizes, size.toUpperCase()]
      }))
    }
  }

  const removeSize = (size: string) => {
    setProductForm(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }))
  }

  const addColor = (color: string) => {
    if (color && !productForm.colors.includes(color)) {
      setProductForm(prev => ({
        ...prev,
        colors: [...prev.colors, color]
      }))
    }
  }

  const removeColor = (color: string) => {
    setProductForm(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }))
  }

  const addMaterial = (material: string) => {
    if (material && !productForm.materials.includes(material)) {
      setProductForm(prev => ({
        ...prev,
        materials: [...prev.materials, material]
      }))
    }
  }

  const removeMaterial = (material: string) => {
    setProductForm(prev => ({
      ...prev,
      materials: prev.materials.filter(m => m !== material)
    }))
  }

  // Filter data
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredCategories = categories.filter(c => {
    if (!c || !c.name) return false
    return c.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const filteredSubcategories = subcategories.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Carregando...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex min-w-72 flex-col">
            <h1 className="text-3xl font-bold text-white">Gerenciamento de Conteúdo</h1>
            <p className="text-base text-white/70">Gerencie produtos, categorias e subcategorias da sua loja.</p>
          </div>
          
          {/* View Mode Tabs */}
          <div className="flex items-center gap-2 bg-black border-2 border-yellow-500/30 rounded-lg p-1">
            <button
              onClick={() => setViewMode('products')}
              className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                viewMode === 'products'
                  ? 'bg-yellow-500 text-black'
                  : 'text-white hover:bg-yellow-500/10'
              }`}
            >
              <Package2 className="h-4 w-4" />
              Produtos
            </button>
            <button
              onClick={() => setViewMode('categories')}
              className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                viewMode === 'categories'
                  ? 'bg-yellow-500 text-black'
                  : 'text-white hover:bg-yellow-500/10'
              }`}
            >
              <Tag className="h-4 w-4" />
              Categorias
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 xl:grid-cols-4">
          {/* Left Panel: List */}
          <div className="lg:col-span-1 xl:col-span-1">
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-yellow-500" />
                </div>
                <input
                  type="text"
                  placeholder={`Buscar ${viewMode === 'products' ? 'produtos' : 'categorias'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border-2 border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-black text-white placeholder-white/50"
                />
              </div>

              {/* Add Button */}
              <button
                onClick={() => {
                  if (viewMode === 'products') handleAddProduct()
                  else if (viewMode === 'categories') handleAddCategory()
                }}
                className="flex w-full items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
              >
                <Plus className="h-5 w-5" />
                Adicionar Novo {viewMode === 'products' ? 'Produto' : 'Categoria'}
              </button>

              {/* List */}
              <div className="flex flex-col gap-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                {viewMode === 'products' && filteredProducts.length === 0 && (
                  <div className="text-center py-8 text-white/50">
                    <Package2 className="h-8 w-8 mx-auto mb-2 text-yellow-500/50" />
                    <p className="text-sm">Nenhum produto encontrado</p>
                  </div>
                )}
                {viewMode === 'products' && filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className={`flex cursor-pointer items-center gap-4 rounded-lg p-3 transition-colors border-2 ${
                      selectedProduct?.id === product.id
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : 'bg-black border-yellow-500/30 hover:border-yellow-500/50'
                    }`}
                  >
                    {product.images && product.images.length > 0 ? (
                    <div className="relative w-12 h-12 rounded-md overflow-hidden">
                      <Image
                          src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-yellow-500/20 flex items-center justify-center">
                        <Package2 className="h-6 w-6 text-yellow-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{product.name}</p>
                      <p className="text-sm text-yellow-400">Estoque: {product.stock_quantity}</p>
                    </div>
                  </div>
                ))}

                {viewMode === 'categories' && (
                  <>
                    {filteredCategories.length === 0 ? (
                      <div className="text-center py-8 text-white/50">
                        <Tag className="h-8 w-8 mx-auto mb-2 text-yellow-500/50" />
                        <p className="text-sm">
                          {searchTerm ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria cadastrada'}
                        </p>
                        {!searchTerm && (
                          <p className="text-xs mt-1">Clique em "Adicionar Nova Categoria" para começar</p>
                        )}
              </div>
                    ) : (
                      filteredCategories.map((category) => (
                        <div
                          key={category.id}
                          onClick={() => handleSelectCategory(category)}
                          className={`flex cursor-pointer items-center gap-4 rounded-lg p-3 transition-colors border-2 ${
                            selectedCategory?.id === category.id
                              ? 'border-yellow-500 bg-yellow-500/10'
                              : 'bg-black border-yellow-500/30 hover:border-yellow-500/50'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-md bg-yellow-500/20 flex items-center justify-center">
                            <Tag className="h-6 w-6 text-yellow-500" />
            </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white truncate">{category.name}</p>
                            <p className="text-sm text-yellow-400">{category.subcategoryCount || 0} subcategorias</p>
          </div>
                        </div>
                      ))
                    )}
                  </>
                )}

              </div>
            </div>
          </div>

          {/* Right Panel: Form */}
          <div className="lg:col-span-2 xl:col-span-3">
            {viewMode === 'products' && renderProductForm()}
            {viewMode === 'categories' && renderCategoryForm()}
          </div>
        </div>
      </div>
    </div>
  )

  // Render functions
  function renderProductForm() {
    if (!selectedProduct && !isEditing) {
      return (
        <div className="flex flex-col items-center justify-center py-12 bg-black border-2 border-yellow-500/30 rounded-xl">
          <ImageIcon className="h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Nenhum produto selecionado</h3>
          <p className="text-white/70 mb-4">Selecione um produto da lista para visualizar ou editar</p>
          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Adicionar Novo Produto
          </button>
        </div>
      )
    }

    return (
              <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="rounded-xl border-2 border-yellow-500/30 bg-black p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">
              {isEditing ? (selectedProduct ? 'Editar Produto' : 'Novo Produto') : 'Visualizar Produto'}
                    </h2>
            {!isEditing && selectedProduct && (
                      <button
                onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-3 py-1 text-sm text-yellow-400 hover:text-yellow-300"
                      >
                        <Edit className="h-4 w-4" />
                        Editar
                      </button>
                    )}
                  </div>
                  
                  {/* Imagem do Produto */}
                  {!isEditing && selectedProduct && selectedProduct.images && selectedProduct.images.length > 0 && (
                    <div className="mt-4 flex justify-center">
                      <div className="relative w-full max-w-md h-64 rounded-lg overflow-hidden border-2 border-yellow-500/30">
                        <Image
                          src={selectedProduct.images[0]}
                          alt={selectedProduct.name || 'Produto'}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    </div>
                  )}
        </div>
                  
        {/* Basic Info */}
        <div className="rounded-xl border-2 border-yellow-500/30 bg-black p-6">
          <h3 className="text-lg font-bold text-white mb-4">Informações Básicas</h3>
          <div className="grid grid-cols-1 gap-4">
                    <div>
              <label className="block text-sm font-medium text-white mb-1">Nome do Produto *</label>
                      <input
                        type="text"
                value={productForm.name}
                onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                className="w-full px-3 py-2 border-2 border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-black/50 disabled:cursor-not-allowed bg-black text-white placeholder-white/50"
                        placeholder="Ex: Camiseta Básica Branca"
                      />
                    </div>
            
                    <div>
              <label className="block text-sm font-medium text-white mb-1">Descrição</label>
                      <textarea
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                        disabled={!isEditing}
                        rows={4}
                className="w-full px-3 py-2 border-2 border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-black/50 disabled:cursor-not-allowed bg-black text-white placeholder-white/50"
                        placeholder="Descreva os detalhes do produto..."
                      />
                    </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">Categoria</label>
                <select
                  value={productForm.category_id}
                  onChange={(e) => {
                    const newCategoryId = e.target.value
                    setProductForm(prev => {
                      // Se mudou a categoria, limpar subcategoria
                      const clearedSubcategory = prev.category_id !== newCategoryId ? '' : prev.subcategory_id
                      // Carregar subcategorias da nova categoria
                      if (newCategoryId && newCategoryId !== prev.category_id) {
                        loadSubcategoriesForCategory(newCategoryId)
                      }
                      return { ...prev, category_id: newCategoryId, subcategory_id: clearedSubcategory }
                    })
                  }}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border-2 border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-black/50 disabled:cursor-not-allowed bg-black text-white"
                >
                  <option value="">Selecione...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">Subcategoria</label>
                <select
                  value={productForm.subcategory_id}
                  onChange={(e) => setProductForm(prev => ({ ...prev, subcategory_id: e.target.value }))}
                  disabled={!isEditing || !productForm.category_id}
                  className="w-full px-3 py-2 border-2 border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-black/50 disabled:cursor-not-allowed bg-black text-white"
                >
                  <option value="">Selecione...</option>
                  {subcategories
                    .filter(sub => {
                      // Filtrar subcategorias da categoria selecionada
                      if (!productForm.category_id) return false
                      // category_id pode ser string ou number, normalizar
                      const subCatId = typeof sub.category_id === 'string' ? sub.category_id : String(sub.category_id)
                      const formCatId = typeof productForm.category_id === 'string' ? productForm.category_id : String(productForm.category_id)
                      return subCatId === formCatId
                    })
                    .map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                </select>
                    </div>
                          </div>
                          </div>
                </div>

        {/* Price & Stock */}
        <div className="rounded-xl border-2 border-yellow-500/30 bg-black p-6">
          <h3 className="text-lg font-bold text-white mb-4">Preço e Estoque</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
              <label className="block text-sm font-medium text-white mb-1">Preço de Venda *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-yellow-500">R$</span>
                        </div>
                        <input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                          disabled={!isEditing}
                  className="w-full pl-8 pr-3 py-2 border-2 border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-black/50 disabled:cursor-not-allowed bg-black text-white"
                        />
                      </div>
                    </div>
            
                    <div>
              <label className="block text-sm font-medium text-white mb-1">Estoque *</label>
                      <input
                        type="number"
                value={productForm.stock_quantity}
                onChange={(e) => setProductForm(prev => ({ ...prev, stock_quantity: e.target.value }))}
                        disabled={!isEditing}
                className="w-full px-3 py-2 border-2 border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-black/50 disabled:cursor-not-allowed bg-black text-white"
                      />
                    </div>
                  </div>
                </div>

        {/* Sizes */}
        <div className="rounded-xl border-2 border-yellow-500/30 bg-black p-6">
          <h3 className="text-lg font-bold text-white mb-4">Tamanhos Disponíveis</h3>
          
          {/* Tamanhos padrão */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">Selecione os tamanhos disponíveis:</label>
            <div className="flex flex-wrap gap-2">
              {['PP', 'P', 'M', 'G', 'GG', 'XG', '2', '4', '6', '8', '10', '12', '14', '16'].map((size) => (
                <button
                          key={size}
                  type="button"
                  onClick={() => {
                    if (productForm.sizes.includes(size)) {
                      removeSize(size)
                    } else {
                      addSize(size)
                    }
                  }}
                  disabled={!isEditing}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors font-medium ${
                    productForm.sizes.includes(size)
                      ? 'bg-yellow-500 text-black border-yellow-500'
                      : 'bg-black text-white border-yellow-500/30 hover:border-yellow-500/50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {size}
                            </button>
                      ))}
                    </div>
          </div>

          {/* Tamanhos customizados */}
                    {isEditing && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">Adicionar tamanho personalizado:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                  placeholder="Ex: 38, 40, 42, Único, etc."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                      e.preventDefault()
                      const input = e.target as HTMLInputElement
                      const size = input.value.trim().toUpperCase()
                      if (size) {
                        addSize(size)
                        input.value = ''
                      }
                    }
                  }}
                  className="flex-1 px-3 py-2 border-2 border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-black text-white placeholder-white/50"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement
                    const size = input.value.trim().toUpperCase()
                    if (size) {
                      addSize(size)
                      input.value = ''
                    }
                  }}
                  className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
                >
                  Adicionar
                </button>
              </div>
                      </div>
                    )}

          {/* Tamanhos selecionados */}
          {productForm.sizes.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-white mb-2">Tamanhos selecionados:</label>
              <div className="flex flex-wrap gap-2">
                {productForm.sizes.map((size) => (
                  <span
                    key={size}
                    className="inline-flex items-center gap-2 rounded-full bg-yellow-500/20 border-2 border-yellow-500/50 px-3 py-1 text-sm font-medium text-yellow-400"
                  >
                    {size}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="ml-1 hover:bg-yellow-500/30 rounded-full p-0.5 transition-colors"
                        title="Remover tamanho"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))}
                  </div>
            </div>
          )}
                </div>

        {/* Actions */}
                {isEditing && (
          <div className="sticky bottom-0 bg-black/80 backdrop-blur-sm border-t-2 border-yellow-500/30 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button
                onClick={() => {
                  setIsEditing(false)
                  if (selectedProduct) handleSelectProduct(selectedProduct)
                }}
                className="px-4 py-2 text-white bg-black border-2 border-yellow-500/30 hover:border-yellow-500/50 rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                onClick={handleSaveProduct}
                        disabled={saving}
                className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center gap-2"
              >
                            <Save className="h-4 w-4" />
                {saving ? 'Salvando...' : 'Salvar Produto'}
              </button>
              {selectedProduct && (
                <button
                  onClick={handleDeleteProduct}
                  disabled={saving}
                  className="px-4 py-2 bg-red-500/20 text-red-400 border-2 border-red-500/30 rounded-lg hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {saving ? 'Excluindo...' : 'Excluir'}
                </button>
              )}
            </div>
                          </div>
                        )}
      </div>
    )
  }

  function renderCategoryForm() {
    if (!selectedCategory && !isEditing) {
      return (
        <div className="flex flex-col items-center justify-center py-12 bg-black border-2 border-yellow-500/30 rounded-xl">
          <Tag className="h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Nenhuma categoria selecionada</h3>
          <p className="text-white/70 mb-4">Selecione uma categoria da lista para visualizar ou editar</p>
          <button
            onClick={handleAddCategory}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Adicionar Nova Categoria
                      </button>
                    </div>
      )
    }

    return (
      <div className="flex flex-col gap-6">
        <div className="rounded-xl border-2 border-yellow-500/30 bg-black p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              {isEditing ? (selectedCategory ? 'Editar Categoria' : 'Nova Categoria') : `Categoria: ${selectedCategory?.name}`}
            </h2>
            {!isEditing && selectedCategory && (
                      <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-1 text-sm text-yellow-400 hover:text-yellow-300"
              >
                <Edit className="h-4 w-4" />
                Editar
              </button>
            )}
                  </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Nome *</label>
              <input
                type="text"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border-2 border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-black/50 disabled:cursor-not-allowed bg-black text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Slug</label>
              <input
                type="text"
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border-2 border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-black/50 disabled:cursor-not-allowed bg-black text-white"
                placeholder="Gerado automaticamente"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={categoryForm.is_active}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  disabled={!isEditing}
                  className="w-4 h-4 text-yellow-500 border-2 border-yellow-500/30 rounded focus:ring-yellow-500 bg-black"
                />
                <span className="text-white">Ativa</span>
              </label>
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t-2 border-yellow-500/30">
              <button
                onClick={() => {
                  setIsEditing(false)
                  if (selectedCategory) handleSelectCategory(selectedCategory)
                }}
                className="px-4 py-2 text-white bg-black border-2 border-yellow-500/30 hover:border-yellow-500/50 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCategory}
                disabled={saving}
                className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
              {selectedCategory && (
                <button
                  onClick={handleDeleteCategory}
                  className="px-4 py-2 bg-red-500/20 text-red-400 border-2 border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
                >
                          <Trash2 className="h-4 w-4" />
                          Excluir
                      </button>
                )}
                    </div>
          )}
                  </div>

        {/* Seção de Subcategorias */}
        {selectedCategory && (
          <div className="rounded-xl border-2 border-yellow-500/30 bg-black p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                Subcategorias 
                {subcategories.length > 0 && (
                  <span className="text-sm text-yellow-400 ml-2">({subcategories.length})</span>
                )}
              </h3>
              <button
                onClick={handleAddSubcategory}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Adicionar Subcategoria
              </button>
            </div>


            {!subcategories || subcategories.length === 0 ? (
              <div className="text-center py-8 text-white/50">
                <List className="h-8 w-8 mx-auto mb-2 text-yellow-500/50" />
                <p className="text-sm">Nenhuma subcategoria cadastrada</p>
                <p className="text-xs mt-1">Clique em "Adicionar Subcategoria" para começar</p>
              </div>
            ) : (
              <div className="space-y-2">
                {subcategories.map((subcategory) => (
                  <div
                    key={subcategory.id}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                      selectedSubcategory?.id === subcategory.id
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : 'border-yellow-500/30 bg-black'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <List className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-semibold text-white">{subcategory.name}</p>
                        <p className="text-xs text-white/60">
                          {subcategory.productCount || 0} produtos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                <button
                        onClick={() => handleSelectSubcategory(subcategory)}
                        className="px-3 py-1 text-sm text-yellow-400 hover:text-yellow-300 border border-yellow-500/30 rounded hover:border-yellow-500/50 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={async () => {
                          const subName = subcategory.name
                          if (confirm(`Tem certeza que deseja excluir a subcategoria "${subName}"?`)) {
                            setSelectedSubcategory(subcategory)
                            await handleDeleteSubcategory()
                          }
                        }}
                        className="px-3 py-1 text-sm text-red-400 hover:text-red-300 border border-red-500/30 rounded hover:border-red-500/50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Formulário de Edição/Criação de Subcategoria */}
            {selectedSubcategory || subcategoryForm.category_id === selectedCategory?.id ? (
              <div className="mt-6 pt-6 border-t-2 border-yellow-500/30">
                <h4 className="text-md font-semibold text-white mb-4">
                  {selectedSubcategory ? 'Editar Subcategoria' : 'Nova Subcategoria'}
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Nome *</label>
                    <input
                      type="text"
                      value={subcategoryForm.name}
                      onChange={(e) => setSubcategoryForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border-2 border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-black text-white"
                      placeholder="Nome da subcategoria"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => {
                        setSelectedSubcategory(null)
                        setIsEditing(false)
                        setSubcategoryForm({
                          name: '',
                          slug: '',
                          category_id: selectedCategory?.id || '',
                          image_url: '',
                          is_active: true,
                          sort_order: 0
                        })
                      }}
                      className="px-4 py-2 text-white bg-black border-2 border-yellow-500/30 hover:border-yellow-500/50 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={async () => {
                        await handleSaveSubcategory()
                        if (selectedCategory) {
                          await loadSubcategoriesForCategory(selectedCategory.id)
                        }
                        setSelectedSubcategory(null)
                        setIsEditing(false)
                        setSubcategoryForm({
                          name: '',
                          slug: '',
                          category_id: selectedCategory?.id || '',
                          image_url: '',
                          is_active: true,
                          sort_order: 0
                        })
                      }}
                      disabled={saving}
                      className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? 'Salvando...' : 'Salvar'}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    )
  }

  function renderSubcategoryForm() {
    if (!selectedSubcategory && !isEditing) {
      return (
        <div className="flex flex-col items-center justify-center py-12 bg-black border-2 border-yellow-500/30 rounded-xl">
          <List className="h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Nenhuma subcategoria selecionada</h3>
          <p className="text-white/70 mb-4">Selecione uma subcategoria da lista para visualizar ou editar</p>
                <button
            onClick={handleAddSubcategory}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  <Plus className="h-5 w-5" />
            Adicionar Nova Subcategoria
                </button>
              </div>
      )
    }

    return (
      <div className="flex flex-col gap-6">
        <div className="rounded-xl border-2 border-yellow-500/30 bg-black p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              {isEditing ? (selectedSubcategory ? 'Editar Subcategoria' : 'Nova Subcategoria') : `Subcategoria: ${selectedSubcategory?.name}`}
            </h2>
            {!isEditing && selectedSubcategory && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-1 text-sm text-yellow-400 hover:text-yellow-300"
              >
                <Edit className="h-4 w-4" />
                Editar
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Categoria Pai *</label>
              <select
                value={subcategoryForm.category_id}
                onChange={(e) => setSubcategoryForm(prev => ({ ...prev, category_id: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border-2 border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-black/50 disabled:cursor-not-allowed bg-black text-white"
              >
                <option value="">Selecione...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
        </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Nome *</label>
              <input
                type="text"
                value={subcategoryForm.name}
                onChange={(e) => setSubcategoryForm(prev => ({ ...prev, name: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border-2 border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-black/50 disabled:cursor-not-allowed bg-black text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Slug</label>
              <input
                type="text"
                value={subcategoryForm.slug}
                onChange={(e) => setSubcategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border-2 border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-black/50 disabled:cursor-not-allowed bg-black text-white"
                placeholder="Gerado automaticamente"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={subcategoryForm.is_active}
                  onChange={(e) => setSubcategoryForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  disabled={!isEditing}
                  className="w-4 h-4 text-yellow-500 border-2 border-yellow-500/30 rounded focus:ring-yellow-500 bg-black"
                />
                <span className="text-white">Ativa</span>
              </label>
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t-2 border-yellow-500/30">
              <button
                onClick={() => {
                  setIsEditing(false)
                  if (selectedSubcategory) handleSelectSubcategory(selectedSubcategory)
                }}
                className="px-4 py-2 text-white bg-black border-2 border-yellow-500/30 hover:border-yellow-500/50 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveSubcategory}
                disabled={saving}
                className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
              {selectedSubcategory && (
                <button
                  onClick={handleDeleteSubcategory}
                  className="px-4 py-2 bg-red-500/20 text-red-400 border-2 border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </button>
              )}
            </div>
          )}
      </div>
    </div>
  )
}
}
