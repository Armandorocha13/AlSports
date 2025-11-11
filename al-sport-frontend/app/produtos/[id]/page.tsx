import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProdutoById, getStrapiMediaUrl } from '@/lib/api'
import { StrapiProduto } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'

interface ProdutoPageProps {
  params: {
    id: string
  }
}

/**
 * Página de detalhes do produto
 * React Server Component que busca dados do Strapi
 */
export default async function ProdutoPage({ params }: ProdutoPageProps) {
  // Buscar produto do Strapi
  const produto = await getProdutoById(params.id, { revalidate: 60 })

  // Se produto não encontrado, mostrar 404
  if (!produto) {
    notFound()
  }

  // Obter URLs das imagens
  const imagem1Url = getStrapiMediaUrl(produto.attributes.Imagem1?.data || null)
  const imagem2Url = getStrapiMediaUrl(produto.attributes.Imagem2?.data || null)

  // Formatar preço
  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(produto.attributes.Preco)

  // Obter variações
  // O schema do Strapi usa "Variacao" (singular) como componente repeatable
  const variacoes = (produto.attributes as any).Variacao || 
                    produto.attributes.variacoes?.data ||
                    []

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">
        {/* Botão voltar */}
        <Link
          href="/produtos"
          className="inline-flex items-center gap-2 text-gray-300 hover:text-primary-500 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Voltar para produtos</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            {/* Imagem principal */}
            {imagem1Url ? (
              <div className="relative w-full h-96 lg:h-[600px] bg-gray-800 rounded-lg overflow-hidden">
                <Image
                  src={imagem1Url}
                  alt={produto.attributes.Nome || 'Produto'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            ) : (
              <div className="w-full h-96 lg:h-[600px] bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-gray-600">Sem imagem</span>
              </div>
            )}

            {/* Imagem secundária (se existir) */}
            {imagem2Url && (
              <div className="relative w-full h-64 bg-gray-800 rounded-lg overflow-hidden">
                <Image
                  src={imagem2Url}
                  alt={`${produto.attributes.Nome} - Vista adicional`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            {/* Nome do produto */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {produto.attributes.Nome}
              </h1>
              <div className="text-3xl font-bold text-primary-500">
                {precoFormatado}
              </div>
            </div>

            {/* Descrição */}
            {produto.attributes.Descricao && (
              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-semibold text-white mb-4">Descrição</h2>
                <div className="text-gray-300 whitespace-pre-wrap">
                  {produto.attributes.Descricao}
                </div>
              </div>
            )}

            {/* Variações */}
            {variacoes.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Variações Disponíveis</h2>
                <div className="space-y-3">
                  {variacoes.map((variacao: any, index: number) => {
                    // Acessar atributos dependendo da estrutura (componente ou relação)
                    const tamanho = variacao.attributes?.Tamanho || variacao.Tamanho || ''
                    const estoque = variacao.attributes?.Estoque || variacao.Estoque || 0
                    const codigo = variacao.attributes?.Codigo || variacao.Codigo || ''
                    const variacaoId = variacao.id || variacao.documentId || index

                    return (
                      <div
                        key={variacaoId}
                        className="bg-gray-900 border border-gray-700 rounded-lg p-4"
                      >
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Tamanho:</span>
                            <p className="text-white font-semibold mt-1">
                              {tamanho}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400">Estoque:</span>
                            <p className="text-white font-semibold mt-1">
                              {estoque} unidades
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400">Código:</span>
                            <p className="text-white font-semibold mt-1">
                              {codigo}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Botão de ação */}
            <div className="pt-6">
              <button className="w-full bg-primary-500 text-black py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary-400 transition-colors">
                Entre em Contato para Comprar
              </button>
            </div>

            {/* Informações adicionais */}
            <div className="border-t border-gray-700 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <span className="text-primary-500">✓</span>
                <span>Frete grátis para pedidos acima de R$ 200</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <span className="text-primary-500">✓</span>
                <span>Produto original com garantia</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <span className="text-primary-500">✓</span>
                <span>Trocas e devoluções em até 30 dias</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

