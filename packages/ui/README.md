# `@calpulli/ui`

## Responsabilidad

Sistema visual compartido para las dos apps: tokens, temas y componentes base.

## Exports

- Componentes: header, badge, button, marca, card, estados vacíos, screen, skeleton y selector de tema.
- Temas claro/oscuro y provider.
- Tokens de color, movimiento, radios, espaciado y tipografía.

## Dependencias

Declara React, React Native y safe-area context como peer dependencies. No depende del dominio.

## Consumidores

UPIICSA Calpulli y Gestión UPIICSA Calpulli.

## Restricciones

- Centralizar colores y medidas reutilizables.
- No depender de rutas o módulos de una aplicación.
- Conservar contraste y no usar color como único indicador.
- Los componentes funcionales específicos permanecen en `apps/*/features`.

## Validación

```bash
npm run typecheck --workspace=@calpulli/ui
npm run test --workspace=@calpulli/ui
```
