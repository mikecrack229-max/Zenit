(() => {
  "use strict";
  const CLAVE_FAVORITOS = "zenit-favoritos";
  const CLAVE_PROPUESTAS = "zenit-propuestas";
  const pagina = document.body.dataset.page;
  const categorias = { amor: "Amor", orgullo: "Ego y orgullo", renacer: "Renacer" };
  const listaBase = window.ZENIT_FRASES;
  if (!Array.isArray(listaBase)) { throw new Error("No se pudo cargar el catálogo de frases de ZENIT."); }
  const estado = { favoritos: new Set(), propuestas: [] };
  const campoBusqueda = document.querySelector("#buscar-frase");
  const campoCategoria = document.querySelector("#filtro-categoria");
  const contador = document.querySelector("#contador-frases");
  const listaFrases = document.querySelector("#lista-frases");
  const listaFavoritos = document.querySelector("#lista-favoritos");
  const mensajeGlobal = document.querySelector("#mensaje-global");
  const menu = document.querySelector("#menuPrincipal");
  const botonMenu = document.querySelector(".boton-menu");
  const avisoAlmacenamiento = "El navegador no permitió acceder al almacenamiento local; los cambios no se conservarán.";

  if (campoBusqueda) {
    campoBusqueda.value = new URLSearchParams(window.location.search).get("buscar") || "";
  }

  function leerAlmacenamiento(clave) {
    try {
      const datoGuardado = window.localStorage.getItem(clave);
      if (datoGuardado === null) { return []; }
      const datoConvertido = JSON.parse(datoGuardado);
      if (!Array.isArray(datoConvertido)) {
        mostrarMensaje("Los datos guardados tenían un formato distinto y se ignoraron.");
        return [];
      }
      return datoConvertido;
    } catch (error) {
      console.error("No se pudo leer el almacenamiento local de ZENIT.", error);
      mostrarMensaje(avisoAlmacenamiento);
      return [];
    }
  }

  function guardarAlmacenamiento(clave, valor) {
    try {
      window.localStorage.setItem(clave, JSON.stringify(valor));
      return true;
    } catch (error) {
      console.error("No se pudo guardar información en el almacenamiento local de ZENIT.", error);
      mostrarMensaje(avisoAlmacenamiento);
      return false;
    }
  }

  function mostrarMensaje(texto) {
    if (mensajeGlobal) { mensajeGlobal.textContent = texto; }
  }

  function nombreCategoria(clave) {
    return categorias[clave] || "Mi constelación";
  }

  function esPropuestaValida(frase) {
    return Boolean(frase && typeof frase.id === "string" && typeof frase.texto === "string" && typeof frase.autor === "string" && Object.prototype.hasOwnProperty.call(categorias, frase.categoria));
  }

  function obtenerFrases() {
    return listaBase.concat(estado.propuestas.filter(esPropuestaValida));
  }

  // Los iconos son SVG locales renderizados como imágenes, sin dependencia de fuentes externas.
  function crearBoton(accion, etiqueta, fraseId, archivoIcono) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "btn btn-sm boton-accion";
    boton.dataset.accion = accion;
    boton.dataset.fraseId = fraseId;
    boton.setAttribute("aria-label", `${etiqueta} frase`);
    const iconoElemento = document.createElement("img");
    iconoElemento.className = "icono-accion";
    iconoElemento.src = `assets/icons/${archivoIcono}`;
    iconoElemento.alt = "";
    iconoElemento.setAttribute("aria-hidden", "true");
    boton.append(iconoElemento, document.createTextNode(` ${etiqueta}`));
    return boton;
  }

  function crearTarjeta(frase) {
    const columna = document.createElement("div");
    columna.className = "columna-frase col-12 col-md-6 col-lg-4";
    const tarjeta = document.createElement("article");
    tarjeta.className = "card tarjeta-frase h-100";
    const metadatos = document.createElement("div");
    metadatos.className = "datos-frase";
    const categoria = document.createElement("span");
    categoria.textContent = nombreCategoria(frase.categoria);
    const tema = document.createElement("span");
    tema.className = "tema";
    tema.textContent = frase.tema || "Una frase para guardar";
    metadatos.append(categoria, tema);
    const cita = document.createElement("blockquote");
    cita.className = "frase";
    cita.textContent = frase.texto;
    tarjeta.append(metadatos, cita);
    if (frase.autor) {
      const autor = document.createElement("cite");
      autor.className = "autor";
      autor.textContent = `— ${frase.autor}`;
      cita.append(autor);
    }
    const acciones = document.createElement("div");
    acciones.className = "acciones";
    const favorita = estado.favoritos.has(frase.id);
    const botonFavorito = crearBoton("favorito", favorita ? "Guardada" : "Guardar", frase.id, favorita ? "heart-filled.svg" : "heart.svg");
    if (favorita) { botonFavorito.classList.add("activa"); }
    acciones.append(botonFavorito, crearBoton("copiar", "Copiar", frase.id, "copy.svg"), crearBoton("compartir", "Compartir", frase.id, "share.svg"));
    tarjeta.append(acciones);
    columna.append(tarjeta);
    return columna;
  }

  function mostrarListaVacia(contenedor, texto) {
    const mensaje = document.createElement("p");
    mensaje.className = "vacio col-12";
    mensaje.textContent = texto;
    contenedor.append(mensaje);
  }

  function actualizarListaPrincipal() {
    if (!listaFrases) { return; }
    const busqueda = campoBusqueda ? normalizar(campoBusqueda.value.trim()) : "";
    const categoriaElegida = campoCategoria ? campoCategoria.value : "todas";
    let frasesVisibles = obtenerFrases().filter((frase) => {
      const coincidePagina = pagina === "inicio" || pagina === "constelacion" || frase.categoria === pagina;
      const coincideCategoria = categoriaElegida === "todas" || frase.categoria === categoriaElegida;
      const contenidoBuscable = normalizar(`${frase.texto} ${frase.tema || ""} ${nombreCategoria(frase.categoria)} ${frase.autor || ""}`);
      return coincidePagina && coincideCategoria && contenidoBuscable.includes(busqueda);
    });
    if (pagina === "inicio") { frasesVisibles = frasesVisibles.slice(0, 6); }
    listaFrases.replaceChildren();
    if (frasesVisibles.length === 0) {
      mostrarListaVacia(listaFrases, "No encontramos una frase con esas palabras. Prueba otra búsqueda.");
    } else {
      frasesVisibles.forEach((frase) => listaFrases.append(crearTarjeta(frase)));
    }
    if (contador) { contador.textContent = `${frasesVisibles.length} ${frasesVisibles.length === 1 ? "frase" : "frases"}`; }
  }

  function actualizarFavoritos() {
    if (!listaFavoritos) { return; }
    const catalogo = obtenerFrases();
    const frasesFavoritas = catalogo.filter((frase) => estado.favoritos.has(frase.id));
    listaFavoritos.replaceChildren();
    if (frasesFavoritas.length === 0) {
      mostrarListaVacia(listaFavoritos, "Todavía no guardas frases. Cuando una te encuentre, puedes dejarla aquí.");
      return;
    }
    frasesFavoritas.forEach((frase) => listaFavoritos.append(crearTarjeta(frase)));
  }

  function agregarPropuesta(propuesta) {
    if (!esPropuestaValida(propuesta)) { throw new Error("La propuesta no tiene el formato esperado."); }
    estado.propuestas.push(propuesta);
    actualizarListas();
  }

  function actualizarListas() {
    actualizarListaPrincipal();
    actualizarFavoritos();
  }

  function normalizar(texto) {
    return texto.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  async function copiarTexto(texto) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(texto);
        return true;
      } catch (error) {
        console.warn("La API del portapapeles no permitió copiar; se probará la alternativa.", error);
      }
    }
    const campoTemporal = document.createElement("textarea");
    campoTemporal.value = texto;
    campoTemporal.setAttribute("readonly", "");
    campoTemporal.style.position = "fixed";
    campoTemporal.style.opacity = "0";
    document.body.append(campoTemporal);
    campoTemporal.select();
    let copiaCorrecta = false;
    try {
      copiaCorrecta = document.execCommand("copy");
    } catch (error) {
      console.warn("El navegador no permitió usar el método alternativo de copia.", error);
    }
    campoTemporal.remove();
    return copiaCorrecta;
  }

  // Un único listener mantiene operativas las acciones de las tarjetas creadas dinámicamente.
  async function manejarAccion(evento) {
    const boton = evento.target.closest("[data-accion]");
    if (!boton) { return; }
    const accion = boton.dataset.accion;
    if (accion === "aleatoria") {
      const destino = document.querySelector("#frase-aleatoria");
      const frases = obtenerFrases();
      if (destino && frases.length > 0) {
        const indice = Math.floor(Math.random() * frases.length);
        destino.textContent = `“${frases[indice].texto}”`;
      }
      return;
    }
    const frase = obtenerFrases().find((elemento) => elemento.id === boton.dataset.fraseId);
    if (!frase) {
      mostrarMensaje("No encontramos esa frase en el catálogo actual.");
      return;
    }
    if (accion === "favorito") {
      const nuevosFavoritos = new Set(estado.favoritos);
      if (nuevosFavoritos.has(frase.id)) { nuevosFavoritos.delete(frase.id); } else { nuevosFavoritos.add(frase.id); }
      if (guardarAlmacenamiento(CLAVE_FAVORITOS, Array.from(nuevosFavoritos))) {
        estado.favoritos = nuevosFavoritos;
        actualizarListas();
        mostrarMensaje(nuevosFavoritos.has(frase.id) ? "Frase guardada en tus favoritas." : "Frase quitada de tus favoritas.");
      }
      return;
    }
    if (accion === "copiar") {
      const resultado = await copiarTexto(frase.texto);
      mostrarMensaje(resultado ? "Frase copiada al portapapeles." : "No se pudo copiar. Puedes seleccionar el texto de la frase.");
      return;
    }
    if (accion === "compartir") {
      if (navigator.share) {
        try {
          await navigator.share({ title: "Una frase de ZENIT", text: frase.texto });
          mostrarMensaje("La frase se compartió correctamente.");
        } catch (error) {
          if (error.name !== "AbortError") { console.error("No se pudo compartir la frase.", error); mostrarMensaje("El navegador no pudo compartir esta frase."); }
        }
      } else {
        const resultado = await copiarTexto(frase.texto);
        mostrarMensaje(resultado ? "Este navegador no ofrece compartir; copiamos la frase para que puedas enviarla." : "Este navegador no ofrece compartir ni permitió copiar la frase.");
      }
    }
  }

  estado.favoritos = new Set(leerAlmacenamiento(CLAVE_FAVORITOS).filter((id) => typeof id === "string"));
  estado.propuestas = leerAlmacenamiento(CLAVE_PROPUESTAS).filter(esPropuestaValida);

  document.addEventListener("click", manejarAccion);
  if (menu && botonMenu && window.bootstrap && window.bootstrap.Collapse) {
    const menuColapsable = window.bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false });
    function actualizarEtiquetaMenu() {
      const abierto = botonMenu.getAttribute("aria-expanded") === "true";
      botonMenu.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    }
    menu.addEventListener("shown.bs.collapse", actualizarEtiquetaMenu);
    menu.addEventListener("hidden.bs.collapse", actualizarEtiquetaMenu);
    botonMenu.addEventListener("click", () => window.requestAnimationFrame(actualizarEtiquetaMenu));
    menu.querySelectorAll(".enlace-menu").forEach((enlace) => enlace.addEventListener("click", () => menuColapsable.hide()));
    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && menu.classList.contains("show")) { menuColapsable.hide(); }
    });
  } else if (botonMenu && menu) {
    function mostrarMenu(abierto) {
      menu.classList.toggle("show", abierto);
      botonMenu.setAttribute("aria-expanded", String(abierto));
      botonMenu.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    }
    botonMenu.addEventListener("click", () => mostrarMenu(!menu.classList.contains("show")));
    menu.querySelectorAll(".enlace-menu").forEach((enlace) => enlace.addEventListener("click", () => mostrarMenu(false)));
    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape") { mostrarMenu(false); }
    });
  }
  if (campoBusqueda) { campoBusqueda.addEventListener("input", actualizarListaPrincipal); }
  if (campoCategoria) { campoCategoria.addEventListener("change", actualizarListaPrincipal); }
  document.addEventListener("DOMContentLoaded", actualizarListas);

  window.ZenitApp = {
    guardarAlmacenamiento,
    mostrarMensaje,
    agregarPropuesta
  };
})();
