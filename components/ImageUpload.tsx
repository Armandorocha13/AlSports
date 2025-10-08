'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { uploadImage, resizeImage, validateImageFile, generateFileName, getPublicUrl, STORAGE_BUCKETS } from '@/lib/storage'

interface ImageUploadProps {
  bucket: keyof typeof STORAGE_BUCKETS
  path?: string
  onUpload: (url: string, path: string) => void
  onError?: (error: string) => void
  maxWidth?: number
  maxHeight?: number
  quality?: number
  className?: string
  disabled?: boolean
  preview?: string
}

export default function ImageUpload({
  bucket,
  path,
  onUpload,
  onError,
  maxWidth = 800,
  maxHeight = 600,
  quality = 0.8,
  className = '',
  disabled = false,
  preview
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(preview || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    // Validar arquivo
    const validation = validateImageFile(file)
    if (!validation.valid) {
      onError?.(validation.error!)
      return
    }

    setIsUploading(true)

    try {
      // Redimensionar imagem se necessário
      const resizedFile = await resizeImage(file, maxWidth, maxHeight, quality)

      // Gerar nome único para o arquivo
      const fileName = generateFileName(file.name, path)
      const fullPath = path ? `${path}/${fileName}` : fileName

      // Fazer upload
      const result = await uploadImage(resizedFile, STORAGE_BUCKETS[bucket], fullPath, {
        upsert: true
      })

      if (result.success) {
        setPreviewUrl(result.url)
        onUpload(result.url, result.path)
      } else {
        onError?.('Erro ao fazer upload da imagem')
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      onError?.('Erro ao processar a imagem')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (disabled) return

    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const removeImage = () => {
    setPreviewUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
          ${previewUrl ? 'border-green-300 bg-green-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="mx-auto h-32 w-32 object-cover rounded-lg"
            />
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage()
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            )}
            <p className="mt-2 text-sm text-green-600">
              Imagem carregada com sucesso!
            </p>
          </div>
        ) : (
          <div>
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                <p className="mt-2 text-sm text-gray-600">Fazendo upload...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Clique para selecionar ou arraste uma imagem
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, WebP até 5MB
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {isUploading && (
        <div className="mt-2 flex items-center text-sm text-blue-600">
          <AlertCircle size={16} className="mr-1" />
          Processando imagem...
        </div>
      )}
    </div>
  )
}
