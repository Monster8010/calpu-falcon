# `@calpulli/domain`

## Responsabilidad

Fuente única de contratos, estados y reglas de negocio compartidas por las dos aplicaciones. No conoce Expo, SAF ni componentes de interfaz.

## Exports

Exporta tipos y utilidades de departamentos, publicaciones, historias, feria, mesas, solicitudes, emprendimientos, Marketplace, tutorías, favoritos locales, configuración, fecha/hora y validadores.

## Dependencias

No declara dependencias de runtime. Sus pruebas usan las herramientas del monorepo.

## Consumidores

`shared-store`, `repositories`, `mock-data` y ambas aplicaciones.

## Restricciones

- No depender de una app o de infraestructura.
- No duplicar contratos dentro de las aplicaciones.
- IDs como `string` y fechas persistidas en ISO 8601.
- Las reglas de visibilidad y transición deben vivir aquí o en repositorios, no en pantallas.

## Validación

```bash
npm run typecheck --workspace=@calpulli/domain
npm run test --workspace=@calpulli/domain
```
