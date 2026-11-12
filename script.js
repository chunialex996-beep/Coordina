/**
 * Coordina - Prototipo funcional para seguimiento de proyectos académicos
 * Código en JavaScript puro (ES6), sin dependencias externas.
 */

// Clave utilizada para guardar y leer las tareas en el navegador
const CLAVE_ALMACENAMIENTO = "coordina_tareas_guardadas";

// Lista de integrantes válidos y estados permitidos
const RESPONSABLES_VALIDOS = ["Alex", "Marcos", "Emily"];
const ESTADOS_VALIDOS = ["Pendiente", "En curso", "Terminada"];

// Tareas ficticias de demostración (se cargan únicamente si no existen datos previos)
const TAREAS_DEMOSTRACION = [
  {
    id: "ejemplo-1",
    nombre: "Definir objetivos y alcance del documento",
    descripcion:
      "Registro de ejemplo para mostrar una actividad ya concluida con enlace a su archivo.",
    responsable: "Alex",
    fecha: "2026-11-08",
    estado: "Terminada",
    evidencia: "https://docs.google.com/document/",
    esEjemplo: true,
  },
  {
    id: "ejemplo-2",
    nombre: "Diseñar diagrama de arquitectura del sistema",
    descripcion:
      "Registro de ejemplo para representar una tarea que se encuentra actualmente en elaboración.",
    responsable: "Marcos",
    fecha: "2026-11-10",
    estado: "En curso",
    evidencia: "https://drive.google.com/",
    esEjemplo: true,
  },
  {
    id: "ejemplo-3",
    nombre: "Preparar diapositivas para la exposición final",
    descripcion:
      "Registro de ejemplo para mostrar una actividad pendiente que aún no cuenta con enlace a evidencia.",
    responsable: "Emily",
    fecha: "2026-11-11",
    estado: "Pendiente",
    evidencia: "",
    esEjemplo: true,
  },
];

// Estado en memoria de la aplicación
let listaTareas = [];
let temporizadorMensaje = null;
let ultimoElementoEnfocado = null;

// ============================================================================
// REFERENCIAS A ELEMENTOS DEL DOM
// ============================================================================
const contadorPendientes = document.getElementById("contador-pendientes");
const contadorEnCurso = document.getElementById("contador-en-curso");
const contadorTerminadas = document.getElementById("contador-terminadas");

const contenedorTabla = document.getElementById("contenedor-tabla");
const cuerpoTablaTareas = document.getElementById("cuerpo-tabla-tareas");
const estadoVacio = document.getElementById("estado-vacio");
const mensajeRetroalimentacion = document.getElementById(
  "mensaje-retroalimentacion",
);

const btnAgregarTarea = document.getElementById("btn-agregar-tarea");
const btnCrearPrimeraTarea = document.getElementById("btn-crear-primera-tarea");
const btnRestaurarEjemplos = document.getElementById("btn-restaurar-ejemplos");
const btnVaciarTareas = document.getElementById("btn-vaciar-tareas");

// Elementos del modal y formulario
const modalFondo = document.getElementById("modal-fondo");
const modalTitulo = document.getElementById("modal-titulo");
const btnCerrarModal = document.getElementById("btn-cerrar-modal");
const btnCancelar = document.getElementById("btn-cancelar");
const btnEliminarTarea = document.getElementById("btn-eliminar-tarea");
const formularioTarea = document.getElementById("formulario-tarea");

const inputId = document.getElementById("tarea-id");
const inputNombre = document.getElementById("campo-nombre");
const inputDescripcion = document.getElementById("campo-descripcion");
const selectResponsable = document.getElementById("campo-responsable");
const inputFecha = document.getElementById("campo-fecha");
const selectEstado = document.getElementById("campo-estado");
const inputEvidencia = document.getElementById("campo-evidencia");

const bloqueConsultaEvidencia = document.getElementById(
  "bloque-consulta-evidencia",
);
const contenidoEvidenciaActual = document.getElementById(
  "contenido-evidencia-actual",
);

// Elementos para mostrar errores de validación
const errorNombre = document.getElementById("error-nombre");
const errorResponsable = document.getElementById("error-responsable");
const errorFecha = document.getElementById("error-fecha");
const errorEstado = document.getElementById("error-estado");
const errorEvidencia = document.getElementById("error-evidencia");

// ============================================================================
// FUNCIONES DE ALMACENAMIENTO (localStorage)
// ============================================================================

/**
 * Carga las tareas desde localStorage.
 * Si es la primera vez que se abre la página (no existe la clave en localStorage),
 * inicializa la lista con las tres tareas de demostración.
 */
function cargarTareas() {
  const datosGuardados = localStorage.getItem(CLAVE_ALMACENAMIENTO);

  if (datosGuardados === null) {
    // Primera apertura: copiamos los datos de ejemplo y los guardamos
    listaTareas = TAREAS_DEMOSTRACION.map((tarea) => ({ ...tarea }));
    guardarTareas();
    return;
  }

  try {
    const datosParseados = JSON.parse(datosGuardados);
    if (Array.isArray(datosParseados)) {
      listaTareas = datosParseados;
    } else {
      listaTareas = [];
    }
  } catch (error) {
    console.error("Error al leer los datos guardados en el navegador:", error);
    listaTareas = [];
  }
}

/**
 * Guarda el arreglo actual de tareas en localStorage.
 */
function guardarTareas() {
  localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(listaTareas));
}

/**
 * Genera un identificador único sencillo para cada nueva tarea.
 */
function generarIdUnico() {
  return "tarea-" + Date.now() + "-" + Math.floor(Math.random() * 10000);
}

// ============================================================================
// RENDERIZADO DE LA INTERFAZ
// ============================================================================

/**
 * Actualiza tanto los tres contadores superiores como la tabla principal.
 */
function actualizarInterfaz() {
  actualizarContadores();
  renderizarTablaTareas();
}

/**
 * Calcula y muestra el total de tareas Pendientes, En curso y Terminadas.
 */
function actualizarContadores() {
  let pendientes = 0;
  let enCurso = 0;
  let terminadas = 0;

  for (const tarea of listaTareas) {
    if (tarea.estado === "Pendiente") {
      pendientes++;
    } else if (tarea.estado === "En curso") {
      enCurso++;
    } else if (tarea.estado === "Terminada") {
      terminadas++;
    }
  }

  contadorPendientes.textContent = String(pendientes);
  contadorEnCurso.textContent = String(enCurso);
  contadorTerminadas.textContent = String(terminadas);
}

/**
 * Da formato legible en español a una fecha en formato YYYY-MM-DD.
 */
function formatearFecha(fechaISO) {
  if (!fechaISO) return "Sin fecha";
  const partes = fechaISO.split("-");
  if (partes.length !== 3) return fechaISO;

  const meses = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ];
  const anio = partes[0];
  const mesIndice = parseInt(partes[1], 10) - 1;
  const dia = parseInt(partes[2], 10);

  if (mesIndice < 0 || mesIndice > 11 || isNaN(dia)) {
    return fechaISO;
  }

  return `${dia} ${meses[mesIndice]} ${anio}`;
}

/**
 * Devuelve la clase CSS correspondiente al estado de la tarea.
 */
function obtenerClaseEstado(estado) {
  if (estado === "Pendiente") return "estado-pendiente";
  if (estado === "En curso") return "estado-en-curso";
  if (estado === "Terminada") return "estado-terminada";
  return "estado-pendiente";
}

/**
 * Construye las filas de la tabla utilizando creación segura de nodos DOM
 * (textContent) para presentar siempre el texto sin interpretarlo como HTML.
 */
function renderizarTablaTareas() {
  cuerpoTablaTareas.innerHTML = "";

  if (listaTareas.length === 0) {
    contenedorTabla.classList.add("oculto");
    estadoVacio.classList.remove("oculto");
    btnVaciarTareas.classList.add("oculto");
    return;
  }

  contenedorTabla.classList.remove("oculto");
  estadoVacio.classList.add("oculto");
  btnVaciarTareas.classList.remove("oculto");

  for (const tarea of listaTareas) {
    const fila = document.createElement("tr");

    // 1. Celda: Nombre de la tarea (e indicador si es un registro de ejemplo)
    const celdaNombre = document.createElement("td");
    celdaNombre.setAttribute("data-etiqueta", "Nombre de la tarea");
    celdaNombre.className = "celda-nombre";

    const textoNombre = document.createElement("span");
    textoNombre.textContent = tarea.nombre;
    celdaNombre.appendChild(textoNombre);

    if (tarea.esEjemplo) {
      const insigniaEjemplo = document.createElement("span");
      insigniaEjemplo.className = "etiqueta-ejemplo";
      insigniaEjemplo.textContent = "Ejemplo";
      insigniaEjemplo.title = "Registro ficticio de demostración";
      celdaNombre.appendChild(insigniaEjemplo);
    }

    // 2. Celda: Responsable
    const celdaResponsable = document.createElement("td");
    celdaResponsable.setAttribute("data-etiqueta", "Responsable");
    celdaResponsable.textContent = tarea.responsable;

    // 3. Celda: Fecha de entrega
    const celdaFecha = document.createElement("td");
    celdaFecha.setAttribute("data-etiqueta", "Fecha de entrega");
    celdaFecha.textContent = formatearFecha(tarea.fecha);

    // 4. Celda: Estado (distinguible por texto explícito y color)
    const celdaEstado = document.createElement("td");
    celdaEstado.setAttribute("data-etiqueta", "Estado");

    const insigniaEstado = document.createElement("span");
    insigniaEstado.className = `insignia-estado ${obtenerClaseEstado(tarea.estado)}`;
    insigniaEstado.textContent = tarea.estado;
    celdaEstado.appendChild(insigniaEstado);

    // 5. Celda: Botón "Ver detalle"
    const celdaAccion = document.createElement("td");
    celdaAccion.setAttribute("data-etiqueta", "Acción");
    celdaAccion.className = "columna-accion";

    const botonDetalle = document.createElement("button");
    botonDetalle.type = "button";
    botonDetalle.className = "boton boton-detalle";
    botonDetalle.textContent = "Ver detalle";
    botonDetalle.addEventListener("click", () => {
      abrirModalDetalle(tarea.id, botonDetalle);
    });

    celdaAccion.appendChild(botonDetalle);

    // Agregar todas las celdas a la fila
    fila.appendChild(celdaNombre);
    fila.appendChild(celdaResponsable);
    fila.appendChild(celdaFecha);
    fila.appendChild(celdaEstado);
    fila.appendChild(celdaAccion);

    cuerpoTablaTareas.appendChild(fila);
  }
}

/**
 * Muestra un mensaje breve en la parte superior cuando una tarea se crea o actualiza.
 */
function mostrarMensajeBreve(texto) {
  if (temporizadorMensaje) {
    clearTimeout(temporizadorMensaje);
  }

  mensajeRetroalimentacion.textContent = texto;
  mensajeRetroalimentacion.classList.remove("oculto");

  temporizadorMensaje = setTimeout(() => {
    mensajeRetroalimentacion.classList.add("oculto");
  }, 4000);
}

// ============================================================================
// GESTIÓN DEL MODAL Y FORMULARIO (CREAR, CONSULTAR DETALLE Y EDITAR)
// ============================================================================

/**
 * Limpia todos los mensajes y estilos de error del formulario.
 */
function limpiarErroresFormulario() {
  const paresError = [
    [inputNombre, errorNombre],
    [selectResponsable, errorResponsable],
    [inputFecha, errorFecha],
    [selectEstado, errorEstado],
    [inputEvidencia, errorEvidencia],
  ];

  for (const [campo, contenedorError] of paresError) {
    campo.classList.remove("campo-invalido");
    contenedorError.textContent = "";
    contenedorError.classList.add("oculto");
  }
}

/**
 * Actualiza el recuadro de consulta de evidencia dentro del detalle de la tarea.
 * Muestra el botón "Abrir evidencia" (en otra pestaña) o "Sin evidencia registrada".
 */
function actualizarVistaEvidenciaActual(urlEvidencia) {
  contenidoEvidenciaActual.innerHTML = "";
  const urlLimpia = (urlEvidencia || "").trim();

  if (esUrlHttpValida(urlLimpia)) {
    const enlaceBoton = document.createElement("a");
    enlaceBoton.href = urlLimpia;
    enlaceBoton.target = "_blank";
    enlaceBoton.rel = "noopener noreferrer";
    enlaceBoton.className = "boton boton-primario";
    enlaceBoton.textContent = "Abrir evidencia";
    contenidoEvidenciaActual.appendChild(enlaceBoton);
  } else {
    const textoSinEvidencia = document.createElement("span");
    textoSinEvidencia.className = "sin-evidencia";
    textoSinEvidencia.textContent = "Sin evidencia registrada";
    contenidoEvidenciaActual.appendChild(textoSinEvidencia);
  }
}

/**
 * Abre el modal limpio para registrar una nueva tarea.
 */
function abrirModalNuevaTarea(elementoOrigen) {
  ultimoElementoEnfocado = elementoOrigen || document.activeElement;
  limpiarErroresFormulario();
  formularioTarea.reset();

  inputId.value = "";
  selectEstado.value = "Pendiente";
  modalTitulo.textContent = "Agregar tarea";

  bloqueConsultaEvidencia.classList.add("oculto");
  btnEliminarTarea.classList.add("oculto");

  modalFondo.classList.remove("oculto");
  modalFondo.setAttribute("aria-hidden", "false");
  inputNombre.focus();
}

/**
 * Abre el modal con los datos de una tarea existente para consultar su detalle o editarla.
 */
function abrirModalDetalle(idTarea, elementoOrigen) {
  const tarea = listaTareas.find((item) => item.id === idTarea);
  if (!tarea) return;

  ultimoElementoEnfocado = elementoOrigen || document.activeElement;
  limpiarErroresFormulario();

  inputId.value = tarea.id;
  inputNombre.value = tarea.nombre;
  inputDescripcion.value = tarea.descripcion || "";
  selectResponsable.value = tarea.responsable;
  inputFecha.value = tarea.fecha;
  selectEstado.value = tarea.estado;
  inputEvidencia.value = tarea.evidencia || "";

  modalTitulo.textContent = "Detalle y edición de tarea";
  bloqueConsultaEvidencia.classList.remove("oculto");
  btnEliminarTarea.classList.remove("oculto");

  actualizarVistaEvidenciaActual(tarea.evidencia);

  modalFondo.classList.remove("oculto");
  modalFondo.setAttribute("aria-hidden", "false");
  inputNombre.focus();
}

/**
 * Cierra el modal sin guardar cambios y devuelve el foco al botón que lo abrió.
 */
function cerrarModal() {
  modalFondo.classList.add("oculto");
  modalFondo.setAttribute("aria-hidden", "true");
  limpiarErroresFormulario();

  if (
    ultimoElementoEnfocado &&
    typeof ultimoElementoEnfocado.focus === "function"
  ) {
    ultimoElementoEnfocado.focus();
  }
}

// ============================================================================
// VALIDACIONES
// ============================================================================

/**
 * Comprueba si una cadena es una dirección web válida con protocolo http: o https:
 */
function esUrlHttpValida(cadena) {
  if (!cadena) return false;
  try {
    const objetoUrl = new URL(cadena);
    return objetoUrl.protocol === "http:" || objetoUrl.protocol === "https:";
  } catch (_) {
    return false;
  }
}

/**
 * Muestra un mensaje de error asociado a un campo específico del formulario.
 */
function mostrarErrorCampo(inputElemento, elementoError, mensaje) {
  inputElemento.classList.add("campo-invalido");
  elementoError.textContent = mensaje;
  elementoError.classList.remove("oculto");
}

/**
 * Valida todos los datos del formulario sin borrar los demás valores ingresados.
 * Devuelve true si todo es válido, o false si existe algún error.
 */
function validarFormulario() {
  limpiarErroresFormulario();
  let esValido = true;
  let primerCampoConError = null;

  const valorNombre = inputNombre.value.trim();
  const valorResponsable = selectResponsable.value;
  const valorFecha = inputFecha.value.trim();
  const valorEstado = selectEstado.value;
  const valorEvidencia = inputEvidencia.value.trim();

  // 1. Validar nombre obligatorio (rechaza vacíos o solo espacios)
  if (valorNombre.length === 0) {
    mostrarErrorCampo(
      inputNombre,
      errorNombre,
      "El nombre de la tarea es obligatorio y no puede contener solo espacios.",
    );
    esValido = false;
    primerCampoConError = primerCampoConError || inputNombre;
  }

  // 2. Validar responsable obligatorio
  if (!RESPONSABLES_VALIDOS.includes(valorResponsable)) {
    mostrarErrorCampo(
      selectResponsable,
      errorResponsable,
      "Selecciona un responsable válido (Alex, Marcos o Emily).",
    );
    esValido = false;
    primerCampoConError = primerCampoConError || selectResponsable;
  }

  // 3. Validar fecha de entrega obligatoria
  if (valorFecha.length === 0) {
    mostrarErrorCampo(
      inputFecha,
      errorFecha,
      "La fecha de entrega es obligatoria.",
    );
    esValido = false;
    primerCampoConError = primerCampoConError || inputFecha;
  }

  // 4. Validar estado obligatorio
  if (!ESTADOS_VALIDOS.includes(valorEstado)) {
    mostrarErrorCampo(
      selectEstado,
      errorEstado,
      "Selecciona un estado válido para la tarea.",
    );
    esValido = false;
    primerCampoConError = primerCampoConError || selectEstado;
  }

  // 5. Validar enlace a evidencia (opcional, pero si se ingresa debe ser http o https)
  if (valorEvidencia.length > 0 && !esUrlHttpValida(valorEvidencia)) {
    mostrarErrorCampo(
      inputEvidencia,
      errorEvidencia,
      "Ingresa un enlace válido que comience con http:// o https://",
    );
    esValido = false;
    primerCampoConError = primerCampoConError || inputEvidencia;
  }

  if (primerCampoConError) {
    primerCampoConError.focus();
  }

  return esValido;
}

// ============================================================================
// MANEJO DE EVENTOS
// ============================================================================

/**
 * Procesa el guardado del formulario (creación o edición).
 */
function manejarGuardadoFormulario(evento) {
  evento.preventDefault();

  if (!validarFormulario()) {
    return;
  }

  const idActual = inputId.value.trim();
  const datosTarea = {
    nombre: inputNombre.value.trim(),
    descripcion: inputDescripcion.value.trim(),
    responsable: selectResponsable.value,
    fecha: inputFecha.value.trim(),
    estado: selectEstado.value,
    evidencia: inputEvidencia.value.trim(),
  };

  if (idActual === "") {
    // Crear nueva tarea con identificador único
    const nuevaTarea = {
      id: generarIdUnico(),
      ...datosTarea,
      esEjemplo: false,
    };
    listaTareas.push(nuevaTarea);
    guardarTareas();
    actualizarInterfaz();
    cerrarModal();
    mostrarMensajeBreve(
      `Se creó la tarea "${nuevaTarea.nombre}" correctamente.`,
    );
  } else {
    // Editar tarea existente sin duplicarla
    const indice = listaTareas.findIndex((item) => item.id === idActual);
    if (indice !== -1) {
      listaTareas[indice] = {
        ...listaTareas[indice],
        ...datosTarea,
      };
      guardarTareas();
      actualizarInterfaz();
      cerrarModal();
      mostrarMensajeBreve(
        `Se actualizaron los datos de la tarea "${datosTarea.nombre}".`,
      );
    }
  }
}

/**
 * Elimina la tarea que se está consultando en el modal.
 */
function manejarEliminarTareaActual() {
  const idActual = inputId.value.trim();
  if (!idActual) return;

  const tarea = listaTareas.find((item) => item.id === idActual);
  if (!tarea) return;

  listaTareas = listaTareas.filter((item) => item.id !== idActual);
  guardarTareas();
  actualizarInterfaz();
  cerrarModal();
  mostrarMensajeBreve(`Se eliminó la tarea "${tarea.nombre}".`);
}

/**
 * Vacía todas las tareas para permitir comprobar y mostrar el estado vacío.
 */
function manejarVaciarTareas() {
  listaTareas = [];
  guardarTareas();
  actualizarInterfaz();
  mostrarMensajeBreve("Se vació la lista de tareas.");
}

/**
 * Restaura las tres tareas de demostración cuando la lista está vacía.
 */
function manejarRestaurarEjemplos() {
  listaTareas = TAREAS_DEMOSTRACION.map((tarea) => ({ ...tarea }));
  guardarTareas();
  actualizarInterfaz();
  mostrarMensajeBreve("Se cargaron nuevamente las tres tareas de ejemplo.");
}

// Actualizar la vista previa del botón "Abrir evidencia" en tiempo real al editar el campo
inputEvidencia.addEventListener("input", () => {
  if (!bloqueConsultaEvidencia.classList.contains("oculto")) {
    actualizarVistaEvidenciaActual(inputEvidencia.value);
  }
});

// Eventos principales de apertura y cierre
btnAgregarTarea.addEventListener("click", () =>
  abrirModalNuevaTarea(btnAgregarTarea),
);
btnCrearPrimeraTarea.addEventListener("click", () =>
  abrirModalNuevaTarea(btnCrearPrimeraTarea),
);
btnRestaurarEjemplos.addEventListener("click", manejarRestaurarEjemplos);
btnVaciarTareas.addEventListener("click", manejarVaciarTareas);

btnCerrarModal.addEventListener("click", cerrarModal);
btnCancelar.addEventListener("click", cerrarModal);
btnEliminarTarea.addEventListener("click", manejarEliminarTareaActual);
formularioTarea.addEventListener("submit", manejarGuardadoFormulario);

// Cerrar el modal al hacer clic fuera del cuadro de diálogo
modalFondo.addEventListener("click", (evento) => {
  if (evento.target === modalFondo) {
    cerrarModal();
  }
});

// Cerrar el modal al presionar la tecla Escape
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && !modalFondo.classList.contains("oculto")) {
    cerrarModal();
  }
});

// Inicializar la aplicación al cargar la página
cargarTareas();
actualizarInterfaz();
