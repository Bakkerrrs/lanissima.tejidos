# Lanissima Tejidos — sitio web

Sitio estático (HTML + CSS + JavaScript, sin dependencias) inspirado en la estética de
[petiteknit.com](https://www.petiteknit.com/en). Todo el contenido es gratuito; el
objetivo es crear engagement.

## Páginas

| Página | Qué hace |
| --- | --- |
| `index.html` | Portada one-page: carrusel automático de últimos patrones, patrones destacados, videos grandes, calculadora, sobre mí, Instagram y newsletter. El menú hace scroll suave a cada sección |
| `patrones.html` | Todos los patrones, con filtros por categoría y dificultad |
| `patron.html?id=…` | Detalle de un patrón con botón de descarga del PDF |
| `videos.html` | Videos de YouTube incrustados (clic para reproducir) |
| `calculadora.html` | Calculadora de lana (prenda + talla + grosor → metros y ovillos) |
| `sobre-mi.html` | Página "Sobre mí" |
| `admin.html` | **Panel de administración** (no aparece en el menú) |

El sitio es bilingüe (ES/EN) con el selector del encabezado.

## Cómo publicar el sitio (GitHub Pages, gratis)

1. En GitHub: **Settings → Pages → Build and deployment**.
2. En *Source* elige **Deploy from a branch**, rama **main**, carpeta **/ (root)** y guarda.
3. En 1-2 minutos el sitio queda en `https://bakkerrrs.github.io/lanissima.tejidos/`.

> Consejo: también puedes conectar un dominio propio (p. ej. `lanissima.cl`)
> en la misma pantalla de Settings → Pages.

## Cómo administrar el contenido (admin.html)

Abre `https://bakkerrrs.github.io/lanissima.tejidos/admin.html` en tu navegador.
La primera vez te pedirá un
**token de GitHub** (es tu "llave" para publicar; se guarda solo en tu navegador):

1. Entra a <https://github.com/settings/personal-access-tokens/new>.
2. Nombre: `Lanissima admin`. En *Repository access* elige **Only select
   repositories** y selecciona `lanissima.tejidos`.
3. En *Permissions → Repository permissions → **Contents*** elige **Read and write**.
4. Genera el token, cópialo y pégalo en el panel.

Desde el panel puedes:

- **Patrones**: crear, editar y eliminar; subir la foto y el PDF (ES y opcionalmente EN),
  elegir categoría, dificultad y si va destacado en la portada.
- **Videos**: pegar la URL de YouTube y listo (la miniatura es automática).
- **Instagram**: subir la foto y el enlace de cada post que quieras mostrar en la
  portada (hasta 6). La sección se oculta sola si no hay posts.
- **Configuración**: enlaces de redes sociales y URL del newsletter. El enlace de
  Instagram también alimenta el @usuario y el botón "Ver mi Instagram" de la portada.

Cada cambio crea un commit en la rama `main` y GitHub Pages republica el sitio
automáticamente en 1-2 minutos.

## Newsletter

El formulario del pie de página funciona con cualquier proveedor que acepte
formularios (Mailchimp, Buttondown, Sender…):

1. Crea una cuenta en el proveedor y busca la opción *embedded form / formulario*.
2. Copia la URL del atributo `action` del formulario que te dan.
3. Pégala en **admin.html → Configuración → Newsletter**.

Mientras no haya proveedor configurado, el formulario solo muestra un mensaje de
confirmación local (no guarda correos).

## Contenido de ejemplo

Los 3 patrones, los 2 videos y el PDF incluidos son **ejemplos** para que veas el
diseño. Elimínalos desde el panel cuando subas tu contenido real.

## Ideas futuras (del mundo tejeril)

- **Contador de vueltas/filas**: herramienta interactiva que guarda el progreso en
  el navegador; genera visitas recurrentes.
- **Favoritos**: guardar patrones favoritos con `localStorage`.
- **Knit-alongs (KAL)**: tejer un patrón en comunidad con fechas y hashtag.
- **Galería de la comunidad**: fotos de personas que tejieron tus patrones.
- **Modo oscuro**.
