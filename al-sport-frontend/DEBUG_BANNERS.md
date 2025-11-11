# Debug de Banners - Guia de Troubleshooting

## Problema
O banner cadastrado no Strapi não está aparecendo no site.

## Passos para Debug

### 1. Verificar Console do Navegador
1. Abra o site em `http://localhost:3000`
2. Pressione F12 para abrir DevTools
3. Vá para a aba "Console"
4. Procure por logs que começam com:
   - `getBanners - Resposta do Strapi:`
   - `getBanners - Banners normalizados:`
   - `Filtro Topo-Home - Banner:`
   - `transformStrapiBannerToAppBanner - Banner recebido:`
   - `BannerCarousel - Banners recebidos:`

### 2. Verificar Network Tab
1. No DevTools, vá para a aba "Network"
2. Recarregue a página (F5)
3. Procure por uma requisição para `/api/banners` ou similar
4. Clique na requisição e verifique:
   - Status code (deve ser 200)
   - Response (deve conter os banners)

### 3. Verificar Variáveis de Ambiente
Certifique-se de que o arquivo `.env.local` contém:
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=seu_token_aqui (se necessário)
```

### 4. Testar API Diretamente
Abra no navegador:
```
http://localhost:1337/api/banners?populate=*
```

Deve retornar um JSON com os banners.

### 5. Verificar no Strapi
- Banner está marcado como "Published"?
- Campo "Local" está configurado como "Topo-Home"?
- ImagemDesktop ou ImagemMobile está cadastrada?

## Logs Esperados

Se tudo estiver funcionando, você deve ver no console:

```
getBanners - Resposta do Strapi: {...}
getBanners - Banners normalizados: 1 [{ id: ..., local: "Topo-Home", ... }]
Filtro Topo-Home - Banner: { id: ..., local: "Topo-Home", publishedAt: "...", passa: true }
transformStrapiBannerToAppBanner - Banner recebido: {...}
transformStrapiBannerToAppBanner - URL desktop obtida: http://localhost:1337/...
HomePage - Banners finais: { totalStrapiBanners: 1, topBanners: 1, ... }
BannerCarousel - Banners recebidos: 1 [{ id: ..., image: "..." }]
```

## Problemas Comuns

1. **Banner não aparece no console**: API não está retornando dados
   - Verifique se o Strapi está rodando
   - Verifique a URL do Strapi nas variáveis de ambiente

2. **Banner aparece mas é filtrado**: 
   - Verifique se `publishedAt` não é null
   - Verifique se `Local === "Topo-Home"`

3. **Banner aparece mas sem imagem**:
   - Verifique se a URL da imagem está sendo gerada corretamente
   - Verifique se a imagem existe no Strapi

4. **Banner aparece mas não renderiza**:
   - Verifique se a URL da imagem é acessível
   - Verifique se há erros no console relacionados a CORS ou imagens



