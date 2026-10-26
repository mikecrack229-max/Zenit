# ZENIT — Un universo dentro de ti

ZENIT es un sitio estático de frases originales sobre amor, dignidad y crecimiento personal. Su identidad visual usa colores nocturnos, detalles celestes y una atmósfera tranquila para que las frases sean lo más importante.

## Páginas

- `index.html`: portada, frase aleatoria, categorías y frases destacadas.
- `amor.html`: amor propio, enamoramiento, desamor, nostalgia y despedidas.
- `orgullo.html`: dignidad, confianza, límites y ambición.
- `renacer.html`: disciplina, metas, aprendizaje y crecimiento.
- `constelacion.html`: buscador, filtros, favoritos y propuestas personales.

## Cómo abrir el proyecto

No hace falta instalar paquetes ni iniciar un servidor. Abre `index.html` en un navegador o publica los archivos en un servicio de alojamiento estático.

## Publicar en GitHub Pages

1. Sube el contenido de este proyecto a un repositorio de GitHub.
2. En el repositorio, abre **Settings → Pages**.
3. En **Build and deployment**, elige **Deploy from a branch**.
4. Selecciona la rama principal y la carpeta raíz (`/root`), y guarda los cambios.
5. Espera a que GitHub Pages termine el despliegue y revisa la URL que aparece en esa misma sección.

Los enlaces internos usan rutas relativas, por lo que funcionan tanto en la raíz de un dominio como en un repositorio de GitHub Pages. No se considera publicado hasta comprobar la URL después de configurar Pages.

## Tecnologías

- HTML5, CSS3 y JavaScript sin frameworks de interfaz.
- Bootstrap 5, Font Awesome, Google Fonts y SweetAlert2 mediante CDN.
- `localStorage` del navegador para favoritos y frases propuestas.

La página de constelación guarda las frases propuestas solo en el navegador actual. No se envían a internet ni a un administrador. Los favoritos y las propuestas dependen del almacenamiento local del navegador y pueden borrarse al limpiar sus datos.

## Archivos

- `css/styles.css`: estilos compartidos, diseño espacial y adaptación a pantallas pequeñas.
- `js/frases.js`: catálogo de frases originales y temas.
- `js/app.js`: navegación interactiva, filtros, búsqueda, favoritos, copia y compartir.
- `js/formulario.js`: validación y almacenamiento local de propuestas.

Los fondos y la luna se dibujan con CSS, así que el sitio no depende de imágenes externas. Las fuentes y librerías CDN sí requieren conexión a internet; si no se cargan, el contenido y los enlaces siguen disponibles.
