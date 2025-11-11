import type { StrapiApp } from '@strapi/strapi/admin';

/**
 * Extensão para personalizar o logo do painel de administração
 * 
 * Esta extensão substitui o logo padrão do Strapi pelo logo personalizado
 * da marca AL Sports.
 */
export default {
  /**
   * Registra a extensão
   */
  register(app: StrapiApp) {
    // Registrar extensão de logo
    console.log('🎨 Extensão de logo registrada');
  },

  /**
   * Aplica o logo personalizado após o bootstrap
   */
  bootstrap(app: StrapiApp) {
    // Função para aplicar o logo
    const applyLogo = () => {
      // Tentar encontrar o elemento do logo de várias formas
      const logoSelectors = [
        '[data-testid="logo"]',
        '[aria-label="Strapi logo"]',
        'a[href="/admin"]',
        '.logo',
        '[class*="logo"]',
      ];

      let logoElement: HTMLElement | null = null;

      // Tentar cada seletor
      for (const selector of logoSelectors) {
        logoElement = document.querySelector(selector) as HTMLElement;
        if (logoElement) {
          break;
        }
      }

      if (logoElement) {
        // Criar elemento de imagem para o logo
        const logoImg = document.createElement('img');
        
        // Tentar diferentes formatos de logo
        const logoPaths = [
          '/admin-assets/logo.svg',
          '/admin-assets/logo.png',
          '/admin-assets/Monograma2.png', // Logo existente
        ];
        
        let logoIndex = 0;
        logoImg.src = logoPaths[logoIndex];
        logoImg.alt = 'AL Sports';
        logoImg.style.maxHeight = '40px';
        logoImg.style.width = 'auto';
        logoImg.style.objectFit = 'contain';
        logoImg.style.display = 'block';

        // Fallback para outros formatos se o primeiro não existir
        logoImg.onerror = () => {
          logoIndex++;
          if (logoIndex < logoPaths.length) {
            logoImg.src = logoPaths[logoIndex];
          } else {
            console.warn('⚠️ Logo não encontrado. Verifique se existe em /admin-assets/');
          }
        };

        // Limpar conteúdo anterior e adicionar novo logo
        logoElement.innerHTML = '';
        logoElement.appendChild(logoImg);
        logoElement.style.display = 'flex';
        logoElement.style.alignItems = 'center';
        logoElement.style.justifyContent = 'center';

        console.log('✅ Logo personalizado aplicado com sucesso');
      } else {
        // Se não encontrar, tentar novamente após um delay
        setTimeout(applyLogo, 500);
      }
    };

    // Aplicar logo quando o DOM estiver pronto
    if (typeof window !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyLogo);
      } else {
        applyLogo();
      }

      // Observar mudanças no DOM (para quando o admin carregar dinamicamente)
      const observer = new MutationObserver(() => {
        applyLogo();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Aplicar logo periodicamente (fallback)
      const intervalId = setInterval(() => {
        const logoExists = document.querySelector('img[src*="admin-assets/logo"]');
        if (!logoExists) {
          applyLogo();
        } else {
          clearInterval(intervalId);
        }
      }, 1000);

      // Limpar intervalo após 10 segundos
      setTimeout(() => clearInterval(intervalId), 10000);
    }

    console.log('🚀 Extensão de logo inicializada');
  },
};

