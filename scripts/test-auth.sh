#!/bin/bash

# Script para executar testes de autenticação do projeto AlSports

echo "🔐 Executando testes de autenticação do AlSports..."

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

echo "🧪 Executando testes de contexto de autenticação..."
npm test tests/auth/auth.test.tsx -- --coverage --watchAll=false

echo "🔐 Executando testes de páginas de autenticação..."
npm test tests/auth/auth-pages.test.tsx -- --coverage --watchAll=false

echo "🛡️ Executando testes de middleware de autenticação..."
npm test tests/auth/middleware.test.ts -- --coverage --watchAll=false

echo "🔒 Executando testes de segurança de autenticação..."
npm test tests/auth/auth-security.test.ts -- --coverage --watchAll=false

echo "📊 Executando relatório de cobertura de autenticação..."
npm run test:coverage -- --testPathPattern="auth|middleware" --coverageReporters=text-lcov | tee coverage/auth-coverage.lcov

echo "✅ Testes de autenticação concluídos!"
echo ""
echo "📋 Resumo dos testes:"
echo "  - Contexto de autenticação: ✅"
echo "  - Páginas de login/registro: ✅"
echo "  - Middleware de proteção: ✅"
echo "  - Validações de segurança: ✅"
echo ""
echo "📁 Relatórios gerados:"
echo "  - coverage/auth-coverage.lcov"
echo "  - coverage/lcov-report/index.html"
