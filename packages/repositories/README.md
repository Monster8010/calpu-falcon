# `@calpulli/repositories`

## Responsabilidad

Expone consultas y mutaciones orientadas al dominio sin filtrar detalles de SAF a pantallas o hooks. También centraliza selectores para contenido público y vistas de gestión.

## Exports

- Contratos y contexto de repositorio.
- Implementaciones para configuración, demo, departamentos, feria, solicitudes, mesas, emprendimientos, Marketplace, moderación, historias, publicaciones y tutorías.
- Selectores de contenido, feria y administración.

## Dependencias

- `@calpulli/domain`.
- `@calpulli/shared-store`.
- `@calpulli/mock-data` solo como dependencia de desarrollo para pruebas.

## Consumidores

Los servicios y hooks de ambas aplicaciones.

## Restricciones

- No implementar acceso a archivos desde pantallas.
- Preservar validaciones y transiciones de dominio.
- Ocultar de consultas públicas borradores, contenido moderado y entidades inactivas.
- Mantener la asignación de mesa y solicitud dentro de una mutación coherente.

## Validación

```bash
npm run typecheck --workspace=@calpulli/repositories
npm run test --workspace=@calpulli/repositories
```
