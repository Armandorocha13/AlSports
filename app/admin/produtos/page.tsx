'use client'

import { categoriesService, type Category } from '@/lib/services/categoriesService'
import { imagesService } from '@/lib/services/imagesService'
import { productsService, type Product } from '@/lib/services/productsService'
import { subcategoriesService, type Subcategory } from '@/lib/services/subcategoriesService'
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

type ViewMode = 'products' | 'categories'

export default function ProdutosPage() {
  
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
  const [uploadingImage, setUploadingImage] = useState(false)

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
      const data = await categoriesService.getCategories()
      setCategories(data)
    } catch (error: any) {
      console.error('Erro ao carregar categorias:', error)
      alert(`Erro ao carregar categorias: ${error.message}`)
      setCategories([])
    }
  }

  // Carregar subcategorias de uma categoria específica
  const loadSubcategoriesForCategory = async (categoryId: string) => {
    try {
      const data = await subcategoriesService.getSubcategories(categoryId)
      // Manter subcategorias de outras categorias
      setSubcategories(prev => {
        const otherCategories = prev.filter(sub => sub.category_id !== categoryId)
        return [...otherCategories, ...data]
      })
    } catch (error: any) {
      console.error('Erro ao carregar subcategorias:', error)
      alert(`Erro ao carregar subcategorias: ${error.message}`)
      setSubcategories([])
    }
  }

  const loadSubcategories = async () => {
    try {
      const data = await subcategoriesService.getSubcategories()
      setSubcategories(data)
    } catch (error: any) {
      console.error('Erro ao carregar subcategorias:', error)
      alert(`Erro ao carregar subcategorias: ${error.message}`)
      setSubcategories([])
    }
  }

  const loadProducts = async () => {
    try {
      const data = await productsService.getProducts()
      setProducts(data)
    } catch (error: any) {
      console.error('Erro ao carregar produtos:', error)
      alert(`Erro ao carregar produtos: ${error.message}`)
      setProducts([])
    }
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
    // Validar campos obrigatórios
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

      const productData = {
        name: productForm.name.trim(),
        description: productForm.description?.trim() || undefined,
        category_id: productForm.category_id || undefined,
        subcategory_id: productForm.subcategory_id || undefined,
        price: parseFloat(productForm.price),
        stock_quantity: parseInt(productForm.stock_quantity) || 0,
        min_stock: parseInt(productForm.min_stock) || 0,
        max_stock: productForm.max_stock ? parseInt(productForm.max_stock) : undefined,
        sizes: productForm.sizes && productForm.sizes.length > 0 ? productForm.sizes : undefined,
        colors: productForm.colors && productForm.colors.length > 0 ? productForm.colors : undefined,
        materials: productForm.materials && productForm.materials.length > 0 ? productForm.materials : undefined,
        is_active: productForm.is_active,
        is_featured: productForm.is_featured,
        is_on_sale: productForm.is_on_sale,
        weight: productForm.weight ? parseFloat(productForm.weight) : undefined,
        sku: productForm.sku || undefined
      }

      if (selectedProduct) {
        await productsService.updateProduct(selectedProduct.id, productData)
        alert('Produto atualizado com sucesso!')
      } else {
        await productsService.createProduct(productData)
        alert('Produto criado com sucesso!')
      }

      // Recarregar dados
      await loadAllData()

      setIsEditing(false)
      setSelectedProduct(null)
      
      // Resetar formulário
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
      alert(`Erro ao salvar produto: ${error.message || 'Erro desconhecido'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!selectedProduct) {
      alert('Nenhum produto selecionado para excluir!')
      return
    }

    const productName = selectedProduct.name || 'este produto'
    if (!confirm(`Tem certeza que deseja excluir "${productName}"?\n\nEsta ação não pode ser desfeita!`)) {
      return
    }

    try {
      setSaving(true)
      await productsService.deleteProduct(selectedProduct.id)
      alert(`Produto "${productName}" excluído com sucesso!`)
      
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

      await loadAllData()
    } catch (error: any) {
      console.error('Erro ao excluir produto:', error)
      alert(`Erro ao excluir produto: ${error.message || 'Erro desconhecido'}`)
    } finally {
      setSaving(false)
    }
  }

  // CATEGORY CRUD
  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsEditing(false)
    setCategoryForm({
      name: category.name,
      slug: category.slug || '',
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
      if (!categoryForm.name || categoryForm.name.trim() === '') {
        alert('Por favor, preencha o nome da categoria!')
        return
      }

      setSaving(true)

      if (selectedCategory) {
        const updated = await categoriesService.updateCategory(selectedCategory.id, {
          name: categoryForm.name.trim()
        })
        alert('Categoria atualizada com sucesso!')
        await loadCategories()
        setSelectedCategory(updated)
      } else {
        const newCategory = await categoriesService.createCategory({
          name: categoryForm.name.trim()
        })
        alert('Categoria criada com sucesso!')
        await loadCategories()
        setTimeout(() => {
          handleSelectCategory(newCategory)
          setIsEditing(false)
        }, 500)
        return
      }

      setIsEditing(false)
    } catch (error: any) {
      console.error('Erro ao salvar categoria:', error)
      alert(`Erro ao salvar categoria: ${error.message || 'Erro desconhecido'}`)
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
      await categoriesService.deleteCategory(selectedCategory.id)
      alert(`Categoria "${categoryName}" excluída com sucesso!`)
      setSelectedCategory(null)
      setIsEditing(false)
      await loadCategories()
    } catch (error: any) {
      console.error('Erro ao excluir categoria:', error)
      alert(`Erro ao excluir categoria: ${error.message || 'Erro desconhecido'}`)
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
      is_active: subcategory.is_active,
      sort_order: subcategory.sort_order || 0
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
      if (!subcategoryForm.name || subcategoryForm.name.trim() === '') {
        alert('Por favor, preencha o nome da subcategoria!')
        return
      }

      if (!subcategoryForm.category_id) {
        alert('Selecione uma categoria pai!')
        return
      }

      setSaving(true)

      if (selectedSubcategory) {
        const updated = await subcategoriesService.updateSubcategory(selectedSubcategory.id, {
          name: subcategoryForm.name.trim(),
          category_id: subcategoryForm.category_id
        })
        alert('Subcategoria atualizada com sucesso!')
        if (selectedCategory) {
          await loadSubcategoriesForCategory(selectedCategory.id)
        } else {
          await loadSubcategories()
        }
        setSelectedSubcategory(updated)
      } else {
        const newSubcategory = await subcategoriesService.createSubcategory({
          name: subcategoryForm.name.trim(),
          category_id: subcategoryForm.category_id
        })
        alert('Subcategoria criada com sucesso!')
        if (selectedCategory) {
          await loadSubcategoriesForCategory(selectedCategory.id)
        } else {
          await loadSubcategories()
        }
        setTimeout(() => {
          handleSelectSubcategory(newSubcategory)
          setIsEditing(false)
        }, 500)
        return
      }

      setIsEditing(false)
    } catch (error: any) {
      console.error('Erro ao salvar subcategoria:', error)
      alert(`Erro ao salvar subcategoria: ${error.message || 'Erro desconhecido'}`)
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
      await subcategoriesService.deleteSubcategory(selectedSubcategory.id)
      alert(`Subcategoria "${subcategoryName}" excluída com sucesso!`)
      setSelectedSubcategory(null)
      setIsEditing(false)
      if (selectedCategory) {
        await loadSubcategoriesForCategory(selectedCategory.id)
      } else {
        await loadSubcategories()
      }
    } catch (error: any) {
      console.error('Erro ao excluir subcategoria:', error)
      alert(`Erro ao excluir subcategoria: ${error.message || 'Erro desconhecido'}`)
    }
  }

  // IMAGE HANDLERS
  const handleImageUpload = async (file: File) => {
    if (!selectedProduct) {
      alert('Selecione um produto primeiro para fazer upload de imagem')
      return
    }

    try {
      setUploadingImage(true)
      const isPrimary = !selectedProduct.images || selectedProduct.images.length === 0
      await imagesService.uploadProductImage(file, selectedProduct.id, isPrimary)
      
      // Recarregar produto com imagens atualizadas
      const updatedProduct = await productsService.getProductById(selectedProduct.id)
      if (updatedProduct) {
        setSelectedProduct(updatedProduct)
        setProductForm(prev => ({
          ...prev,
          images: updatedProduct.images || []
        }))
      }
      alert('Imagem enviada com sucesso!')
    } catch (error: any) {
      console.error('Erro ao fazer upload de imagem:', error)
      alert(`Erro ao fazer upload de imagem: ${error.message || 'Erro desconhecido'}`)
    } finally {
      setUploadingImage(false)
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
                  {isEditing && selectedProduct && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-white mb-2">Imagem Principal</label>
                      <div className="mb-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleImageUpload(file)
                            }
                          }}
                          disabled={uploadingImage}
                          className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-2 file:border-yellow-500/30 file:bg-yellow-500/10 file:text-yellow-400 hover:file:bg-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      {uploadingImage && (
                        <p className="mt-2 text-sm text-yellow-400">Fazendo upload da imagem...</p>
                      )}
                      {selectedProduct.images && selectedProduct.images.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          {selectedProduct.images.map((imgUrl, index) => (
                            <div key={index} className="relative">
                              <Image
                                src={imgUrl}
                                alt={`Imagem ${index + 1}`}
                                width={200}
                                height={200}
                                className="rounded-lg object-cover border-2 border-yellow-500/30"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
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
