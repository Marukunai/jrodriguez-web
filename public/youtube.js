/* =========================================================
   YOUTUBE.JS
   Trae automáticamente los últimos vídeos del canal usando
   la YouTube Data API v3 (gratuita, solo lectura).

   CONFIGURACIÓN (ver README.md para el paso a paso completo):
   1. Crea una API key en https://console.cloud.google.com/
      con la "YouTube Data API v3" habilitada.
   2. Restríngela por "HTTP referrers" a tu dominio de
      GitHub Pages (ej: https://tuusuario.github.io/*).
   3. Pega la key aquí abajo, en apiKey.
   ========================================================= */

const YT_CONFIG = {
  apiKey: "AIzaSyAO89nQHdPl8BIy0Cb2kP1e1jrAK4IBqTw", // TODO: pega tu API key (restringida por dominio)
  handle: "JRodriguezmusicc"    // handle del canal, sin la @
};

let _uploadsPlaylistIdCache = null;

async function ytGetUploadsPlaylistId() {
  if (_uploadsPlaylistIdCache) return _uploadsPlaylistIdCache;

  const url = `https://www.googleapis.com/youtube/v3/channels` +
    `?part=contentDetails&forHandle=${encodeURIComponent(YT_CONFIG.handle)}` +
    `&key=${YT_CONFIG.apiKey}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`YouTube API (channels): ${res.status}`);
  const data = await res.json();

  const channel = data.items && data.items[0];
  if (!channel) throw new Error("Canal no encontrado. Revisa YT_CONFIG.handle.");

  _uploadsPlaylistIdCache = channel.contentDetails.relatedPlaylists.uploads;
  return _uploadsPlaylistIdCache;
}

/**
 * Devuelve los últimos vídeos subidos al canal.
 * @param {number} maxResults - cuántos vídeos traer (máx. 50)
 * @returns {Promise<Array<{id, title, publishedAt, url}>>}
 */
async function ytGetLatestVideos(maxResults = 8) {
  const playlistId = await ytGetUploadsPlaylistId();

  const url = `https://www.googleapis.com/youtube/v3/playlistItems` +
    `?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}` +
    `&key=${YT_CONFIG.apiKey}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`YouTube API (playlistItems): ${res.status}`);
  const data = await res.json();

  return (data.items || [])
    .filter(item => item.snippet?.resourceId?.videoId)
    .map(item => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`
    }));
}