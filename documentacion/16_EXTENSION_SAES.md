# Extensión SAES

## Propósito

SAES UPIICSA es un producto relacionado dentro de la carpeta. Busca mejorar presentación, responsive y accesibilidad del portal SAES sin cambiar navegación, formularios ni lógica ASP.NET Web Forms.

No es la misma aplicación que Calpulli. Debe documentarse y validarse como una línea de trabajo separada.

## Componentes

```text
Saes/
├── extension/              # Manifest V3 y código ejecutable
├── saes-source-snapshot/   # HTML, CSS, JS e imágenes privadas
└── docs/                   # análisis, rutas, UX, arquitectura y backlog
```

## Estado observable

- Manifest V3.
- Content script en `src/content.js`.
- Preset visual y tokens CSS.
- Módulo de modo oscuro.
- Menú responsive con botón, backdrop y Escape.
- Carga en `https://www.saes.upiicsa.ipn.mx/*`.
- Compatibilidad prevista con conversión Safari Web Extension mediante Xcode.

## Contrato de no interferencia

La extensión puede cambiar colores, tipografía, espaciado, bordes, sombras, ancho de menú y estados visuales.

No debe cambiar:

- `href`;
- `form.action`, `method` o `target`;
- nombres de campos;
- valores ocultos;
- `__VIEWSTATE`;
- `__EVENTVALIDATION`;
- `__EVENTTARGET`;
- `__EVENTARGUMENT`;
- `onclick` o `__doPostBack` existentes;
- envío de formularios;
- datos del alumno.

## Arquitectura observable

SAES usa ASP.NET Web Forms con `aspnetForm`, `__doPostBack`, `WebResource.axd`, `ctl00_mainmenu`, `ctl00_subMenu`, `leftColumn` y `mainColumn`. Los selectores deben ser defensivos y tolerar prefijos `ctl00_`.

## Privacidad

La extensión no debe usar `fetch` externo, registrar datos personales ni guardar datos del alumno. Las preferencias visuales pueden ser locales y no sensibles.

## Pruebas mínimas

- conservar URLs originales;
- conservar postbacks;
- mantener campos ocultos;
- operar menú con teclado y Escape;
- no duplicar estilos ni controles al reinicializar;
- funcionar aunque falte una columna o submenú;
- no transmitir datos a APIs externas.

## Fuentes

Consultar `Saes/docs/00_INDICE.md`, `Saes/docs/06_ARQUITECTURA_EXTENSION.md`, `Saes/docs/08_ESTRUCTURA_COMPORTAMIENTO_EXTENSION.md` y `Saes/extension/README.md`.
