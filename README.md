# Coordina — Prototipo de Seguimiento para Proyectos Académicos

**Coordina** es un prototipo web funcional diseñado para ayudar a grupos universitarios a organizar y consultar en un solo lugar las tareas de un proyecto académico, evitando que los acuerdos, avances y enlaces a evidencias se pierdan entre conversaciones de mensajería.

---

## 1. Cómo abrir la página

No se requiere instalar dependencias, servidores ni herramientas de compilación.

1. Abre la carpeta del proyecto en tu computadora.
2. Haz doble clic sobre el archivo **`index.html`** para abrirlo directamente en cualquier navegador web moderno (Chrome, Edge, Firefox, Safari).

---

## 2. Qué hace cada archivo

El proyecto está organizado en cuatro archivos principales con código claro de nivel básico a intermedio:

- **`index.html`**: Define la estructura semántica en español: el encabezado con los datos del proyecto y el aviso del prototipo, las tres tarjetas de contadores (*Pendientes*, *En curso*, *Terminadas*), la tabla de tareas, el estado vacío y la ventana modal con el formulario de creación y edición.
- **`styles.css`**: Contiene el diseño visual con variables CSS, tipografía del sistema, paleta en gris claro (`#f3f4f6`), tarjetas blancas (`#ffffff`) y azul principal (`#2563eb`). Incluye estilos de foco visible para teclado, etiquetas de estado diferenciadas por texto y color, y adaptación responsiva para pantallas de celular.
- **`script.js`**: Implementa la lógica en JavaScript puro: carga inicial de tres tareas marcadas como `Ejemplo`, lectura y escritura en `localStorage`, cálculo automático de contadores, validaciones en español (campos obligatorios y enlaces con `http://` o `https://`), creación/edición sin duplicar registros y renderizado seguro con `textContent` para evitar que el texto se interprete como HTML.
- **`README.md`**: Este documento con las instrucciones de uso, estructura técnica, guía de demostración y limitaciones del prototipo.

---

## 3. Cómo se guardan los datos

- La herramienta utiliza **`localStorage`** del navegador bajo la clave `coordina_tareas_guardadas`.
- **Importante**: Los datos se guardan **únicamente en el navegador y dispositivo donde se abre la página**. No existe un servidor ni base de datos externa, por lo que los cambios **no se sincronizan automáticamente entre distintos integrantes ni entre diferentes dispositivos**.
- En la primera apertura (cuando no hay datos previos en `localStorage`), el sistema carga automáticamente **tres tareas ficticias identificadas con la etiqueta "Ejemplo"** (una *Pendiente*, una *En curso* y una *Terminada*, asignadas a Alex, Marcos y Emily). Si el usuario ya tiene datos guardados o modifica la lista, el sistema respeta su información y no la sobrescribe al recargar.

---

## 4. Cómo demostrar el recorrido ante el docente

Sigue estos pasos durante la presentación para mostrar todas las funciones solicitadas:

1. **Revisión inicial**: Muestra el encabezado con el nombre del proyecto, los tres contadores calculados automáticamente (1 Pendiente, 1 En curso, 1 Terminada) y las tres tareas iniciales etiquetadas como *Ejemplo*.
2. **Crear una tarea y probar validaciones**:
   - Haz clic en **"+ Agregar tarea"**.
   - Intenta guardar dejando el nombre vacío o con espacios, o escribiendo un enlace inválido (por ejemplo `drive.com/archivo`) para mostrar los mensajes de validación en español y cómo se conservan los demás datos ingresados.
   - Completa un nombre real, asigna un responsable (*Alex*, *Marcos* o *Emily*), elige una fecha de entrega y guarda.
3. **Consultar el detalle**:
   - En la fila de la tarea recién creada, presiona **"Ver detalle"**.
   - Muestra cómo aparece la leyenda *"Sin evidencia registrada"* cuando aún no se ha colocado un enlace.
4. **Cambiar estado y agregar evidencia**:
   - Dentro del mismo modal de detalle, cambia el estado a **"En curso"** o **"Terminada"**.
   - Ingresa un enlace válido en el campo de evidencia (por ejemplo, `https://drive.google.com`) y presiona **"Guardar"**.
   - Verifica cómo la tabla y los contadores superiores se actualizan al instante sin duplicar la tarea.
5. **Abrir la evidencia**:
   - Vuelve a presionar **"Ver detalle"** sobre esa tarea y haz clic en el botón **"Abrir evidencia"** para demostrar que se abre en una pestaña nueva.
6. **Comprobar persistencia**:
   - Recarga la página en el navegador (`F5` o `Ctrl + R`) y muestra que todas las tareas creadas y editadas se conservan intactas.
7. **Mostrar el estado vacío (opcional)**:
   - Haz clic en **"Vaciar lista"** para enseñar la pantalla de explicación cuando no hay tareas y el botón para crear la primera tarea o restaurar los ejemplos.

---

## 5. Limitaciones del prototipo

Al tratarse de un prototipo funcional enfocado en el flujo esencial de coordinación académica:

- **Almacenamiento local**: Los datos residen solo en el navegador local (`localStorage`). Si se borra el historial/caché del navegador o se abre en modo incógnito, los cambios no permanecerán al cerrar la sesión.
- **Sin sincronización en tiempo real ni backend**: No cuenta con base de datos en la nube ni actualización en vivo entre varios teléfonos o computadoras.
- **Evidencias mediante enlaces externos**: La página no sube ni almacena archivos pesados (PDF, Word, ZIP); en su lugar, vincula archivos previamente alojados en plataformas como Google Drive, OneDrive o GitHub.
- **Lista fija de integrantes de demostración**: Los responsables seleccionables están acotados a los integrantes del caso de demostración (*Alex*, *Marcos* y *Emily*).
- **Sin módulos adicionales**: No incluye cuentas de usuario, inicio de sesión, chat integrado, notificaciones ni permisos de aprobación.
