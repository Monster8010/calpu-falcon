# Guía de incorporación

## Propósito

Dar a una persona nueva una ruta clara para entender el proyecto, ejecutar las apps, validar el flujo principal y empezar a contribuir.

## Ruta recomendada

### Primer bloque: contexto

1. Leer este documento.
2. Leer [Resumen y contexto](02_RESUMEN_Y_CONTEXTO.md).
3. Leer [Producto y alcance](03_PRODUCTO_Y_ALCANCE.md).
4. Revisar `contexto_upiicsa_calpulli.md` para la historia completa de producto y marca.

### Segundo bloque: producto

1. Leer [Apps y roles](04_APPS_Y_ROLES.md).
2. Ejecutar el recorrido descrito en [Demo y liberación](12_DEMO_Y_LIBERACION.md).
3. Revisar `docs/04_APP_CALPULLI_UI_FUNCTIONAL.md` y `docs/05_APP_GESTION_UI_FUNCTIONAL.md` cuando se trabaje una pantalla concreta.

### Tercer bloque: técnica

1. Leer [Arquitectura técnica](05_ARQUITECTURA_TECNICA.md).
2. Leer [Interoperabilidad offline](06_INTEROPERABILIDAD_OFFLINE.md).
3. Leer [Contratos de datos](07_CONTRATOS_DE_DATOS.md).
4. Leer [Estructura del repositorio](08_ESTRUCTURA_DEL_REPOSITORIO.md).
5. Seguir [Instalación y ejecución](09_INSTALACION_Y_EJECUCION.md).

### Cuarto bloque: calidad

1. Leer [Flujos operativos](10_FLUJOS_OPERATIVOS.md).
2. Leer [Pruebas y aceptación](11_PRUEBAS_Y_ACEPTACION.md).
3. Revisar `docs/13_STAGE_18_ACCEPTANCE_REPORT.md` para distinguir evidencia automatizada de prueba manual.
4. Leer [Riesgos y pendientes](17_RIESGOS_Y_PENDIENTES.md).

## Primeras tareas prácticas

- Arrancar ambas apps en puertos distintos.
- Conectar las dos apps a la misma carpeta SAF.
- Inicializar el seed desde Gestión.
- Crear una publicación urgente y verla en la app pública.
- Solicitar y aprobar una mesa de feria.
- Editar una tutoría y comprobar el refresco.
- Ocultar y restaurar una publicación como Moderador.
- Ejecutar typecheck y pruebas.

## Reglas que no se deben romper

- No agregar backend, API, login, nube ni sincronización remota durante el MVP.
- No usar el almacenamiento privado de cada app como fuente compartida.
- No escribir estado compartido desde pantallas; usar repositorios y `SharedStore`.
- No llamar autenticación al selector de roles demo.
- No declarar aprobada una prueba manual solo porque pasó un test automatizado.
- No presentar Calpulli como producto oficial de UPIICSA o del IPN sin autorización formal.

## Cómo presentar avances

Cada avance debe indicar:

- qué cambió;
- qué archivos o flujos afecta;
- qué pruebas se ejecutaron;
- qué evidencia es automatizada;
- qué verificación manual sigue pendiente;
- qué decisión o riesgo puede verse afectado.
