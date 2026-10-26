// Guarda el catálogo original en una variable global para compartirlo entre las páginas.
window.ZENIT_FRASES = [ // Reúne frases por categorías que usa el buscador y las páginas temáticas.
  { id: "amor-01", categoria: "amor", tema: "Amor propio", texto: "No tienes que ganarte el descanso: también mereces cuidado en los días en que no produces nada." }, // Recuerda que el valor personal no depende de la productividad.
  { id: "amor-02", categoria: "amor", tema: "Enamoramiento", texto: "Qué bonito coincidir con alguien sin dejar de encontrarte contigo." }, // Habla de compartir sin perder la identidad.
  { id: "amor-03", categoria: "amor", tema: "Desamor", texto: "Hay despedidas que no cierran una historia; abren espacio para volver a escucharte." }, // Presenta el final como una oportunidad para volver a sí.
  { id: "amor-04", categoria: "amor", tema: "Nostalgia", texto: "Extrañar también es aceptar que algo fue importante, aunque ya no tenga que volver." }, // Da lugar a la nostalgia sin convertirla en una obligación.
  { id: "amor-05", categoria: "amor", tema: "Aprender a soltar", texto: "Soltar no borra lo vivido; solo deja de pedirle al pasado que cambie." }, // Diferencia soltar de negar los recuerdos.
  { id: "amor-06", categoria: "amor", tema: "Amor propio", texto: "Tu compañía no es un premio de consolación: puede ser un lugar seguro." }, // Valora la relación con uno mismo.
  { id: "amor-07", categoria: "amor", tema: "Despedidas", texto: "A veces querer también significa despedirse sin convertir el cariño en una cadena." }, // Propone una despedida afectuosa y con límites.
  { id: "amor-08", categoria: "amor", tema: "Enamoramiento", texto: "El amor que te hace bien no te pide desaparecer para demostrar que estás." }, // Recuerda que el afecto sano no exige renunciar a uno mismo.
  { id: "amor-09", categoria: "amor", tema: "Nostalgia", texto: "Puedes guardar una canción sin regresar a la persona que te la enseñó." }, // Expresa una manera cotidiana de recordar y seguir.
  { id: "amor-10", categoria: "amor", tema: "Aprender a soltar", texto: "No todo lo que termina fue un error; algunas cosas solo cumplieron su tiempo." }, // Evita interpretar cada final como un fracaso.
  { id: "amor-11", categoria: "amor", tema: "Amor propio", texto: "Háblate como le hablarías a alguien que quieres ver florecer." }, // Invita a tratarse con la misma ternura que a los demás.
  { id: "amor-12", categoria: "amor", tema: "Despedidas", texto: "Cerrar la puerta con calma también es una forma de cuidar lo que quedó de ti." }, // Presenta los límites como una forma de cuidado.
  { id: "orgullo-01", categoria: "orgullo", tema: "Dignidad", texto: "No necesitas elevar la voz para que tus límites sean reales." }, // Recuerda que la firmeza no depende del volumen.
  { id: "orgullo-02", categoria: "orgullo", tema: "Confianza", texto: "No llegaste hasta aquí por casualidad: también hubo decisiones tuyas sosteniéndote." }, // Reconoce la participación propia en el camino recorrido.
  { id: "orgullo-03", categoria: "orgullo", tema: "Límites personales", texto: "Un no a tiempo puede ser un sí a la vida que estás intentando construir." }, // Relaciona los límites con los proyectos personales.
  { id: "orgullo-04", categoria: "orgullo", tema: "Ambición", texto: "Querer más para ti no le quita nada a nadie; solo te invita a moverte." }, // Presenta la ambición como una decisión personal.
  { id: "orgullo-05", categoria: "orgullo", tema: "Seguridad", texto: "No todas las miradas van a entender tu camino, y aun así puedes caminarlo." }, // Anima a confiar en decisiones propias.
  { id: "orgullo-06", categoria: "orgullo", tema: "Orgullo personal", texto: "Celebra también a quien fuiste cuando nadie vio el esfuerzo." }, // Hace visible el trabajo que ocurre en silencio.
  { id: "orgullo-07", categoria: "orgullo", tema: "Dignidad", texto: "Tu valor no entra en una negociación donde siempre eres tú quien cede." }, // Refuerza la dignidad en los vínculos.
  { id: "orgullo-08", categoria: "orgullo", tema: "Confianza", texto: "Puedes dudar y seguir adelante; la confianza no siempre llega primero." }, // Desmitifica la idea de que hay que sentirse seguro para actuar.
  { id: "orgullo-09", categoria: "orgullo", tema: "Límites personales", texto: "Proteger tu calma no te vuelve distante: te vuelve responsable de ti." }, // Normaliza el cuidado de la tranquilidad personal.
  { id: "orgullo-10", categoria: "orgullo", tema: "Ambición", texto: "No achiques tu horizonte para que otros se sientan cómodos mirando." }, // Invita a sostener las propias metas.
  { id: "orgullo-11", categoria: "orgullo", tema: "Seguridad", texto: "Tu ritmo no necesita parecerse al de nadie para ser legítimo." }, // Reconoce que cada proceso tiene su propio ritmo.
  { id: "orgullo-12", categoria: "orgullo", tema: "Orgullo personal", texto: "Hay una fuerza tranquila en dejar de explicarte ante quien ya decidió no escuchar." }, // Sugiere conservar energía cuando no hay escucha.
  { id: "renacer-01", categoria: "renacer", tema: "Disciplina", texto: "La constancia no siempre se siente épica; a veces solo se parece a volver mañana." }, // Presenta la constancia como una decisión cotidiana.
  { id: "renacer-02", categoria: "renacer", tema: "Metas", texto: "Un paso pequeño también cambia la distancia entre tú y lo que sueñas." }, // Reconoce el valor de avanzar de a poco.
  { id: "renacer-03", categoria: "renacer", tema: "Aprender del fracaso", texto: "Fallaste en un intento, no en la posibilidad de aprender algo nuevo." }, // Separa un resultado de la capacidad de aprender.
  { id: "renacer-04", categoria: "renacer", tema: "Crecimiento personal", texto: "Cambiar de idea también puede ser una señal de que estás creciendo." }, // Valida el cambio de opinión como parte del crecimiento.
  { id: "renacer-05", categoria: "renacer", tema: "Motivación", texto: "No esperes sentirte invencible: empieza con lo que tienes y desde donde estás." }, // Anima a empezar sin esperar condiciones perfectas.
  { id: "renacer-06", categoria: "renacer", tema: "Disciplina", texto: "Descansar no rompe tu progreso; también forma parte de poder continuar." }, // Incluye el descanso como parte del proceso.
  { id: "renacer-07", categoria: "renacer", tema: "Metas", texto: "Tu futuro no necesita una versión perfecta de ti, solo una que siga presente." }, // Enfatiza la perseverancia sobre la perfección.
  { id: "renacer-08", categoria: "renacer", tema: "Aprender del fracaso", texto: "Lo que no salió como esperabas todavía puede enseñarte por dónde no volver." }, // Encuentra aprendizaje en un resultado inesperado.
  { id: "renacer-09", categoria: "renacer", tema: "Crecimiento personal", texto: "No eres la misma persona que empezó, y eso también cuenta como avance." }, // Reconoce los cambios internos del camino.
  { id: "renacer-10", categoria: "renacer", tema: "Motivación", texto: "Si hoy solo puedes dar un paso, deja que ese paso sea suficiente por ahora." }, // Acompaña los días con poca energía.
  { id: "renacer-11", categoria: "renacer", tema: "Disciplina", texto: "La versión que admiras de ti se construye con decisiones que casi nadie aplaude." }, // Destaca la práctica cotidiana detrás de los logros.
  { id: "renacer-12", categoria: "renacer", tema: "Metas", texto: "No vas tarde: estás aprendiendo a llegar de una manera que también te cuide." } // Anima a avanzar sin compararse con otros.
]; // Termina el catálogo de frases de ZENIT.
