# 🔐 Como Habilitar CRUD de Pedidos no Strapi

## 🎯 Objetivo

Habilitar operações de CRUD (Create, Read, Update, Delete) na aba Pedidos do painel admin do Strapi.

---

## 🚀 Passo a Passo

### 1. Acesse o Painel Admin

```
http://localhost:1337/admin
```

### 2. Vá em Settings (Configurações)

- Na barra lateral esquerda, clique em **⚙️ Settings** (último item)

### 3. Acesse Roles & Permissions

- Em **USERS & PERMISSIONS PLUGIN**
- Clique em **Roles**

### 4. Edite o Role "Authenticated"

- Clique em **Authenticated** (usuários autenticados)
- Isso permite que usuários logados façam operações

### 5. Configure Permissões do Pedido

Role até encontrar **PEDIDO** na lista de collections.

Marque todas as caixas:

```
☑ create      (Criar novos pedidos)
☑ find        (Listar pedidos)
☑ findOne     (Ver um pedido específico)
☑ update      (Editar pedidos)
☑ delete      (Deletar pedidos)
```

### 6. Salve as Alterações

- Clique no botão **Save** no canto superior direito

---

## ✅ Verificação

Após salvar, você poderá:

### No Admin Strapi

1. **Ver Pedidos** ✅
   - Content Manager → Pedido → Lista todos

2. **Criar Pedido Manualmente** ✅
   - Botão "+ Create new entry"

3. **Editar Pedido** ✅
   - Clicar em um pedido → Editar campos → Save

4. **Deletar Pedido** ✅
   - Clicar em um pedido → Botão Delete

5. **Publicar/Despublicar** ✅
   - Toggle "Published" on/off

---

## 📝 Permissões Recomendadas

### Para Administradores (Super Admin)

✅ **Já tem todas as permissões por padrão**

### Para Authenticated (API/Frontend)

Se quiser que o frontend também possa fazer CRUD:

```
Pedido:
  ☑ create      - Criar pedidos
  ☑ find        - Listar pedidos
  ☑ findOne     - Ver pedido específico
  ☑ update      - Atualizar pedidos
  ☐ delete      - NÃO permitir deletar (segurança)
```

### Para Public (Sem autenticação)

```
Pedido:
  ☑ create      - Apenas criar (via /api/pedidos/sync)
  ☐ find        - NÃO listar publicamente
  ☐ findOne     - NÃO ver publicamente
  ☐ update      - NÃO atualizar publicamente
  ☐ delete      - NÃO deletar publicamente
```

---

## 🎨 Funcionalidades CRUD no Admin

### 1. **Create (Criar)**

- Botão: **+ Create new entry**
- Preencha os campos:
  - Nome do Cliente
  - Telefone
  - Endereço
  - Itens Comprados (JSON)
  - Valor dos Produtos
  - Valor do Frete
  - Status do Pedido
- Clique em **Save** e **Publish**

### 2. **Read (Ler)**

- **Listar:** Content Manager → Pedido
- **Ver detalhes:** Clique em um pedido da lista
- **Filtrar:** Use a busca no topo
- **Ordenar:** Clique nos headers das colunas

### 3. **Update (Atualizar)**

- Abra um pedido
- Edite qualquer campo
- Campos comuns para editar:
  - **Status do Pedido:** Mude de "Aguardando Pagamento" para "Enviado"
  - **Código de Rastreio:** Adicione o código dos Correios
  - **Observações:** Adicione notas
- Clique em **Save**

### 4. **Delete (Deletar)**

- Abra um pedido
- Role até o final
- Clique em **Delete this entry**
- Confirme a exclusão

---

## 🔒 Segurança

### Recomendações

1. **Nunca** habilitar `delete` para usuários públicos
2. **Sempre** usar autenticação para operações sensíveis
3. **Auditar** quem deleta/edita pedidos (Strapi já loga)

### Roles Sugeridos

| Role | Create | Read | Update | Delete |
|------|--------|------|--------|--------|
| **Super Admin** | ✅ | ✅ | ✅ | ✅ |
| **Authenticated** | ✅ | ✅ | ✅ | ❌ |
| **Public** | ✅* | ❌ | ❌ | ❌ |

*Public create apenas via rota customizada `/api/pedidos/sync`

---

## 🎯 Casos de Uso

### Caso 1: Atualizar Status do Pedido

1. Content Manager → Pedido
2. Clique no pedido
3. Mude **Status do Pedido** para "Enviado"
4. Adicione **Código de Rastreio**
5. Save

### Caso 2: Corrigir Dados do Cliente

1. Abra o pedido
2. Edite **Nome do Cliente**, **Telefone** ou **Endereço**
3. Save

### Caso 3: Adicionar Observações

1. Abra o pedido
2. Role até o campo de observações (se tiver)
3. Digite a nota
4. Save

### Caso 4: Cancelar Pedido

1. Abra o pedido
2. Mude **Status do Pedido** para "Cancelado"
3. Save
4. Ou delete completamente se preferir

---

## 🛠️ Troubleshooting

### Problema: Não consigo editar pedidos

**Causa:** Permissões não configuradas

**Solução:**
1. Settings → Roles → Authenticated
2. Marque as caixas de permissão do Pedido
3. Save

### Problema: Botão "Create new entry" não aparece

**Causa:** Falta permissão de `create`

**Solução:**
- Habilite a permissão `create` no role

### Problema: Não consigo deletar

**Causa:** Falta permissão de `delete`

**Solução:**
- Habilite `delete` no role (se necessário)

---

## 📊 Fluxo Completo de Gestão de Pedidos

```
1. Cliente faz pedido no site
   ↓
2. Pedido aparece no admin (Status: Aguardando Pagamento)
   ↓
3. Admin confirma pagamento
   → Muda status para "Pagamento Aprovado"
   ↓
4. Admin separa produtos
   → Muda status para "Em Separação"
   ↓
5. Admin envia pedido
   → Muda status para "Enviado"
   → Adiciona código de rastreio
   ↓
6. Cliente recebe
   → Muda status para "Concluído"
```

---

## ✅ Checklist

- [ ] Acessei Settings → Roles
- [ ] Configurei permissões do Pedido
- [ ] Testei criar um pedido manualmente
- [ ] Testei editar um pedido
- [ ] Testei atualizar status
- [ ] Testei adicionar código de rastreio
- [ ] (Opcional) Testei deletar um pedido

---

## 🎉 Resultado Final

Após configurar, você poderá:

- ✅ **Ver** todos os pedidos
- ✅ **Criar** pedidos manualmente (se necessário)
- ✅ **Editar** qualquer campo do pedido
- ✅ **Atualizar** status dos pedidos
- ✅ **Adicionar** códigos de rastreio
- ✅ **Deletar** pedidos (se habilitado)
- ✅ **Filtrar** e **buscar** pedidos
- ✅ **Ordenar** por qualquer campo

**Gestão completa de pedidos no Strapi!** 🎊

