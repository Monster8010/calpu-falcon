# Arquitectura técnica

## Stack confirmado

- React Native.
- Expo SDK 54.
- TypeScript.
- Expo Router 6.
- React 19.1.0.
- React Native 0.81.5.
- npm workspaces.
- Android y Expo Go como objetivo inmediato.
- Manifest V3 para la extensión SAES.

## Monorepo

```text
upiicsa-calpulli/
├── apps/
│   ├── calpulli/
│   └── gestion-calpulli/
├── packages/
│   ├── domain/
│   ├── shared-store/
│   ├── repositories/
│   ├── ui/
│   └── mock-data/
├── Saes/
├── docs/
└── documentacion/
```

## Capas

```text
Pantalla
  ↓
Hook o caso de uso
  ↓
Repository
  ↓
SharedStore
  ↓
SAF / almacenamiento local
```

Las pantallas no deben conocer detalles de SAF. Las mutaciones administrativas deben pasar por una única función de mutación del estado compartido.

## Paquetes

| Paquete | Responsabilidad |
|---|---|
| `@calpulli/domain` | Tipos, estados, validaciones y reglas de negocio. |
| `@calpulli/shared-store` | Lectura, escritura, backup, revisión, validación y medios compartidos. |
| `@calpulli/repositories` | Consultas y mutaciones de dominio para las apps. |
| `@calpulli/ui` | Tokens, tema y componentes visuales compartidos. |
| `@calpulli/mock-data` | Seed y datos ficticios de demostración. |

## Dependencias permitidas

- Las apps pueden depender de domain, repositories, ui y shared-store cuando corresponda.
- repositories depende de domain y shared-store.
- shared-store depende de domain.
- mock-data depende de domain.
- ui debe evitar depender del dominio si no lo necesita.
- Los paquetes compartidos no deben depender de una app.

## Artefactos existentes

`artifacts/android/` contiene APKs de la app pública y de Gestión. Deben tratarse como artefactos de demostración, no como evidencia de publicación productiva.
