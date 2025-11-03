# Scripts de Manutenção do Banco de Dados

## find-unused-tables

Script para identificar tabelas não utilizadas no banco de dados.

### Como usar:

1. **Script TypeScript (automático)**:
   ```bash
   npm run find:unused-tables
   ```
   
   Este script:
   - Analisa o código-fonte para encontrar todas as referências a tabelas
   - Lê o arquivo `database/schema.sql` para listar tabelas definidas
   - Identifica tabelas que não estão sendo usadas
   - Gera um script SQL em `database/scripts/delete_unused_tables.sql`

2. **Script SQL manual (simples)**:
   
   Execute `database/scripts/find-unused-tables-simple.sql` no SQL Editor do Supabase para:
   - Listar todas as tabelas do schema `public`
   - Verificar dependências
   - Comparar manualmente com as tabelas usadas no código

### ⚠️ IMPORTANTE:

- **Sempre faça backup** antes de deletar tabelas
- Revise cuidadosamente o script SQL gerado
- Verifique se as tabelas não são usadas por:
  - Triggers
  - Stored procedures
  - Views
  - Jobs agendados

### Tabelas que sempre são mantidas:

- `profiles`
- `addresses`
- `products`
- `product_images`
- `orders`
- `order_items`
- `order_status_history`
- `payments`
- `whatsapp_orders`
- `settings`
- `categorias`
- `subcategorias`

Essas tabelas são consideradas essenciais para o funcionamento do sistema.

