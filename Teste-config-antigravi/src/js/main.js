document.addEventListener("DOMContentLoaded", () => {
  const nosSvg = document.querySelectorAll(".no-mindmap");
  const painelDetalhes = document.getElementById("painel-detalhes-conteudo");

  // Função para renderizar os detalhes do nó selecionado
  const renderizarDetalhes = (chaveConceito) => {
    try {
      // obterNo vem do arquivo mindmap.js no escopo global do navegador
      const dados = obterNo(chaveConceito);

      // Limpar e reconstruir o painel com HTML semântico e acessível
      let praticasHTML = "";
      dados.boasPraticas.forEach(pratica => {
        praticasHTML += `<li class="detalhes-pratica-item">${pratica}</li>`;
      });

      // Sanitização conceitual e montagem de HTML seguro
      painelDetalhes.innerHTML = `
        <div class="detalhes-header">
          <h3 class="detalhes-titulo">${dados.titulo}</h3>
          <span class="detalhes-subtitulo">${dados.subtitulo}</span>
        </div>
        <div class="detalhes-corpo">
          <p>${dados.descricao}</p>
          
          <h4 class="detalhes-secao-titulo" style="margin-top: 24px;">Recomendação Prática</h4>
          <p style="font-size: 14px; margin-bottom: 16px; color: #B3B3C6;">${dados.exemplo}</p>
          
          <div class="detalhes-codigo-container">
            <pre class="detalhes-codigo"><code>${escapeHTML(dados.codigo)}</code></pre>
          </div>
          
          <h4 class="detalhes-secao-titulo" style="margin-top: 24px;">Boas Práticas</h4>
          <ul class="detalhes-pratica-lista">
            ${praticasHTML}
          </ul>
        </div>
      `;

      // Anunciar alteração para leitores de tela
      painelDetalhes.setAttribute("aria-live", "polite");

    } catch (erro) {
      console.error(erro);
      painelDetalhes.innerHTML = `<p style="color: #FF3D00;">Erro ao carregar informações do conceito.</p>`;
    }
  };

  // Função utilitária para evitar injeção de HTML no painel de códigos
  const escapeHTML = (stringSuja) => {
    return stringSuja
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Gerenciamento de eventos de clique nos nós do SVG
  nosSvg.forEach(no => {
    const chave = no.getAttribute("data-conceito");

    // Clique do mouse
    no.addEventListener("click", () => {
      ativarNo(no, chave);
    });

    // Acessibilidade: ativação via teclado (Enter ou Space)
    no.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter" || event.key === " ") {
        evento.preventDefault();
        ativarNo(no, chave);
      }
    });
  });

  const activarNo = (noElemento, chave) => {
    // Remover classe ativo de todos os nós
    nosSvg.forEach(n => {
      n.classList.remove("ativo");
      n.setAttribute("aria-selected", "false");
    });

    // Ativar o nó selecionado
    noElemento.classList.add("ativo");
    noElemento.setAttribute("aria-selected", "true");

    // Renderizar detalhes correspondentes
    renderizarDetalhes(chave);
  };

  // Inicializar selecionando o primeiro nó ("agentes") por padrão
  const noInicial = document.querySelector('.no-mindmap[data-conceito="agentes"]');
  if (noInicial) {
    activarNo(noInicial, "agentes");
  }
});
