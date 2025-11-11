# Como Cadastrar Variações (Tamanhos) no Strapi

## Passo a Passo

### 1. Acesse o Produto no Strapi
1. Vá para **Content Manager** → **Produtos**
2. Clique no produto que deseja adicionar variações

### 2. Adicione Variações
1. Role até a seção **"Variacao"** (ou "Variações")
2. Clique no botão **"+ Add an entry"** ou **"+ Adicionar entrada"**
3. Preencha os campos:
   - **Tamanho**: Ex: "P", "M", "G", "GG", "38", "40", "42", etc.
   - **Código**: (Opcional) Código do produto para este tamanho
   - **Estoque**: Quantidade disponível em estoque (número inteiro)

### 3. Adicione Múltiplas Variações
- Clique em **"+ Add an entry"** novamente para adicionar mais tamanhos
- Exemplo:
  - Variação 1: Tamanho "P", Estoque 10
  - Variação 2: Tamanho "M", Estoque 15
  - Variação 3: Tamanho "G", Estoque 8
  - Variação 4: Tamanho "GG", Estoque 5

### 4. Salve e Publique
1. Clique em **"Save"** para salvar
2. Clique em **"Publish"** para publicar o produto
3. ⚠️ **IMPORTANTE**: As variações só aparecerão no site se o produto estiver **Publicado**

## Estrutura do Componente

O componente de variações tem os seguintes campos:
- **Tamanho** (obrigatório): String - Ex: "P", "M", "G", "38", "40"
- **Código** (opcional): String - Código do produto
- **Estoque** (obrigatório): Integer - Quantidade em estoque (mínimo 0)

## Exemplo de Uso

Para um produto de camisa:
- Variação 1: Tamanho "P", Estoque 10, Código "CAM-001-P"
- Variação 2: Tamanho "M", Estoque 15, Código "CAM-001-M"
- Variação 3: Tamanho "G", Estoque 8, Código "CAM-001-G"
- Variação 4: Tamanho "GG", Estoque 5, Código "CAM-001-GG"

## Notas Importantes

- ⚠️ O produto **deve estar publicado** para as variações aparecerem no site
- ⚠️ Cada variação precisa ter pelo menos **Tamanho** e **Estoque** preenchidos
- ⚠️ Os tamanhos aparecerão automaticamente na página do produto e no modal de detalhes
- ⚠️ Se não aparecer, verifique se o produto está publicado e recarregue a página do site (Ctrl+F5)


