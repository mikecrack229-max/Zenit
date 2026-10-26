// Activa la validación y el guardado local del formulario personal.
(() => { // Mantiene privadas las variables del formulario.
  "use strict"; // Ayuda a detectar errores comunes de JavaScript.
  const formulario = document.querySelector("#formulario-frase"); // Busca el formulario solo en la página de constelación.
  if (!formulario) { return; } // Termina este archivo sin error en las otras páginas.
  const campoNombre = formulario.querySelector("#nombre-propuesta"); // Busca el campo para nombre o seudónimo.
  const campoCategoria = formulario.querySelector("#categoria-propuesta"); // Busca el selector de categoría.
  const campoFrase = formulario.querySelector("#texto-propuesta"); // Busca el área donde se escribe la frase.
  const campoAceptacion = formulario.querySelector("#aceptar-local"); // Busca la casilla de almacenamiento local.
  const mensajeFormulario = formulario.querySelector("#mensaje-formulario"); // Busca el lugar para validaciones y confirmaciones.
  const categoriasPermitidas = ["amor", "orgullo", "renacer"]; // Lista las categorías disponibles en este formulario.

  // Coloca un mensaje de error y marca el campo que necesita atención.
  function mostrarError(campo, idMensaje, texto) { // Recibe el campo, su mensaje y el texto que se debe explicar.
    const mensaje = formulario.querySelector(`#${idMensaje}`); // Busca el espacio de error asociado al control.
    mensaje.textContent = texto; // Muestra el error como texto seguro.
    campo.setAttribute("aria-invalid", texto ? "true" : "false"); // Indica a las tecnologías de apoyo si el campo es inválido.
  } // Termina la función de error.

  // Revisa todos los datos antes de guardar una propuesta.
  function validarFormulario() { // Devuelve true solo cuando los campos cumplen las reglas.
    const nombre = campoNombre.value.trim(); // Quita espacios sobrantes al principio y al final.
    const categoria = campoCategoria.value; // Lee la categoría elegida.
    const texto = campoFrase.value.trim(); // Limpia espacios sobrantes de la frase.
    const nombreValido = nombre.length >= 2 && nombre.length <= 30; // Exige un nombre breve pero reconocible.
    const categoriaValida = categoriasPermitidas.includes(categoria); // Acepta solo opciones que existen en el catálogo.
    const fraseValida = texto.length >= 10 && texto.length <= 240; // Limita la frase a una longitud fácil de revisar.
    const aceptacionValida = campoAceptacion.checked; // Comprueba que la persona comprenda dónde se guarda su texto.
    mostrarError(campoNombre, "error-nombre", nombreValido ? "" : "Escribe un nombre de al menos 2 caracteres."); // Explica cómo corregir el nombre.
    mostrarError(campoCategoria, "error-categoria", categoriaValida ? "" : "Elige una de las categorías disponibles."); // Explica cómo elegir una categoría.
    mostrarError(campoFrase, "error-frase", fraseValida ? "" : "Escribe una frase de entre 10 y 240 caracteres."); // Explica la longitud permitida.
    mostrarError(campoAceptacion, "error-aceptar", aceptacionValida ? "" : "Confirma que la frase se guardará solo en este navegador."); // Explica por qué se necesita aceptar.
    return nombreValido && categoriaValida && fraseValida && aceptacionValida; // Informa si todos los controles son válidos.
  } // Termina la validación.

  // Escucha el envío para impedir la recarga y guardar solo datos correctos.
  formulario.addEventListener("submit", (evento) => { // Ejecuta esta función al intentar enviar el formulario.
    evento.preventDefault(); // Mantiene la página abierta y permite mostrar mensajes propios.
    mensajeFormulario.textContent = ""; // Limpia el mensaje anterior antes de validar otra vez.
    if (!validarFormulario()) { // Comprueba los campos antes de crear una propuesta.
      mensajeFormulario.textContent = "Revisa los campos marcados antes de guardar tu frase."; // Anuncia que hay errores por corregir.
      formulario.querySelector('[aria-invalid="true"]')?.focus(); // Lleva el foco al primer campo inválido para ayudar a corregirlo.
      return; // No guarda una propuesta con datos incompletos.
    } // Termina el caso de formulario inválido.
    const propuestasGuardadas = window.ZenitApp && typeof window.ZenitApp.guardarAlmacenamiento === "function" ? window.ZenitApp : null; // Comprueba que el archivo de la aplicación esté disponible.
    if (!propuestasGuardadas) { // Atiende un orden de scripts incorrecto o un archivo que no cargó.
      mensajeFormulario.textContent = "No se pudo cargar el guardado local. Recarga la página e inténtalo de nuevo."; // Explica el problema sin fingir que se guardó.
      console.error("No está disponible la función de almacenamiento de ZENIT."); // Deja una pista para revisar la consola.
      return; // Detiene el envío cuando falta la función requerida.
    } // Termina la comprobación de la aplicación compartida.
    const nombre = campoNombre.value.trim(); // Conserva el nombre ya validado.
    const categoria = campoCategoria.value; // Conserva la categoría ya validada.
    const texto = campoFrase.value.trim(); // Conserva la frase ya validada.
    const propuestasLocales = leerPropuestasLocales(); // Lee las propuestas anteriores para no reemplazarlas.
    const nuevaPropuesta = { id: crearIdLocal(), categoria, tema: "Propuesta personal", texto, autor: nombre }; // Forma el objeto que se guarda en el navegador.
    propuestasLocales.push(nuevaPropuesta); // Agrega la frase nueva después de las propuestas previas.
    if (!window.ZenitApp.guardarAlmacenamiento("zenit-propuestas", propuestasLocales)) { // Guarda todas las propuestas en una sola lista.
      mensajeFormulario.textContent = "No se pudo guardar. Revisa el almacenamiento de este navegador e inténtalo otra vez."; // Informa que el guardado local falló.
      return; // Evita limpiar los campos cuando no se guardó.
    } // Termina el intento de guardado.
    window.ZenitApp.agregarPropuesta(nuevaPropuesta); // Actualiza el catálogo sin alterar las frases originales.
    formulario.reset(); // Limpia los campos después de guardar correctamente.
    formulario.querySelectorAll('[aria-invalid="true"]').forEach((campo) => campo.removeAttribute("aria-invalid")); // Quita las marcas de error anteriores.
    formulario.querySelectorAll(".field-error").forEach((mensaje) => { mensaje.textContent = ""; }); // Limpia los mensajes de error de cada control.
    mensajeFormulario.textContent = "Tu frase ya forma parte de este navegador."; // Confirma el guardado dentro de la página.
    mostrarConfirmacion(); // Muestra también una alerta accesible cuando SweetAlert2 esté disponible.
  }); // Termina el evento de envío.

  // Recupera las propuestas previas y descarta las entradas dañadas.
  function leerPropuestasLocales() { // Devuelve una lista utilizable o informa del problema.
    try { // Controla errores de acceso y de formato de datos.
      const guardado = window.localStorage.getItem("zenit-propuestas"); // Lee las propuestas guardadas previamente.
      if (!guardado) { return []; } // Devuelve una lista vacía si todavía no hay propuestas.
      const propuestas = JSON.parse(guardado); // Convierte el texto guardado en datos de JavaScript.
      if (!Array.isArray(propuestas)) { // Comprueba que el dato leído sea una lista.
        window.ZenitApp.mostrarMensaje("Las propuestas guardadas tenían un formato distinto y se ignoraron."); // Explica el dato inesperado.
        return []; // Evita que un dato mal formado detenga el formulario.
      } // Termina la comprobación del formato.
      return propuestas.filter((propuesta) => propuesta && typeof propuesta.id === "string" && typeof propuesta.texto === "string" && typeof propuesta.autor === "string" && categoriasPermitidas.includes(propuesta.categoria)); // Conserva solo propuestas seguras y completas.
    } catch (error) { // Atiende errores del almacenamiento o de lectura JSON.
      console.error("No se pudieron leer las propuestas locales.", error); // Informa el problema en la consola.
      window.ZenitApp.mostrarMensaje("No se pudieron leer propuestas anteriores; se intentará guardar esta frase de todos modos."); // Explica el comportamiento de recuperación.
      return []; // Permite continuar con una lista vacía si el almacenamiento vuelve a estar disponible.
    } // Termina el manejo de lectura.
  } // Termina la lectura de propuestas anteriores.

  // Crea un identificador distinto para cada propuesta guardada.
  function crearIdLocal() { // Devuelve un texto único sin usar el contenido escrito por la persona.
    if (window.crypto && typeof window.crypto.randomUUID === "function") { return `propuesta-${window.crypto.randomUUID()}`; } // Usa un identificador aleatorio seguro si el navegador lo permite.
    return `propuesta-${Date.now()}-${Math.random().toString(16).slice(2)}`; // Usa hora y una parte aleatoria como alternativa compatible.
  } // Termina la creación de identificadores.

  // Usa SweetAlert2 si cargó y deja el mensaje del formulario como alternativa.
  function mostrarConfirmacion() { // No recibe datos porque el mensaje de éxito ya está definido.
    if (window.Swal && typeof window.Swal.fire === "function") { // Comprueba que la librería externa esté disponible.
      window.Swal.fire({ icon: "success", title: "Guardada en tu universo", text: "La frase se conserva solo en este navegador.", confirmButtonText: "Seguir explorando", background: "#17172d", color: "#f0edf8", confirmButtonColor: "#a99ae8" }); // Confirma el guardado con SweetAlert2.
      return; // Evita mostrar además una alerta nativa.
    } // Termina la comprobación de SweetAlert2.
    console.info("SweetAlert2 no está disponible; el mensaje de éxito permanece en el formulario."); // Deja constancia de la alternativa en la consola.
  } // Termina la confirmación visual.
})(); // Ejecuta la configuración del formulario.
