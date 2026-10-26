// Agrupa las interacciones que se comparten entre las cinco páginas.
(() => { // Evita que las variables de este archivo se mezclen con las de otros scripts.
  "use strict"; // Ayuda a detectar errores comunes de JavaScript.
  const CLAVE_FAVORITOS = "zenit-favoritos"; // Define el nombre local que guarda los identificadores favoritos.
  const CLAVE_PROPUESTAS = "zenit-propuestas"; // Define el nombre local que guarda las frases escritas por la persona.
  const pagina = document.body.dataset.page; // Averigua cuál de las cinco páginas está abierta.
  const categorias = { amor: "Amor", orgullo: "Ego y orgullo", renacer: "Renacer" }; // Traduce las categorías internas a nombres visibles.
  const listaBase = window.ZENIT_FRASES; // Toma el catálogo original cargado antes de este archivo.
  if (!Array.isArray(listaBase)) { throw new Error("No se pudo cargar el catálogo de frases de ZENIT."); } // Detiene la página con un error claro si falta el catálogo.
  const estado = { favoritos: new Set(), propuestas: [] }; // Conserva en memoria las listas leídas del navegador.
  const campoBusqueda = document.querySelector("#buscar-frase"); // Busca el campo de texto que existe en la página personal.
  const campoCategoria = document.querySelector("#filtro-categoria"); // Busca el selector que existe en la página personal.
  const contador = document.querySelector("#contador-frases"); // Busca el texto que muestra cuántos resultados hay.
  const listaFrases = document.querySelector("#lista-frases"); // Busca el contenedor que recibe las tarjetas de frases.
  const listaFavoritos = document.querySelector("#lista-favoritos"); // Busca el contenedor de favoritos si la página lo tiene.
  const mensajeGlobal = document.querySelector("#mensaje-global"); // Busca el área que anuncia resultados de acciones.
  const avisoAlmacenamiento = "El navegador no permitió acceder al almacenamiento local; los cambios no se conservarán."; // Prepara un mensaje para errores de almacenamiento.

  // Lee una lista guardada y comprueba que el dato tenga el formato esperado.
  function leerAlmacenamiento(clave) { // Recibe la llave local que se quiere consultar.
    try { // Permite informar si el navegador bloquea el almacenamiento.
      const datoGuardado = window.localStorage.getItem(clave); // Lee la cadena guardada bajo esa llave.
      if (datoGuardado === null) { return []; } // Devuelve una lista vacía cuando todavía no hay datos.
      const datoConvertido = JSON.parse(datoGuardado); // Convierte el texto guardado en un valor de JavaScript.
      if (!Array.isArray(datoConvertido)) { // Comprueba que el contenido sea una lista.
        mostrarMensaje("Los datos guardados tenían un formato distinto y se ignoraron."); // Explica por qué no se usó el contenido.
        return []; // Mantiene la página funcional con una lista vacía.
      } // Termina la comprobación del formato.
      return datoConvertido; // Devuelve la lista guardada que sí tiene el formato esperado.
    } catch (error) { // Atiende errores de acceso o de lectura de datos guardados.
      console.error("No se pudo leer el almacenamiento local de ZENIT.", error); // Deja el error disponible para quien revise la consola.
      mostrarMensaje(avisoAlmacenamiento); // Informa a la persona que los datos locales no están disponibles.
      return []; // Permite que el resto del catálogo siga funcionando.
    } // Termina el manejo del error de lectura.
  } // Termina la función de lectura local.

  // Guarda una lista y avisa si el navegador no permite conservarla.
  function guardarAlmacenamiento(clave, valor) { // Recibe una llave y una lista para guardar.
    try { // Permite manejar el bloqueo o el límite del almacenamiento.
      window.localStorage.setItem(clave, JSON.stringify(valor)); // Convierte la lista a texto y la guarda en el navegador.
      return true; // Confirma que el dato quedó guardado correctamente.
    } catch (error) { // Atiende errores al guardar datos en el navegador.
      console.error("No se pudo guardar información en el almacenamiento local de ZENIT.", error); // Explica el fallo en la consola.
      mostrarMensaje(avisoAlmacenamiento); // Informa que los cambios no se conservarán.
      return false; // Evita mostrar un guardado como exitoso.
    } // Termina el manejo del error de escritura.
  } // Termina la función de guardado local.

  // Escribe mensajes visibles para las acciones generales del sitio.
  function mostrarMensaje(texto) { // Recibe el mensaje que se debe anunciar.
    if (mensajeGlobal) { mensajeGlobal.textContent = texto; } // Usa texto seguro y solo actúa en páginas con un área de estado.
  } // Termina la función de mensajes generales.

  // Devuelve el nombre visible de una categoría.
  function nombreCategoria(clave) { // Recibe la clave interna de categoría.
    return categorias[clave] || "Mi constelación"; // Evita mostrar una categoría vacía en una propuesta.
  } // Termina la traducción de categorías.

  // Comprueba que una propuesta guardada tenga los datos necesarios para mostrarse.
  function esPropuestaValida(frase) { // Recibe un elemento leído de localStorage.
    return Boolean(frase && typeof frase.id === "string" && typeof frase.texto === "string" && typeof frase.autor === "string" && Object.prototype.hasOwnProperty.call(categorias, frase.categoria)); // Acepta únicamente propuestas con texto y categoría reconocidos.
  } // Termina la comprobación de propuestas.

  // Reúne las frases originales y las propuestas locales válidas.
  function obtenerFrases() { // No recibe datos porque lee las listas compartidas del estado.
    return listaBase.concat(estado.propuestas.filter(esPropuestaValida)); // Mantiene las propuestas fuera del catálogo original.
  } // Termina la obtención del catálogo completo.

  // Construye un botón de acción sin insertar texto como HTML.
  function crearBoton(accion, etiqueta, fraseId, icono) { // Recibe el tipo de acción y los datos de la frase.
    const boton = document.createElement("button"); // Crea un botón real para que funcione con teclado.
    boton.type = "button"; // Evita que el botón envíe formularios por accidente.
    boton.className = "quote-action"; // Aplica el diseño compartido de los controles.
    boton.dataset.accion = accion; // Permite reconocer la acción desde el evento delegado.
    boton.dataset.fraseId = fraseId; // Identifica la frase asociada al botón.
    boton.setAttribute("aria-label", `${etiqueta} frase`); // Da una etiqueta completa a lectores de pantalla.
    const iconoElemento = document.createElement("i"); // Crea el icono de Font Awesome.
    iconoElemento.className = icono; // Aplica el estilo del icono según la acción.
    iconoElemento.setAttribute("aria-hidden", "true"); // Evita que el icono se lea dos veces.
    boton.append(iconoElemento, document.createTextNode(` ${etiqueta}`)); // Añade el icono y texto legible al botón.
    return boton; // Devuelve el botón terminado.
  } // Termina la función para crear controles.

  // Convierte una frase del catálogo en una tarjeta accesible.
  function crearTarjeta(frase) { // Recibe una frase original o una propuesta local.
    const columna = document.createElement("div"); // Crea la columna exterior de Bootstrap.
    columna.className = "col-12 col-md-6 col-lg-4"; // Hace que la tarjeta use una, dos o tres columnas según el ancho.
    const tarjeta = document.createElement("article"); // Usa una etiqueta semántica para la frase independiente.
    tarjeta.className = "quote-card"; // Aplica el estilo visual de tarjeta.
    const metadatos = document.createElement("div"); // Agrupa la categoría y el tema de la frase.
    metadatos.className = "quote-meta"; // Aplica el estilo de las etiquetas.
    const categoria = document.createElement("span"); // Crea el texto con el nombre de la categoría.
    categoria.textContent = nombreCategoria(frase.categoria); // Escribe la categoría como texto sin interpretarla como HTML.
    const tema = document.createElement("span"); // Crea la subcategoría de la frase.
    tema.className = "quote-theme"; // Reduce el énfasis del tema frente a la categoría.
    tema.textContent = frase.tema || "Una frase para guardar"; // Muestra un tema o una etiqueta simple en propuestas locales.
    metadatos.append(categoria, tema); // Añade las etiquetas a la tarjeta.
    const cita = document.createElement("blockquote"); // Presenta el contenido con semántica de cita.
    cita.className = "quote-text"; // Aplica la tipografía expresiva de las frases.
    cita.textContent = frase.texto; // Inserta el texto como contenido seguro, nunca como código HTML.
    tarjeta.append(metadatos, cita); // Añade primero los datos y luego el texto principal.
    if (frase.autor) { // Comprueba si es una propuesta con seudónimo.
      const autor = document.createElement("cite"); // Crea una atribución semántica.
      autor.className = "quote-author"; // Aplica el formato discreto del nombre.
      autor.textContent = `— ${frase.autor}`; // Muestra el seudónimo como texto normal.
      cita.append(autor); // Coloca la atribución junto a su frase.
    } // Termina la atribución opcional.
    const acciones = document.createElement("div"); // Agrupa los controles para la frase.
    acciones.className = "quote-actions"; // Acomoda los botones de forma flexible.
    const favorita = estado.favoritos.has(frase.id); // Averigua si esta frase ya está guardada.
    const botonFavorito = crearBoton("favorito", favorita ? "Guardada" : "Guardar", frase.id, favorita ? "fa-solid fa-heart" : "fa-regular fa-heart"); // Crea la acción para guardar o quitar favoritos.
    if (favorita) { botonFavorito.classList.add("is-favorite"); } // Resalta el botón cuando la frase ya es favorita.
    acciones.append(botonFavorito, crearBoton("copiar", "Copiar", frase.id, "fa-regular fa-copy"), crearBoton("compartir", "Compartir", frase.id, "fa-solid fa-arrow-up-from-bracket")); // Añade las tres acciones disponibles.
    tarjeta.append(acciones); // Coloca las acciones debajo de la frase.
    columna.append(tarjeta); // Coloca la tarjeta dentro de su columna responsiva.
    return columna; // Devuelve la columna terminada para añadirla a una lista.
  } // Termina la función de tarjetas.

  // Muestra una nota cuando una lista no tiene frases.
  function mostrarListaVacia(contenedor, texto) { // Recibe la lista y el mensaje apropiado.
    const columna = document.createElement("div"); // Crea una columna que cubre todo el renglón.
    columna.className = "col-12"; // Ocupa el ancho completo de la cuadrícula.
    const mensaje = document.createElement("p"); // Crea un párrafo para el mensaje.
    mensaje.className = "empty-state mb-0"; // Mantiene el mensaje visualmente consistente.
    mensaje.textContent = texto; // Inserta el mensaje de manera segura.
    columna.append(mensaje); // Añade el párrafo a la columna.
    contenedor.append(columna); // Añade el mensaje a la lista correspondiente.
  } // Termina la nota de lista vacía.

  // Dibuja las frases que corresponden a la página y a los filtros elegidos.
  function actualizarListaPrincipal() { // Actualiza el catálogo si la página contiene su contenedor.
    if (!listaFrases) { return; } // Sale sin error en una página sin listado.
    const busqueda = campoBusqueda ? normalizar(campoBusqueda.value.trim()) : ""; // Normaliza el texto para ignorar mayúsculas y acentos.
    const categoriaElegida = campoCategoria ? campoCategoria.value : "todas"; // Lee el filtro actual cuando existe.
    let frasesVisibles = obtenerFrases().filter((frase) => { // Conserva solo las frases permitidas en esta página.
      const coincidePagina = pagina === "inicio" || pagina === "constelacion" || frase.categoria === pagina; // Limita páginas temáticas a su categoría.
      const coincideCategoria = categoriaElegida === "todas" || frase.categoria === categoriaElegida; // Aplica el filtro del selector personal.
      const contenidoBuscable = normalizar(`${frase.texto} ${frase.tema || ""} ${nombreCategoria(frase.categoria)} ${frase.autor || ""}`); // Prepara texto y metadata para la búsqueda.
      return coincidePagina && coincideCategoria && contenidoBuscable.includes(busqueda); // Conserva frases que coinciden con todos los filtros.
    }); // Termina el filtrado de resultados.
    if (pagina === "inicio") { frasesVisibles = frasesVisibles.slice(0, 6); } // Mantiene la portada breve y destacada.
    listaFrases.replaceChildren(); // Limpia las tarjetas previas sin interpretar HTML.
    if (frasesVisibles.length === 0) { // Comprueba si la búsqueda dejó la lista vacía.
      mostrarListaVacia(listaFrases, "No encontramos una frase con esas palabras. Prueba otra búsqueda."); // Explica por qué no hay resultados.
    } else { // Dibuja los resultados encontrados.
      frasesVisibles.forEach((frase) => listaFrases.append(crearTarjeta(frase))); // Añade una tarjeta segura por cada frase.
    } // Termina la presentación de resultados.
    if (contador) { contador.textContent = `${frasesVisibles.length} ${frasesVisibles.length === 1 ? "frase" : "frases"}`; } // Anuncia cuántos resultados hay.
  } // Termina la actualización del listado principal.

  // Dibuja las frases guardadas y conserva un mensaje cuando todavía no hay favoritas.
  function actualizarFavoritos() { // Actualiza el área de favoritos si la página la incluye.
    if (!listaFavoritos) { return; } // Sale sin error en las otras cuatro páginas.
    const catalogo = obtenerFrases(); // Obtiene frases base y propuestas locales.
    const frasesFavoritas = catalogo.filter((frase) => estado.favoritos.has(frase.id)); // Busca las frases cuyo identificador está guardado.
    listaFavoritos.replaceChildren(); // Limpia el contenido previo sin usar HTML como cadena.
    if (frasesFavoritas.length === 0) { // Comprueba si aún no hay favoritas disponibles.
      mostrarListaVacia(listaFavoritos, "Todavía no guardas frases. Cuando una te encuentre, puedes dejarla aquí."); // Explica cómo empezar a usar favoritos.
      return; // Evita intentar dibujar una lista vacía.
    } // Termina la condición de lista vacía.
    frasesFavoritas.forEach((frase) => listaFavoritos.append(crearTarjeta(frase))); // Añade una tarjeta con acciones para cada favorita.
  } // Termina la actualización de favoritos.

  // Incorpora una frase local recién guardada y vuelve a dibujar las listas.
  function agregarPropuesta(propuesta) { // Recibe la propuesta que ya se guardó correctamente.
    if (!esPropuestaValida(propuesta)) { throw new Error("La propuesta no tiene el formato esperado."); } // Evita mostrar datos incompletos.
    estado.propuestas.push(propuesta); // Mantiene la nueva frase disponible durante esta visita.
    actualizarListas(); // Refleja la propuesta en las vistas correspondientes.
  } // Termina la incorporación de una propuesta.

  // Actualiza ambas listas para mantener los estados de botones sincronizados.
  function actualizarListas() { // Reúne las actualizaciones de frases y favoritos.
    actualizarListaPrincipal(); // Redibuja los resultados visibles del catálogo.
    actualizarFavoritos(); // Redibuja las frases guardadas si existe esa sección.
  } // Termina la actualización compartida.

  // Quita tildes y diferencias entre mayúsculas para una búsqueda más flexible.
  function normalizar(texto) { // Recibe el texto que se va a comparar.
    return texto.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Devuelve el texto en minúsculas y sin marcas de acento.
  } // Termina la normalización de texto.

  // Intenta copiar una frase mediante la API moderna o una alternativa sencilla.
  async function copiarTexto(texto) { // Recibe el contenido que se quiere copiar.
    if (navigator.clipboard && window.isSecureContext) { // Comprueba que la API de portapapeles esté disponible en un contexto seguro.
      try { // Intenta la forma moderna de copiar.
        await navigator.clipboard.writeText(texto); // Envía el texto al portapapeles.
        return true; // Confirma que la copia terminó.
      } catch (error) { // Atiende permisos denegados por el navegador.
        console.warn("La API del portapapeles no permitió copiar; se probará la alternativa.", error); // Explica por qué se usa la alternativa.
      } // Termina el intento de copia moderna.
    } // Termina la comprobación de la API moderna.
    const campoTemporal = document.createElement("textarea"); // Crea un campo temporal para navegadores antiguos.
    campoTemporal.value = texto; // Coloca la frase dentro del campo.
    campoTemporal.setAttribute("readonly", ""); // Evita que el campo temporal se edite.
    campoTemporal.style.position = "fixed"; // Lo saca del flujo de la página.
    campoTemporal.style.opacity = "0"; // Lo oculta visualmente mientras existe.
    document.body.append(campoTemporal); // Añade el campo temporal al documento.
    campoTemporal.select(); // Selecciona la frase para copiarla.
    let copiaCorrecta = false; // Recuerda si el navegador confirmó la copia.
    try { // Intenta copiar con la alternativa tradicional del navegador.
      copiaCorrecta = document.execCommand("copy"); // Ejecuta la orden de copia en navegadores que aún la permiten.
    } catch (error) { // Atiende navegadores que no ofrecen esta alternativa.
      console.warn("El navegador no permitió usar el método alternativo de copia.", error); // Explica el motivo en la consola.
    } // Termina el intento de copia alternativa.
    campoTemporal.remove(); // Borra el campo temporal para no dejar elementos invisibles.
    return copiaCorrecta; // Indica si alguna alternativa logró copiar el texto.
  } // Termina la función de copia.

  // Resuelve la acción seleccionada usando el identificador de cada tarjeta.
  async function manejarAccion(evento) { // Recibe el clic realizado en una tarjeta o botón aleatorio.
    const boton = evento.target.closest("[data-accion]"); // Encuentra el botón aunque se haya pulsado su icono.
    if (!boton) { return; } // Ignora clics fuera de los controles del sitio.
    const accion = boton.dataset.accion; // Lee el nombre de la acción elegida.
    if (accion === "aleatoria") { // Atiende el botón de frase aleatoria de portada y constelación.
      const destino = document.querySelector("#frase-aleatoria"); // Busca el lugar donde se muestra la frase.
      const frases = obtenerFrases(); // Reúne el catálogo y las propuestas locales.
      if (destino && frases.length > 0) { // Comprueba que exista el destino y haya frases.
        const indice = Math.floor(Math.random() * frases.length); // Elige un índice al azar dentro del catálogo.
        destino.textContent = `“${frases[indice].texto}”`; // Muestra la frase como texto seguro.
      } // Termina la elección aleatoria.
      return; // Evita tratar el botón aleatorio como una acción de tarjeta.
    } // Termina la acción aleatoria.
    const frase = obtenerFrases().find((elemento) => elemento.id === boton.dataset.fraseId); // Busca la frase que pertenece al botón.
    if (!frase) { // Comprueba que la frase todavía exista.
      mostrarMensaje("No encontramos esa frase en el catálogo actual."); // Explica por qué no pudo continuar la acción.
      return; // Evita operar sobre una frase inexistente.
    } // Termina la comprobación de la frase.
    if (accion === "favorito") { // Atiende la acción de agregar o quitar de favoritos.
      const nuevosFavoritos = new Set(estado.favoritos); // Copia el estado actual para no cambiarlo antes de guardar.
      if (nuevosFavoritos.has(frase.id)) { nuevosFavoritos.delete(frase.id); } else { nuevosFavoritos.add(frase.id); } // Alterna el estado de la frase.
      if (guardarAlmacenamiento(CLAVE_FAVORITOS, Array.from(nuevosFavoritos))) { // Persiste los cambios antes de mostrar el nuevo estado.
        estado.favoritos = nuevosFavoritos; // Actualiza el estado visible solo si el guardado funcionó.
        actualizarListas(); // Refleja el cambio en el catálogo y en favoritos.
        mostrarMensaje(nuevosFavoritos.has(frase.id) ? "Frase guardada en tus favoritas." : "Frase quitada de tus favoritas."); // Confirma el cambio realizado.
      } // Termina el guardado de favoritos.
      return; // Evita que el mismo botón pase a otras acciones.
    } // Termina la acción de favoritos.
    if (accion === "copiar") { // Atiende la solicitud para copiar una frase.
      const resultado = await copiarTexto(frase.texto); // Prueba los métodos disponibles para copiar.
      mostrarMensaje(resultado ? "Frase copiada al portapapeles." : "No se pudo copiar. Puedes seleccionar el texto de la frase."); // Explica el resultado sin fingir éxito.
      return; // Evita continuar con la acción de compartir.
    } // Termina la acción de copia.
    if (accion === "compartir") { // Atiende la solicitud de compartir una frase.
      if (navigator.share) { // Comprueba si el navegador tiene la API nativa de compartir.
        try { // Intenta abrir el panel de compartir del dispositivo.
          await navigator.share({ title: "Una frase de ZENIT", text: frase.texto }); // Comparte título y frase sin inventar una URL.
          mostrarMensaje("La frase se compartió correctamente."); // Confirma que el navegador completó la acción.
        } catch (error) { // Distingue cancelación de un fallo real.
          if (error.name !== "AbortError") { console.error("No se pudo compartir la frase.", error); mostrarMensaje("El navegador no pudo compartir esta frase."); } // Informa solo fallos no causados por cancelar.
        } // Termina la acción nativa de compartir.
      } else { // Usa la copia como alternativa en navegadores sin compartir.
        const resultado = await copiarTexto(frase.texto); // Copia el texto si el portapapeles está disponible.
        mostrarMensaje(resultado ? "Este navegador no ofrece compartir; copiamos la frase para que puedas enviarla." : "Este navegador no ofrece compartir ni permitió copiar la frase."); // Explica claramente la alternativa.
      } // Termina la alternativa de compartir.
    } // Termina la acción para compartir.
  } // Termina el manejo de acciones.

  // Lee las preferencias locales antes de dibujar la página.
  estado.favoritos = new Set(leerAlmacenamiento(CLAVE_FAVORITOS).filter((id) => typeof id === "string")); // Conserva solo identificadores de frase válidos.
  estado.propuestas = leerAlmacenamiento(CLAVE_PROPUESTAS).filter(esPropuestaValida); // Descarta propuestas incompletas o con categorías desconocidas.

  // Conecta los campos y los botones con sus funciones.
  document.addEventListener("click", manejarAccion); // Atiende acciones incluso en tarjetas creadas después de cargar.
  if (campoBusqueda) { campoBusqueda.addEventListener("input", actualizarListaPrincipal); } // Actualiza resultados mientras se escribe.
  if (campoCategoria) { campoCategoria.addEventListener("change", actualizarListaPrincipal); } // Actualiza resultados cuando cambia la categoría.
  document.addEventListener("DOMContentLoaded", actualizarListas); // Dibuja las listas cuando el documento ya está listo.

  // Comparte funciones pequeñas con el formulario que usa el mismo almacenamiento.
  window.ZenitApp = { // Publica las herramientas que necesita el otro archivo JavaScript.
    guardarAlmacenamiento, // Permite guardar propuestas sin duplicar la lógica de errores.
    mostrarMensaje, // Permite avisar desde el formulario si el almacenamiento falla.
    agregarPropuesta // Permite incluir una propuesta recién guardada en las listas.
  }; // Termina las herramientas compartidas.
})(); // Ejecuta el conjunto de funciones compartidas.
