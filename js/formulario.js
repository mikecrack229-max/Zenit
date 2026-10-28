(() => {
  "use strict";
  const formulario = document.querySelector("#formulario-frase");
  if (!formulario) { return; }
  const campoNombre = formulario.querySelector("#nombre-propuesta");
  const campoCategoria = formulario.querySelector("#categoria-propuesta");
  const campoFrase = formulario.querySelector("#texto-propuesta");
  const campoAceptacion = formulario.querySelector("#aceptar-local");
  const mensajeFormulario = formulario.querySelector("#mensaje-formulario");
  const categoriasPermitidas = ["amor", "orgullo", "renacer"];

  function mostrarError(campo, idMensaje, texto) {
    const mensaje = formulario.querySelector(`#${idMensaje}`);
    mensaje.textContent = texto;
    campo.classList.toggle("is-invalid", Boolean(texto));
    if (texto) {
      campo.setAttribute("aria-invalid", "true");
    } else {
      campo.removeAttribute("aria-invalid");
    }
  }

  function validarCampo(campo) {
    let textoError = "";
    if (campo === campoNombre) {
      const nombre = campoNombre.value.trim();
      if (!campoNombre.validity.valid || nombre.length < 2 || nombre.length > 30) {
        textoError = "Escribe un nombre de al menos 2 caracteres.";
      }
      mostrarError(campoNombre, "error-nombre", textoError);
    } else if (campo === campoCategoria) {
      if (!campoCategoria.validity.valid || !categoriasPermitidas.includes(campoCategoria.value)) {
        textoError = "Elige una de las categorías disponibles.";
      }
      mostrarError(campoCategoria, "error-categoria", textoError);
    } else if (campo === campoFrase) {
      const texto = campoFrase.value.trim();
      if (!campoFrase.validity.valid || texto.length < 10 || texto.length > 240) {
        textoError = "Escribe una frase de entre 10 y 240 caracteres.";
      }
      mostrarError(campoFrase, "error-frase", textoError);
    } else if (campo === campoAceptacion) {
      if (!campoAceptacion.validity.valid || !campoAceptacion.checked) {
        textoError = "Confirma que la frase se guardará solo en este navegador.";
      }
      mostrarError(campoAceptacion, "error-aceptar", textoError);
    }
    return textoError === "";
  }

  // Valida los límites del contenido antes de permitir que se guarde localmente.
  function validarFormulario() {
    return [campoNombre, campoCategoria, campoFrase, campoAceptacion].map(validarCampo).every(Boolean);
  }

  [campoNombre, campoCategoria, campoFrase, campoAceptacion].forEach((campo) => {
    const evento = campo === campoCategoria || campo === campoAceptacion ? "change" : "input";
    campo.addEventListener(evento, () => {
      validarCampo(campo);
      if (!formulario.querySelector('[aria-invalid="true"]')) {
        mensajeFormulario.textContent = "";
      }
    });
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    mensajeFormulario.textContent = "";
    if (!validarFormulario()) {
      mensajeFormulario.textContent = "Revisa los campos marcados antes de guardar tu frase.";
      formulario.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    const propuestasGuardadas = window.ZenitApp && typeof window.ZenitApp.guardarAlmacenamiento === "function" ? window.ZenitApp : null;
    if (!propuestasGuardadas) {
      mensajeFormulario.textContent = "No se pudo cargar el guardado local. Recarga la página e inténtalo de nuevo.";
      console.error("No está disponible la función de almacenamiento de ZENIT.");
      return;
    }
    const nombre = campoNombre.value.trim();
    const categoria = campoCategoria.value;
    const texto = campoFrase.value.trim();
    const propuestasLocales = leerPropuestasLocales();
    const nuevaPropuesta = { id: crearIdLocal(), categoria, tema: "Propuesta personal", texto, autor: nombre };
    propuestasLocales.push(nuevaPropuesta);
    if (!window.ZenitApp.guardarAlmacenamiento("zenit-propuestas", propuestasLocales)) {
      mensajeFormulario.textContent = "No se pudo guardar. Revisa el almacenamiento de este navegador e inténtalo otra vez.";
      return;
    }
    window.ZenitApp.agregarPropuesta(nuevaPropuesta);
    formulario.reset();
    formulario.querySelectorAll("[aria-invalid]").forEach((campo) => campo.removeAttribute("aria-invalid"));
    formulario.querySelectorAll(".is-invalid").forEach((campo) => campo.classList.remove("is-invalid"));
    formulario.querySelectorAll(".error").forEach((mensaje) => { mensaje.textContent = ""; });
    mensajeFormulario.textContent = "Tu frase ya forma parte de este navegador.";
    mostrarConfirmacion();
  });

  function leerPropuestasLocales() {
    try {
      const guardado = window.localStorage.getItem("zenit-propuestas");
      if (!guardado) { return []; }
      const propuestas = JSON.parse(guardado);
      if (!Array.isArray(propuestas)) {
        window.ZenitApp.mostrarMensaje("Las propuestas guardadas tenían un formato distinto y se ignoraron.");
        return [];
      }
      return propuestas.filter((propuesta) => propuesta && typeof propuesta.id === "string" && typeof propuesta.texto === "string" && typeof propuesta.autor === "string" && categoriasPermitidas.includes(propuesta.categoria));
    } catch (error) {
      console.error("No se pudieron leer las propuestas locales.", error);
      window.ZenitApp.mostrarMensaje("No se pudieron leer propuestas anteriores; se intentará guardar esta frase de todos modos.");
      return [];
    }
  }

  function crearIdLocal() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") { return `propuesta-${window.crypto.randomUUID()}`; }
    return `propuesta-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function mostrarConfirmacion() {
    if (window.Swal && typeof window.Swal.fire === "function") {
      window.Swal.fire({ icon: "success", title: "Guardada en tu universo", text: "La frase se conserva solo en este navegador.", confirmButtonText: "Seguir explorando", background: "#17172d", color: "#f0edf8", confirmButtonColor: "#a99ae8" });
      return;
    }
    console.info("SweetAlert2 no está disponible; el mensaje de éxito permanece en el formulario.");
  }
})();
