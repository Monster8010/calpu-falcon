# Arquitectura propuesta para la extensión

## 1. Objetivo técnico

Construir una WebExtension que inyecte una capa visual local sobre SAES. La aplicación original seguirá siendo la fuente de datos y comportamiento.

```text
Manifest
├── Content script
│   ├── Detecta ruta
│   ├── Detecta plantilla
│   ├── Aplica shell visual
│   ├── Mejora tablas
│   └── Mejora estados y errores
├── CSS global
├── Módulos por pantalla
└── Opciones locales
```

## 2. Estructura inicial recomendada

```text
saes/
├── manifest.json
├── src/
│   ├── content.js
│   ├── router.js
│   ├── constants.js
│   ├── privacy.js
│   ├── modules/
│   │   ├── shell.js
│   │   ├── dashboard.js
│   │   ├── personal-data.js
│   │   ├── kardex.js
│   │   ├── academic-status.js
│   │   ├── schedule.js
│   │   ├── procedures.js
│   │   ├── empty-state.js
│   │   └── server-error.js
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── global.css
│   │   ├── navigation.css
│   │   ├── tables.css
│   │   ├── states.css
│   │   └── responsive.css
│   └── utils/
│       ├── dom.js
│       ├── text.js
│       ├── table.js
│       └── route.js
├── public/
│   ├── icons/
│   └── logo/
├── options/
│   ├── options.html
│   └── options.js
└── README.md
```

## 3. Manifest mínimo conceptual

```json
{
  "manifest_version": 3,
  "name": "SAES UPIICSA UI",
  "version": "0.1.0",
  "description": "Mejoras locales de interfaz para SAES UPIICSA",
  "content_scripts": [
    {
      "matches": ["https://www.saes.upiicsa.ipn.mx/*"],
      "js": ["src/content.js"],
      "css": ["src/styles/global.css"]
    }
  ],
  "options_page": "options/options.html"
}
```

El empaquetado final para Safari requiere convertir la WebExtension en Safari Web Extension mediante Xcode. La lógica de contenido puede mantenerse compartida con Chrome/Edge si se evita depender de APIs específicas.

## 4. Flujo de carga

```text
DOMContentLoaded
    ↓
Leer location.pathname
    ↓
Identificar shell y módulo
    ↓
Aplicar tokens y navegación
    ↓
Ejecutar mejora específica
    ↓
Observar cambios dinámicos
```

## 5. Router de pantalla

```js
const routes = [
  { test: /\/alumnos\/boleta\/kardex\.aspx$/i, load: enhanceKardex },
  { test: /\/alumnos\/boleta\/estado_alumno\.aspx$/i, load: enhanceAcademicStatus },
  { test: /\/informacion_semestral\/horario_alumno\.aspx$/i, load: enhanceSchedule },
  { test: /\/alumnos\/default\.aspx$/i, load: enhanceDashboard }
];
```

Debe existir una pantalla fallback para rutas no reconocidas.

## 6. Shell visual

El módulo `shell.js` debe:

- Añadir una clase raíz como `saes-ui-enhanced`.
- Identificar encabezado, navegación, breadcrumb, menú lateral, contenido y pie.
- Crear botón de menú móvil.
- Añadir grupos visuales sin eliminar enlaces originales.
- Marcar el enlace activo con clase y atributo ARIA.
- Mantener una forma fácil de desactivar la capa.

## 7. Menú lateral

Comportamiento recomendado:

- Escritorio: menú visible y compacto.
- Tablet: menú colapsable.
- Móvil: panel lateral fuera de pantalla con botón de apertura.
- Agrupación: Datos personales, Trámites, Académico, Semestre, Reinscripción, Evaluaciones y Cuenta.
- Búsqueda local opcional.

El agrupamiento debe ser visual. No cambiar los `href` originales.

## 8. Tablas

El módulo de tablas debe:

- Detectar encabezados existentes.
- Añadir wrapper responsive.
- Mantener la tabla original como fuente.
- Añadir búsqueda local solo cuando el contenido sea seguro de procesar.
- Añadir filtros no persistentes o persistidos sin datos personales.
- Añadir encabezado fijo solo cuando no rompa scroll interno.
- Generar vista de tarjetas en móvil.

## 9. Observación de cambios dinámicos

WebForms puede actualizar contenido mediante postbacks o cambios de DOM. Se recomienda un `MutationObserver` con protección contra ciclos:

```js
let enhancing = false;

const observer = new MutationObserver(() => {
  if (enhancing) return;
  enhancing = true;
  try {
    enhanceCurrentPage();
  } finally {
    enhancing = false;
  }
});

observer.observe(document.body, { childList: true, subtree: true });
```

Debe desconectarse o limitarse si genera demasiado trabajo.

## 10. Error de servidor

`server-error.js` debe reconocer señales como:

- `Error de servidor en la aplicación '/'.`
- `ConstraintException`.
- `No se pudieron habilitar las restricciones`.
- `Detalles de la excepción`.

La mejora debe esconder visualmente el stack trace y mostrar un estado de error institucional. No debe borrar la URL ni intentar repetir solicitudes automáticamente en bucle.

## 11. Privacidad técnica

- No usar `fetch` hacia servicios externos.
- No usar `localStorage` para datos del alumno.
- Preferir `sessionStorage` solo para preferencias temporales no sensibles.
- No escribir valores personales en atributos nuevos.
- Evitar `console.log` con nodos completos o `document.body.innerHTML`.
- No solicitar permisos innecesarios.

## 12. Desactivación segura

La extensión debe poder desactivarse desde opciones. Si se elimina la clase raíz y los nodos agregados, la página debe conservar navegación y datos originales.

## 13. Limitaciones conocidas

- No se inspeccionaron todos los formularios.
- No se confirmaron todos los selectores CSS.
- No se debe asumir que una ruta siempre devuelve la misma plantilla.
- Algunas pantallas dependen del estado académico del usuario.
- El contenido puede cambiar por periodo escolar.
- La extensión no puede resolver errores del backend.
