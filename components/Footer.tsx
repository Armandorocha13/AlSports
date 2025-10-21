import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-3 mb-4">
            <span className="font-bold text-black text-sm"><img src="/images/Logo/Monograma2.png" alt="AL Sports Logo Completo" className="rounded-full w-60 h-60" /></span>
            </div>
            
            
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categorias</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/categoria/futebol" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Futebol
                </Link>
              </li>
              <li>
                <Link href="/categoria/roupas-treino" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Roupas de Treino
                </Link>
              </li>
              <li>
                <Link href="/categoria/nba" className="text-gray-400 hover:text-white transition-colors duration-200">
                  NBA
                </Link>
              </li>
              <li>
                <Link href="/categoria/conjuntos-infantis" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Conjuntos Infantis
                </Link>
              </li>
              <li>
                <Link href="/categoria/acessorios" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Acessórios
                </Link>
              </li>
             
            </ul>
          </div>

          {/* Additional Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Informações</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/categoria/tabela-medidas" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Tabela de Medidas
                </Link>
              </li>
              <li>
                <Link href="/minha-conta" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Minha Conta
                </Link>
              </li>
              <li>
                <Link href="/carrinho" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Carrinho
                </Link>
              </li>
              
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
