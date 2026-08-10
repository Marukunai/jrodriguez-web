/* =========================================================
   COLLABS.JS
   Lista compartida de colaboraciones de J Rodriguez que están
   subidas en OTRO canal de YouTube (no en el suyo), por eso la
   YouTube Data API de su canal no las puede traer sola.

   La usan a la vez: la sección "Colaboraciones" de la portada,
   el ranking de "Top Canciones" (compite con vistas reales), y
   la lista de "Novedades" — todo desde este único archivo, para
   no tener que actualizar la misma info en varios sitios.

   Cómo añadir una nueva:
   1. Entra al vídeo en YouTube y comprueba que el canal que lo
      subió NO es @JRodriguezmusicc (si lo es, no hace falta
      añadirlo aquí, ya lo trae la web solo).
   2. Copia un bloque como el de abajo y rellena:
      - id: el código después de "watch?v=" en la URL
      - title: el título tal cual en YouTube
      - withArtist: el nombre del otro artista (para el aviso
        "colaboración con...")
      - publishedAt: fecha de estreno, formato AAAA-MM-DDT00:00:00Z
      - url: la URL completa del vídeo
   ========================================================= */

const MANUAL_COLLABS = [
  {
    id: "zyXEXWAJzJA",
    title: "Salamandra - JEYCI RF X J RODRIGUEZ (Audio Oficial)",
    withArtist: "Jeyci RF",
    publishedAt: "2026-05-15T00:00:00Z",
    url: "https://www.youtube.com/watch?v=zyXEXWAJzJA"
  }
];