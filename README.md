# AL Sports - E-commerce de Roupas Esportivas

Projeto de e-commerce completo com separação clara entre front-end e back-end.

## 📁 Estrutura do Projeto

```
AlSports/
├── al-sport-frontend/      # Frontend Next.js
│   ├── app/                # Páginas e rotas (Next.js App Router)
│   ├── components/         # Componentes React reutilizáveis
│   ├── contexts/          # Contextos React (Auth, Cart, Favorites)
│   ├── hooks/             # Hooks customizados
│   ├── lib/               # Bibliotecas e utilitários
│   ├── public/            # Arquivos estáticos
│   └── tests/             # Testes automatizados
│
├── al-sport-backend/       # Backend Strapi CMS
│   ├── config/             # Configurações do Strapi
│   ├── src/                # Código fonte
│   │   ├── api/           # APIs e content types
│   │   └── admin/          # Configurações do admin
│   └── public/             # Arquivos públicos e uploads
│
├── database/               # Scripts e migrações do banco de dados
│   ├── migrations/         # Migrações SQL
│   └── scripts/            # Scripts utilitários
│
├── docs/                   # Documentação do projeto
├── scripts/                # Scripts de migração e utilitários
└── env.example             # Exemplo de variáveis de ambiente
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- PostgreSQL (para o backend Strapi)

### Frontend

```bash
cd al-sport-frontend
npm install
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

### Backend (Strapi)

```bash
cd al-sport-backend
npm install
npm run develop
```

O admin do Strapi estará disponível em `http://localhost:1337/admin`

## 🛠️ Tecnologias

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Supabase** - Autenticação e banco de dados
- **Jest** - Testes unitários
- **React Testing Library** - Testes de componentes

### Backend
- **Strapi 5** - CMS headless
- **PostgreSQL** - Banco de dados
- **TypeScript** - Tipagem estática

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

### 🎨 Painel Administrativo (Strapi)
- Gerenciamento de produtos
- Gerenciamento de categorias e subcategorias
- Gerenciamento de banners
- Gestão de pedidos
- Configurações do site

### 🧪 Testes
- Testes de autenticação
- Testes de carrinho
- Testes de checkout
- Testes de segurança
- Testes de performance

## 🔧 Scripts Disponíveis

### Frontend
```bash
cd al-sport-frontend
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Linting do código
npm run test         # Executar testes
npm run test:coverage # Testes com cobertura
```

### Backend
```bash
cd al-sport-backend
npm run develop      # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run strapi       # CLI do Strapi
```

### Scripts de Migração
```bash
# Executar do diretório raiz ou do frontend
npm run migrate:products      # Migrar produtos para o banco
npm run generate:products-sql # Gerar SQL de produtos
npm run migrate:images        # Migrar imagens
```

## 📚 Documentação

Consulte a pasta `docs/` para documentação detalhada:
- Guias de teste
- Relatórios de otimização
- Documentação de API
- Guias de desenvolvimento

## 🔐 Variáveis de Ambiente

Copie o arquivo `env.example` e configure as variáveis necessárias:

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_token
```

### Backend (.env)
```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=al_sports
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
ADMIN_JWT_SECRET=your_admin_jwt_secret
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e pertence à AL Sports.
