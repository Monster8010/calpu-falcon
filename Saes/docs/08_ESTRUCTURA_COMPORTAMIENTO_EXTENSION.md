# Estructura y comportamiento del SAES para construir la extensión

Este documento describe lo que la extensión debe observar y modificar a partir del snapshot de:

`saes-source-snapshot/saes-page-source.html`

La regla principal es sencilla: **mejorar la presentación sin reemplazar la navegación ni la lógica nativa de SAES**.

## 1. Arquitectura observable

SAES es una aplicación ASP.NET Web Forms. La pantalla usa un formulario principal, controles generados por servidor y recursos `WebResource.axd`.

```text
document
└── html
    ├── head
    │   ├── hojas CSS de Granite/SAES
    │   └── scripts WebForms y configuración del menú
    └── body
        ├── header / identidad institucional
        ├── navegación principal: ctl00_mainmenu
        ├── navegación lateral: ctl00_subMenu dentro de leftColumn
        ├── contenido principal dentro de mainColumn
        ├── avisos / carrusel
        └── footer
```

El formulario principal es `aspnetForm`. Los nombres pueden aparecer con prefijos `ctl00_`, por lo que la extensión debe buscar por IDs y patrones, no depender de una sola clase visual.

## 2. Elementos que la extensión debe detectar

### Formulario y estado WebForms

La página puede incluir:

- `form[name="aspnetForm"]` o `form#aspnetForm`.
- `__VIEWSTATE`.
- `__EVENTVALIDATION`.
- `__EVENTTARGET`.
- `__EVENTARGUMENT`.
- `__doPostBack(eventTarget, eventArgument)`.

Estos campos mantienen el estado que el servidor necesita. No deben eliminarse, renombrarse, serializarse ni reemplazarse.

### Navegación

El snapshot muestra dos capas de menú:

- `ctl00_mainmenu`: menú principal generado por ASP.NET.
- `ctl00_subMenu`: menú lateral del alumno.
- `leftColumn`: columna que contiene el submenú.
- `mainColumn`: zona principal de contenido.
- `SkipLink`: enlaces auxiliares para accesibilidad y navegación por teclado.

El menú enlaza directamente a páginas `.aspx` de información del alumno, boleta, kardex, reinscripciones, ETS, saberes, recuperación, tutores y evaluación docente.

La extensión debe conservar cada `href` original. El cambio recomendado es envolver visualmente el menú, no reconstruir sus enlaces.

## 3. Flujo de ejecución de la extensión

```text
Manifest V3
    ↓
content.js en document_idle
    ↓
esperar DOM estable
    ↓
detectar página SAES y elementos disponibles
    ↓
inyectar tokens + estilos de la extensión una sola vez
    ↓
aplicar preset visual
    ↓
adaptar menú para escritorio/móvil
    ↓
observar cambios parciales del DOM sin duplicar controles
```

### Inicialización

1. Confirmar que `location.hostname` sea `www.saes.upiicsa.ipn.mx`.
2. Crear un identificador propio, por ejemplo `data-saes-extension="1"`.
3. Detectar el formulario y las columnas existentes.
4. Insertar una hoja de estilos propia con `id` estable.
5. Aplicar el preset seleccionado.
6. Añadir controles de la extensión solo si todavía no existen.

La inicialización debe ser idempotente. Esto es importante porque algunas páginas WebForms pueden reconstruir fragmentos del DOM o la extensión puede ejecutarse otra vez al cambiar de ruta.

## 4. Contrato de no interferencia

La extensión puede cambiar:

- colores;
- tipografía;
- espaciado;
- bordes y radios;
- sombras;
- ancho y posición del menú;
- visibilidad responsive;
- imagen o color de fondo;
- estados visuales de botones, enlaces y tablas.

La extensión no debe cambiar automáticamente:

- `href` de enlaces;
- `action`, `method` o `target` de formularios;
- nombres de campos;
- valores de campos ocultos;
- `__VIEWSTATE` o `__EVENTVALIDATION`;
- `onclick` y `__doPostBack` existentes;
- orden semántico de controles;
- datos del alumno;
- envío de formularios.

No se debe interceptar un clic para reemplazar la navegación nativa salvo que exista una necesidad accesible y se conserve el comportamiento original como respaldo.

## 5. Menú responsive

### Escritorio

- Mantener `leftColumn` visible.
- Respetar la jerarquía de enlaces del submenú.
- Permitir desplazamiento vertical si el menú supera la altura de la ventana.
- No tapar el contenido ni los avisos.

### Pantallas pequeñas

- Convertir `leftColumn` en un panel lateral fijo.
- Usar `transform` para abrir y cerrar.
- Añadir un botón con nombre accesible, por ejemplo `Abrir menú SAES`.
- Añadir un backdrop fuera del panel.
- Cerrar con el botón, el backdrop, `Escape` o al activar un enlace.
- Mantener el foco visible y evitar que el panel quede fuera del viewport.
- Restaurar el foco al botón que abrió el menú.

Estados recomendados:

```text
cerrado → abrir → abierto
abierto → enlace/backdrop/Escape → cerrado
```

El estado debe expresarse con un atributo como `aria-expanded` y una clase propia. No se debe depender solamente de `display: none`, porque se pierde control del foco y de las transiciones.

## 6. CSS y recursos del snapshot

Los recursos principales encontrados son:

- `assets/css/Default.css`: layout, controles, tablas, calendarios, modales y clases de SAES.
- `assets/css/carrusel.css`: carrusel de avisos.
- `assets/js/WebResource-1.js`: utilidades de postback de WebForms.
- `assets/js/WebResource-2.js`: comportamiento del menú generado por ASP.NET.
- `assets/js/inline-postback.js`: definición de `__doPostBack`.
- `assets/js/inline-menu-config.js`: configuración de `ctl00_mainmenu` y `ctl00_subMenu`.

No se encontró un framework frontend ni jQuery. Por eso la extensión debe usar CSS y JavaScript nativos, con selectores pequeños y defensivos.

Los recursos originales pueden seguir apuntando a rutas del servidor. La extensión no debe asumir que el HTML se puede abrir offline y funcionar completo.

## 7. Adaptación por ruta

El mismo `content.js` puede funcionar como punto de entrada, pero conviene separar la lógica por tipo de página:

```text
adaptador común
├── detectar shell institucional
├── detectar formulario WebForms
├── aplicar tema
└── adaptar menú

adaptadores por ruta
├── /alumnos/default.aspx
├── /Alumnos/boleta/*
├── /Alumnos/Informacion_semestral/*
├── /Alumnos/Reinscripciones/*
├── /Alumnos/ETS/*
├── /Alumnos/Saberes/*
├── /Alumnos/Recuperacion/*
└── /Alumnos/Tutores/*
```

Cada adaptador debe ser opcional: si la página no contiene el componente esperado, no debe lanzar errores ni bloquear la pantalla.

## 8. Estructura recomendada del proyecto

```text
Saes/
├── extension/
│   ├── manifest.json
│   ├── README.md
│   ├── modo-oscuro/
│       ├── modo-oscuro.css
│       ├── modo-oscuro.js
│       ├── README.md
│       └── ANALISIS.md
│   └── src/
│       ├── content.js
│       ├── apply-theme.js
│       ├── presets/
│       │   └── minimalist.js
│       └── styles/
│           └── tokens.css
├── saes-source-snapshot/
│   ├── saes-page-source.html
│   ├── saes-page-source-legacy.html
│   └── assets/
│       ├── css/
│       ├── images/
│       └── js/
└── docs/
    ├── 00_INDICE.md
    ├── 01_ARQUITECTURA_VISUAL.md
    ├── 02_NAVEGACION_RUTAS.md
    ├── 03_PANTALLAS_COMPONENTES.md
    ├── 04_DATOS_TABLAS_ESTADOS.md
    ├── 05_PROBLEMAS_UX_ACCESIBILIDAD_SEGURIDAD.md
    ├── 06_ARQUITECTURA_EXTENSION.md
    ├── 07_MVP_BACKLOG.md
    └── 08_ESTRUCTURA_COMPORTAMIENTO_EXTENSION.md
```

## 9. Configuración por alumno

La configuración visual debe vivir fuera del HTML de SAES. La primera versión puede usar un objeto de preferencias con valores validados:

```js
{
  preset: 'minimalist',
  backgroundImage: null,
  buttonRadius: '8px',
  menuRadius: '12px',
  accentColor: '#1769aa',
  menuCollapsedOnMobile: true
}
```

Orden recomendado:

1. preset por defecto;
2. preferencias locales del alumno;
3. variables CSS sanitizadas;
4. estilos de componentes.

No se debe insertar texto de preferencias directamente con `innerHTML`. Las imágenes de fondo deben validarse como archivos locales o URLs permitidas antes de asignarlas a CSS.

## 10. Pruebas mínimas antes de cada entrega

- El menú original conserva sus URLs.
- Un enlace de navegación sigue cargando su página SAES.
- Un postback de WebForms no pierde campos ocultos.
- El botón de menú funciona con teclado y lector de pantalla.
- `Escape` cierra el menú móvil.
- No se duplican estilos, botones ni backdrop al reinicializar.
- Las tablas y formularios siguen siendo utilizables en móvil.
- No aparecen errores si faltan `leftColumn`, `mainColumn` o un submenú.
- No se transmiten datos a APIs externas.

## 11. Límites conocidos

El snapshot no contiene el código del servidor, la base de datos ni todas las respuestas de las rutas `.aspx`. Los tokens de `WebResource.axd` pueden cambiar. Por ello, la extensión debe trabajar como una capa de presentación tolerante a cambios y no como una copia del backend.
