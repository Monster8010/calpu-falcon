# Gestión UPIICSA Calpulli

## Propósito

Aplicación móvil para administrar los datos ficticios del MVP y demostrar capacidades asociadas a distintos perfiles. Los perfiles son simulados: no constituyen identidad, sesión, autenticación ni autorización productiva.

## Estado

MVP académico implementado para Expo SDK 54 y Android/Expo Go. Los flujos tienen cobertura automatizada, pero la matriz manual A1–H3 en dispositivo continúa pendiente.

## Funcionalidades implementadas

- Selección y cambio visible de seis perfiles demo.
- Superadministración de configuración, departamentos y datos de demostración.
- Gestión de publicaciones e historias por departamento.
- Configuración de feria, fechas, activación, solicitudes y mesas.
- Solicitud de mesa por emprendedor y aprobación/rechazo por administrador de feria.
- Perfiles, publicaciones y productos de emprendedores.
- Perfiles y ofertas de tutores.
- Moderación posterior de publicaciones.
- Selección de imágenes y copia a medios compartidos.
- Inicialización y restauración explícita del seed.

## Perfiles demo y navegación

| Perfil | Rutas/capacidades principales |
|---|---|
| Superadministrador | Métricas, configuración, departamentos y restauración |
| Administrador de Feria | Fecha, estado, mapa, solicitudes y liberación |
| Departamento | Perfil, publicaciones e historias |
| Emprendedor | Perfil, publicaciones, productos y solicitud de mesa |
| Tutor | Perfil y ofertas |
| Moderador | Ocultar y restaurar contenido |

Las rutas se encuentran bajo `app/roles/` y seleccionan el dashboard correspondiente. El estado del perfil elegido se guarda únicamente para facilitar la demostración.

## Estructura interna

- `features/`: dashboards, formularios, editores y presentación por perfil.
- `hooks/`: acceso reactivo a recursos de gestión.
- `services/`: casos de uso, repositorios, SAF, medios y rol demo.
- `test/`: pruebas de formularios, modelos y flujos administrativos.
- `app/`: rutas Expo Router.

## Persistencia

Las mutaciones pasan por repositorios y `SharedStore`. Antes de confirmar, el store valida el estado, revisa conflictos de `revision`, conserva backup, escribe y relee. La URI SAF y el perfil demo se guardan en AsyncStorage privado.

## Dependencias principales

| Dependencia | Versión | Uso |
|---|---:|---|
| Expo | 54.0.36 | Toolchain móvil |
| React Native | 0.81.5 | Interfaz nativa |
| Expo Router | 6.0.24 | Navegación |
| Expo Image Picker | 17.0.11 | Selección de medios |
| AsyncStorage | 2.2.0 | URI y perfil demo |
| `@calpulli/mock-data` | workspace | Seed ficticio |
| `@calpulli/repositories` | workspace | Consultas y mutaciones |
| `@calpulli/shared-store` | workspace | Persistencia SAF |
| `@calpulli/ui` | workspace | Componentes y tema |

## Scripts

Desde la raíz:

```bash
npm run start:gestion -- --lan --port 8082
npm run android:gestion
npm run test --workspace=@calpulli/gestion-calpulli
npm run typecheck --workspace=@calpulli/gestion-calpulli
```

## Limitaciones

- El selector de perfiles no protege operaciones.
- No existe backend, auditoría remota, cifrado por usuario ni multiusuario.
- La concurrencia se limita a reintentos por revisión en un escenario local.
- Los datos de demostración son ficticios.
- La aceptación física entre las dos apps y entre dos APK sigue pendiente.

## Relación con la app pública

Gestión es la principal escritora del estado compartido. La app pública consulta ese mismo estado después de seleccionar la misma carpeta SAF. Favoritos no son visibles ni modificables desde Gestión.
