/* =========================================================
   NAV.JS — abre/cierra el menú en móvil (botón hamburguesa)
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  const mobileQuery = window.matchMedia("(max-width: 720px)");
  const links = nav.querySelectorAll("a");

  // En móvil, cuando el menú está cerrado, sus enlaces no deben poder
  // recibir foco por teclado (aunque estén técnicamente en la página,
  // están ocultos visualmente — si no, Tab "salta" a algo invisible).
  function syncFocusability() {
    const shouldHide = mobileQuery.matches && !nav.classList.contains("open");
    links.forEach((link) => {
      if (shouldHide) link.setAttribute("tabindex", "-1");
      else link.removeAttribute("tabindex");
    });
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    syncFocusability();
  });

  // Cierra el menú al pulsar un enlace (para que no se quede abierto
  // al cambiar de página en móvil).
  links.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      syncFocusability();
    });
  });

  mobileQuery.addEventListener("change", syncFocusability);
  syncFocusability();
});