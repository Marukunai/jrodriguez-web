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

/* ---------------------------------------------------------
   Caché ligera en el navegador (localStorage).
   Evita repetir llamadas caras a la API en cada visita/recarga
   durante un rato, para no gastar cuota de más.
   --------------------------------------------------------- */
async function ytCached(key, ttlMinutes, fetchFn) {
  const storageKey = `yt_cache_${key}`;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const { data, expiresAt } = JSON.parse(raw);
      if (Date.now() < expiresAt) return data;
    }
  } catch (_) { /* localStorage no disponible: seguimos sin caché */ }

  const data = await fetchFn();

  try {
    localStorage.setItem(storageKey, JSON.stringify({
      data,
      expiresAt: Date.now() + ttlMinutes * 60 * 1000
    }));
  } catch (_) { /* si falla el guardado, no pasa nada */ }

  return data;
}

let _uploadsPlaylistIdCache = null;
let _channelIdCache = null;

async function ytGetChannelInfo() {
  if (_uploadsPlaylistIdCache && _channelIdCache) {
    return { uploadsPlaylistId: _uploadsPlaylistIdCache, channelId: _channelIdCache };
  }

  const url = `https://www.googleapis.com/youtube/v3/channels` +
    `?part=contentDetails&forHandle=${encodeURIComponent(YT_CONFIG.handle)}` +
    `&key=${YT_CONFIG.apiKey}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`YouTube API (channels): ${res.status}`);
  const data = await res.json();

  const channel = data.items && data.items[0];
  if (!channel) throw new Error("Canal no encontrado. Revisa YT_CONFIG.handle.");

  _uploadsPlaylistIdCache = channel.contentDetails.relatedPlaylists.uploads;
  _channelIdCache = channel.id;
  return { uploadsPlaylistId: _uploadsPlaylistIdCache, channelId: _channelIdCache };
}

async function ytGetUploadsPlaylistId() {
  const { uploadsPlaylistId } = await ytGetChannelInfo();
  return uploadsPlaylistId;
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

/**
 * Top vídeos del canal por número de reproducciones.
 * Mira hasta los últimos 50 vídeos subidos y devuelve los N con más vistas.
 * Cacheado 45 min: es una llamada algo más cara (dos peticiones).
 * @param {number} maxResults - cuántos poner en el ranking (ej. 3)
 */
async function ytGetTopVideosByViews(maxResults = 3) {
  return ytCached(`top_views_${maxResults}`, 45, async () => {
    const playlistId = await ytGetUploadsPlaylistId();

    const listUrl = `https://www.googleapis.com/youtube/v3/playlistItems` +
      `?part=snippet&playlistId=${playlistId}&maxResults=50` +
      `&key=${YT_CONFIG.apiKey}`;
    const listRes = await fetch(listUrl);
    if (!listRes.ok) throw new Error(`YouTube API (playlistItems): ${listRes.status}`);
    const listData = await listRes.json();

    const ids = (listData.items || [])
      .map(item => item.snippet?.resourceId?.videoId)
      .filter(Boolean);
    if (!ids.length) return [];

    const statsUrl = `https://www.googleapis.com/youtube/v3/videos` +
      `?part=snippet,statistics&id=${ids.join(",")}` +
      `&key=${YT_CONFIG.apiKey}`;
    const statsRes = await fetch(statsUrl);
    if (!statsRes.ok) throw new Error(`YouTube API (videos): ${statsRes.status}`);
    const statsData = await statsRes.json();

    return (statsData.items || [])
      .map(item => ({
        id: item.id,
        title: item.snippet.title,
        views: parseInt(item.statistics?.viewCount || "0", 10),
        url: `https://www.youtube.com/watch?v=${item.id}`
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, maxResults);
  });
}

/**
 * Próximos estrenos programados en el canal (vídeos "Premiere" con
 * fecha futura). Devuelve [] si no hay ninguno.
 * Cacheado 30 min: usa search.list, que es la llamada más cara de la API.
 */
async function ytGetUpcomingPremieres() {
  return ytCached("upcoming_premieres", 30, async () => {
    const { channelId } = await ytGetChannelInfo();

    const searchUrl = `https://www.googleapis.com/youtube/v3/search` +
      `?part=snippet&channelId=${channelId}&type=video&eventType=upcoming` +
      `&order=date&key=${YT_CONFIG.apiKey}`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) throw new Error(`YouTube API (search): ${searchRes.status}`);
    const searchData = await searchRes.json();

    const ids = (searchData.items || [])
      .map(item => item.id?.videoId)
      .filter(Boolean);
    if (!ids.length) return [];

    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos` +
      `?part=snippet,liveStreamingDetails&id=${ids.join(",")}` +
      `&key=${YT_CONFIG.apiKey}`;
    const detailsRes = await fetch(detailsUrl);
    if (!detailsRes.ok) throw new Error(`YouTube API (videos): ${detailsRes.status}`);
    const detailsData = await detailsRes.json();

    return (detailsData.items || [])
      .filter(item => item.liveStreamingDetails?.scheduledStartTime)
      .map(item => ({
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        scheduledStartTime: item.liveStreamingDetails.scheduledStartTime,
        url: `https://www.youtube.com/watch?v=${item.id}`
      }))
      .sort((a, b) => new Date(a.scheduledStartTime) - new Date(b.scheduledStartTime));
  });
}