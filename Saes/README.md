# SAES UPIICSA

Producto relacionado para mejorar la presentación y accesibilidad de SAES sin alterar navegación, formularios ni operaciones académicas. No forma parte de la arquitectura de almacenamiento de las dos apps Calpulli.

## Carpetas

- [`extension/`](extension/README.md): extensión Manifest V3 y código ejecutable.
- [`docs/`](docs/00_INDICE.md): análisis, arquitectura, rutas, UX y backlog.
- `saes-source-snapshot/`: extracción privada de referencia; permanece local y está excluida de Git.

## Documento técnico principal

Consulte [`docs/08_ESTRUCTURA_COMPORTAMIENTO_EXTENSION.md`](docs/08_ESTRUCTURA_COMPORTAMIENTO_EXTENSION.md) para entender cómo debe comportarse la extensión frente a ASP.NET Web Forms, `__doPostBack`, el menú y el diseño responsive.

## Regla de trabajo

La extensión modifica presentación y accesibilidad. No reemplaza `href`, formularios, postbacks, campos ocultos ni datos del alumno. El snapshot privado no debe publicarse ni usarse como fixture.
