# Sitio de J Rodríguez

Sitio estático (sin backend),
adaptado a un solo artista y centrado en YouTube + Spotify.

Al ser 100% estático, **no necesita servidor**: GitHub Pages lo sirve gratis
y de forma permanente en cuanto lo actives (ver más abajo). No hay nada que
"mantener corriendo".

## Estructura

```
index.html          → página principal (hero con último vídeo, bio, redes)
novedades.html       → lista editable de vídeos/lanzamientos
public/
  styles.css        → estilos
  youtube.js         → conecta con la YouTube Data API (últimos vídeos automáticos)
  icons/             → iconos SVG (YouTube, Spotify, Instagram)
```

## Ya rellenado

- Bio, género (reggaetón romántico), canal de YouTube (@JRodriguezmusicc),
  Spotify (3jFs75YtlY7jdZasxwNYAl) e Instagram están puestos en `index.html`.
- No tiene X/Twitter, así que ese enlace se ha quitado del todo.

## Spotify: ya es automático

El panel de Spotify en `index.html` es un widget embebido oficial — lee
directamente de tu perfil de Spotify, así que las nuevas canciones/álbumes
que publiques ahí aparecen solas, sin tocar nada.

## YouTube: automático con la YouTube Data API

`novedades.html` y el vídeo de portada de `index.html` ahora se rellenan
solos con `public/youtube.js`, que consulta la YouTube Data API v3 (gratis,
de solo lectura) para traer los últimos vídeos del canal. Solo tienes que
hacer esto **una vez**:

1. Ve a [console.cloud.google.com](https://console.cloud.google.com/) y crea
   un proyecto nuevo (arriba a la izquierda → "Nuevo proyecto").
2. En el buscador de arriba escribe **"YouTube Data API v3"**, ábrela y pulsa
   **Habilitar**.
3. Ve a **APIs y servicios → Credenciales → Crear credenciales → Clave de API**.
   Se genera una key, cópiala.
4. **Importante — restringe la key** para que nadie más pueda usarla desde
   otra web: en la misma pantalla, edita la key recién creada →
   "Restricciones de la aplicación" → **Referentes HTTP (sitios web)** → añade:
   ```
   https://TU_USUARIO.github.io/*
   ```
   (sustituye por tu URL real de GitHub Pages). Y en "Restricciones de API",
   marca solo **YouTube Data API v3**.
5. Pega la key en `public/youtube.js`, en la línea:
   ```js
   apiKey: "TU_YOUTUBE_API_KEY",
   ```

Con esto, cada vez que subas un vídeo nuevo a YouTube, aparecerá solo tanto
en la portada como en "Novedades" la próxima vez que alguien visite la web —
no tienes que volver a tocar el código.

**Por qué es seguro llevar la key en el JavaScript:** al ser una web estática
no hay dónde "esconder" la key (no hay servidor). Pero como solo permite
*leer* datos públicos de YouTube (no puede publicar, borrar ni acceder a tu
cuenta), y la has restringido por dominio, lo único que alguien podría hacer
si la copiara es gastar parte de tu cuota gratuita diaria — no comprometer tu
canal. La cuota gratuita (10.000 unidades/día) da para miles de visitas
diarias, así que no debería ser un problema.

Si en algún momento la key falla o no la has puesto todavía, la web no se
rompe: se queda con el vídeo/lista de respaldo que hay en el propio código
(`FALLBACK_RELEASES` en `novedades.html`).

## Qué te queda por revisar (busca "TODO" en el código)

- Pegar tu API key en `public/youtube.js` (paso 5 de arriba).

3. **public/icons/**
   - Si más adelante quieres sustituir los SVG por logos reales, basta con
     reemplazar los archivos manteniendo el mismo nombre.

## Cómo publicarlo en GitHub Pages (queda siempre activo)

1. Crea un repositorio nuevo en GitHub (por ejemplo `jrodriguez-web`) y sube
   estos archivos a la rama `main`.
2. En el repo: **Settings → Pages**.
3. En "Build and deployment" elige **Deploy from a branch**, rama `main`,
   carpeta `/ (root)`, y pulsa **Save**.
4. Espera 1-2 minutos: GitHub te dará una URL del tipo
   `https://TU_USUARIO.github.io/jrodriguez-web/`.

Eso es todo: no hay que desplegar nada más ni pagar hosting. GitHub Pages
sirve el sitio de forma continua; cada vez que hagas `git push` con cambios
(por ejemplo, tras editar `novedades.html`), la web se actualiza sola en
1-2 minutos.

### Dominio propio (opcional)
Si en algún momento quieres un dominio tipo `jrodriguez.com` en vez de
`github.io`, en la misma pestaña **Settings → Pages** hay un campo "Custom
domain" donde lo puedes añadir.