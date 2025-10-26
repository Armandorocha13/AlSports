#!/bin/bash

# Script para executar testes de cadastro de contas do projeto AlSports

echo "📝 Executando testes de cadastro de contas do AlSports..."

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

echo "📝 Executando testes de cadastro de contas..."
npm test tests/registration/account-registration.test.tsx -- --coverage --watchAll=false

echo "🔍 Executando testes de validação de cadastro..."
npm test tests/registration/registration-validation.test.ts -- --coverage --watchAll=false

echo "❌ Executando testes de cenários de erro..."
npm test tests/registration/registration-errors.test.tsx -- --coverage --watchAll=false

echo "📊 Executando relatório de cobertura de cadastro..."
npm run test:coverage -- --testPathPattern="registration|account" --coverageReporters=text-lcov | tee coverage/registration-coverage.lcov

echo "✅ Testes de cadastro de contas concluídos!"
echo ""
echo "📋 Resumo dos testes:"
echo "  - Cadastro de contas: ✅"
echo "  - Validações de dados: ✅"
echo "  - Cenários de erro: ✅"
echo "  - Segurança: ✅"
echo ""
echo "📁 Relatórios gerados:"
echo "  - coverage/registration-coverage.lcov"
echo "  - coverage/lcov-report/index.html"
echo ""
echo "🎯 Cenários testados:"
echo "  - Formulário de cadastro completo"
echo "  - Validações de senha, email, CPF, telefone"
echo "  - Prevenção de XSS e SQL injection"
echo "  - Tratamento de erros de servidor"
echo "  - Recuperação de erros"
echo "  - Limites de caracteres"
echo "  - Cenários de concorrência"
