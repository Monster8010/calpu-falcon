# 07 — ETAPAS DE DESARROLLO PARA CODEX

## Cómo usar este documento

Entregar a Codex una etapa por vez.

No pedir varias etapas en una sola instrucción.

Al cerrar cada etapa:

- compilar;
- ejecutar;
- corregir;
- probar;
- hacer commit si el usuario lo desea;
- continuar únicamente cuando el estado sea estable.

---

# ETAPA 0 — INSPECCIÓN Y DOCUMENTACIÓN

## Instrucción para Codex

Lee `CODEX.md` y todos los archivos `docs/00` a `docs/10`.

No escribas funcionalidad todavía.

1. Inspecciona el repositorio actual.
2. Identifica si ya existe un proyecto Expo/React Native reutilizable.
3. Detecta versión de Expo, React Native, TypeScript, Expo Router y package manager.
4. Propón el árbol exacto del monorepo sin borrar trabajo útil.
5. Identifica incompatibilidades con Expo Go.
6. Resume las decisiones obligatorias del proyecto.
7. No cambies arquitectura de almacenamiento SAF.
8. No instales paquetes todavía salvo que sea necesario para poder inspeccionar.

Cierra con un plan de archivos a crear/modificar.

## Criterio de salida

Existe un diagnóstico claro y no se ha roto el proyecto.

---

# ETAPA 1 — MONOREPO Y DOS APPS

## Instrucción para Codex

Construye/adapta el monorepo.

Objetivo:

```text
apps/calpulli
apps/gestion-calpulli
packages/domain
packages/shared-store
packages/repositories
packages/ui
packages/mock-data
```

Requisitos:

- TypeScript estricto razonable;
- Expo Router;
- workspaces;
- imports de paquetes compartidos funcionando;
- cada app tiene pantalla mínima;
- ambas arrancan en Expo Go.

No construir UI final.
No construir SAF todavía.
No construir datos.

## Criterio de salida

Las dos apps pueden arrancarse individualmente sin errores críticos.

---

# ETAPA 2 — DOMAIN CONTRACTS

## Instrucción para Codex

Implementa `packages/domain` según `docs/03_DATA_CONTRACTS.md`.

Incluye:

- interfaces;
- union types;
- enums solo cuando aporten;
- validadores puros;
- helpers de fecha/orden;
- reglas de stands/solicitudes.

No usar React.
No usar FileSystem.
No usar AsyncStorage.

Añadir tests unitarios si la configuración ya permite hacerlo sin retrasar el MVP.

## Criterio de salida

Todas las apps pueden importar contratos.
TypeScript pasa.

---

# ETAPA 3 — SHARED STORE SAF

## Instrucción para Codex

Implementa el núcleo offline en `packages/shared-store`.

Requisitos:

1. Android Storage Access Framework.
2. Compatible con Expo Go.
3. Función para solicitar directorio compartido.
4. Función para validar URI.
5. Función para localizar/crear:
   - `calpulli-state.json`;
   - `calpulli-state.backup.json`;
   - `shared-meta.json`.
6. Leer estado.
7. Escribir estado.
8. Backup antes de sobrescribir.
9. Verificación posterior a escritura.
10. Control de `schemaVersion`.
11. Control `revision`.
12. Mutación centralizada.
13. Errores tipados.
14. Nada de HTTP.

Cada app puede guardar su `directoryUri` en su propio almacenamiento privado.

Crear una pantalla temporal de diagnóstico en ambas apps:

- conectar carpeta;
- mostrar estado conectado/no conectado;
- mostrar revisión;
- botón leer.

No construir feed todavía.

## Criterio de salida

Ambas experiencias apuntan manualmente a la misma carpeta y pueden leer el mismo JSON.

---

# ETAPA 4 — SEED DE DEMOSTRACIÓN

## Instrucción para Codex

Implementa `packages/mock-data`.

Crear seed ficticio consistente:

- 10 departamentos;
- 20+ publicaciones;
- 8+ historias;
- 1 feria;
- 40 stands;
- 10 emprendimientos;
- 15+ posts/productos Marketplace;
- 8 tutores;
- 20+ ofertas/materias.

Los 40 stands deben seguir exactamente la geometría:

- fila superior de 7;
- 11 debajo del 3;
- 11 debajo del 5;
- 11 debajo del 7.

Añadir a Gestión una acción temporal:

`Inicializar datos de demostración`.

La acción escribe el seed en shared store.

## Criterio de salida

Las dos apps leen el mismo seed.

---

# ETAPA 5 — REPOSITORIES

## Instrucción para Codex

Implementa `packages/repositories`.

Repositorios:

- DepartmentsRepository;
- InstitutionalPostsRepository;
- StoriesRepository;
- FairsRepository;
- StandsRepository;
- StandRequestsRepository;
- EntrepreneursRepository;
- MarketplaceRepository;
- TutorsRepository;
- ModerationRepository;
- ConfigurationRepository.

Cada operación escribe/lee mediante SharedStore.

Las pantallas nunca deben llamar FileSystem directamente.

Añadir selectors/helpers.

## Criterio de salida

CRUD básico funciona mediante repository sobre estado compartido.

---

# ETAPA 6 — DESIGN SYSTEM Y SHELL APP PÚBLICA

## Instrucción para Codex

Implementa `packages/ui` y shell de `apps/calpulli`.

Basarse en `docs/06_DESIGN_SYSTEM.md`.

Crear:

- theme;
- tokens;
- ThemeProvider;
- componentes base;
- bottom tabs.

Tabs:

- Inicio;
- Feria;
- Marketplace;
- Tutorías;
- Favoritos.

Cada tab puede tener placeholder.

Implementar conexión al shared storage de manera elegante:

Si no está conectado:

`Conectar almacenamiento Calpulli`.

## Criterio de salida

App pública navega estable y cambia light/dark.

---

# ETAPA 7 — INICIO APP PÚBLICA

## Instrucción para Codex

Implementa `Inicio` según `docs/04_APP_CALPULLI_UI_FUNCTIONAL.md`.

Obligatorio:

- header;
- DepartmentFilterRail;
- historias;
- feed;
- prioridades;
- visualizaciones;
- guardar;
- visibilidad por flags;
- pull-to-refresh;
- refresh al foreground;
- estados loading/empty/error.

No likes.
No comentarios.

Favoritos se guardan localmente en esta app.

## Criterio de salida

Crear/modificar una publicación en shared store y refrescar Inicio muestra el cambio.

---

# ETAPA 8 — FERIA APP PÚBLICA

## Instrucción para Codex

Implementa pantalla Feria.

`upcoming`:

- próxima fecha;
- countdown.

`active`:

- mapa de 40 stands;
- layout generado por coordenadas;
- estados;
- tap;
- bottom sheet;
- perfil del emprendimiento.

No permitir editar ni solicitar desde app pública.

## Criterio de salida

Cambiar Fair.status o asignación en shared store cambia la UI tras refresh.

---

# ETAPA 9 — MARKETPLACE, TUTORÍAS Y FAVORITOS

## Instrucción para Codex

Implementa las tres secciones.

Marketplace:

- categorías;
- cards;
- detalle;
- perfil emprendimiento.

Tutorías:

- búsqueda local;
- filtros;
- tutor card;
- detalle;
- contacto externo.

Favoritos:

- AsyncStorage privado;
- lista;
- quitar;
- limpieza de referencias inválidas.

## Criterio de salida

Las 5 tabs públicas son navegables y funcionales.

---

# ETAPA 10 — SHELL GESTIÓN + SELECTOR DE ROLES

## Instrucción para Codex

Implementa `apps/gestion-calpulli`.

No login.

Pantalla:

`Selecciona un perfil de demostración`.

Roles:

- Superadministrador;
- Administrador de Feria;
- Departamento;
- Emprendedor;
- Tutor;
- Moderador.

Crear RoleSwitcher permanente.

Crear dashboards placeholder con identidad consistente.

## Criterio de salida

Cambiar entre todos los roles no requiere reiniciar app.

---

# ETAPA 11 — DEPARTAMENTO

## Instrucción para Codex

Implementa rol Departamento.

Para demo primero seleccionar departamento ficticio.

Funciones:

- editar perfil;
- listar posts;
- crear;
- editar;
- eliminar;
- prioridad;
- flags;
- ubicación;
- media demo;
- historias.

Toda mutación por Repository.

No moderación previa.

## Prueba de salida

1. Crear aviso urgente.
2. Guardar.
3. Abrir app pública.
4. Refresh.
5. Ver aviso.

---

# ETAPA 12 — ADMINISTRADOR DE FERIA

## Instrucción para Codex

Implementa:

- dashboard;
- cambiar fecha;
- activar;
- finalizar;
- mapa admin;
- solicitudes;
- aprobar;
- rechazar;
- liberar stand.

Al finalizar:

- volver a upcoming;
- mantener próxima fecha configurable;
- limpiar estado de la feria de manera coherente.

## Prueba de salida

Cambiar fecha afecta countdown público.
Activar muestra mapa público.

---

# ETAPA 13 — EMPRENDEDOR

## Instrucción para Codex

Implementa:

- selector de emprendedor demo;
- perfil;
- avatar/sticker;
- descripción;
- galería;
- contactos;
- publicaciones;
- productos;
- mapa de selección;
- solicitar stand;
- consultar estado.

Nunca permitir autoaprobación.

## Prueba de salida

1. Emprendedor solicita stand.
2. Admin ve solicitud.
3. Admin aprueba.
4. App pública refresca.
5. Stand muestra emprendimiento.

---

# ETAPA 14 — TUTOR

## Instrucción para Codex

Implementa:

- selector tutor demo;
- perfil;
- materias;
- modalidades;
- disponibilidad;
- contactos externos.

## Prueba de salida

Editar materia/contacto y refrescar app pública refleja cambio.

---

# ETAPA 15 — MODERADOR

## Instrucción para Codex

Implementa:

- lista contenido;
- ocultar;
- restaurar;
- badges de estado.

No aprobación previa.

## Prueba de salida

Ocultar un post hace que desaparezca de la app pública después de refresh.
Restaurar lo devuelve.

---

# ETAPA 16 — SUPERADMIN

## Instrucción para Codex

Implementa dashboard general:

- métricas;
- configuración;
- estado del store;
- revisión;
- restaurar seed;
- departamentos.

Mantener alcance simple.

No crear RBAC real.

---

# ETAPA 17 — MEDIOS COMPARTIDOS OPCIONAL

Solo ejecutar si todo lo anterior funciona.

## Instrucción para Codex

Permitir seleccionar una imagen real desde Gestión y copiarla a `media/` dentro del SAF compartido.

Guardar `MediaReference` tipo `shared`.

Verificar que app pública puede mostrarla.

Si Expo Go/SAF presenta una limitación que pone en riesgo demo:

- conservar assets bundled;
- documentar limitación;
- no cambiar arquitectura.

---

# ETAPA 18 — PRUEBAS END-TO-END MANUALES

Ejecutar todos los escenarios de `docs/09_ACCEPTANCE_TESTS.md`.

Corregir:

- TypeScript;
- navegación;
- stale state;
- errores de SAF;
- datos inconsistentes;
- fallos de tema;
- warning keys;
- crash.

No añadir features.

---

# ETAPA 19 — POLISH DE PRESENTACIÓN

Solo después de funcionalidad.

Mejorar:

- spacing;
- tipografía;
- cards;
- badges;
- empty states;
- loading;
- microinteracciones;
- iconografía;
- modo claro/oscuro.

No cambiar contratos ni lógica salvo bug.

---

# ETAPA 20 — DEMO MODE

Añadir:

- restauración de seed;
- acceso rápido a roles;
- datos visuales creíbles;
- mensajes de éxito;
- recorrido estable.

Crear `docs/DEMO_GUIDE.md` con recorrido de 5 minutos.

No agregar login.
