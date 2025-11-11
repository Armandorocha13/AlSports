# 📦 Guia: Pedidos e Sincronização Strapi

## 🎯 Sistema Implementado

### Fluxo de Pedidos

```
Cliente faz pedido no site
        ↓
Salva no Supabase (banco de dados)
        ↓
Site mostra pedido em "Meus Pedidos"
        ↓
Timeline de acompanhamento em tempo real
```

### Sincronização com Strapi

```
Admin muda status no Strapi
        ↓
Lifecycle do Strapi detecta mudança
        ↓
Envia atualização para Supabase via API
        ↓
Site atualiza timeline automaticamente
```

---

## ✅ O Que Está Funcionando

1. **Checkout** - Salva pedidos no Supabase
2. **Timeline** - Mostra 6 status (Aguardando, Aprovado, Separação, Enviado, Concluído, Cancelado)
3. **Tempo Real** - Atualiza automaticamente quando há mudanças
4. **Tema Black All** - Preto/Amarelo/Branco

---

## 🔄 Como Atualizar Status do Pedido

### No Admin Strapi:

1. Acesse: `http://localhost:1337/admin`
2. Vá em **Content Manager** → **Pedido**
3. Abra o pedido
4. **IMPORTANTE:** Verifique se **"NumeroPedido"** está correto (ex: `ALS-531093754CUM`)
5. Mude **"StatusPedido"**:
   - Aguardando Pagamento
   - Pagamento Aprovado
   - Em Separação
   - Enviado
   - Concluído
   - Cancelado
6. Clique em **Save**

### No Site (Automático):

- A timeline atualiza em 2-3 segundos
- Ou recarregue a página: `F5`

---

## 📋 Campos do Pedido no Strapi

| Campo | Descrição | Preenchimento |
|-------|-----------|---------------|
| **NumeroPedido** | ID único (ALS-...) | Automático |
| **NomeCliente** | Nome completo | Do checkout |
| **Email** | Email do cliente | Do checkout |
| **Telefone** | Telefone | Do checkout |
| **Endereço** | Endereço completo | Do checkout |
| **ItensComprados** | JSON dos produtos | Do checkout |
| **ValorProdutos** | Subtotal | Do checkout |
| **ValorFrete** | Custo do frete | Do checkout |
| **ValorTotal** | Total (produtos + frete) | Calculado |
| **StatusPedido** | Status atual | Você edita |
| **CodigoRastreio** | Código dos Correios | Você adiciona |
| **Observacoes** | Notas | Automático/Manual |

---

## 🆘 Troubleshooting

### Problema: Status não atualiza no site

**Causa:** NumeroPedido no Strapi diferente do site

**Solução:**
1. No site, veja o número do pedido (ex: ALS-531093754CUM)
2. No Strapi, abra o pedido
3. Copie o número exato para o campo "NumeroPedido"
4. Save e tente mudar o status novamente

### Problema: Pedidos não aparecem no Strapi

**Solução:** O Strapi é apenas para gestão. Os pedidos ficam no Supabase.
- Para ver no Strapi, crie manualmente copiando os dados do Supabase

### Problema: Checkout travando

**Solução:** Já resolvido! O checkout não depende mais do Strapi.

---

## 📁 Arquivos Importantes

- `al-sport-backend/src/api/pedido/controllers/pedido.ts` - Controller
- `al-sport-backend/src/api/pedido/content-types/pedido/lifecycles.ts` - Sincronização
- `al-sport-backend/src/api/pedido/content-types/pedido/schema.json` - Campos
- `al-sport-frontend/contexts/CartContext.tsx` - Criação de pedidos
- `al-sport-frontend/components/OrderTimeline.tsx` - Timeline
- `app/api/orders/update-status/route.ts` - API de atualização

---

## ✨ Resumo

- ✅ Pedidos salvos no Supabase
- ✅ Timeline com 6 status
- ✅ Sincronização Strapi → Site funcional
- ✅ Tema preto/amarelo aplicado
- ✅ Checkout rápido e confiável

**Tudo funcionando!** 🎉


