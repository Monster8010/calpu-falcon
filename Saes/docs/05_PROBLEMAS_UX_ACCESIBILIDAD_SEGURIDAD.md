# Problemas, accesibilidad y seguridad

## 1. Hallazgo crítico: error de servidor ETS

Ruta afectada:

```text
/Alumnos/ETS/default.aspx
```

La página mostró una pantalla de error de ASP.NET con:

- `System.Data.ConstraintException`.
- Mensaje sobre restricciones `NON-NULL`, `UNIQUE` o `FOREIGN-KEY`.
- Seguimiento de pila completo.
- Versión de Microsoft .NET Framework 2.0.
- Versión de ASP.NET 2.0.
- Ruta interna de `Temporary ASP.NET Files`.
- Archivo temporal y línea de código fuente.

### Impacto

- Confunde al alumno.
- Revela información interna del servidor.
- Expone detalles de implementación.
- Puede provocar pérdida de confianza.

### Mitigación visual de la extensión

1. Detectar texto de error conocido.
2. Ocultar el contenido técnico.
3. Insertar un panel amigable:
   - `ETS no está disponible en este momento.`
   - `El sistema devolvió un error interno.`
   - `Intenta más tarde o contacta a Gestión Escolar.`
4. Mantener un botón para recargar.
5. No enviar el stack trace a ningún servicio.

La extensión no corrige el origen de base de datos; solo mejora la presentación y reduce exposición visual.

## 2. Problemas de experiencia

### P1 — Layout fijo

El contenido está diseñado para escritorio y puede desbordarse en pantallas pequeñas.

**Solución:** contenedor fluido, menú colapsable, tablas adaptables y breakpoints.

### P1 — Menú lateral extenso

El alumno debe recorrer muchos enlaces con jerarquía visual mínima.

**Solución:** agrupar por módulos, permitir colapsar secciones, fijar acciones frecuentes y añadir búsqueda local.

### P1 — Tablas densas

Kárdex y Estado General tienen muchas columnas y texto pequeño.

**Solución:** filtros, encabezado fijo, columnas prioritarias, vista de tarjetas en móvil y leyenda.

### P2 — Estados vacíos débiles

Horario, calificaciones, citas, pase digital y algunos índices muestran paneles casi vacíos o mensajes poco explicativos.

**Solución:** componente estándar de estado vacío con icono, explicación y siguiente acción.

### P2 — Acciones poco diferenciadas

Botones informativos, de navegación y de envío usan estilos inconsistentes.

**Solución:** sistema de botones: primario, secundario, peligro, descarga y regreso.

### P2 — Uso excesivo de imágenes decorativas

Algunas pantallas usan imágenes grandes como elemento principal o fondo.

**Solución:** conservarlas como contenido institucional, reducir espacio ocupado y priorizar información accionable.

## 3. Accesibilidad

### Problemas probables observados

- Texto pequeño.
- Estado activo dependiente del color.
- Tablas difíciles de navegar en móvil.
- Botones con texto ambiguo como `» más`.
- Iconos de descarga que pueden carecer de texto accesible.
- Mensajes centrados sin jerarquía semántica clara.
- Paneles con bordes sin relación clara con un encabezado.

### Requisitos de la extensión

- Contraste WCAG AA como mínimo.
- Foco visible.
- Navegación completa con teclado.
- `aria-current` para navegación activa.
- `aria-label` en iconos.
- Encabezados reales (`h1`, `h2`, `h3`).
- Tablas con `caption`, `thead`, `th` y asociaciones correctas.
- No transmitir significado solo mediante color.
- Respetar `prefers-reduced-motion`.
- Mantener zoom del navegador funcional.

## 4. Privacidad

La extensión tendrá acceso a páginas autenticadas y debe seguir estas reglas:

- No usar analítica remota.
- No enviar HTML a APIs externas.
- No almacenar credenciales.
- No leer cookies directamente.
- No registrar nombres, boletas, CURP, RFC o calificaciones en consola de producción.
- Limpiar logs de desarrollo antes de publicar.
- Procesar todo localmente.
- Explicar permisos en la interfaz de configuración.

## 5. Compatibilidad funcional

La extensión no debe:

- Cambiar `href` originales.
- Eliminar inputs ocultos.
- Renombrar campos de formulario.
- Interceptar postbacks sin necesidad.
- Seleccionar opciones automáticamente.
- Enviar formularios.
- Descargar archivos sin clic del usuario.
- Cambiar la sesión.
- Ocultar un error sin dejar una opción de recarga.

## 6. Control de cambios del sitio

SAES puede cambiar estructura, por lo que los selectores deben ser tolerantes:

- Preferir texto de encabezado y `location.pathname`.
- Buscar tablas por encabezados.
- Usar selectores alternativos.
- Verificar que el nodo exista antes de modificarlo.
- Evitar selectores basados solo en índices.
- Añadir un modo degradado si no se reconoce una pantalla.

## 7. Registro interno recomendado

Para desarrollo local puede usarse un prefijo controlado:

```js
const debug = false;

function log(...args) {
  if (debug) console.debug('[SAES UI]', ...args);
}
```

Debe estar desactivado en producción.
