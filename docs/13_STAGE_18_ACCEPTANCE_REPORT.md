# 13 — REPORTE DE ACEPTACIÓN DE ETAPA 18

Fecha de ejecución: 10 de agosto de 2026.

## Resultado general

La verificación automatizada y estática es satisfactoria, pero la ETAPA 18 no puede declararse completada como prueba manual.

El entorno no tiene el ejecutable `emulator` y `adb devices -l` devuelve una lista vacía. Por tanto no fue posible abrir Expo Go, operar el selector SAF, desactivar conectividad ni inspeccionar visualmente navegación, estados, tema y layout en Android.

Las columnas siguientes separan deliberadamente ambos tipos de evidencia. `OK` significa que la regla subyacente fue ejercitada por pruebas o inspección del código compilado; no significa que el gesto manual haya ocurrido.

## Validaciones ejecutadas

- `npm run typecheck`: 7 de 7 workspaces sin diagnósticos.
- `npm test`: 131 de 131 pruebas aprobadas.
- `npx expo install --check`: dependencias alineadas con el mapa local de Expo SDK 54 en ambas apps; la consulta remota no se realizó porque la red del entorno está deshabilitada.
- Export Android público: 1,130 módulos, bundle de 2.97 MB, SHA-256 `5107fdcd6fa6adf4ffecc216e8df5567ea71bb39f66de66fef6af32a7d6faac6`.
- Export Android de Gestión: 1,187 módulos, bundle de 3.22 MB, SHA-256 `a7555d339f31c445987b99c3826e3a03c7c6eafa2053cbdc860ae8fcc8786a06`.
- `npm ls react react-native --all`: árbol válido y deduplicado en React 19.1.0 y React Native 0.81.5.
- Auditoría estática: no hay clientes HTTP, WebSocket, Firebase ni Supabase en `apps/` o `packages/`; no quedan colores hexadecimales escritos directamente en pantallas.
- Expo Router pudo resolver y empaquetar todas las rutas de ambas experiencias.

## Corrección realizada

El mapa público usaba directamente el hexadecimal oscuro del estado `Asignado`. Se reemplazó por `theme.colors.focus`, que conserva el tratamiento claro/oscuro desde los tokens centrales.

No se añadieron funcionalidades.

## A. Storage

| Caso | Evidencia lógica o estática | Resultado lógico | Prueba manual Android |
|---|---|---|---|
| A1 — Conectar carpeta | SharedStore valida lectura/escritura y ambas identidades leen la misma revisión. Los dos gateways solicitan y guardan su propia URI. | OK | Pendiente: seleccionar la misma carpeta en ambas experiencias. |
| A2 — Sin conexión | No existen clientes de red en el código funcional; la fuente es SAF y Favoritos usa AsyncStorage. | OK | Pendiente: desactivar Wi-Fi y datos y recorrer las funciones principales. |
| A3 — URI inválida | El store rechaza URI no SAF; ambos gateways eliminan una configuración inválida y muestran reconexión sin sobrescribir estado. | OK | Pendiente: revocar permiso o invalidar carpeta en Android. |
| A4 — JSON dañado | Las pruebas recuperan el backup válido, rechazan JSON vacío y conservan backup ante verificación fallida. | OK | Pendiente: dañar una copia real y observar el mensaje/recuperación en Expo Go. |

## B. Feed

| Caso | Evidencia lógica o estática | Resultado lógico | Prueba manual Android |
|---|---|---|---|
| B1 — Crear publicación | El flujo Departamento → Repository → consulta pública crea un aviso urgente visible. | OK | Pendiente. |
| B2 — Editar título | El CRUD de publicaciones actualiza y relee la misma entidad; Inicio refresca al enfocar, foreground y pull-to-refresh. | OK | Pendiente. |
| B3 — Ocultar ubicación | El formulario persiste `showLocation: false` y la card exige simultáneamente el flag y un valor para renderizarla. | OK | Pendiente. |
| B4 — Urgente | Orden, prioridad y tratamiento mediante badge/acento están cubiertos por dominio, integración y bundle. | OK | Pendiente: inspección visual. |
| B5 — Guardar | Las pruebas de Favoritos agregan, quitan, normalizan y reconcilian IDs. | OK | Pendiente. |
| B6 — Cambios administrativos | El contrato compartido no contiene Favoritos y el servicio público usa AsyncStorage privado. | OK | Pendiente: modificar Gestión y confirmar persistencia local. |

## C. Departamentos e historias

| Caso | Evidencia lógica o estática | Resultado lógico | Prueba manual Android |
|---|---|---|---|
| C1 — Filtrar Cultura | El selector público filtra por `departmentId`; la pantalla aplica esa selección a las cards. | OK | Pendiente. |
| C2 — Todos | El selector sin departamento devuelve el feed público completo. | OK | Pendiente. |
| C3 — Historia expirada | Dominio usa inicio inclusivo y expiración exclusiva, excluyendo futuras, inactivas y expiradas. | OK | Pendiente. |
| C4 — Muchos departamentos | Directorio e historias usan rails horizontales con claves por ID y ancho de contenido no fijo. | OK estático | Pendiente: inspección de scroll y layout. |

## D. Feria

| Caso | Evidencia lógica o estática | Resultado lógico | Prueba manual Android |
|---|---|---|---|
| D1 — Upcoming | Countdown se calcula desde `Fair.nextDate`, se limita a cero y la vista upcoming lo presenta. | OK | Pendiente: observar actualización en tiempo real. |
| D2 — Cambiar fecha | La integración cambia la fecha y la consulta compartida calcula el nuevo countdown. | OK | Pendiente. |
| D3 — Activar | La transición `upcoming → active` conserva 40 stands y la pantalla cambia de countdown a mapa. | OK | Pendiente. |
| D4 — Geometría | Seed y selección verifican 40 stands: 7 superiores y tres ramas de 11, sin coordenadas duplicadas. | OK | Pendiente: inspección visual del mapa y scroll. |
| D5 — Disponible | Una mesa disponible no resuelve ni renderiza emprendimiento; muestra estado y número. | OK estático | Pendiente. |

## E. Solicitud de stand

| Caso | Evidencia lógica o estática | Resultado lógico | Prueba manual Android |
|---|---|---|---|
| E1 — Solicitar disponible | El flujo Emprendedor crea una solicitud `pending` y cambia el stand coherentemente. | OK | Pendiente. |
| E2 — Sin autoaprobación | La vista Emprendedor sólo ofrece `Solicitar esta mesa`; aprobar existe exclusivamente en Administrador de Feria. | OK estático | Pendiente: recorrer UI. |
| E3 — Admin aprueba | Repository actualiza request, stand y `assignedEntrepreneurId` en una mutación validada. | OK | Pendiente. |
| E4 — App pública | La consulta pública carga stands y emprendedores compartidos; una asignación resuelve el avatar por `assignedEntrepreneurId`. | OK lógico/estático | Pendiente: confirmar avatar/sticker después de refresh. |
| E5 — Admin libera | La integración devuelve el stand a `available` y cancela la solicitud aprobada. | OK | Pendiente. |

## F. Marketplace

| Caso | Evidencia lógica o estática | Resultado lógico | Prueba manual Android |
|---|---|---|---|
| F1 — Editar producto | CRUD y selectors comparten el producto actualizado con Marketplace al refrescar. | OK | Pendiente. |
| F2 — Desactivar producto | Productos inactivos y productos de propietario inactivo quedan fuera de la consulta pública. | OK | Pendiente. |
| F3 — Abrir perfil | La ruta de emprendimiento compone galería, publicaciones y productos; no existe carrito ni pago. | OK estático | Pendiente: navegación y layout. |

## G. Tutorías

| Caso | Evidencia lógica o estática | Resultado lógico | Prueba manual Android |
|---|---|---|---|
| G1 — Editar materia | La integración actualiza materia/disponibilidad y la consulta pública relee el cambio. | OK | Pendiente. |
| G2 — Tutor inactivo | Tutor y ofertas desaparecen de los selectors públicos al desactivarlo. | OK | Pendiente. |
| G3 — Contacto | Los contactos generan URLs externas seguras; el perfil muestra `Contactar externamente` y no existe chat interno. | OK lógico/estático | Pendiente: abrir CTA en Android. |

## H. Moderación

| Caso | Evidencia lógica o estática | Resultado lógico | Prueba manual Android |
|---|---|---|---|
| H1 — Ocultar | Moderación posterior oculta publicaciones institucionales y de emprendimiento de sus consultas públicas. | OK | Pendiente. |
| H2 — Restaurar | Restaurar elimina sólo la marca de moderación y no publica borradores. | OK | Pendiente. |
| H3 — Publicación libre | El flujo Departamento crea una publicación pública sin paso de aprobación previa. | OK | Pendiente. |

## Comprobación restante

Con un Android disponible se debe ejecutar A1–H3 secuencialmente en Expo Go SDK 54, usando `Documents/UPIICSA_Calpulli_Shared`, primero con conectividad y luego en modo sin red. También se deben observar warnings de consola, navegación, estados de carga/error, tema claro/oscuro y estabilidad al alternar ambas experiencias.

## Excepción de secuencia autorizada

Después de emitir este reporte, el usuario decidió diferir todas las pruebas físicas hasta el cierre del desarrollo y autorizó continuar con ETAPA 19.

La secuencia acordada es: terminar las etapas de desarrollo, levantar ambas experiencias Expo Go mediante código QR, ejecutar A1–H3 en el dispositivo del usuario y, únicamente después de su confirmación, generar un APK de cada app. Los estados manuales de esta matriz permanecen pendientes hasta esa ejecución.
