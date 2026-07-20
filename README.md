# Lanissima Tejidos — versión nueva (una página)

Sitio estático de una sola página con el diseño Organic.

## Cómo publicarlo en tu repo

1. En tu repo `lanissima.tejidos`, borra los archivos antiguos de la raíz
   (`*.html`, `assets/`, `data/`, `assets/js/`).
2. Copia el contenido de esta carpeta a la raíz del repo.
3. Commit y push a `main`. GitHub Pages republica en 1-2 minutos.

## Cómo editar el contenido

- **Patrones**: edita las tarjetas dentro de `index.html` (sección `id="patrones"`).
  El atributo `data-search` de cada tarjeta alimenta el buscador y `data-cat` los filtros.
- **Videos**: cambia los enlaces `href` de cada `.video-card` por la URL real del video
  y reemplaza la imagen por la miniatura (`https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg`).
- **Instagram**: sube tus fotos a `uploads/` y apunta cada `.insta-item` a la publicación.

Nota: esta versión no incluye el panel de administración, la calculadora ni el modo bilingüe
del sitio anterior.

hola
