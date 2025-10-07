# AL Sports - E-commerce de Atacado Esportivo

Uma plataforma completa de e-commerce desenvolvida com Next.js 14, especializada na venda por atacado de roupas esportivas.

## 🚀 Características

- **Design Responsivo**: Otimizado para todos os dispositivos
- **Navegação Intuitiva**: 6 categorias principais com subcategorias organizadas
- **Carrinho de Compras**: Sistema completo com persistência local
- **Preços de Atacado**: Foco em revendedores com preços especiais
- **Interface Moderna**: Design limpo e profissional

## 📋 Categorias Disponíveis

### 1. FUTEBOL
- Lançamento (25/26)
- Temporada 24/25
- Temporada 23/24
- Versão Jogador
- Retrô
- Versão Feminina
- Regatas
- Promoção
- Pedido Extra (R$1,00)

### 2. ROUPAS DE TREINO
- Agasalho Completo
- Calça
- Casaco
- Camisa + Short
- Regata + Short
- Corta Vento
- Promoção
- Conjunto Time Chinês (Kit Europeu/Brasileiro)

### 3. NBA
- NBA Silk
- NBA Bordada

### 4. CONJUNTOS INFANTIS
- Kit Infantil 25/26
- Kit Infantil 24/25
- Kit Infantil Retrô
- Kit Infantil 23/24
- Promoção

### 5. ACESSÓRIOS
- NFL (Camisas)
- Bonés Times
- Bonés Casuais
- Meias Times
- Meias Casuais

### 6. BERMUDAS & SHORTS
- Short Masculino
- Short Feminino

## 🛠️ Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Lucide React** - Ícones modernos
- **Framer Motion** - Animações suaves

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd al-sports-ecommerce
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🏗️ Estrutura do Projeto

```
al-sports-ecommerce/
├── app/                    # App Router do Next.js
│   ├── categoria/         # Páginas de categorias
│   ├── produto/           # Páginas de produtos
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Homepage
│   └── not-found.tsx      # Página 404
├── components/            # Componentes reutilizáveis
│   ├── Header.tsx         # Cabeçalho com navegação
│   ├── Footer.tsx         # Rodapé
│   ├── ProductCard.tsx    # Card de produto
│   ├── CategoryCard.tsx   # Card de categoria
│   └── Cart.tsx           # Carrinho de compras
├── hooks/                 # Hooks customizados
│   └── useCart.ts         # Hook do carrinho
├── lib/                   # Utilitários e dados
│   └── data.ts            # Dados das categorias e produtos
└── public/                # Arquivos estáticos
```

## 🎨 Funcionalidades Principais

### Navegação
- Menu principal com 6 categorias
- Páginas dedicadas para cada categoria
- Grid de subcategorias em cada página
- Breadcrumbs para navegação

### Produtos
- Cards de produtos com informações completas
- Páginas de detalhe com galeria de imagens
- Sistema de tamanhos
- Preços de atacado destacados

### Carrinho
- Adicionar/remover produtos
- Ajustar quantidades
- Cálculo automático de frete
- Persistência no localStorage
- Entrega rápida e segura

### Design Responsivo
- Mobile-first approach
- Breakpoints otimizados
- Menu mobile com hamburger
- Grid responsivo para produtos

## 🚀 Deploy

Para fazer o deploy em produção:

1. Build do projeto:
```bash
npm run build
```

2. Inicie o servidor de produção:
```bash
npm start
```

## 📱 Responsividade

O projeto foi desenvolvido com foco em responsividade:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎯 Próximos Passos

- [ ] Integração com sistema de pagamento
- [ ] Sistema de autenticação de usuários
- [ ] Painel administrativo
- [ ] Sistema de estoque
- [ ] Relatórios de vendas
- [ ] Integração com APIs de frete

## 📞 Contato

Para dúvidas ou sugestões, entre em contato:

- **Email**: contato@alsports.com.br
- **Telefone**: (11) 99999-9999

## 📄 Licença

Este projeto é propriedade da AL Sports e está protegido por direitos autorais.

---

Desenvolvido com ❤️ para o atacado esportivo brasileiro.
