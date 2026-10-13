# Estructura del repositorio

## Directorios principales

| Ruta | Contenido |
|---|---|
| `apps/calpulli` | App pública de consulta. |
| `apps/gestion-calpulli` | App de gestión y roles demo. |
| `packages/domain` | Tipos y reglas de dominio. |
| `packages/shared-store` | Persistencia SAF, backups y medios. |
| `packages/repositories` | Acceso a datos y casos de lectura/escritura. |
| `packages/ui` | Tokens y UI compartida. |
| `packages/mock-data` | Seed y fixtures de demo. |
| `docs` | Especificación original del MVP y etapas de desarrollo. |
| `Saes` | Snapshot de SAES, análisis y extensión visual. |
| `Identidad de Imagen` | Logos, glifos, paleta y tipografías. |
| `artifacts/android` | APKs de demostración. |
| `documentacion` | Guía consolidada para incorporación y operación. |

## App pública

```text
apps/calpulli/
├── app/                 # rutas Expo Router
├── features/            # UI por dominio funcional
├── hooks/               # lectura, selección y refresco
├── services/            # gateways y almacenamiento privado
└── test/                # pruebas de selección y presentación
```

## Gestión

```text
apps/gestion-calpulli/
├── app/                 # rutas y selector de roles
├── features/            # dashboards y editores por rol
├── hooks/               # acceso a recursos de gestión
├── services/            # managers y persistencia demo
└── test/                # pruebas de flujos y modelos
```

## Regla de navegación del código

Cuando se cambie una pantalla, revisar primero su ruta, feature, hook, service/repository, contrato de dominio y prueba relacionada. No resolver lógica de dominio directamente dentro de JSX.

## Documentos originales de referencia

- `CODEX.md`: reglas de trabajo para agentes de desarrollo.
- `docs/00_READ_ME_FIRST.md`: arquitectura obligatoria.
- `docs/07_CODEX_DEVELOPMENT_STAGES.md`: etapas y criterios de salida.
- `docs/12_FOLDER_AND_MODULE_BLUEPRINT.md`: blueprint de módulos.
- `docs/13_STAGE_18_ACCEPTANCE_REPORT.md`: evidencia y pendientes de aceptación.

## Archivos que no se deben editar como código fuente

Tratar `node_modules/`, APKs y snapshots de SAES como artefactos o referencias. No modificar el snapshot privado para corregir la extensión.
