import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="font-bold text-black text-sm">AL</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">AL Sports</h3>
                <p className="text-sm text-gray-400">Mundo da Bola</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Especializada na venda por atacado de roupas esportivas. 
              Qualidade e preços competitivos para revendedores.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
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
              <li>
                <Link href="/categoria/bermudas-shorts" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Bermudas & Shorts
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-primary-400" />
                <span className="text-gray-400">(21) 99459-5532</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-primary-400" />
                <span className="text-gray-400">contato@alsports.com.br</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-primary-400 mt-1" />
                <span className="text-gray-400">
                Cidade da Moda, 13900<br />
                  Nova iguacu - RJ - Brasil - 26015-005
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 AL Sports. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Desenvolvido com ❤️ para o atacado esportivo
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
