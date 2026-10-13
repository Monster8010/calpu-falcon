# CODEX — REGLAS DE TRABAJO DEL PROYECTO

Este archivo es la entrada principal para cualquier agente de desarrollo que trabaje en UPIICSA Calpulli.

## Regla 0

Antes de modificar código, leer en este orden:

1. `docs/00_READ_ME_FIRST.md`
2. `docs/01_PROJECT_CONTEXT.md`
3. `docs/02_OFFLINE_INTEROPERABILITY.md`
4. `docs/03_DATA_CONTRACTS.md`
5. El documento funcional/UI de la app que se vaya a modificar.
6. `docs/06_DESIGN_SYSTEM.md`
7. La etapa activa dentro de `docs/07_CODEX_DEVELOPMENT_STAGES.md`.
8. `docs/09_ACCEPTANCE_TESTS.md`

No asumir requisitos no documentados.

## Objetivo inmediato

Construir un MVP demostrable en Android mediante Expo Go, sin conexión de red, compuesto por dos experiencias React Native/Expo:

- `UPIICSA Calpulli`: aplicación pública de consulta.
- `Gestión UPIICSA Calpulli`: aplicación de administración y demostración de roles.

Ambas deben interoperar localmente dentro del mismo dispositivo Android mediante un directorio compartido elegido por el usuario usando Android Storage Access Framework (SAF).

## Prohibiciones durante el MVP

No introducir sin autorización:

- backend;
- API HTTP;
- servidor local;
- Supabase;
- Firebase;
- autenticación real;
- usuarios remotos;
- sincronización por red;
- bases de datos privadas separadas como fuente de verdad;
- WebSocket;
- pagos;
- chat;
- likes;
- comentarios;
- notificaciones push;
- funcionalidades no descritas.

## Disciplina por etapas

Cada etapa debe:

1. inspeccionar primero el repositorio;
2. listar brevemente los archivos que se modificarán;
3. realizar solo la etapa solicitada;
4. conservar compatibilidad con Expo Go;
5. ejecutar TypeScript y las validaciones disponibles;
6. corregir errores antes de cerrar;
7. dejar ambas apps o la app afectada arrancable;
8. registrar decisiones no triviales en `docs/10_DECISIONS_AND_OUT_OF_SCOPE.md`;
9. no adelantar etapas futuras.

Si una decisión menor no está definida, elegir la solución más sencilla y extensible que no cambie el alcance.
