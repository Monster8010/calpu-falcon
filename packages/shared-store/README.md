# `@calpulli/shared-store`

## Responsabilidad

Persistencia local interoperable mediante Android SAF. Localiza y valida el directorio, lee el estado, mantiene backup y metadatos, verifica escrituras y copia medios compartidos.

## Exports

`SharedStore`, contratos de sistema de archivos, utilidades SAF, constantes de archivos, validación, lectura de snapshots, errores y manejo de medios.

## Dependencias

- `@calpulli/domain` para contratos y validación semántica.
- `expo-file-system` 19.0.23 para la integración móvil.

## Consumidores

`@calpulli/repositories` y los servicios de conexión de ambas apps.

## Restricciones

- No reemplazar SAF con almacenamiento privado por app.
- Conservar `calpulli-state.json`, backup y metadatos coherentes.
- Validar `schemaVersion`, JSON y `revision` antes de confirmar.
- No escribir JSON vacío como recuperación.
- Toda mutación administrativa debe pasar por `mutateSharedState`.

## Validación

```bash
npm run typecheck --workspace=@calpulli/shared-store
npm run test --workspace=@calpulli/shared-store
```
