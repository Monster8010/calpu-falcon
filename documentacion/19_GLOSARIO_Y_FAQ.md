# Glosario y FAQ

## Glosario

| Término | Significado |
|---|---|
| Calpulli | Proyecto digital universitario para la comunidad UPIICSA. |
| Gestión | App que modifica el estado compartido y demuestra roles. |
| SAF | Storage Access Framework de Android para elegir una carpeta compartida. |
| SharedStore | Capa que lee, valida, escribe y respalda el estado compartido. |
| Seed | Datos ficticios iniciales para demostración. |
| Revisión | Número que identifica una versión del estado compartido. |
| Feria | Edición de Feria de Emprendimiento. |
| Stand | Mesa de una feria. |
| Marketplace | Catálogo de descubrimiento sin compra ni pago. |
| Favoritos | Estado privado de la app pública. |
| Rol demo | Perfil simulado; no es autenticación. |
| SAES | Portal académico observado para la extensión visual relacionada. |
| Web Forms | Tecnología ASP.NET visible en el HTML de SAES. |

## Preguntas frecuentes

### ¿Calpulli tiene backend?

No en el MVP. Las apps comparten un directorio SAF local del mismo Android.

### ¿La app pública tiene login?

No. La consulta abre sin cuenta una vez conectado el almacenamiento.

### ¿Gestión tiene seguridad por rol?

No. Tiene selector de roles para demo. No debe presentarse como control de acceso productivo.

### ¿Por qué no usar AsyncStorage para compartir datos?

Cada app tiene almacenamiento privado aislado. AsyncStorage solo sirve para estado privado, como Favoritos o la URI SAF.

### ¿Marketplace permite comprar?

No. Solo descubre productos, perfiles y contactos externos.

### ¿Las tutorías incluyen chat o agenda?

No. El contacto sale de Calpulli.

### ¿La extensión SAES modifica datos del alumno?

No. Cambia presentación y accesibilidad, conserva enlaces, formularios, postbacks y campos ocultos.

### ¿Un APK demuestra que el proyecto está listo?

No. También se requiere aceptación manual en Android y verificación de interoperabilidad entre dos binarios.

### ¿Qué nombre debe usarse?

La documentación técnica usa `UPIICSA Calpulli`. La variante `Calpolli` sigue pendiente de confirmación oficial.
