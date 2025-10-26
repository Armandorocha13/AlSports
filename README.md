# AL Sports - E-commerce de Roupas Esportivas

## 📁 Estrutura do Projeto

```
AlSports/
├── app/                    # Páginas e rotas da aplicação
├── components/            # Componentes React reutilizáveis
├── contexts/              # Contextos React (Auth, Cart, Favorites)
├── hooks/                 # Hooks customizados
├── lib/                   # Bibliotecas e utilitários
├── public/                # Arquivos estáticos
├── tests/                 # Testes
├── docs/                  # Documentação
└── [arquivos de config]   # Configurações do projeto
```

## 🚀 Como Executar

### Instalação Inicial
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```

### Build e Deploy
```bash
npm run build
npm run start
```

### Testes
```bash
# Todos os testes
npm run test

# Testes com cobertura
npm run test:coverage

# Testes específicos
npm run test:auth
npm run test:cart
npm run test:admin
```

## 🛠️ Tecnologias

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Supabase** - Autenticação e banco de dados
- **Jest** - Testes unitários
- **React Testing Library** - Testes de componentes

### Backend
- **Supabase** - Backend-as-a-Service
- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Zod** - Validação de dados
- **Nodemailer** - Envio de emails

## 📋 Funcionalidades

### 🛒 E-commerce
- Catálogo de produtos por categoria
- Carrinho de compras
- Sistema de favoritos
- Checkout completo
- Cálculo de frete

### 👤 Autenticação
- Login e registro
- Recuperação de senha
- Perfil do usuário
- Middleware de proteção

### 🎨 Painel Administrativo
- Dashboard com estatísticas
- Gerenciamento de produtos
- Gerenciamento de categorias
- Configurações de aparência
- Gestão de pedidos

### 🧪 Testes
- Testes de autenticação
- Testes de carrinho
- Testes de checkout
- Testes de segurança
- Testes de performance

## 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run lint` - Linting do código
- `npm run test` - Executar testes
- `npm run test:coverage` - Testes com cobertura

## 📚 Documentação

Consulte a pasta `docs/` para documentação detalhada:
- Guias de teste
- Relatórios de otimização
- Documentação de API
- Guias de desenvolvimento

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e pertence à AL Sports.