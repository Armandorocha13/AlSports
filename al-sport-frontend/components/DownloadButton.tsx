'use client'

import { Download } from 'lucide-react'

export default function DownloadButton() {
  const handleDownload = () => {
    // Criar um link temporário para download
    const link = document.createElement('a')
    link.href = '/tabela-medidas.pdf'
    link.download = 'Tabela-de-Medidas-ALSports.pdf'
    link.click()
  }

  return (
    <button 
      onClick={handleDownload}
      className="inline-flex items-center bg-primary-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-primary-400 transition-colors duration-200"
    >
      <Download className="mr-2" size={20} />
      Baixar Tabela de Medidas (PDF)
    </button>
  )
}




