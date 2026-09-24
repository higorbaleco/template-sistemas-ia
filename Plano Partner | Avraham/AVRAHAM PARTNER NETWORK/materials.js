(() => {
  const themeKey = "avraham-materials-theme";
  const body = document.body;
  const savedTheme = localStorage.getItem(themeKey);
  if (!body.dataset.themeFixed && (savedTheme === "light" || savedTheme === "dark")) body.dataset.theme = savedTheme;

  const updateThemeLabels = () => {
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const dark = body.dataset.theme === "dark";
      button.setAttribute("aria-label", dark ? "Usar tema claro" : "Usar tema escuro");
      button.innerHTML = `<i data-lucide="${dark ? "sun" : "moon"}"></i><span>${dark ? "Tema claro" : "Tema escuro"}</span>`;
    });
    if (window.lucide) window.lucide.createIcons();
  };

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      body.dataset.theme = body.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem(themeKey, body.dataset.theme);
      updateThemeLabels();
    });
  });
  updateThemeLabels();

  const slides = [...document.querySelectorAll(".slide")];
  const isPresentation = body.classList.contains("compact-deck") && slides.length > 0;

  if (isPresentation) {
    let currentIndex = Math.max(0, slides.findIndex((slide) => `#${slide.id}` === window.location.hash));
    const controls = document.createElement("div");
    controls.className = "presentation-controls";
    controls.setAttribute("aria-label", "Controles da apresentação");
    controls.innerHTML = `
      <div class="presentation-buttons">
        <button class="presentation-button" type="button" data-deck-prev aria-label="Slide anterior"><i data-lucide="chevron-left"></i></button>
      </div>
      <div class="presentation-progress">
        <span class="presentation-counter" data-deck-counter></span>
        <span class="presentation-progress-track"><span class="presentation-progress-bar" data-deck-progress></span></span>
      </div>
      <div class="presentation-buttons">
        <button class="presentation-button" type="button" data-deck-overview aria-label="Ver todos os slides"><i data-lucide="layout-grid"></i></button>
        <button class="presentation-button" type="button" data-deck-fullscreen aria-label="Apresentar em tela cheia"><i data-lucide="maximize-2"></i></button>
        <button class="presentation-button" type="button" data-deck-next aria-label="Próximo slide"><i data-lucide="chevron-right"></i></button>
      </div>`;
    body.appendChild(controls);

    const counter = controls.querySelector("[data-deck-counter]");
    const progress = controls.querySelector("[data-deck-progress]");
    const render = (index, updateHash = true) => {
      currentIndex = Math.min(Math.max(index, 0), slides.length - 1);
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === currentIndex;
        slide.classList.toggle("is-current", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
      });
      counter.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
      progress.style.width = `${((currentIndex + 1) / slides.length) * 100}%`;
      if (updateHash && slides[currentIndex].id) history.replaceState(null, "", `#${slides[currentIndex].id}`);
      document.title = `${slides[currentIndex].querySelector(".eyebrow")?.textContent || "Apresentação"} · Avraham`;
    };
    const go = (direction) => {
      if (body.classList.contains("deck-overview")) body.classList.remove("deck-overview");
      render(currentIndex + direction);
    };

    controls.querySelector("[data-deck-prev]").addEventListener("click", () => go(-1));
    controls.querySelector("[data-deck-next]").addEventListener("click", () => go(1));
    controls.querySelector("[data-deck-overview]").addEventListener("click", () => body.classList.toggle("deck-overview"));
    controls.querySelector("[data-deck-fullscreen]").addEventListener("click", () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen?.();
    });
    slides.forEach((slide, index) => slide.addEventListener("click", () => {
      if (!body.classList.contains("deck-overview")) return;
      body.classList.remove("deck-overview");
      render(index);
    }));
    document.querySelectorAll("[data-next]").forEach((button) => button.addEventListener("click", () => go(1)));
    document.querySelectorAll("[data-prev]").forEach((button) => button.addEventListener("click", () => go(-1)));
    document.addEventListener("keydown", (event) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
      if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key)) { event.preventDefault(); go(1); }
      if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) { event.preventDefault(); go(-1); }
      if (event.key === "Home") { event.preventDefault(); render(0); }
      if (event.key === "End") { event.preventDefault(); render(slides.length - 1); }
      if (event.key.toLowerCase() === "o") body.classList.toggle("deck-overview");
      if (event.key === "Escape") body.classList.remove("deck-overview");
    });
    render(currentIndex, false);
    body.classList.add("deck-ready");
  } else if (slides.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          slides.forEach((slide) => slide.classList.toggle("is-current", slide === entry.target));
          document.querySelectorAll(".deck-nav a").forEach((link) => link.classList.toggle("is-current", link.getAttribute("href") === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: "-22% 0px -58% 0px", threshold: 0 });
    slides.forEach((slide) => observer.observe(slide));
  }

  if (window.lucide) window.lucide.createIcons();
})();
