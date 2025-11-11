# 🎨 Como Usar a Extensão de Logo

## ✅ Extensão Criada

A extensão de logo foi criada em:
```
src/admin/extensions/logo/index.tsx
```

## 🚀 Como Funciona

### Método 1: Configuração Direta (Recomendado)

O arquivo `src/admin/app.tsx` já está configurado para usar o logo diretamente:

```typescript
config: {
  auth: {
    logo: '/admin-assets/Monograma2.png', // Logo na tela de login
  },
  menu: {
    logo: '/admin-assets/Monograma2.png', // Logo no menu lateral
  },
}
```

**Vantagens:**
- ✅ Mais simples
- ✅ Funciona automaticamente
- ✅ Não precisa de código adicional

### Método 2: Extensão Customizada

A extensão em `src/admin/extensions/logo/index.tsx` oferece controle mais avançado:

**Vantagens:**
- ✅ Mais controle sobre quando e como aplicar o logo
- ✅ Pode aplicar em múltiplos lugares
- ✅ Pode adicionar lógica customizada

## 📋 Arquivos de Logo

A extensão procura o logo na seguinte ordem:

1. `/admin-assets/logo.svg` (prioridade)
2. `/admin-assets/logo.png`
3. `/admin-assets/Monograma2.png` (já existe)

## 🔧 Como Aplicar

### Passo 1: Adicionar Logo

Coloque seu logo em uma das opções:
- `public/admin-assets/logo.svg` (recomendado)
- `public/admin-assets/logo.png`
- Ou use o existente: `public/admin-assets/Monograma2.png`

### Passo 2: Atualizar Caminho (se necessário)

Se usar um nome diferente, edite `src/admin/app.tsx`:

```typescript
menu: {
  logo: '/admin-assets/SEU_LOGO.png',
}
```

### Passo 3: Iniciar Servidor

```bash
cd al-sport-backend
npm run develop
```

### Passo 4: Verificar

1. Acesse: `http://localhost:1337/admin`
2. O logo deve aparecer no menu lateral
3. O logo também aparece na tela de login

## 🎯 Onde o Logo Aparece

- ✅ **Menu lateral** (esquerda)
- ✅ **Tela de login**
- ✅ **Header do admin** (se configurado)

## 🔍 Troubleshooting

### Logo não aparece?

1. **Verifique o caminho:**
   - O arquivo existe em `public/admin-assets/`?
   - O nome do arquivo está correto?

2. **Verifique o console:**
   - Abra o console do navegador (F12)
   - Procure por erros 404 (arquivo não encontrado)

3. **Reinicie o Strapi:**
   ```bash
   # Pare o servidor (Ctrl + C)
   npm run develop
   ```

4. **Rebuild (se necessário):**
   ```bash
   npm run build
   npm run develop
   ```

### Logo aparece muito grande/pequeno?

Edite `src/admin/extensions/logo/index.tsx`:

```typescript
logoImg.style.maxHeight = '50px'; // Ajuste o tamanho
logoImg.style.width = 'auto';
```

## 📝 Notas

- A extensão usa `Monograma2.png` como fallback se outros logos não existirem
- O logo é aplicado automaticamente quando o admin carrega
- A extensão tenta múltiplos seletores para encontrar o elemento do logo
- Logs no console ajudam a diagnosticar problemas

## ✅ Checklist

- [x] Extensão criada em `src/admin/extensions/logo/index.tsx`
- [x] Configuração adicionada em `src/admin/app.tsx`
- [x] Logo `Monograma2.png` já existe em `public/admin-assets/`
- [ ] Logo personalizado adicionado (opcional)
- [ ] Servidor iniciado (`npm run develop`)
- [ ] Logo visível no admin



