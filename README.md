# ZENIT — Un universo dentro de ti

ZENIT es un sitio estático de frases originales sobre amor, dignidad y crecimiento personal. Su identidad visual usa colores nocturnos, detalles celestes y una atmósfera tranquila para que las frases sean lo más importante.

## Páginas

- `index.html`: portada, frase aleatoria, categorías y frases destacadas.
- `amor.html`: amor propio, desamor, tristeza, sentimentalismo, nostalgia, pérdidas y despedidas.
- `orgullo.html`: dignidad, confianza, límites, enojo y cómo procesar el resentimiento.
- `renacer.html`: disciplina, metas, aprendizaje y motivación después de momentos difíciles.
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

- HTML5, CSS3, JavaScript y Bootstrap 5.3.3 mediante CDN.
- Google Fonts y SweetAlert2 mediante CDN.
- `localStorage` del navegador para favoritos y frases propuestas.

La página de constelación guarda las frases propuestas solo en el navegador actual. No se envían a internet ni a un administrador. Los favoritos y las propuestas dependen del almacenamiento local del navegador y pueden borrarse al limpiar sus datos.

## Archivos

- `css/styles.css`: estilos compartidos, diseño espacial y adaptación a pantallas pequeñas.
- `js/frases.js`: catálogo de frases originales y temas.
- `js/app.js`: navegación interactiva, filtros, búsqueda, favoritos, copia y compartir.
- `js/formulario.js`: validación y almacenamiento local de propuestas.
- `assets/`: cinco imágenes WebP y una colección local de iconos SVG.

Las clases propias del sitio usan nombres breves en español. Bootstrap proporciona la cuadrícula adaptable, la navegación colapsable, los controles de formulario y algunas utilidades; `css/styles.css` conserva los colores, la tipografía, las tarjetas, los efectos y la identidad visual de ZENIT. El menú usa el componente Collapse de Bootstrap y mantiene etiquetas accesibles y cierre con Escape.

Las imágenes WebP se sirven desde la carpeta local del proyecto, así que no dependen de un servicio de imágenes externo al publicar. El fondo espacial utiliza una imagen local con una capa oscura para mantener la lectura; los iconos también son imágenes SVG locales. Las fotos se revelan al cargar y, al pasar el cursor, se acercan suavemente un 8 % dentro de su marco, sin deformarse ni cambiar el espacio reservado; se respeta la preferencia del sistema para reducir el movimiento. El inicio incluye accesos directos a los nuevos temas, que abren la constelación con la búsqueda correspondiente. Los detalles de estrellas se dibujan con CSS. Bootstrap, SweetAlert2 y las fuentes requieren conexión a internet. Si Bootstrap no carga, el contenido permanece, pero el diseño adaptable y el menú colapsable pueden no comportarse como se espera.

### Fuentes de las imágenes

- [Galaxia de portada](https://images.unsplash.com/photo-1462331940025-496dfbfc7564)
- [Amanecer para Amor](https://images.unsplash.com/photo-1470252649378-9c29740c9fa8)
- [Olas para Ego y orgullo](https://images.unsplash.com/photo-1518837695005-2083093ee35b)
- [Cielo para Renacer](https://images.unsplash.com/photo-1475274047050-1d0c0975c63e)
- [Estrellas para Mi constelación](https://images.unsplash.com/photo-1464802686167-b939a6910659)
