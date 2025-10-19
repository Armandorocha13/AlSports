#!/usr/bin/env python3
"""
Script para padronizar fundos das imagens para branco
Processa todas as imagens do projeto e remove fundos, deixando fundo branco
"""

import os
import sys
from PIL import Image, ImageOps
import numpy as np
from pathlib import Path

def process_image_to_white_background(input_path, output_path):
    """
    Processa uma imagem removendo o fundo e colocando fundo branco
    """
    try:
        # Abrir a imagem
        img = Image.open(input_path)
        
        # Converter para RGBA se não for
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Criar uma nova imagem com fundo branco
        white_bg = Image.new('RGB', img.size, (255, 255, 255))
        
        # Se a imagem tem transparência, usar o canal alpha
        if img.mode == 'RGBA':
            # Criar uma máscara baseada no canal alpha
            alpha = img.split()[-1]
            
            # Criar uma imagem temporária para o fundo branco
            temp = Image.new('RGB', img.size, (255, 255, 255))
            
            # Colar a imagem original sobre o fundo branco
            temp.paste(img, mask=alpha)
            img = temp
        else:
            # Se não tem transparência, tentar remover fundo baseado em cor
            # Converter para numpy para processamento
            img_array = np.array(img)
            
            # Detectar fundo (assumindo que é a cor mais comum nos cantos)
            corners = [
                img_array[0, 0],      # canto superior esquerdo
                img_array[0, -1],      # canto superior direito
                img_array[-1, 0],      # canto inferior esquerdo
                img_array[-1, -1]      # canto inferior direito
            ]
            
            # Encontrar a cor mais comum nos cantos (provavelmente o fundo)
            from collections import Counter
            corner_colors = [tuple(corner) for corner in corners]
            most_common_color = Counter(corner_colors).most_common(1)[0][0]
            
            # Criar máscara para remover o fundo
            mask = np.all(img_array == most_common_color, axis=2)
            
            # Aplicar a máscara
            img_array[mask] = [255, 255, 255]  # Fundo branco
            
            # Converter de volta para PIL
            img = Image.fromarray(img_array)
        
        # Salvar a imagem processada
        img.save(output_path, 'JPEG', quality=95)
        print(f"✅ Processado: {input_path} -> {output_path}")
        return True
        
    except Exception as e:
        print(f"❌ Erro ao processar {input_path}: {str(e)}")
        return False

def process_directory(input_dir, output_dir):
    """
    Processa todas as imagens de um diretório
    """
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    
    # Criar diretório de saída se não existir
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Extensões de imagem suportadas
    image_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff'}
    
    processed_count = 0
    total_count = 0
    
    # Processar recursivamente
    for file_path in input_path.rglob('*'):
        if file_path.is_file() and file_path.suffix.lower() in image_extensions:
            total_count += 1
            
            # Calcular caminho relativo
            relative_path = file_path.relative_to(input_path)
            output_file = output_path / relative_path
            
            # Criar diretório pai se necessário
            output_file.parent.mkdir(parents=True, exist_ok=True)
            
            # Processar a imagem
            if process_image_to_white_background(file_path, output_file):
                processed_count += 1
    
    return processed_count, total_count

def main():
    """
    Função principal
    """
    # Diretórios
    input_dir = "public/images"
    output_dir = "public/images_processed"
    
    print("🖼️  Iniciando processamento de imagens...")
    print(f"📁 Diretório de entrada: {input_dir}")
    print(f"📁 Diretório de saída: {output_dir}")
    print("-" * 50)
    
    # Verificar se o diretório de entrada existe
    if not os.path.exists(input_dir):
        print(f"❌ Diretório de entrada não encontrado: {input_dir}")
        return
    
    # Processar todas as imagens
    processed, total = process_directory(input_dir, output_dir)
    
    print("-" * 50)
    print(f"✅ Processamento concluído!")
    print(f"📊 Imagens processadas: {processed}/{total}")
    print(f"📁 Imagens processadas salvas em: {output_dir}")
    
    if processed < total:
        print(f"⚠️  {total - processed} imagens não puderam ser processadas")

if __name__ == "__main__":
    main()
