# 12 — BLUEPRINT DE CARPETAS Y MÓDULOS

Estructura recomendada. Adaptar a Expo Router y al repositorio existente sin duplicar innecesariamente.

```text
upiicsa-calpulli/
├── CODEX.md
├── apps/
│   ├── calpulli/
│   │   ├── app/
│   │   │   ├── _layout.tsx
│   │   │   ├── storage-setup.tsx
│   │   │   └── (tabs)/
│   │   │       ├── _layout.tsx
│   │   │       ├── index.tsx
│   │   │       ├── fair.tsx
│   │   │       ├── marketplace.tsx
│   │   │       ├── tutoring.tsx
│   │   │       └── favorites.tsx
│   │   ├── features/
│   │   │   ├── home/
│   │   │   ├── stories/
│   │   │   ├── fair/
│   │   │   ├── marketplace/
│   │   │   ├── tutoring/
│   │   │   └── favorites/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── assets/
│   │
│   └── gestion-calpulli/
│       ├── app/
│       │   ├── _layout.tsx
│       │   ├── storage-setup.tsx
│       │   ├── index.tsx
│       │   └── roles/
│       │       ├── superadmin/
│       │       ├── fair-admin/
│       │       ├── department/
│       │       ├── entrepreneur/
│       │       ├── tutor/
│       │       └── moderator/
│       ├── features/
│       │   ├── role-switcher/
│       │   ├── departments/
│       │   ├── posts/
│       │   ├── stories/
│       │   ├── fair/
│       │   ├── entrepreneurs/
│       │   ├── marketplace/
│       │   ├── tutors/
│       │   └── moderation/
│       ├── hooks/
│       ├── services/
│       └── assets/
│
├── packages/
│   ├── domain/
│   │   └── src/
│   │       ├── common.ts
│   │       ├── department.ts
│   │       ├── institutional-post.ts
│   │       ├── story.ts
│   │       ├── fair.ts
│   │       ├── stand.ts
│   │       ├── entrepreneur.ts
│   │       ├── marketplace.ts
│   │       ├── tutor.ts
│   │       ├── configuration.ts
│   │       ├── validators/
│   │       └── index.ts
│   │
│   ├── shared-store/
│   │   └── src/
│   │       ├── shared-store.ts
│   │       ├── saf-directory.ts
│   │       ├── state-reader.ts
│   │       ├── state-writer.ts
│   │       ├── backup.ts
│   │       ├── migrations.ts
│   │       ├── errors.ts
│   │       └── index.ts
│   │
│   ├── repositories/
│   │   └── src/
│   │       ├── contracts/
│   │       ├── implementations/
│   │       ├── selectors/
│   │       └── index.ts
│   │
│   ├── ui/
│   │   └── src/
│   │       ├── theme/
│   │       ├── tokens/
│   │       ├── components/
│   │       └── index.ts
│   │
│   └── mock-data/
│       └── src/
│           ├── departments.ts
│           ├── posts.ts
│           ├── stories.ts
│           ├── fair.ts
│           ├── stands.ts
│           ├── entrepreneurs.ts
│           ├── marketplace.ts
│           ├── tutors.ts
│           ├── seed.ts
│           └── index.ts
│
└── docs/
```

## Dependencias permitidas

```text
apps/*
  ├── packages/domain
  ├── packages/repositories
  ├── packages/ui
  └── packages/shared-store (solo setup/infra si hace falta)

packages/repositories
  ├── packages/domain
  └── packages/shared-store

packages/shared-store
  └── packages/domain

packages/mock-data
  └── packages/domain

packages/ui
  └── sin dependencia del dominio cuando sea posible
```

Evitar:

```text
domain → app
shared-store → app
ui → app
domain → shared-store
```

## Regla de imports

Usar aliases/workspace package names cuando estén correctamente configurados.

No crear rutas relativas de seis niveles si el monorepo ya soporta paquetes.

## Hooks sugeridos App pública

- `useSharedStorageStatus`
- `useDepartments`
- `useInstitutionalFeed`
- `useStories`
- `useFair`
- `useMarketplace`
- `useTutors`
- `useFavorites`
- `useRefreshOnForeground`

## Hooks sugeridos Gestión

- `useDemoRole`
- `useDepartmentManager`
- `usePostEditor`
- `useFairAdmin`
- `useStandRequests`
- `useEntrepreneurManager`
- `useTutorManager`
- `useModerator`
- `useSharedStoreDiagnostics`
