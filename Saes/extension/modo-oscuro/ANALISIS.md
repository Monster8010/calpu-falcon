# Análisis del modo oscuro de SAES

## Fuente revisada

- `saes-source-snapshot/saes-page-source.html`.
- `saes-source-snapshot/assets/css/Default.css`.
- `saes-source-snapshot/assets/css/carrusel.css`.
- La arquitectura actual de `extension/src/`.

## Hallazgos visuales

El tema original usa varias superficies claras que no pueden invertirse a ciegas:

- Fondo general gris y textura.
- Contenedor principal gris claro.
- Paneles, tablas y formularios blancos.
- Laterales gris claro.
- Menús tabulares con guinda, naranja, blanco y bordes claros.
- Avisos, errores, modales y carrusel con colores propios.
- Tablas HTML anidadas para parte de la estructura visual.

El modo oscuro define una escala propia:

| Uso | Valor |
|---|---|
| Fondo | `#121212` |
| Superficie | `#1E1E1E` |
| Superficie elevada | `#252525` |
| Texto principal | `#F2F2F2` |
| Borde | `#4A4A4A` |
| Enlace | `#8EC7FF` |
| Foco | `#FFD166` |
| Acento guinda | `#8F3340` |

## Decisiones

1. El tema se activa en `html[data-saes-theme="dark"]`.
2. Se usa `color-scheme: dark` para controles nativos compatibles.
3. Los overrides se separan en CSS para poder auditarlos y ajustarlos sin tocar la navegación.
4. Se cubren `body`, columnas, menús, tablas, formularios, botones, avisos, modales, foco y carrusel.
5. Las imágenes institucionales no se invierten automáticamente.
6. Los campos ocultos de WebForms no reciben estilos de controles visibles.
7. El modo oscuro no cambia el menú responsive: solo cambia sus colores.

## Riesgos y límites

La extracción original contiene gris sobre blanco, guinda sobre fondos variables, rojo de errores y blanco sobre naranja/rosa. Cada estado real debe revisarse visualmente en enlaces, menú, botones, errores, tablas, modales y carrusel.

El snapshot representa una pantalla y recursos del cliente. No contiene el backend ni todas las respuestas `.aspx`; el módulo usa estilos defensivos y no reescribe la estructura del servidor.

## Siguiente paso

Conectar `SaesDarkMode.toggle()` a un botón o panel de configuración del alumno. Ese panel debe vivir en la UI de la extensión, no dentro de los formularios nativos de SAES.
