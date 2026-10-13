# 02 — ARQUITECTURA DE INTEROPERABILIDAD OFFLINE

## Requisito no negociable

UPIICSA Calpulli y Gestión UPIICSA Calpulli deben intercambiar información en el mismo dispositivo Android:

- sin internet;
- sin Wi‑Fi;
- sin servidor;
- sin API HTTP;
- sin computadora;
- sin nube.

## Problema

Cada proyecto/experiencia Expo tiene almacenamiento privado aislado.

Por lo tanto NO usar como fuente compartida:

- `FileSystem.documentDirectory`;
- AsyncStorage;
- SecureStore;
- SQLite privado;
- caché de cada app.

Esos mecanismos sí pueden utilizarse para estado privado de cada app.

## Solución del MVP

Utilizar Android Storage Access Framework (SAF) mediante `expo-file-system` compatible con Expo Go.

Ambas apps reciben permiso para el mismo directorio elegido por el usuario.

### Carpeta recomendada

Crear previamente en el dispositivo:

```text
Documents/
└── UPIICSA_Calpulli_Shared/
```

El selector debe apuntar/solicitar esa carpeta.

No depender de la raíz de almacenamiento ni de `Android/data`.

## Flujo de conexión en ambas apps

Estado inicial:

```text
¿Existe URI SAF guardada?
        │
    ┌───┴───┐
    │       │
   NO      SÍ
    │       │
    ▼       ▼
Conectar   Validar
carpeta      │
    │        ├─ válida → continuar
    │        └─ inválida → volver a conectar
    ▼
Selector SAF
    │
    ▼
Seleccionar UPIICSA_Calpulli_Shared
    │
    ▼
Prueba de lectura/escritura
    │
    ▼
Guardar URI en almacenamiento privado de la app
```

La URI SAF es configuración privada.
Los datos son compartidos.

## Estructura de almacenamiento recomendada

```text
UPIICSA_Calpulli_Shared/
├── calpulli-state.json
├── calpulli-state.backup.json
├── shared-meta.json
└── media/
```

Para el MVP usar un estado consolidado evita múltiples archivos parcialmente sincronizados.

### `shared-meta.json`

Debe contener como mínimo:

```ts
interface SharedMeta {
  schemaVersion: number;
  revision: number;
  createdAt: string;
  updatedAt: string;
  lastWriter: "calpulli" | "gestion-calpulli";
}
```

### `calpulli-state.json`

Contiene el estado interoperable completo:

```ts
interface SharedCalpulliState {
  meta: SharedMeta;
  departments: Department[];
  institutionalPosts: InstitutionalPost[];
  stories: Story[];
  fairs: Fair[];
  stands: Stand[];
  standRequests: StandRequest[];
  entrepreneurs: Entrepreneur[];
  entrepreneurPosts: EntrepreneurPost[];
  products: Product[];
  tutors: Tutor[];
  tutoringOffers: TutoringOffer[];
  configuration: AppConfiguration;
}
```

## Estrategia de escritura segura para el MVP

La mayoría de la escritura proviene de Gestión.

UPIICSA Calpulli es principalmente lectura.

Antes de cada mutación:

1. leer estado compartido actual;
2. validar `schemaVersion`;
3. hacer copia en memoria;
4. aplicar la mutación;
5. incrementar `revision`;
6. actualizar `updatedAt`;
7. establecer `lastWriter`;
8. guardar una copia válida anterior como backup;
9. escribir el nuevo estado;
10. leer de nuevo;
11. validar JSON y revisión;
12. solo entonces reportar éxito en UI.

Si falla:

- no considerar guardada la acción;
- intentar recuperar backup;
- mostrar error entendible;
- nunca escribir un JSON vacío como recuperación.

## Concurrencia

En la demo las dos apps se utilizarán secuencialmente.

Aun así, `SharedStore` debe exponer una sola función de mutación:

```ts
mutateSharedState(operation)
```

y todas las escrituras administrativas deben pasar por ella.

No permitir escrituras directas desde pantallas.

Antes de confirmar una mutación, comparar la revisión leída con la revisión más reciente.

Si cambió:

1. releer;
2. reaplicar operación;
3. reintentar hasta un máximo pequeño;
4. fallar de forma segura si no se puede reconciliar.

## Repository Pattern

Las pantallas NO conocen SAF.

Separación:

```text
Screen
  ↓
Hook / Use Case
  ↓
Repository
  ↓
SharedStore
  ↓
SAF
  ↓
calpulli-state.json
```

Ejemplos:

```ts
interface PostsRepository {
  listInstitutionalPosts(): Promise<InstitutionalPost[]>;
  createInstitutionalPost(input: CreateInstitutionalPostInput): Promise<InstitutionalPost>;
  updateInstitutionalPost(id: string, patch: Partial<InstitutionalPost>): Promise<InstitutionalPost>;
  deleteInstitutionalPost(id: string): Promise<void>;
}
```

UPIICSA Calpulli utilizará principalmente métodos de lectura.
Gestión utilizará lectura y escritura.

## Refresco entre apps

No depender de listeners inter-app.

UPIICSA Calpulli debe recargar estado:

- al abrir la app;
- cuando la app vuelve a foreground;
- mediante pull-to-refresh;
- al entrar de nuevo a una pantalla relevante.

Gestión hace lo mismo antes de mostrar datos editables.

## Favoritos

Los favoritos no forman parte de `SharedCalpulliState`.

Guardar con AsyncStorage dentro de `apps/calpulli`.

Modelo:

```ts
interface LocalFavoritesState {
  institutionalPostIds: string[];
}
```

## Medios/imágenes

### MVP inicial

Usar assets empaquetados y referencias estables para datos ficticios.

Modelo sugerido:

```ts
type MediaReference =
  | { type: "bundled"; key: string }
  | { type: "shared"; uri: string };
```

### Etapa posterior del MVP

Si Gestión permite seleccionar una foto real:

1. obtener el archivo con ImagePicker/DocumentPicker;
2. copiarlo al subdirectorio compartido `media/`;
3. guardar únicamente su referencia compartida en el estado;
4. comprobar que la app pública puede leer esa URI.

No bloquear la primera demo por esta función.
Los assets ficticios deben ser suficientes para la etapa visual.

## Inicialización

Solo Gestión debe ofrecer:

`Inicializar datos de demostración`

Acción:

- si no existe estado, crear seed;
- si ya existe, pedir confirmación antes de restaurarlo.

UPIICSA Calpulli:

- si no encuentra estado, mostrar pantalla de almacenamiento no configurado o datos no inicializados;
- no debe generar datos administrativos automáticamente.

## Reseteo de demo

Superadministrador debe disponer de:

`Restaurar datos de demostración`

Esto reemplaza el estado compartido con el seed inicial.

## Errores que Codex NO debe resolver cambiando arquitectura

Si hay problemas con SAF:

NO sustituir por:

- servidor local;
- fetch;
- localhost;
- API;
- Supabase;
- dos AsyncStorage;
- dos SQLite.

Corregir la integración SAF o documentar el bloqueo.

## Nota de producción

La arquitectura SAF está pensada para el MVP Android offline y la presentación.

Cuando ambas aplicaciones se publiquen como binarios independientes y se diseñe almacenamiento productivo, se deberá reevaluar:

- permisos persistentes;
- cifrado;
- multiusuario;
- seguridad por rol;
- transacciones;
- sincronización;
- backend;
- migraciones;
- recuperación de datos.

No mezclar esos problemas con el MVP actual.
