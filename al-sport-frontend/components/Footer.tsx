import Link from 'next/link'
import { getConteudosDoSite, getCategorias, getSubcategorias } from '@/lib/api'
import { transformStrapiCategoriasToCategories } from '@/lib/utils/strapi-to-app-types'
import { Phone, Mail } from 'lucide-react'
import { TABELA_MEDIDAS_CATEGORY } from '@/lib/constants/tabela-medidas-category'

/**
 * Componente Footer
 * Server Component assíncrono que busca dados do Strapi
 */
export default async function Footer() {
  // Buscar conteúdos do site e categorias do Strapi
  const [conteudos, strapiCategorias, strapiSubcategorias] = await Promise.all([
    getConteudosDoSite({ revalidate: 60 }), // Cache de 60 segundos para debug
    getCategorias({ revalidate: 3600 }), // Cache de 1 hora
    getSubcategorias({ revalidate: 3600 }) // Cache de 1 hora
  ])

  // Debug: log dos conteúdos recebidos
  if (process.env.NODE_ENV === 'development') {
    console.log('Footer - Conteúdos recebidos:', {
      conteudos: conteudos ? {
        id: conteudos.id,
        documentId: conteudos.documentId,
        publishedAt: conteudos.publishedAt,
        attributes: conteudos.attributes
      } : null
    })
  }

  // Transformar categorias
  const categories = await transformStrapiCategoriasToCategories(
    strapiCategorias,
    strapiSubcategorias
  )

  // Filtrar categorias (excluir tabela-medidas do Strapi, pois temos uma fixa)
  const displayCategories = categories.filter(category => category.slug !== 'tabela-medidas')
  
  // Adicionar categoria fixa de Tabela de Medidas
  displayCategories.push(TABELA_MEDIDAS_CATEGORY)

  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-3 mb-4">
              <span className="font-bold text-black text-sm">
                <img 
                  src="/images/Logo/Monograma2.png" 
                  alt="AL Sports Logo Completo" 
                  className="rounded-full w-60 h-60" 
                />
              </span>
            </div>
          </div>

          {/* Quick Links - Categorias */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              {displayCategories.length > 0 ? (
                displayCategories.map((category) => (
                  <li key={category.id}>
                    <Link 
                      href={`/categoria/${category.slug}`}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                // Fallback caso não haja categorias
                <>
                  <li>
                    <Link 
                      href="/produtos" 
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      Todos os Produtos
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/minha-conta" 
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      Minha Conta
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/carrinho" 
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      Carrinho
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/favoritos" 
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      Favoritos
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              {conteudos?.attributes?.TelefoneWhatsapp ? (
                <li>
                  <a
                    href={`https://wa.me/${conteudos.attributes.TelefoneWhatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <Phone size={18} />
                    <span>{conteudos.attributes.TelefoneWhatsapp}</span>
                  </a>
                </li>
              ) : null}
              {conteudos?.attributes?.EmailContato ? (
                <li>
                  <a
                    href={`mailto:${conteudos.attributes.EmailContato}`}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <Mail size={18} />
                    <span>{conteudos.attributes.EmailContato}</span>
                  </a>
                </li>
              ) : null}
              {conteudos?.attributes?.EnderecoFisico ? (
                <li className="text-gray-400">
                  {conteudos.attributes.EnderecoFisico}
                </li>
              ) : null}
              {(!conteudos || (!conteudos.attributes?.TelefoneWhatsapp && !conteudos.attributes?.EmailContato && !conteudos.attributes?.EnderecoFisico)) && (
                <li className="text-gray-400 text-sm">
                  Informações de contato não disponíveis
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 AL Mundo da bola . Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Desenvolvido por BeArts Media para o AL Mundo da Bola
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
