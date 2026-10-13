# Pruebas y aceptación

## Regla de evidencia

Un test automatizado, una inspección estática o un bundle correcto prueban lógica o compilación. No sustituyen la prueba manual en Expo Go sobre Android.

## Comandos

```bash
npm run typecheck
npm test
```

También existe evidencia de export Android y resolución de rutas en `docs/13_STAGE_18_ACCEPTANCE_REPORT.md`.

## Matriz de escenarios

| Bloque | Escenarios |
|---|---|
| A. Storage | Conectar carpeta, operar sin red, URI inválida, JSON dañado. |
| B. Feed | Crear, editar, ocultar ubicación, prioridad urgente, Favoritos y persistencia local. |
| C. Departamentos | Filtrar, ver todos, expirar historia y manejar muchos departamentos. |
| D. Feria | Countdown, cambiar fecha, activar, geometría de 40 mesas y mesa disponible. |
| E. Solicitud | Solicitar, impedir autoaprobación, aprobar, reflejar públicamente y liberar. |
| F. Marketplace | Editar producto, desactivar y abrir perfil. |
| G. Tutorías | Editar materia, desactivar tutor y abrir contacto externo. |
| H. Moderación | Ocultar, restaurar y publicar libremente desde Departamento. |
| I. Roles | Cambiar los seis perfiles sin mezclar estado. |
| J. Tema | Verificar claro, oscuro y sistema. |
| K. Presentación | Completar el recorrido principal sin red. |

## Puerta de aprobación

Antes de declarar lista una entrega, registrar:

- comando ejecutado;
- fecha;
- resultado;
- entorno;
- evidencia;
- casos manuales pendientes;
- responsable de la validación.

## Aceptación física pendiente

El reporte de Etapa 18 indica que no había emulador ni dispositivo Android disponible para ejecutar A1–H3 manualmente. Esa limitación debe permanecer visible hasta completar la prueba en Expo Go.

## Condiciones de fallo crítico

No avanzar a APK si:

- las apps usan carpetas distintas;
- la revisión compartida no coincide;
- una mutación desaparece después de refrescar;
- el backup no recupera JSON dañado;
- el mapa no contiene 40 mesas;
- el emprendedor puede autoaprobar;
- existe crash, ruta rota, warning de keys o contenido ilegible en un tema.
