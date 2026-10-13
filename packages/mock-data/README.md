# `@calpulli/mock-data`

## Responsabilidad

Datos ficticios y seed reproducible para inicializar o restaurar la demostración desde Gestión.

## Exports

Departamentos, publicaciones, historias, feria, mesas, emprendimientos, Marketplace, tutores, helpers y composición del seed.

## Dependencias

`@calpulli/domain` para construir datos conformes a los contratos.

## Consumidores

La app Gestión y las pruebas de repositorios.

## Restricciones

- No incorporar registros reales de estudiantes.
- Mantener 40 mesas con la geometría documentada.
- No representar los datos como información institucional oficial.
- El seed se inicializa o restaura mediante una acción explícita de Gestión.

## Validación

```bash
npm run typecheck --workspace=@calpulli/mock-data
npm run test --workspace=@calpulli/mock-data
```
