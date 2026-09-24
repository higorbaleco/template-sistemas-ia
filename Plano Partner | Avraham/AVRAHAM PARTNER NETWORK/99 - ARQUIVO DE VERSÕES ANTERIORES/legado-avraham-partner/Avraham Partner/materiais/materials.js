(() => {
  const themeKey = "avraham-materials-theme";
  const body = document.body;
  const savedTheme = localStorage.getItem(themeKey);
  if (savedTheme === "light" || savedTheme === "dark") body.dataset.theme = savedTheme;

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

  document.querySelectorAll("[data-next], [data-prev]").forEach((button) => {
    button.addEventListener("click", () => {
      const current = document.querySelector(".slide.is-current") || document.querySelector(".slide");
      if (!current) return;
      const target = button.hasAttribute("data-next") ? current.nextElementSibling : current.previousElementSibling;
      if (target && target.classList.contains("slide")) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const slides = [...document.querySelectorAll(".slide")];
  if (slides.length) {
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
