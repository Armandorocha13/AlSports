import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-500 text-black p-2 rounded-lg">
                <span className="font-bold text-xl">AL</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">AL Sports</h3>
                <p className="text-sm text-gray-400">Atacado Esportivo</p>
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

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Atendimento</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/sobre" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidade" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos-uso" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/trocas-devolucoes" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Trocas e Devoluções
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
                <span className="text-gray-400">(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-primary-400" />
                <span className="text-gray-400">contato@alsports.com.br</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-primary-400 mt-1" />
                <span className="text-gray-400">
                  Rua das Esportivas, 123<br />
                  São Paulo - SP, 01234-567
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
