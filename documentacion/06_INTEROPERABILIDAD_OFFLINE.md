# Interoperabilidad offline

## Requisito central

Las dos apps deben intercambiar información en el mismo dispositivo Android sin internet, Wi-Fi, servidor, API, computadora, nube ni red local.

## Solución

Usar Android Storage Access Framework (SAF). Cada app recibe permiso a la misma carpeta elegida por el usuario:

```text
Documents/
└── UPIICSA_Calpulli_Shared/
    ├── calpulli-state.json
    ├── calpulli-state.backup.json
    ├── shared-meta.json
    └── media/
```

La URI SAF se guarda de forma privada en cada app. Los datos de negocio viven en la carpeta compartida.

## Primera conexión

1. Detectar si existe una URI guardada.
2. Validarla.
3. Si no existe o es inválida, mostrar `Conectar almacenamiento Calpulli`.
4. Seleccionar `UPIICSA_Calpulli_Shared` con el selector Android.
5. Probar lectura y escritura.
6. Guardar la URI privada.
7. Inicializar el seed solo desde Gestión o mediante una acción explícita.

## Escritura segura

Antes de una mutación:

1. leer estado;
2. validar `schemaVersion`;
3. copiar el estado en memoria;
4. aplicar la operación;
5. incrementar `revision`;
6. actualizar fecha y `lastWriter`;
7. conservar backup válido;
8. escribir el nuevo estado;
9. releer;
10. validar JSON y revisión;
11. reportar éxito solo después de la verificación.

Si falla, conservar el estado válido, intentar recuperar backup y mostrar un error entendible. Nunca escribir un JSON vacío como recuperación.

## Refresco

La app pública debe releer al abrir, volver a foreground y ejecutar pull-to-refresh. Gestión debe releer antes de mostrar datos editables y después de cada mutación.

## No usar como fuente compartida

- `FileSystem.documentDirectory`;
- AsyncStorage;
- SecureStore;
- SQLite privado;
- caché de cada experiencia;
- un servidor local improvisado;
- Supabase, Firebase o API HTTP.

## Límite de producción

SAF resuelve el MVP Android offline. Antes de producción se deben reevaluar permisos persistentes, cifrado, multiusuario, transacciones, migraciones, sincronización y backend.
