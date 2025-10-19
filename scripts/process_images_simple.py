#!/usr/bin/env python3
"""
Script simples para padronizar fundos das imagens para branco
Usa técnicas básicas de processamento de imagem
"""

import os
import sys
from PIL import Image, ImageOps
from pathlib import Path

def process_image_simple(input_path, output_path):
    """
    Processa uma imagem de forma simples para fundo branco
    """
    try:
        # Abrir a imagem
        img = Image.open(input_path)
        
        # Converter para RGB se necessário
        if img.mode in ('RGBA', 'LA'):
            # Criar fundo branco
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'RGBA':
                background.paste(img, mask=img.split()[-1])  # Usar canal alpha como máscara
            else:
                background.paste(img)
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Aplicar ajustes básicos para melhorar a qualidade
        # Aumentar contraste ligeiramente
        img = ImageOps.autocontrast(img, cutoff=1)
        
        # Salvar como JPEG com fundo branco garantido
        output_path.parent.mkdir(parents=True, exist_ok=True)
        img.save(output_path, 'JPEG', quality=95, optimize=True)
        
        print(f"✅ Processado: {input_path.name}")
        return True
        
    except Exception as e:
        print(f"❌ Erro ao processar {input_path.name}: {str(e)}")
        return False

def main():
    """
    Função principal
    """
    input_dir = Path("public/images")
    output_dir = Path("public/images_processed")
    
    print("🖼️  Processando imagens para fundo branco...")
    print(f"📁 Entrada: {input_dir}")
    print(f"📁 Saída: {output_dir}")
    print("-" * 50)
    
    if not input_dir.exists():
        print(f"❌ Diretório não encontrado: {input_dir}")
        return
    
    # Extensões suportadas
    extensions = {'.jpg', '.jpeg', '.png', '.webp', '.bmp'}
    
    processed = 0
    total = 0
    
    # Processar todas as imagens
    for file_path in input_dir.rglob('*'):
        if file_path.is_file() and file_path.suffix.lower() in extensions:
            total += 1
            
            # Calcular caminho de saída
            relative_path = file_path.relative_to(input_dir)
            output_file = output_dir / relative_path.with_suffix('.jpg')  # Sempre salvar como JPG
            
            if process_image_simple(file_path, output_file):
                processed += 1
    
    print("-" * 50)
    print(f"✅ Concluído! {processed}/{total} imagens processadas")
    print(f"📁 Resultado em: {output_dir}")

if __name__ == "__main__":
    main()
