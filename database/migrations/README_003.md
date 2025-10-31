# Migração 003: Adicionar Política RLS para Admin Deletar Pedidos

## Problema
Quando o admin excluía um pedido no painel administrativo, o pedido ainda aparecia na aba de pedidos do cliente, mesmo após a exclusão.

## Causa
Faltava uma política RLS (Row Level Security) que permitisse ao admin deletar pedidos. O schema atual tinha políticas para SELECT, INSERT e UPDATE, mas não tinha uma política DELETE para admins.

## Solução
Esta migração adiciona a política `"Admin can delete all orders"` que permite que:
- Usuários com `user_types = 'admin'` deletem qualquer pedido
- O email autorizado `almundodabola@gmail.com` também possa deletar pedidos

## Como Aplicar

1. Acesse o Supabase Dashboard
2. Vá para SQL Editor
3. Execute o arquivo `003_add_admin_delete_order_policy.sql`

## Verificação

Após aplicar a migração, verifique se a política foi criada:

```sql
SELECT * FROM pg_policies 
WHERE tablename = 'orders' 
AND policyname = 'Admin can delete all orders';
```

## Teste

1. No painel admin, exclua um pedido
2. Verifique no console se não há erros de permissão
3. Na página de pedidos do cliente, recarregue a página
4. O pedido deletado não deve mais aparecer

