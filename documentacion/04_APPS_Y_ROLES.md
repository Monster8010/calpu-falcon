# Apps y roles

## App pública: UPIICSA Calpulli

Ruta de código: `apps/calpulli`  
Paquete: `@calpulli/calpulli`

Es la experiencia de consulta para alumnado. No solicita login ni creación de cuenta. Sus pestañas son:

1. Inicio.
2. Feria.
3. Marketplace.
4. Tutorías.
5. Favoritos.

Lee el estado compartido. Guarda Favoritos en almacenamiento privado local.

## App administrativa: Gestión UPIICSA Calpulli

Ruta de código: `apps/gestion-calpulli`  
Paquete: `@calpulli/gestion-calpulli`

Modifica el estado que consume la app pública y permite demostrar flujos por rol. No tiene login en el MVP. La pantalla inicial selecciona un perfil demo y siempre debe mostrar `Cambiar perfil demo`.

## Roles demo

| Rol | Responsabilidad |
|---|---|
| Superadministrador | Métricas, configuración, departamentos y restauración del seed. |
| Administrador de Feria | Fechas, activación, mapa, solicitudes, aprobación, rechazo y liberación. |
| Departamento | Perfil, publicaciones e historias institucionales. Publica sin aprobación previa. |
| Emprendedor | Perfil, publicaciones de Marketplace, productos y solicitud de mesa. |
| Tutor | Perfil, materias, modalidades, disponibilidad y contacto externo. |
| Moderador | Oculta o restaura publicaciones después de publicadas. |

## Regla de autoridad

El rol seleccionado representa una capacidad de demostración. No representa identidad, sesión, permiso real ni control de acceso de producción.

## Recorrido de producto

```text
Gestión modifica estado compartido
        ↓
SharedStore valida y persiste
        ↓
App pública relee al abrir, volver a foreground o refrescar
        ↓
La comunidad ve el resultado
```
