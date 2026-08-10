# Guía rápida — cómo funciona y se mantiene esta web

Esto NO es documentación de código (para eso está `README.md`). Esto es
una "chuleta" en español normal: qué hacer en el día a día, y qué hacer si
algo falla.

---

## 1. Lo que ya funciona solo (no toques nada)

- **Nuevo vídeo en YouTube** → aparece solo en la portada y en Novedades
  en 1-2 minutos. No hay que editar ningún archivo.
- **Nueva canción/álbum en Spotify** → aparece solo en el reproductor de
  la portada.
- **Vídeo programado como "Estreno" con fecha futura en YouTube** →
  aparece solo como aviso en Novedades con cuenta atrás.
- **Ranking de Top Canciones** → se recalcula solo según las vistas de
  YouTube.

Si algo de esto no aparece, casi siempre es la API key de YouTube (ver
sección 4).

---

## 2. Dónde entrar para ver cosas

| Qué quiero ver | Dónde | Cómo entro |
|---|---|---|
| Cuánta gente visita la web | `jrodriguezweb.goatcounter.com` | Con tu usuario/contraseña de GoatCounter |
| Mensajes de Contacto (booking, colabs, prensa) | `formspree.io` → formulario "Contacto J Rodriguez" → pestaña Submissions | Con tu cuenta de Formspree (mmape2003@gmail.com) |
| Gente apuntada a la Newsletter | `formspree.io` → formulario "Newsletter J Rodriguez" → pestaña Submissions | Misma cuenta de Formspree |
| El código de la web | `github.com/Marukunai/jrodriguez-web` | Con tu cuenta de GitHub |

Los mensajes de Contacto y las altas de Newsletter también te llegan
directo por email a **marukunai03@gmail.com**, así que no hace falta
entrar a Formspree salvo que quieras revisar el historial completo.

---

## 3. Cómo dar de baja a alguien de la newsletter

No hay lista automática — es manual. Cuando alguien te escriba pidiendo
la baja (o pulse el enlace de "darme de baja" de la propia web, que te
manda un email), simplemente no le vuelvas a incluir la próxima vez que
mandes un aviso por email a la gente apuntada.

---

## 4. Si algo deja de funcionar

**El vídeo de portada o "Novedades" no se actualiza / sale un vídeo
antiguo fijo:**
→ Casi siempre es la API key de YouTube. Puede caducar, quedarse sin
cuota, o haberse borrado sin querer del archivo `public/youtube.js`.
Revisa la línea `apiKey:` en ese archivo — debe tener una key real entre
comillas, no el texto `TU_YOUTUBE_API_KEY`.

**El formulario de Contacto o Newsletter dice "no está conectado":**
→ Revisa en `contacto.html` o `newsletter.html` la línea `endpoint:` —
debe tener una URL real de Formspree (`https://formspree.io/f/...`), no
el placeholder.

**Los mensajes no llegan al email aunque el formulario diga "enviado":**
→ Entra en Formspree → el formulario en cuestión → Workflow → Actions →
bloque "Email", y comprueba que el destinatario correcto esté marcado.

**El CSS se ve "roto" (sin colores, sin estilo) después de subir cambios:**
→ Casi siempre es que algún archivo quedó con una ruta que empieza por
`/` en vez de ser relativa. Todos los archivos de esta web (salvo
`404.html`, que es un caso especial) deben usar rutas SIN barra inicial,
tipo `public/styles.css`, nunca `/public/styles.css`.

---

## 5. Todas las cuentas/servicios que usa esta web

| Servicio | Para qué | Cuenta usada |
|---|---|---|
| GitHub Pages | Aloja la web (gratis, siempre activa) | Marukunai |
| Google Cloud / YouTube Data API | Trae vídeos automáticamente | La cuenta de Google que creó la API key |
| Formspree | Recibe los formularios de Contacto y Newsletter | mmape2003@gmail.com |
| GoatCounter | Estadísticas de visitas, privado | jrodriguezweb.goatcounter.com |

Ninguno de estos cuesta dinero en el uso actual (todos en su plan
gratuito).

---

## 6. Antes de subir cambios grandes

Si en algún momento otra persona te da archivos nuevos para
la web, antes de subirlos comprueba que no traigan de vuelta estos
"placeholders" (Ctrl+F / Buscar en cada archivo):

- `TU_YOUTUBE_API_KEY` → debería ser tu key real en `public/youtube.js`
- `TU_FORMSPREE_ENDPOINT` → debería ser `xwlelpzq` en `contacto.html`
- `TU_FORMSPREE_ENDPOINT_NEWSLETTER` → debería ser `meajaazl` en `newsletter.html`

Si ves alguno de esos textos literales en un archivo que vas a subir,
significa que hay que rellenarlo antes.

---

## 7. Si algún día cambiáis el nombre del repositorio (dominio)

Ahora mismo la web vive en:
```
https://marukunai.github.io/jrodriguez-web/
```

Si en algún momento renombráis el repo (por ejemplo a `jrodriguezmusic`,
para que quede `https://marukunai.github.io/jrodriguezmusic/`), **no
basta con renombrarlo en GitHub** — varios archivos tienen esa URL
completa escrita a mano (no como ruta relativa), así que hay que tocarlos
también. Esto NO aplica si conseguís un dominio propio de verdad (tipo
`jrodriguezmusic.com`); eso es un cambio distinto y más grande, no lo
cubre esta sección.

### Paso a paso

**1. Renombra el repo en GitHub**
Settings → General → Repository name → nuevo nombre. GitHub deja un
redirect automático desde la URL vieja durante un tiempo, pero no es
permanente — hay que actualizar todo lo de abajo igualmente para que
quede bien del todo.

**2. Actualiza la restricción de la API key de YouTube**
En [Google Cloud Console](https://console.cloud.google.com/) → Credenciales
→ tu API key → Restricciones de sitios web. Cambia:
```
https://marukunai.github.io/jrodriguez-web/*
```
por:
```
https://marukunai.github.io/NUEVO-NOMBRE/*
```
Si no haces esto, el vídeo automático y el ranking de YouTube dejan de
funcionar en cuanto cambie la URL (aunque el resto de la web siga viva).

**3. Cambia la URL en los archivos del código**
Estos 9 archivos tienen `jrodriguez-web` escrito literalmente y hay que
sustituirlo por el nombre nuevo en cada uno:

| Archivo | Qué tiene que cambiar |
|---|---|
| `404.html` | Las 10 rutas que empiezan por `/jrodriguez-web/` (favicon, CSS, menú, botón "Volver al inicio", script) |
| `index.html` | `og:image`, `og:url`, las 3 líneas del bloque de datos estructurados (JSON-LD), y los 2 enlaces de compartir en WhatsApp/X (ojo, ahí la URL va codificada dentro del enlace) |
| `novedades.html` | `og:image` y `og:url` |
| `newsletter.html` | `og:image` y `og:url` |
| `contacto.html` | `og:image` y `og:url` |
| `eventos.html` | `og:image` y `og:url` |
| `prensa.html` | `og:image` y `og:url` |
| `robots.txt` | La línea `Sitemap:` |
| `sitemap.xml` | Las 4 URLs listadas (una por página) |

`privacidad.html` no necesita ningún cambio — no menciona la URL en
ningún sitio.

La forma más rápida de hacerlo bien: pide ayuda para hacer un
"buscar y reemplazar" de `jrodriguez-web` por el nombre nuevo en todos
esos archivos a la vez, en vez de ir uno a uno a mano (es fácil dejarse
alguna línea suelta).

**4. Vuelve a verificar la web en Google Search Console**
Search Console trata cada URL como una propiedad distinta — hay que
añadir la nueva URL como propiedad nueva, verificarla otra vez (te dará
un nuevo archivo `google...html` para subir, sustituyendo al actual), y
volver a enviar el `sitemap.xml` ya actualizado ahí dentro.

### Esto NO hace falta tocarlo

- **GoatCounter** (estadísticas) — el script no lleva la ruta del repo
  escrita, sigue funcionando solo.
- **Los enlaces internos entre páginas** (el menú, los botones de "Ver
  en YouTube", etc.) — todos usan rutas relativas tipo `href="index.html"`,
  sin la URL completa, así que no dependen del nombre del repo.
- **Formspree** — los dos formularios (Contacto y Newsletter) siguen
  funcionando igual, no están ligados a la URL de la web.

### Resumen mental

Si algo tiene escrita la palabra **"jrodriguez-web"** entera dentro del
código → hay que cambiarla. Si un enlace es corto y relativo (tipo
`href="novedades.html"`, sin `https://` delante) → no hay que tocarlo,
sigue funcionando solo.

---

## 8. Colaboraciones con otros artistas (vídeos que no salen solos)

La web trae los vídeos automáticamente **solo del canal de YouTube de
J Rodriguez**. Si hace una colaboración y el vídeo queda subido en el
canal del OTRO artista (aunque salga como "Fulano X J Rodriguez" en el
título, o YouTube junte los dos nombres arriba), ese vídeo **no va a
aparecer solo** — la web no tiene forma de saber que existe.

Esto ya pasó con "Salamandra" (colaboración con Jeyci RF, subida en su
canal) y seguramente vuelva a pasar.

**Cómo saber si un vídeo es de "los suyos" o de una colaboración
subida en otro canal:** entra al vídeo en YouTube y mira el nombre justo
debajo del título — si no es su canal (`@JRodriguezmusicc`), es una
colaboración y hay que añadirla a mano.

**Cómo añadirla:**

1. Abre `novedades.html` y busca `MANUAL_EXTRAS` (está cerca del
   principio del `<script>`, con comentarios explicando el formato).
2. Copia un bloque como el de "Salamandra" que ya hay ahí, y cambia:
   - `id` → el código del vídeo (la parte después de `watch?v=` en la URL)
   - `title` → el título tal cual aparece en YouTube
   - `publishedAt` → la fecha de estreno (se puede ver debajo del título
     del vídeo en YouTube, formato `AAAA-MM-DDT00:00:00Z`)
   - `url` → la URL completa del vídeo
3. Guarda y sube el archivo. Aparecerá mezclado con el resto de vídeos
   en Novedades, ordenado por fecha junto a todos los demás — no hace
   falta ponerlo en ningún sitio en concreto de la lista.

**Esto NO afecta al ranking de "Top Canciones"** de la portada — ese
ranking se calcula solo con las vistas reales de su canal vía API, así
que las colaboraciones de otros canales no entran ahí (para no tener un
número de vistas fijo que se quede desactualizado). Solo aparecen en
Novedades.