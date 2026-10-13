# UPIICSA Calpulli — aplicación pública

## Propósito

Aplicación móvil de consulta para alumnado. Presenta el estado compartido generado por Gestión y mantiene favoritos privados en el dispositivo. No solicita cuenta ni inicio de sesión.

## Estado

MVP académico implementado para Expo SDK 54 y Android/Expo Go. Las pruebas automatizadas cubren selección y presentación, pero la aceptación manual completa en Android sigue pendiente.

## Funcionalidades implementadas

- Inicio con filtros de departamentos, historias y publicaciones institucionales.
- Feria próxima o activa, mapa de mesas y detalle de emprendimientos asignados.
- Marketplace de emprendimientos, publicaciones y productos.
- Directorio y detalle de tutorías.
- Favoritos locales.
- Búsqueda y filtros locales.
- Tema claro, oscuro o del sistema.
- Refresco al volver a foreground y mediante interacción del usuario.
- Apertura de contactos externos mediante URLs validadas.

## Navegación

Las rutas viven en `app/` y usan Expo Router:

```text
app/
├── index.tsx
├── (tabs)/
│   ├── home.tsx
│   ├── fair.tsx
│   ├── marketplace.tsx
│   ├── tutoring.tsx
│   └── favorites.tsx
├── entrepreneur/[id].tsx
├── marketplace/[kind]/[id].tsx
└── tutor/[id].tsx
```

## Estructura interna

- `features/`: presentación por módulo funcional.
- `hooks/`: carga, selección y refresco de recursos.
- `services/`: repositorios públicos, SAF y persistencia privada.
- `test/`: pruebas unitarias de selección, favoritos y presentación.
- `app/`: rutas y layouts.

## Persistencia

La app lee `calpulli-state.json` desde el directorio SAF seleccionado por el usuario. La URI del directorio y los favoritos se almacenan de forma privada mediante AsyncStorage. La app pública no inicializa ni administra el estado institucional.

## Dependencias principales

| Dependencia | Versión | Uso |
|---|---:|---|
| Expo | 54.0.36 | Toolchain móvil |
| React Native | 0.81.5 | Interfaz nativa |
| Expo Router | 6.0.24 | Navegación |
| AsyncStorage | 2.2.0 | Favoritos y configuración privada |
| `@calpulli/domain` | workspace | Contratos y reglas |
| `@calpulli/repositories` | workspace | Consultas públicas |
| `@calpulli/shared-store` | workspace | Lectura SAF |
| `@calpulli/ui` | workspace | Componentes y tema |

## Scripts

Desde la raíz:

```bash
npm run start:calpulli -- --lan --port 8081
npm run android:calpulli
npm run test --workspace=@calpulli/calpulli
npm run typecheck --workspace=@calpulli/calpulli
```

## Limitaciones

- Android es el objetivo verificado del MVP.
- No hay login, backend, sincronización remota ni notificaciones push.
- Los favoritos no se sincronizan y pueden perderse al reinstalar.
- Marketplace no incluye carrito, pagos o pedidos.
- Tutorías usa contacto externo; no hay chat interno.
- La operación con dos binarios instalados aún requiere validación manual.

## Relación con Gestión

Gestión escribe el estado interoperable. Esta app lo relee al abrir, volver a primer plano o refrescar. Ambas deben seleccionar exactamente la misma carpeta SAF.
