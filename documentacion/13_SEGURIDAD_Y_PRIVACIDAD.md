# Seguridad y privacidad

## Estado actual

El MVP usa datos ficticios y no implementa autenticación real, usuarios remotos, backend ni control de acceso productivo. La selección de rol es una simulación de capacidades para demo.

## Datos y almacenamiento

- El estado de negocio compartido vive en una carpeta SAF elegida por el usuario.
- La URI SAF es configuración privada de cada app.
- Favoritos son datos locales de la app pública.
- Medios compartidos deben copiarse a `media/` y verificarse antes de guardar su referencia.
- El backup debe conservar una versión válida anterior.

## Reglas de privacidad

- No enviar datos a APIs externas en el MVP.
- No usar `console.log` con datos personales.
- No incluir datos reales en el seed.
- No presentar datos ficticios como registros oficiales.
- No guardar información del alumno en la extensión SAES.
- No usar `localStorage` de SAES para datos del alumno; solo preferencias no sensibles si aplica.

## SAES

La extensión debe conservar `href`, formularios, postbacks, campos ocultos, `__VIEWSTATE` y `__EVENTVALIDATION`. Solo modifica presentación y accesibilidad.

## Riesgos para producción

Antes de una publicación real se requiere diseñar:

- autenticación y autorización;
- cifrado;
- aislamiento por usuario y rol;
- auditoría;
- gestión de secretos;
- sincronización segura;
- protección contra corrupción y concurrencia;
- política de privacidad;
- retención y eliminación de datos;
- revisión legal e institucional.
