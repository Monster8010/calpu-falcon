# 00 — LEER PRIMERO

## Qué estamos construyendo

UPIICSA Calpulli es un ecosistema local compuesto por dos aplicaciones React Native/Expo que operan juntas en un mismo dispositivo Android.

### App A — UPIICSA Calpulli
Aplicación pública de consulta para alumnado. No tiene login ni perfil de estudiante.

### App B — Gestión UPIICSA Calpulli
Aplicación que modifica los datos que consume App A. Para la demostración no tiene login: permite seleccionar directamente distintos perfiles/roles.

## Decisión arquitectónica obligatoria

La fuente de verdad del MVP será **un almacenamiento compartido local del dispositivo**, sin red.

Las dos apps deberán apuntar al mismo directorio seleccionado mediante Android Storage Access Framework (SAF).

Directorio recomendado para la demostración:

`Documents/UPIICSA_Calpulli_Shared/`

No asumir que ambas apps pueden compartir `FileSystem.documentDirectory`, AsyncStorage o SQLite privado. Esos mecanismos pertenecen al sandbox de cada experiencia/aplicación y no deben ser la fuente interoperable.

## Primera ejecución

Cada app debe tener un flujo de configuración:

1. Detectar si ya tiene guardada una URI SAF válida.
2. Si no existe, mostrar `Conectar almacenamiento Calpulli`.
3. Abrir el selector Android de directorios.
4. Pedir al presentador seleccionar la misma carpeta `UPIICSA_Calpulli_Shared`.
5. Guardar la URI SAF en almacenamiento privado de esa app.
6. Verificar lectura y escritura.
7. Si el estado compartido no existe, inicializarlo únicamente desde Gestión o mediante una acción explícita de inicialización.
8. UPIICSA Calpulli nunca debe sobrescribir datos administrativos salvo campos que explícitamente le correspondan; los Favoritos no viven en el store compartido.

## Meta de la demo

Debe ser posible:

1. Abrir Gestión.
2. Crear/modificar una publicación institucional.
3. Abrir UPIICSA Calpulli.
4. Refrescar y ver la modificación sin internet.
5. Modificar fecha/estado de feria.
6. Solicitar un stand como emprendedor.
7. Aprobarlo como Administrador de Feria.
8. Abrir la app pública y ver el emprendimiento sobre la mesa asignada.
9. Modificar Marketplace o Tutorías y observar el cambio.
10. Guardar Favoritos en la app pública sin alterar los datos compartidos.

## Prioridad

Para hoy:

**funcionalidad estable > diseño perfecto > animaciones > extras**

La interfaz debe verse profesional, pero nunca romper funcionalidad para incorporar un detalle visual.
