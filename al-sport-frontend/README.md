# AL Sports Frontend

Frontend Next.js do e-commerce AL Sports.

## 🚀 Como Executar

### Instalação

```bash
npm install
```

### Configuração

Copie o arquivo `.env.example` para `.env.local` e configure as variáveis:

```bash
cp .env.example .env.local
```

Variáveis necessárias:
- `NEXT_PUBLIC_SUPABASE_URL` - URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave anônima do Supabase
- `NEXT_PUBLIC_STRAPI_URL` - URL do backend Strapi (padrão: http://localhost:1337)
- `STRAPI_API_TOKEN` - Token de API do Strapi

### Desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

### Build e Deploy

```bash
npm run build
npm run start
```

## 🧪 Testes

```bash
# Todos os testes
npm run test

# Testes com cobertura
npm run test:coverage

# Testes específicos
npm run test:auth
npm run test:cart
npm run test:checkout
```

## 📁 Estrutura

```
al-sport-frontend/
├── app/              # Páginas e rotas (Next.js App Router)
├── components/       # Componentes React reutilizáveis
├── contexts/         # Contextos React (Auth, Cart, Favorites)
├── hooks/            # Hooks customizados
├── lib/              # Bibliotecas e utilitários
│   ├── config/       # Configurações
│   ├── services/     # Serviços de API
│   ├── types/        # Tipos TypeScript
│   └── utils/        # Funções utilitárias
├── public/           # Arquivos estáticos
└── tests/            # Testes automatizados
```

## 🛠️ Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Supabase** - Autenticação e banco de dados
- **Jest** - Testes unitários
- **React Testing Library** - Testes de componentes

## 📝 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run lint` - Linting do código
- `npm run lint:fix` - Corrigir problemas de lint
- `npm run test` - Executar testes
- `npm run test:watch` - Testes em modo watch
- `npm run test:coverage` - Testes com cobertura
- `npm run type-check` - Verificar tipos TypeScript


