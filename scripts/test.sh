#!/bin/bash

# Script para executar testes do projeto AlSports

echo "🧪 Executando testes do projeto AlSports..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale o Node.js primeiro."
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Instale o npm primeiro."
    exit 1
fi

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Executar testes de linting
echo "🔍 Executando ESLint..."
npm run lint

# Executar testes de TypeScript
echo "🔧 Verificando tipos TypeScript..."
npx tsc --noEmit

# Executar testes unitários
echo "🧪 Executando testes unitários..."
npm test -- --coverage --watchAll=false

# Executar testes de integração (se existirem)
if [ -d "tests/integration" ]; then
    echo "🔗 Executando testes de integração..."
    npm run test:integration
fi

# Executar testes de segurança
echo "🔒 Executando testes de segurança..."
npm run test:security

# Executar testes de performance
echo "⚡ Executando testes de performance..."
npm run test:performance

echo "✅ Todos os testes foram executados com sucesso!"

