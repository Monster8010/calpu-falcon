# 10 — DECISIONES Y FUERA DE ALCANCE

## Decisiones cerradas

### D001
Nombre ecosistema:
`UPIICSA Calpulli`.

### D002
App administrativa:
`Gestión UPIICSA Calpulli`.

### D003
App pública sin login.

### D004
Gestión sin login durante demo.

### D005
Selector directo de roles para presentación.

### D006
Interoperabilidad 100% local en Android.

### D007
Fuente compartida mediante directorio SAF.

### D008
Sin API HTTP/local.

### D009
Monorepo para MVP.

### D010
Shared domain entre ambas apps.

### D011
Favoritos privados del dispositivo/app pública.

### D012
Feed sin likes ni comentarios.

### D013
Visualizaciones + guardar.

### D014
Departamentos publican sin aprobación previa.

### D015
Moderador puede ocultar/restaurar posteriormente.

### D016
Emprendedores no publican en feed institucional.

### D017
Feria: 40 mesas con geometría definida.

### D018
Emprendedor solicita; admin aprueba.

### D019
Marketplace sin transacciones.

### D020
Tutorías con contacto externo.

### D021
Light/Dark.

### D022
Identidad mexicana contemporánea, no copia de redes sociales.

### D023
Datos ficticios para demo.

### D024
Gestor del monorepo para el MVP:
`npm workspaces` con un único `package-lock.json` en la raíz.

### D025
Base de compatibilidad inicial con Expo Go físico:
Expo SDK 54 en ambas experiencias, con versiones idénticas de Expo, React y React Native.

### D026
Resolución del monorepo:
usar la configuración automática de Metro incluida por Expo SDK 52 o superior; no mantener configuración Metro manual mientras no sea necesaria.

### D027
Nombres de paquetes internos:
`@calpulli/domain`, `@calpulli/shared-store`, `@calpulli/repositories`, `@calpulli/ui` y `@calpulli/mock-data`.

### D028
Orden determinista del feed institucional:
`urgent > important > featured > normal`; dentro de la misma prioridad, publicación más reciente primero y `id` como desempate estable.

### D029
Una solicitud de stand se considera activa cuando está `pending` o `approved`.
Las transiciones directas permitidas son:
`pending → approved | rejected | cancelled`, `approved → cancelled`, `rejected → pending` y `cancelled → pending`.
En la validación abstracta de transiciones, repetir el mismo estado es válido.
Esto no convierte en idempotente una operación de aprobación completa: aprobar sigue requiriendo una solicitud `pending` y un stand sin asignar.

### D030
Las fechas persistidas requieren fecha, hora y zona explícita (`Z` u offset ISO 8601).
Para historias, `startsAt` es inclusivo y `expiresAt` es exclusivo.

### D031
`Fair.recurrenceHintWeekday` usa la convención de JavaScript:
domingo `0` a sábado `6`; miércoles es `3`.
Es solo una sugerencia y no restringe la fecha editable.
Una feria `upcoming` debe tener `nextDate` posterior a la fecha de referencia; una feria `active` puede conservar la fecha ya alcanzada.

### D032
La versión inicial del estado compartido es `schemaVersion: 1`.
`SharedMeta.schemaVersion` y `AppConfiguration.schemaVersion` deben coincidir con la versión admitida por la app; una versión incompatible falla de forma explícita y no se sustituye silenciosamente con un backup antiguo.

### D033
`calpulli-state.json` es la fuente canónica y su `meta` embebido controla la revisión.
`shared-meta.json` es un espejo de diagnóstico que se verifica durante las escrituras.
Si el JSON principal está dañado, una lectura puede devolver el backup válido sin sobrescribir archivos; la siguiente mutación verificada puede reparar el principal.

### D034
Todas las mutaciones del estado compartido pasan por `SharedStore.mutateSharedState`.
Se usa control optimista de revisión con un máximo de tres intentos, reaplicando la operación sobre el estado más reciente.
Antes de reemplazar el principal se verifica un backup del estado anterior; después se releen y comparan los JSON escritos.
SAF no ofrece locking ni reemplazo atómico, por lo que esta estrategia asume el uso secuencial definido para la demo.

### D035
Cada experiencia conserva su URI SAF en AsyncStorage privado con una clave propia y la revalida mediante una prueba de lectura/escritura al iniciar.
AsyncStorage nunca contiene el estado interoperable ni se usa como fuente compartida.

### D036
`createDemoSeed(referenceTime)` es determinista para una misma fecha de referencia ISO.
La feria inicial se programa para el primer miércoles estrictamente futuro a las `18:00Z`; el horario solo estabiliza el seed y la fecha continúa siendo editable por el Administrador de Feria.

### D037
El seed inicial comienza en revisión `1` y deja los 40 stands disponibles para permitir el recorrido de solicitud durante la demostración.
Si Gestión restaura un estado ya existente, debe pedir confirmación y usar `mutateSharedState` para conservar backup, incrementar la revisión vigente y verificar la escritura.

### D038
Los repositorios reciben un contrato mínimo de `SharedStateStore` y se construyen mediante una fábrica común con reloj y generador de IDs inyectables.
Cada lectura usa `readState` y cada escritura usa `mutateSharedState`; repositories no conoce SAF, AsyncStorage ni detalles de archivos.

### D039
Las eliminaciones de entidades referenciadas fallan de forma explícita y no hacen cascadas silenciosas.
Los flujos compuestos de feria, stands y solicitudes actualizan todas sus asociaciones dentro de una sola mutación del estado compartido.
Al reabrir una solicitud rechazada o cancelada se conserva su ID, se renueva `requestedAt` y se limpian los datos de revisión.

### D040
Los selectors públicos componen la visibilidad del contenido con el estado activo de su entidad propietaria.
La moderación MVP solo alterna `isHiddenByModerator` en publicaciones institucionales y de emprendimiento; no elimina contenido.

### D041
El sistema visual usa tokens semánticos centralizados y dos temas diseñados explícitamente; no se invierten colores de manera automática.
La app pública inicia respetando el tema del sistema y ofrece un control accesible para alternar claro/oscuro durante la sesión.
Se conserva la tipografía del sistema para no añadir una dependencia de fuentes a Expo Go.

### D042
El shell público usa Expo Router con cinco rutas bajo `(tabs)` y una sola familia de iconos, Ionicons.
La ruta inicial valida la URI SAF privada y solo después entra al shell; si no existe una conexión válida muestra `Conectar almacenamiento Calpulli`.
Las vistas de tabs permanecen como placeholders hasta sus etapas funcionales correspondientes.

### D043
Inicio relee sus datos mediante repositories al entrar a la pantalla, al volver la app a foreground y mediante pull-to-refresh.
No usa listeners entre apps; si un refresh falla después de una lectura válida, conserva el contenido anterior y muestra el error sin vaciar la pantalla.

### D044
Los favoritos públicos almacenan únicamente IDs de publicaciones institucionales en AsyncStorage privado, bajo una clave versionada de la app pública.
Las referencias `bundled` del seed se representan inicialmente con composiciones abstractas deterministas y accesibles; `showMedia` sigue controlando completamente su presencia.
Los assets fotográficos y medios compartidos reales permanecen fuera de esta etapa.

### D045
Feria pública muestra primero una edición `active`; si no existe, elige la edición `upcoming` con `nextDate` más cercano.
El countdown recibe una fecha de referencia explícita, actualiza cada segundo y limita a cero cualquier intervalo alcanzado o pasado.

### D046
El mapa público deriva posición y tamaño únicamente de `Stand.coordinate`; no infiere el acomodo desde el número de mesa ni mantiene una lista visual paralela.
Una mesa `requested` se presenta como apartada sin revelar al solicitante, y una mesa `assigned` solo enlaza un emprendimiento activo disponible mediante los selectores públicos.
La ficha de mesa y el perfil del emprendimiento son de solo lectura: solicitar, aprobar y editar permanecen fuera de la app pública.

### D047
Marketplace combina productos y publicaciones públicas en una lista de descubrimiento ordenada por la fecha propia más reciente (`updatedAt` para producto y `publishedAt` para publicación).
La categoría de un producto es `Product.category`; una publicación usa la categoría de su emprendimiento.
La búsqueda es local, ignora acentos y consulta título, descripción, categoría y nombre del emprendimiento.

### D048
Tutorías agrupa las ofertas públicas por tutor activo.
El filtro de modalidad usa la unión de modalidades declaradas en el perfil y sus ofertas visibles; la búsqueda local consulta nombre, descripción y materias.
Los contactos se abren mediante enlaces externos del sistema (`mailto`, `tel` o HTTPS según el tipo); `other` solo admite HTTP(S) y un fallo conserva visible el dato para copiarlo.
No existe mensajería interna.

### D049
La limpieza de Favoritos solo ocurre después de leer correctamente el contenido público compartido.
Se eliminan de AsyncStorage los IDs que ya no son públicos por eliminación, despublicación, moderación o departamento inactivo; un error de SAF conserva los IDs locales para evitar pérdida silenciosa.
Inicio y Favoritos releen AsyncStorage al recuperar foco para mantener coherencia entre ambas tabs.

### D050
El selector de Gestión contiene exactamente los seis `AppRole` del contrato y no representa autenticación ni autorización.
La ruta activa determina el dashboard visible; AsyncStorage privado conserva únicamente el último perfil de demostración para resaltarlo al volver al selector, y un fallo al guardar esa preferencia no bloquea la navegación.
Cambiar de perfil reemplaza la ruta y remonta el placeholder correspondiente para que el estado visual de un rol no se mezcle con otro.

### D051
Gestión valida primero su URI SAF privada y un estado compartido legible antes de mostrar el selector de roles.
Si la carpeta está vacía, la inicialización del seed sigue siendo una acción explícita; en esta etapa no se restaura ni sobrescribe un estado existente.
El `RoleSwitcher` permanece fuera del área desplazable del dashboard y las áreas por rol son sólo vistas previas no interactivas hasta sus etapas funcionales.

### D052
Al entrar al rol Departamento siempre se elige primero un departamento activo del estado compartido; la selección vive en la ruta y no simula identidad, sesión ni autorización.
Las pantallas releen al recuperar foco, al volver a foreground y con pull-to-refresh.
Toda edición invoca repositories construidos con el store SAF de Gestión; ninguna pantalla escribe archivos o llama `mutateSharedState` directamente.

### D053
Una publicación nueva puede guardarse como borrador (`isPublished: false`) o publicarse libremente (`isPublished: true`, `isHiddenByModerator: false`).
La primera publicación usa la hora actual del dispositivo; editar un aviso ya publicado conserva `publishedAt` y nunca cambia `isHiddenByModerator`.
La galería y el documento de esta etapa usan referencias `bundled` seleccionables; referencias `shared` preexistentes que el editor no representa se conservan.
Eliminar una publicación requiere confirmación.

### D054
El editor de historias usa un medio `bundled` y duraciones simples de 6, 12, 24 o 48 horas.
Crear o editar inicia una nueva vigencia en el momento de guardar y calcula `expiresAt` con la duración elegida; se exige al menos título o texto.
Las historias pueden activarse, desactivarse, editarse y eliminarse con confirmación, siempre mediante `StoriesRepository`.

### D055
El Administrador de Feria gestiona primero la edición `active`; si no existe, usa la `upcoming` más cercana, igual que la selección pública.
La fecha se elige con el date/time picker nativo compatible con Expo Go y siempre debe quedar en el futuro.
La sugerencia toma el mayor instante entre `nextDate` y ahora, suma `recurrenceHintDays` y avanza al primer `recurrenceHintWeekday` en UTC; sigue siendo opcional y editable.

### D056
Sólo puede existir una feria activa.
Finalizar una edición ocurre en una mutación de `FairsRepository`: vuelve a `upcoming`, registra `endedAt`, configura la siguiente fecha, cancela solicitudes `pending`/`approved` y libera todos los stands de esa feria.
Solicitudes `rejected`/`cancelled` se conservan como trazabilidad mínima porque el contrato MVP no modela un histórico de ediciones separado.

### D057
El mapa administrativo deriva todas las posiciones de `Stand.coordinate` y muestra la misma edición y los mismos 40 stands que consume la app pública.
Aprobar, rechazar y liberar requieren confirmación en UI y delegan las asociaciones completas a `StandRequestsRepository` o `StandsRepository`.
No se crean solicitudes desde el Administrador de Feria ni se adelanta el selector del rol Emprendedor.

### D058
El selector Emprendedor muestra únicamente perfiles demo activos y conserva la identidad elegida en el parámetro de ruta; no simula autenticación ni una cuenta persistente.
El dashboard reúne perfil, publicaciones, productos, Feria y el estado más relevante de solicitud sin mezclar datos de otro emprendimiento.

### D059
Perfil, publicaciones y productos se editan con referencias `bundled` de demostración y conservan cualquier referencia `shared` preexistente que el editor aún no pueda reemplazar.
Los contactos siguen siendo acciones externas; no se incorpora chat.
Las publicaciones del emprendedor pertenecen exclusivamente a Marketplace/perfil, preservan una ocultación previa del Moderador y nunca se convierten en avisos institucionales. `priceLabel` permanece texto sin lógica de pagos.

### D060
El emprendedor puede abrir el mapa de la edición `active` o, si no existe, de la `upcoming` más cercana, pues el flujo funcional documenta selección desde ambos estados de Feria.
Sólo una mesa `available`, sin `activeRequestId`, puede solicitarse y `pending`/`approved` bloquean una segunda solicitud del mismo emprendimiento en esa feria.
El rol Emprendedor sólo invoca `StandRequestsRepository.create`; aprobación y rechazo permanecen exclusivamente en Administrador de Feria y no existe acción de autoaprobación.

### D061
El selector Tutor muestra sólo perfiles demo activos y conserva el tutor elegido en el parámetro de ruta; no crea autenticación ni una cuenta persistente.
El dashboard carga exclusivamente el perfil y las `TutoringOffer` cuyo `tutorId` coincide con esa selección.

### D062
Perfil y materia requieren al menos una modalidad; los valores repetidos se normalizan sin duplicados.
Las modalidades de cada materia son editables de forma independiente a las modalidades generales del perfil, porque el contrato permite ambas listas y la UI pública las combina para descubrimiento.
`availabilityLabel` sigue siendo texto libre y no se convierte en calendario, reservación ni agenda.

### D063
El editor Tutor conserva un avatar `shared` preexistente mientras no se seleccione un avatar `bundled` demo.
Los contactos permanecen externos y no habilitan chat interno. Una materia inactiva se conserva para edición pero queda fuera de la consulta pública; eliminar una materia requiere confirmación y usa `TutorsRepository`.

### D064
La moderación posterior de esta etapa cubre `InstitutionalPost` y `EntrepreneurPost`, las dos entidades cuyo contrato incluye `isHiddenByModerator`.
Productos, perfiles, historias y ofertas no reutilizan `isActive` como marca de moderación: hacerlo cambiaría la semántica contractual y queda fuera del alcance de ETAPA 15.

### D065
El dashboard Moderador distingue `Pública`, `No publicada`, `Oculta por moderación` y `Propietario inactivo`; la marca de moderación tiene precedencia visual.
Restaurar sólo cambia `isHiddenByModerator` a `false`: no publica borradores ni reactiva departamentos o emprendimientos, por lo que la visibilidad pública sigue dependiendo de los selectors existentes.

### D066
Ocultar y restaurar requieren confirmación, muestran el progreso de guardado, ejecutan exclusivamente `ModerationRepository` y releen el workspace al terminar.
La lista ofrece detalle y filtros, pero no borrado permanente, aprobación previa, denuncias ni moderación automática.

### D067
El dashboard Superadmin calcula sus métricas desde una sola lectura validada del estado compartido: departamentos activos/total, publicaciones institucionales con `isPublished`, stands asignados, solicitudes `pending`, emprendedores activos y tutores activos.
La edición de feria mostrada es primero la `active` y, si no existe, la `upcoming` más cercana, igual que en las demás vistas de Gestión.

### D068
Superadmin puede editar únicamente los campos definidos por `AppConfiguration`; `schemaVersion` es de solo lectura y nunca se cambia desde un formulario.
`defaultTheme` se conserva como preferencia compartida del contrato, mientras el control de tema visible de cada experiencia continúa disponible durante la sesión.

### D069
La administración simple de departamentos permite listar, crear, editar y activar/desactivar mediante `DepartmentsRepository`.
No ofrece borrado desde Superadmin porque la mayoría de áreas demo tienen contenido referenciado; una nueva área usa `departments/demo-area` y acento `jade` hasta la etapa opcional de medios.

### D070
Restaurar datos demo requiere confirmación y utiliza `DemoDataRepository.restore` sobre `mutateSharedState`; no reinicializa archivos ni escribe desde la pantalla.
La mutación valida la versión del seed, reemplaza las colecciones y configuración, conserva el backup anterior e incrementa la revisión vigente mediante `SharedStore`.

### D071
La ETAPA 17 adopta una rebanada vertical mínima: el editor de publicaciones institucionales permite elegir una imagen real y la app pública la muestra en la tarjeta de Inicio.
Los demás editores conservan sus medios `bundled` y cualquier referencia `shared` previa; ampliar el selector a historias, perfiles, productos u ofertas no forma parte de esta etapa opcional.

### D072
Gestión usa `expo-image-picker` compatible con Expo SDK 54 y admite únicamente JPEG, PNG o WebP, con límite de 8 MB por imagen.
La selección permanece como estado temporal del formulario y no se incorpora al JSON hasta que la copia compartida termina correctamente.

### D073
`SharedStore.copyImageToMedia` crea o reutiliza `media/` dentro del directorio SAF, copia el contenido Base64, lo relee y exige coincidencia exacta antes de devolver un `MediaReference` `shared`.
Si la escritura o verificación falla, elimina el archivo incompleto. Si la copia ya fue verificada pero la mutación posterior del estado falla o queda ambigua, no elimina automáticamente la imagen: hacerlo podría romper una referencia realmente confirmada; la limpieza de archivos huérfanos queda fuera del MVP.

### D074
La app pública entrega la URI `content://` compartida al componente `Image` de React Native y vuelve a la representación visual `bundled`/abstracta si no existe una imagen compartida compatible o la carga falla.
Las pruebas automatizadas y los bundles Android verifican contratos y compilación; la lectura cruzada real conserva como requisito que ambas experiencias obtengan acceso SAF al mismo directorio. La comprobación física en Expo Go queda pendiente cuando haya un dispositivo Android conectado y no justifica cambiar la arquitectura.

### D075
La ejecución de ETAPA 18 distingue evidencia automatizada/estática de una prueba manual real. Un test de repositories, una inspección de JSX o un bundle correcto no se registran como sustitutos de pulsar el flujo en Expo Go.
El entorno del 10 de agosto de 2026 no dispone de emulador Android y `adb devices -l` no reporta dispositivos; por ello los 33 escenarios conservan evidencia lógica favorable, pero su columna manual permanece pendiente en `docs/13_STAGE_18_ACCEPTANCE_REPORT.md`. No se avanza a ETAPA 19 hasta realizar esa comprobación o recibir un entorno Android utilizable.

### D076
El usuario autoriza explícitamente continuar con ETAPA 19 y las etapas posteriores, difiriendo A1–H3 físicos hasta el cierre del desarrollo.
Al final se levantarán ambas experiencias con Expo Go y código QR; sólo después de que el usuario confirme esa prueba se generará un APK Android de cada app. Esta excepción de secuencia no convierte los casos pendientes en aprobados ni autoriza generar APK durante ETAPA 19.

### D077
El polish de ETAPA 19 se concentra en primitivas compartidas para beneficiar ambas experiencias sin duplicar estilos: jerarquía de header, fondos semánticos de badges, elevación moderada de cards, feedback táctil de botones, empty states consistentes y skeletons con pulso que respeta Reduce Motion.
La app pública añade un estado activo más legible en la navegación inferior y un contador superpuesto para galerías con imagen compartida. No se modifican contratos, repositories, rutas ni reglas de dominio.

### D078
ETAPA 20 reutiliza las capacidades ya terminadas en etapas anteriores: Superadmin restaura el seed con confirmación, el selector y `Cambiar perfil demo` dan acceso a los seis roles, `createDemoSeed` aporta contenido visual creíble y todos los managers muestran éxito sólo después de releer la mutación.
No se duplican repositorios ni se añade un segundo “modo demo”. `docs/DEMO_GUIDE.md` define el recorrido estable y la preparación repetible solicitados por la etapa.

### D079
La entrega final conserva tres puertas explícitas: cargar ambos proyectos mediante dos QR/puertos Metro, completar A1–H3 en Expo Go con confirmación del usuario y sólo entonces generar dos APK con identificadores Android distintos.
La prueba en Expo Go no sustituye la prueba SAF entre binarios independientes; después de instalar los APK se repetirá el flujo crítico usando la misma carpeta compartida.

## Fuera del alcance actual

- login real;
- matrícula;
- OAuth;
- LDAP/IPN;
- backend;
- nube;
- sincronización remota;
- multi-dispositivo;
- cifrado completo;
- RBAC real;
- auditoría legal;
- notificaciones push;
- analítica remota;
- pagos;
- carrito;
- checkout;
- chat;
- likes;
- comentarios;
- ranking algorítmico;
- recomendaciones con IA;
- moderación automática;
- sistema definitivo de acomodo de ferias;
- histórico complejo de ferias;
- producción iOS;
- despliegue Play Store.

## Regla para nuevas ideas

Toda funcionalidad nueva debe registrarse primero aquí como:

- `Propuesta`;
- `Aprobada para MVP`;
- `Post-MVP`.

Codex no debe implementar propuestas no aprobadas.
