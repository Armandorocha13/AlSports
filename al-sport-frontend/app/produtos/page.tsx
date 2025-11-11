import Image from 'next/image'
import Link from 'next/link'
import { getProdutos, getStrapiMediaUrl } from '@/lib/api'
import { StrapiProduto } from '@/lib/types'

/**
 * Página de listagem de produtos
 * React Server Component que busca dados do Strapi
 */
export default async function ProdutosPage() {
  // Buscar produtos do Strapi
  const produtos = await getProdutos({ revalidate: 60 })

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">
        {/* Cabeçalho da página */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Nossos Produtos</h1>
          <p className="text-lg text-gray-400">
            Explore nossa coleção completa de produtos esportivos
          </p>
        </div>

        {/* Lista de produtos */}
        {produtos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtos.map((produto: StrapiProduto) => {
              // Obter URL da imagem
              const imagemUrl = getStrapiMediaUrl(
                produto.attributes.Imagem1?.data || null
              )

              // Formatar preço
              const precoFormatado = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(produto.attributes.Preco)

              return (
                <Link
                  key={produto.id}
                  href={`/produto/${produto.documentId}`}
                  className="group"
                >
                  <div className="bg-gray-900 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                    {/* Imagem do produto */}
                    <div className="relative w-full h-64 bg-gray-800 overflow-hidden">
                      {imagemUrl ? (
                        <Image
                          src={imagemUrl}
                          alt={produto.attributes.Nome || 'Produto'}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-600">Sem imagem</span>
                        </div>
                      )}
                    </div>

                    {/* Informações do produto */}
                    <div className="p-4">
                      <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
                        {produto.attributes.Nome}
                      </h3>
                      <p className="text-primary-500 text-xl font-bold">
                        {precoFormatado}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}


